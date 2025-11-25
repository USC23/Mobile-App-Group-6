// // app/(tabs)/dashboard/pending.tsx
// import React, { useEffect, useState } from 'react';
// import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
// import { useTasks, Task } from '../../../src/state/tasks';
// import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';
// import { createEvent } from '../../../src/services/calendar';

// export default function PendingTasksPage() {
//   const { tasks, updateTask, updateTaskStatus } = useTasks();
//   const pending = tasks.filter(t => t.status === 'pending');

//   // keep track of which tasks we've alerted in-app (avoid duplicates)
//   const [alerted, setAlerted] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     const checkDue = async () => {
//       const now = Date.now();
//       for (const t of pending) {
//         if (t.due) {
//           const dueMs = new Date(t.due).getTime();
//           if (dueMs <= now && !alerted[t.id]) {
//             // alert in-app
//             Alert.alert('Task due', `${t.title} is due now.`);
//             setAlerted(prev => ({ ...prev, [t.id]: true }));
//             // schedule an OS notification immediately (if not scheduled)
//             if (!t.reminderId) {
//               const id = await scheduleReminder(t.title, new Date());
//               updateTask(t.id, { reminderId: id });
//             }
//             // mark as incomplete if you prefer auto-transition; requirement said incomplete when past due:
//             updateTaskStatus(t.id, 'incomplete');
//           }
//         }
//       }
//     };

//     const timer = setInterval(checkDue, 10 * 1000); // check every 10s for responsiveness
//     checkDue();
//     return () => clearInterval(timer);
//   }, [pending, alerted, updateTask, updateTaskStatus]);

//   // edit modal state
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editDue, setEditDue] = useState<Date | undefined>(undefined);
//   const [showEditDate, setShowEditDate] = useState(false);
//   const [syncToCalendar, setSyncToCalendar] = useState(false);

//   const openEdit = (task: Task) => {
//     setEditingTask(task);
//     setEditTitle(task.title);
//     setEditDue(task.due ? new Date(task.due) : undefined);
//     setShowEditDate(false);
//     setSyncToCalendar(false);
//   };

//   const saveEdit = async () => {
//     if (!editingTask) return;
//     // cancel old reminder if exists
//     if (editingTask.reminderId) {
//       await cancelReminder(editingTask.reminderId);
//     }

//     let reminderId: string | null = null;
//     let eventId: string | null = editingTask.eventId ?? null;

//     if (editDue) {
//       if (syncToCalendar) {
//         try {
//           eventId = await createEvent(editTitle, editDue);
//         } catch {}
//       }
//       reminderId = await scheduleReminder(editTitle, editDue);
//     }

//     updateTask(editingTask.id, { title: editTitle, due: editDue?.toISOString(), reminderId, eventId });
//     setEditingTask(null);
//     setEditTitle('');
//     setEditDue(undefined);
//     setSyncToCalendar(false);
//   };

//   const completeTask = async (task: Task) => {
//     if (task.reminderId) await cancelReminder(task.reminderId);
//     updateTaskStatus(task.id, 'completed');
//   };

//   const deleteTask = async (task: Task) => {
//     if (task.reminderId) await cancelReminder(task.reminderId);
//     updateTaskStatus(task.id, 'deleted');
//   };

//   const renderItem = ({ item }: { item: Task }) => (
//     <View style={styles.card}>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.title}>{item.title}</Text>
//         {item.due && <Text style={styles.due}>Due: {new Date(item.due).toLocaleString()}</Text>}
//       </View>

//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => openEdit(item)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
//         <TouchableOpacity onPress={() => completeTask(item)}><Text style={styles.complete}>Complete</Text></TouchableOpacity>
//         <TouchableOpacity onPress={() => deleteTask(item)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList data={pending} keyExtractor={i => i.id} renderItem={renderItem} ListEmptyComponent={<Text style={styles.empty}>No pending tasks</Text>} />

//       <Modal visible={editingTask !== null} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>Edit Task</Text>
//             <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} />

//             <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowEditDate(!showEditDate)}>
//               <Text>Select Due Date</Text>
//               <Text>{editDue ? editDue.toLocaleString() : 'No date selected'}</Text>
//             </TouchableOpacity>

//             {showEditDate && (
//               <View style={styles.pickerWrap}>
//                 <DateTimePicker value={editDue || new Date()} mode="datetime" display="default" onChange={(e: Event, date?: Date) => date && setEditDue(date)} />
//                 <View style={styles.toggleRow}>
//                   <Text>Sync to Google Calendar</Text>
//                   <Switch value={syncToCalendar} onValueChange={setSyncToCalendar} />
//                 </View>
//               </View>
//             )}

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
//               <TouchableOpacity style={[styles.saveBtn]} onPress={saveEdit}><Text style={styles.saveTxt}>Save</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setEditingTask(null)}><Text style={styles.saveTxt}>Cancel</Text></TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 12 },
//   card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
//   title: { fontSize: 16, fontWeight: '600' },
//   due: { marginTop: 6, color: '#e74c3c' },
//   actions: { marginLeft: 12, alignItems: 'flex-end' },
//   edit: { color: '#f39c12', marginBottom: 8, fontWeight: '600' },
//   complete: { color: '#27ae60', marginBottom: 8, fontWeight: '600' },
//   delete: { color: '#e74c3c', fontWeight: '600' },
//   empty: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' },

//   modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 16 },
//   modal: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
//   modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
//   input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, backgroundColor: '#fff' },
//   dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginTop: 10 },
//   pickerWrap: { marginTop: 10 },
//   toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },

//   saveBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 8, flex: 1, marginRight: 6 },
//   cancelBtn: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 8, flex: 1, marginLeft: 6 },
//   saveTxt: { color: '#fff', textAlign: 'center', fontWeight: '700' },
// });














// import React, { useState, useEffect } from 'react';
// import { FlatList, View, Text, Alert, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import { useTasks, Task } from '../../../src/state/tasks';
// import { scheduleReminder, cancelReminder } from '../../../src/services/notifications';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function PendingTasks() {
//   const { tasks, updateTask, updateTaskStatus } = useTasks();
//   const pending = tasks.filter(t => t.status === 'pending');
//   const [editing, setEditing] = useState<Task | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editDue, setEditDue] = useState<Date | undefined>(undefined);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const now = Date.now();
//       for (const t of pending) {
//         if (t.due && new Date(t.due).getTime() <= now && !t.reminderId) {
//           const id = await scheduleReminder(t.title, new Date());
//           updateTask(t.id, { reminderId: id });
//         }
//       }
//     }, 60000);
//     return () => clearInterval(interval);
//   }, [pending]);

//   const saveEdit = async () => {
//     if (!editing) return;
//     if (editing.reminderId) await cancelReminder(editing.reminderId);

//     let newReminder: string | null = null;
//     if (editDue) newReminder = await scheduleReminder(editTitle, editDue);

//     updateTask(editing.id, { title: editTitle, due: editDue?.toISOString(), reminderId: newReminder, status: 'pending' });
//     setEditing(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pending Tasks</Text>
//       <FlatList
//         data={pending}
//         keyExtractor={t => t.id}
//         renderItem={({ item }) => (
//           <View style={styles.taskCard}>
//             <Text style={styles.taskText}>{item.title}</Text>
//             <Text>{item.due ? new Date(item.due).toLocaleString() : ''}</Text>
//             <TouchableOpacity onPress={() => {
//               setEditing(item);
//               setEditTitle(item.title);
//               setEditDue(item.due ? new Date(item.due) : undefined);
//             }}>
//               <Text style={{ color: '#f39c12' }}>Edit</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       <Modal visible={!!editing} transparent animationType="slide">
//         <View style={styles.modal}>
//           <View style={styles.modalContent}>
//             <Text>Edit Task</Text>
//             <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.input} />
//             <DateTimePicker value={editDue || new Date()} mode="datetime" onChange={(e:any, d?:Date)=>d && setEditDue(d)} />
//             <TouchableOpacity onPress={saveEdit}><Text>Save</Text></TouchableOpacity>
//             <TouchableOpacity onPress={()=>setEditing(null)}><Text>Cancel</Text></TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
//   taskCard: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
//   taskText: { fontSize: 16 },
//   modal: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 16 },
//   modalContent: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 },
// });








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
