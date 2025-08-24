import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  //   .setEndpoint("https://cloud.appwrite.io/v1")
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async (movie_id: number) => {
  try {
    // console.log("Saving movie with ID:", movie_id);
    const result = await database.createDocument(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED!,
      ID.unique(),
      {
        movie_id: movie_id,
        saved: true,
      }
    );
    // console.log("Movie saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const checkIfMovieSaved = async (movie_id: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED!,
      [Query.equal("movie_id", movie_id), Query.equal("saved", true)]
    );
    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking if movie is saved:", error);
    return false;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED!,
      [Query.equal("saved", true)]
    );

    if (result.documents.length === 0) {
      return [];
    } else {
      return result.documents as unknown as SavedMovie[];
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
