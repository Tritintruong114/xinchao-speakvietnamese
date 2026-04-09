import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen
        name="link-account"
        options={{
          headerShown: true,
          title: 'SAVE PROGRESS',
          headerTintColor: '#1A1A1A',
          headerStyle: { backgroundColor: '#FFC62F' },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
