
// import React from 'react';
// import { FlatList, StyleSheet, Text, View } from 'react-native';
// import { TaskItem } from '../../../src/components/TaskItem';
// import { useTasks } from '../../../src/state/tasks';

// export default function IncompleteTasks() {
//   const { tasks, updateTaskStatus, deleteTask } = useTasks();
//   const incomplete = tasks.filter(t => t.status === 'incomplete');

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Incomplete Tasks</Text>
//       <FlatList
//         data={incomplete}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TaskItem
//             task={item}
//             onComplete={() => updateTaskStatus(item.id, 'completed')}
//             onDelete={() => deleteTask(item.id)}
//           />
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
// });






import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTasks } from '../../../src/state/tasks';
import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';
import { createEvent } from '../../../src/services/calendar';

export default function IncompleteTasks() {
  const { tasks, updateTaskStatus, deleteTask, updateTask } = useTasks();
  const incomplete = tasks.filter(t => t.status === 'incomplete');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Incomplete Tasks</Text>
      <FlatList
        data={incomplete}
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
                <Text style={[styles.actionText, { color: '#27ae60' }]}>Restore</Text>
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
