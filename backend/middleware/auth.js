// backend/middleware/auth.js
// Verifica que el token JWT sea válido antes de acceder a rutas protegidas

const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado: no se proporcionó token' });
  }

  // El header debe venir como: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { idUsuario, nombre, rol }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
