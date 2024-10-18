import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import WeatherForecast from '../components/WeatherForecast';
import { ImageProps } from 'next/image';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Omit<ImageProps, 'src'> & { src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />
  },
}));

const mockForecast = {
  list: [
    {
      dt: 1619541600,
      main: { temp: 20, feels_like: 19, humidity: 50, temp_min: 18, temp_max: 22 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 5 },
      dt_txt: '2024-10-17 12:00:00',
      pop: 0.1,
    },
  ],
  city: { name: 'Beverly Hills', timezone: 0 },
};

describe('WeatherForecast', () => {
  it('renders forecast data correctly', () => {
    render(<WeatherForecast forecast={mockForecast} />);
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
    expect(screen.getByText('68°F')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('displays error message when forecast is null', () => {
    render(<WeatherForecast forecast={null} />);
    expect(screen.getByText('No forecast data available')).toBeInTheDocument();
  });

  it('displays error message when forecast has an error', () => {
    render(<WeatherForecast forecast={{ error: 'Test error' }} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
