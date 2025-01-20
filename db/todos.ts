import * as SQLite from 'expo-sqlite';

export const addTodo = async (title: string): Promise<boolean> => {
  const db = await SQLite.openDatabaseAsync('users.db');
  const timestamp = new Date().toISOString();
  try {
    await db.runAsync(
      'INSERT INTO todos (title, status, timestamp) VALUES (?, ?, ?);',
      title,
      0, // Default status is 0 (incomplete)
      timestamp,
    );
    return true;
  } catch (error) {
    console.error('Error adding todo:', error);
    return false;
  }
};

export const getTodos = async (): Promise<any[]> => {
  const db = await SQLite.openDatabaseAsync('users.db');
  try {
    return await db.getAllAsync('SELECT * FROM todos;');
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

export const updateTodo = async (id: number, status: number, title: string): Promise<boolean> => {
  const db = await SQLite.openDatabaseAsync('users.db');
  try {
    await db.runAsync('UPDATE todos SET status = ?, title = ? WHERE id = ?;', status, title, id);
    return true;
  } catch (error) {
    console.error('Error updating todo:', error);
    return false;
  }
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  const db = await SQLite.openDatabaseAsync('users.db');
  try {
    await db.runAsync('DELETE FROM todos WHERE id = ?;', id);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return false;
  }
};
