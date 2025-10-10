import { useState } from 'react'

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const searchWeather = () => {
    // TODO: Implement weather API integration
    // For now, just a placeholder
    if (city.trim()) {
      setWeather({
        city: city,
        temp: '25°C',
        condition: 'Sunny',
        humidity: '60%'
      });
    }
  };

  return (
    <div className="project-content">
      <h2>Weather App</h2>
      <div className="weather-container">
        <div className="weather-search">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
          />
          <button onClick={searchWeather}>Search</button>
        </div>
        {weather && (
          <div className="weather-info">
            <h3>{weather.city}</h3>
            <p className="temp">{weather.temp}</p>
            <p className="condition">{weather.condition}</p>
            <p className="humidity">Humidity: {weather.humidity}</p>
          </div>
        )}
        {!weather && (
          <p className="empty-message">Enter a city to see the weather</p>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
