import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted' || status === Notifications.PermissionStatus?.GRANTED;
  } catch (e) {
    return false;
  }
}

export async function scheduleReminder(taskName: string, triggerDate: Date): Promise<string | null> {
  try {
    const perm = await requestNotificationPermission();
    if (!perm) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: taskName,
        data: { taskName },
      },
      trigger: triggerDate,
    } as any);
    return id;
  } catch (e) {
    return null;
  }
}

export async function cancelReminder(id: string | undefined | null) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    // ignore
  }
}

export default { requestNotificationPermission, scheduleReminder, cancelReminder };
