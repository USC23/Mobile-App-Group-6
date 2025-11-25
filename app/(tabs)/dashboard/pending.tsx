// app/(tabs)/dashboard/pending.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTasks } from '../../../src/state/tasks';
import { TaskItem } from '../../../src/components/TaskItem';

export default function PendingTasks() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const pending = tasks.filter(t => t.status === 'pending');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Tasks</Text>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={() => updateTaskStatus(item.id, 'completed')}
            onDelete={() => deleteTask(item.id)}
          />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, fontWeight: '600', marginBottom: 8 } });
