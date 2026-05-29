// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout    from './components/Layout';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Pedidos   from './pages/Pedidos';

// Protege rutas: si no hay sesión, redirige al login
const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route index          element={<Dashboard />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="pedidos"    element={<Pedidos />} />
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
