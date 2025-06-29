import { Client, Databases, ID, Query } from "appwrite";

const { APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } = process.env;

const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(APPWRITE_PROJECT_ID);
const database = new Databases(client, APPWRITE_DATABASE_ID);

/**
 * Handles GET requests to the /api/trending endpoint.
 * This function retrieves the top 5 trending movies from Appwrite's database.
 *
 * @param {import('vercel').VercelRequest} req - The HTTP request object.
 * @param {import('vercel').VercelResponse} res - The HTTP response object.
 */
export default async function handler(req, res) {
  try {
    // Allow only authorized origin and GET requests
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    // Fetch top 5 trending movies from Appwrite database
    const response = await database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    res.status(200).json(response.documents);
  } catch (error) {
    console.error("Error in /api/trending:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
