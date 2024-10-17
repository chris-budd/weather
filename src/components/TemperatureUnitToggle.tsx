import React from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureUnitToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
}

export default function TemperatureUnitToggle({ unit, onToggle }: TemperatureUnitToggleProps) {
  return (
    <div className="flex items-center bg-white/20 rounded-full p-1 w-48">
      <button
        className={`flex-1 py-1 px-3 rounded-full transition-colors duration-200 ${
          unit === 'celsius' ? 'bg-white text-[#2c5492]' : 'text-white'
        }`}
        onClick={() => onToggle('celsius')}
      >
        °C
      </button>
      <button
        className={`flex-1 py-1 px-3 rounded-full transition-colors duration-200 ${
          unit === 'fahrenheit' ? 'bg-white text-[#2c5492]' : 'text-white'
        }`}
        onClick={() => onToggle('fahrenheit')}
      >
        °F
      </button>
    </div>
  );
}
