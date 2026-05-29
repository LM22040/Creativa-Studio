// frontend/src/pages/Inventario.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { Plus, Edit2, Trash2, Package, AlertTriangle, CheckCircle, Grid3x3, List, Filter, X } from 'lucide-react';

export default function Inventario() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('tarjetas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
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
      return <Badge variant="danger" icon={X}>Sin stock</Badge>;
    }
    if (producto.stockactual <= producto.stockminimo) {
      return <Badge variant="warning" icon={AlertTriangle}>Stock bajo</Badge>;
    }
    return <Badge variant="success" icon={CheckCircle}>OK</Badge>;
  };

  const getEstadoProducto = (producto) => {
    if (producto.stockactual === 0) return 'agotado';
    if (producto.stockactual <= producto.stockminimo) return 'bajo';
    return 'ok';
  };

  if (cargando) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="skeleton h-12 w-1/3 rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 p-8">{error}</p>;

  const alertas = productos.filter(p => p.stockactual <= p.stockminimo);
  
  let productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.tipo && p.tipo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  if (filtroEstado !== 'todos') {
    productosFiltrados = productosFiltrados.filter(p => getEstadoProducto(p) === filtroEstado);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Inventario</h2>
          <p className="text-gray-500 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Control de stock de productos disponibles
          </p>
        </div>
        <Button onClick={() => abrirFormulario()} icon={Plus} size="lg">
          Agregar producto
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre o tipo..."
          className="flex-1"
        />
        
        <div className="flex gap-3 flex-wrap">
          {[
            { value: 'todos', label: 'Todos', icon: Package },
            { value: 'ok', label: 'Stock OK', icon: CheckCircle },
            { value: 'bajo', label: 'Stock bajo', icon: AlertTriangle },
            { value: 'agotado', label: 'Agotado', icon: X },
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

        <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5">
          <button
            onClick={() => setVistaActual('tarjetas')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              vistaActual === 'tarjetas'
                ? 'bg-white text-gray-900 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVistaActual('tabla')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              vistaActual === 'tabla'
                ? 'bg-white text-gray-900 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {alertas.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-yellow-900 font-bold text-lg mb-2">
                {alertas.length} producto(s) con stock bajo o agotado
              </p>
              <ul className="text-yellow-800 text-sm space-y-1">
                {alertas.slice(0, 3).map(p => (
                  <li key={p.idproducto} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                    {p.nombre} — stock actual: {p.stockactual}
                  </li>
                ))}
                {alertas.length > 3 && (
                  <li className="text-yellow-700 font-medium">
                    + {alertas.length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          </div>
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
        icon={Trash2}
      />

      {/* Vista de tabla o tarjetas */}
      {productosFiltrados.length === 0 ? (
        <EmptyState
          icon={busqueda || filtroEstado !== 'todos' ? Filter : Package}
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
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Producto</th>
              <th className="px-6 py-4 text-left font-bold">Tipo</th>
              <th className="px-6 py-4 text-right font-bold">Precio</th>
              <th className="px-6 py-4 text-center font-bold">Stock actual</th>
              <th className="px-6 py-4 text-center font-bold">Mínimo</th>
              <th className="px-6 py-4 text-center font-bold">Estado</th>
              <th className="px-6 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((p) => (
              <tr key={p.idproducto} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition">{p.nombre}</p>
                    {p.descripcion && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.descripcion}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600 font-medium">{p.tipo || '—'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900">${parseFloat(p.precio).toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-gray-900 text-base">{p.stockactual}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-500">{p.stockminimo}</span>
                </td>
                <td className="px-6 py-4 text-center">{stockBadge(p)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => onEditar(p)}
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => onEliminar(p)}
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Vista de Tarjetas ────────────────────────────────────────────────────
function VistaTarjetas({ productos, onEditar, onEliminar, stockBadge }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((p) => (
        <div key={p.idproducto} className="card-interactive group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-primary-600 transition">{p.nombre}</h3>
              {p.tipo && (
                <p className="text-sm text-gray-500 mt-1">{p.tipo}</p>
              )}
            </div>
            {stockBadge(p)}
          </div>

          {p.descripcion && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{p.descripcion}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-3 border border-primary-100">
              <p className="text-xs text-primary-600 font-semibold mb-1">Precio</p>
              <p className="font-bold text-gray-900 text-lg">${parseFloat(p.precio).toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1">Stock</p>
              <p className="font-bold text-gray-900 text-lg">{p.stockactual} <span className="text-sm text-gray-500">/ {p.stockminimo}</span></p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onEditar(p)}
              variant="secondary"
              size="md"
              fullWidth
              icon={Edit2}
            >
              Editar
            </Button>
            <Button
              onClick={() => onEliminar(p)}
              variant="danger"
              size="md"
              icon={Trash2}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {producto ? 'Editar producto' : 'Nuevo producto'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {producto ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-modern"
              placeholder="Ej: Taza personalizada"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input-modern"
              placeholder="Descripción del producto"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Precio *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="input-modern pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Tipo</label>
              <input
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="input-modern"
                placeholder="Ej: Taza, Ropa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Stock actual</label>
              <input
                type="number"
                min="0"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="input-modern"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 text-sm bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth
              size="lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={enviando}
              fullWidth
              icon={producto ? Edit2 : Plus}
              size="lg"
            >
              {producto ? 'Actualizar' : 'Crear producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
