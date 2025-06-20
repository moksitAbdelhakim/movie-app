const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * Fetches popular movies from the API.
 * @param {string} endpoint - The API endpoint.
 * @param {object} options - Fetch options, including signal for aborting.
 * @returns {Promise<object>} The JSON response.
 * @throws {Error} If the fetch fails or response is not ok.
 */
export const fetchPopularMovies = async (endpoint, { signal }) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, { signal, ...options });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

/**
 * Fetches movies from the API based on a search term.
 * @param {string} searchTerm - The user's search query.
 * @param {object} options - Fetch options, including signal for aborting.
 * @returns {Promise<object>} The JSON response.
 * @throws {Error} If the fetch fails or response is not ok.
 */
export const fetchMoviesBySearch = async (searchTerm, { signal }) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      searchTerm
    )}&include_adult=false&include_video=false&language=en-US&page=1`,
    { signal, ...options }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};
