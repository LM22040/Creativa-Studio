# 📦 Guía de Instalación - Creativa Estudios

Esta guía te ayudará a configurar y ejecutar el sistema de gestión de inventarios y pedidos de Creativa Estudios.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **PostgreSQL** (versión 12 o superior) - [Descargar aquí](https://www.postgresql.org/download/)
- **Git** (opcional, para control de versiones)

---

## 🗄️ Paso 1: Configurar la Base de Datos

### 1.1 Crear la base de datos

Abre **pgAdmin** o **psql** y ejecuta:

```sql
CREATE DATABASE creativa_estudios;
```

### 1.2 Ejecutar el esquema

1. Abre el archivo `database/schema.sql`
2. Copia todo su contenido
3. Ejecútalo en tu base de datos `creativa_estudios`

Esto creará todas las tablas necesarias y agregará datos de prueba.

### 1.3 Crear usuario administrador

El archivo `schema.sql` incluye un usuario de prueba, pero necesitas generar el hash de la contraseña:

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log('UPDATE Usuario SET passwordHash = \\'' + hash + '\\' WHERE correo = \\'admin@creativaestudios.com\\';'));"
```

Copia el resultado y ejecútalo en tu base de datos.

**Credenciales por defecto:**
- **Correo:** admin@creativaestudios.com
- **Contraseña:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción.

---

## ⚙️ Paso 2: Configurar el Backend

### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

### 2.2 Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
PORT=4000

# Conexión a PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=creativa_estudios
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui

# Secreto para JWT (cámbialo por algo único y seguro)
JWT_SECRET=creativa_secreto_muy_seguro_2024

# Tiempo de expiración del token
JWT_EXPIRES_IN=8h
```

### 2.3 Iniciar el servidor

**Modo desarrollo (con auto-recarga):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: **http://localhost:4000**

---

## 🎨 Paso 3: Configurar el Frontend

### 3.1 Instalar dependencias

Abre una nueva terminal y ejecuta:

```bash
cd frontend
npm install
```

### 3.2 Iniciar la aplicación

**Modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

**Compilar para producción:**
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

---

## 🚀 Paso 4: Verificar la Instalación

1. Abre tu navegador en **http://localhost:5173**
2. Inicia sesión con las credenciales:
   - **Correo:** admin@creativaestudios.com
   - **Contraseña:** admin123
3. Deberías ver el dashboard con las estadísticas

---

## 🧪 Probar las Funcionalidades

### ✅ Inventario
- Ver listado de productos
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos (solo si no tienen pedidos)
- Ver alertas de stock bajo
- Buscar productos por nombre o tipo

### ✅ Pedidos
- Crear nuevos pedidos
- Ver listado de pedidos
- Filtrar por estado (pendiente, en proceso, completado, cancelado)
- Ver detalle completo de cada pedido
- Cambiar estado de pedidos
- Actualización automática de inventario

### ✅ Dashboard
- Ver estadísticas generales
- Accesos rápidos a funciones principales

---

## 🔧 Solución de Problemas

### Error de conexión a la base de datos

**Síntoma:** `Error conectando a PostgreSQL`

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Confirma que las credenciales en `.env` sean correctas
3. Asegúrate de que la base de datos `creativa_estudios` exista

### Error de autenticación

**Síntoma:** `Credenciales incorrectas`

**Solución:**
1. Verifica que ejecutaste el script para generar el hash de la contraseña
2. Confirma que el usuario existe en la tabla `Usuario`
3. Intenta regenerar el hash de la contraseña

### Puerto ya en uso

**Síntoma:** `Port 4000 is already in use`

**Solución:**
1. Cambia el puerto en el archivo `.env` del backend
2. O detén el proceso que está usando el puerto 4000

### Error de CORS

**Síntoma:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solución:**
1. Verifica que el backend esté corriendo en el puerto 4000
2. Confirma que el proxy en `vite.config.js` esté configurado correctamente

---

## 📚 Estructura del Proyecto

```
creativa-estudios/
├── backend/
│   ├── controllers/      # Lógica de negocio
│   ├── middleware/       # Autenticación JWT
│   ├── models/          # Conexión a BD
│   ├── routes/          # Rutas de la API
│   ├── .env.example     # Plantilla de variables
│   ├── package.json
│   └── server.js        # Punto de entrada
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── context/     # Estado global (Auth)
│   │   ├── pages/       # Páginas principales
│   │   ├── services/    # Configuración de API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── database/
    └── schema.sql       # Esquema de BD
```

---

## 🔐 Seguridad

### Recomendaciones para producción:

1. **Cambia las credenciales por defecto**
2. **Usa un JWT_SECRET fuerte y único**
3. **Configura HTTPS** en el servidor
4. **Limita el acceso a la base de datos** solo desde el servidor backend
5. **Implementa rate limiting** para prevenir ataques de fuerza bruta
6. **Mantén las dependencias actualizadas**

---

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisa los logs del servidor backend
2. Verifica la consola del navegador para errores del frontend
3. Confirma que todas las dependencias se instalaron correctamente

---

## 🎯 Próximos Pasos

Una vez que el sistema esté funcionando:

1. Personaliza los productos en el inventario
2. Configura los niveles de stock mínimo según tus necesidades
3. Capacita a los empleados en el uso del sistema
4. Considera implementar backups automáticos de la base de datos

---

¡Listo! Tu sistema de gestión para Creativa Estudios está configurado y funcionando. 🎉
