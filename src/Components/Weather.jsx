import React, { useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setError('');
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (error) {
      setError('An error occurred while fetching the weather data.');
      setWeather(null);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img src={search_icon} alt="Search" onClick={() => search(query)} />
      </div>
      {error && <p className="error">{error}</p>}
      {weather && (
        <>
          <img
            src={getWeatherIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className='weather-icon'
          />
          <p className='temperature'>{weather.main.temp} °C</p>
          <p className='location'>{weather.name}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weather.main.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weather.wind.speed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;




