document.addEventListener("DOMContentLoaded", function() {
    const pogoda = document.getElementById("pogoda");
    const miasto = document.getElementById("city");
    const weatherResult = document.getElementById("weatherResult"); // Get the element for current weather
    const forecastResult = document.getElementById("forecastResult"); // Get the element for 5-day forecast

    if (pogoda && miasto && weatherResult && forecastResult) {
        pogoda.addEventListener("click", async function() {
            const city = miasto.value;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7c51b1980eba0bffc55e1e55d0888c5c&units=metric`);
                const data = await response.json();
                weatherResult.innerHTML = `
                    <div id="oneDay">
                        <h3>Pogoda w ${data.name}</h3>
                        <p>Temperatura: ${data.main.temp.toFixed(2)}°C</p>
                        <p>Pogoda: ${data.weather[0].description}</p>
                    </div>
                `;
            } catch (error) {
                console.error('Error:', error);
                weatherResult.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
            }

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7c51b1980eba0bffc55e1e55d0888c5c&units=metric`);
                const forecastData = await response.json();
                let forecastHTML = '<h3>5-Day Forecast</h3>';
                forecastData.list.forEach((forecast, index) => {
                    if (index % 8 === 0) {
                        forecastHTML += `
                            <div id="fiveDays">
                                <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
                                <p>Temperatura: ${forecast.main.temp.toFixed(2)}°C</p>
                                <p>Pogoda: ${forecast.weather[0].description}</p>
                            </div>
                        `;
                    }
                });
                forecastResult.innerHTML = forecastHTML;
            } catch (error) {
                console.error('Error:', error);
                forecastResult.innerHTML = `<p>Error fetching 5-day forecast data. Please try again.</p>`;
            }
        });
    }
});