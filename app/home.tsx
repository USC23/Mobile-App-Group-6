import React, { useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

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
    <View style={{ flex: 1, padding: 20 }}>
      {/* Welcome message */}
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        Welcome {username}
      </Text>

      {/* Input for new task */}
      <TextInput
        placeholder="Enter a new task"
        value={newTask}
        onChangeText={setNewTask}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <Button title="Create Task" onPress={addTask} />

      {/* Show pending tasks */}
      <FlatList
        data={tasks.filter(t => t.status === 'pending')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Button title="Delete" onPress={() => deleteTask(item.id)} />
              <Button title="Edit" onPress={() => editTask(item.id, "Edited Task")} />
              <Button title="Complete" onPress={() => completeTask(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Show completed tasks */}
      <Text style={{ fontSize: 18, marginTop: 20 }}>Completed Tasks</Text>
      <FlatList
        data={tasks.filter(t => t.status === 'completed')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;