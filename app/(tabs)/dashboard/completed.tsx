import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTasks } from '../../../src/state/tasks';
import { cancelReminder } from '../../../src/services/notifications';

export default function CompletedTasks() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Completed Tasks</Text>
      <FlatList
        data={completed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              {item.due && <Text style={styles.taskDue}>{new Date(item.due).toLocaleString()}</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={async () => {
                await cancelReminder(item.reminderId);
                updateTaskStatus(item.id, 'pending');
              }}>
                <Text style={[styles.actionText, { color: '#f39c12' }]}>Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={[styles.actionText, { color: '#e74c3c' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  taskCard: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  taskDue: { fontSize: 14, color: '#e74c3c' },
  actions: { flexDirection: 'row', gap: 12 },
  actionText: { fontWeight: '600', fontSize: 14 },
});
