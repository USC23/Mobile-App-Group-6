// src/components/TaskItem.tsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../state/tasks';

export function TaskItem({ task, onEdit, onComplete, onDelete }: {
  task: Task;
  onEdit?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.meta}>Due: {task.due || '—'}</Text>
      <View style={styles.actions}>
        {onEdit && (
          <View style={styles.actionButton}>
            <Button title="Edit" onPress={onEdit} />
          </View>
        )}
        {onComplete && (
          <View style={styles.actionButton}>
            <Button title="Complete" onPress={onComplete} />
          </View>
        )}
        {onDelete && (
          <View style={styles.actionButton}>
            <Button title="Delete" color="#d00" onPress={onDelete} />
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionButton: { marginRight: 8 },
});
