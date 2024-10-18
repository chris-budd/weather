import React from 'react';

interface TemperatureUnitToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onToggle: (unit: 'celsius' | 'fahrenheit') => void;
}

const TemperatureUnitToggle: React.FC<TemperatureUnitToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className="flex items-center bg-white/20 rounded-full p-1 w-28">
      <button
        className={`w-1/2 text-base font-medium py-1.5 px-3 rounded-full transition-all duration-300 ${
          unit === 'fahrenheit' 
            ? 'bg-[#2c5492] text-white' 
            : 'text-gray-300 hover:text-white'
        }`}
        onClick={() => onToggle('fahrenheit')}
      >
        °F
      </button>
      <button
        className={`w-1/2 text-base font-medium py-1.5 px-3 rounded-full transition-all duration-300 ${
          unit === 'celsius' 
            ? 'bg-[#2c5492] text-white' 
            : 'text-gray-300 hover:text-white'
        }`}
        onClick={() => onToggle('celsius')}
      >
        °C
      </button>
    </div>
  );
};

export default TemperatureUnitToggle;
