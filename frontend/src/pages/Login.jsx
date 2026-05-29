// frontend/src/pages/Login.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative w-full max-w-md">
        {/* Card principal */}
        <div className="glass rounded-3xl shadow-soft-lg p-8 border border-white/50 animate-scale-in">
          {/* Logo / Título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-soft-lg relative group">
              <Sparkles className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Creativa Estudios</h1>
            <p className="text-gray-500 text-sm">Sistema de gestión interna</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="empleado@creativaestudios.com"
                  required
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-modern pl-12"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 text-sm bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 animate-slide-down">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={cargando}
              fullWidth
              icon={Lock}
              size="lg"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Sistema protegido · Acceso solo para personal autorizado
            </p>
          </div>
        </div>

        {/* Versión */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Versión 2.0 · Powered by Creativa Estudios
        </p>
      </div>
    </div>
  );
}
