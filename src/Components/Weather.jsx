import React, { useState, useEffect } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Weather = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [position, setPosition] = useState([51.505, -0.09]); 

  const search = async (city) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (weatherData.cod === 200) {
        setWeather(weatherData);
        setError('');
        setPosition([weatherData.coord.lat, weatherData.coord.lon]);
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod === '200') {
          setForecast(forecastData);
        } else {
          setError(forecastData.message);
        }
      } else {
        setError(weatherData.message);
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

  const fetchCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        if (weatherData.cod === 200) {
          setWeather(weatherData);
          setError('');
          setPosition([latitude, longitude]); 
        } else {
          setError(weatherData.message);
          setWeather(null);
        }
      } catch (error) {
        setError('An error occurred while fetching the weather data.');
        setWeather(null);
      }
    });
  };

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, [unit]);

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
          <p className='temperature'>{weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
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
                <p>{weather.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          <div className="map-container">
            <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>
                  {weather.name} <br /> {weather.weather[0].description}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </>
      )}
      {forecast && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {forecast.list.filter((_, index) => index % 8 === 0).map((item) => (
              <div key={item.dt} className="forecast-card">
                <p className='forecast-date'>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={getWeatherIconUrl(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className='weather-icon'
                />
                <p className='forecast-temperature'>{item.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
                <p className='forecast-description'>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;





