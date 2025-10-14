import { useState, useRef } from 'react'

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // OpenWeatherMap API key - Replace with your own key
  const API_KEY = '65252b2889710569a9de7a8df0cc0560';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const getWeatherIcon = (iconCode) => {
    // Map OpenWeatherMap icon codes to emoji
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const searchWeather = async () => {
    if (city.trim()) {
      setLoading(true);
      setError('');
      setWeather(null);

      try {
        const response = await fetch(
          `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('City not found');
        }

        const data = await response.json();
        
        setWeather({
          city: data.name,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          icon: getWeatherIcon(data.weather[0].icon),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          windDeg: data.wind.deg,
          clouds: data.clouds.all,
          visibility: data.visibility / 1000, // Convert to km
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    } else {
      // Focus input if empty
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  return (
    <div className="project-content">
      <h2>Weather App</h2>
      <div className="weather-container">
        <div className="weather-search">
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
          />
          <button onClick={searchWeather} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔍 Search'}
          </button>
        </div>

        {error && (
          <div className="weather-error">
            ❌ {error}
          </div>
        )}

        {weather && (
          <div className="weather-info">
            <div className="weather-header">
              <div className="weather-icon">{weather.icon}</div>
              <div className="weather-location">
                <h3>{weather.city}, {weather.country}</h3>
                <p className="weather-description">{weather.description}</p>
              </div>
            </div>

            <div className="weather-main">
              <div className="temp-display">
                <span className="temp-value">{weather.temp}</span>
                <span className="temp-unit">°C</span>
              </div>
              <p className="feels-like">Feels like {weather.feelsLike}°C</p>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <div className="detail-info">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weather.humidity}%</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <div className="detail-info">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weather.windSpeed} m/s</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <div className="detail-info">
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">{weather.pressure} hPa</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">☁️</span>
                <div className="detail-info">
                  <span className="detail-label">Cloudiness</span>
                  <span className="detail-value">{weather.clouds}%</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">👁️</span>
                <div className="detail-info">
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">{weather.visibility} km</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🌅</span>
                <div className="detail-info">
                  <span className="detail-label">Sunrise</span>
                  <span className="detail-value">{weather.sunrise}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🌇</span>
                <div className="detail-info">
                  <span className="detail-label">Sunset</span>
                  <span className="detail-value">{weather.sunset}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🧭</span>
                <div className="detail-info">
                  <span className="detail-label">Wind Direction</span>
                  <span className="detail-value">{weather.windDeg}°</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <p className="empty-message">Enter a city to see the weather</p>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
