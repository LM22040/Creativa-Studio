# 🔐 Credenciales de Acceso - Creativa Estudios

## 👤 Usuario Administrador

**Correo electrónico:**
```
admin@creativaestudios.com
```

**Contraseña:**
```
admin123
```

**Rol:** Administrador (acceso completo)

---

## 🔧 Solución de Problemas

### ❌ Error: "Error interno del servidor"

Si aparece este error al intentar iniciar sesión, sigue estos pasos:

#### **1. Verificar que el backend esté corriendo**
```bash
cd backend
npm start
```

Deberías ver:
```
✅ Servidor corriendo en http://localhost:3000
✅ Base de datos conectada
```

#### **2. Verificar que la base de datos esté inicializada**
```bash
cd backend
node scripts/initDB.js
```

Deberías ver:
```
✅ Base de datos inicializada correctamente
```

#### **3. Verificar las variables de entorno**
Asegúrate de que el archivo `backend/.env` exista y contenga:
```env
PORT=3000
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

#### **4. Reiniciar el backend**
```bash
# Detener el servidor (Ctrl+C)
# Volver a iniciar
cd backend
npm start
```

#### **5. Verificar la consola del backend**
Revisa la terminal donde corre el backend para ver errores específicos.

---

## 🆕 Crear Nuevos Usuarios

### **Opción 1: Generar hash de contraseña**

1. Ejecuta el script para generar el hash:
```bash
cd backend
node scripts/generarHash.js
```

2. Ingresa la contraseña cuando se solicite

3. Copia el hash generado

4. Inserta el usuario en la base de datos:
```sql
INSERT INTO Usuario (nombre, correo, rol, passwordHash) 
VALUES ('Nombre Usuario', 'usuario@email.com', 'recepcionista', 'HASH_AQUI');
```

### **Opción 2: Usar SQLite directamente**

1. Abre la base de datos:
```bash
cd backend
sqlite3 creativa_estudios.db
```

2. Inserta el usuario (usa el hash del usuario admin como ejemplo):
```sql
INSERT INTO Usuario (nombre, correo, rol, passwordHash) 
VALUES (
  'Juan Pérez', 
  'juan@creativaestudios.com', 
  'recepcionista', 
  '$2b$10$Da3az9o4fVnwtDPBDqOSJOml3KBSlb8C.1CumkJQJ52ONimanOxeG'
);
```

3. Salir:
```sql
.exit
```

---

## 📋 Roles Disponibles

### **admin**
- Acceso completo al sistema
- Puede gestionar productos
- Puede gestionar pedidos
- Puede ver todas las estadísticas

### **recepcionista**
- Puede registrar pedidos
- Puede ver inventario
- Puede actualizar estado de pedidos
- Acceso limitado a estadísticas

---

## 🔍 Verificar Usuarios en la Base de Datos

### **Usando SQLite CLI:**
```bash
cd backend
sqlite3 creativa_estudios.db
```

```sql
-- Ver todos los usuarios
SELECT idUsuario, nombre, correo, rol FROM Usuario;

-- Ver usuario específico
SELECT * FROM Usuario WHERE correo = 'admin@creativaestudios.com';

-- Salir
.exit
```

### **Usando Node.js:**
Crea un archivo `backend/scripts/verUsuarios.js`:
```javascript
const db = require('../models/db');

db.all('SELECT idUsuario, nombre, correo, rol FROM Usuario', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Usuarios en la base de datos:');
    console.table(rows);
  }
  db.close();
});
```

Ejecuta:
```bash
cd backend
node scripts/verUsuarios.js
```

---

## 🚨 Problemas Comunes

### **1. "Credenciales incorrectas"**
- ✅ Verifica que el correo sea exactamente: `admin@creativaestudios.com`
- ✅ Verifica que la contraseña sea exactamente: `admin123`
- ✅ No debe haber espacios antes o después

### **2. "Error interno del servidor"**
- ✅ Verifica que el backend esté corriendo
- ✅ Verifica que la base de datos exista (`backend/creativa_estudios.db`)
- ✅ Verifica las variables de entorno en `backend/.env`
- ✅ Revisa los logs del backend en la consola

### **3. "Cannot connect to server"**
- ✅ Verifica que el backend esté corriendo en el puerto 3000
- ✅ Verifica que no haya otro proceso usando el puerto 3000
- ✅ Verifica la URL en `frontend/src/services/api.js`

### **4. CORS Error**
- ✅ Verifica que el backend tenga configurado CORS
- ✅ Verifica que el frontend esté corriendo en el puerto correcto

---

## 🔄 Reiniciar Base de Datos (CUIDADO: Borra todos los datos)

Si necesitas empezar de cero:

```bash
cd backend

# Eliminar base de datos actual
rm creativa_estudios.db

# Reinicializar
node scripts/initDB.js

# Reiniciar backend
npm start
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los productos y pedidos registrados.

---

## 📞 Compartir con Compañeros

### **Instrucciones para tu compañero:**

1. **Clonar/Recibir el proyecto**

2. **Instalar dependencias:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. **Inicializar base de datos:**
```bash
cd backend
node scripts/initDB.js
```

4. **Iniciar backend:**
```bash
cd backend
npm start
```

5. **Iniciar frontend (en otra terminal):**
```bash
cd frontend
npm run dev
```

6. **Abrir en navegador:**
```
http://localhost:5173
```

7. **Iniciar sesión con:**
```
Correo: admin@creativaestudios.com
Contraseña: admin123
```

---

## 🔐 Seguridad en Producción

**⚠️ IMPORTANTE:** Antes de desplegar en producción:

1. **Cambiar JWT_SECRET** en `.env`:
```env
JWT_SECRET=un_secreto_muy_largo_y_aleatorio_generado_con_openssl
```

2. **Cambiar contraseña del admin:**
```bash
cd backend
node scripts/generarHash.js
# Ingresa nueva contraseña
# Actualiza en la base de datos
```

3. **Usar HTTPS** en producción

4. **Configurar variables de entorno** en el servidor

5. **No compartir** el archivo `.env`

---

## 📝 Notas Adicionales

- El token JWT expira en 24 horas por defecto
- Las contraseñas se almacenan hasheadas con bcrypt (10 rounds)
- El sistema usa SQLite para desarrollo (considera PostgreSQL/MySQL para producción)
- Los usuarios solo pueden ser creados directamente en la base de datos (no hay registro público)

---

**Última actualización:** Mayo 28, 2026  
**Versión del sistema:** 2.0.0
