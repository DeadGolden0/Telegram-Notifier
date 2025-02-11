const logger = require('../utils/logger');
const { fetchMovieDetailsByName, fetchTvshowDetailsByName } = require('../services/tmdbService');
const { sendMessage } = require('../services/telegramService');

/**
 * Gère les événements de webhook entrants de Plex.
 *
 * @async
 * @function handlePlexWebhook
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Corps de la requête contenant le payload.
 * @param {string} req.body.payload - Payload contenant les données de l'événement.
 * @param {Object} res - Objet de réponse Express.
 * @returns {Promise<void>}
 * @throws {Error} Génère une erreur si le traitement du webhook échoue.
 */
async function handlePlexWebhook(req, res) {
    const { payload } = req.body;
    if (!payload) {
        logger.error('🔴 Le payload est manquant dans le corps de la requête.');
        return res.status(400).send('Le payload est manquant.');
    }

    let parsedPayload;
    try {
        parsedPayload = JSON.parse(payload);
    } catch (parseError) {
        logger.error('🔴 Échec de l\'analyse du payload :', parseError);
        return res.status(400).send('Format de payload invalide.');
    }

    const { event, Metadata } = parsedPayload;
    if (event !== 'library.new') {
        return res.sendStatus(200); // Ignorer les autres événements
    }

    if (!Metadata || !Metadata.title) {
        logger.error('🔴 Les métadonnées ou le titre sont manquants dans le payload.');
        return res.status(400).send('Les métadonnées ou le titre sont manquants.');
    }

    const { title, type } = Metadata;
    let details;
    try {
        if (type === 'movie') {
            details = await fetchMovieDetailsByName(title);
        } else if (type === 'show') {
            details = await fetchTvshowDetailsByName(title);
        } else {
            logger.error(`🔴 Type de média non pris en charge : ${type}`);
            return res.status(400).send('Type de média non pris en charge.');
        }

        if (!details) {
            logger.error(`🔴 Aucun détail trouvé pour le titre : ${title}`);
            return res.status(404).send('Détails non trouvés.');
        }

        await sendMessage(details, type === 'movie' ? 'Film' : 'Série');
        res.sendStatus(200);
    } catch (serviceError) {
        logger.error(`🔴 Erreur lors du traitement de ${type} ${title} :`, serviceError);
        res.status(500).send('Erreur lors du traitement des détails du média.');
    }
}

module.exports = { handlePlexWebhook };