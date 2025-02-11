const logger = require('../utils/logger');
const { getGenreMovieName } = require('../utils/genreUtils');
const { getGenreTvName } = require('../utils/genreUtils');

/**
 * Sends a message with a movie poster to a Telegram chat.
 *
 * @param {Object} movieDatas - The movie object containing details about the movie.
 * @param {string} movieDatas.poster_path - The path to the movie's poster image.
 * @param {string} text - The text message to send along with the movie poster.
 * @returns {Promise} - A promise that resolves when the message has been sent.
 */
const { Bot } = require('grammy');
const { telegramToken, telegramChatId } = require('../config');

const bot = new Bot(telegramToken);

async function sendMessage(movieDatas, type) {
    const imageUrl = await getPoster(movieDatas.poster_path);
    const description = await getDesc(movieDatas, type);
    try {
        await bot.api.sendPhoto(telegramChatId, imageUrl, {
            caption: description,
            parse_mode: 'Markdown'
        });
        logger.success(`🟢 Message envoyé à Telegram pour le film : ${type === 'Film' ? movieDatas.title : movieDatas.name}`);
    } catch (error) {
        logger.error(`🔴 Erreur lors de l\'envoi du message à Telegram pour le film ${type === 'Film' ? movieDatas.title : movieDatas.name}:`, error);
    }
}

async function getPoster(path) {
    return `https://image.tmdb.org/t/p/w500${path}`;
}

async function getDesc(movieDatas, type) {
    const formattedDate = new Date(type === 'Film' ? movieDatas.release_date : movieDatas.first_air_date).toLocaleDateString('fr-FR');

    const truncatedOverview = movieDatas.overview.length > 500 
    ? movieDatas.overview.slice(0, 500) + '...' 
    : movieDatas.overview;


    const text = `
🎬 *Nouveautés sur la TV DE MAITRE BOBY* 🎬

🎥 *Titre:* ${type === 'Film' ? movieDatas.title : movieDatas.name}
🎥 *Type:* ${type}
⭐ *Note:* ${movieDatas.vote_average.toFixed(1)}/10
📅 *Date de sortie:* ${formattedDate}
🎞 *Genre:* ${movieDatas.genres.map(genre => genre.name).join(', ')}

🎭 *Synopsis:* 

${truncatedOverview}

👀 *Ne ratez pas cette occasion de (re)découvrir ce chef-d'oeuvre !* #NouveautéSurPlex
    `;
    return text;
}

module.exports = { sendMessage };
