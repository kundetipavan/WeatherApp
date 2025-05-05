import React, { useState } from 'react';
import axios from 'axios';
 
function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    try {
      const apiKey = '72f4a9b91b06f288f4ba9928f9c85cea'; // Replace with your OpenWeatherMap API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('District not found or invalid input');
      setWeather(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="weather-app-container">
      <div className="weather-card">
        <h1 className="weather-title">Weather App</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter District name"
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          
        </form>
        {error && <p className="error-message">{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2 className="city-name">{weather.name}</h2>
            <p className="weather-description">{weather.weather[0].description}</p>
            <p className="temperature">{Math.round(weather.main.temp)}°C</p>
            <p className="humidity">Humidity: {weather.main.humidity}%</p>
            <p className="wind">Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;