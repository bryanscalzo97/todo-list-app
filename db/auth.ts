import * as SQLite from 'expo-sqlite';

// Initialize the database by creating the 'users' and 'todos' tables if they don't exist
export async function initializeDatabase() {
  try {
    // Open the database connection
    const db = await SQLite.openDatabaseAsync('users.db');

    // Create the todos table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY NOT NULL, 
        title TEXT, 
        status INTEGER, 
        timestamp TEXT
      );
    `);
    console.log('Todos table ensured.');

    // Check if the users table exists and create it if not
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE, 
        password TEXT NOT NULL
      );
    `);
    console.log('Users table ensured.');

    // Verify the tables are created by checking their existence
    const result = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table';`);
    console.log('Tables in database:', result);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Register a new user by inserting their email and password into the 'users' table
export const registerUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const db = await SQLite.openDatabaseAsync('users.db');
    await db.runAsync('INSERT INTO users (email, password) VALUES (?, ?);', email, password);
    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
};

// Log in a user by checking if their email and password exist in the 'users' table
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const db = await SQLite.openDatabaseAsync('users.db');
    const user = await db.getFirstAsync('SELECT * FROM users WHERE email = ? AND password = ?;', email, password);
    return !!user; // Return true if the user exists, otherwise false
  } catch (error) {
    console.error('Error logging in user:', error);
    return false;
  }
};
