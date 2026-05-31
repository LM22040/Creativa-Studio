// frontend/src/components/ConfirmModal.jsx
// Modal de confirmación reutilizable con diseño moderno

import Button from './Button';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon: Icon,
  loading = false,
}) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // El componente padre muestra el error; no cerrar el modal
    }
  };

  const iconBgColors = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    success: 'bg-green-100',
  };

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600',
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-md p-8 animate-scale-in relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono y título */}
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-3xl ${iconBgColors[variant]} flex items-center justify-center mx-auto mb-4 shadow-inner-soft`}>
            {typeof Icon === 'string' ? (
              <span className="text-4xl">{Icon}</span>
            ) : Icon ? (
              <Icon className={`w-10 h-10 ${iconColors[variant]}`} />
            ) : (
              <AlertTriangle className={`w-10 h-10 ${iconColors[variant]}`} />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          {message && (
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            disabled={loading}
            size="lg"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant}
            fullWidth
            loading={loading}
            size="lg"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
