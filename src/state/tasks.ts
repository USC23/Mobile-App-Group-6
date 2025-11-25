// src/state/tasks.ts
import { useEffect, useState } from 'react';

export type TaskStatus = 'pending' | 'completed' | 'incomplete' | 'deleted';
export type Task = { id: string; title: string; due?: string; status: TaskStatus; reminderId?: string | null; eventId?: string | null };

let store: Task[] = [];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(store);

  useEffect(() => {
    const interval = setInterval(() => setTasks([...store]), 100);
    return () => clearInterval(interval);
  }, []);

  function addTask(payload: Partial<Task>) {
    const id = Math.random().toString(36).slice(2);
    const status: TaskStatus = payload.status ?? 'pending';
    store.push({ id, title: payload.title || 'Untitled', due: payload.due, status, reminderId: payload.reminderId ?? null, eventId: payload.eventId ?? null });
    setTasks([...store]);
  }
  function updateTask(id: string, payload: Partial<Task>) {
    store = store.map(t => (t.id === id ? { ...t, ...payload } : t));
    setTasks([...store]);
  }
  function updateTaskStatus(id: string, status: TaskStatus) {
    store = store.map(t => (t.id === id ? { ...t, status } : t));
    setTasks([...store]);
  }
  function deleteTask(id: string) {
    store = store.map(t => (t.id === id ? { ...t, status: 'deleted' } : t));
    setTasks([...store]);
  }
  function markOverdue() {
    const now = Date.now();
    store = store.map(t => {
      if (t.due && new Date(t.due).getTime() < now && t.status === 'pending') {
        return { ...t, status: 'incomplete' };
      }
      return t;
    });
    setTasks([...store]);
  }

  return { tasks, addTask, updateTaskStatus, deleteTask, markOverdue, updateTask };
}
