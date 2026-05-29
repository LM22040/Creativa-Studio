// backend/controllers/pedidosController.js

const db = require('../models/db');

// GET /api/pedidos — Listar todos los pedidos
const listarPedidos = async (req, res) => {
  try {
    db.all(`
      SELECT p.*, u.nombre AS nombreUsuario
      FROM Pedido p
      LEFT JOIN Usuario u ON p.idUsuario = u.idUsuario
      ORDER BY p.fechaPedido DESC
    `, [], (err, rows) => {
      if (err) {
        console.error('Error al listar pedidos:', err);
        return res.status(500).json({ error: 'Error al obtener pedidos' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('Error al listar pedidos:', err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// GET /api/pedidos/:id — Obtener pedido con su detalle
const obtenerPedido = async (req, res) => {
  const { id } = req.params;
  try {
    db.get(
      'SELECT * FROM Pedido WHERE idPedido = ?',
      [id],
      (err, pedido) => {
        if (err) {
          console.error('Error al obtener pedido:', err);
          return res.status(500).json({ error: 'Error al obtener pedido' });
        }
        if (!pedido) {
          return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        db.all(`
          SELECT dp.*, pr.nombre AS nombreProducto
          FROM DetallePedido dp
          JOIN Producto pr ON dp.idProducto = pr.idProducto
          WHERE dp.idPedido = ?
        `, [id], (err, detalle) => {
          if (err) {
            console.error('Error al obtener detalle:', err);
            return res.status(500).json({ error: 'Error al obtener detalle' });
          }
          res.json({ ...pedido, detalle });
        });
      }
    );
  } catch (err) {
    console.error('Error al obtener pedido:', err);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// POST /api/pedidos — Crear nuevo pedido
const crearPedido = async (req, res) => {
  const { nombreCliente, telefonoCliente, productos } = req.body;
  const idUsuario = req.usuario.idUsuario;

  if (!nombreCliente || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos del pedido incompletos' });
  }

  try {
    // Iniciar transacción
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      let total = 0;
      let productosValidados = [];

      // Validar stock y calcular total
      let validacionCompleta = 0;
      productos.forEach((item, index) => {
        db.get(
          'SELECT * FROM Producto WHERE idProducto = ?',
          [item.idProducto],
          (err, producto) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Error al validar productos' });
            }

            if (!producto) {
              db.run('ROLLBACK');
              return res.status(400).json({ error: `Producto con ID ${item.idProducto} no encontrado` });
            }

            if (producto.stockActual < item.cantidad) {
              db.run('ROLLBACK');
              return res.status(400).json({ 
                error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stockActual}` 
              });
            }

            total += parseFloat(producto.precio) * item.cantidad;
            productosValidados.push({ ...item, precio: producto.precio });
            validacionCompleta++;

            // Si ya validamos todos los productos, crear el pedido
            if (validacionCompleta === productos.length) {
              crearPedidoConProductos(nombreCliente, telefonoCliente, total, idUsuario, productosValidados, res);
            }
          }
        );
      });
    });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Función auxiliar para crear el pedido después de validar
function crearPedidoConProductos(nombreCliente, telefonoCliente, total, idUsuario, productos, res) {
  db.run(
    `INSERT INTO Pedido (nombreCliente, telefonoCliente, total, idUsuario)
     VALUES (?, ?, ?, ?)`,
    [nombreCliente, telefonoCliente, total, idUsuario],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        console.error('Error al insertar pedido:', err);
        return res.status(500).json({ error: 'Error al crear pedido' });
      }

      const idPedido = this.lastID;
      let detallesInsertados = 0;

      // Insertar detalles y descontar stock
      productos.forEach((item) => {
        db.run(
          `INSERT INTO DetallePedido (idPedido, idProducto, cantidad, precioUnitario)
           VALUES (?, ?, ?, ?)`,
          [idPedido, item.idProducto, item.cantidad, item.precio],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              console.error('Error al insertar detalle:', err);
              return res.status(500).json({ error: 'Error al crear detalle del pedido' });
            }

            // Descontar del inventario
            db.run(
              `UPDATE Producto SET stockActual = stockActual - ? WHERE idProducto = ?`,
              [item.cantidad, item.idProducto],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  console.error('Error al actualizar stock:', err);
                  return res.status(500).json({ error: 'Error al actualizar inventario' });
                }

                detallesInsertados++;

                // Si ya insertamos todos los detalles, hacer commit
                if (detallesInsertados === productos.length) {
                  db.run('COMMIT', (err) => {
                    if (err) {
                      console.error('Error al hacer commit:', err);
                      return res.status(500).json({ error: 'Error al confirmar pedido' });
                    }

                    res.status(201).json({
                      mensaje: 'Pedido registrado correctamente',
                      pedido: { idPedido, nombreCliente, telefonoCliente, total },
                    });
                  });
                }
              }
            );
          }
        );
      });
    }
  );
}

// PUT /api/pedidos/:id/estado — Actualizar estado del pedido
const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['pendiente', 'en proceso', 'completado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    db.run(
      'UPDATE Pedido SET estado = ? WHERE idPedido = ?',
      [estado, id],
      function(err) {
        if (err) {
          console.error('Error al actualizar estado:', err);
          return res.status(500).json({ error: 'Error al actualizar estado' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Obtener el pedido actualizado
        db.get('SELECT * FROM Pedido WHERE idPedido = ?', [id], (err, row) => {
          if (err) {
            console.error('Error al obtener pedido actualizado:', err);
            return res.status(500).json({ error: 'Error al obtener pedido actualizado' });
          }
          res.json(row);
        });
      }
    );
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

module.exports = { listarPedidos, obtenerPedido, crearPedido, actualizarEstado };
