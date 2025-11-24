import * as Calendar from 'expo-calendar';

export async function createEvent(taskName: string, start: Date, end?: Date) {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Calendar permission denied');
  }

  const calendars = await Calendar.getCalendarsAsync();
  const defaultCalendar = calendars.find(c => c.allowsModifications) ?? calendars[0];

  await Calendar.createEventAsync(defaultCalendar.id, {
    title: taskName,
    startDate: start,
    endDate: end ?? new Date(start.getTime() + 30 * 60 * 1000),
    timeZone: 'UTC',
  });
}
