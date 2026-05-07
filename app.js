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
        // 2. Вземи прогноза от Open-Meteo
        const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7&lang=bg`);
        const meteoData = await meteoResp.json();
        if (!meteoData.daily) {
            resultDiv.textContent = 'Няма прогноза за този град.';
            return;
        }
        // 3. Показване на прогнозата
        let html = `<strong>${displayName.split(',')[0]}</strong> <span style="color:#2471a3;font-size:1em;">(${country})</span><br>`;
        if (cityDescription) {
            html += `<div style="font-size:0.98em;color:#444;margin-bottom:8px;">${cityDescription}</div>`;
        }
        // Карта с маркер за града (приближен изглед)
        html += `<div style="margin:10px 0 16px 0;display:flex;justify-content:center;">
            <iframe width="320" height="180" style="border-radius:10px;border:1.5px solid #b3d8f7;box-shadow:0 2px 8px #b3d8f733;" loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;
        html += '<b>7-дневна прогноза:</b><br>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
        for (let i = 0; i < meteoData.daily.time.length; i++) {
            const date = new Date(meteoData.daily.time[i]);
            const code = meteoData.daily.weathercode[i];
            const iconUrl = getMeteoIcon(code);
            html += `<div class="forecast-day animate-fade-in">
                <b>${date.toLocaleDateString('bg-BG', { weekday: 'short', day: 'numeric', month: 'short' })}</b><br>
                <span style="font-size: 2em;">${iconUrl}</span>
                <br>Макс: <b>${meteoData.daily.temperature_2m_max[i]}°C</b><br>
                Мин: ${meteoData.daily.temperature_2m_min[i]}°C<br>
                Валежи: ${meteoData.daily.precipitation_sum[i]} mm<br>
            </div>`;
        }
        html += '</div>';
        resultDiv.innerHTML = html;
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
