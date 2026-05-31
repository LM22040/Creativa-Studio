# 🔧 Solución al Problema de Login

## ❌ Problema Identificado

El sistema estaba configurado para usar **PostgreSQL** en el puerto **4000**, pero la base de datos local **SQLite** con los usuarios está en el puerto **3000**.

## ✅ Solución Aplicada

Se actualizó la configuración para usar **SQLite** (base de datos local):

### **Cambios realizados:**

1. ✅ **backend/.env** - Actualizado para usar SQLite en puerto 3000
2. ✅ **frontend/vite.config.js** - Proxy actualizado al puerto 3000
3. ✅ Archivo de configuración de respaldo: `.env.sqlite`

---

## 🚀 Pasos para Solucionar

### **1. Detener los servidores actuales**
Si tienes el backend y frontend corriendo, deténlos con `Ctrl+C`

### **2. Reiniciar el backend**
```bash
cd backend
npm start
```

Deberías ver:
```
✅ Servidor corriendo en http://localhost:3000
✅ Conectado a SQLite exitosamente
```

### **3. Reiniciar el frontend**
```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### **4. Probar el login**
Abre http://localhost:5173 y usa:

**Correo:**
```
admin@creativaestudios.com
```

**Contraseña:**
```
admin123
```

---

## 📋 Credenciales Verificadas

El usuario admin existe en la base de datos:

| ID | Nombre | Correo | Rol | Creado |
|----|--------|--------|-----|--------|
| 1 | Administrador | admin@creativaestudios.com | admin | 2026-05-28 |

---

## 🔍 Verificar que Todo Funcione

### **1. Verificar backend**
```bash
cd backend
node scripts/verUsuarios.js
```

Deberías ver la tabla con el usuario admin.

### **2. Verificar puerto del backend**
Abre: http://localhost:3000/api/productos

Deberías ver un JSON con los productos (o un error de autenticación, lo cual es normal).

### **3. Verificar frontend**
Abre: http://localhost:5173

Deberías ver la pantalla de login.

---

## 🤝 Compartir con tu Compañero

### **Opción 1: Desarrollo Local (Recomendado)**

Cada persona tiene su propia base de datos SQLite local.

**Instrucciones para tu compañero:**

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

6. **Abrir:** http://localhost:5173

7. **Login:**
   - Correo: `admin@creativaestudios.com`
   - Contraseña: `admin123`

---

### **Opción 2: Compartir Proyecto Completo**

Cada persona trabaja con su propia base de datos SQLite local.

**Ventajas:**
- No requiere configuración de servidor
- Cada uno tiene sus propios datos de prueba
- Más simple para desarrollo

**Desventajas:**
- Los datos no se comparten entre computadoras
- Cada uno debe crear sus propios productos/pedidos de prueba

---

## 🐛 Solución de Problemas

### **Error: "Cannot connect to server"**
```bash
# Verificar que el backend esté corriendo
cd backend
npm start

# Verificar el puerto en vite.config.js
# Debe ser: target: 'http://localhost:3000'
```

### **Error: "Error interno del servidor"**
```bash
# Verificar variables de entorno
cd backend
cat .env  # Linux/Mac
type .env  # Windows

# Debe tener:
# PORT=3000
# JWT_SECRET=...
```

### **Error: "Credenciales incorrectas"**
```bash
# Verificar usuarios en la base de datos
cd backend
node scripts/verUsuarios.js

# Si no hay usuarios, reinicializar
node scripts/initDB.js
```

### **Frontend no se actualiza**
```bash
# Limpiar caché y reiniciar
cd frontend
rm -rf node_modules/.vite  # Linux/Mac
rmdir /s node_modules\.vite  # Windows
npm run dev
```

---

## 📝 Archivos de Configuración

### **backend/.env** (Actual - SQLite)
```env
PORT=3000
JWT_SECRET=creativa_secreto_muy_seguro_2024
JWT_EXPIRES_IN=24h
```

### **backend/.env.sqlite** (Backup - SQLite)
```env
PORT=3000
JWT_SECRET=creativa_secreto_muy_seguro_2024
JWT_EXPIRES_IN=24h
```

---

## ✅ Checklist de Verificación

Antes de compartir con tu compañero, verifica:

- [ ] Backend corre en puerto 3000
- [ ] Frontend corre en puerto 5173
- [ ] Proxy en vite.config.js apunta a puerto 3000
- [ ] Archivo .env tiene PORT=3000
- [ ] Base de datos creativa_estudios.db existe
- [ ] Usuario admin existe en la base de datos
- [ ] Login funciona con admin@creativaestudios.com / admin123

---

## 🎉 Resultado Esperado

Después de seguir estos pasos:

1. ✅ Backend corriendo en http://localhost:3000
2. ✅ Frontend corriendo en http://localhost:5173
3. ✅ Login funciona correctamente
4. ✅ Dashboard muestra estadísticas
5. ✅ Inventario y Pedidos funcionan

---

**Última actualización:** Mayo 28, 2026  
**Estado:** ✅ Problema resuelto
