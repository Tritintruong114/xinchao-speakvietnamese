import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="intent" />
      <Stack.Screen name="travel-ready" />
      <Stack.Screen name="travel-dashboard" />
      <Stack.Screen name="travel-aha" />
      <Stack.Screen name="push" />
    </Stack>
  );
}
