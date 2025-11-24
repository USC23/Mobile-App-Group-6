import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

type Task = {
  id: number;
  name: string;
  status: 'pending' | 'completed';
};

const HomeScreen: React.FC = () => {
  const username = "Emmanuel"; // later this can come from backend/auth
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

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

  // Edit a task (for now just rename)
  const editTask = (id: number, newName: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, name: newName } : task));
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
      <Button title="➕ Create Task" onPress={addTask} />

      {/* Pending tasks */}
      <Text style={styles.sectionTitle}>📝 Pending Tasks</Text>
      <FlatList
        data={tasks.filter(t => t.status === 'pending')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.name}</Text>
            <View style={styles.actions}>
              <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
              <Button title="Edit" color="orange" onPress={() => editTask(item.id, "Edited Task")} />
              <Button title="Complete" color="green" onPress={() => completeTask(item.id)} />
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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
    borderColor: '#ccc',
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
    backgroundColor: '#e0ffe0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2d8b2',
  },
  taskTextCompleted: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
});