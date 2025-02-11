const axios = require('axios');
const { tmdbApiKey, tmdbLanguage } = require('../config');

/**
 * Fetches movie details from The Movie Database (TMDB) based on the provided title.
 *
 * @param {string} title - The title of the movie to search for.
 * @returns {Promise<Object>} A promise that resolves to the movie details object.
 * @throws {Error} If no movie is found with the given title.
 */
async function fetchMovieDetailsByName(title) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&language=${tmdbLanguage}&api_key=${tmdbApiKey}`;
    const response = await axios.get(url);
    if (response.data.results.length === 0) throw new Error("Aucun film trouvé sur TMDB");
    return response.data.results[0];
}

/**
 * Fetches TV show details from The Movie Database (TMDB) based on the provided title.
 *
 * @param {string} title - The title of the TV show to search for.
 * @returns {Promise<Object>} A promise that resolves to the TV show details object.
 * @throws {Error} If no TV show is found with the given title.
 */
async function fetchTvshowDetailsByName(title) {
    const url = `https://api.themoviedb.org/3/search/tv?query=${title}&language=${tmdbLanguage}&api_key=${tmdbApiKey}`;
    const response = await axios.get(url);
    if (response.data.results.length === 0) throw new Error("Aucune série trouvé sur TMDB");
    return response.data.results[0];
}

/**
 * Fetches movie details from The Movie Database (TMDB) based on the provided TMDB ID.
 *
 * @param {number} movieId - The TMDB ID of the movie.
 * @returns {Promise<Object>} A promise that resolves to the movie details object.
 * @throws {Error} If no movie is found with the given ID.
 */
async function fetchMovieDetailsByTmdbId(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=${tmdbLanguage}&api_key=${tmdbApiKey}`;
    const response = await axios.get(url);
    if (!response.data) throw new Error("Aucun film trouvé sur TMDB");
    return response.data;
}

/**
 * Fetches TV show details from The Movie Database (TMDB) based on the provided TMDB ID.
 *
 * @param {number} tvId - The TMDB ID of the TV show.
 * @returns {Promise<Object>} A promise that resolves to the TV show details object.
 * @throws {Error} If no TV show is found with the given ID.
 */
async function fetchTvshowDetailsByTmdbId(tvId) {
    const url = `https://api.themoviedb.org/3/tv/${tvId}?language=${tmdbLanguage}&api_key=${tmdbApiKey}`;
    const response = await axios.get(url);
    if (!response.data) throw new Error("Aucune série trouvée sur TMDB");
    return response.data;
}

module.exports = { 
    // By Name
    fetchMovieDetailsByName, fetchTvshowDetailsByName, 
    // By ID
    fetchMovieDetailsByTmdbId, fetchTvshowDetailsByTmdbId 
};