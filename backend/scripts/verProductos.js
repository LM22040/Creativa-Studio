// backend/scripts/verProductos.js
// Script para ver todos los productos en la base de datos

const db = require('../models/db');

console.log('📦 Consultando productos en la base de datos...\n');

db.all('SELECT * FROM Producto', [], (err, rows) => {
  if (err) {
    console.error('❌ Error al consultar productos:', err.message);
    db.close();
    return;
  }

  if (rows.length === 0) {
    console.log('⚠️  No hay productos en la base de datos.\n');
  } else {
    console.log(`✅ Se encontraron ${rows.length} producto(s):\n`);
    console.table(rows);
  }

  db.close();
});
