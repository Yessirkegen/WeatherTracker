document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            document.getElementById('weather-city').innerText = data.location.name;
            document.getElementById('weather-condition').innerText = data.current.condition.text;
            document.getElementById('weather-temp').innerText = `Температура: ${data.current.temp_c} °C`;

            // Меняем фон в зависимости от погоды
            const condition = data.current.condition.text.toLowerCase();
            if (condition.includes('sunny')) {
                document.body.className = 'sunny';
            } else if (condition.includes('cloudy')) {
                document.body.className = 'cloudy';
            } else if (condition.includes('rain')) {
                document.body.className = 'rainy';
            } else {
                document.body.className = 'clear';
            }

            document.getElementById('weather-result').classList.remove('d-none');
        })
        .catch(err => console.error(err));
});
