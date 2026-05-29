// frontend/src/pages/Login.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Login() {
  const { login } = useAuth();
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(correo, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Creativa Estudios</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de gestión interna</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="empleado@creativaestudios.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            loading={cargando}
            fullWidth
            icon="🔐"
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
