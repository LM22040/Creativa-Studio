# Creativa Estudios — Sistema de gestión web

Sistema completo de control de inventario y pedidos para Creativa Estudios, una microempresa dedicada a productos promocionales personalizados y publicidad gráfica.

---

## 📋 Descripción

Esta aplicación web permite:
- ✅ **Gestión de inventario** con alertas de stock bajo
- ✅ **Registro y seguimiento de pedidos** de clientes
- ✅ **Actualización automática** de stock al crear pedidos
- ✅ **Control de acceso** con autenticación JWT
- ✅ **Interfaz moderna** y fácil de usar
- ✅ **Validaciones robustas** para prevenir errores

---

## 🗂 Estructura del proyecto

```
creativa-estudios/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # Estado global (Auth)
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Configuración de API
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # Node.js + Express + JWT
│   ├── controllers/   # Lógica de negocio
│   ├── middleware/    # Autenticación
│   ├── models/        # Conexión a BD
│   ├── routes/        # Rutas de la API
│   ├── scripts/       # Utilidades
│   └── server.js
│
└── database/
    └── schema.sql     # Tablas y datos iniciales
```

---

## 🚀 Instalación Rápida

### Requisitos previos
- Node.js 16+
- PostgreSQL 12+

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd creativa-estudios
```

### 2. Configurar la base de datos
```sql
CREATE DATABASE creativa_estudios;
-- Ejecutar database/schema.sql
```

### 3. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Generar hash de contraseña
npm run hash admin123

# Iniciar servidor
npm run dev
```

### 4. Configurar el frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Acceder a la aplicación
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000
- **Credenciales:** admin@creativaestudios.com / admin123

📖 **Para instrucciones detalladas, consulta [INSTALACION.md](./INSTALACION.md)**

---

## 📡 API Endpoints

| Método | Ruta                        | Descripción                  |
|--------|-----------------------------|------------------------------|
| POST   | /api/auth/login             | Iniciar sesión               |
| GET    | /api/productos              | Listar productos             |
| GET    | /api/productos/alertas      | Productos con stock bajo     |
| GET    | /api/productos/:id          | Obtener producto             |
| POST   | /api/productos              | Crear producto               |
| PUT    | /api/productos/:id          | Actualizar producto          |
| DELETE | /api/productos/:id          | Eliminar producto            |
| GET    | /api/pedidos                | Listar pedidos               |
| GET    | /api/pedidos/:id            | Obtener pedido con detalle   |
| POST   | /api/pedidos                | Crear pedido                 |
| PUT    | /api/pedidos/:id/estado     | Cambiar estado del pedido    |

📖 **Documentación completa en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## 🛠 Tecnologías

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas

---

## ✨ Funcionalidades

### 📦 Módulo de Inventario
- Listar todos los productos con información detallada
- Crear, editar y eliminar productos
- Búsqueda en tiempo real por nombre o tipo
- Alertas visuales de stock bajo o agotado
- Validación para prevenir eliminación de productos con pedidos

### 📋 Módulo de Pedidos
- Registrar nuevos pedidos con múltiples productos
- Validación automática de stock disponible
- Cálculo automático de totales
- Ver detalle completo de cada pedido
- Filtrar pedidos por estado
- Cambiar estado de pedidos (pendiente, en proceso, completado, cancelado)
- Actualización automática de inventario

### 🏠 Dashboard
- Estadísticas en tiempo real
- Contador de productos en inventario
- Contador de pedidos registrados
- Alertas de stock bajo
- Accesos rápidos a funciones principales

### 🔐 Seguridad
- Autenticación con JWT
- Tokens con expiración configurable
- Protección de rutas en frontend y backend
- Hash seguro de contraseñas con bcrypt
- Validación de datos en todas las operaciones

---

## 📚 Documentación Adicional

- 📖 [Guía de Instalación Completa](./INSTALACION.md)
- 📡 [Documentación de la API](./API_DOCUMENTATION.md)
- ✨ [Mejoras Implementadas](./MEJORAS_IMPLEMENTADAS.md)

---

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (auto-reload)
npm run hash       # Generar hash de contraseña
```

### Frontend
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Previsualizar build de producción
```

---

## 🔑 Credenciales Iniciales

Después de ejecutar el schema SQL, configura el usuario administrador:

```bash
cd backend
npm run hash admin123
```

Luego ejecuta el SQL generado en tu base de datos.

**Credenciales por defecto:**
- **Correo:** admin@creativaestudios.com
- **Contraseña:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción.

---

## 🧪 Probar la Aplicación

1. Inicia sesión con las credenciales por defecto
2. Explora el dashboard con estadísticas
3. Ve al módulo de Inventario:
   - Agrega nuevos productos
   - Edita productos existentes
   - Observa las alertas de stock bajo
4. Ve al módulo de Pedidos:
   - Crea un nuevo pedido
   - Observa cómo se actualiza el inventario automáticamente
   - Cambia el estado del pedido
   - Ve el detalle completo

---

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error de autenticación
- Verifica que ejecutaste el script de hash
- Confirma que el usuario existe en la BD

### Puerto en uso
- Cambia el puerto en `.env` (backend)
- O detén el proceso que usa el puerto

📖 **Más soluciones en [INSTALACION.md](./INSTALACION.md)**

---

## 🔮 Próximas Mejoras

- [ ] Reportes y gráficos de ventas
- [ ] Gestión de proveedores
- [ ] Facturación electrónica
- [ ] Roles y permisos avanzados
- [ ] Notificaciones por email
- [ ] Historial de cambios
- [ ] Exportar reportes a PDF/Excel
- [ ] App móvil complementaria

---

## 📄 Licencia

Este proyecto fue desarrollado para uso interno de Creativa Estudios.

---

## 👥 Equipo de Desarrollo

Desarrollado con ❤️ para Creativa Estudios

---

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Estado:** ✅ Producción Ready  
**Última actualización:** Mayo 2026
