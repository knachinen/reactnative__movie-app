import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./globals.css"; // Import global styles

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }} // Hide header for the main screen;
        />
        <Stack.Screen
          name="movies/[id]"
          options={{ headerShown: false }} // Hide header for the onboarding screen
        />
      </Stack>
    </>
  );
}
