const logger = require('../utils/logger');
const { fetchMovieDetailsByName, fetchTvshowDetailsByName } = require('../services/tmdbService');
const { sendMessage } = require('../services/telegramService');

/**
 * Gère les événements de webhook entrants de Jellyfin/Emby.
 *
 * @async
 * @function handleJellyfinWebhook
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Corps de la requête contenant le payload.
 * @param {Object} res - Objet de réponse Express.
 * @returns {Promise<void>}
 * @throws {Error} Génère une erreur si le traitement du webhook échoue.
 */
async function handleJellyfinWebhook(req, res) {
    const payload = req.body;
    if (!payload) {
        logger.error('🔴 Le payload est manquant dans le corps de la requête.');
        return res.status(400).send('Le payload est manquant.');
    }

    const { NotificationType, Item } = payload;
    if (NotificationType !== 'ItemAdded') {
        return res.sendStatus(200); // Ignorer les autres événements
    }

    if (!Item || !Item.Name || !Item.Type) {
        logger.error('🔴 Les détails de l\'élément sont manquants dans le payload.');
        return res.status(400).send('Les détails de l\'élément sont manquants.');
    }

    const { Name: title, Type: type } = Item;
    let details;
    try {
        if (type.toLowerCase() === 'movie') {
            details = await fetchMovieDetailsByName(title);
        } else if (type.toLowerCase() === 'series') {
            details = await fetchTvshowDetailsByName(title);
        } else {
            logger.error(`🔴 Type de média non pris en charge : ${type}`);
            return res.status(400).send('Type de média non pris en charge.');
        }

        if (!details) {
            logger.error(`🔴 Aucun détail trouvé pour le titre : ${title}`);
            return res.status(404).send('Détails non trouvés.');
        }

        await sendMessage(details, type.toLowerCase() === 'movie' ? 'Film' : 'Série');
        res.sendStatus(200);
    } catch (serviceError) {
        logger.error(`🔴 Erreur lors du traitement de ${type} ${title} :`, serviceError);
        res.status(500).send('Erreur lors du traitement des détails du média.');
    }
}

module.exports = { handleJellyfinWebhook };