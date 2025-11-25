
// app/(tabs)/dashboard/index.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Alert } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { useTasks } from '../../../src/state/tasks';
import { createEvent } from '../../../src/services/calendar';
import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';

export default function DashboardPage() {
  const { tasks, addTask, markOverdue } = useTasks();
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [syncCalendar, setSyncCalendar] = useState(false);

  // Stats
  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');
  const incomplete = tasks.filter(t => t.status === 'incomplete');
  const deleted = tasks.filter(t => t.status === 'deleted');

  // Mark overdue periodically
  useEffect(() => {
    const timer = setInterval(() => markOverdue(), 60 * 1000);
    return () => clearInterval(timer);
  }, [markOverdue]);

  const nextDue = pending
    .filter(t => t.due)
    .sort((a, b) => (new Date(a.due!).getTime() - new Date(b.due!).getTime()))[0];

  const handleCreateTask = async () => {
    if (!newTitle.trim()) return;

    let reminderId: string | null = null;
    let eventId: string | null = null;

    if (newDue) {
      try {
        if (syncCalendar) {
          eventId = await createEvent(newTitle, newDue);
        }
        reminderId = await scheduleReminder(newTitle, newDue);
      } catch {}
    }

    addTask({ title: newTitle, due: newDue?.toISOString(), reminderId, eventId, status: 'pending' });

    // Clear inputs
    setNewTitle('');
    setNewDue(undefined);
    setShowDatePicker(false);
    setSyncCalendar(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>👋 Welcome Emmanuel</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Summary</Text>
        <Text>Pending: {pending.length}</Text>
        <Text>Completed: {completed.length}</Text>
        <Text>Incomplete: {incomplete.length}</Text>
        <Text>Deleted: {deleted.length}</Text>
      </View>

      {nextDue ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Due</Text>
          <Text style={styles.taskTitle}>{nextDue.title}</Text>
          <Text>Due: {new Date(nextDue.due!).toLocaleString()}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Due</Text>
          <Text style={styles.emptyText}>No upcoming tasks</Text>
        </View>
      )}

      {/* Task Input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Task</Text>
        <TextInput
          style={styles.input}
          placeholder="Task title..."
          value={newTitle}
          onChangeText={setNewTitle}
        />

        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowDatePicker(!showDatePicker)}>
          <Text>Select Due Date</Text>
          <Text>{newDue ? newDue.toLocaleString() : 'No date selected'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={{ marginVertical: 8 }}>
            <DateTimePicker
              value={newDue || new Date()}
              mode="datetime"
              display="default"
              onChange={(e: Event, date?: Date) => date && setNewDue(date)}
            />
            <View style={styles.toggleRow}>
              <Text>Sync to Google Calendar</Text>
              <Switch value={syncCalendar} onValueChange={setSyncCalendar} />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
          <Text style={styles.createButtonText}>➕ Create Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  welcome: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#e74c3c' },
  emptyText: { color: '#7f8c8d' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  createButton: { backgroundColor: '#3498db', padding: 12, borderRadius: 8, marginTop: 12 },
  createButtonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
