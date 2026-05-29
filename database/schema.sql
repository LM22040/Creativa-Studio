-- ============================================
-- CREATIVA ESTUDIOS - Schema de Base de Datos
-- ============================================

-- Tabla de Usuarios (empleados internos)
CREATE TABLE Usuario (
  idUsuario     SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  correo        VARCHAR(150) UNIQUE NOT NULL,
  rol           VARCHAR(50) NOT NULL DEFAULT 'recepcionista',
  passwordHash  TEXT NOT NULL,
  creadoEn      TIMESTAMP DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE Producto (
  idProducto    SERIAL PRIMARY KEY,
  nombre        VARCHAR(150) NOT NULL,
  descripcion   TEXT,
  precio        NUMERIC(10, 2) NOT NULL,
  tipo          VARCHAR(100),
  stockActual   INTEGER NOT NULL DEFAULT 0,
  stockMinimo   INTEGER NOT NULL DEFAULT 5,
  creadoEn      TIMESTAMP DEFAULT NOW()
);

-- Tabla de Pedidos
CREATE TABLE Pedido (
  idPedido      SERIAL PRIMARY KEY,
  nombreCliente VARCHAR(150) NOT NULL,
  telefonoCliente VARCHAR(20),
  fechaPedido   TIMESTAMP DEFAULT NOW(),
  estado        VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  total         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  idUsuario     INTEGER REFERENCES Usuario(idUsuario)
);

-- Tabla de Detalle de Pedido
CREATE TABLE DetallePedido (
  idDetalle       SERIAL PRIMARY KEY,
  idPedido        INTEGER REFERENCES Pedido(idPedido) ON DELETE CASCADE,
  idProducto      INTEGER REFERENCES Producto(idProducto),
  cantidad        INTEGER NOT NULL,
  precioUnitario  NUMERIC(10, 2) NOT NULL
);

-- ============================================
-- DATOS INICIALES DE PRUEBA
-- ============================================

-- Usuario admin (contraseña: admin123 — cambiar en producción)
INSERT INTO Usuario (nombre, correo, rol, passwordHash) VALUES
  ('Administrador', 'admin@creativaestudios.com', 'admin', '$2b$10$wJz7Q1234examplehashplaceholder');

-- Productos de ejemplo
INSERT INTO Producto (nombre, descripcion, precio, tipo, stockActual, stockMinimo) VALUES
  ('Taza personalizada', 'Taza cerámica con impresión full color', 8.50, 'Taza', 20, 5),
  ('Camiseta estampada', 'Camiseta 100% algodón con diseño personalizado', 12.00, 'Ropa', 15, 5),
  ('Lapicero grabado', 'Lapicero metálico con grabado láser', 2.50, 'Lapicero', 50, 10),
  ('Bolsa tote bag', 'Bolsa de tela con impresión serigráfica', 6.00, 'Bolsa', 3, 5),
  ('Gorra bordada', 'Gorra con bordado personalizado', 10.00, 'Ropa', 8, 5);
