// database.js
const Database = require('better-sqlite3');

const db = new Database('my-database.db');

// Создание таблицы (если не существует)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`);

// Функция для добавления пользователя
function addUser(name, email) {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run(name, email);
}

// Функция для получения всех пользователей
function getUsers() {
  return db.prepare('SELECT * FROM users').all();
}

module.exports = { addUser, getUsers };
