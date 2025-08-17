import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('expenses.db');

// Membuat table jika belum ada
export const initializeDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        category TEXT,
        note TEXT,
        date TEXT
      );`
    );
  });
};

// Menambah pengeluaran baru
export const addExpense = (amount, category, note, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO expenses (amount, category, note, date) VALUES (?, ?, ?, ?);',
        [amount, category, note, date],
        (_, result) => resolve(result),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

// Mengambil semua pengeluaran, urut dari terbaru
export const getExpenses = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC;',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};
