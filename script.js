const apiKey = '3234c2793c819faf6ed4b9248671a534'; // Your API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const searchBar = document.getElementById('search-bar');
const body = document.getElementById('body');
const heading = document.getElementById('heading');

// Elements for current weather
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weather-icon');
const windSpeedElement = document.getElementById('wind-speed');
const precipitationElement = document.getElementById('precipitation');
const pressureElement = document.getElementById('pressure');

// Element for forecast
const forecastContainer = document.getElementById('forecast-container');

// Function to fetch and display weather
function fetchWeather(city) {
  // Fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => {
      // Change background to blue and show weather container
      body.classList.add('blue-bg');
      heading.classList.add('hidden'); // Hide "Enter City" heading
      searchBar.classList.add('hidden');
      weatherContainer.classList.remove('hidden');

      // Display current weather
      locationElement.textContent = `${data.name}, ${data.sys.country}`;
      temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
      descriptionElement.textContent = data.weather[0].description;
      weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      windSpeedElement.textContent = `${data.wind.speed} kmph`;
      precipitationElement.textContent = `0 mm`; // OpenWeatherMap doesn't provide precipitation directly
      pressureElement.textContent = `${data.main.pressure} mb`;
    })
    .catch(error => alert(error.message));

  // Fetch 5-day forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => {
      forecastContainer.innerHTML = ''; // Clear existing forecast
      const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      dailyForecast.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
        const temp = Math.round(day.main.temp);
        forecastContainer.innerHTML += `
          <div class="forecast-day">
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${day.weather[0].description}">
            <p>${temp}°C</p>
          </div>
        `;
      });
    })
    .catch(error => alert(error.message));
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name');
  }
});
