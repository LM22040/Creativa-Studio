// backend/scripts/verUsuarios.js
// Script para ver todos los usuarios en la base de datos

const db = require('../models/db');

console.log('🔍 Consultando usuarios en la base de datos...\n');

db.all('SELECT idUsuario, nombre, correo, rol, creadoEn FROM Usuario', [], (err, rows) => {
  if (err) {
    console.error('❌ Error al consultar usuarios:', err.message);
    db.close();
    return;
  }

  if (rows.length === 0) {
    console.log('⚠️  No hay usuarios en la base de datos.');
    console.log('\n💡 Ejecuta: node scripts/initDB.js para crear el usuario admin\n');
  } else {
    console.log(`✅ Se encontraron ${rows.length} usuario(s):\n`);
    console.table(rows);
    
    console.log('\n📋 Credenciales por defecto:');
    console.log('   Correo: admin@creativaestudios.com');
    console.log('   Contraseña: admin123\n');
  }

  db.close();
});
