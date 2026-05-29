// frontend/src/components/Button.jsx
// Componente de botón reutilizable con variantes y estados modernos

import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-soft hover:shadow-soft-lg focus:ring-primary-400 btn-hover-lift',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-soft',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-soft hover:shadow-soft-lg focus:ring-red-400 btn-hover-lift',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-soft hover:shadow-soft-lg focus:ring-green-400 btn-hover-lift',
    ghost: 'hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-400',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-400',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-400',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 min-h-[52px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Efecto de brillo en hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        typeof Icon === 'string' ? (
          <span className="text-lg leading-none">{Icon}</span>
        ) : (
          <Icon className="h-4 w-4" />
        )
      )}
      
      <span className="relative">{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        typeof Icon === 'string' ? (
          <span className="text-lg leading-none">{Icon}</span>
        ) : (
          <Icon className="h-4 w-4" />
        )
      )}
    </button>
  );
}
