// backend/server.js — Punto de entrada del servidor

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

const authRoutes     = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const pedidosRoutes  = require('./routes/pedidos');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares globales ───────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // URL del frontend Vite
app.use(express.json());

// ── Rutas ─────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos',   pedidosRoutes);

// Ruta raíz para verificar que el server corre
app.get('/', (req, res) => {
  res.json({ mensaje: '✅ API Creativa Estudios funcionando correctamente' });
});

// ── Iniciar servidor ───────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
