/**
 * Fetches movie details from The Movie Database (TMDB) based on the provided title.
 *
 * @param {string} title - The title of the movie to search for.
 * @returns {Promise<Object>} A promise that resolves to the movie details object.
 * @throws {Error} If no movie is found with the given title.
 */
const axios = require('axios');
const { tmdbApiKey } = require('../config');

async function fetchMovieDetails(title) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&language=fr-FR&api_key=${tmdbApiKey}`;
    const response = await axios.get(url);
    if (response.data.results.length === 0) throw new Error("Aucun film trouvé sur TMDB");
    return response.data.results[0];
}

module.exports = { fetchMovieDetails };
