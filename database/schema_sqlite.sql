-- ============================================
-- CREATIVA ESTUDIOS - Schema SQLite
-- ============================================

-- Tabla de Usuarios (empleados internos)
CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  correo        TEXT UNIQUE NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'recepcionista',
  passwordHash  TEXT NOT NULL,
  creadoEn      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS Producto (
  idProducto    INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  precio        REAL NOT NULL,
  tipo          TEXT,
  stockActual   INTEGER NOT NULL DEFAULT 0,
  stockMinimo   INTEGER NOT NULL DEFAULT 5,
  creadoEn      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS Pedido (
  idPedido        INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreCliente   TEXT NOT NULL,
  telefonoCliente TEXT,
  fechaPedido     DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado          TEXT NOT NULL DEFAULT 'pendiente',
  total           REAL NOT NULL DEFAULT 0,
  idUsuario       INTEGER,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Tabla de Detalle de Pedido
CREATE TABLE IF NOT EXISTS DetallePedido (
  idDetalle       INTEGER PRIMARY KEY AUTOINCREMENT,
  idPedido        INTEGER,
  idProducto      INTEGER,
  cantidad        INTEGER NOT NULL,
  precioUnitario  REAL NOT NULL,
  FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuario admin (contraseña: admin123)
INSERT OR IGNORE INTO Usuario (nombre, correo, rol, passwordHash) VALUES
  ('Administrador', 'admin@creativaestudios.com', 'admin', '$2b$10$Da3az9o4fVnwtDPBDqOSJOml3KBSlb8C.1CumkJQJ52ONimanOxeG');

-- Productos de ejemplo
INSERT OR IGNORE INTO Producto (nombre, descripcion, precio, tipo, stockActual, stockMinimo) VALUES
  ('Taza personalizada', 'Taza cerámica con impresión full color', 8.50, 'Taza', 20, 5),
  ('Camiseta estampada', 'Camiseta 100% algodón con diseño personalizado', 12.00, 'Ropa', 15, 5),
  ('Lapicero grabado', 'Lapicero metálico con grabado láser', 2.50, 'Lapicero', 50, 10),
  ('Bolsa tote bag', 'Bolsa de tela con impresión serigráfica', 6.00, 'Bolsa', 3, 5),
  ('Gorra bordada', 'Gorra con bordado personalizado', 10.00, 'Ropa', 8, 5);
