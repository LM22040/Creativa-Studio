// frontend/src/components/Layout.jsx
// Barra lateral y estructura general de la app

import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard',  icon: '🏠' },
  { to: '/inventario',label: 'Inventario', icon: '📦' },
  { to: '/pedidos',   label: 'Pedidos',    icon: '📋' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">CE</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 leading-tight">Creativa</p>
              <p className="text-xs text-gray-400 leading-tight">Estudios</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 truncate mb-2">{usuario?.nombre}</p>
          <button
            onClick={logout}
            className="w-full text-xs text-gray-500 hover:text-red-500 text-left transition flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-50"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
