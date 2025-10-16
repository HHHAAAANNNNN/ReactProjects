import { useState, useRef, useEffect } from 'react'

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const inputRef = useRef(null);

  // OpenWeatherMap API key - Replace with your own key
  const API_KEY = '65252b2889710569a9de7a8df0cc0560';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Auto-hide error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const getDisplayTemp = (tempCelsius) => {
    return isCelsius ? tempCelsius : celsiusToFahrenheit(tempCelsius);
  };

  const getTempUnit = () => {
    return isCelsius ? '°C' : '°F';
  };

  const getBackgroundGradient = (temp) => {
    // Determine gradient based on temperature (in Celsius)
    if (temp >= 25) {
      // Hot weather: Black to Orange gradient
      return 'linear-gradient(to bottom, hsl(0 0% 8%), hsl(25 90% 35%))';
    } else if (temp >= 15) {
      // Moderate weather: Black to Yellow-Orange gradient
      return 'linear-gradient(to bottom, hsl(0 0% 8%), hsl(40 80% 30%))';
    } else {
      // Cold weather: Black to Blue gradient
      return 'linear-gradient(to bottom, hsl(0 0% 8%), hsl(210 80% 30%))';
    }
  };

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
      setShowFavorites(false); // Auto disable favorites view

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setError('');
    setWeather(null);
    setShowFavorites(false); // Auto disable favorites view

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch weather for your location');
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
            visibility: data.visibility / 1000,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          });
          
          setCity(data.name);
        } catch (err) {
          setError(err.message || 'Failed to fetch weather data');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while fetching location.');
        }
      }
    );
  };

  const resetWeather = () => {
    setCity('');
    setWeather(null);
    setError('');
    setLoading(false);
    setLocationLoading(false);
    setShowFavorites(false);
  };

  const addToFavorites = () => {
    if (weather && !favorites.some(fav => fav.city === weather.city)) {
      setFavorites([...favorites, weather]);
    }
  };

  const removeFromFavorites = (cityName) => {
    setFavorites(favorites.filter(fav => fav.city !== cityName));
  };

  const isFavorite = () => {
    return weather && favorites.some(fav => fav.city === weather.city);
  };

  const loadFavoriteCity = (favoriteWeather) => {
    setWeather(favoriteWeather);
    setCity(favoriteWeather.city);
    setShowFavorites(false);
  };

  return (
    <div className="project-content">
      <h2>{showFavorites ? 'Favorite Cities' : 'Weather App'}</h2>
      <div className="weather-container">
        <div className="weather-search">
          <button 
            onClick={() => setShowFavorites(!showFavorites)} 
            className="favorites-toggle-btn"
            title={showFavorites ? 'Show Weather Search' : 'Show Favorite Cities'}
          >
            {showFavorites ? '🔙' : '⭐'}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
          />
          <button onClick={searchWeather} disabled={loading || locationLoading}>
            {loading ? '⏳ Loading...' : '🔍 Search'}
          </button>
          <button 
            onClick={getCurrentLocation} 
            disabled={loading || locationLoading}
            className="location-button"
            title="Use my location"
          >
            {locationLoading ? '⏳' : '📍'}
          </button>
          <button 
            onClick={resetWeather} 
            disabled={loading || locationLoading}
            className="reset-button"
            title="Reset"
          >
            ✕
          </button>
        </div>

        {showFavorites ? (
          favorites.length === 0 ? (
            <div className="empty-favorites">
              <p className="empty-message">No favorite cities yet. Add some by clicking ❤️ on weather results!</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((fav, index) => (
                <div key={index} className="favorite-card">
                  <button 
                    onClick={() => loadFavoriteCity(fav)}
                    className="favorite-city-btn"
                  >
                    <span className="favorite-city-name">{fav.city}</span>
                    <span className="favorite-country">{fav.country}</span>
                    <span className="favorite-temp">{fav.temp}°C</span>
                  </button>
                  <button 
                    onClick={() => removeFromFavorites(fav.city)}
                    className="remove-favorite"
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {error && (
              <div className="weather-error">
                ❌ {error}
              </div>
            )}

            {(loading || locationLoading) && (
              <div className="weather-loading">
                <div className="loading-spinner"></div>
                <p>{locationLoading ? 'Getting your location...' : 'Searching for weather data...'}</p>
              </div>
            )}

            {weather && (
              <div 
                className="weather-info" 
                style={{ background: getBackgroundGradient(weather.temp) }}
              >
                <button 
                  onClick={isFavorite() ? () => removeFromFavorites(weather.city) : addToFavorites}
                  className={`favorite-heart ${isFavorite() ? 'favorited' : ''}`}
                  title={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite() ? '❤️' : '🤍'}
                </button>

                <div className="weather-header">
              <div className="weather-icon">{weather.icon}</div>
              <div className="weather-location">
                <h3>{weather.city}, {weather.country}</h3>
                <p className="weather-description">{weather.description}</p>
              </div>
              <button 
                onClick={() => setIsCelsius(!isCelsius)} 
                className="temp-toggle"
                title="Toggle temperature unit"
              >
                {isCelsius ? '°F' : '°C'}
              </button>
            </div>

            <div className="weather-main">
              <div className="temp-display">
                <span className="temp-value">{getDisplayTemp(weather.temp)}</span>
                <span className="temp-unit">{getTempUnit()}</span>
              </div>
              <p className="feels-like">Feels like {getDisplayTemp(weather.feelsLike)}{getTempUnit()}</p>
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

        {!weather && !loading && !locationLoading && !error && (
          <p className="empty-message">Enter a city name or use 📍 to detect your location</p>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
