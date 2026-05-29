// Script para inicializar la base de datos SQLite
const fs = require('fs');
const path = require('path');
const db = require('../models/db');

const schemaPath = path.join(__dirname, '../../database/schema_sqlite.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Ejecutar el schema
db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Error inicializando la base de datos:', err.message);
  } else {
    console.log('✅ Base de datos inicializada correctamente');
  }
  db.close();
});
