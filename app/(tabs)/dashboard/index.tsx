// app/(tabs)/dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskForm } from '../../../src/components/TaskForm';
import { TaskItem } from '../../../src/components/TaskItem';
import { createEvent, requestCalendarPermission } from '../../../src/services/calendar';
import { cancelReminder, requestNotificationPermission, scheduleReminder } from '../../../src/services/notifications';
import { useTasks } from '../../../src/state/tasks';

export default function DashboardPage() {
  const { tasks, addTask, updateTaskStatus, deleteTask, updateTask } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alerted, setAlerted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // show alert for overdue pending tasks (only once per task)
    const now = Date.now();
    tasks.forEach(t => {
      if (t.status === 'pending' && t.due) {
        const dueMs = new Date(t.due).getTime();
        if (dueMs < now && !alerted[t.id]) {
          Alert.alert('Task overdue', `${t.title} is overdue.`);
          setAlerted(prev => ({ ...prev, [t.id]: true }));
        }
      }
    });
  }, [tasks]);

  useEffect(() => {
    // ask for permissions early (best-effort)
    (async () => {
      try {
        await requestNotificationPermission();
        await requestCalendarPermission();
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or manage tasks</Text>
      <TaskForm
        task={tasks.find(t => t.id === editingId) || null}
        onSave={async (payload) => {
          const dueDate = payload.due ? new Date(payload.due) : null;
          if (editingId) {
            // cancel old reminder and reschedule if needed
            const old = tasks.find(t => t.id === editingId);
            if (old?.reminderId) {
              await cancelReminder(old.reminderId);
            }
            let newReminderId: string | null = null;
            let newEventId: string | null = null;
            if (dueDate) {
              const shouldSync = await new Promise<boolean>(resolve => {
                Alert.alert(
                  'Sync',
                  'Sync this updated task to calendar and schedule a reminder?',
                  [
                    { text: 'No', onPress: () => resolve(false) },
                    { text: 'Yes', onPress: () => resolve(true) },
                  ]
                );
              });
              if (shouldSync) {
                // schedule in background - best effort
                try {
                  newReminderId = await scheduleReminder(payload.title || 'Task', dueDate);
                  newEventId = await createEvent(payload.title || 'Task', dueDate);
                } catch (e) {
                  /* ignore */
                }
              }
            }
            updateTask(editingId, { title: payload.title || 'Untitled', due: payload.due, reminderId: newReminderId, eventId: newEventId });
          } else {
            // create new task; optionally schedule
            let reminderId: string | null = null;
            let eventId: string | null = null;
            if (dueDate) {
              const shouldSync = await new Promise<boolean>(resolve => {
                Alert.alert(
                  'Sync',
                  'Sync this task to calendar and schedule a reminder?',
                  [
                    { text: 'No', onPress: () => resolve(false) },
                    { text: 'Yes', onPress: () => resolve(true) },
                  ]
                );
              });
              if (shouldSync) {
                try {
                  reminderId = await scheduleReminder(payload.title || 'Task', dueDate);
                  eventId = await createEvent(payload.title || 'Task', dueDate);
                } catch (e) {
                  // ignore scheduling errors
                }
              }
            }
            addTask({ ...payload, reminderId, eventId });
          }
          setEditingId(null);
        }}
        onCancel={() => setEditingId(null)}
      />
      <FlatList
        data={tasks.filter(t => t.status === 'pending')}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.section}>Pending</Text>}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={() => setEditingId(item.id)}
            onComplete={async () => {
              // cancel reminder when completed
              await cancelReminder(item.reminderId);
              updateTaskStatus(item.id, 'completed');
              updateTask(item.id, { reminderId: null, eventId: item.eventId ?? null });
            }}
            onDelete={async () => {
              await cancelReminder(item.reminderId);
              deleteTask(item.id);
            }}
          />
        )}
      />
      <Button title="View Pending in Drawer" onPress={() => { /* drawer is already accessible */ }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  section: { fontSize: 18, marginVertical: 8 },
});
