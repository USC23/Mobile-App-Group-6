import React, { useState } from 'react';
import { FlatList, View, Text, Alert, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTasks, Task } from '../../../src/state/tasks';
import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DeletedTasks() {
  const { tasks, deleteTaskPermanently, restoreTask, updateTask } = useTasks();
  const deleted = tasks.filter(t => t.status === 'deleted');

  const [editing, setEditing] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDue, setEditDue] = useState<Date | undefined>(undefined);

  const restoreEditedTask = async () => {
    if (!editing) return;
    if (editing.reminderId) await cancelReminder(editing.reminderId);

    let newReminder: string | null = null;
    if (editDue) newReminder = await scheduleReminder(editTitle, editDue);

    updateTask(editing.id, { title: editTitle, due: editDue?.toISOString(), reminderId: newReminder, status: 'pending' });
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❌ Deleted Tasks</Text>
      <FlatList
        data={deleted}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.title}</Text>
            <Text>{item.due ? new Date(item.due).toLocaleString() : ''}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => restoreTask(item.id)}>
                <Text style={{ color: '#27ae60' }}>Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>
                Alert.alert('Delete Permanently', 'Are you sure?', [
                  { text: 'Cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteTaskPermanently(item.id) }
                ])
              }>
                <Text style={{ color: '#e74c3c' }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setEditing(item);
                setEditTitle(item.title);
                setEditDue(item.due ? new Date(item.due) : undefined);
              }}>
                <Text style={{ color: '#f39c12' }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={!!editing} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>Edit & Restore Task</Text>
            <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.input} />
            <DateTimePicker value={editDue || new Date()} mode="datetime" onChange={(e:any,d?:Date)=>d&&setEditDue(d)} />
            <TouchableOpacity onPress={restoreEditedTask}><Text>Save & Restore</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setEditing(null)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  title:{ fontSize:20, fontWeight:'600', marginBottom:8 },
  taskCard:{ padding:12, borderBottomWidth:1, borderColor:'#ccc' },
  taskText:{ fontSize:16 },
  modal:{ flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.5)', padding:16 },
  modalContent:{ backgroundColor:'#fff', padding:16, borderRadius:12 },
  input:{ borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:8 },
});
