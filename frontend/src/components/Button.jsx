// frontend/src/components/Button.jsx
// Componente de botón reutilizable con variantes y estados

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm hover:shadow focus:ring-orange-400',
    secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow focus:ring-red-400',
    success: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-sm hover:shadow focus:ring-green-400',
    ghost: 'hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-400',
    link: 'text-orange-500 hover:text-orange-700 underline-offset-4 hover:underline focus:ring-orange-400',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[48px]',
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
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="text-lg leading-none">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="text-lg leading-none">{icon}</span>
      )}
    </button>
  );
}
