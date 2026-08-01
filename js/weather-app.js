// Weather Dashboard Application
// Using OpenWeatherMap API (Free tier - 5 day forecast)

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastGrid = document.getElementById('forecastGrid');
const searchHistory = document.getElementById('searchHistory');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeModal = document.querySelector('.close');

// State
let recentSearches = JSON.parse(localStorage.getItem('weatherSearches')) || [];
let currentCity = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    closeModal.addEventListener('click', () => {
        errorModal.style.display = 'none';
    });
    
    // Load weather for default city
    fetchWeather('London');
});

// Handle Search
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
        searchInput.value = '';
    }
}

// Fetch Weather Data
async function fetchWeather(city) {
    try {
        if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            showError('Please add your OpenWeatherMap API key to the weather-app.js file');
            return;
        }

        // Show loading state
        currentWeatherSection.innerHTML = `
            <div class="weather-loader">
                <div class="spinner"></div>
                <p>Loading weather data for ${city}...</p>
            </div>
        `;

        // Fetch current weather
        const currentResponse = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();
        currentCity = city;

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        // Update UI
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        addToSearchHistory(city);

    } catch (error) {
        showError(`Error: ${error.message}. Please try again.`);
        console.error('Weather fetch error:', error);
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    const { name, sys, main, weather, wind, clouds, visibility } = data;
    
    const weatherIcon = getWeatherEmoji(weather[0].main);
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const description = weather[0].description;
    const humidity = main.humidity;
    const pressure = main.pressure;
    const windSpeed = wind.speed;
    const visibilityKm = (visibility / 1000).toFixed(1);
    const cloudiness = clouds.all;

    currentWeatherSection.innerHTML = `
        <div class="weather-info">
            <div class="weather-main">
                <div class="weather-icon">${weatherIcon}</div>
                <h2 class="city-name">${name}, ${sys.country}</h2>
                <p class="weather-description">${description}</p>
                <div class="temperature-display">${temperature}°C</div>
                <p class="feels-like">Feels like ${feelsLike}°C</p>
            </div>
            <div class="weather-stats">
                <div class="stat-item">
                    <div class="stat-label">Humidity</div>
                    <div class="stat-value">${humidity}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Wind Speed</div>
                    <div class="stat-value">${windSpeed} m/s</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Pressure</div>
                    <div class="stat-value">${pressure} hPa</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Cloudiness</div>
                    <div class="stat-value">${cloudiness}%</div>
                </div>
            </div>
        </div>
    `;

    // Update detail cards
    updateDetailCard('humidityCard', humidity, '%');
    updateDetailCard('windCard', windSpeed.toFixed(1), 'm/s');
    updateDetailCard('pressureCard', pressure, 'hPa');
    updateDetailCard('visibilityCard', visibilityKm, 'km');
}

// Update Detail Card
function updateDetailCard(cardId, value, unit) {
    const card = document.getElementById(cardId);
    if (card) {
        card.querySelector('.detail-value').textContent = value;
        card.querySelector('.detail-unit').textContent = unit;
    }
}

// Display 5-Day Forecast
function displayForecast(data) {
    const forecastByDay = {};
    
    // Group forecast by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(item);
    });

    // Get one forecast per day (taking noon forecast)
    const dailyForecasts = Object.entries(forecastByDay)
        .slice(0, 5)
        .map(([date, forecasts]) => {
            // Get forecast closest to noon
            return forecasts.reduce((closest, current) => {
                const currentHour = new Date(current.dt * 1000).getHours();
                const closestHour = new Date(closest.dt * 1000).getHours();
                return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
            });
        });

    forecastGrid.innerHTML = '';

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = Math.round(forecast.main.temp);
        const tempMin = Math.round(forecast.main.temp_min);
        const tempMax = Math.round(forecast.main.temp_max);
        const icon = getWeatherEmoji(forecast.weather[0].main);
        const description = forecast.weather[0].description;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${description}</div>
            <div class="forecast-details">
                <div>📊 H: ${tempMax}° L: ${tempMin}°</div>
                <div>💧 Humidity: ${humidity}%</div>
                <div>💨 Wind: ${windSpeed} m/s</div>
            </div>
        `;
        forecastGrid.appendChild(forecastCard);
    });
}

// Get Weather Emoji based on weather condition
function getWeatherEmoji(condition) {
    const conditions = {
        'Clear': '☀️',
        'Sunny': '☀️',
        'Clouds': '☁️',
        'Cloudy': '☁️',
        'Overcast': '☁️',
        'Rain': '🌧️',
        'Rainy': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Snowy': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌫️',
        'Fog': '🌫️',
        'Sand': '🌫️',
        'Ash': '🌫️',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return conditions[condition] || '🌤️';
}

// Add to Search History
function addToSearchHistory(city) {
    const index = recentSearches.indexOf(city);
    if (index > -1) {
        recentSearches.splice(index, 1);
    }
    recentSearches.unshift(city);
    recentSearches = recentSearches.slice(0, 10); // Keep only last 10 searches
    localStorage.setItem('weatherSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

// Load Recent Searches
function loadRecentSearches() {
    searchHistory.innerHTML = '';
    
    if (recentSearches.length === 0) {
        searchHistory.innerHTML = '<p class="empty-history">No recent searches</p>';
        return;
    }

    recentSearches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'history-btn';
        btn.innerHTML = `${city}`;
        btn.addEventListener('click', () => fetchWeather(city));
        searchHistory.appendChild(btn);
    });
}

// Show Error Message
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === errorModal) {
        errorModal.style.display = 'none';
    }
});