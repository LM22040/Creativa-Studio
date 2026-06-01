// backend/controllers/authController.js

const db     = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// POST /api/auth/login
const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    // Buscar usuario por correo
    db.get(
      'SELECT * FROM Usuario WHERE correo = ?',
      [correo],
      async (err, usuario) => {
        if (err) {
          console.error('Error en login:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (!usuario) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.passwordHash);

        if (!passwordValida) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign(
          {
            idUsuario: usuario.idUsuario,
            nombre:    usuario.nombre,
            rol:       usuario.rol,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
          mensaje: 'Sesión iniciada correctamente',
          token,
          usuario: {
            idUsuario: usuario.idUsuario,
            nombre:    usuario.nombre,
            correo:    usuario.correo,
            rol:       usuario.rol,
          },
        });
      }
    );

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };
