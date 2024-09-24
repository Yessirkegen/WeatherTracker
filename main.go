package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type WeatherCondition struct {
	Text string `json:"text"`
	Icon string `json:"icon"`
	Code int    `json:"code"`
}

type CurrentWeather struct {
	TempC     float64          `json:"temp_c"`
	Condition WeatherCondition `json:"condition"`
}

type HourlyForecast struct {
	Time      string           `json:"time"`
	TempC     float64          `json:"temp_c"`
	Condition WeatherCondition `json:"condition"`
}

type ForecastDay struct {
	Hour []HourlyForecast `json:"hour"`
}

type Forecast struct {
	Forecastday []ForecastDay `json:"forecastday"`
}

type Location struct {
	Name string `json:"name"`
}

type WeatherResponse struct {
	Location Location       `json:"location"`
	Current  CurrentWeather `json:"current"`
	Forecast Forecast       `json:"forecast"`
}

const apiKey = "687fc21172mshaad4c59aecf4c2cp159407jsn211cf0f1cebc"

func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))

	http.HandleFunc("/weather", func(w http.ResponseWriter, r *http.Request) {
		city := r.URL.Query().Get("city")
		if city == "" {
			http.Error(w, "Город не указан", http.StatusBadRequest)
			return
		}

		// URL для почасового прогноза
		url := fmt.Sprintf("https://weatherapi-com.p.rapidapi.com/forecast.json?q=%s&days=1&hour=24", city)
		req, _ := http.NewRequest("GET", url, nil)
		req.Header.Add("x-rapidapi-key", apiKey)
		req.Header.Add("x-rapidapi-host", "weatherapi-com.p.rapidapi.com")

		client := &http.Client{}
		res, err := client.Do(req)
		if err != nil {
			http.Error(w, "Ошибка получения данных", http.StatusInternalServerError)
			return
		}
		defer res.Body.Close()

		body, _ := ioutil.ReadAll(res.Body)
		var weatherData WeatherResponse
		if err := json.Unmarshal(body, &weatherData); err != nil {
			http.Error(w, "Ошибка декодирования JSON", http.StatusInternalServerError)
			return
		}

		// Отправляем JSON-ответ на фронтенд
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(weatherData)
	})

	fmt.Println("Сервер запущен на порту 8080")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		fmt.Println("Ошибка при запуске сервера:", err)
	}
}
