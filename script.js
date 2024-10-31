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
// User Authentication and Preferences Management
const userPreferences = {
    init() {
        this.setupAuthListeners();
        this.loadUserPreferences();
        this.setupThemeToggle();
        this.loadSavedCity();
    },

    setupAuthListeners() {
        // Add login form to navbar
        const loginForm = document.createElement('form');
        loginForm.id = 'login-form';
        loginForm.className = 'd-flex align-items-center ms-auto';
        loginForm.innerHTML = `
            ${!this.getCurrentUser() ? `
                <input type="text" id="username" placeholder="Username" class="form-control form-control-sm me-2">
                <button type="submit" class="btn btn-outline-light btn-sm">Login</button>
            ` : `
                <span class="me-2 text-light">Welcome, ${this.getCurrentUser().username}</span>
                <button type="button" id="logout-btn" class="btn btn-outline-light btn-sm">Logout</button>
            `}
        `;
        
        document.querySelector('.navbar').appendChild(loginForm);

        // Handle login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            if (username) {
                this.login(username);
                location.reload();
            }
        });

        // Handle logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.logout();
            location.reload();
        });
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('weatherUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    login(username) {
        const user = {
            username,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('weatherUser', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('weatherUser');
    },

    loadUserPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('weatherTheme') || 'dark';
        document.body.classList.toggle('light-theme', savedTheme === 'light');
        
        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerText = savedTheme === 'light' ? '🌙' : '☀️';
        }
    },

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('weatherTheme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('weatherTheme', newTheme);
            document.body.classList.toggle('light-theme');
            themeToggle.innerText = newTheme === 'light' ? '🌙' : '☀️';
            
            // Update weather card and forecast items based on theme
            const weatherCard = document.querySelector('.weather-card');
            const forecastItems = document.querySelectorAll('.forecast-item');
            
            if (newTheme === 'light') {
                weatherCard.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                weatherCard.style.color = '#333';
                forecastItems.forEach(item => {
                    item.style.backgroundColor = '#e9ecef';
                    item.style.color = '#333';
                });
            } else {
                weatherCard.style.backgroundColor = 'rgba(38, 103, 160, 0.8)';
                weatherCard.style.color = 'white';
                forecastItems.forEach(item => {
                    item.style.backgroundColor = '#1e4979';
                    item.style.color = 'white';
                });
            }
        });
    },

    loadSavedCity() {
        const savedCity = localStorage.getItem('lastSearchedCity');
        if (savedCity) {
            const searchInput = document.getElementById('search-city');
            if (searchInput) {
                searchInput.value = savedCity;
                // Optionally trigger a search
                // document.getElementById('search-btn').click();
            }
        }
    }
};

// Enhance existing search functionality to save last searched city
document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('search-city').value;
    if (city) {
        localStorage.setItem('lastSearchedCity', city);
    }
    // ... rest of the existing search functionality
});

// Save user's favorite cities
const cityManager = {
    favoriteCities: JSON.parse(localStorage.getItem('favoriteCities') || '[]'),

    addFavorite(city) {
        if (!this.favoriteCities.includes(city)) {
            this.favoriteCities.push(city);
            this.saveFavorites();
            this.updateFavoritesList();
        }
    },

    removeFavorite(city) {
        this.favoriteCities = this.favoriteCities.filter(c => c !== city);
        this.saveFavorites();
        this.updateFavoritesList();
    },

    saveFavorites() {
        localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
    },

    updateFavoritesList() {
        const favoritesList = document.querySelector('.favorites-list');
        if (!favoritesList) return;

        favoritesList.innerHTML = this.favoriteCities.map(city => `
            <div class="favorite-city d-flex justify-content-between align-items-center mb-2">
                <span class="city-name">${city}</span>
                <button class="btn btn-sm btn-outline-danger remove-favorite" data-city="${city}">Remove</button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeFavorite(e.target.dataset.city);
            });
        });
    }
};

// Add favorite city button to weather card
const addFavoriteButton = document.createElement('button');
addFavoriteButton.className = 'btn btn-outline-light mt-3';
addFavoriteButton.innerText = '★ Add to Favorites';
addFavoriteButton.addEventListener('click', () => {
    const cityName = document.getElementById('city-name').innerText;
    if (cityName) {
        cityManager.addFavorite(cityName);
        showNotification('City added to favorites!', 'success');
    }
});

document.querySelector('.weather-card').appendChild(addFavoriteButton);

// Initialize user preferences when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    userPreferences.init();
    cityManager.updateFavoritesList();
});

// Weather Application with Authentication, Filtering, and Enhanced Features

const WeatherApp = {
    // Initialize the application
    init() {
        this.setupAuth();
        this.setupThemeToggle();
        this.setupFilters();
        this.loadUserPreferences();
        this.setupEventListeners();
    },

    // Authentication System
    setupAuth() {
        // Create authentication container
        const authContainer = document.createElement('div');
        authContainer.className = 'auth-container ms-auto d-flex align-items-center';

        const user = this.getUser();

        if (!user) {
            // Login/Register form
            authContainer.innerHTML = `
                <form class="d-flex align-items-center" id="auth-form">
                    <input type="text" id="username" class="form-control form-control-sm me-2" placeholder="Username" required>
                    <input type="password" id="password" class="form-control form-control-sm me-2" placeholder="Password" required>
                    <button type="submit" id="login-btn" class="btn btn-outline-light btn-sm">Login</button>
                    <button type="button" id="register-btn" class="btn btn-outline-light btn-sm ms-2">Register</button>
                </form>
                <div id="auth-message" class="auth-message ms-2"></div>
            `;
        } else {
            // User greeting and logout button
            authContainer.innerHTML = `
                <span id="txt_welc" class="text-light me-2">Welcome, ${user.username}</span>
                <button type="button" id="logout-btn" class="btn btn-outline-light btn-sm">Logout</button>
            `;
        }

        document.querySelector('.navbar-collapse').appendChild(authContainer);
        this.setupAuthListeners();
    },

    setupAuthListeners() {
        const authForm = document.getElementById('auth-form');
        const registerBtn = document.getElementById('register-btn');
        const logoutBtn = document.getElementById('logout-btn');

        authForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;

            if (username && password) {
                this.login(username, password);
            }
        });

        registerBtn?.addEventListener('click', () => {
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;

            if (username && password) {
                this.register(username, password);
            }
        });

        logoutBtn?.addEventListener('click', () => this.logout());
    },

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            this.showAuthMessage('Invalid credentials', 'error');
            return;
        }

        localStorage.setItem('weatherUser', JSON.stringify({ username }));
        this.showNotification('Login successful', 'success');
        location.reload();
    },

    register(username, password) {
        const users = this.getUsers();

        if (users.some(u => u.username === username)) {
            this.showAuthMessage('Username already exists', 'error');
            return;
        }

        users.push({ username, password });
        localStorage.setItem('weatherUsers', JSON.stringify(users));
        this.showAuthMessage('Registration successful. Please login.', 'success');
    },

    logout() {
        localStorage.removeItem('weatherUser');
        this.showNotification('Logged out successfully', 'success');
        location.reload();
    },

    getUser() {
        const userStr = localStorage.getItem('weatherUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('weatherUsers') || '[]');
    },

    // Theme Toggle
    setupThemeToggle() {
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.id = 'theme-toggle';
        themeToggleBtn.className = 'btn btn-outline-light ms-2';
        themeToggleBtn.innerText = '🌙';
        document.querySelector('.navbar').appendChild(themeToggleBtn);

        let currentTheme = localStorage.getItem('weatherTheme') || 'dark';
        document.body.classList.toggle('light-theme', currentTheme === 'light');
        themeToggleBtn.innerText = currentTheme === 'light' ? '☀️' : '🌙';

        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.classList.toggle('light-theme', currentTheme === 'light');
            themeToggleBtn.innerText = currentTheme === 'light' ? '☀️' : '🌙';
            localStorage.setItem('weatherTheme', currentTheme);
        });
    },

    // Filter System
    setupFilters() {
        const filterBox = document.querySelector('.filter-box');
        filterBox.innerHTML = `
            <h5>Weather Filters</h5>
            <div class="filter-section">
                <div class="filter-title">Temperature Range</div>
                <div class="form-group">
                    <label>Min: <input type="number" id="temp-min" class="form-control" value="0"></label>
                    <label>Max: <input type="number" id="temp-max" class="form-control" value="50"></label>
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-title">Conditions</div>
                <div class="form-check">
                    <input type="checkbox" id="filter-sunny" class="form-check-input" checked>
                    <label class="form-check-label">Sunny</label>
                </div>
                <div class="form-check">
                    <input type="checkbox" id="filter-cloudy" class="form-check-input" checked>
                    <label class="form-check-label">Cloudy</label>
                </div>
                <div class="form-check">
                    <input type="checkbox" id="filter-rainy" class="form-check-input" checked>
                    <label class="form-check-label">Rainy</label>
                </div>
            </div>
            <button id="apply-filters" class="btn btn-primary mt-3">Apply Filters</button>
        `;

        this.setupFilterListeners();
    },

    setupFilterListeners() {
        document.getElementById('apply-filters')?.addEventListener('click', () => {
            const filters = this.getFilters();
            this.saveFilters(filters);
            this.applyFilters(filters);
        });
    },

    getFilters() {
        return {
            temperature: {
                min: Number(document.getElementById('temp-min')?.value || 0),
                max: Number(document.getElementById('temp-max')?.value || 50)
            },
            conditions: {
                sunny: document.getElementById('filter-sunny')?.checked || false,
                cloudy: document.getElementById('filter-cloudy')?.checked || false,
                rainy: document.getElementById('filter-rainy')?.checked || false
            }
        };
    },

    saveFilters(filters) {
        const user = this.getUser();
        if (user) {
            user.filters = filters;
            localStorage.setItem('weatherUser', JSON.stringify(user));
        }
        localStorage.setItem('weatherFilters', JSON.stringify(filters));
    },

    loadUserPreferences() {
        const user = this.getUser();
        const filters = user?.filters || JSON.parse(localStorage.getItem('weatherFilters') || '{}');

        if (filters.temperature) {
            document.getElementById('temp-min').value = filters.temperature.min;
            document.getElementById('temp-max').value = filters.temperature.max;
        }

        if (filters.conditions) {
            document.getElementById('filter-sunny').checked = filters.conditions.sunny;
            document.getElementById('filter-cloudy').checked = filters.conditions.cloudy;
            document.getElementById('filter-rainy').checked = filters.conditions.rainy;
        }

        const currentTheme = localStorage.getItem('weatherTheme') || 'dark';
        document.body.classList.toggle('light-theme', currentTheme === 'light');
    },

    applyFilters(filters) {
        // Apply filters to weather data
        // Implement your filter logic here
        this.showNotification('Filters applied successfully', 'success');
    },

    // Event Listeners for other features
    setupEventListeners() {
        // Search functionality with filters applied
        document.getElementById('search-btn').addEventListener('click', () => {
            const city = document.getElementById('search-city').value;

            if (!city) {
                this.showNotification('Please enter a city name', 'error');
                return;
            }

            fetch(`/weather?city=${city}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        this.showNotification('City not found or API error', 'error');
                        return;
                    }

                    // Apply filters
                    const filters = this.getFilters();
                    const temp = data.current.temp_c;
                    const condition = data.current.condition.text.toLowerCase();

                    const tempInRange = temp >= filters.temperature.min && temp <= filters.temperature.max;
                    const conditionAllowed = (
                        (condition.includes('sun') && filters.conditions.sunny) ||
                        (condition.includes('cloud') && filters.conditions.cloudy) ||
                        (condition.includes('rain') && filters.conditions.rainy)
                    );

                    if (!tempInRange || !conditionAllowed) {
                        this.showNotification('Weather data does not match filters', 'error');
                        return;
                    }

                    this.updateWeatherData(data);
                    this.updateBackgroundVideo(data);
                    this.updateHourlyForecast(data.forecast.forecastday[0].hour);
                });
        });
    },

    // Update weather data on the page
    updateWeatherData(data) {
        document.getElementById('city-name').innerText = data.location.name;
        document.getElementById('temperature').innerText = `${data.current.temp_c}°`;
        document.getElementById('condition-text').innerText = data.current.condition.text;
        document.getElementById('weather-description').innerText = `Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h`;
    },

    // Update background video based on weather conditions
    updateBackgroundVideo(data) {
        const temp = data.current.temp_c;
        let videoSource = '';

        if (temp < 10) {
            videoSource = 'assets/cold.mp4';
        } else if (data.current.condition.text.toLowerCase().includes("partly cloudy")) {
            videoSource = 'assets/cloudy.mp4';
        } else if (data.current.condition.text.toLowerCase().includes("rain")) {
            videoSource = 'assets/rain.mp4';
        } else if (temp >= 30) {
            videoSource = 'assets/hot.mp4';
        } else if (temp >= 20) {
            videoSource = 'assets/warm.mp4';
        } else {
            videoSource = 'assets/default.mp4';
        }

        const videoElement = document.getElementById('background-video');
        const videoSourceElement = document.getElementById('video-source');
        videoSourceElement.src = videoSource;
        videoElement.load();
    },

    // Update hourly forecast with animation
    updateHourlyForecast(hourlyData) {
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
    },

    // Utility Functions
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    showAuthMessage(message, type) {
        const messageElement = document.getElementById('auth-message');
        if (messageElement) {
            messageElement.className = `auth-message text-${type === 'error' ? 'danger' : 'success'}`;
            messageElement.textContent = message;
        }
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    WeatherApp.init();
});
