import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskItem } from '../../../src/components/TaskItem';
import { useTasks } from '../../../src/state/tasks';

export default function IncompleteTasks() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const incomplete = tasks.filter(t => t.status === 'incomplete');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incomplete Tasks</Text>
      <FlatList
        data={incomplete}
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
