// --- Езикови ресурси ---
const LANGS = {
    bg: {
        title: 'Прогноза за времето',
        searchPlaceholder: 'Въведи град',
        searchBtn: 'Търси',
        subtitle: 'Времето във вашето местоположение',
        now: 'Сега',
        wind: 'Вятър',
        windUnit: 'км/ч',
        humidity: 'Влажност',
        back: 'Назад',
        daily: '7-дневна прогноза',
        hourly: 'Почасова прогноза',
        hours48: '48ч',
        loading: 'Зареждане...',
        notFound: 'Градът не е намерен.',
        noForecast: 'Няма прогноза за този град.',
        noHourly: 'Няма почасова прогноза.',
        error: 'Грешка при зареждане на прогнозата.',
        min: 'Мин',
        max: 'Макс',
        precip: 'Валежи',
        sunrise: 'Изгрев',
        sunset: 'Залез',
        rateLimitMsg: 'Тъй като в момента не можем да ви дадем информация за най-големите градове в Европа, вижте прогнозата в града, в който сте:',
        locationDenied: 'Не успяхме да определим местоположението ви. Моля, потърсете град ръчно.',
        worldCitiesSubtitle: 'Времето в някои от големите столици',
        recentCitiesTitle: 'Последно разглеждани',
        radarBtn: 'Радар',
        radarTitle: 'Радар за времето',
        radarLoading: 'Зареждане на радара...',
        radarError: 'Радарът не можа да бъде зареден.',
        radarLegendRain: 'Дъжд',
        radarLegendSnow: 'Сняг',
        radarLegendMixed: 'Смесени/заледяващи',
        windDirs: ['С', 'ССИ', 'СИ', 'ИСИ', 'И', 'ИЮИ', 'ЮИ', 'ЮЮИ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С']
    },
    en: {
        title: 'Weather Forecast',
        searchPlaceholder: 'Enter city',
        searchBtn: 'Search',
        subtitle: 'Weather at your location',
        now: 'Now',
        wind: 'Wind',
        windUnit: 'km/h',
        humidity: 'Humidity',
        back: 'Back',
        daily: '7-day forecast',
        hourly: 'Hourly forecast',
        hours48: '48h',
        loading: 'Loading...',
        notFound: 'City not found.',
        noForecast: 'No forecast for this city.',
        noHourly: 'No hourly forecast.',
        error: 'Error loading forecast.',
        min: 'Min',
        max: 'Max',
        precip: 'Precip.',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        rateLimitMsg: 'Since we currently cannot show you the weather for the largest European capitals, here is the forecast for your location:',
        locationDenied: 'We could not determine your location. Please search for a city manually.',
        worldCitiesSubtitle: 'Weather in some of the largest capitals',
        recentCitiesTitle: 'Recently viewed',
        radarBtn: 'Radar',
        radarTitle: 'Weather radar',
        radarLoading: 'Loading radar...',
        radarError: 'The radar could not be loaded.',
        radarLegendRain: 'Rain',
        radarLegendSnow: 'Snow',
        radarLegendMixed: 'Mixed/freezing',
        windDirs: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']
    },
    es: {
        title: 'Pronóstico del tiempo',
        searchPlaceholder: 'Introduce ciudad',
        searchBtn: 'Buscar',
        subtitle: 'El tiempo en tu ubicación',
        now: 'Ahora',
        wind: 'Viento',
        windUnit: 'km/h',
        humidity: 'Humedad',
        back: 'Atrás',
        daily: 'Pronóstico de 7 días',
        hourly: 'Pronóstico por horas',
        hours48: '48h',
        loading: 'Cargando...',
        notFound: 'Ciudad no encontrada.',
        noForecast: 'No hay pronóstico para esta ciudad.',
        noHourly: 'No hay pronóstico por horas.',
        error: 'Error al cargar el pronóstico.',
        min: 'Mín',
        max: 'Máx',
        precip: 'Precip.',
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        rateLimitMsg: 'Como en este momento no podemos mostrarte el tiempo de las mayores capitales europeas, aquí tienes el pronóstico de tu ubicación:',
        locationDenied: 'No pudimos determinar tu ubicación. Por favor, busca una ciudad manualmente.',
        worldCitiesSubtitle: 'El tiempo en algunas de las grandes capitales',
        recentCitiesTitle: 'Vistos recientemente',
        radarBtn: 'Radar',
        radarTitle: 'Radar meteorológico',
        radarLoading: 'Cargando radar...',
        radarError: 'No se pudo cargar el radar.',
        radarLegendRain: 'Lluvia',
        radarLegendSnow: 'Nieve',
        radarLegendMixed: 'Mixta/helada',
        windDirs: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO', 'N']
    }
};
let currentLang = 'en';
let lastSearchedCity = '';
let currentView = 'main'; // 'main' | 'daily' | 'hourly'

function setLang(lang) {
    currentLang = lang;
    document.title = LANGS[lang].title;
    document.querySelector('.logo').textContent = LANGS[lang].title;
    document.getElementById('cityInput').placeholder = LANGS[lang].searchPlaceholder;
    document.getElementById('searchBtn').textContent = LANGS[lang].searchBtn;
    if (document.getElementById('radarBtn')) document.getElementById('radarBtn').textContent = LANGS[lang].radarBtn;
    if (document.getElementById('radarTitle')) document.getElementById('radarTitle').textContent = LANGS[lang].radarTitle;
    if (document.getElementById('radarBackBtn')) document.getElementById('radarBackBtn').textContent = LANGS[lang].back;
    if (document.getElementById('radarLegendRain')) document.getElementById('radarLegendRain').textContent = LANGS[lang].radarLegendRain;
    if (document.getElementById('radarLegendSnow')) document.getElementById('radarLegendSnow').textContent = LANGS[lang].radarLegendSnow;
    if (document.getElementById('radarLegendMixed')) document.getElementById('radarLegendMixed').textContent = LANGS[lang].radarLegendMixed;
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

// --- Автоматично определяне на езика според местоположението на устройството ---
// Латиноамерикански държави (ISO 3166-1 alpha-2 кодове), за които показваме
// сайта на испански, заедно със самата Испания. За България показваме
// български, а навсякъде другаде — английски (по подразбиране).
const LATAM_COUNTRY_CODES = [
    'ar', 'bo', 'br', 'cl', 'co', 'cr', 'cu', 'do', 'ec', 'sv',
    'gt', 'hn', 'mx', 'ni', 'pa', 'py', 'pe', 'uy', 've'
];

function langFromCountryCode(countryCode) {
    const cc = (countryCode || '').toLowerCase();
    if (cc === 'bg') return 'bg';
    if (cc === 'es' || LATAM_COUNTRY_CODES.includes(cc)) return 'es';
    return 'en';
}

// Опитваме се да определим местоположението на устройството (чрез
// Geolocation API + обратно геокодиране) и да зададем подходящия език.
// Ако потребителят откаже достъп или заявката се провали, оставяме
// езика по подразбиране (български).
function detectAndSetLanguageByLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            setLang('en');
            resolve();
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5';
                const resp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}&limit=1`);
                const data = await resp.json();
                const countryCode = data.results && data.results.length
                    ? data.results[0].components.country_code
                    : '';
                setLang(langFromCountryCode(countryCode));
            } catch (e) {
                // при грешка използваме английски по подразбиране
                setLang('en');
            }
            resolve();
        }, () => {
            // потребителят е отказал достъп до местоположението — английски по подразбиране
            setLang('en');
            resolve();
        }, { timeout: 8000 });
    });
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
                    await showRecentCitiesWeather();
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
                const icon = getMeteoIcon(c.weathercode, c.is_day);
                const windDir = c.winddirection;
                // Open-Meteo обновява current_weather.time само в началото на
                // всеки кръгъл час (напр. 19:00), затова не отразява реалните
                // минути в момента. За да покажем точния текущ локален час на
                // града (напр. 19:15), изчисляваме го сами, като прибавим
                // utc_offset_seconds (връщан от API-то при timezone=auto) към
                // текущото UTC време на устройството.
                let localTimeStr = '';
                if (typeof currentData.utc_offset_seconds === 'number') {
                    const nowUtcMs = Date.now();
                    const localMs = nowUtcMs + currentData.utc_offset_seconds * 1000;
                    const localDate = new Date(localMs);
                    const hh = String(localDate.getUTCHours()).padStart(2, '0');
                    const mm = String(localDate.getUTCMinutes()).padStart(2, '0');
                    localTimeStr = `${hh}:${mm}`;
                } else if (typeof c.time === 'string' && c.time.includes('T')) {
                    localTimeStr = c.time.split('T')[1].slice(0, 5);
                }
                const localTimeHtml = localTimeStr
                    ? `<div style=\"font-size:0.95em;color:#9fb0c3;margin-bottom:4px;\">🕒 ${localTimeStr}</div>`
                    : '';
                currentWeatherHtml = `${localTimeHtml}<div class=\"current-weather\" style=\"margin:12px 0 8px 0;font-size:1.2em;\"><b>${LANGS[currentLang].now}:</b> <span style=\"font-size:1.5em;\">${icon} ${Math.round(c.temperature)}°C</span>, ${LANGS[currentLang].wind}: ${c.windspeed} ${LANGS[currentLang].windUnit} ${windDirectionText(windDir)}, ${LANGS[currentLang].humidity}: ${humidity}%</div>`;
            }
        } catch(e) {}
        cityInfoHtml += currentWeatherHtml;
        cityInfoHtml += `<div class="forecast-mode-buttons">
            <button id="btnDaily">${LANGS[currentLang].daily}</button>
            <button id="btnHourly">${LANGS[currentLang].hourly}</button>
        </div>`;
        cityInfoHtml += '</div>';
        cityInfoHtml += `<div class="city-map-wrap" id="cityMapWrap">
            <iframe class="city-map" loading="lazy" title="${displayName.split(',')[0]}"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;
        cityInfoHtml += `<div id="forecastContainer"></div>`;
        resultDiv.innerHTML = cityInfoHtml;
        addRecentCity(lat, lon, country);

        // --- Нови функции за показване на режими ---
        function showCityMain() {
            currentView = 'main';
            document.querySelector('.city-info-panel').style.display = '';
            document.getElementById('forecastContainer').innerHTML = '';
            document.querySelector('.city-info-panel').querySelector('#btnDaily').style.display = '';
            document.querySelector('.city-info-panel').querySelector('#btnHourly').style.display = '';
            const mapWrap = document.getElementById('cityMapWrap');
            if (mapWrap) mapWrap.style.display = '';
        }
        function showBackButton(onClick) {
            // Скриваме световната карта и показваме заглавие с името на
            // града (центрирано, с по-голям шрифт) и бутона "Назад" над прогнозата.
            const mapWrap = document.getElementById('cityMapWrap');
            if (mapWrap) mapWrap.style.display = 'none';
            let fc = document.getElementById('forecastContainer');
            let headerBar = document.createElement('div');
            headerBar.style = 'display:flex;align-items:center;position:relative;margin-bottom:14px;min-height:40px;';
            let backBtn = document.createElement('button');
            backBtn.textContent = LANGS[currentLang].back;
            backBtn.style = 'margin:0;position:relative;z-index:1;';
            backBtn.onclick = onClick;
            let cityTitle = document.createElement('strong');
            cityTitle.style = 'font-size:1.8em;position:absolute;left:0;right:0;text-align:center;pointer-events:none;';
            cityTitle.textContent = displayName.split(',')[0];
            headerBar.appendChild(backBtn);
            headerBar.appendChild(cityTitle);
            fc.insertBefore(headerBar, fc.firstChild);
        }
        // Функция за визуализация на 7-дневна прогноза
        function renderDailyForecast() {
            currentView = 'daily';
            document.querySelector('.city-info-panel').style.display = 'none';
            let dailyHtml = `<b>${LANGS[currentLang].daily}:</b><br>`;
            dailyHtml += '<div class="daily-grid">';
            for (let i = 0; i < meteoData.daily.time.length; i++) {
                const date = new Date(meteoData.daily.time[i]);
                const code = meteoData.daily.weathercode[i];
                const iconUrl = getMeteoIcon(code);
                dailyHtml += `<div class=\"forecast-day animate-fade-in\">
                    <b>${date.toLocaleDateString(currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</b><br>
                    <span style=\"font-size: 2em;\">${iconUrl}</span>
                    <br>${LANGS[currentLang].max}: <b>${Math.round(meteoData.daily.temperature_2m_max[i])}°C</b><br>
                    ${LANGS[currentLang].min}: ${Math.round(meteoData.daily.temperature_2m_min[i])}°C<br>
                    ${LANGS[currentLang].precip}: ${Math.round(meteoData.daily.precipitation_sum[i])} mm<br>
                </div>`;
            }
            dailyHtml += '</div>';
            document.getElementById('forecastContainer').innerHTML = dailyHtml;
            showBackButton(() => {
                history.back();
            });
        }
        // Функция за визуализация на почасова прогноза (48ч от сега)
        async function renderHourlyForecast() {
            currentView = 'hourly';
            document.querySelector('.city-info-panel').style.display = 'none';
            let hourlyHtml = `<b>${LANGS[currentLang].hourly} (${LANGS[currentLang].hours48}):</b><br>`;
            let lastDate = '';
            hourlyHtml += '<div class="hourly-grid">';
            const now = new Date();
            const startISO = now.toISOString().slice(0, 13) + ':00';
            const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
            const endISO = end.toISOString().slice(0, 13) + ':00';
            // Заявката за начална/крайна дата се базира на текущото време
            // в браузъра (UTC/локална зона на устройството), но градът може
            // да е в съвсем различна часова зона (напр. Токио). За да сме
            // сигурни, че разполагаме с изгрев/залез за всички дати, които
            // ще срещнем в 48-часовия прозорец в часовата зона НА ГРАДА,
            // разширяваме диапазона с по един ден отпред и отзад.
            const queryStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const queryEndDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            try {
                const hourlyResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day&daily=sunrise,sunset&timezone=auto&start_date=${queryStartDate.toISOString().slice(0,10)}&end_date=${queryEndDate.toISOString().slice(0,10)}&lang=${meteoLang}`);
                const hourlyData = await hourlyResp.json();
                if (!hourlyData.hourly) {
                    hourlyHtml += LANGS[currentLang].noHourly;
                } else {
                    // Open-Meteo връща часовите низове (hourly.time, daily.sunrise/
                    // sunset) като "наивни" низове без часова зона (напр.
                    // "2026-10-01T14:00"), които JS парсира чрез new Date(...)
                    // като ЛОКАЛНО време НА БРАУЗЪРА. Ако градът е в друга
                    // часова зона (напр. Токио, докато браузърът е в София),
                    // сравнението с реалното "сега" на устройството дава грешен
                    // резултат. За да сравняваме коректно спрямо локалното
                    // време НА ГРАДА, изчисляваме "сега" в същата (изкуствена)
                    // координатна система: вземаме реалното UTC време, прибавяме
                    // utc_offset_seconds (връщано от API-то), за да получим
                    // часовниковите стойности на града, и после ги подаваме на
                    // конструктора new Date(y,m,d,h,mi,s) по начина, по който
                    // браузърът би парснал наивен низ със същите стойности.
                    const offsetSec = typeof hourlyData.utc_offset_seconds === 'number' ? hourlyData.utc_offset_seconds : 0;
                    const cityNowUtcBased = new Date(Date.now() + offsetSec * 1000);
                    const cityNowForCompare = new Date(
                        cityNowUtcBased.getUTCFullYear(),
                        cityNowUtcBased.getUTCMonth(),
                        cityNowUtcBased.getUTCDate(),
                        cityNowUtcBased.getUTCHours(),
                        cityNowUtcBased.getUTCMinutes(),
                        cityNowUtcBased.getUTCSeconds()
                    );
                    // Изчисляваме ден/нощ локално по изгрев/залез за всеки ден,
                    // за да избегнем евентуални несъответствия в полето is_day
                    // на API-то около полунощ (напр. при смяна на датата).
                    const sunTimesByDate = {};
                    if (hourlyData.daily && hourlyData.daily.time) {
                        hourlyData.daily.time.forEach((dateStr, idx) => {
                            sunTimesByDate[dateStr] = {
                                sunrise: hourlyData.daily.sunrise ? new Date(hourlyData.daily.sunrise[idx]) : null,
                                sunset: hourlyData.daily.sunset ? new Date(hourlyData.daily.sunset[idx]) : null
                            };
                        });
                    }
                    const nowTime = cityNowForCompare.getTime();
                    // Събираме почасовите точки и събитията за изгрев/залез в
                    // един списък, сортиран по време, за да можем да вмъкнем
                    // "Изгрев"/"Залез" на точното им място между кутийките
                    // за кръглите часове.
                    const timelineItems = [];
                    for (let i = 0; i < hourlyData.hourly.time.length; i++) {
                        const hour = new Date(hourlyData.hourly.time[i]);
                        if (hour.getTime() < nowTime || hour.getTime() > nowTime + 48*60*60*1000) continue;
                        timelineItems.push({ type: 'hour', time: hour, index: i });
                    }
                    Object.keys(sunTimesByDate).forEach((dateKey) => {
                        const times = sunTimesByDate[dateKey];
                        [['sunrise', times.sunrise], ['sunset', times.sunset]].forEach(([kind, t]) => {
                            if (t && t.getTime() >= nowTime && t.getTime() <= nowTime + 48*60*60*1000) {
                                timelineItems.push({ type: kind, time: t });
                            }
                        });
                    });
                    timelineItems.sort((a, b) => a.time.getTime() - b.time.getTime());
                    for (const item of timelineItems) {
                        const hour = item.time;
                        const dateStr = hour.toLocaleDateString(currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        if (dateStr !== lastDate) {
                            hourlyHtml += `<div style=\"grid-column: 1 / -1; flex-basis:100%;font-weight:bold;font-size:1.1em;margin:10px 0 0 0;\">${dateStr}</div>`;
                            lastDate = dateStr;
                        }
                        if (item.type === 'sunrise' || item.type === 'sunset') {
                            const label = item.type === 'sunrise' ? LANGS[currentLang].sunrise : LANGS[currentLang].sunset;
                            const emoji = item.type === 'sunrise' ? '🌅' : '🌇';
                            const timeStr = hour.toLocaleTimeString(currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
                            hourlyHtml += `<div class=\"sun-event animate-fade-in\" style=\"grid-column: 1 / -1; flex-basis:100%;text-align:center;font-size:1em;margin:6px 0;color:#ff8a00;\">${emoji} ${label} ${timeStr}ч</div>`;
                            continue;
                        }
                        const i = item.index;
                        const code = hourlyData.hourly.weathercode[i];
                        const hourDateKey = hourlyData.hourly.time[i].slice(0, 10);
                        const sunTimes = sunTimesByDate[hourDateKey];
                        let isDay = hourlyData.hourly.is_day ? hourlyData.hourly.is_day[i] : 1;
                        if (sunTimes && sunTimes.sunrise && sunTimes.sunset) {
                            isDay = (hour >= sunTimes.sunrise && hour < sunTimes.sunset) ? 1 : 0;
                        }
                        const iconUrl = getMeteoIcon(code, isDay);
                        const temp = Math.round(hourlyData.hourly.temperature_2m[i]);
                        const windSpeed = hourlyData.hourly.wind_speed_10m ? hourlyData.hourly.wind_speed_10m[i] : '-';
                        const windDir = hourlyData.hourly.wind_direction_10m ? hourlyData.hourly.wind_direction_10m[i] : '-';
                        const humidity = hourlyData.hourly.relative_humidity_2m ? hourlyData.hourly.relative_humidity_2m[i] : '-';
                        const precipitation = hourlyData.hourly.precipitation ? hourlyData.hourly.precipitation[i] : '-';
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
                    history.back();
                });
            } catch (e) {
                document.getElementById('forecastContainer').innerHTML = LANGS[currentLang].error;
                showBackButton(() => {
                    history.back();
                });
            }
        }
        // Първоначално показваме само инфо за града и бутоните
        showCityMain();
        document.getElementById('btnDaily').onclick = () => {
            renderDailyForecast();
            pushCityViewState(lastSearchedCity, 'daily');
        };
        document.getElementById('btnHourly').onclick = () => {
            renderHourlyForecast();
            pushCityViewState(lastSearchedCity, 'hourly');
        };
        // Излагаме функциите глобално, за да могат да се извикат при смяна на език
        window.__renderDailyForecast = renderDailyForecast;
        window.__renderHourlyForecast = renderHourlyForecast;
        window.__showCityMain = showCityMain;
    } catch (err) {
        resultDiv.textContent = LANGS[currentLang].error;
    }
}

// Open-Meteo weather code to icon
function getMeteoIcon(code, isDay) {
    // isDay: 1 = ден, 0 = нощ (по подразбиране приемаме ден, ако не е подадено)
    const night = isDay === 0 || isDay === false;
    // Emoji mapping за основните Open-Meteo weather codes (дневни варианти)
    const emojiMapDay = {
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
    // Нощни варианти за кодовете, при които има видима разлика (комбинации
    // със слънце през деня стават комбинации с луна през нощта)
    const emojiMapNight = {
        0: '🌙', // ясно небе през нощта
        1: '🌙', // предимно ясно през нощта
        2: '☁️', // разкъсана облачност през нощта
        3: '☁️', // облачно (същото като през деня)
        51: '🌧️', // слаб дъжд (без слънце през нощта)
        53: '🌧️',
        55: '🌧️',
        80: '🌧️', // превалявания (без слънце през нощта)
        81: '🌧️',
        82: '🌧️',
    };
    if (night && emojiMapNight[code] !== undefined) {
        return emojiMapNight[code];
    }
    return emojiMapDay[code] || '❔';
}

// Глобална функция за текстово описание на посоката на вятъра
function windDirectionText(deg) {
    if (deg === undefined || deg === null || deg === '-' || isNaN(deg)) return '-';
    const dirs = LANGS[currentLang].windDirs;
    return dirs[Math.round(deg / 22.5) % 16];
}

// --- НАЧАЛНА СТРАНИЦА И НАВИГАЦИЯ ---

// Списък с едни от най-големите градове в света (по население), показван
// на началната страница, когато потребителят не сподели местоположението си.
// Координатите са зададени директно (без геокодиране чрез Nominatim), за да
// избегнем грешки от ограничението за честота на заявките (rate limiting)
// на Nominatim API, което преди причиняваше случайни грешки при паралелни
// заявки за всички градове наведнъж.
const worldCities = [
    { names: { bg: 'Токио', en: 'Tokyo', es: 'Tokio' }, en: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { names: { bg: 'Делхи', en: 'Delhi', es: 'Delhi' }, en: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
    { names: { bg: 'Шанхай', en: 'Shanghai', es: 'Shanghái' }, en: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737 },
    { names: { bg: 'Сао Паулу', en: 'Sao Paulo', es: 'São Paulo' }, en: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333 },
    { names: { bg: 'Мексико Сити', en: 'Mexico City', es: 'Ciudad de México' }, en: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332 },
    { names: { bg: 'Кайро', en: 'Cairo', es: 'El Cairo' }, en: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
    { names: { bg: 'Мумбай', en: 'Mumbai', es: 'Bombay' }, en: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
    { names: { bg: 'Пекин', en: 'Beijing', es: 'Pekín' }, en: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
    { names: { bg: 'Ню Йорк', en: 'New York', es: 'Nueva York' }, en: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
    { names: { bg: 'Лондон', en: 'London', es: 'Londres' }, en: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 }
];

async function showCapitalsWeather() {
    // Началната страница показва прогнозата за текущото местоположение на
    // потребителя (ако е споделено), а при отказ/грешка — списък с едни от
    // най-големите градове в света.
    await showLocationFallbackWeather();
}

// Показва прогноза за най-големите градове в света (резервен режим,
// когато потребителят не сподели местоположението си или то не може да
// бъде определено).
async function showWorldCitiesWeather() {
    const grid = document.getElementById('capitalsWeather');
    const subtitleEl = document.querySelector('.subtitle');
    if (subtitleEl) {
        subtitleEl.style.display = '';
        subtitleEl.textContent = LANGS[currentLang].worldCitiesSubtitle;
    }
    grid.innerHTML = LANGS[currentLang].loading;
    // Помощна функция за извличане на времето за даден град с до 2 опита,
    // за да избегнем случайни мрежови грешки/прекъсвания при паралелни заявки.
    async function fetchCityWeather(c, attempt) {
        try {
            const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true&lang=${currentLang === 'bg' ? 'bg' : currentLang}`);
            if (!meteoResp.ok) throw new Error('bad response');
            const meteoData = await meteoResp.json();
            if (!meteoData.current_weather) throw new Error('no current_weather');
            const temp = Math.round(meteoData.current_weather.temperature);
            const code = meteoData.current_weather.weathercode;
            const icon = getMeteoIcon(code, meteoData.current_weather.is_day);
            const windSpeed = meteoData.current_weather.windspeed;
            const windDir = meteoData.current_weather.winddirection;
            const windDirText = windDirectionText(windDir);
            const localizedName = c.names[currentLang] || c.names.en;
            return `<div class="capital-card" data-city="${localizedName}">
                <div class="city">${localizedName}</div>
                <div class="temp">${icon} ${temp}°C</div>
                <div class="desc">${windSpeed} км/ч, ${windDir}° (${windDirText})</div>
            </div>`;
        } catch (e) {
            if (!attempt) {
                return fetchCityWeather(c, 1);
            }
            return '';
        }
    }
    const promises = worldCities.map((c) => fetchCityWeather(c, 0));
    const results = await Promise.all(promises);
    const successfulResults = results.filter(r => r);
    if (successfulResults.length === 0) {
        // Вместо съобщение за грешка показваме празен/тих резултат, за да не
        // плашим потребителя при временен проблем с API-то на началната
        // страница — той все пак може да търси град ръчно.
        grid.innerHTML = '';
        return;
    }
    grid.innerHTML = successfulResults.join('');
    Array.from(grid.querySelectorAll('.capital-card')).forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', async function() {
            const cityName = card.getAttribute('data-city');
            document.getElementById('cityInput').value = cityName;
            showSearch();
            await getWeather();
            pushCityState(cityName);
        });
    });
}

// Показваме прогнозата за текущото местоположение на потребителя
// (чрез Geolocation API) на началната страница.
async function showLocationFallbackWeather() {
    const grid = document.getElementById('capitalsWeather');
    const subtitleEl = document.querySelector('.subtitle');
    if (subtitleEl) {
        subtitleEl.style.display = '';
        subtitleEl.textContent = LANGS[currentLang].subtitle;
    }
    if (!navigator.geolocation) {
        await showWorldCitiesWeather();
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
                // При проблем с времето за текущото местоположение показваме
                // резервния списък с най-големите градове в света, вместо
                // съобщение за грешка.
                await showWorldCitiesWeather();
                return;
            }
            const temp = Math.round(meteoData.current_weather.temperature);
            const code = meteoData.current_weather.weathercode;
            const icon = getMeteoIcon(code, meteoData.current_weather.is_day);
            const windSpeed = meteoData.current_weather.windspeed;
            const windDir = meteoData.current_weather.winddirection;
            const windDirText = windDirectionText(windDir);
            const cityLabel = cityName ? `${cityName}${countryName ? ' (' + countryName + ')' : ''}` : '';
            grid.innerHTML = `
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
                    pushCityState(cityName);
                });
            }
        } catch (e) {
            // При грешка в извличането на времето за местоположението на
            // потребителя показваме резервния списък с най-големите градове
            // в света, вместо съобщение за грешка.
            await showWorldCitiesWeather();
        }
    }, async () => {
        // Потребителят е отказал достъп до местоположението или има грешка —
        // показваме прогноза за най-големите градове в света вместо съобщение
        // за грешка.
        await showWorldCitiesWeather();
    });
}

// --- "Последно разглеждани" градове (съхранени в localStorage) ---
const RECENT_CITIES_KEY = 'recentCities';
const RECENT_CITIES_MAX = 5;

// Съответствия кирилица -> латиница, използвани като резервен вариант,
// когато обратното геокодиране не успее да върне име на града на
// избрания (нe-български) език и то си остане на кирилица.
const CYRILLIC_TO_LATIN = {
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y',
    'К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U',
    'Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sht','Ъ':'A','Ь':'','Ю':'Yu','Я':'Ya',
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z','и':'i','й':'y',
    'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
    'ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya'
};

function transliterateCyrillicToLatin(text) {
    if (!text) return text;
    return text.split('').map(ch => (ch in CYRILLIC_TO_LATIN ? CYRILLIC_TO_LATIN[ch] : ch)).join('');
}

function getRecentCities() {
    try {
        const raw = localStorage.getItem(RECENT_CITIES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function addRecentCity(lat, lon, country) {
    if (typeof lat !== 'number' || typeof lon !== 'number') return;
    let list = getRecentCities();
    // Разграничаваме градовете по координати (закръглени), а не по име,
    // защото името се превежда динамично според избрания език и не бива
    // да служи за идентификатор на записа.
    const roundedLat = Math.round(lat * 1000) / 1000;
    const roundedLon = Math.round(lon * 1000) / 1000;
    list = list.filter(c => Math.round(c.lat * 1000) / 1000 !== roundedLat || Math.round(c.lon * 1000) / 1000 !== roundedLon);
    list.unshift({ lat, lon, country: country || '' });
    list = list.slice(0, RECENT_CITIES_MAX);
    try {
        localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(list));
    } catch (e) { /* игнорирай грешки при запис */ }
}

// Показва прогноза за последно разглежданите градове на началната страница.
async function showRecentCitiesWeather() {
    const section = document.getElementById('recentCitiesSection');
    const grid = document.getElementById('recentCitiesWeather');
    const titleEl = document.getElementById('recentCitiesTitle');
    if (!section || !grid) return;
    const list = getRecentCities();
    if (!list.length) {
        section.style.display = 'none';
        return;
    }
    if (titleEl) titleEl.textContent = LANGS[currentLang].recentCitiesTitle;
    section.style.display = '';
    grid.innerHTML = LANGS[currentLang].loading;
    async function fetchOne(c, attempt) {
        try {
            // Локализирано име на града според текущия език (чрез обратно
            // геокодиране), за да се превежда при смяна на езика.
            let localizedName = '';
            try {
                const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5';
                const reverseGeoResp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${c.lat}+${c.lon}&key=${openCageApiKey}&language=${currentLang}&limit=1`);
                const reverseGeoData = await reverseGeoResp.json();
                if (reverseGeoData.results && reverseGeoData.results.length) {
                    const comp = reverseGeoData.results[0].components;
                    localizedName = comp.city || comp.town || comp.village || comp.municipality
                        || reverseGeoData.results[0].formatted.split(',')[0];
                }
            } catch (e) { /* ако геокодирането се провали, ще покажем без име */ }
            // Ако сме на не-български език, но наименованието все пак е на
            // кирилица (напр. API-то не разполага с превод за този град),
            // транслитерираме го буква по буква към латиница.
            if (localizedName && currentLang !== 'bg' && /[А-Яа-я]/.test(localizedName)) {
                localizedName = transliterateCyrillicToLatin(localizedName);
            }
            const meteoResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true&lang=${currentLang === 'bg' ? 'bg' : currentLang}`);
            if (!meteoResp.ok) throw new Error('bad response');
            const meteoData = await meteoResp.json();
            if (!meteoData.current_weather) throw new Error('no current_weather');
            const temp = Math.round(meteoData.current_weather.temperature);
            const code = meteoData.current_weather.weathercode;
            const icon = getMeteoIcon(code, meteoData.current_weather.is_day);
            const windSpeed = meteoData.current_weather.windspeed;
            const windDir = meteoData.current_weather.winddirection;
            const windDirText = windDirectionText(windDir);
            const cityLabel = localizedName || c.country || '';
            return `<div class="capital-card" data-city="${cityLabel}" data-lat="${c.lat}" data-lon="${c.lon}">
                <div class="city">${cityLabel}</div>
                <div class="temp">${icon} ${temp}°C</div>
                <div class="desc">${windSpeed} км/ч, ${windDir}° (${windDirText})</div>
            </div>`;
        } catch (e) {
            if (!attempt) return fetchOne(c, 1);
            return '';
        }
    }
    const results = await Promise.all(list.map(c => fetchOne(c, 0)));
    const successful = results.filter(r => r);
    if (!successful.length) {
        section.style.display = 'none';
        return;
    }
    grid.innerHTML = successful.join('');
    Array.from(grid.querySelectorAll('.capital-card')).forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', async function() {
            const cityName = card.getAttribute('data-city');
            document.getElementById('cityInput').value = cityName;
            showSearch();
            await getWeather();
            pushCityState(cityName);
        });
    });
}

// Показване на начална страница и секция за търсене
function showHome() {
    document.getElementById('homeSection').style.display = '';
    document.getElementById('searchSection').style.display = 'none';
    const radarSection = document.getElementById('radarSection');
    if (radarSection) radarSection.style.display = 'none';
    stopRadarAnimation();
    showRecentCitiesWeather();
}
function showSearch() {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('searchSection').style.display = '';
    const radarSection = document.getElementById('radarSection');
    if (radarSection) radarSection.style.display = 'none';
    stopRadarAnimation();
    setTimeout(() => { document.getElementById('cityInput').focus(); }, 200);
}

// --- Радар на времето (анимирани облачност/валежи чрез RainViewer) ---
let radarMapInstance = null;
let radarTileLayer = null;
let radarFrames = [];
let radarFrameIndex = 0;
let radarPlaying = false;
let radarTimerId = null;

function stopRadarAnimation() {
    radarPlaying = false;
    if (radarTimerId) {
        clearInterval(radarTimerId);
        radarTimerId = null;
    }
    const playBtn = document.getElementById('radarPlayBtn');
    if (playBtn) playBtn.textContent = '▶';
}

function formatRadarFrameTime(unixSeconds) {
    const d = new Date(unixSeconds * 1000);
    const locale = currentLang === 'bg' ? 'bg-BG' : currentLang === 'es' ? 'es-ES' : 'en-GB';
    return d.toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function setRadarFrame(index) {
    if (!radarFrames.length || !radarMapInstance) return;
    radarFrameIndex = ((index % radarFrames.length) + radarFrames.length) % radarFrames.length;
    const frame = radarFrames[radarFrameIndex];
    // Цветова схема 6 (NEXRAD Level III) на RainViewer показва ясно
    // разграничени, по-ярки цветове за различните видове валежи: зелено/
    // жълто/оранжево/червено за дъжд (по интензитет), синьо/лилаво за сняг
    // и розово/магента за смесени/заледяващи валежи. Параметърът "1_1"
    // включва изглаждане (smooth=1) и отделен цвят за сняг (snow=1).
    const tileUrl = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/6/1_1.png`;
    if (radarTileLayer) {
        radarMapInstance.removeLayer(radarTileLayer);
    }
    radarTileLayer = L.tileLayer(tileUrl, {
        tileSize: 256,
        opacity: 0.85,
        zIndex: 10
    }).addTo(radarMapInstance);
    const slider = document.getElementById('radarSlider');
    if (slider) slider.value = String(radarFrameIndex);
    const timeLabel = document.getElementById('radarTimeLabel');
    if (timeLabel) timeLabel.textContent = formatRadarFrameTime(frame.time);
}

function startRadarAnimation() {
    if (!radarFrames.length) return;
    radarPlaying = true;
    const playBtn = document.getElementById('radarPlayBtn');
    if (playBtn) playBtn.textContent = '⏸';
    radarTimerId = setInterval(() => {
        setRadarFrame(radarFrameIndex + 1);
    }, 600);
}

async function initRadarMap(lat, lon) {
    const mapEl = document.getElementById('radarMap');
    if (!mapEl) return;
    if (radarMapInstance) {
        radarMapInstance.remove();
        radarMapInstance = null;
        radarTileLayer = null;
    }
    radarMapInstance = L.map(mapEl, { zoomControl: true, attributionControl: false }).setView([lat, lon], 6);
    // Ползваме стандартните (безплатни, без нужда от API ключ) тайлове на
    // OpenStreetMap. CartoDB вече изисква API ключ за тяхната CDN, затова
    // не ги ползваме повече.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc',
        maxZoom: 19
    }).addTo(radarMapInstance);
    L.marker([lat, lon]).addTo(radarMapInstance);
}

// Показва секцията с радара на валежите/облачността (минало + прогноза за
// напред до 2 дни) чрез безплатния API на RainViewer. Ако е подадена
// позиция (lat/lon), центрираме картата там; иначе ползваме местоположението
// на потребителя, а при липса/отказ — център на Европа.
async function showRadar(lat, lon) {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'none';
    const radarSection = document.getElementById('radarSection');
    radarSection.style.display = '';
    const timeLabel = document.getElementById('radarTimeLabel');
    if (timeLabel) timeLabel.textContent = LANGS[currentLang].radarLoading;
    const legendRain = document.getElementById('radarLegendRain');
    const legendSnow = document.getElementById('radarLegendSnow');
    const legendMixed = document.getElementById('radarLegendMixed');
    if (legendRain) legendRain.textContent = LANGS[currentLang].radarLegendRain;
    if (legendSnow) legendSnow.textContent = LANGS[currentLang].radarLegendSnow;
    if (legendMixed) legendMixed.textContent = LANGS[currentLang].radarLegendMixed;
    stopRadarAnimation();

    async function centerAndLoad(centerLat, centerLon) {
        await initRadarMap(centerLat, centerLon);
        try {
            const resp = await fetch('https://api.rainviewer.com/public/weather-maps.json');
            const data = await resp.json();
            const past = (data.radar && data.radar.past) || [];
            const nowcast = (data.radar && data.radar.nowcast) || [];
            radarFrames = [...past, ...nowcast];
            if (!radarFrames.length) throw new Error('no frames');
            const slider = document.getElementById('radarSlider');
            if (slider) {
                slider.max = String(radarFrames.length - 1);
                slider.value = String(radarFrames.length - 1);
            }
            // Показваме последния наличен кадър (най-близък до "сега")
            setRadarFrame(radarFrames.length - 1);
        } catch (e) {
            if (timeLabel) timeLabel.textContent = LANGS[currentLang].radarError;
        }
    }

    if (typeof lat === 'number' && typeof lon === 'number') {
        await centerAndLoad(lat, lon);
        return;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            await centerAndLoad(position.coords.latitude, position.coords.longitude);
        }, async () => {
            await centerAndLoad(50, 15); // център на Европа като резервен вариант
        }, { timeout: 8000 });
    } else {
        await centerAndLoad(50, 15);
    }
}

// --- URL маршрутизация (за бутона "Назад"/"Напред" на браузъра) ---
// Използваме history.pushState, за да отразяваме текущото състояние
// (начална страница или избран град) в адреса на браузъра. Така
// бутонът "Назад" връща към началната страница или към предходния
// избран град, вместо да напуска сайта.
function pushHomeState() {
    history.pushState({ view: 'home' }, '', '#home');
}
function pushCityState(cityName) {
    history.pushState({ view: 'city', city: cityName }, '', `#city/${encodeURIComponent(cityName)}`);
}
function pushCityViewState(cityName, viewName) {
    history.pushState({ view: viewName, city: cityName }, '', `#city/${encodeURIComponent(cityName)}/${viewName}`);
}
function replaceHomeState() {
    history.replaceState({ view: 'home' }, '', '#home');
}
function replaceCityState(cityName) {
    history.replaceState({ view: 'city', city: cityName }, '', `#city/${encodeURIComponent(cityName)}`);
}

// Обработва навигацията чрез бутоните "Назад"/"Напред" на браузъра.
window.addEventListener('popstate', async (e) => {
    const state = e.state;
    if (!state || state.view === 'home') {
        showHome();
    } else if (state.view === 'city') {
        document.getElementById('cityInput').value = state.city;
        lastSearchedCity = state.city;
        showSearch();
        await getWeather(true);
    } else if (state.view === 'daily' || state.view === 'hourly') {
        document.getElementById('cityInput').value = state.city;
        lastSearchedCity = state.city;
        showSearch();
        await getWeather(true);
        if (state.view === 'daily' && typeof window.__renderDailyForecast === 'function') {
            window.__renderDailyForecast();
        } else if (state.view === 'hourly' && typeof window.__renderHourlyForecast === 'function') {
            window.__renderHourlyForecast();
        }
    } else if (state.view === 'radar') {
        await showRadar();
    }
});

// Навигация
window.addEventListener('DOMContentLoaded', async () => {
    // Проверяваме дали адресът вече сочи към конкретен град (напр. при
    // презареждане на страницата или споделен линк), евентуално и към
    // конкретния изглед (7-дневна/почасова прогноза), и зареждаме директно
    // съответния изглед.
    const initialHashMatch = location.hash.match(/^#city\/([^/]+)(?:\/(daily|hourly))?$/);
    if (initialHashMatch) {
        const initialCity = decodeURIComponent(initialHashMatch[1]);
        const initialView = initialHashMatch[2];
        if (initialView) {
            history.replaceState({ view: initialView, city: initialCity }, '', `#city/${encodeURIComponent(initialCity)}/${initialView}`);
        } else {
            replaceCityState(initialCity);
        }
        document.getElementById('cityInput').value = initialCity;
        await detectAndSetLanguageByLocation();
        showSearch();
        await getWeather();
        if (initialView === 'daily' && typeof window.__renderDailyForecast === 'function') {
            window.__renderDailyForecast();
        } else if (initialView === 'hourly' && typeof window.__renderHourlyForecast === 'function') {
            window.__renderHourlyForecast();
        }
    } else {
        replaceHomeState();
        showHome();
        await detectAndSetLanguageByLocation();
        showCapitalsWeather();
    }
    document.getElementById('logo').onclick = (e) => {
        e.preventDefault();
        showHome();
        pushHomeState();
    };
    // Търсачката в хедъра работи винаги
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        showSearch();
        await getWeather();
        if (city) pushCityState(city);
    });
    cityInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            showSearch();
            await getWeather();
            if (city) pushCityState(city);
        }
    });
    // Бутон "Радар"
    const radarBtn = document.getElementById('radarBtn');
    if (radarBtn) {
        radarBtn.addEventListener('click', async () => {
            await showRadar();
            history.pushState({ view: 'radar' }, '', '#radar');
        });
    }
    const radarBackBtn = document.getElementById('radarBackBtn');
    if (radarBackBtn) {
        radarBackBtn.addEventListener('click', () => {
            history.back();
        });
    }
    const radarPlayBtn = document.getElementById('radarPlayBtn');
    if (radarPlayBtn) {
        radarPlayBtn.addEventListener('click', () => {
            if (radarPlaying) {
                stopRadarAnimation();
            } else {
                startRadarAnimation();
            }
        });
    }
    const radarSlider = document.getElementById('radarSlider');
    if (radarSlider) {
        radarSlider.addEventListener('input', () => {
            stopRadarAnimation();
            setRadarFrame(parseInt(radarSlider.value, 10) || 0);
        });
    }
});

// При търсене, винаги показвай searchSection и скривай homeSection