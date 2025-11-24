import * as Calendar from 'expo-calendar';

// Defining my own interface for the calendar objects
interface MyCalendar {
  id: string;
  title?: string;
  allowsModifications?: boolean;
}

/**
 * Creates a calendar event for a given task.
 * @param taskName
 * @param start 
 * @param end 
 */
export async function createEvent(taskName: string, start: Date, end?: Date) {
 
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Calendar permission denied');
  }


  const calendars = (await Calendar.getCalendarsAsync()) as MyCalendar[];

 
  const defaultCalendar =
    calendars.find((c: MyCalendar) => c.allowsModifications) ?? calendars[0];

  if (!defaultCalendar) {
    throw new Error('No modifiable calendar found');
  }


  await Calendar.createEventAsync(defaultCalendar.id, {
    title: taskName,
    startDate: start,
    endDate: end ?? new Date(start.getTime() + 30 * 60 * 1000), 
    timeZone: 'UTC',
  });
}
