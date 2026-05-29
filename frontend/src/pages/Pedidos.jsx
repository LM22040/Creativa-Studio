// frontend/src/pages/Pedidos.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

const ESTADO_COLORES = {
  pendiente:   'warning',
  'en proceso':'info',
  completado:  'success',
  cancelado:   'danger',
};

export default function Pedidos() {
  const toast = useToast();
  const [pedidos, setPedidos]     = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
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

  if (cargando) return <p className="text-gray-500 p-6">Cargando pedidos...</p>;
  if (error)    return <p className="text-red-500 p-6">{error}</p>;

  let pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  // Filtrar por búsqueda
  if (busqueda) {
    pedidosFiltrados = pedidosFiltrados.filter(p =>
      p.nombrecliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.telefonocliente && p.telefonocliente.includes(busqueda))
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pedidos</h2>
          <p className="text-gray-500 text-sm">Gestión de pedidos de clientes</p>
        </div>
        <Button
          onClick={() => setMostrarForm(true)}
          icon="➕"
        >
          Nuevo pedido
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por cliente o teléfono..."
        />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {['todos', 'pendiente', 'en proceso', 'completado', 'cancelado'].map(estado => (
          <Button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            variant={filtroEstado === estado ? 'primary' : 'secondary'}
            size="sm"
            className="capitalize"
          >
            {estado}
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
          icon={busqueda || filtroEstado !== 'todos' ? '🔍' : '📋'}
          title={busqueda || filtroEstado !== 'todos' ? 'No se encontraron pedidos' : 'No hay pedidos registrados'}
          description={busqueda || filtroEstado !== 'todos' ? 'Intenta con otros términos de búsqueda o filtros' : 'Comienza registrando tu primer pedido'}
          actionLabel={!busqueda && filtroEstado === 'todos' ? 'Nuevo pedido' : undefined}
          onAction={!busqueda && filtroEstado === 'todos' ? () => setMostrarForm(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map((p) => (
            <div key={p.idpedido} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800">{p.nombrecliente}</p>
                    <Badge variant={ESTADO_COLORES[p.estado] || 'default'} className="capitalize">
                      {p.estado}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {p.telefonocliente && `📞 ${p.telefonocliente} · `}
                    {new Date(p.fechapedido).toLocaleDateString('es-SV', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                    {p.nombreusuario && ` · Registrado por: ${p.nombreusuario}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-lg">${parseFloat(p.total).toFixed(2)}</p>
                  <Button
                    onClick={() => verDetalle(p.idpedido)}
                    variant="link"
                    size="sm"
                    icon="👁️"
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
              
              {/* Cambiar estado */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap items-center">
                <span className="text-xs text-gray-500 font-medium">Cambiar estado:</span>
                {['pendiente','en proceso','completado','cancelado'].map(est => (
                  <Button
                    key={est}
                    onClick={() => cambiarEstado(p.idpedido, est)}
                    disabled={p.estado === est}
                    variant={p.estado === est ? 'ghost' : 'secondary'}
                    size="sm"
                    className={`capitalize ${p.estado === est ? 'opacity-50 cursor-default' : ''}`}
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">📋 Detalle del pedido #{pedido.idpedido}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Información del cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Información del cliente</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Nombre:</span> <span className="font-medium">{pedido.nombrecliente}</span></p>
              {pedido.telefonocliente && (
                <p><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{pedido.telefonocliente}</span></p>
              )}
              <p><span className="text-gray-500">Fecha:</span> <span className="font-medium">
                {new Date(pedido.fechapedido).toLocaleDateString('es-SV', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span></p>
              <p><span className="text-gray-500">Estado:</span> <Badge variant={ESTADO_COLORES[pedido.estado]} className="capitalize ml-2">
                {pedido.estado}
              </Badge></p>
            </div>
          </div>

          {/* Productos del pedido */}
          <div>
            <h4 className="font-semibold text-gray-700 text-sm mb-3">Productos</h4>
            <div className="space-y-2">
              {pedido.detalle && pedido.detalle.map((item) => (
                <div key={item.iddetalle} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.nombreproducto}</p>
                    <p className="text-xs text-gray-500">
                      ${parseFloat(item.preciounitario).toFixed(2)} × {item.cantidad} unidad(es)
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(parseFloat(item.preciounitario) * item.cantidad).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-orange-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-orange-600">${parseFloat(pedido.total).toFixed(2)}</span>
          </div>

          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            icon="✓"
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
  const [nombre, setNombre]       = useState('');
  const [telefono, setTelefono]   = useState('');
  const [productos, setProductos] = useState([]);
  const [items, setItems]         = useState([{ idProducto: '', cantidad: 1 }]);
  const [error, setError]         = useState('');
  const [enviando, setEnviando]   = useState(false);

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
      const prod = productos.find(p => p.idproducto === parseInt(item.idProducto));
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">➕ Nuevo pedido</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nombre del cliente *</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono (opcional)</label>
            <input
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="0000-0000"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Productos</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={item.idProducto}
                  onChange={e => actualizarItem(idx, 'idProducto', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(p => (
                    <option key={p.idproducto} value={p.idproducto}>
                      {p.nombre} (${parseFloat(p.precio).toFixed(2)}) — stock: {p.stockactual}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={e => actualizarItem(idx, 'cantidad', e.target.value)}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {items.length > 1 && (
                  <button 
                    onClick={() => eliminarItem(idx)} 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 text-lg px-2 rounded-lg transition"
                    aria-label="Eliminar producto"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <Button
              onClick={agregarItem}
              variant="ghost"
              size="sm"
              icon="➕"
              className="mt-1"
            >
              Agregar producto
            </Button>
          </div>

          {/* Total */}
          <div className="bg-orange-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total estimado</span>
            <span className="text-lg font-bold text-orange-600">${calcularTotal().toFixed(2)}</span>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              loading={enviando}
              fullWidth
              icon="📝"
            >
              Registrar pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
