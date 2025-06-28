import fetch from "node-fetch";

/**
 * API Route: /api/search
 * Handles movie search requests by querying the TMDB API.
 *
 * @param {import('vercel').VercelRequest} req - The HTTP request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {import('vercel').VercelResponse} res - The HTTP response object.
 */

export default async function handler(req, res) {
  try {
    //  Validate and sanitize input
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing or invalid query parameter",
      });
    }

    // Fetch from TMDB API
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Error fetching data from TMDB:",
        response.status,
        errorText
      );
      return res.status(response.status).json({
        error: "Error fetching data from TMDB",
        message: response.statusText,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /api/search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
