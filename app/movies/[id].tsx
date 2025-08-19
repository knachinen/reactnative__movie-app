import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Movie Details : {id}</Text>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({});
