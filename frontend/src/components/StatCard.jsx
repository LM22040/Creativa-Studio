// frontend/src/components/StatCard.jsx
// Tarjeta de estadística con tendencia y gráfico simple

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  color = 'blue',
  trend,
  trendValue,
  onClick 
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${
        onClick ? 'hover:shadow-md transition-all cursor-pointer group' : ''
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${colors[color]}`}>
        {icon}
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <p className={`text-3xl font-bold text-gray-800 ${onClick ? 'group-hover:text-orange-500 transition' : ''}`}>
          {value}
        </p>
        {trend && trendValue && (
          <span className={`text-sm font-medium flex items-center gap-0.5 ${trendColors[trend]}`}>
            {trendIcons[trend]}
            {trendValue}
          </span>
        )}
      </div>
      
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </Component>
  );
}
