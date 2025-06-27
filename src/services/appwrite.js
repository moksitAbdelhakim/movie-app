// Appwrite SDK
import { Client, Databases, ID, Query } from "appwrite";

const { VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID } =
  import.meta.env;

const client = new Client().setEndpoint(VITE_APPWRITE_ENDPOINT).setProject(VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client, VITE_APPWRITE_DATABASE_ID);

/**
 * UpdateSearchTerm - Track frequent search terms and store them in Appwrite database
 */
export const UpdateSearchTerm = async (searchTerm, movie) => {
  try {
    // Check if the arguments are valid
    if (typeof searchTerm !== "string" || searchTerm.trim() === "" || !movie || typeof movie !== "object") {
      throw new Error("Invalid arguments provided to UpdateSearchTerm.");
    }

    // Check if the search term already exists in the database
    const existingSearch = await database.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm.trim()),
    ]);
    if (existingSearch.documents.length > 0) {
      // If it exists, update the count
      const documentId = existingSearch.documents[0].$id;
      const updatedCount = existingSearch.documents[0].count + 1;

      await database.updateDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, documentId, {
        count: updatedCount,
      });
    } else {
      // If it dosn't exist, create a new document
      await database.createDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm.trim(),
        count: 1,
        movie_id: movie?.id || null,
        poster_url: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
      });
    }
  } catch (error) {
    console.error("Error updating search term, type:", error.name, "message:", error.message);
  }
};

// Fetch popular movies from the Appwrite database
// I move error handling to the component level
export const getTrendingMovies = async () => {
  const response = await database.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count"),
  ]);

  return response.documents;
};
