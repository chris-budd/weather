'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import TemperatureUnitToggle from './TemperatureUnitToggle';

export interface WeatherData {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
    pop: number;
  }[];
  city: {
    name: string;
    timezone: number;
  };
}

export function getLocalTime(utcTimestamp: number, timezoneOffset: number): Date {
  return new Date((utcTimestamp + timezoneOffset) * 1000);
}

function groupForecastByDay(forecast: WeatherData['list'], timezoneOffset: number) {
  const grouped = forecast.reduce((acc, item) => {
    const localDate = getLocalTime(item.dt, timezoneOffset);
    const dateKey = localDate.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = localDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    if (!acc[dateKey]) {
      acc[dateKey] = { fullDate, items: [] };
    }
    acc[dateKey].items.push({ ...item, localDate });
    return acc;
  }, {} as Record<string, { fullDate: string, items: (WeatherData['list'][0] & { localDate: Date })[] }>);

  return Object.entries(grouped)
    .slice(0, 5)
    .map(([date, { fullDate, items }]) => ({
      date,
      fullDate,
      items,
      avgTemp: items.reduce((sum, item) => sum + item.main.temp, 0) / items.length,
      minTemp: Math.min(...items.map(item => item.main.temp_min)),
      maxTemp: Math.max(...items.map(item => item.main.temp_max)),
      icon: items[Math.floor(items.length / 2)].weather[0].icon
    }));
}

const WEATHER_ICONS = [
  '01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n',
  '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50d', '50n'
];

function PreloadWeatherIcons() {
  return (
    <div className="hidden">
      {WEATHER_ICONS.map(icon => (
        <Image
          key={icon}
          src={`/weather-icons/${icon}.png`}
          alt="Preload"
          width={1}
          height={1}
        />
      ))}
    </div>
  );
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

interface WeatherError {
  error: string;
}

export default function WeatherForecast({ forecast, selectedDay = 0 }: { forecast: WeatherData | WeatherError | null, selectedDay?: number }) {
  const [localSelectedDay, setLocalSelectedDay] = useState(selectedDay);
  const [groupedForecast, setGroupedForecast] = useState<ReturnType<typeof groupForecastByDay>>(() => {
    if (forecast && 'list' in forecast) {
      return groupForecastByDay(forecast.list, forecast.city.timezone);
    }
    return [];
  });
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('fahrenheit');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (forecast && 'list' in forecast) {
      setGroupedForecast(groupForecastByDay(forecast.list, forecast.city.timezone));
    }
  }, [forecast]);

  useEffect(() => {
    setLocalSelectedDay(selectedDay);
  }, [selectedDay]);

  if (!forecast) {
    return <div className="text-white text-center font-bold">No forecast data available</div>;
  }

  if ('error' in forecast) {
    return <div className="text-white text-center font-bold bg-red-500/20 p-4 rounded-lg">{forecast.error}</div>;
  }

  if (!forecast.list || forecast.list.length === 0) {
    return <div className="text-white text-center font-bold">Forecast data is empty or invalid</div>;
  }

  const formatTemperature = (temp: number) => {
    const formattedTemp = temperatureUnit === 'celsius' ? temp : celsiusToFahrenheit(temp);
    return `${Math.round(formattedTemp)}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
  };

  const selectedDayData = groupedForecast[localSelectedDay];

  const handleDaySelection = (index: number) => {
    setLocalSelectedDay(index);
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg">
      <PreloadWeatherIcons />
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">5-Day Forecast</h2>
        {isClient && (
          <TemperatureUnitToggle unit={temperatureUnit} onToggle={setTemperatureUnit} />
        )}
      </div>
      <div className="flex flex-wrap -mx-1 mb-4 sm:mb-6 bg-[#3366a3]/60 rounded-lg backdrop-blur-sm overflow-hidden">
        {groupedForecast.map((day, index) => (
          <form key={day.date} action="" method="get" className="w-1/5">
            <input type="hidden" name="day" value={index} />
            <button
              type={isClient ? "button" : "submit"}
              className={`w-full py-2 sm:py-4 px-1 sm:px-2 text-center transition-all duration-300 ${
                localSelectedDay === index 
                  ? 'bg-[#2c5492] text-white shadow-inner' 
                  : 'text-white hover:bg-[#3366a3]/80'
              }`}
              onClick={(e) => {
                if (isClient) {
                  e.preventDefault();
                  handleDaySelection(index);
                }
              }}
            >
              <div className="text-[10px] sm:text-xs text-white/80 mb-1">{day.fullDate}</div>
              <div className="font-bold text-sm sm:text-lg">{day.date}</div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 mx-auto my-1 sm:my-2 relative">
                <Image
                  src={`/weather-icons/${day.icon}.png`}
                  alt={day.items[0].weather[0].description}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-xs sm:text-sm font-semibold">
                <span className="text-red-300">{formatTemperature(day.maxTemp)}</span>
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> / </span>
                <span className="text-blue-300">{formatTemperature(day.minTemp)}</span>
              </div>
            </button>
          </form>
        ))}
      </div>
      <div className="grid grid-cols sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {selectedDayData?.items.map((item) => (
          <div key={item.dt} className="flex flex-col items-center p-4 rounded-lg bg-[#2c5492] hover:bg-[#3366a3] transition-colors duration-300 backdrop-blur-md shadow-xl h-full border border-white/20">
            <div className="text-lg font-bold text-white mb-2">
              {item.localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-16 h-16 relative mb-2">
              <Image
                src={`/weather-icons/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="font-bold text-2xl text-white mb-1">{formatTemperature(item.main.temp)}</div>
            <div className="text-sm text-center mb-4 text-white font-semibold capitalize h-10 flex items-center">
              {item.weather[0].description}
            </div>
            <div className="w-full pt-6 mt-auto border-t border-white/30">
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span>Feels like:</span>
                <span className='text-white'>{formatTemperature(item.main.feels_like)}</span>
              </div>
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span>Humidity:</span>
                <span className='text-white'>{item.main.humidity}%</span>
              </div>
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span>Wind:</span>
                <span className='text-white'>{Math.round(item.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>Rain:</span>
                <span className='text-white'>{Math.round(item.pop * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
