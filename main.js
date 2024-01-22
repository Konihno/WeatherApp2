document.getElementById('submitButton').addEventListener('click', function () {

  var cities = document.getElementById('cityInput').value.split(',');
  document.getElementById('weatherResults').innerHTML = '';

  cities.forEach(city => {
      city = city.trim();
      if (city) {
          try {
              fetchWeatherData(city);
          } catch (error) {
              console.error('Error retrieving weather data:', error);
              document.getElementById('weatherResult').innerText = 'Error retrieving data for ' + city;
          }
      }
  });
});

async function fetchWeatherData(city) {
  var apiKey = 'cf46a674bf30e79282b179b31975fe2f';
  var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=metric';

  try {
      const imageUrl = await fetchCityImage(city);

      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();

      displayWeatherData(city, data, imageUrl);
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('weatherResults').innerText = 'Error retrieving data for ' + city;
  }
}

function displayWeatherData(city, data, imageUrl) {
  var resultsContainer = document.getElementById('weatherResults');

  resultsContainer.style.backgroundImage = `url('${imageUrl}')`;
  resultsContainer.style.backgroundSize = 'cover';
  resultsContainer.style.backgroundPosition = 'center';
  resultsContainer.style.backgroundRepeat = 'no-repeat';
  resultsContainer.innerHTML = '';

  data.list.forEach((forecast, index) => {
      if (index % 8 === 0) {
          let date = new Date(forecast.dt * 1000).toDateString();
          let temp = forecast.main.temp.toFixed(1);
          let weather = forecast.weather[0].main;
          let windSpeed = forecast.wind.speed;
          let humidity = forecast.main.humidity;

          var weatherDiv = document.createElement('div');
          weatherDiv.className = 'weather-info';
          weatherDiv.innerHTML = `
              <div class="weather-card">
                  <h3>${city} - ${date}</h3>
                  <p>Température: ${temp} °C</p>
                  <p>Conditions: ${weather}</p>
                  <p>Wind: ${windSpeed} m/s</p>
                  <p>Humidity: ${humidity}%</p>
                  <button onclick="removeWeatherInfo(this)">Remove</button>
              </div>`;
          resultsContainer.appendChild(weatherDiv);
      }
  });
}

function removeWeatherInfo(button) {

  button.parentElement.remove();
}

let debounceTimeout;
const DEBOUNCE_DELAY = 500;

async function searchCities(searchText) {

  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
      if (searchText.length < 3) {
          document.getElementById('autocompleteList').innerHTML = '';
          return;
      }

      var apiKey = "1fdfa294b7mshd8bb33fee03b92ap1cb664jsn4fd7181b8c1f";
      var url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchText}&limit=5`;

      const options = {
          method: 'GET',
          headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
      };

      try {
          const response = await fetch(url, options);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          let cities = data.data;

          let suggestions = '';
          cities.forEach(city => {
              suggestions += `<div onclick="selectCity('${city.city}')">${city.city}, ${city.countryCode}</div>`;
          });
          document.getElementById('autocompleteList').innerHTML = suggestions;
      } catch (error) {
          console.error('Error fetching city data:', error);
      }
  }, DEBOUNCE_DELAY);
}

function selectCity(cityName) {
  document.getElementById('cityInput').value = cityName;
  document.getElementById('autocompleteList').innerHTML = '';
}

async function fetchCityImage(city) {
  var unsplashApiKey = 'XrwkGx8tpsfcIrU21U846Q_n9-UL_ES_ioFSnbYUd8Q';
  var url = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${unsplashApiKey}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Response network not OK');
      }
      const data = await response.json();
      if (data.results.length > 0) {
          return data.results[0].urls.regular;
      } else {
          return '';
      }
  } catch (error) {
      console.error('Error fetching city image:', error);
      return '';
  }
}
function updateCityImage(imageUrl) {
  var imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  imageElement.alt = 'City Image';
  imageElement.style.maxWidth = '100%';

  var resultsContainer = document.getElementById('weatherResults');
  resultsContainer.insertBefore(imageElement, resultsContainer.firstChild);
}