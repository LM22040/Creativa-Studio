// backend/routes/productos.js
const express        = require('express');
const router         = express.Router();
const verificarToken = require('../middleware/auth');
const {
  listarProductos,
  productosStockBajo,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.get('/',         listarProductos);
router.get('/alertas',  productosStockBajo);
router.get('/:id',      obtenerProducto);
router.post('/',        crearProducto);
router.put('/:id',      actualizarProducto);
router.delete('/:id',   eliminarProducto);

module.exports = router;
