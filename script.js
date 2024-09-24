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
