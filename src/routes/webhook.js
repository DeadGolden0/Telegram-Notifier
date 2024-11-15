/**
 * Express router to handle webhook events.
 * @module routes/webhook
 */

const express = require('express');
const logger = require('../utils/logger');
const multer = require('multer');
const { fetchMovieDetails } = require('../services/tmdbService');
const { sendMessage } = require('../services/telegramService');

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
    try {
        const { payload } = req.body;
        if (!payload) {
            logger.error('🔴 Payload is missing in the request body.');
            return res.status(400).send('Payload is missing.');
        }

        let parsedPayload;
        try {
            parsedPayload = JSON.parse(payload);
        } catch (parseError) {
            logger.error('🔴 Failed to parse payload:', parseError);
            return res.status(400).send('Invalid payload format.');
        }

        const { event, Metadata } = parsedPayload;
        if (event !== 'library.new') {
            return res.sendStatus(200); // Ignore other events
        }

        if (!Metadata || !Metadata.title) {
            logger.error('🔴 Metadata or title is missing in the payload.');
            return res.status(400).send('Metadata or title is missing.');
        }

        const { title, type } = Metadata;
        let details;
        try {
            if (type === 'movie') {
                details = await fetchMovieDetails(title);
            } else if (type === 'show') {
                details = await fetchTvshowDetails(title);
            } else {
                logger.error(`🔴 Unsupported media type: ${type}`);
                return res.status(400).send('Unsupported media type.');
            }

            if (!details) {
                logger.error(`🔴 No details found for title: ${title}`);
                return res.status(404).send('Details not found.');
            }

            await sendMessage(details, type === 'movie' ? 'Film' : 'Série');
            res.sendStatus(200);
        } catch (serviceError) {
            logger.error(`🔴 Error while processing ${type} ${title}:`, serviceError);
            res.status(500).send('Error processing media details.');
        }
    } catch (error) {
        logger.error('🔴 Unexpected error occurred:', error);
        res.status(500).send('An unexpected error occurred.');
    }
});

module.exports = router;