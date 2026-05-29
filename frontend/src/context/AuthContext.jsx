// frontend/src/context/AuthContext.jsx
// Maneja el estado de sesión globalmente en toda la app

import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const login = async (correo, password) => {
    const res = await api.post('/auth/login', { correo, password });
    const { token, usuario } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
