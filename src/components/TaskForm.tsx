// src/components/TaskForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import type { Task } from '../state/tasks';

export function TaskForm({ task, onSave, onCancel }: {
  task: Task | null;
  onSave: (payload: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [due, setDue] = useState(task?.due || '');

  return (
    <View style={styles.container}>
      <TextInput placeholder="Task title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Due date (YYYY-MM-DD)" value={due} onChangeText={setDue} style={styles.input} />
      <Button title={task ? 'Update' : 'Add Task'} onPress={() => onSave({ title, due })} />
      {task && <Button title="Cancel" color="#999" onPress={onCancel} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 8, borderRadius: 6 },
});
