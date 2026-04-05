import * as Notifications from 'expo-notifications';

export async function requestPushPermission(): Promise<Notifications.PermissionStatus> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    return current.status;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status;
}

export async function sendWelcomeNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Welcome aboard! 🛵",
      body: "Your journey starts now. Stay street-smart with our daily phrase nudges.",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // send immediately
  });
}
