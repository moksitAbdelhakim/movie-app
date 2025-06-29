const BACKEND_URL_BASE = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetches the list of popular movies from the backend API.
 *
 * @param {Object} [options] - An object containing a signal property
 * @param {AbortSignal} [options.signal] - Optional abort signal for cancellation.
 * @returns {Promise<Object>} The JSON response from the backend.
 * @throws {Error} If the response is not ok.
 */
export const fetchPopularMovies = async (page, { signal }) => {
  const response = await fetch(`${BACKEND_URL_BASE}/popular?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching popular movies:", response.status, errorText);
    throw new Error("Failed to fetch popular movies");
  }
  return response.json();
};

export const searchMovies = async (searchTerm, page, { signal }) => {
  const response = await fetch(`${BACKEND_URL_BASE}/search?query=${encodeURIComponent(searchTerm)}&page=${page}`, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching movies by search:", response.status, errorText);
    throw new Error("Failed to fetch searched movies");
  }
  return response.json();
};

export const fetchTrendingMovies = async ({ signal }) => {
  const response = await fetch(`${BACKEND_URL_BASE}/trending`, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching trending movies:", response.status, errorText);
    throw new Error("Failed to fetch trending movies");
  }
  return response.json();
};

export const logSearchTerm = async (searchTerm, movie) => {
  const response = await fetch(`${BACKEND_URL_BASE}/updateSearch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchTerm,
      movie,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error updating search term:", response.status, errorText);
    throw new Error("Failed to update search term");
  }
  return response.json();
};
