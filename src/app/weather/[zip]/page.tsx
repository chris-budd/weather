import { Metadata } from 'next';
import Link from 'next/link';
import { FaChevronLeft, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import WeatherForecast from '../../../components/WeatherForecast';
import SearchBar from '../../../components/SearchBar';
import { getWeatherData } from '../../../utils/weather';

export const metadata: Metadata = {
  title: '5-Day Weather Forecast',
  description: '3-hour increment weather forecast for US zip codes',
};

export default async function WeatherPage({ params, searchParams }: { params: { zip: string }, searchParams: { day?: string } }) {
  const { zip } = params;
  const selectedDay = searchParams.day ? parseInt(searchParams.day) : 0;
  const weatherData = await getWeatherData(zip);

  if ('error' in weatherData) {
    const isCityNotFound = weatherData.error.includes("City not found");
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#4177bd] to-[#2c5492] p-4 sm:p-8">
        <div className="container mx-auto max-w-7xl">
          <header className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8">
            <div className="w-full sm:w-auto flex items-center">
              <Link href="/" className="mr-4 text-white/60 hover:text-white transition-colors p-2 flex items-center">
                <FaChevronLeft size={20} />
              </Link>
              <SearchBar variant="forecast" />
            </div>
            <h1 className="text-4xl font-bold text-white text-center sm:text-right mt-4 sm:mt-0">
              Weather Forecast
            </h1>
          </header>
          <div className="text-white text-center bg-white/10 backdrop-blur-md rounded-lg p-10 shadow-lg">
            {isCityNotFound ? (
              <>
                <h2 className="text-3xl font-bold mb-4">City not found</h2>
                <p className="text-xl mb-6">Please check the ZIP code and try again.</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Forecast: Not looking good</h2>
                <p className="text-xl mb-6">{weatherData.error}</p>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  const cityName = weatherData?.city?.name || 'Unknown City';
  const currentTime = new Date((Date.now() + weatherData.city.timezone * 1000));
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#4177bd] to-[#2c5492] p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8">
          <div className="w-full sm:w-auto flex items-center">
            <Link href="/" className="mr-4 text-white/60 hover:text-white transition-colors p-2 flex items-center">
              <FaChevronLeft size={20} />
            </Link>
            <SearchBar variant="forecast" />
          </div>
          <div className="text-center sm:text-right mt-10 sm:mt-0">
            <h1 className="text-5xl sm:text-4xl font-bold text-white mb-2">
              {cityName}
            </h1>
            <div className="text-xl text-white/80 font-light">
              <span className="mr-4 inline-flex items-center">
                <FaMapMarkerAlt className="mr-1" size={16} />
                {zip}
              </span>
              <span className="inline-flex items-center">
                <FaClock className="mr-1" size={16} />
                {formattedTime}
              </span>
            </div>
          </div>
        </header>
        <WeatherForecast forecast={weatherData} selectedDay={selectedDay} />
      </div>
    </main>
  );
}
