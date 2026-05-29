// frontend/src/components/Layout.jsx
// Barra lateral y estructura general de la app con diseño moderno

import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Package, ShoppingCart, LogOut, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
];

export default function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-primary-50/30">
      {/* Sidebar con glassmorphism */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl shadow-soft-lg border-r border-gray-200/50 flex flex-col relative">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-accent-500/5 pointer-events-none" />
        
        {/* Logo */}
        <div className="relative px-6 py-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shrink-0 shadow-soft relative group">
              <Sparkles className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight">Creativa</p>
              <p className="text-xs text-gray-500 leading-tight font-medium">Estudios</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="relative flex-1 px-4 py-6 space-y-2">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative
                ${isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div className="relative px-4 py-4 border-t border-gray-200/50">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft">
                {usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{usuario?.nombre?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 truncate">{usuario?.correo}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
