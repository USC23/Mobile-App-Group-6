import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Switch, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../../../src/state/tasks';
import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';
import { createEvent } from '../../../src/services/calendar';

export default function PendingTasks() {
  const { tasks, updateTaskStatus, deleteTask, updateTask } = useTasks();
  const pending = tasks.filter(t => t.status === 'pending');

  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDue, setEditDue] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [syncCalendar, setSyncCalendar] = useState(false);

  const startEdit = (task: any) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDue(task.due ? new Date(task.due) : undefined);
    setSyncCalendar(false);
    setShowDatePicker(false);
  };

  const saveEdit = async () => {
    if (!editingTask) return;
    if (editingTask.reminderId) await cancelReminder(editingTask.reminderId);

    let newReminder: string | null = null;
    let newEvent: string | null = null;

    if (editDue) {
      if (syncCalendar) {
        try {
          newReminder = await scheduleReminder(editTitle, editDue);
          newEvent = await createEvent(editTitle, editDue);
        } catch {}
      }
    }

    updateTask(editingTask.id, {
      title: editTitle,
      due: editDue?.toISOString(),
      reminderId: newReminder,
      eventId: newEvent,
      status: 'pending', // reset to pending after edit
    });
    setEditingTask(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏳ Pending Tasks</Text>
      <FlatList
        data={pending}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              {item.due && <Text style={styles.taskDue}>{new Date(item.due).toLocaleString()}</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={[styles.actionText, { color: '#f39c12' }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateTaskStatus(item.id, 'completed')}>
                <Text style={[styles.actionText, { color: '#27ae60' }]}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={[styles.actionText, { color: '#e74c3c' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal visible={!!editingTask} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
            />

            <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowDatePicker(!showDatePicker)}>
              <Text style={styles.dropdownHeaderText}>Select Due Date</Text>
              <Text style={styles.dropdownHeaderText}>
                {editDue ? editDue.toLocaleString() : 'No date selected'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={editDue || new Date()}
                mode="datetime"
                display="default"
                onChange={(e: any, date?: Date) => {
                  if (date) setEditDue(date);
                  setShowDatePicker(false);
                }}
              />
            )}

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Sync to Google Calendar</Text>
              <Switch value={syncCalendar} onValueChange={setSyncCalendar} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={[styles.saveBtn]} onPress={saveEdit}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setEditingTask(null)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginVertical: 6 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#dcdde1', padding: 12, borderRadius: 8, marginVertical: 6 },
  dropdownHeaderText: { fontSize: 16 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  toggleLabel: { fontSize: 16 },
  saveBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 6, flex: 1, marginRight: 8 },
  cancelBtn: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 6, flex: 1 },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
