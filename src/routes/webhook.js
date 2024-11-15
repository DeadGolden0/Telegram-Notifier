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
    try {
        // Parse the payload
        if (!req.body.payload) {
            logger.error('🔴 Payload is missing in the request body.');
            return res.status(400).send('Payload is missing.');
        }

        let payload;
        try {
            payload = JSON.parse(req.body.payload);
        } catch (parseError) {
            logger.error('🔴 Failed to parse payload:', parseError);
            return res.status(400).send('Invalid payload format.');
        }

        // Handle only 'library.new' events
        if (payload.event === 'library.new') {
            if (!payload.Metadata || !payload.Metadata.title) {
                logger.error('🔴 Metadata or title is missing in the payload.');
                return res.status(400).send('Metadata or title is missing.');
            }

            try {
                // Fetch movie details and send message
                const movieDatas = await fetchMovieDetails(payload.Metadata.title);
                if (!movieDatas) {
                    logger.error(`🔴 No movie details found for title: ${payload.Metadata.title}`);
                    return res.status(404).send('Movie details not found.');
                }

                await sendMovieMessage(movieDatas);
                res.sendStatus(200);
            } catch (serviceError) {
                logger.error(`🔴 Error while processing movie ${payload.Metadata.title}:`, serviceError);
                res.status(500).send('Error processing movie details.');
            }
        } else {
            res.sendStatus(200); // Ignore other events
        }
    } catch (error) {
        logger.error('🔴 Unexpected error occurred:', error);
        res.status(500).send('An unexpected error occurred.');
    }
});

module.exports = router;