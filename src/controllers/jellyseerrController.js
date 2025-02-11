const logger = require('../utils/logger');
const { fetchMovieDetailsByTmdbId, fetchTvshowDetailsByTmdbId } = require('../services/tmdbService');
const { sendMessage } = require('../services/telegramService');

async function handleJellySeerrWebhook(req, res) {
    const payload = req.body;
    if (!payload) {
        logger.error("🔴 Le payload est manquant dans la requête JellySeerr.");
        return res.status(400).send("Le payload est manquant.");
    }

    logger.log("📩 Réception d'un webhook JellySeerr");

    const { notification_type, media } = payload;
    if (notification_type !== 'MEDIA_AVAILABLE') {
        return res.sendStatus(200); // Ignorer les autres événements
    }

    if (!media || !media.tmdbId || !media.media_type) {
        logger.error('🔴 Les détails de l\'élément sont manquants dans le payload.');
        return res.status(400).send('Les détails de l\'élément sont manquants.');
    }

    const { tmdbId: ID, media_type: type } = media;
    let details;
    try {
        if (type.toLowerCase() === 'movie') {
            details = await fetchMovieDetailsByTmdbId(ID);
        } else if (type.toLowerCase() === 'tvshow') {
            details = await fetchTvshowDetailsByTmdbId(ID);
        } else {
            logger.error(`🔴 Type de média non pris en charge : ${type}`);
            return res.status(400).send('Type de média non pris en charge.');
        }

        if (!details) {
            logger.error(`🔴 Aucun détail trouvé pour le titre : ${ID}`);
            return res.status(404).send('Détails non trouvés.');
        }

        await sendMessage(details, type.toLowerCase() === 'movie' ? 'Film' : 'Série');
        res.sendStatus(200);
    } catch (serviceError) {
        logger.error(`🔴 Erreur lors du traitement de ${type} ${ID} :`, serviceError);
        res.status(500).send('Erreur lors du traitement des détails du média.');
    }
}

module.exports = { handleJellySeerrWebhook };
