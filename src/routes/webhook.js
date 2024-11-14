const express = require('express');
const logger = require('../utils/logger');
const { fetchMovieDetails } = require('../services/tmdbService');
const { sendMovieMessage } = require('../services/telegramService');

const router = express.Router();

router.post('/', async (req, res) => {
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