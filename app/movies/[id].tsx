import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { checkIfMovieSaved, saveMovie } from "@/services/appwrite";
import useFetch from "@/services/usefetch";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-gray-200 font-normal text-sm">{label}</Text>
    <Text className="text-gray-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  // Use a ref to track if we have already logged the message
  const hasLoggedRef = useRef(false);

  const {
    data: movieDetails,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  /**
   * Reusable async function to check the saved status and update state.
   * This is the single source of truth for checking save status.
   */
  const updateSavedStatus = useCallback(async () => {
    if (movieDetails && movieDetails.id) {
      try {
        const result = await checkIfMovieSaved(movieDetails.id);
        setIsSaved(result);
      } catch (err) {
        console.error("Failed to check saved status:", err);
        setIsSaved(false);
      }
    }
  }, [movieDetails]);

  /**
   * The primary useEffect for initial data load.
   * This effect runs only once after the data is loaded to set the initial 'isSaved' state.
   */
  useEffect(() => {
    if (!loading && movieDetails && !hasLoggedRef.current) {
      // console.log("✅ Movie details have loaded.");
      hasLoggedRef.current = true;
      // Use the reusable function here
      updateSavedStatus();
    }
  }, [loading, movieDetails, updateSavedStatus]);

  /**
   * Example handler for a save button press.
   * This function would toggle the save status via an API call,
   * then re-run the check to ensure the state is correct.
   */
  const handleSaveToggle = async () => {
    // You would place your save/unsave API call here
    // For example: await toggleSaveStatus(movieDetails.id);

    // After the action, update the UI by calling the reusable function again
    await updateSavedStatus();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary items-center justify-center px-5">
        <Text className="text-red-500 text-center">
          Error: {error.message || "Something went wrong"}
        </Text>
        <TouchableOpacity
          className="mt-5 px-4 py-2 bg-accent rounded-lg"
          onPress={router.back}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <TouchableOpacity
        className="absolute top-5 p-3.5 z-50 flex-row items-center justify-center rounded-lg bg-accent self-end flex mx-5"
        onPress={async () => {
          await saveMovie(movieDetails!.id);
          await handleSaveToggle();
        }}
      >
        {/* <Image source={icons.save} className="size-5 mt-0.5" tintColor="#fff" /> */}
        <MaterialIcons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={20}
          color="#fff"
          className="mt-0.5"
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          {/* <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity> */}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">
            {movieDetails?.title}
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-gray-200 text-sm">
              {movieDetails?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-gray-200 text-sm">
              {movieDetails?.runtime}m
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movieDetails?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-gray-200 text-sm">
              ({movieDetails?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movieDetails?.overview} />
          <MovieInfo
            label="Genres"
            value={
              movieDetails?.genres?.map((g) => g.name).join(" • ") || "N/A"
            }
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movieDetails?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movieDetails?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movieDetails?.production_companies
                ?.map((c) => c.name)
                .join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 py-3.5 z-50 flex-row items-center justify-center rounded-lg bg-accent left-0 right-0 flex mx-5"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
