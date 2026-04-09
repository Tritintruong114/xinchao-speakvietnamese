import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="intent" />
      <Stack.Screen name="curating" />
      <Stack.Screen name="aha" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
