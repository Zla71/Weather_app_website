// Използвай безплатен API ключ от https://openweathermap.org/api
const apiKey = '006c7ba08cf253e4532a06366e64643c';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('searchBtn').addEventListener('click', getWeather);

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    if (!city) {
        resultDiv.textContent = 'Моля, въведи име на град.';
        return;
    }
    resultDiv.textContent = 'Зареждане...';
    fetch(`${apiUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=bg`)
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let msg = 'Градът не е намерен.';
                if (errorData && errorData.message) {
                    msg += `\nAPI съобщение: ${errorData.message}`;
                }
                throw new Error(msg);
            }
            return response.json();
        })
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const cityName = data.name;
            const country = data.sys.country;
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&lang=bg&appid=${apiKey}`)
                .then(async resp => {
                    if (!resp.ok) {
                        const errorData = await resp.json().catch(() => ({}));
                        let msg = 'Грешка при взимане на прогноза.';
                        if (errorData && errorData.message) {
                            msg += `\nAPI съобщение: ${errorData.message}`;
                        }
                        throw new Error(msg);
                    }
                    return resp.json();
                })
                .then(forecast => {
                    let html = `<strong>${cityName}, ${country}</strong><br>`;
                    html += `<b>Текущо:</b> ${data.weather[0].description}, ${data.main.temp}°C<br><br>`;
                    html += '<b>Прогноза за следващите дни:</b><br>';
                    html += '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
                    forecast.daily.slice(0, 7).forEach(day => {
                        const date = new Date(day.dt * 1000);
                        html += `<div style="background:#f0f8ff;border-radius:8px;padding:10px 14px;min-width:120px;">
                            <b>${date.toLocaleDateString('bg-BG', { weekday: 'short', day: 'numeric', month: 'short' })}</b><br>
                            ${day.weather[0].description}<br>
                            Дневна: ${day.temp.day}°C<br>
                            Нощна: ${day.temp.night}°C<br>
                            Влажност: ${day.humidity}%<br>
                        </div>`;
                    });
                    html += '</div>';
                    resultDiv.innerHTML = html;
                });
        })
        .catch((err) => {
            resultDiv.textContent = err.message || 'Градът не е намерен или има проблем с връзката.';
        });
}
