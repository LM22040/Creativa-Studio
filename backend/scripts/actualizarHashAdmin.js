// backend/scripts/actualizarHashAdmin.js
// Script para actualizar el hash del usuario admin a la contraseña correcta

const db = require('../models/db');
const bcrypt = require('bcrypt');

const PASSWORD_CORRECTA = 'admin123';
const HASH_CORRECTO = '$2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.';

console.log('🔐 Actualizando hash del usuario admin...\n');

// Actualizar el hash en la base de datos
db.run(
  'UPDATE Usuario SET passwordHash = ? WHERE correo = ?',
  [HASH_CORRECTO, 'admin@creativaestudios.com'],
  function(err) {
    if (err) {
      console.error('❌ Error al actualizar el hash:', err.message);
      db.close();
      process.exit(1);
    }

    if (this.changes === 0) {
      console.log('⚠️  No se encontró el usuario admin.');
      console.log('💡 Ejecuta primero: node scripts/initDB.js\n');
      db.close();
      process.exit(1);
    }

    console.log('✅ Hash actualizado exitosamente!\n');
    console.log('📋 Credenciales actualizadas:');
    console.log('   Correo: admin@creativaestudios.com');
    console.log('   Contraseña: admin123\n');

    // Verificar que el hash funciona
    bcrypt.compare(PASSWORD_CORRECTA, HASH_CORRECTO)
      .then(isValid => {
        if (isValid) {
          console.log('✅ Verificación exitosa: El hash es correcto\n');
          console.log('🎉 Ahora puedes iniciar sesión con las credenciales por defecto\n');
        } else {
          console.log('❌ Error: El hash no coincide con la contraseña\n');
        }
        db.close();
      })
      .catch(err => {
        console.error('❌ Error al verificar el hash:', err.message);
        db.close();
      });
  }
);
