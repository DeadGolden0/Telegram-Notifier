/**
 * Express router to handle webhook events.
 * @module routes/webhook
 */

const express = require('express');
const logger = require('../utils/logger');
const multer = require('multer');
const { fetchMovieDetails, fetchTvshowDetails } = require('../services/tmdbService');
const { sendMessage } = require('../services/telegramService');
const { serviceType } = require('../config');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
            details = await fetchMovieDetails(title);
        } else if (type === 'show') {
            details = await fetchTvshowDetails(title);
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
            details = await fetchMovieDetails(title);
        } else if (type.toLowerCase() === 'series') {
            details = await fetchTvshowDetails(title);
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

/**
 * Route principale pour gérer les webhooks entrants.
 * Sélectionne le gestionnaire approprié en fonction du service configuré (Plex ou Jellyfin/Emby).
 *
 * @name POST /webhook
 * @function
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 * @throws {Error} Génère une erreur si un service non pris en charge est configuré ou si une erreur inattendue se produit.
 */
router.post('/', upload.single('thumb'), async (req, res) => {
    try {
        if (serviceType === 'plex') {
            await handlePlexWebhook(req, res);
        } else if (serviceType === 'jellyfin') {
            await handleJellyfinWebhook(req, res);
        } else {
            logger.error('🔴 Type de service non pris en charge dans la configuration.');
            res.status(400).send('Type de service non pris en charge.');
        }
    } catch (error) {
        logger.error('🔴 Une erreur inattendue est survenue :', error);
        res.status(500).send('Une erreur inattendue est survenue.');
    }
});


module.exports = router;