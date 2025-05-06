import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState('');

  const apiKey = '72f4a9b91b06f288f4ba9928f9c85cea'; // Replace with your OpenWeatherMap API key

  const fetchWeatherData = async (cityName) => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      const { coord } = weatherRes.data;
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`
      );
      const airRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
      );

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list.slice(0, 6)); // 6 upcoming hourly forecasts
      setAirQuality(airRes.data.list[0]);
      setError('');
    } catch (err) {
      setError('District not found or invalid input');
      setWeather(null);
      setForecast([]);
      setAirQuality(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
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
          <button type="submit" className="search-button">Search</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2 className="city-name">{weather.name}</h2>
            <p className="weather-description">{weather.weather[0].description}</p>
            <p className="temperature">{Math.round(weather.main.temp)}°C</p>
            <p className="min-max">Low: {Math.round(weather.main.temp_min)}° / High: {Math.round(weather.main.temp_max)}°</p>
            <div className="flex">
              <div>
            <p className="humidity">Humidity: {weather.main.humidity}%</p>
            <p className="wind">Wind: {weather.wind.speed} m/s</p>
            </div>
            <div className='top'>
            <p className="feels-like">Feels like: {Math.round(weather.main.feels_like)}°C</p>
            {airQuality && (
              <p className="air-quality">
                Air Quality Index: {airQuality.main.aqi} - {['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][airQuality.main.aqi - 1]}
              </p>
            )}</div>
            </div>
            <h3>Hourly Forecast</h3>
            <div className="forecast">
              {forecast.map((hour, i) => (
                <div key={i} className="forecast-hour">
                  <p>{moment(hour.dt_txt).format('h A')}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    width="50"
                  />
                  <p>{Math.round(hour.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
