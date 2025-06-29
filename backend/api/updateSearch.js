import { Client, Databases, ID, Query } from "appwrite";

const { APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } = process.env;

const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(APPWRITE_PROJECT_ID);
const database = new Databases(client, APPWRITE_DATABASE_ID);

/**
 * Handles POST requests to the /api/updateSearch endpoint.
 * This function updates the search term in the database, either by incrementing the count of an
 * existing document or creating a new one.
 *
 * @param {import('vercel').VercelRequest} req - The HTTP request object.
 * @param {Object} req.body - The body of the request.
 * @param {import('vercel').VercelResponse} res - The HTTP response object.
 */
export default async function handler(req, res) {
  try {
    // Allow only authorized origin and POST requests
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    // Validate req body
    const { searchTerm, movie } = req.body;
    if (!searchTerm || typeof searchTerm !== "string" || !movie || typeof movie !== "object") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing or invalid parameters",
      });
    }

    // Check if the search term already exists in the database
    const existingSearch = await database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm.trim()),
    ]);
    if (existingSearch.documents.length > 0) {
      const documentId = existingSearch.documents[0].$id;
      const updatedCount = existingSearch.documents[0].count + 1;

      await database.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, documentId, {
        count: updatedCount,
      });
    } else {
      await database.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm.trim(),
        count: 1,
        movie_id: movie?.id || null,
        poster_url: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
      });
    }
    res.status(200).json({ message: "Search term updated successfully" });
  } catch (error) {
    console.error("Error in /api/updateSearch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
