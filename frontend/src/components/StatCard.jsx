// frontend/src/components/StatCard.jsx
// Tarjeta de estadística con diseño moderno

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'blue',
  trend,
  trendValue,
  onClick,
}) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      light: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      light: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    orange: {
      bg: 'from-primary-500 to-primary-600',
      light: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      onClick={onClick}
      className={`card-interactive group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Decoración de fondo */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.light} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          
          {Icon && (
            <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
              {typeof Icon === 'string' ? (
                <span className="text-2xl">{Icon}</span>
              ) : (
                <Icon className="w-6 h-6 text-white" />
              )}
            </div>
          )}
        </div>

        {/* Trend indicator */}
        {trend && trendValue && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-xs text-gray-500">vs. mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
