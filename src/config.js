require('dotenv').config();

/**
 * @module config
 * @property {number} port - The port number on which the server will run. Defaults to 8100 if not specified in the environment variables.
 * @property {string} telegramToken - The token for accessing the Telegram Bot API.
 * @property {string} telegramChatId - The chat ID for the Telegram bot to send messages to.
 * @property {string} tmdbApiKey - The API key for accessing The Movie Database (TMDB) API.
 */
module.exports = {
    port: process.env.PORT || 8100,
    telegramToken: process.env.TELEGRAM_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    tmdbApiKey: process.env.TMDB_API_KEY,
    serviceType: process.env.SERVICE_TYPE
};