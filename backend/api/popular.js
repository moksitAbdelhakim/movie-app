import fetch from "node-fetch";

/**
 * API Route: /api/popular
 * Fetches popular movies from TMDB and returns them to the client.
 * @param {import('vercel').VercelRequest} req
 * @param {import('vercel').VercelResponse} res
 */
export default async function handler(req, res) {
  try {
    // Allow only authorized origin and GET requests
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    // Validate and sanitize input
    const page = parseInt(req.query.page, 10);
    if (!page || isNaN(page) || page < 1 || page > 50) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid page number.",
      });
    }
    // Fetch popular movies from TMDB API
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    if (!response.ok) {
      // Log TMDB error details
      const errorText = await response.text();
      console.error("TMDB API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Error fetching data from TMDB",
        message: response.statusText,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /api/popular:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
