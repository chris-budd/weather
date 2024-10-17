'use client';

import Image from 'next/image';
import SearchBar from '../components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#4177bd] to-[#2c5492] p-4 sm:p-8 flex flex-col">
      <div className="container mx-auto max-w-4xl text-center mt-8 sm:mt-16">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Weather App Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Weather Forecast</h1>
        <div className="flex justify-center">
          <SearchBar variant="large" />
        </div>
      </div>
    </main>
  );
}
