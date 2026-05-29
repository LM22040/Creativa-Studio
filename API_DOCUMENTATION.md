# 📡 Documentación de la API - Creativa Estudios

Esta documentación describe todos los endpoints disponibles en la API REST del sistema.

**Base URL:** `http://localhost:4000/api`

---

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT (JSON Web Token).

### Obtener Token

**POST** `/auth/login`

Inicia sesión y obtiene un token de acceso.

**Body:**
```json
{
  "correo": "admin@creativaestudios.com",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Sesión iniciada correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "idUsuario": 1,
    "nombre": "Administrador",
    "correo": "admin@creativaestudios.com",
    "rol": "admin"
  }
}
```

**Errores:**
- `400` - Correo y contraseña son requeridos
- `401` - Credenciales incorrectas

### Usar el Token

Incluye el token en el header `Authorization` de todas las peticiones protegidas:

```
Authorization: Bearer <tu_token_aqui>
```

---

## 📦 Productos

### Listar todos los productos

**GET** `/productos`

**Headers:** `Authorization: Bearer <token>`

**Respuesta (200):**
```json
[
  {
    "idproducto": 1,
    "nombre": "Taza personalizada",
    "descripcion": "Taza cerámica con impresión full color",
    "precio": "8.50",
    "tipo": "Taza",
    "stockactual": 20,
    "stockminimo": 5,
    "creadoen": "2024-01-15T10:30:00.000Z",
    "estadostock": "normal"
  }
]
```

---

### Obtener productos con stock bajo

**GET** `/productos/alertas`

**Headers:** `Authorization: Bearer <token>`

Retorna productos donde `stockactual <= stockminimo`

**Respuesta (200):**
```json
[
  {
    "idproducto": 4,
    "nombre": "Bolsa tote bag",
    "stockactual": 3,
    "stockminimo": 5,
    ...
  }
]
```

---

### Obtener un producto por ID

**GET** `/productos/:id`

**Headers:** `Authorization: Bearer <token>`

**Parámetros:**
- `id` - ID del producto

**Respuesta (200):**
```json
{
  "idproducto": 1,
  "nombre": "Taza personalizada",
  "descripcion": "Taza cerámica con impresión full color",
  "precio": "8.50",
  "tipo": "Taza",
  "stockactual": 20,
  "stockminimo": 5,
  "creadoen": "2024-01-15T10:30:00.000Z"
}
```

**Errores:**
- `404` - Producto no encontrado

---

### Crear un producto

**POST** `/productos`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombre": "Llavero personalizado",
  "descripcion": "Llavero acrílico con diseño",
  "precio": 3.50,
  "tipo": "Llavero",
  "stockactual": 100,
  "stockminimo": 20
}
```

**Respuesta (201):**
```json
{
  "idproducto": 6,
  "nombre": "Llavero personalizado",
  "descripcion": "Llavero acrílico con diseño",
  "precio": "3.50",
  "tipo": "Llavero",
  "stockactual": 100,
  "stockminimo": 20,
  "creadoen": "2024-05-23T14:30:00.000Z"
}
```

**Errores:**
- `400` - Nombre y precio son requeridos

---

### Actualizar un producto

**PUT** `/productos/:id`

**Headers:** `Authorization: Bearer <token>`

**Parámetros:**
- `id` - ID del producto

**Body:**
```json
{
  "nombre": "Taza personalizada premium",
  "descripcion": "Taza cerámica premium con impresión HD",
  "precio": 10.00,
  "tipo": "Taza",
  "stockactual": 25,
  "stockminimo": 5
}
```

**Respuesta (200):**
```json
{
  "idproducto": 1,
  "nombre": "Taza personalizada premium",
  ...
}
```

**Errores:**
- `404` - Producto no encontrado

---

### Eliminar un producto

**DELETE** `/productos/:id`

**Headers:** `Authorization: Bearer <token>`

**Parámetros:**
- `id` - ID del producto

**Respuesta (200):**
```json
{
  "mensaje": "Producto eliminado correctamente",
  "producto": {
    "idproducto": 6,
    "nombre": "Llavero personalizado",
    ...
  }
}
```

**Errores:**
- `400` - No se puede eliminar el producto porque tiene pedidos asociados
- `404` - Producto no encontrado

---

## 📋 Pedidos

### Listar todos los pedidos

**GET** `/pedidos`

**Headers:** `Authorization: Bearer <token>`

**Respuesta (200):**
```json
[
  {
    "idpedido": 1,
    "nombrecliente": "Juan Pérez",
    "telefonocliente": "7777-7777",
    "fechapedido": "2024-05-20T15:30:00.000Z",
    "estado": "completado",
    "total": "42.50",
    "idusuario": 1,
    "nombreusuario": "Administrador"
  }
]
```

---

### Obtener un pedido con detalle

**GET** `/pedidos/:id`

**Headers:** `Authorization: Bearer <token>`

**Parámetros:**
- `id` - ID del pedido

**Respuesta (200):**
```json
{
  "idpedido": 1,
  "nombrecliente": "Juan Pérez",
  "telefonocliente": "7777-7777",
  "fechapedido": "2024-05-20T15:30:00.000Z",
  "estado": "completado",
  "total": "42.50",
  "idusuario": 1,
  "detalle": [
    {
      "iddetalle": 1,
      "idpedido": 1,
      "idproducto": 1,
      "cantidad": 5,
      "preciounitario": "8.50",
      "nombreproducto": "Taza personalizada"
    }
  ]
}
```

**Errores:**
- `404` - Pedido no encontrado

---

### Crear un pedido

**POST** `/pedidos`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombreCliente": "María González",
  "telefonoCliente": "7888-8888",
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 3
    },
    {
      "idProducto": 2,
      "cantidad": 2
    }
  ]
}
```

**Respuesta (201):**
```json
{
  "mensaje": "Pedido registrado correctamente",
  "pedido": {
    "idpedido": 5,
    "nombrecliente": "María González",
    "telefonocliente": "7888-8888",
    "fechapedido": "2024-05-23T16:00:00.000Z",
    "estado": "pendiente",
    "total": 49.50,
    "idusuario": 1
  }
}
```

**Notas importantes:**
- El stock se descuenta automáticamente
- La operación es transaccional (todo o nada)
- Se valida que haya stock suficiente antes de crear el pedido

**Errores:**
- `400` - Datos del pedido incompletos
- `400` - Stock insuficiente para "Producto X". Disponible: Y
- `400` - Producto con ID X no encontrado

---

### Actualizar estado de un pedido

**PUT** `/pedidos/:id/estado`

**Headers:** `Authorization: Bearer <token>`

**Parámetros:**
- `id` - ID del pedido

**Body:**
```json
{
  "estado": "completado"
}
```

**Estados válidos:**
- `pendiente`
- `en proceso`
- `completado`
- `cancelado`

**Respuesta (200):**
```json
{
  "idpedido": 5,
  "nombrecliente": "María González",
  "estado": "completado",
  ...
}
```

**Errores:**
- `400` - Estado no válido
- `404` - Pedido no encontrado

---

## 🔒 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos o incompletos |
| 401 | Unauthorized - Token no proporcionado o inválido |
| 403 | Forbidden - Token expirado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@creativaestudios.com","password":"admin123"}'
```

### Listar productos
```bash
curl -X GET http://localhost:4000/api/productos \
  -H "Authorization: Bearer <tu_token>"
```

### Crear producto
```bash
curl -X POST http://localhost:4000/api/productos \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto nuevo","precio":15.00,"stockactual":50,"stockminimo":10}'
```

### Crear pedido
```bash
curl -X POST http://localhost:4000/api/pedidos \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombreCliente":"Cliente Test","productos":[{"idProducto":1,"cantidad":2}]}'
```

---

## 🧪 Ejemplos con JavaScript (Axios)

### Configuración inicial
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Agregar token automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Login
```javascript
const login = async (correo, password) => {
  const response = await api.post('/auth/login', { correo, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};
```

### Obtener productos
```javascript
const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};
```

### Crear pedido
```javascript
const crearPedido = async (pedido) => {
  const response = await api.post('/pedidos', pedido);
  return response.data;
};
```

---

## 📝 Notas Importantes

1. **Tokens JWT:** Los tokens expiran según la configuración en `.env` (por defecto 8 horas)
2. **Transacciones:** Los pedidos usan transacciones de base de datos para garantizar consistencia
3. **Stock:** El stock se actualiza automáticamente al crear pedidos
4. **Validaciones:** Todas las entradas son validadas antes de procesarse
5. **CORS:** El servidor acepta peticiones desde `http://localhost:5173` en desarrollo

---

## 🔧 Variables de Entorno

Configura estas variables en el archivo `.env`:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=creativa_estudios
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=8h
```

---

## 📞 Soporte

Para reportar problemas o sugerencias sobre la API, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Mayo 2026
