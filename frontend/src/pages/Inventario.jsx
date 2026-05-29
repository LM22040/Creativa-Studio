// frontend/src/pages/Inventario.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export default function Inventario() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('tabla'); // 'tabla' o 'tarjetas'
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'ok', 'bajo', 'agotado'
  const [productoEliminar, setProductoEliminar] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
      setError('');
    } catch (err) {
      setError('Error al cargar el inventario');
      toast.error('Error al cargar el inventario');
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminar = (producto) => {
    setProductoEliminar(producto);
  };

  const eliminarProducto = async () => {
    if (!productoEliminar) return;
    
    try {
      await api.delete(`/productos/${productoEliminar.idproducto}`);
      toast.success(`Producto "${productoEliminar.nombre}" eliminado`);
      cargarProductos();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar el producto');
    }
  };

  const abrirFormulario = (producto = null) => {
    setProductoEditar(producto);
    setMostrarForm(true);
  };

  const cerrarFormulario = () => {
    setProductoEditar(null);
    setMostrarForm(false);
  };

  const stockBadge = (producto) => {
    if (producto.stockactual === 0) {
      return <Badge variant="danger" icon="✕">Sin stock</Badge>;
    }
    if (producto.stockactual <= producto.stockminimo) {
      return <Badge variant="warning" icon="⚠">Stock bajo</Badge>;
    }
    return <Badge variant="success" icon="✓">OK</Badge>;
  };

  const getEstadoProducto = (producto) => {
    if (producto.stockactual === 0) return 'agotado';
    if (producto.stockactual <= producto.stockminimo) return 'bajo';
    return 'ok';
  };

  if (cargando) return <p className="text-gray-500 p-6">Cargando inventario...</p>;
  if (error)    return <p className="text-red-500 p-6">{error}</p>;

  const alertas = productos.filter(p => p.stockactual <= p.stockminimo);
  
  let productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.tipo && p.tipo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Filtrar por estado
  if (filtroEstado !== 'todos') {
    productosFiltrados = productosFiltrados.filter(p => getEstadoProducto(p) === filtroEstado);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
          <p className="text-gray-500 text-sm">Control de stock de productos disponibles</p>
        </div>
        <Button
          onClick={() => abrirFormulario()}
          icon="➕"
        >
          Agregar producto
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre o tipo..."
          className="flex-1"
        />
        
        {/* Filtros de estado */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'todos', label: 'Todos', icon: '📦' },
            { value: 'ok', label: 'Stock OK', icon: '✓' },
            { value: 'bajo', label: 'Stock bajo', icon: '⚠' },
            { value: 'agotado', label: 'Agotado', icon: '✕' },
          ].map(filtro => (
            <Button
              key={filtro.value}
              onClick={() => setFiltroEstado(filtro.value)}
              variant={filtroEstado === filtro.value ? 'primary' : 'secondary'}
              size="sm"
              icon={filtro.icon}
            >
              {filtro.label}
            </Button>
          ))}
        </div>

        {/* Toggle vista */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setVistaActual('tabla')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              vistaActual === 'tabla'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Vista de tabla"
          >
            📋
          </button>
          <button
            onClick={() => setVistaActual('tarjetas')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${
              vistaActual === 'tarjetas'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Vista de tarjetas"
          >
            🎴
          </button>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {alertas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold text-sm mb-1">
            ⚠️ {alertas.length} producto(s) con stock bajo o agotado
          </p>
          <ul className="text-yellow-700 text-sm list-disc list-inside">
            {alertas.map(p => (
              <li key={p.idproducto}>{p.nombre} — stock actual: {p.stockactual}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulario modal */}
      {mostrarForm && (
        <FormularioProducto
          producto={productoEditar}
          onClose={cerrarFormulario}
          onGuardado={cargarProductos}
          toast={toast}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={!!productoEliminar}
        onClose={() => setProductoEliminar(null)}
        onConfirm={eliminarProducto}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de eliminar "${productoEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        icon="🗑️"
      />

      {/* Vista de tabla o tarjetas */}
      {productosFiltrados.length === 0 ? (
        <EmptyState
          icon={busqueda || filtroEstado !== 'todos' ? '🔍' : '📦'}
          title={busqueda || filtroEstado !== 'todos' ? 'No se encontraron productos' : 'No hay productos registrados'}
          description={busqueda || filtroEstado !== 'todos' ? 'Intenta con otros términos de búsqueda o filtros' : 'Comienza agregando tu primer producto al inventario'}
          actionLabel={!busqueda && filtroEstado === 'todos' ? 'Agregar producto' : undefined}
          onAction={!busqueda && filtroEstado === 'todos' ? () => abrirFormulario() : undefined}
        />
      ) : vistaActual === 'tabla' ? (
        <VistaTabla 
          productos={productosFiltrados} 
          onEditar={abrirFormulario}
          onEliminar={confirmarEliminar}
          stockBadge={stockBadge}
        />
      ) : (
        <VistaTarjetas 
          productos={productosFiltrados}
          onEditar={abrirFormulario}
          onEliminar={confirmarEliminar}
          stockBadge={stockBadge}
        />
      )}
    </div>
  );
}

// ── Vista de Tabla ───────────────────────────────────────────────────────
function VistaTabla({ productos, onEditar, onEliminar, stockBadge }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Producto</th>
            <th className="px-4 py-3 font-semibold">Tipo</th>
            <th className="px-4 py-3 font-semibold text-right">Precio</th>
            <th className="px-4 py-3 font-semibold text-center">Stock actual</th>
            <th className="px-4 py-3 font-semibold text-center">Mínimo</th>
            <th className="px-4 py-3 font-semibold text-center">Estado</th>
            <th className="px-4 py-3 font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {productos.map((p) => (
            <tr key={p.idproducto} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{p.nombre}</p>
                  {p.descripcion && (
                    <p className="text-xs text-gray-400 mt-0.5">{p.descripcion}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500">{p.tipo || '—'}</td>
              <td className="px-4 py-3 text-right text-gray-700">${parseFloat(p.precio).toFixed(2)}</td>
              <td className="px-4 py-3 text-center font-semibold text-gray-800">{p.stockactual}</td>
              <td className="px-4 py-3 text-center text-gray-500">{p.stockminimo}</td>
              <td className="px-4 py-3 text-center">{stockBadge(p)}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => onEditar(p)}
                    variant="ghost"
                    size="sm"
                    icon="✏️"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => onEliminar(p)}
                    variant="ghost"
                    size="sm"
                    icon="🗑️"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Vista de Tarjetas ────────────────────────────────────────────────────
function VistaTarjetas({ productos, onEditar, onEliminar, stockBadge }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productos.map((p) => (
        <div key={p.idproducto} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{p.nombre}</h3>
              {p.tipo && (
                <p className="text-xs text-gray-500 mt-0.5">{p.tipo}</p>
              )}
            </div>
            {stockBadge(p)}
          </div>

          {p.descripcion && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.descripcion}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Precio</p>
              <p className="font-semibold text-gray-800">${parseFloat(p.precio).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Stock</p>
              <p className="font-semibold text-gray-800">{p.stockactual} / {p.stockminimo}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onEditar(p)}
              variant="secondary"
              size="sm"
              fullWidth
              icon="✏️"
            >
              Editar
            </Button>
            <Button
              onClick={() => onEliminar(p)}
              variant="danger"
              size="sm"
              icon="🗑️"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Formulario de producto ───────────────────────────────────────────────
function FormularioProducto({ producto, onClose, onGuardado, toast }) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [precio, setPrecio] = useState(producto?.precio || '');
  const [tipo, setTipo] = useState(producto?.tipo || '');
  const [stockActual, setStockActual] = useState(producto?.stockactual || 0);
  const [stockMinimo, setStockMinimo] = useState(producto?.stockminimo || 5);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !precio) {
      return setError('Nombre y precio son requeridos');
    }

    setEnviando(true);
    try {
      const datos = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        tipo,
        stockactual: parseInt(stockActual),
        stockminimo: parseInt(stockMinimo),
      };

      if (producto) {
        await api.put(`/productos/${producto.idproducto}`, datos);
        toast.success(`Producto "${nombre}" actualizado`);
      } else {
        await api.post('/productos', datos);
        toast.success(`Producto "${nombre}" creado`);
      }

      onGuardado();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar el producto';
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
          <h3 className="text-lg font-bold text-gray-800">
            {producto ? '✏️ Editar producto' : '➕ Nuevo producto'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ej: Taza personalizada"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Descripción del producto"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Precio *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
              <input
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Ej: Taza, Ropa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock actual</label>
              <input
                type="number"
                min="0"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={enviando}
              fullWidth
              icon="💾"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
