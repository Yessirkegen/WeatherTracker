document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('search-city').value;

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('City not found or API error');
                return;
            }

            document.getElementById('city-name').innerText = data.location.name;
            document.getElementById('temperature').innerText = `${data.current.temp_c}°`;
            document.getElementById('condition-text').innerText = data.current.condition.text;
            document.getElementById('weather-description').innerText = `Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h`;

            const temp = data.current.temp_c;
            if (temp >= 30) {
                document.body.style.backgroundColor = '#FF5722';
            } else if (temp >= 20) {
                document.body.style.backgroundColor = '#FFC107';
            } else if (temp >= 10) {
                document.body.style.backgroundColor = '#03A9F4';
            } else {
                document.body.style.backgroundColor = '#2196F3';
            }

            updateHourlyForecast(data.forecast.forecastday[0].hour);
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
        });
});

function updateHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';

    hourlyData.forEach((hour, index) => {
        const isActive = index === 0 ? 'active' : '';
        const hourCard = `
            <div class="carousel-item ${isActive}">
                <div class="d-flex flex-column align-items-center">
                    <p>${formatHour(hour.time)}</p>
                    <img src="${getWeatherIcon(hour.condition.icon)}" alt="Weather icon">
                    <p>${hour.temp_c}°C</p>
                </div>
            </div>
        `;
        hourlyForecastContainer.insertAdjacentHTML('beforeend', hourCard);
    });
}

function formatHour(timeString) {
    const time = new Date(timeString);
    return `${time.getHours()}:00`;
}

function getWeatherIcon(iconUrl) {
    return `https:${iconUrl}`;
}
