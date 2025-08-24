import SavedCard from "@/components/SavedCard";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/usefetch";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const Saved = () => {
  const {
    data: savedMovies,
    loading: savedLoading,
    error: savedError,
  } = useFetch(getSavedMovies);

  return (
    <View className="flex-1 bg-primary px-5">
      {/* <View className="flex flex-1 flex-col items-center justify-center gap-5">
        <Image source={icons.save} className="size-10" tintColor={"#FFF"} />
        <Text className="text-gray-500 text-base">Saved</Text>
      </View> */}
      {savedLoading ? (
        // Loading state
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : savedError ? (
        // Error state
        <Text className="text-red-500">Error: {savedError?.message}</Text>
      ) : (
        // Data loaded state
        <>
          <View className="flex-1 mt-5">
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Saved Movies
            </Text>
            <FlatList
              data={savedMovies}
              renderItem={({ item }) => <SavedCard {...item} />}
              keyExtractor={(item) => item.movie_id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              // scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Saved;
