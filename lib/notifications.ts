import * as Notifications from 'expo-notifications';

export async function requestPushPermission(): Promise<Notifications.PermissionStatus> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    return current.status;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status;
}

