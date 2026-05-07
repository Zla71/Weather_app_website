// Open-Meteo не изисква API ключ, но трябва да вземем координати на града чрез Nominatim (OpenStreetMap)
async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    if (!city) {
        resultDiv.textContent = 'Моля, въведи име на град.';
        return;
    }
    resultDiv.textContent = 'Зареждане...';
    try {
        // 1. Вземи координати от Nominatim
        const geoResp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const geoData = await geoResp.json();
        if (!geoData.length) {
            resultDiv.textContent = 'Градът не е намерен.';
            return;
        }
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const displayName = geoData[0].display_name;
        // Вземи държавата (последната част от display_name)
        const country = displayName.split(',').pop().trim();
        // Вземи кратко описание от Wikipedia API
        let cityDescription = '';
        try {
            const wikiResp = await fetch(`https://bg.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`);
            if (wikiResp.ok) {
                const wikiData = await wikiResp.json();
                cityDescription = wikiData.extract ? wikiData.extract : '';
            }
        } catch (e) { /* игнорирай грешки */ }
        // Вземи снимка на града от Wikipedia (ако има)
        let cityImageUrl = '';
        try {
            const wikiImgResp = await fetch(`https://bg.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(city)}`);
            if (wikiImgResp.ok) {
                const wikiImgData = await wikiImgResp.json();
                if (wikiImgData.items && wikiImgData.items.length > 0) {
                    // Търси първото изображение с type 'image'
                    const imgItem = wikiImgData.items.find(item => item.type === 'image' && item.showInGallery !== false);
                    if (imgItem && imgItem.srcset && imgItem.srcset.length > 0) {
                        // Вземи най-голямото изображение
                        cityImageUrl = imgItem.srcset[imgItem.srcset.length - 1].src;
                    } else if (imgItem && imgItem.src) {
                        cityImageUrl = imgItem.src;
                    }
                }
            }
        } catch (e) { /* игнорирай грешки */ }
        // 2. Вземи прогноза от Open-Meteo
        const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7&lang=bg`);
        const meteoData = await meteoResp.json();
        if (!meteoData.daily) {
            resultDiv.textContent = 'Няма прогноза за този град.';
            return;
        }
        // 3. Показване на бутоните за избор на прогноза
        let html = `<strong>${displayName.split(',')[0]}</strong> <span style="color:#2471a3;font-size:1em;">(${country})</span><br>`;
        if (cityImageUrl) {
            html += `<div style="margin:10px 0;"><img src="${cityImageUrl}" alt="${city}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 8px #b3d8f733;max-height:260px;object-fit:cover;"></div>`;
        }
        if (cityDescription) {
            html += `<div style=\"font-size:0.98em;color:#444;margin-bottom:8px;\">${cityDescription}</div>`;
        }
        // Карта с маркер за града
        html += `<div style="margin:10px 0 16px 0;display:flex;justify-content:center;">
            <iframe width="320" height="180" style="border-radius:10px;border:1.5px solid #b3d8f7;box-shadow:0 2px 8px #b3d8f733;" loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;
        // Бутоните за избор на прогноза
        html += `<div style="margin-bottom:12px;">
            <button id="btnDaily" style="margin-right:8px;">7-дневна прогноза</button>
            <button id="btnHourly">Почасова прогноза</button>
        </div>`;
        // Контейнер за прогнозата
        html += `<div id="forecastContainer"></div>`;
        resultDiv.innerHTML = html;

        // Функция за визуализация на 7-дневна прогноза
        function renderDailyForecast() {
            let dailyHtml = '<b>7-дневна прогноза:</b><br>';
            dailyHtml += '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
            for (let i = 0; i < meteoData.daily.time.length; i++) {
                const date = new Date(meteoData.daily.time[i]);
                const code = meteoData.daily.weathercode[i];
                const iconUrl = getMeteoIcon(code);
                dailyHtml += `<div class="forecast-day animate-fade-in">
                    <b>${date.toLocaleDateString('bg-BG', { weekday: 'short', day: 'numeric', month: 'short' })}</b><br>
                    <span style="font-size: 2em;">${iconUrl}</span>
                    <br>Макс: <b>${meteoData.daily.temperature_2m_max[i]}°C</b><br>
                    Мин: ${meteoData.daily.temperature_2m_min[i]}°C<br>
                    Валежи: ${meteoData.daily.precipitation_sum[i]} mm<br>
                </div>`;
            }
            dailyHtml += '</div>';
            document.getElementById('forecastContainer').innerHTML = dailyHtml;
        }

        // Функция за визуализация на почасова прогноза (48ч от сега)
        async function renderHourlyForecast() {
            document.getElementById('forecastContainer').innerHTML = 'Зареждане на почасова прогноза...';
            // Вземи текущия час в ISO формат
            const now = new Date();
            const startISO = now.toISOString().slice(0, 13) + ':00'; // YYYY-MM-DDTHH:00
            const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            const endISO = end.toISOString().slice(0, 13) + ':00';
            // Вземи почасова прогноза от Open-Meteo за 48 часа напред, с допълнителни параметри
            try {
                const hourlyResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto&start_date=${startISO.slice(0,10)}&end_date=${endISO.slice(0,10)}&lang=bg`);
                const hourlyData = await hourlyResp.json();
                if (!hourlyData.hourly) {
                    document.getElementById('forecastContainer').innerHTML = 'Няма почасова прогноза.';
                    return;
                }
                // Филтрирай само следващите 48 часа от текущия момент
                const nowTime = now.getTime();
                let hourlyHtml = '<b>Почасова прогноза (48ч):</b><br>';
                let lastDate = '';
                hourlyHtml += '<div style="display: flex; flex-wrap: wrap; gap: 18px; justify-content: flex-start;">';
                for (let i = 0; i < hourlyData.hourly.time.length; i++) {
                    const hour = new Date(hourlyData.hourly.time[i]);
                    if (hour.getTime() < nowTime || hour.getTime() > nowTime + 48*60*60*1000) continue;
                    const code = hourlyData.hourly.weathercode[i];
                    const iconUrl = getMeteoIcon(code);
                    const temp = hourlyData.hourly.temperature_2m[i];
                    const windSpeed = hourlyData.hourly.wind_speed_10m ? hourlyData.hourly.wind_speed_10m[i] : '-';
                    const windDir = hourlyData.hourly.wind_direction_10m ? hourlyData.hourly.wind_direction_10m[i] : '-';
                    const humidity = hourlyData.hourly.relative_humidity_2m ? hourlyData.hourly.relative_humidity_2m[i] : '-';
                    const precipitation = hourlyData.hourly.precipitation ? hourlyData.hourly.precipitation[i] : '-';
                    // Покажи датата при смяна на денонощието
                    const dateStr = hour.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' });
                    if (dateStr !== lastDate) {
                        hourlyHtml += `<div style=\"flex-basis:100%;font-weight:bold;font-size:1.1em;margin:10px 0 0 0;\">${dateStr}</div>`;
                        lastDate = dateStr;
                    }
                    // Преобразувай посоката на вятъра в текст
                    function windDirectionText(deg) {
                        if (deg === '-') return '-';
                        const dirs = ['С', 'ССИ', 'СИ', 'ИСИ', 'И', 'ИЮИ', 'ЮИ', 'ЮЮИ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];
                        return dirs[Math.round(deg / 22.5) % 16];
                    }
                    hourlyHtml += `<div class=\"forecast-hour animate-fade-in\" style=\"min-width:170px;max-width:210px;background:#f7fbff;border-radius:14px;box-shadow:0 2px 8px #b3d8f733;padding:14px 10px 10px 10px;margin-bottom:8px;display:flex;flex-direction:column;align-items:center;\">
                        <div style=\"font-size:1.2em;font-weight:bold;\">${hour.getHours()}:00</div>
                        <span style=\"font-size:2.2em;\">${iconUrl}</span>
                        <div style=\"font-size:1.5em;font-weight:bold;margin:4px 0;\">${temp}°C</div>
                        <div style=\"font-size:0.98em;color:#2471a3;\">Вятър: ${windSpeed} км/ч ${windDirectionText(windDir)}</div>
                        <div style=\"font-size:0.98em;\">Влажност: ${humidity}%</div>
                        <div style=\"font-size:0.98em;\">Валежи: ${precipitation} mm</div>
                    </div>`;
                }
                hourlyHtml += '</div>';
                document.getElementById('forecastContainer').innerHTML = hourlyHtml;
            } catch (e) {
                document.getElementById('forecastContainer').innerHTML = 'Грешка при зареждане на почасова прогноза.';
            }
        }

        // Слушатели за бутоните
        document.getElementById('btnDaily').addEventListener('click', renderDailyForecast);
        document.getElementById('btnHourly').addEventListener('click', renderHourlyForecast);
        // Показвай 7-дневната прогноза по подразбиране
        renderDailyForecast();
    } catch (err) {
        resultDiv.textContent = 'Грешка при зареждане на прогнозата.';
    }
}

// Open-Meteo weather code to icon
function getMeteoIcon(code) {
    // Emoji mapping за основните Open-Meteo weather codes
    const emojiMap = {
        0: '☀️', // ясно
        1: '🌤️', // предимно ясно
        2: '⛅', // разкъсана облачност
        3: '☁️', // облачно
        45: '🌫️', // мъгла
        48: '🌫️',
        51: '🌦️', // слаб дъжд
        53: '🌦️',
        55: '🌦️',
        56: '🌧️', // ледени капки
        57: '🌧️',
        61: '🌧️', // дъжд
        63: '🌧️',
        65: '🌧️',
        66: '🌧️',
        67: '🌧️',
        71: '🌨️', // сняг
        73: '🌨️',
        75: '🌨️',
        77: '🌨️',
        80: '🌦️', // превалявания
        81: '🌦️',
        82: '🌦️',
        85: '❄️', // сняг
        86: '❄️',
        95: '⛈️', // гръмотевици
        96: '⛈️',
        99: '⛈️',
    };
    return emojiMap[code] || '❔';
}

document.getElementById('searchBtn').addEventListener('click', getWeather);
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});
