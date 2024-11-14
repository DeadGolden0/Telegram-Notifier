
/**
 * @fileoverview Main application file for Bobyland-Notifier.
 * @requires express
 * @requires ./config
 * @requires ./routes/webhook
 */

const express = require('express');
const { port } = require('./config');
const webhookRoute = require('./routes/webhook');
const logger = require('./utils/logger');

const app = express();

/**
 * Middleware to parse JSON bodies.
 */
app.use(express.json());

/**
 * Route for handling webhook requests.
 * @name /webhook
 * @function
 * @memberof module:app
 * @inner
 */
app.use('/webhook', webhookRoute);

/**
 * Route to check server status.
 * @name /ping
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {string} Pong - Response to indicate server is running.
 */
app.get('/ping', (req, res) => res.send("Pong"));

/**
 * Starts the server and listens on the specified port.
 * @function
 * @memberof module:app
 * @inner
 * @param {number} port - The port number to listen on.
 */
app.listen(port, () => logger.ready(`🚀 Serveur à l'écoute sur le port ${port}`));