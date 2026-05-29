// frontend/src/components/Badge.jsx
// Componente de badge/etiqueta reutilizable

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  icon,
  className = '' 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-orange-100 text-orange-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
