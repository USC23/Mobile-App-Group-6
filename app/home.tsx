import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal } from 'react-native';

type Task = {
  id: number;
  name: string;
  status: 'pending' | 'completed';
};

const HomeScreen: React.FC = () => {
  const username = "Emmanuel"; // later this can come from backend/auth
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === "") return;
    const task: Task = { id: Date.now(), name: newTask, status: 'pending' };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  // Delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Save edited task
  const saveEdit = () => {
    if (!editingTask) return;
    setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, name: editText } : task));
    setEditingTask(null);
    setEditText("");
  };

  // Mark task as completed
  const completeTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: 'completed' } : task));
  };

  return (
    <View style={styles.container}>
      {/* Welcome message */}
      <Text style={styles.welcomeText}>👋 Welcome {username}</Text>

      {/* Input for new task */}
      <TextInput
        placeholder="Enter a new task..."
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
      />
      <Button title="➕ Create Task" onPress={addTask} color="#2980b9" />

      {/* Pending tasks */}
      <Text style={styles.sectionTitle}>📝 Pending Tasks</Text>
      <FlatList
        data={tasks.filter(t => t.status === 'pending')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.name}</Text>
            <View style={styles.actions}>
              <Button title="Delete" color="#e74c3c" onPress={() => deleteTask(item.id)} />
              <Button title="Edit" color="#f39c12" onPress={() => { setEditingTask(item); setEditText(item.name); }} />
              <Button title="Complete" color="#27ae60" onPress={() => completeTask(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Completed tasks */}
      <Text style={styles.sectionTitle}>✅ Completed Tasks</Text>
      <FlatList
        data={tasks.filter(t => t.status === 'completed')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCardCompleted}>
            <Text style={styles.taskTextCompleted}>{item.name}</Text>
          </View>
        )}
      />

      {/* Edit Task Modal */}
      <Modal visible={editingTask !== null} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏ Edit Task</Text>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.input}
            />
            <Button title="Save" onPress={saveEdit} color="#27ae60" />
            <Button title="Cancel" onPress={() => setEditingTask(null)} color="#e74c3c" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 15,
    color: '#34495e',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskCardCompleted: {
    backgroundColor: '#d5f5e3',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  taskTextCompleted: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2980b9',
    textAlign: 'center',
  },
});