// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, alertas: 0 });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [productos, pedidos, alertas] = await Promise.all([
          api.get('/productos'),
          api.get('/pedidos'),
          api.get('/productos/alertas'),
        ]);
        setStats({
          productos: productos.data.length,
          pedidos:   pedidos.data.length,
          alertas:   alertas.data.length,
        });
        // Últimos 5 pedidos
        setPedidosRecientes(pedidos.data.slice(0, 5));
      } catch (err) {
        console.error('Error cargando stats:', err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const ESTADO_COLORES = {
    pendiente: 'warning',
    'en proceso': 'info',
    completado: 'success',
    cancelado: 'danger',
  };

  if (cargando) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Panel de control · {new Date().toLocaleDateString('es-SV', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Productos"
          value={stats.productos}
          description="en inventario"
          icon="📦"
          color="blue"
          onClick={() => navigate('/inventario')}
        />
        <StatCard
          title="Pedidos"
          value={stats.pedidos}
          description="registrados"
          icon="📋"
          color="purple"
          onClick={() => navigate('/pedidos')}
        />
        <StatCard
          title="Alertas"
          value={stats.alertas}
          description="stock bajo o agotado"
          icon="⚠️"
          color={stats.alertas > 0 ? 'yellow' : 'green'}
          onClick={() => navigate('/inventario')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accesos rápidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Acciones rápidas</h3>
          <div className="flex gap-3 flex-wrap">
            <Link to="/pedidos">
              <Button icon="➕" size="md">
                Registrar pedido
              </Button>
            </Link>
            <Link to="/inventario">
              <Button variant="secondary" icon="📦" size="md">
                Ver inventario
              </Button>
            </Link>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">Pedidos recientes</h3>
            <Link to="/pedidos">
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </Link>
          </div>
          
          {pedidosRecientes.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No hay pedidos recientes</p>
          ) : (
            <div className="space-y-3">
              {pedidosRecientes.map((pedido) => (
                <div 
                  key={pedido.idpedido} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate('/pedidos')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {pedido.nombrecliente}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(pedido.fechapedido).toLocaleDateString('es-SV', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={ESTADO_COLORES[pedido.estado]} size="sm">
                      {pedido.estado}
                    </Badge>
                    <span className="font-semibold text-gray-800 text-sm">
                      ${parseFloat(pedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
