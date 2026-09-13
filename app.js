// --- Езикови ресурси ---
const LANGS = {
    bg: {
        title: 'Прогноза за времето',
        searchPlaceholder: 'Въведи град',
        searchBtn: 'Търси',
        subtitle: 'Времето в най-големите европейски столици',
        now: 'Сега',
        wind: 'Вятър',
        windUnit: 'км/ч',
        humidity: 'Влажност',
        back: 'Назад',
        daily: '7-дневна прогноза',
        hourly: 'Почасова прогноза',
        loading: 'Зареждане...',
        notFound: 'Градът не е намерен.',
        noForecast: 'Няма прогноза за този град.',
        noHourly: 'Няма почасова прогноза.',
        error: 'Грешка при зареждане на прогнозата.',
        min: 'Мин',
        max: 'Макс',
        precip: 'Валежи',
        rateLimitMsg: 'Тъй като в момента не можем да ви дадем информация за най-големите градове в Европа, вижте прогнозата в града, в който сте:',
        locationDenied: 'Не успяхме да определим местоположението ви. Моля, потърсете град ръчно.',
        windDirs: ['С', 'ССИ', 'СИ', 'ИСИ', 'И', 'ИЮИ', 'ЮИ', 'ЮЮИ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С']
    },
    en: {
        title: 'Weather Forecast',
        searchPlaceholder: 'Enter city',
        searchBtn: 'Search',
        subtitle: 'Weather in the largest European capitals',
        now: 'Now',
        wind: 'Wind',
        windUnit: 'km/h',
        humidity: 'Humidity',
        back: 'Back',
        daily: '7-day forecast',
        hourly: 'Hourly forecast',
        loading: 'Loading...',
        notFound: 'City not found.',
        noForecast: 'No forecast for this city.',
        noHourly: 'No hourly forecast.',
        error: 'Error loading forecast.',
        min: 'Min',
        max: 'Max',
        precip: 'Precip.',
        rateLimitMsg: 'Since we currently cannot show you the weather for the largest European capitals, here is the forecast for your location:',
        locationDenied: 'We could not determine your location. Please search for a city manually.',
        windDirs: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']
    },
    es: {
        title: 'Pronóstico del tiempo',
        searchPlaceholder: 'Introduce ciudad',
        searchBtn: 'Buscar',
        subtitle: 'El tiempo en las mayores capitales europeas',
        now: 'Ahora',
        wind: 'Viento',
        windUnit: 'km/h',
        humidity: 'Humedad',
        back: 'Atrás',
        daily: 'Pronóstico de 7 días',
        hourly: 'Pronóstico por horas',
        loading: 'Cargando...',
        notFound: 'Ciudad no encontrada.',
        noForecast: 'No hay pronóstico para esta ciudad.',
        noHourly: 'No hay pronóstico por horas.',
        error: 'Error al cargar el pronóstico.',
        min: 'Mín',
        max: 'Máx',
        precip: 'Precip.',
        rateLimitMsg: 'Como en este momento no podemos mostrarte el tiempo de las mayores capitales europeas, aquí tienes el pronóstico de tu ubicación:',
        locationDenied: 'No pudimos determinar tu ubicación. Por favor, busca una ciudad manualmente.',
        windDirs: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO', 'N']
    }
};
let currentLang = 'bg';
let lastSearchedCity = '';
let currentView = 'main'; // 'main' | 'daily' | 'hourly'

function setLang(lang) {
    currentLang = lang;
    document.title = LANGS[lang].title;
    document.querySelector('.logo').textContent = LANGS[lang].title;
    document.getElementById('cityInput').placeholder = LANGS[lang].searchPlaceholder;
    document.getElementById('searchBtn').textContent = LANGS[lang].searchBtn;
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = LANGS[lang].subtitle;
    // Превеждаме бутони, ако сме на страница на град
    if (document.getElementById('btnDaily')) document.getElementById('btnDaily').textContent = LANGS[lang].daily;
    if (document.getElementById('btnHourly')) document.getElementById('btnHourly').textContent = LANGS[lang].hourly;
    translateCurrentSection();
}

function windDirectionText(deg) {
    if (deg === undefined || deg === null || deg === '-' || isNaN(deg)) return '-';
    const dirs = LANGS[currentLang].windDirs;
    return dirs[Math.round(deg / 22.5) % 16];
}

// --- Обработка на езиковите бутони ---
document.addEventListener('DOMContentLoaded', () => {
    ['langBg','langEn','langEs'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = async () => {
                setLang(id === 'langBg' ? 'bg' : id === 'langEn' ? 'en' : 'es');
                // Ако вече има избран град, презареждаме цялата информация на новия език,
                // запазвайки текущия изглед (основна/7-дневна/почасова)
                if (lastSearchedCity) {
                    const viewToRestore = currentView;
                    await getWeather(true);
                    if (viewToRestore === 'daily' && typeof window.__renderDailyForecast === 'function') {
                        window.__renderDailyForecast();
                    } else if (viewToRestore === 'hourly' && typeof window.__renderHourlyForecast === 'function') {
                        window.__renderHourlyForecast();
                    }
                } else {
                    // Ако сме на началната страница, презареждаме и нея, за да
                    // се преведат надписите на столиците/съобщението за
                    // резервния режим по местоположение.
                    await showCapitalsWeather();
                }
            };
        }
    });
});

// Помощна функция (оставена за съвместимост, вече не се използва за парсене)
function translateCurrentSection() {}

// --- Модифициран getWeather ---
async function getWeather(isRelang) {
    const city = isRelang ? lastSearchedCity : document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    if (!city) {
        resultDiv.textContent = LANGS[currentLang].searchPlaceholder;
        return;
    }
    lastSearchedCity = city;
    if (!isRelang) currentView = 'main';
    resultDiv.textContent = LANGS[currentLang].loading;
    try {
        // 1. Вземи координати от OpenCage
        const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5';
        // Търсим на съответния език, за да получим по-точни резултати за
        // въведеното от потребителя име (поддържа кирилица и латиница).
        const geoLang = currentLang === 'bg' ? 'bg' : (currentLang === 'es' ? 'es' : 'en');
        const geoResp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${openCageApiKey}&language=${geoLang}&limit=1`);
        const geoData = await geoResp.json();
        if (!geoData.results || !geoData.results.length) {
            resultDiv.textContent = LANGS[currentLang].notFound;
            return;
        }
        const lat = geoData.results[0].geometry.lat;
        const lon = geoData.results[0].geometry.lng;
        let displayName = geoData.results[0].formatted;
        let country = geoData.results[0].components.country || '';
        const wikiLang = currentLang;
        // За точното заглавие на статията в Wikipedia на избрания език (напр.
        // "London" -> "Londres" на испански) най-надеждният източник е
        // Wikidata: всеки град има уникален Wikidata ID (връща се от OpenCage
        // в annotations.wikidata) и запис "sitelinks" с точното заглавие за
        // всяка езикова версия на Wikipedia. Транслитерация на компонентите
        // от геокодирането (напр. components.city) не е достатъчно надеждна,
        // защото понякога връща различно/неофициално име (напр. "Gran Londres"
        // вместо "Londres").
        let cityNameForWiki = city;
        const wikidataId = geoData.results[0].annotations && geoData.results[0].annotations.wikidata;
        let gotNameFromWikidata = false;
        if (wikidataId) {
            try {
                const wdResp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
                if (wdResp.ok) {
                    const wdData = await wdResp.json();
                    const entity = wdData.entities && wdData.entities[wikidataId];
                    const siteKey = `${wikiLang}wiki`;
                    const sitelinkTitle = entity && entity.sitelinks && entity.sitelinks[siteKey] && entity.sitelinks[siteKey].title;
                    if (sitelinkTitle) {
                        cityNameForWiki = sitelinkTitle;
                        displayName = sitelinkTitle;
                        gotNameFromWikidata = true;
                    }
                }
            } catch (e) { /* при грешка ще ползваме резервния метод по-долу */ }
        }
        // Резервен метод (ако няма Wikidata ID или заявката се провали):
        // обратно геокодиране на избрания език, за да вземем локализирано
        // име на града и държавата.
        try {
            const reverseGeoResp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}&language=${wikiLang}&limit=1`);
            const reverseGeoData = await reverseGeoResp.json();
            if (reverseGeoData.results && reverseGeoData.results.length) {
                const comp = reverseGeoData.results[0].components;
                if (!gotNameFromWikidata) {
                    cityNameForWiki = comp.city || comp.town || comp.village || comp.municipality
                        || reverseGeoData.results[0].formatted.split(',')[0];
                    displayName = cityNameForWiki;
                }
                // Държавата винаги идва от обратното геокодиране на избрания език
                country = comp.country || country;
            }
        } catch (e) { /* при грешка използваме оригиналните стойности */ }
        // Вземи кратко описание от Wikipedia API
        let cityDescription = '';
        try {
            const wikiResp = await fetch(`https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityNameForWiki)}`);
            if (wikiResp.ok) {
                const wikiData = await wikiResp.json();
                cityDescription = wikiData.extract ? wikiData.extract : '';
            }
        } catch (e) { /* игнорирай грешки */ }
        // Вземи снимка на града от Wikipedia (ако има)
        let cityImageUrl = '';
        try {
            const wikiImgResp = await fetch(`https://${wikiLang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(cityNameForWiki)}`);
            if (wikiImgResp.ok) {
                const wikiImgData = await wikiImgResp.json();
                if (wikiImgData.items && wikiImgData.items.length > 0) {
                    const imgItem = wikiImgData.items.find(item => item.type === 'image' && item.showInGallery !== false);
                    if (imgItem && imgItem.srcset && imgItem.srcset.length > 0) {
                        cityImageUrl = imgItem.srcset[imgItem.srcset.length - 1].src;
                    } else if (imgItem && imgItem.src) {
                        cityImageUrl = imgItem.src;
                    }
                }
            }
        } catch (e) { /* игнорирай грешки */ }
        // 2. Вземи прогноза от Open-Meteo
        const meteoLang = currentLang === 'bg' ? 'bg' : (currentLang === 'es' ? 'es' : 'en');
        const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7&lang=${meteoLang}`);
        const meteoData = await meteoResp.json();
        if (!meteoData.daily) {
            resultDiv.textContent = LANGS[currentLang].noForecast;
            return;
        }
        // 3. Показване на информация за града и бутоните за избор на прогноза
        let cityInfoHtml = `<div class="city-info-panel" style="margin-bottom:18px;">
            <strong style="font-size:1.5em;">${displayName.split(',')[0]}</strong> <span style="color:#2471a3;font-size:1em;">(${country})</span><br>`;
        if (cityImageUrl) {
            cityInfoHtml += `<div style="margin:10px 0;"><img src="${cityImageUrl}" alt="${city}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 8px #b3d8f733;max-height:260px;object-fit:cover;"></div>`;
        }
        if (cityDescription) {
            cityInfoHtml += `<div style=\"font-size:0.98em;color:#fff;margin-bottom:8px;\">${cityDescription}</div>`;
        }
        // Времето в момента
        let currentWeatherHtml = '';
        try {
            const currentResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto&lang=${meteoLang}`);
            const currentData = await currentResp.json();
            let humidity = '-';
            if (currentData.hourly && currentData.hourly.relative_humidity_2m && currentData.current_weather) {
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
                const windDir = c.winddirection;
                currentWeatherHtml = `<div class=\"current-weather\" style=\"margin:12px 0 8px 0;font-size:1.2em;\"><b>${LANGS[currentLang].now}:</b> <span style=\"font-size:1.5em;\">${icon} ${c.temperature}°C</span>, ${LANGS[currentLang].wind}: ${c.windspeed} ${LANGS[currentLang].windUnit} ${windDirectionText(windDir)}, ${LANGS[currentLang].humidity}: ${humidity}%</div>`;
            }
        } catch(e) {}
        cityInfoHtml += currentWeatherHtml;
        cityInfoHtml += `<div style="margin:18px 0 10px 0;">
            <button id="btnDaily" style="margin-right:8px;">${LANGS[currentLang].daily}</button>
            <button id="btnHourly">${LANGS[currentLang].hourly}</button>
        </div>`;
        cityInfoHtml += '</div>';
        cityInfoHtml += `<div style="margin:10px 0 16px 0;display:flex;justify-content:center;">
            <iframe width="320" height="180" style="border-radius:10px;border:1.5px solid #b3d8f7;box-shadow:0 2px 8px #b3d8f733;" loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;
        cityInfoHtml += `<div id="forecastContainer"></div>`;
        resultDiv.innerHTML = cityInfoHtml;

        // --- Нови функции за показване на режими ---
        function showCityMain() {
            currentView = 'main';
            document.querySelector('.city-info-panel').style.display = '';
            document.getElementById('forecastContainer').innerHTML = '';
            document.querySelector('.city-info-panel').querySelector('#btnDaily').style.display = '';
            document.querySelector('.city-info-panel').querySelector('#btnHourly').style.display = '';
        }
        function showBackButton(onClick) {
            let fc = document.getElementById('forecastContainer');
            let backBtn = document.createElement('button');
            backBtn.textContent = LANGS[currentLang].back;
            backBtn.style = 'margin:18px 0 0 0;display:block;';
            backBtn.onclick = onClick;
            fc.appendChild(backBtn);
        }
        // Функция за визуализация на 7-дневна прогноза
        function renderDailyForecast() {
            currentView = 'daily';
            document.querySelector('.city-info-panel').style.display = 'none';
            let dailyHtml = `<b>${LANGS[currentLang].daily}:</b><br>`;
            dailyHtml += '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
            for (let i = 0; i < meteoData.daily.time.length; i++) {
                const date = new Date(meteoData.daily.time[i]);
                const code = meteoData.daily.weathercode[i];
                const iconUrl = getMeteoIcon(code);
                dailyHtml += `<div class=\"forecast-day animate-fade-in\">
                    <b>${date.toLocaleDateString(currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</b><br>
                    <span style=\"font-size: 2em;\">${iconUrl}</span>
                    <br>${LANGS[currentLang].max}: <b>${meteoData.daily.temperature_2m_max[i]}°C</b><br>
                    ${LANGS[currentLang].min}: ${meteoData.daily.temperature_2m_min[i]}°C<br>
                    ${LANGS[currentLang].precip}: ${meteoData.daily.precipitation_sum[i]} mm<br>
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
            currentView = 'hourly';
            document.querySelector('.city-info-panel').style.display = 'none';
            let hourlyHtml = `<b>${LANGS[currentLang].hourly} (48ч):</b><br>`;
            let lastDate = '';
            hourlyHtml += '<div class="hourly-grid">';
            const now = new Date();
            const startISO = now.toISOString().slice(0, 13) + ':00';
            const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            const endISO = end.toISOString().slice(0, 13) + ':00';
            try {
                const hourlyResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto&start_date=${startISO.slice(0,10)}&end_date=${endISO.slice(0,10)}&lang=${meteoLang}`);
                const hourlyData = await hourlyResp.json();
                if (!hourlyData.hourly) {
                    hourlyHtml += LANGS[currentLang].noHourly;
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
                        const dateStr = hour.toLocaleDateString(currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        if (dateStr !== lastDate) {
                            hourlyHtml += `<div style=\"grid-column: 1 / -1; flex-basis:100%;font-weight:bold;font-size:1.1em;margin:10px 0 0 0;\">${dateStr}</div>`;
                            lastDate = dateStr;
                        }
                        hourlyHtml += `<div class=\"forecast-hour animate-fade-in\">
                            <div style=\"font-size:1.2em;font-weight:bold;\">${hour.getHours()}:00</div>
                            <span style=\"font-size:2.2em;\">${iconUrl}</span>
                            <div style=\"font-size:1.5em;font-weight:bold;margin:4px 0;\">${temp}°C</div>
                            <div style=\"font-size:0.98em;color:#2471a3;\">${LANGS[currentLang].wind}: ${windSpeed} ${LANGS[currentLang].windUnit} ${windDirectionText(windDir)}</div>
                            <div style=\"font-size:0.98em;\">${LANGS[currentLang].humidity}: ${humidity}%</div>
                            <div style=\"font-size:0.98em;\">${LANGS[currentLang].precip}: ${precipitation} mm</div>
                        </div>`;
                    }
                }
                hourlyHtml += '</div>';
                document.getElementById('forecastContainer').innerHTML = hourlyHtml;
                showBackButton(() => {
                    showCityMain();
                });
            } catch (e) {
                document.getElementById('forecastContainer').innerHTML = LANGS[currentLang].error;
                showBackButton(() => {
                    showCityMain();
                });
            }
        }
        // Първоначално показваме само инфо за града и бутоните
        showCityMain();
        document.getElementById('btnDaily').onclick = renderDailyForecast;
        document.getElementById('btnHourly').onclick = renderHourlyForecast;
        // Излагаме функциите глобално, за да могат да се извикат при смяна на език
        window.__renderDailyForecast = renderDailyForecast;
        window.__renderHourlyForecast = renderHourlyForecast;
        window.__showCityMain = showCityMain;
    } catch (err) {
        resultDiv.textContent = LANGS[currentLang].error;
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
    const dirs = LANGS[currentLang].windDirs;
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
    const subtitleEl = document.querySelector('.subtitle');
    if (subtitleEl) subtitleEl.style.display = '';
    grid.innerHTML = LANGS[currentLang].loading;
    // Проследяваме дали някоя от заявките към Nominatim е блокирана заради
    // твърде много заявки (HTTP 429), за да превключим на резервен режим,
    // показващ прогнозата по местоположението на устройството.
    let rateLimited = false;
    const promises = capitals.map(async (cap) => {
        try {
            // Вземи координати
            const geoResp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cap.en)}`);
            if (geoResp.status === 429) {
                rateLimited = true;
                return '';
            }
            const geoData = await geoResp.json();
            if (!geoData.length) return '';
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;
            // Вземи текуща прогноза
            const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&lang=bg`);
            if (meteoResp.status === 429) {
                rateLimited = true;
                return '';
            }
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
        } catch (e) {
            return '';
        }
    });
    const results = await Promise.all(promises);
    const successfulResults = results.filter(r => r);
    // Ако сме получили 429 или нито една от заявките не е успяла (вероятно
    // поради ограничение на заявките), показваме прогнозата по
    // местоположението на устройството вместо частичен/празен списък.
    if (rateLimited || successfulResults.length === 0) {
        await showLocationFallbackWeather();
        return;
    }
    grid.innerHTML = successfulResults.join('');
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

// Резервен режим: когато не можем да заредим прогнозата за столиците
// (например заради HTTP 429 от Nominatim), показваме съобщение и
// прогнозата за текущото местоположение на потребителя (чрез Geolocation API).
async function showLocationFallbackWeather() {
    const grid = document.getElementById('capitalsWeather');
    const subtitleEl = document.querySelector('.subtitle');
    if (subtitleEl) subtitleEl.style.display = 'none';
    if (!navigator.geolocation) {
        grid.innerHTML = `<div style="text-align:center;">${LANGS[currentLang].locationDenied}</div>`;
        return;
    }
    grid.innerHTML = LANGS[currentLang].loading;
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Локализирано име на града/държавата чрез OpenCage на текущия език
            const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5';
            let cityName = '';
            let countryName = '';
            try {
                const reverseGeoResp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}&language=${currentLang}&limit=1`);
                const reverseGeoData = await reverseGeoResp.json();
                if (reverseGeoData.results && reverseGeoData.results.length) {
                    const comp = reverseGeoData.results[0].components;
                    cityName = comp.city || comp.town || comp.village || comp.municipality
                        || reverseGeoData.results[0].formatted.split(',')[0];
                    countryName = comp.country || '';
                }
            } catch (e) { /* ще покажем само времето, без имена, ако това се провали */ }
            const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&lang=${currentLang === 'bg' ? 'bg' : currentLang}`);
            const meteoData = await meteoResp.json();
            if (!meteoData.current_weather) {
                grid.innerHTML = `<div style="text-align:center;">${LANGS[currentLang].error}</div>`;
                return;
            }
            const temp = Math.round(meteoData.current_weather.temperature);
            const code = meteoData.current_weather.weathercode;
            const icon = getMeteoIcon(code);
            const windSpeed = meteoData.current_weather.windspeed;
            const windDir = meteoData.current_weather.winddirection;
            const windDirText = windDirectionText(windDir);
            const cityLabel = cityName ? `${cityName}${countryName ? ' (' + countryName + ')' : ''}` : '';
            grid.innerHTML = `
                <div style="flex-basis:100%;width:100%;text-align:center;margin-bottom:14px;font-size:1.05em;color:#2471a3;">
                    ${LANGS[currentLang].rateLimitMsg}
                </div>
                <div class="capital-card" data-city="${cityName}" style="margin:0 auto;">
                    ${cityLabel ? `<div class="city">${cityLabel}</div>` : ''}
                    <div class="temp">${icon} ${temp}°C</div>
                    <div class="desc">${windSpeed} км/ч, ${windDir}° (${windDirText})</div>
                </div>`;
            const card = grid.querySelector('.capital-card');
            if (card && cityName) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', async function() {
                    document.getElementById('cityInput').value = cityName;
                    showSearch();
                    await getWeather();
                });
            }
        } catch (e) {
            grid.innerHTML = `<div style="text-align:center;">${LANGS[currentLang].error}</div>`;
        }
    }, () => {
        // Потребителят е отказал достъп до местоположението или има грешка
        grid.innerHTML = `<div style="text-align:center;">${LANGS[currentLang].locationDenied}</div>`;
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