// frontend/src/components/EmptyState.jsx
// Estado vacío con ilustración y acción - diseño moderno

import Button from './Button';
import { Plus } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon, 
  title = 'No hay datos', 
  description,
  actionLabel,
  onAction 
}) {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner-soft">
        {typeof Icon === 'string' ? (
          <span className="text-5xl opacity-50">{Icon}</span>
        ) : Icon ? (
          <Icon className="w-10 h-10 text-gray-400" />
        ) : (
          <span className="text-5xl opacity-50">📭</span>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={Plus} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
