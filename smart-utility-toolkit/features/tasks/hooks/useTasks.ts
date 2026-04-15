import { useCallback, useState } from 'react';
import { getDb } from '@/lib/sqlite';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: number; // 0 | 1 (SQLite booleans)
  createdAt: number;
  updatedAt: number;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async (filter: 'all' | 'active' | 'done' = 'all', search = '') => {
    setIsLoading(true);
    try {
      const db = await getDb();
      let query = 'SELECT * FROM tasks';
      const params: (string | number)[] = [];
      const conditions: string[] = [];

      if (filter === 'active') conditions.push('completed = 0');
      if (filter === 'done') conditions.push('completed = 1');

      const q = search.trim();
      if (q) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        params.push(`%${q}%`, `%${q}%`);
      }

      if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
      query += ' ORDER BY completed ASC, priority DESC, createdAt DESC';

      const result = await db.getAllAsync<Task>(query, params);
      setTasks(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string) => {
    const db = await getDb();
    return db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
  }, []);

  const createTask = useCallback(
    async (title: string, description = '', priority: Task['priority'] = 'medium') => {
      const db = await getDb();
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const now = Date.now();
      const priorityOrder = { low: 0, medium: 1, high: 2 };
      await db.runAsync(
        'INSERT INTO tasks (id, title, description, priority, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, ?, ?)',
        [id, title.trim(), description.trim(), priorityOrder[priority].toString(), now, now],
      );
      return id;
    },
    [],
  );

  const updateTask = useCallback(
    async (id: string, title: string, description = '', priority: Task['priority'] = 'medium') => {
      const db = await getDb();
      const priorityOrder = { low: 0, medium: 1, high: 2 };
      await db.runAsync(
        'UPDATE tasks SET title = ?, description = ?, priority = ?, updatedAt = ? WHERE id = ?',
        [title.trim(), description.trim(), priorityOrder[priority].toString(), Date.now(), id],
      );
    },
    [],
  );

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    const db = await getDb();
    await db.runAsync('UPDATE tasks SET completed = ?, updatedAt = ? WHERE id = ?', [
      completed ? 1 : 0,
      Date.now(),
      id,
    ]);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const db = await getDb();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }, []);

  const clearCompleted = useCallback(async () => {
    const db = await getDb();
    await db.runAsync('DELETE FROM tasks WHERE completed = 1');
  }, []);

  return {
    tasks,
    isLoading,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
