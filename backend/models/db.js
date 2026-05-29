// backend/models/db.js
// Conexión a SQLite

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/conectar a la base de datos SQLite
const dbPath = path.join(__dirname, '..', 'creativa_estudios.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
  } else {
    console.log('✅ Conectado a SQLite exitosamente');
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
