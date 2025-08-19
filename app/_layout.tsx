import { Stack } from "expo-router";
import "./globals.css"; // Import global styles

export default function RootLayout() {
  return (
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
  );
}
