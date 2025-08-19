import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-5xl font-bold text-dark-200">Welcome!</Text>
      </View>
      <View className="flex-auto p-10 justify-center bg-white">
        <Link href="/movies/1" className="text-xl text-dark-200">
          Movie 1
        </Link>
        <Link href="/movies/Materialist" className="text-xl text-dark-200">
          Movie Materialist
        </Link>
      </View>
    </>
  );
}
