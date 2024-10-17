export async function getWeatherData(zip: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  try {
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&appid=${apiKey}&units=metric`, { 
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.cod === "404" && data.message === "city not found") {
      return { error: "City not found. Please check the ZIP code and try again." };
    }

    if (data.cod !== "200") {
      throw new Error(`API Error: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return { error: "Network error. Please check your internet connection and try again." };
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { error: "Request timed out. Please try again later." };
    }
    return { error: "An error occurred while fetching weather data. Please try again later." };
  }
}
