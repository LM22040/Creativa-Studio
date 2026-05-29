// frontend/src/components/SearchBar.jsx
// Barra de búsqueda con debounce y clear button

import { useState, useEffect } from 'react';

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  debounce = 300,
  className = '' 
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounce);

    return () => clearTimeout(timer);
  }, [localValue, debounce, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
