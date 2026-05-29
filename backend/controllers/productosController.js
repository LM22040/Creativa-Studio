// backend/controllers/productosController.js

const db = require('../models/db');

// GET /api/productos — Listar todos los productos
const listarProductos = async (req, res) => {
  try {
    db.all(`
      SELECT *, 
        CASE 
          WHEN stockActual = 0 THEN 'agotado'
          WHEN stockActual <= stockMinimo THEN 'bajo'
          ELSE 'normal'
        END as estadoStock
      FROM Producto 
      ORDER BY nombre ASC
    `, [], (err, rows) => {
      if (err) {
        console.error('Error al listar productos:', err);
        return res.status(500).json({ error: 'Error al obtener productos' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('Error al listar productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// GET /api/productos/alertas — Productos con stock bajo
const productosStockBajo = async (req, res) => {
  try {
    db.all(
      'SELECT * FROM Producto WHERE stockActual <= stockMinimo ORDER BY stockActual ASC',
      [],
      (err, rows) => {
        if (err) {
          console.error('Error al obtener alertas de stock:', err);
          return res.status(500).json({ error: 'Error al obtener alertas' });
        }
        res.json(rows);
      }
    );
  } catch (err) {
    console.error('Error al obtener alertas de stock:', err);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// GET /api/productos/:id — Obtener un producto por ID
const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  try {
    db.get(
      'SELECT * FROM Producto WHERE idProducto = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('Error al obtener producto:', err);
          return res.status(500).json({ error: 'Error al obtener producto' });
        }
        if (!row) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(row);
      }
    );
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// POST /api/productos — Crear nuevo producto
const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, tipo, stockActual, stockMinimo } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }

  try {
    db.run(
      `INSERT INTO Producto (nombre, descripcion, precio, tipo, stockActual, stockMinimo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, tipo, stockActual || 0, stockMinimo || 5],
      function(err) {
        if (err) {
          console.error('Error al crear producto:', err);
          return res.status(500).json({ error: 'Error al crear producto' });
        }
        
        // Obtener el producto recién creado
        db.get('SELECT * FROM Producto WHERE idProducto = ?', [this.lastID], (err, row) => {
          if (err) {
            console.error('Error al obtener producto creado:', err);
            return res.status(500).json({ error: 'Error al obtener producto creado' });
          }
          res.status(201).json(row);
        });
      }
    );
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// PUT /api/productos/:id — Actualizar producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, tipo, stockActual, stockMinimo } = req.body;

  try {
    db.run(
      `UPDATE Producto
       SET nombre=?, descripcion=?, precio=?, tipo=?, stockActual=?, stockMinimo=?
       WHERE idProducto=?`,
      [nombre, descripcion, precio, tipo, stockActual, stockMinimo, id],
      function(err) {
        if (err) {
          console.error('Error al actualizar producto:', err);
          return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Obtener el producto actualizado
        db.get('SELECT * FROM Producto WHERE idProducto = ?', [id], (err, row) => {
          if (err) {
            console.error('Error al obtener producto actualizado:', err);
            return res.status(500).json({ error: 'Error al obtener producto actualizado' });
          }
          res.json(row);
        });
      }
    );
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// DELETE /api/productos/:id — Eliminar producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el producto tiene pedidos asociados
    db.get(
      'SELECT COUNT(*) as total FROM DetallePedido WHERE idProducto = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('Error al verificar pedidos:', err);
          return res.status(500).json({ error: 'Error al verificar pedidos' });
        }

        if (row.total > 0) {
          return res.status(400).json({ 
            error: 'No se puede eliminar el producto porque tiene pedidos asociados' 
          });
        }

        // Eliminar el producto
        db.run(
          'DELETE FROM Producto WHERE idProducto = ?',
          [id],
          function(err) {
            if (err) {
              console.error('Error al eliminar producto:', err);
              return res.status(500).json({ error: 'Error al eliminar producto' });
            }
            if (this.changes === 0) {
              return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ mensaje: 'Producto eliminado correctamente' });
          }
        );
      }
    );
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  listarProductos,
  productosStockBajo,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
