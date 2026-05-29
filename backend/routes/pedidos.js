// backend/routes/pedidos.js
const express        = require('express');
const router         = express.Router();
const verificarToken = require('../middleware/auth');
const {
  listarPedidos,
  obtenerPedido,
  crearPedido,
  actualizarEstado,
} = require('../controllers/pedidosController');

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.get('/',             listarPedidos);
router.get('/:id',          obtenerPedido);
router.post('/',            crearPedido);
router.put('/:id/estado',   actualizarEstado);

module.exports = router;
