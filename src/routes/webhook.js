/**
 * Express router to handle webhook events.
 * @module routes/webhook
 */

const express = require('express');
const logger = require('../utils/logger');
const multer = require('multer');
const { fetchMovieDetails } = require('../services/tmdbService');
const { sendMovieMessage } = require('../services/telegramService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /webhook
 * Handles incoming webhook events from Plex.
 * 
 * @name POST /webhook
 * @function
 * @memberof module:routes/webhook
 * @param {Object} req - Express request object
 * @param {Object} req.body - The body of the request
 * @param {string} req.body.payload - The payload containing event data
 * @param {Object} res - Express response object
 * @returns {void}
 * @throws Will throw an error if there is an issue sending the message to Telegram
 */
router.post('/', upload.single('thumb'), async (req, res) => {
    var payload = JSON.parse(req.body.payload);

    if (payload.event === 'library.new') {
        try {
            const movieDatas = await fetchMovieDetails(payload.Metadata.title);
    
            await sendMovieMessage(movieDatas);
            res.sendStatus(200);
        } catch (error) {
            logger.error(`🔴 Erreur lors de l\'envoi du message à Telegram pour le film ${movieDatas.title}:`, error);
            res.status(500).send('Erreur lors de l\'envoi du message');
        }
    } else {
        res.sendStatus(200);
    }
});

module.exports = router;