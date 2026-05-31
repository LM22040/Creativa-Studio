# 🔐 Solución: Hash de Contraseña Corregido

## ❌ Problema Identificado

El hash de contraseña en el schema SQL original era un **placeholder/ejemplo** que no correspondía a la contraseña `admin123`. Esto causaba que el login fallara con "Credenciales incorrectas".

### **Hash Incorrecto (Anterior):**
```
$2b$10$Da3az9o4fVnwtDPBDqOSJOml3KBSlb8C.1CumkJQJ52ONimanOxeG
```

### **Hash Correcto (Nuevo):**
```
$2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.
```

---

## ✅ Solución Aplicada

### **Archivos Actualizados:**

1. ✅ **database/schema_sqlite.sql** - Hash correcto
2. ✅ **Base de datos actual** - Hash actualizado
3. ✅ **Script nuevo:** `backend/scripts/actualizarHashAdmin.js`

---

## 🚀 Para Tu Compañero

Si tu compañero ya tiene el proyecto instalado pero no puede iniciar sesión, debe seguir estos pasos:

### **Opción 1: Actualizar el Hash (Recomendado)**

```bash
cd backend
node scripts/actualizarHashAdmin.js
```

**Deberá ver:**
```
✅ Hash actualizado exitosamente!
✅ Verificación exitosa: El hash es correcto
🎉 Ahora puedes iniciar sesión con las credenciales por defecto
```

---

### **Opción 2: Reinicializar la Base de Datos**

```bash
cd backend

# Windows
del creativa_estudios.db

# Linux/Mac
rm creativa_estudios.db

# Reinicializar
node scripts/initDB.js
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los productos y pedidos registrados.

---

### **Opción 3: Actualización Manual con SQL**

Si prefiere actualizar manualmente:

```bash
cd backend
sqlite3 creativa_estudios.db
```

```sql
UPDATE Usuario 
SET passwordHash = '$2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.' 
WHERE correo = 'admin@creativaestudios.com';

.exit
```

---

## 🔍 Verificar que Funciona

### **1. Verificar el usuario:**
```bash
cd backend
node scripts/verUsuarios.js
```

**Deberías ver:**
```
✅ Se encontraron 1 usuario(s):
┌─────────┬───────────┬─────────────────┬─────────────────────────────┐
│ (index) │ idUsuario │ nombre          │ correo                      │
├─────────┼───────────┼─────────────────┼─────────────────────────────┤
│ 0       │ 1         │ 'Administrador' │ 'admin@creativaestudios.com'│
└─────────┴───────────┴─────────────────┴─────────────────────────────┘
```

### **2. Probar el login:**
1. Abrir: http://localhost:5173
2. Ingresar:
   - **Correo:** admin@creativaestudios.com
   - **Contraseña:** admin123
3. Debería iniciar sesión correctamente

---

## 📋 Credenciales Confirmadas

**Usuario Administrador:**
```
Correo: admin@creativaestudios.com
Contraseña: admin123
Hash: $2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.
```

**✅ Verificado:** El hash corresponde correctamente a la contraseña `admin123`

---

## 🛠️ Scripts Disponibles

### **1. Actualizar Hash del Admin**
```bash
cd backend
node scripts/actualizarHashAdmin.js
```
Actualiza el hash del usuario admin a la contraseña correcta.

### **2. Ver Usuarios**
```bash
cd backend
node scripts/verUsuarios.js
```
Muestra todos los usuarios en la base de datos.

### **3. Generar Hash Personalizado**
```bash
cd backend
node scripts/generarHash.js <contraseña>
```
Genera un hash para cualquier contraseña.

**Ejemplo:**
```bash
node scripts/generarHash.js miNuevaContraseña123
```

### **4. Inicializar Base de Datos**
```bash
cd backend
node scripts/initDB.js
```
Crea la base de datos desde cero con el hash correcto.

---

## 🔐 Cómo Funciona bcrypt

### **Generación del Hash:**
```javascript
const bcrypt = require('bcrypt');
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log(hash);
    // $2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.
  });
```

### **Verificación del Hash:**
```javascript
const bcrypt = require('bcrypt');
const password = 'admin123';
const hash = '$2b$10$QMRvbNVqbxmpNndB.cpNReTpgmcCHNq9kdnVbwBgbbW73hr6bkIy.';

bcrypt.compare(password, hash)
  .then(isValid => {
    console.log(isValid); // true
  });
```

### **Características:**
- ✅ **Salt automático:** Cada hash es único
- ✅ **10 rounds:** Balance entre seguridad y rendimiento
- ✅ **Irreversible:** No se puede obtener la contraseña del hash
- ✅ **Resistente a ataques:** Rainbow tables no funcionan

---

## 🤔 ¿Por Qué Pasó Esto?

El hash original en el schema SQL era un **ejemplo/placeholder** que probablemente correspondía a una contraseña diferente o era un hash de prueba. Al generar un nuevo hash específicamente para `admin123`, ahora el login funciona correctamente.

### **Lección Aprendida:**
Siempre generar hashes específicos para las contraseñas que se van a usar, no copiar hashes de ejemplos.

---

## 📝 Para Nuevas Instalaciones

Si alguien más instala el proyecto desde cero:

1. **Clonar el repositorio** (ya tiene el hash correcto)
2. **Instalar dependencias**
3. **Ejecutar:** `node scripts/initDB.js`
4. **Login con:** admin@creativaestudios.com / admin123

**✅ Funcionará correctamente** porque los schemas ya tienen el hash correcto.

---

## 🔄 Para Instalaciones Existentes

Si ya tenías el proyecto instalado antes de esta corrección:

1. **Opción A:** Ejecutar `node scripts/actualizarHashAdmin.js`
2. **Opción B:** Reinicializar con `node scripts/initDB.js`
3. **Opción C:** Actualizar manualmente con SQL

---

## ✅ Verificación Final

Después de aplicar la solución, verifica:

- [ ] Script `actualizarHashAdmin.js` ejecutado exitosamente
- [ ] Script `verUsuarios.js` muestra el usuario admin
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Login funciona con admin@creativaestudios.com / admin123
- [ ] Dashboard se muestra correctamente

---

## 🆘 Si Aún No Funciona

### **1. Verificar que el backend esté corriendo:**
```bash
cd backend
npm start
```

### **2. Verificar el puerto:**
- Backend debe estar en: http://localhost:3000
- Frontend debe estar en: http://localhost:5173

### **3. Verificar el archivo .env:**
```env
PORT=3000
JWT_SECRET=creativa_secreto_muy_seguro_2024
JWT_EXPIRES_IN=24h
```

### **4. Limpiar caché del navegador:**
- Ctrl+Shift+R (forzar recarga)
- O abrir en modo incógnito

### **5. Revisar logs del backend:**
Buscar errores en la terminal donde corre el backend.

---

## 📞 Soporte Adicional

Si después de seguir todos estos pasos aún hay problemas:

1. Verificar que Node.js esté actualizado (v16+)
2. Verificar que bcrypt esté instalado correctamente
3. Revisar los logs del backend para errores específicos
4. Consultar [GUIA_INSTALACION_COMPLETA.md](./GUIA_INSTALACION_COMPLETA.md)

---

## 🎉 Conclusión

El problema del hash incorrecto ha sido **completamente resuelto**:

- ✅ Schemas SQL actualizados con hash correcto
- ✅ Base de datos actual actualizada
- ✅ Script de actualización creado para futuras instalaciones
- ✅ Documentación completa del problema y solución

**Ahora todos pueden iniciar sesión correctamente con:**
- Correo: admin@creativaestudios.com
- Contraseña: admin123

---

**Fecha de corrección:** Mayo 28, 2026  
**Versión:** 2.0.1  
**Estado:** ✅ Resuelto y Verificado
