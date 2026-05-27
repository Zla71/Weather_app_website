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
        // 1. Вземи координати от OpenCage
        const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5'; // <-- постави тук своя ключ
        const geoResp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${openCageApiKey}&language=bg&limit=1`);
        const geoData = await geoResp.json();
        if (!geoData.results || !geoData.results.length) {
            resultDiv.textContent = 'Градът не е намерен.';
            return;
        }
        const lat = geoData.results[0].geometry.lat;
        const lon = geoData.results[0].geometry.lng;
        const displayName = geoData.results[0].formatted;
        // Вземи държавата (ако има)
        const country = geoData.results[0].components.country || '';
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
        // 3. Показване на информация за града и бутоните за избор на прогноза
        let cityInfoHtml = `<div class="city-info-panel" style="margin-bottom:18px;">
            <strong style="font-size:1.5em;">${displayName.split(',')[0]}</strong> <span style="color:#2471a3;font-size:1em;">(${country})</span><br>`;
        if (cityImageUrl) {
            cityInfoHtml += `<div style="margin:10px 0;"><img src="${cityImageUrl}" alt="${city}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 8px #b3d8f733;max-height:260px;object-fit:cover;"></div>`;
        }
        if (cityDescription) {
            cityInfoHtml += `<div style=\"font-size:0.98em;color:#444;margin-bottom:8px;\">${cityDescription}</div>`;
        }
        // Времето в момента
        let currentWeatherHtml = '';
        try {
            const currentResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto&lang=bg`);
            const currentData = await currentResp.json();
            let humidity = '-';
            if (currentData.hourly && currentData.hourly.relative_humidity_2m && currentData.current_weather) {
                // Намираме индекса на текущия час
                const now = new Date(currentData.current_weather.time);
                const idx = currentData.hourly.time.findIndex(t => t === currentData.current_weather.time);
                if (idx !== -1) {
                    humidity = currentData.hourly.relative_humidity_2m[idx];
                }
            } else if (currentData.current_weather && currentData.current_weather.relativehumidity) {
                humidity = currentData.current_weather.relativehumidity;
            }
            if (currentData.current_weather) {
                const c = currentData.current_weather;
                const icon = getMeteoIcon(c.weathercode);
                currentWeatherHtml = `<div class=\"current-weather\" style=\"margin:12px 0 8px 0;font-size:1.2em;\"><b>Сега:</b> <span style=\"font-size:1.5em;\">${icon} ${c.temperature}°C</span>, Вятър: ${c.windspeed} км/ч, Влажност: ${humidity}%</div>`;
            }
        } catch(e) {}
        cityInfoHtml += currentWeatherHtml;
        cityInfoHtml += `<div style="margin:18px 0 10px 0;">
            <button id="btnDaily" style="margin-right:8px;">7-дневна прогноза</button>
            <button id="btnHourly">Почасова прогноза</button>
        </div>`;
        cityInfoHtml += '</div>';
        // Карта с маркер за града
        cityInfoHtml += `<div style="margin:10px 0 16px 0;display:flex;justify-content:center;">
            <iframe width="320" height="180" style="border-radius:10px;border:1.5px solid #b3d8f7;box-shadow:0 2px 8px #b3d8f733;" loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;
        // Контейнер за прогнозата
        cityInfoHtml += `<div id="forecastContainer"></div>`;
        resultDiv.innerHTML = cityInfoHtml;

        // --- Нови функции за показване на режими ---
        function showCityMain() {
            document.querySelector('.city-info-panel').style.display = '';
            document.getElementById('forecastContainer').innerHTML = '';
            document.querySelector('.city-info-panel').querySelector('#btnDaily').style.display = '';
            document.querySelector('.city-info-panel').querySelector('#btnHourly').style.display = '';
        }
        function showBackButton(onClick) {
            let fc = document.getElementById('forecastContainer');
            let backBtn = document.createElement('button');
            backBtn.textContent = 'Назад';
            backBtn.style = 'margin:18px 0 0 0;display:block;';
            backBtn.onclick = onClick;
            fc.appendChild(backBtn);
        }
        // Функция за визуализация на 7-дневна прогноза
        function renderDailyForecast() {
            document.querySelector('.city-info-panel').style.display = 'none';
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
            showBackButton(() => {
                showCityMain();
            });
        }
        // Функция за визуализация на почасова прогноза (48ч от сега)
        async function renderHourlyForecast() {
            document.querySelector('.city-info-panel').style.display = 'none';
            let hourlyHtml = '<b>Почасова прогноза (48ч):</b><br>';
            let lastDate = '';
            hourlyHtml += '<div class="hourly-grid">';
            const now = new Date();
            const startISO = now.toISOString().slice(0, 13) + ':00';
            const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            const endISO = end.toISOString().slice(0, 13) + ':00';
            try {
                const hourlyResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto&start_date=${startISO.slice(0,10)}&end_date=${endISO.slice(0,10)}&lang=bg`);
                const hourlyData = await hourlyResp.json();
                if (!hourlyData.hourly) {
                    hourlyHtml += 'Няма почасова прогноза.';
                } else {
                    const nowTime = now.getTime();
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
                        const dateStr = hour.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' });
                        if (dateStr !== lastDate) {
                            hourlyHtml += `<div style=\"grid-column: 1 / -1; flex-basis:100%;font-weight:bold;font-size:1.1em;margin:10px 0 0 0;\">${dateStr}</div>`;
                            lastDate = dateStr;
                        }
                        hourlyHtml += `<div class=\"forecast-hour animate-fade-in\">
                            <div style=\"font-size:1.2em;font-weight:bold;\">${hour.getHours()}:00</div>
                            <span style=\"font-size:2.2em;\">${iconUrl}</span>
                            <div style=\"font-size:1.5em;font-weight:bold;margin:4px 0;\">${temp}°C</div>
                            <div style=\"font-size:0.98em;color:#2471a3;\">Вятър: ${windSpeed} км/ч ${windDirectionText(windDir)}</div>
                            <div style=\"font-size:0.98em;\">Влажност: ${humidity}%</div>
                            <div style=\"font-size:0.98em;\">Валежи: ${precipitation} mm</div>
                        </div>`;
                    }
                }
                hourlyHtml += '</div>';
                document.getElementById('forecastContainer').innerHTML = hourlyHtml;
                showBackButton(() => {
                    showCityMain();
                });
            } catch (e) {
                document.getElementById('forecastContainer').innerHTML = 'Грешка при зареждане на почасова прогноза.';
                showBackButton(() => {
                    showCityMain();
                });
            }
        }
        // Първоначално показваме само инфо за града и бутоните
        showCityMain();
        document.getElementById('btnDaily').onclick = renderDailyForecast;
        document.getElementById('btnHourly').onclick = renderHourlyForecast;
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

// Глобална функция за текстово описание на посоката на вятъра
function windDirectionText(deg) {
    if (deg === undefined || deg === null || deg === '-' || isNaN(deg)) return '-';
    const dirs = ['С', 'ССИ', 'СИ', 'ИСИ', 'И', 'ИЮИ', 'ЮИ', 'ЮЮИ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];
    return dirs[Math.round(deg / 22.5) % 16];
}

// --- НАЧАЛНА СТРАНИЦА И НАВИГАЦИЯ ---

// Списък с най-големите европейски столици
const capitals = [
    { name: 'Лондон', en: 'London', country: 'UK' },
    { name: 'Париж', en: 'Paris', country: 'France' },
    { name: 'Берлин', en: 'Berlin', country: 'Germany' },
    { name: 'Мадрид', en: 'Madrid', country: 'Spain' },
    { name: 'Рим', en: 'Rome', country: 'Italy' },
    { name: 'Виена', en: 'Vienna', country: 'Austria' },
    { name: 'Будапеща', en: 'Budapest', country: 'Hungary' },
    { name: 'Атина', en: 'Athens', country: 'Greece' },
    { name: 'Букурещ', en: 'Bucharest', country: 'Romania' },
    { name: 'София', en: 'Sofia', country: 'Bulgaria' }
];

async function showCapitalsWeather() {
    const grid = document.getElementById('capitalsWeather');
    grid.innerHTML = 'Зареждане...';
    const promises = capitals.map(async (cap) => {
        // Вземи координати
        const geoResp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cap.en)}`);
        const geoData = await geoResp.json();
        if (!geoData.length) return '';
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        // Вземи текуща прогноза
        const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&lang=bg`);
        const meteoData = await meteoResp.json();
        if (!meteoData.current_weather) return '';
        const temp = Math.round(meteoData.current_weather.temperature);
        const code = meteoData.current_weather.weathercode;
        const icon = getMeteoIcon(code);
        const windSpeed = meteoData.current_weather.windspeed;
        const windDir = meteoData.current_weather.winddirection;
        const windDirText = windDirectionText(windDir);
        // Добавяме data-атрибут с името на града (на български)
        return `<div class="capital-card" data-city="${cap.name}">
            <div class="city">${cap.name}</div>
            <div class="temp">${icon} ${temp}°C</div>
            <div class="desc">${windSpeed} км/ч, ${windDir}° (${windDirText})</div>
        </div>`;
    });
    const results = await Promise.all(promises);
    grid.innerHTML = results.join('');
    // Добавяме event listener-и за избор на град
    Array.from(grid.querySelectorAll('.capital-card')).forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', async function() {
            const city = card.getAttribute('data-city');
            document.getElementById('cityInput').value = city;
            showSearch();
            await getWeather();
        });
    });
}

// Показване на начална страница и секция за търсене
function showHome() {
    document.getElementById('homeSection').style.display = '';
    document.getElementById('searchSection').style.display = 'none';
}
function showSearch() {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('searchSection').style.display = '';
    setTimeout(() => { document.getElementById('cityInput').focus(); }, 200);
}

// Навигация
window.addEventListener('DOMContentLoaded', () => {
    showHome();
    showCapitalsWeather();
    document.getElementById('logo').onclick = (e) => {
        e.preventDefault();
        showHome();
    };
    // Търсачката в хедъра работи винаги
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', async () => {
        showSearch();
        await getWeather();
    });
    cityInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            showSearch();
            await getWeather();
        }
    });
});

// При търсене, винаги показвай searchSection и скривай homeSection