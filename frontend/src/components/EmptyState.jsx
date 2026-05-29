// frontend/src/components/EmptyState.jsx
// Estado vacío con ilustración y acción

import Button from './Button';

export default function EmptyState({ 
  icon = '📭', 
  title = 'No hay datos', 
  description,
  actionLabel,
  onAction 
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="➕">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
