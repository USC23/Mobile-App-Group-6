import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskItem } from '../../../src/components/TaskItem';
import { useTasks } from '../../../src/state/tasks';

export default function CompletedTasks() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const completed = tasks.filter(t => t.status === 'completed');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={completed}
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
