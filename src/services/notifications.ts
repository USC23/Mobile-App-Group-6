import * as Notifications from 'expo-notifications';

export async function scheduleReminder(taskName: string, triggerDate: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Reminder',
      body: `${taskName} is due soon.`,
    },
    trigger: triggerDate,
  });
}

export async function cancelReminder(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
