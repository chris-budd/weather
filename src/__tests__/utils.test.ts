import { getLocalTime, celsiusToFahrenheit } from '../components/WeatherForecast';

describe('Utility Functions', () => {
  describe('getLocalTime', () => {
    it('converts UTC timestamp to local time', () => {
      const utcTimestamp = 1729166400; // Thursday, 17 October 2024 12:00:00
      const timezoneOffset = 3600; // +1 hour
      const localTime = getLocalTime(utcTimestamp, timezoneOffset);
      expect(localTime.getUTCHours()).toBe(13);
    });
  });

  describe('celsiusToFahrenheit', () => {
    it('converts 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBeCloseTo(32);
    });

    it('converts 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBeCloseTo(212);
    });
  });
});
