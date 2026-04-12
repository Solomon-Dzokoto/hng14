import { useCallback, useState } from 'react';
import { getDb } from '@/lib/sqlite';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async (search = '') => {
    setIsLoading(true);
    try {
      const db = await getDb();
      const q = search.trim();
      const result = q
        ? await db.getAllAsync<Note>(
            'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updatedAt DESC',
            [`%${q}%`, `%${q}%`],
          )
        : await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updatedAt DESC');
      setNotes(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNote = useCallback(async (id: string) => {
    const db = await getDb();
    return db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', [id]);
  }, []);

  const createNote = useCallback(async (title: string, content: string, category = '') => {
    const db = await getDb();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO notes (id, title, content, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, content, category, now, now],
    );
    return id;
  }, []);

  const updateNote = useCallback(async (id: string, title: string, content: string, category = '') => {
    const db = await getDb();
    await db.runAsync(
      'UPDATE notes SET title = ?, content = ?, category = ?, updatedAt = ? WHERE id = ?',
      [title, content, category, Date.now(), id],
    );
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const db = await getDb();
    await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  }, []);

  return { notes, isLoading, fetchNotes, getNote, createNote, updateNote, deleteNote };
}
