import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export async function requestCalendarPermission(): Promise<boolean> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    return false;
  }
}

export async function createEvent(taskName: string, start: Date, end?: Date): Promise<string | null> {
  try {
    const perm = await requestCalendarPermission();
    if (!perm) return null;

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    let cal: any = calendars.find((c: any) => c.allowsModifications && c.isPrimary) || calendars[0];
    if (!cal) {
      // create a new local calendar
      let defaultCalendarSource: any = {};
      if (Platform.OS === 'ios') {
        defaultCalendarSource = await Calendar.getDefaultCalendarAsync();
      } else {
        defaultCalendarSource = { id: 'local', name: 'ProjectApp' };
      }
      const newCalId = await Calendar.createCalendarAsync({
        title: 'ProjectApp',
        color: '#2196F3',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id || defaultCalendarSource.sourceId,
        source: defaultCalendarSource,
        name: 'ProjectApp',
        ownerAccount: 'personal',
      });
      cal = { id: newCalId };
    }

    const eventId = await Calendar.createEventAsync(cal.id, {
      title: taskName,
      startDate: start,
      endDate: end || new Date(start.getTime() + 30 * 60 * 1000),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      location: '',
    } as any);
    return eventId;
  } catch (e) {
    return null;
  }
}

export async function deleteEvent(eventId: string | null | undefined) {
  if (!eventId) return;
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch (e) {
    // ignore
  }
}

export default { requestCalendarPermission, createEvent, deleteEvent };
