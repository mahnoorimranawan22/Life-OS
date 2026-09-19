import { useCallback, useEffect, useState } from 'react';
import { taskApi } from '../services/tasks.js';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await taskApi.list();
      setTasks(data);
      setStatus('ready');
    } catch (loadError) {
      setError(loadError?.response?.data?.error || 'Unable to load your tasks.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(async (data) => {
    const task = await taskApi.create(data);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const task = await taskApi.update(id, data);
    setTasks((prev) => prev.map((item) => (item.id === id ? task : item)));
    return task;
  }, []);

  const removeTask = useCallback(async (id) => {
    await taskApi.remove(id);
    setTasks((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { tasks, status, error, refresh, addTask, updateTask, removeTask };
}