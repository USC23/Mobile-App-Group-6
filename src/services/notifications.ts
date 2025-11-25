// // src/services/notifications.ts
// import * as Notifications from 'expo-notifications';

// export async function requestNotificationPermission(): Promise<boolean> {
//   try {
//     const { status } = await Notifications.requestPermissionsAsync();
//     return status === 'granted';
//   } catch {
//     return false;
//   }
// }

// export async function scheduleReminder(taskName: string, triggerDate?: Date): Promise<string | null> {
//   try {
//     const now = new Date();
//     const isPast = !triggerDate || triggerDate <= now;
//     const notificationId = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: '📝 Task Reminder',
//         body: `${taskName} is due now.`,
//         sound: true,
//         priority: Notifications.AndroidNotificationPriority.HIGH,
//       },
//       trigger: isPast ? null : triggerDate,
//     });
//     return notificationId;
//   } catch (e) {
//     console.log('scheduleReminder error', e);
//     return null;
//   }
// }

// export async function cancelReminder(id?: string | null) {
//   if (!id) return;
//   try {
//     await Notifications.cancelScheduledNotificationAsync(id);
//   } catch (e) {
//     console.log('cancelReminder error', e);
//   }
// }

// export async function cancelAllReminders() {
//   try {
//     await Notifications.cancelAllScheduledNotificationsAsync();
//   } catch (e) {
//     console.log('cancelAllReminders error', e);
//   }
// }









import * as Notifications from 'expo-notifications';

export async function scheduleReminder(taskName: string, triggerDate?: Date): Promise<string> {
  if (!triggerDate || triggerDate <= new Date()) {
    // Trigger immediately if overdue
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: '📝 Task Reminder', body: `${taskName} is due now.`, sound: true, priority: Notifications.AndroidNotificationPriority.HIGH },
      trigger: null,
    });
    return id;
  }

  return await Notifications.scheduleNotificationAsync({
    content: { title: '📝 Task Reminder', body: `${taskName} is due now.`, sound: true, priority: Notifications.AndroidNotificationPriority.HIGH },
    trigger: triggerDate,
  });
}

export async function cancelReminder(id?: string | null) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
}

export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

