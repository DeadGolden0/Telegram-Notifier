function getGenreMovieName(id) {
    const genres = {
        28: "Action",
        12: "Aventure",
        16: "Animation",
        35: "Comédie",
        80: "Crime",
        99: "Documentaire",
        18: "Drame",
        10751: "Familial",
        14: "Fantastique",
        36: "Histoire",
        27: "Horreur",
        10402: "Musique",
        9648: "Mystère",
        10749: "Romance",
        878: "Science-Fiction",
        10770: "Téléfilm",
        53: "Thriller",
        10752: "Guerre",
        37: "Western",
    };
    return genres[id] || "Inconnu";
}

function getGenreTvName(id) {
    const genres = {
        10759: "Action & Aventure",
        16: "Animation",
        35: "Comédie",
        80: "Crime",
        99: "Documentaire",
        18: "Drame",
        10751: "Familial",
        10762: "Enfants",
        9648: "Mystère",
        10763: "Actualités",
        10764: "Réalité",
        10765: "Science-Fiction & Fantastique",
        10766: "Feuilleton",
        10767: "Talk-show",
        10768: "Guerre & Politique",
        37: "Western"
    };
    return genres[id] || "Inconnu";
}

module.exports = { getGenreMovieName, getGenreTvName };
