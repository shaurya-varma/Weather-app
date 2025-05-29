import React, { useState } from 'react';
import { getCurrentWeather, getForecast } from './api/weatherService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
      setError('');

      const forecastData = await getForecast(data.coord.lat, data.coord.lon);
      setForecast(forecastData);
    } catch (err) {
      setError('City not found or API error');
      setWeather(null);
      setForecast(null);
    }
  };

  const chartData = forecast
    ? {
        labels: forecast.list
          .filter((_, idx) => idx % 8 === 0)
          .map((item) => new Date(item.dt_txt).toLocaleDateString()),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: forecast.list
              .filter((_, idx) => idx % 8 === 0)
              .map((item) => item.main.temp),
            fill: false,
            borderColor: '#f97316',
            backgroundColor: '#f97316',
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #fdf2f8, #fae8ff)',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', color: '#7c3aed' }}>
        Weather App
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px 0 0 8px',
            width: '250px',
          }}
        />
        <button
          onClick={fetchWeather}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '0 8px 8px 0',
            border: 'none',
            backgroundColor: '#a855f7',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p>}

      {weather && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #e4e4e7',
            borderRadius: '10px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: '#fef3c7',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#c2410c' }}>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      {forecast && (
        <div style={{ width: '80%', margin: '40px auto' }}>
          <h3 style={{ color: '#ea580c' }}>5-Day Forecast</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
