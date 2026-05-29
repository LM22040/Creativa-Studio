// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { Package, ShoppingCart, AlertTriangle, Plus, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, alertas: 0 });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidosPorEstado, setPedidosPorEstado] = useState([]);

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
          pedidos: pedidos.data.length,
          alertas: alertas.data.length,
        });
        
        // Últimos 5 pedidos
        setPedidosRecientes(pedidos.data.slice(0, 5));
        
        // Agrupar pedidos por estado para el gráfico
        const estadosCount = pedidos.data.reduce((acc, p) => {
          acc[p.estado] = (acc[p.estado] || 0) + 1;
          return acc;
        }, {});
        
        setPedidosPorEstado([
          { name: 'Pendiente', value: estadosCount['pendiente'] || 0, color: '#f59e0b' },
          { name: 'En proceso', value: estadosCount['en proceso'] || 0, color: '#3b82f6' },
          { name: 'Completado', value: estadosCount['completado'] || 0, color: '#10b981' },
          { name: 'Cancelado', value: estadosCount['cancelado'] || 0, color: '#ef4444' },
        ]);
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
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="skeleton h-12 w-1/3 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString('es-SV', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <Link to="/pedidos">
          <Button icon={Plus} size="lg">
            Nuevo pedido
          </Button>
        </Link>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Productos"
          value={stats.productos}
          description="en inventario"
          icon={Package}
          color="blue"
          onClick={() => navigate('/inventario')}
        />
        <StatCard
          title="Pedidos"
          value={stats.pedidos}
          description="registrados"
          icon={ShoppingCart}
          color="purple"
          onClick={() => navigate('/pedidos')}
        />
        <StatCard
          title="Alertas"
          value={stats.alertas}
          description="stock bajo o agotado"
          icon={AlertTriangle}
          color={stats.alertas > 0 ? 'yellow' : 'green'}
          onClick={() => navigate('/inventario')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pedidos por estado */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Distribución de pedidos</h3>
              <p className="text-sm text-gray-500 mt-1">Por estado actual</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          {pedidosPorEstado.some(e => e.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pedidosPorEstado}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pedidosPorEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {pedidosPorEstado.map((estado, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: estado.color }} />
                    <span className="text-sm text-gray-600">{estado.name}: {estado.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No hay datos disponibles</p>
            </div>
          )}
        </div>

        {/* Pedidos recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Pedidos recientes</h3>
              <p className="text-sm text-gray-500 mt-1">Últimas transacciones</p>
            </div>
            <Link to="/pedidos">
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </Link>
          </div>
          
          {pedidosRecientes.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay pedidos recientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosRecientes.map((pedido) => (
                <div 
                  key={pedido.idpedido} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-gray-100 transition cursor-pointer group border border-gray-100"
                  onClick={() => navigate('/pedidos')}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-soft group-hover:scale-110 transition-transform">
                      {pedido.nombrecliente.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition">
                        {pedido.nombrecliente}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(pedido.fechapedido).toLocaleDateString('es-SV', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={ESTADO_COLORES[pedido.estado]} size="sm">
                      {pedido.estado}
                    </Badge>
                    <span className="font-bold text-gray-900 text-sm">
                      ${parseFloat(pedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/pedidos" className="group">
            <div className="bg-white rounded-xl p-5 hover:shadow-soft-lg transition-all border border-gray-100 hover:border-primary-200">
              <Plus className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 mb-1">Registrar pedido</p>
              <p className="text-xs text-gray-500">Crear un nuevo pedido de cliente</p>
            </div>
          </Link>
          
          <Link to="/inventario" className="group">
            <div className="bg-white rounded-xl p-5 hover:shadow-soft-lg transition-all border border-gray-100 hover:border-primary-200">
              <Package className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 mb-1">Ver inventario</p>
              <p className="text-xs text-gray-500">Gestionar productos disponibles</p>
            </div>
          </Link>
          
          <Link to="/inventario" className="group">
            <div className="bg-white rounded-xl p-5 hover:shadow-soft-lg transition-all border border-gray-100 hover:border-primary-200">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-gray-900 mb-1">Revisar alertas</p>
              <p className="text-xs text-gray-500">Productos con stock bajo</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
