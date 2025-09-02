document.addEventListener('DOMContentLoaded', () => {
  const citySelect = document.getElementById('city');
  const form = document.getElementById('city-form');
  const forecastDiv = document.getElementById('forecast');

  // Load CSV
  fetch('city_coordinates.csv')
    .then(response => response.text())
    .then(data => {
      const lines = data.trim().split('\n').slice(1); // skip header
      lines.forEach(line => {
        const [lat, lon, city, country] = line.split(',');
        const option = document.createElement('option');
        option.value = `${lat},${lon}`;
        option.textContent = `${city}, ${country}`;
        citySelect.appendChild(option);
      });
    })
    .catch(err => console.error('Error loading CSV:', err));

  // Map 7Timer codes to icons
  function getWeatherIcon(weather) {
    weather = weather.toLowerCase();
    if (weather.includes('cloudy')) return 'cloudy.png';
    if (weather.includes('rain')) return 'rain.png';
    if (weather.includes('snow')) return 'snow.png';
    if (weather.includes('ts')) return 'thunderstorm.png';
    if (weather.includes('clear')) return 'clear.png';
    return 'cloudy.png';
  }

  // Optional: nicer weather text
  function formatWeatherName(code) {
  const weatherMap = {
    "clear": "Clear",
    "pcloudy": "Partly Cloudy",
    "mcloudy": "Mostly Cloudy",
    "cloudy": "Cloudy",
    "lightrain": "Light Rain",
    "ishower": "Shower",
    "rain": "Rain",
    "snow": "Snow",
    "ts": "Thunderstorm",
    "tsrain": "Thunderstorm & Rain"
  };

  code = code.toLowerCase();
  let suffix = "";

  if (code.endsWith("day")) {
    suffix = " (Day)";
    code = code.replace("day", "");
  } else if (code.endsWith("night")) {
    suffix = " (Night)";
    code = code.replace("night", "");
  }

  const base = weatherMap[code] || code;
  return base + suffix;
}


  // Handle form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    const coords = citySelect.value;
    if (!coords) return;
    const [lat, lon] = coords.split(',');
    forecastDiv.innerHTML = "Loading forecast...";

    fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`)
      .then(res => res.json())
      .then(data => {
        forecastDiv.innerHTML = '';
        const weatherData = data.dataseries.slice(0,7);
        weatherData.forEach((day, i) => {
          const icon = getWeatherIcon(day.weather);
          const dayDiv = document.createElement('div');
          dayDiv.className = 'day';
          dayDiv.innerHTML = `
            <h3>Day ${i+1}</h3>
            <img src="images/${icon}" alt="${day.weather}" width="60" height="60">
            <p>Temp: ${day.temp2m}°C</p>
            <p><strong>Weather:</strong> ${formatWeatherName(day.weather)}</p>
            <p>Wind: ${day.wind10m.direction}</p>
          `;
          forecastDiv.appendChild(dayDiv);
        });
      })
      .catch(err => {
        forecastDiv.innerHTML = 'Failed to load forecast';
        console.error(err);
      });
  });
});
