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

            // Change the video background based on weather conditions
            let videoSource = '';
            if (temp < 10) {
                videoSource = 'assets/cold.mp4'; // Path to your cold weather video
               // document.body.style.backgroundColor = '#2196F3'; // Change background color for cold
            } else if (data.current.condition.text.toLowerCase().includes("partly cloudy")) {
                videoSource = 'assets/cloudy.mp4'; // Path to your cloudy weather video
               // document.body.style.backgroundColor = '#03A9F4'; // Change background color for cloudy
            }else if (data.current.condition.text.toLowerCase().includes("rain")) {
                videoSource = 'assets/rain.mp4'; // Path to your cloudy weather video
               // document.body.style.backgroundColor = '#03A9F4'; // Change background color for cloudy
            } 
            else if (temp >= 30) {
                videoSource = 'assets/hot.mp4'; // Path to your hot weather video
                //document.body.style.backgroundColor = '#FF5722'; // Change background color for hot
            } else if (temp >= 20) {
                videoSource = 'assets/warm.mp4'; // Path to your warm weather video
               // document.body.style.backgroundColor = '#FFC107'; // Change background color for warm
            } else {
                document.body.style.backgroundColor = '#03A9F4'; // Default background color
            }

            // Update the video source
            const videoElement = document.getElementById('background-video');
            const videoSourceElement = document.getElementById('video-source');
            videoSourceElement.src = videoSource;
            videoElement.load(); // Load the new video

            updateHourlyForecast(data.forecast.forecastday[0].hour);
        });
});

// Function to update hourly forecast (replace with your own logic)
function updateHourlyForecast(hourlyData) {
    // Implement your hourly forecast logic here
}
// DOM Manipulation and Theme Switching
const themeToggle = document.createElement('button');
themeToggle.id = 'theme-toggle';
themeToggle.className = 'btn btn-outline-light ms-2';
themeToggle.innerText = '🌙';
document.querySelector('.navbar').appendChild(themeToggle);

// Theme switching functionality
let isDarkMode = true;
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-theme');
    themeToggle.innerText = isDarkMode ? '🌙' : '☀️';
    
    // Update card and forecast styles
    const weatherCard = document.querySelector('.weather-card');
    weatherCard.style.backgroundColor = isDarkMode ? 'rgba(38, 103, 160, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    weatherCard.style.color = isDarkMode ? 'white' : 'black';
    
    document.querySelectorAll('.forecast-item').forEach(item => {
        item.style.backgroundColor = isDarkMode ? '#1e4979' : '#e9ecef';
        item.style.color = isDarkMode ? 'white' : 'black';
    });
});

// Sound Effects
const weatherSounds = {
    rain: new Audio('assets/rain-sound.mp3'),
    thunder: new Audio('assets/thunder-sound.mp3'),
    wind: new Audio('assets/wind-sound.mp3')
};

// Enhanced weather data handling with animations
document.getElementById('search-btn').addEventListener('click', async function () {
    const city = document.getElementById('search-city').value;
    if (!city) {
        showNotification('Please enter a city name', 'error');
        return;
    }

    try {
        const response = await fetch(`/weather?city=${city}`);
        const data = await response.json();
        
        if (data.error) {
            showNotification('City not found or API error', 'error');
            return;
        }

        // Animate weather data update
        animateWeatherUpdate(data);
        
        // Play weather sounds based on condition
        playWeatherSound(data.current.condition.text);
        
        // Update hourly forecast with animation
        updateHourlyForecast(data.forecast.forecastday[0].hour);
        
    } catch (error) {
        showNotification('Failed to fetch weather data', 'error');
    }
});

// Animation functions
function animateWeatherUpdate(data) {
    const elements = {
        cityName: document.getElementById('city-name'),
        temperature: document.getElementById('temperature'),
        condition: document.getElementById('condition-text')
    };

    // Add fade-out animation
    Object.values(elements).forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(-20px)';
    });

    // Update content and fade in
    setTimeout(() => {
        elements.cityName.innerText = data.location.name;
        elements.temperature.innerText = `${data.current.temp_c}°`;
        elements.condition.innerText = data.current.condition.text;

        Object.values(elements).forEach(el => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        });
    }, 300);
}

// Enhanced hourly forecast with animation
function updateHourlyForecast(hourlyData) {
    const forecastContainer = document.querySelector('.hourly-forecast');
    forecastContainer.innerHTML = '';

    hourlyData.forEach((hour, index) => {
        const hourEl = document.createElement('div');
        hourEl.className = 'forecast-item';
        hourEl.innerHTML = `
            <div>${new Date(hour.time).getHours()}:00</div>
            <img src="${hour.condition.icon}" alt="${hour.condition.text}">
            <div>${hour.temp_c}°</div>
        `;

        // Add staggered animation
        hourEl.style.opacity = 0;
        hourEl.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            hourEl.style.transition = 'all 0.3s ease';
            hourEl.style.opacity = 1;
            hourEl.style.transform = 'translateY(0)';
        }, index * 100);

        forecastContainer.appendChild(hourEl);
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Weather sound effects
function playWeatherSound(condition) {
    // Stop all playing sounds first
    Object.values(weatherSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) {
        weatherSounds.rain.play();
    } else if (lowerCondition.includes('thunder')) {
        weatherSounds.thunder.play();
    } else if (lowerCondition.includes('wind')) {
        weatherSounds.wind.play();
    }
}

// Keyboard navigation for cities
const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
let currentCityIndex = -1;

document.addEventListener('keydown', (e) => {
    const searchInput = document.getElementById('search-city');
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            currentCityIndex = Math.max(0, currentCityIndex - 1);
            searchInput.value = popularCities[currentCityIndex];
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            currentCityIndex = Math.min(popularCities.length - 1, currentCityIndex + 1);
            searchInput.value = popularCities[currentCityIndex];
            break;
            
        case 'Enter':
            if (searchInput.value) {
                document.getElementById('search-btn').click();
            }
            break;
    }
});

// Add corresponding CSS
const style = document.createElement('style');
style.textContent = `
    .light-theme {
        background-color: #f8f9fa;
        color: #333;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.error {
        background-color: #dc3545;
        color: white;
    }

    .notification.success {
        background-color: #28a745;
        color: white;
    }

    .forecast-item {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .forecast-item:hover {
        transform: scale(1.05);
    }
`;

document.head.appendChild(style);