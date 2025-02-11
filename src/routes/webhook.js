/**
 * Express router to handle webhook events.
 * @module routes/webhook
 */

const express = require('express');
const multer = require('multer');
const logger = require('../utils/logger');
const { serviceType } = require('../config');
const { handlePlexWebhook } = require('../controllers/plexController');
const { handleJellyfinWebhook } = require('../controllers/jellyfinController');
const { handleJellySeerrWebhook } = require('../controllers/jellyseerrController');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


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
        if (serviceType === 'Plex') {
            await handlePlexWebhook(req, res);
        } else if (serviceType === 'Jellyfin') {
            await handleJellyfinWebhook(req, res);
        } else if (serviceType === 'Jellyseerr') {
            await handleJellySeerrWebhook(req, res);
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