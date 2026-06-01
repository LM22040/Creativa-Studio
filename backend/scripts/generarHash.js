// backend/scripts/generarHash.js
// Script para generar hash de contraseñas para usuarios

const bcrypt = require('bcryptjs');

// Obtener la contraseña desde argumentos de línea de comandos
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('\nUso:');
  console.log('  node scripts/generarHash.js <contraseña>');
  console.log('\nEjemplo:');
  console.log('  node scripts/generarHash.js admin123');
  process.exit(1);
}

console.log('🔐 Generando hash de contraseña...\n');

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('✅ Hash generado exitosamente:\n');
    console.log(hash);
    console.log('\n📋 Copia este SQL y ejecútalo en tu base de datos:\n');
    console.log(`UPDATE Usuario SET passwordHash = '${hash}' WHERE correo = 'admin@creativaestudios.com';`);
    console.log('\n💡 O para crear un nuevo usuario:\n');
    console.log(`INSERT INTO Usuario (nombre, correo, rol, passwordHash) VALUES ('Nombre Usuario', 'correo@ejemplo.com', 'recepcionista', '${hash}');`);
  })
  .catch(err => {
    console.error('❌ Error al generar hash:', err.message);
    process.exit(1);
  });
