// frontend/src/pages/Pedidos.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { Plus, Eye, ShoppingCart, Phone, Calendar, User, X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const ESTADO_COLORES = {
  pendiente: 'warning',
  'en proceso': 'info',
  completado: 'success',
  cancelado: 'danger',
};

export default function Pedidos() {
  const toast = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { cargarPedidos(); }, []);

  const cargarPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
      setError('');
    } catch {
      setError('Error al cargar pedidos');
      toast.error('Error al cargar pedidos');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado });
      toast.success(`Estado actualizado a "${estado}"`);
      cargarPedidos();
    } catch {
      toast.error('No se pudo actualizar el estado');
    }
  };

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      setPedidoDetalle(res.data);
    } catch {
      toast.error('Error al cargar el detalle del pedido');
    }
  };

  if (cargando) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="skeleton h-12 w-1/3 rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 p-8">{error}</p>;

  let pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  if (busqueda) {
    pedidosFiltrados = pedidosFiltrados.filter(p =>
      p.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.telefonoCliente && p.telefonoCliente.includes(busqueda))
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h2>
          <p className="text-gray-500 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Gestión de pedidos de clientes
          </p>
        </div>
        <Button onClick={() => setMostrarForm(true)} icon={Plus} size="lg">
          Nuevo pedido
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por cliente o teléfono..."
      />

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        {[
          { value: 'todos', label: 'Todos', icon: ShoppingCart },
          { value: 'pendiente', label: 'Pendiente', icon: AlertTriangle },
          { value: 'en proceso', label: 'En proceso', icon: Calendar },
          { value: 'completado', label: 'Completado', icon: CheckCircle },
          { value: 'cancelado', label: 'Cancelado', icon: X },
        ].map(filtro => (
          <Button
            key={filtro.value}
            onClick={() => setFiltroEstado(filtro.value)}
            variant={filtroEstado === filtro.value ? 'primary' : 'secondary'}
            size="md"
            icon={filtro.icon}
          >
            {filtro.label}
          </Button>
        ))}
      </div>

      {mostrarForm && (
        <FormularioPedido
          onClose={() => setMostrarForm(false)}
          onCreado={cargarPedidos}
          toast={toast}
        />
      )}

      {pedidoDetalle && (
        <DetallePedido
          pedido={pedidoDetalle}
          onClose={() => setPedidoDetalle(null)}
        />
      )}

      {/* Lista de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <EmptyState
          icon={busqueda || filtroEstado !== 'todos' ? '🔍' : ShoppingCart}
          title={busqueda || filtroEstado !== 'todos' ? 'No se encontraron pedidos' : 'No hay pedidos registrados'}
          description={busqueda || filtroEstado !== 'todos' ? 'Intenta con otros términos de búsqueda o filtros' : 'Comienza registrando tu primer pedido'}
          actionLabel={!busqueda && filtroEstado === 'todos' ? 'Nuevo pedido' : undefined}
          onAction={!busqueda && filtroEstado === 'todos' ? () => setMostrarForm(true) : undefined}
        />
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((p) => (
            <div key={p.idPedido} className="card-interactive group">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-soft group-hover:scale-110 transition-transform">
                    {p.nombreCliente.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition">
                        {p.nombreCliente}
                      </h3>
                      <Badge variant={ESTADO_COLORES[p.estado] || 'default'}>
                        {p.estado}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      {p.telefonoCliente && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          {p.telefonoCliente}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(p.fechaPedido).toLocaleDateString('es-SV', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      {p.nombreUsuario && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {p.nombreUsuario}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    ${parseFloat(p.total).toFixed(2)}
                  </p>
                  <Button
                    onClick={() => verDetalle(p.idPedido)}
                    variant="outline"
                    size="sm"
                    icon={Eye}
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
              
              {/* Cambiar estado */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex gap-2 flex-wrap items-center">
                <span className="text-sm text-gray-600 font-semibold mr-2">Cambiar estado:</span>
                {['pendiente', 'en proceso', 'completado', 'cancelado'].map(est => (
                  <Button
                    key={est}
                    onClick={() => cambiarEstado(p.idPedido, est)}
                    disabled={p.estado === est}
                    variant={p.estado === est ? 'ghost' : 'secondary'}
                    size="sm"
                    className={`capitalize ${p.estado === est ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {est}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal de detalle del pedido ───────────────────────────────────────────
function DetallePedido({ pedido, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Pedido #{pedido.idPedido}
            </h3>
            <p className="text-sm text-gray-500">Detalle completo del pedido</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información del cliente */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Información del cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Nombre</p>
                <p className="font-semibold text-gray-900">{pedido.nombreCliente}</p>
              </div>
              {pedido.telefonoCliente && (
                <div>
                  <p className="text-gray-500 mb-1">Teléfono</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {pedido.telefonoCliente}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500 mb-1">Fecha del pedido</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(pedido.fechaPedido).toLocaleDateString('es-SV', {
                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Estado</p>
                <Badge variant={ESTADO_COLORES[pedido.estado]} size="lg">
                  {pedido.estado}
                </Badge>
              </div>
            </div>
          </div>

          {/* Productos del pedido */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary-500" />
              Productos ({pedido.detalle?.length || 0})
            </h4>
            <div className="space-y-3">
              {pedido.detalle && pedido.detalle.map((item) => (
                <div key={item.idDetalle} className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-transparent rounded-xl p-4 border border-gray-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{item.nombreProducto}</p>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(item.precioUnitario).toFixed(2)} × {item.cantidad} unidad(es)
                    </p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${(parseFloat(item.precioUnitario) * item.cantidad).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl px-6 py-5 flex justify-between items-center border-2 border-primary-200">
            <span className="text-lg font-bold text-gray-900">Total del pedido</span>
            <span className="text-3xl font-bold text-primary-600">
              ${parseFloat(pedido.total).toFixed(2)}
            </span>
          </div>

          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            size="lg"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Formulario de nuevo pedido ───────────────────────────────────────────────
function FormularioPedido({ onClose, onCreado, toast }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([{ idProducto: '', cantidad: 1 }]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get('/productos').then(r => setProductos(r.data));
  }, []);

  const agregarItem = () => setItems([...items, { idProducto: '', cantidad: 1 }]);

  const actualizarItem = (idx, campo, valor) => {
    const copia = [...items];
    copia[idx][campo] = campo === 'cantidad' ? parseInt(valor) || 1 : valor;
    setItems(copia);
  };

  const eliminarItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const calcularTotal = () => {
    return items.reduce((acc, item) => {
      const prod = productos.find(p => p.idProducto === parseInt(item.idProducto));
      return acc + (prod ? parseFloat(prod.precio) * item.cantidad : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    setError('');
    if (!nombre) return setError('El nombre del cliente es requerido');

    const validos = items.filter(i => i.idProducto);
    if (validos.length === 0) return setError('Agrega al menos un producto');

    setEnviando(true);
    try {
      await api.post('/pedidos', {
        nombreCliente: nombre,
        telefonoCliente: telefono,
        productos: validos.map(i => ({
          idProducto: parseInt(i.idProducto),
          cantidad: i.cantidad,
        })),
      });
      toast.success(`Pedido de "${nombre}" registrado exitosamente`);
      onCreado();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al registrar el pedido';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Nuevo pedido</h3>
            <p className="text-sm text-gray-500">Registra un nuevo pedido de cliente</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Nombre del cliente *</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="input-modern"
              placeholder="Nombre completo"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Teléfono (opcional)</label>
            <input
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="input-modern"
              placeholder="0000-0000"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-3">Productos</label>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <select
                    value={item.idProducto}
                    onChange={e => actualizarItem(idx, 'idProducto', e.target.value)}
                    className="flex-1 input-modern"
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => (
                      <option key={p.idProducto} value={p.idProducto}>
                        {p.nombre} (${parseFloat(p.precio).toFixed(2)}) — stock: {p.stockActual}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={e => actualizarItem(idx, 'cantidad', e.target.value)}
                    className="w-24 input-modern text-center"
                    placeholder="Cant."
                  />
                  {items.length > 1 && (
                    <button 
                      onClick={() => eliminarItem(idx)} 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={agregarItem}
              variant="ghost"
              size="md"
              icon={Plus}
              className="mt-3"
            >
              Agregar producto
            </Button>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl px-6 py-4 flex justify-between items-center border-2 border-primary-200">
            <span className="text-sm font-bold text-gray-700">Total estimado</span>
            <span className="text-2xl font-bold text-primary-600">${calcularTotal().toFixed(2)}</span>
          </div>

          {error && (
            <div className="flex items-start gap-3 text-sm bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="secondary"
              fullWidth
              size="lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              loading={enviando}
              fullWidth
              icon={CheckCircle}
              size="lg"
            >
              Registrar pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
