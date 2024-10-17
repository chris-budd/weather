'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  variant?: 'default' | 'large' | 'forecast';
}

export default function SearchBar({ variant = 'default' }: SearchBarProps) {
  const [zipCode, setZipCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateZipCode(zipCode)) {
      setIsValid(true);
      try {
        await router.push(`/weather/${zipCode}`);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 5);
    setZipCode(value);
    setIsValid(true);
  };

  const isLarge = variant === 'large';
  const isForecast = variant === 'forecast';

  return (
    <form onSubmit={handleSubmit} className={`
      ${isLarge ? 'w-64' : isForecast ? 'w-full max-w-xs' : 'w-full max-w-md'}
    `}>
      <div className={`
        relative flex items-center bg-white/15 backdrop-blur-md rounded-lg overflow-hidden shadow-lg
        ${isLarge ? 'h-16' : isForecast ? 'h-12' : ''}
        ${!isValid ? 'ring-2 ring-red-500' : ''}
      `}>
        <input
          type="number"
          value={zipCode}
          onChange={handleZipCodeChange}
          placeholder="Enter ZIP code"
          className={`
            w-full px-4 py-2 bg-transparent text-white placeholder-white/60 focus:outline-none
            ${isLarge ? 'text-2xl' : isForecast ? 'text-base' : 'text-sm'}
          `}
          maxLength={5}
        />
        <button
          type="submit"
          className={`absolute right-0 top-0 bottom-0 px-4 text-white hover:bg-white/10 transition-colors duration-300`}
          aria-label="Search"
        >
          <FaSearch size={isLarge ? 24 : isForecast ? 20 : 16} />
        </button>
      </div>
    </form>
  );
}
