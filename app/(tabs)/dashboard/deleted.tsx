import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskItem } from '../../../src/components/TaskItem';
import { useTasks } from '../../../src/state/tasks';

export default function DeletedTasks() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const deleted = tasks.filter(t => t.status === 'deleted');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deleted Tasks</Text>
      <FlatList
        data={deleted}
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
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});
