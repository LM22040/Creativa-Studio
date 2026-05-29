// frontend/src/components/ConfirmModal.jsx
// Modal de confirmación reutilizable para acciones destructivas

import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon = '⚠️',
  loading = false,
}) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
        {/* Icono y título */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">{icon}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          {message && (
            <p className="text-gray-600 text-sm">{message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant}
            fullWidth
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
