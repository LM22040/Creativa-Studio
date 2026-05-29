// frontend/src/components/Badge.jsx
// Componente de badge/etiqueta reutilizable con diseño moderno

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '' 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && (
        typeof Icon === 'string' ? (
          <span className="text-sm">{Icon}</span>
        ) : (
          <Icon className="w-3 h-3" />
        )
      )}
      {children}
    </span>
  );
}
