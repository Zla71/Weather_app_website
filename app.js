// --- English-only Weather App (no geolocation, static city list) ---

const TEXT = {
    title: 'Weather Forecast',
    searchPlaceholder: 'Enter city',
    searchBtn: 'Search',
    subtitle: 'Weather in some of the largest cities',
    now: 'Now',
    wind: 'Wind',
    windUnit: 'km/h',
    humidity: 'Humidity',
    back: 'Back',
    daily: '7-day forecast',
    hourly: '48 Hours Forecast',
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
    windDirs: ['North', 'North/North East', 'North East', 'East/North East', 'East', 'East/South East', 'South East', 'South/South East', 'South', 'South/South West', 'South West', 'West/South West', 'West', 'West/North West', 'North West', 'North/North West', 'North']
};

let lastSearchedCity = '';
let lastSearchedCoords = null; // { lat, lon } | null
let currentView = 'main'; // 'main' | 'daily' | 'hourly'

// --- Favourites (persisted in localStorage) ---
const FAVOURITES_KEY = 'weatherAppFavourites';

function getFavourites() {
    try {
        const raw = localStorage.getItem(FAVOURITES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveFavourites(favourites) {
    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    } catch (e) { /* ignore storage errors */ }
}

function makeFavouriteKey(name, country) {
    return `${(name || '').trim().toLowerCase()}|${(country || '').trim().toLowerCase()}`;
}

function isFavouriteCity(name, country) {
    const key = makeFavouriteKey(name, country);
    return getFavourites().some(f => makeFavouriteKey(f.name, f.country) === key);
}

function toggleFavouriteCity(city) {
    const favourites = getFavourites();
    const key = makeFavouriteKey(city.name, city.country);
    const idx = favourites.findIndex(f => makeFavouriteKey(f.name, f.country) === key);
    if (idx !== -1) {
        favourites.splice(idx, 1);
    } else {
        favourites.push(city);
    }
    saveFavourites(favourites);
    return idx === -1; // true if it was just added
}

function createFavouriteStar(city, onToggle) {
    const star = document.createElement('span');
    star.className = 'favourite-star';
    star.textContent = '★';
    star.title = 'Add to favourites';
    const refreshState = () => {
        const active = isFavouriteCity(city.name, city.country);
        star.classList.toggle('active', active);
        star.title = active ? 'Remove from favourites' : 'Add to favourites';
    };
    refreshState();
    star.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavouriteCity(city);
        refreshState();
        if (typeof onToggle === 'function') onToggle();
        if (typeof window.__refreshFavouritesSection === 'function') {
            window.__refreshFavouritesSection();
        }
    });
    return star;
}

function windDirectionText(deg) {
    if (deg === undefined || deg === null || deg === '-' || isNaN(deg)) return '-';
    const dirs = TEXT.windDirs;
    return dirs[Math.round(deg / 22.5) % 16];
}

// --- Simple in-memory cache with 5-minute TTL to avoid API rate limits ---
const CACHE_TTL_MS = 5 * 60 * 1000;
const fetchCache = new Map();

async function cachedFetchJson(url) {
    const now = Date.now();
    const cached = fetchCache.get(url);
    if (cached && (now - cached.time) < CACHE_TTL_MS) {
        return cached.data;
    }
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('bad response');
    const data = await resp.json();
    fetchCache.set(url, { time: now, data });
    return data;
}

// --- Static list of 10 major cities shown on the home page ---
const worldCities = [
    { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
    { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456 },
    { name: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428 },
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
    { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780 },
    { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125 }
];

// --- Main weather lookup / render ---
async function getWeather(isRelang, explicitCoords) {
    const city = isRelang ? lastSearchedCity : document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    if (!city && !explicitCoords) {
        resultDiv.textContent = TEXT.searchPlaceholder;
        return;
    }
    if (!isRelang) lastSearchedCity = city;
    const coordsToUse = explicitCoords || (isRelang ? lastSearchedCoords : null);
    if (!isRelang) currentView = 'main';
    resultDiv.textContent = TEXT.loading;
    try {
        const openCageApiKey = 'e6c4ae76e7b84e66a3ebd42e00ed99b5';
        let lat, lon, geoData;
        if (coordsToUse) {
            lat = coordsToUse.lat;
            lon = coordsToUse.lon;
            geoData = await cachedFetchJson(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}&language=en&limit=1`);
            if (!geoData.results || !geoData.results.length) {
                resultDiv.textContent = TEXT.notFound;
                return;
            }
        } else {
            geoData = await cachedFetchJson(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${openCageApiKey}&language=en&limit=1`);
            if (!geoData.results || !geoData.results.length) {
                resultDiv.textContent = TEXT.notFound;
                return;
            }
            lat = geoData.results[0].geometry.lat;
            lon = geoData.results[0].geometry.lng;
        }
        lastSearchedCoords = { lat, lon };

        let displayName = geoData.results[0].formatted;
        let country = geoData.results[0].components.country || '';
        let cityNameForWiki = city || displayName.split(',')[0];

        const comp = geoData.results[0].components;
        cityNameForWiki = comp.city || comp.town || comp.village || comp.municipality || cityNameForWiki;
        displayName = cityNameForWiki;

        // Wikipedia summary + image (best effort)
        let cityDescription = '';
        try {
            const wikiData = await cachedFetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityNameForWiki)}`);
            cityDescription = wikiData.extract ? wikiData.extract : '';
        } catch (e) { /* ignore */ }
        let cityImageUrl = '';
        try {
            const wikiImgData = await cachedFetchJson(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(cityNameForWiki)}`);
            if (wikiImgData.items && wikiImgData.items.length > 0) {
                const imgItem = wikiImgData.items.find(item => item.type === 'image' && item.showInGallery !== false);
                if (imgItem && imgItem.srcset && imgItem.srcset.length > 0) {
                    cityImageUrl = imgItem.srcset[imgItem.srcset.length - 1].src;
                } else if (imgItem && imgItem.src) {
                    cityImageUrl = imgItem.src;
                }
            }
        } catch (e) { /* ignore */ }

        // 7-day forecast
        const meteoData = await cachedFetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7&lang=en`);
        if (!meteoData.daily) {
            resultDiv.textContent = TEXT.noForecast;
            return;
        }

        let cityInfoHtml = `<div class="city-info-panel" style="margin-bottom:18px;">
            <div class="city-header">
                <strong class="city-header-name">${displayName.split(',')[0]}</strong>
                <span class="city-header-country">${country}</span>
                <span id="cityFavouriteStarSlot"></span>
            </div>`;

        let dailyForecastHtml = '<div class="daily-sidebar-title">7-DAY FORECAST</div><div class="daily-sidebar-list">';
        for (let i = 0; i < meteoData.daily.time.length; i++) {
            const date = new Date(meteoData.daily.time[i]);
            const code = meteoData.daily.weathercode[i];
            const icon = getMeteoIcon(code);
            const condition = getMeteoCondition(code);
            const weekdayLabel = i === 0 ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'short' });
            const dateLabel = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
            const dayLabel = `${weekdayLabel}, ${dateLabel}`;
            dailyForecastHtml += `<div class="daily-sidebar-row">
                <span class="daily-sidebar-day">${dayLabel}</span>
                <span class="daily-sidebar-icon">${icon}</span>
                <span class="daily-sidebar-condition">${condition}</span>
                <span class="daily-sidebar-temps"><b>${Math.round(meteoData.daily.temperature_2m_max[i])}</b>/${Math.round(meteoData.daily.temperature_2m_min[i])}</span>
            </div>`;
        }
        dailyForecastHtml += '</div>';

        let currentWeatherHtml = '';
        let airConditionsHtml = '';
        let hourlyStripHtml = '';
        try {
            const currentData = await cachedFetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability,uv_index,temperature_2m,weathercode,is_day&forecast_days=2&timezone=auto&lang=en`);
            let humidity = '-';
            let realFeel = '-';
            let rainChance = '-';
            let uvIndex = '-';
            let currentIdx = -1;
            if (currentData.hourly && currentData.current_weather) {
                currentIdx = currentData.hourly.time.findIndex(t => t === currentData.current_weather.time);
                if (currentIdx === -1) {
                    // Fall back to matching by parsed Date value, in case the
                    // current_weather and hourly timestamps are formatted
                    // slightly differently (e.g. missing/extra seconds).
                    const currentTimeMs = new Date(currentData.current_weather.time).getTime();
                    currentIdx = currentData.hourly.time.findIndex(t => new Date(t).getTime() === currentTimeMs);
                }
                if (currentIdx === -1) {
                    // Last resort: pick the closest hourly entry to "now" in
                    // the city's own local time. The hourly "time" strings
                    // (with timezone=auto) have no timezone/"Z" suffix, so
                    // `new Date(t)` parses them using the *browser's* local
                    // timezone instead of the city's. To compare correctly,
                    // we build a Date from the city's local wall-clock parts
                    // (derived via utc_offset_seconds) the same way the
                    // browser would parse a timezone-less string, so both
                    // sides of the comparison line up.
                    const offsetSec = typeof currentData.utc_offset_seconds === 'number' ? currentData.utc_offset_seconds : 0;
                    const cityNowUtcBased = new Date(Date.now() + offsetSec * 1000);
                    const cityNowAsLocal = new Date(
                        cityNowUtcBased.getUTCFullYear(), cityNowUtcBased.getUTCMonth(), cityNowUtcBased.getUTCDate(),
                        cityNowUtcBased.getUTCHours(), cityNowUtcBased.getUTCMinutes(), cityNowUtcBased.getUTCSeconds()
                    );
                    const cityNowMs = cityNowAsLocal.getTime();
                    let closestIdx = -1;
                    let closestDiff = Infinity;
                    currentData.hourly.time.forEach((t, idx) => {
                        const diff = Math.abs(new Date(t).getTime() - cityNowMs);
                        if (diff < closestDiff) {
                            closestDiff = diff;
                            closestIdx = idx;
                        }
                    });
                    currentIdx = closestIdx;
                }
                if (currentIdx !== -1) {
                    if (currentData.hourly.relative_humidity_2m) humidity = currentData.hourly.relative_humidity_2m[currentIdx];
                    if (currentData.hourly.apparent_temperature) realFeel = Math.round(currentData.hourly.apparent_temperature[currentIdx]);
                    if (currentData.hourly.precipitation_probability) rainChance = currentData.hourly.precipitation_probability[currentIdx];
                    if (currentData.hourly.uv_index) uvIndex = Math.round(currentData.hourly.uv_index[currentIdx] * 10) / 10;
                }
            }
            if (currentData.current_weather) {
                const c = currentData.current_weather;
                const icon = getMeteoIcon(c.weathercode, c.is_day);
                const windDir = c.winddirection;
                let localTimeStr = '';
                if (typeof currentData.utc_offset_seconds === 'number') {
                    const localMs = Date.now() + currentData.utc_offset_seconds * 1000;
                    const localDate = new Date(localMs);
                    const hh = String(localDate.getUTCHours()).padStart(2, '0');
                    const mm = String(localDate.getUTCMinutes()).padStart(2, '0');
                    localTimeStr = `${hh}:${mm}`;
                } else if (typeof c.time === 'string' && c.time.includes('T')) {
                    localTimeStr = c.time.split('T')[1].slice(0, 5);
                }
                const localTimeHtml = localTimeStr
                    ? `<div class="hero-time">🕒 ${localTimeStr}</div>`
                    : '';
                currentWeatherHtml = `<div class="current-weather weather-hero">
                    ${localTimeHtml}
                    <div class="hero-icon">${icon}</div>
                    <div class="hero-temp">${Math.round(c.temperature)}°C</div>
                </div>`;

                airConditionsHtml = `<div class="air-conditions-grid">
                    <div class="air-item"><span class="air-label">Real Feel</span><span class="air-value">${realFeel !== '-' ? realFeel + '°C' : '-'}</span></div>
                    <div class="air-item air-item-wind"><span class="air-label">Wind</span><span class="air-value">${c.windspeed} ${TEXT.windUnit}</span><span class="air-subvalue">${windDirectionText(windDir)}</span></div>
                    <div class="air-item"><span class="air-label">Chance of rain</span><span class="air-value">${rainChance !== '-' ? rainChance + '%' : '-'}</span></div>
                </div>`;

                if (currentData.hourly && currentIdx !== -1) {
                    const h = currentData.hourly;
                    let stripItems = '';
                    const count = Math.min(8, h.time.length - currentIdx);
                    for (let i = currentIdx; i < currentIdx + count; i++) {
                        const hIcon = getMeteoIcon(h.weathercode[i], h.is_day ? h.is_day[i] : 1);
                        const hTemp = Math.round(h.temperature_2m[i]);
                        // Open-Meteo's "time" strings (with timezone=auto) are
                        // already expressed in the city's local time, without
                        // a timezone offset. Parsing them with `new Date(...)`
                        // and calling `.getHours()` would instead interpret
                        // them as the browser's local time, producing the
                        // wrong hour label (e.g. showing "01:00" after "Now"
                        // even if it's already past 1am in the city but not
                        // in the browser's timezone). Extract the hour
                        // directly from the string to keep it city-relative.
                        const hourOfDay = h.time[i].slice(11, 13);
                        const label = i === currentIdx ? TEXT.now : `${hourOfDay}:00`;
                        stripItems += `<div class="hourly-strip-item">
                            <div class="hourly-strip-label">${label}</div>
                            <div class="hourly-strip-icon">${hIcon}</div>
                            <div class="hourly-strip-temp">${hTemp}°</div>
                        </div>`;
                    }
                    hourlyStripHtml = `<div class="hourly-strip">${stripItems}</div>`;
                }
            }
        } catch (e) { /* ignore */ }
        cityInfoHtml += currentWeatherHtml;
        cityInfoHtml += airConditionsHtml;
        cityInfoHtml += hourlyStripHtml;
        cityInfoHtml += `<div class="forecast-mode-buttons">
            <button id="btnHourly" class="hours48-btn">${TEXT.hourly}</button>
        </div>`;
        if (cityImageUrl) {
            cityInfoHtml += `<div class="city-image-wrap"><img src="${cityImageUrl}" alt="${cityNameForWiki}" class="city-image"></div>`;
        }
        if (cityDescription) {
            cityInfoHtml += `<div class="city-description">${cityDescription}</div>`;
        }
        cityInfoHtml += '</div>';
        cityInfoHtml += `<div id="forecastContainer"></div>`;

        const mapHtml = `<div class="city-map-wrap" id="cityMapWrap">
            <iframe class="city-map" loading="lazy" title="${displayName.split(',')[0]}"
                src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat}%2C${lon}&zoom=12&mlat=${lat}&mlon=${lon}"></iframe>
        </div>`;

        const fullLayoutHtml = `<div class="city-detail-layout">
            <div class="city-detail-main">${cityInfoHtml}</div>
            <div class="city-detail-sidebar">
                <div class="daily-sidebar">${dailyForecastHtml}</div>
                ${mapHtml}
            </div>
        </div>`;
        resultDiv.innerHTML = fullLayoutHtml;

        const favouriteStarSlot = document.getElementById('cityFavouriteStarSlot');
        if (favouriteStarSlot) {
            const favouriteCity = { name: displayName.split(',')[0], country, lat, lon };
            favouriteStarSlot.appendChild(createFavouriteStar(favouriteCity));
        }

        function showCityMain() {
            currentView = 'main';
            document.querySelector('.city-info-panel').style.display = '';
            document.getElementById('forecastContainer').innerHTML = '';
            const mapWrap = document.getElementById('cityMapWrap');
            if (mapWrap) mapWrap.style.display = '';
            const sidebar = document.querySelector('.daily-sidebar');
            if (sidebar) sidebar.style.display = '';
        }
        function showBackButton(onClick) {
            const mapWrap = document.getElementById('cityMapWrap');
            if (mapWrap) mapWrap.style.display = 'none';
            const sidebar = document.querySelector('.daily-sidebar');
            if (sidebar) sidebar.style.display = 'none';
            let fc = document.getElementById('forecastContainer');
            let headerBar = document.createElement('div');
            headerBar.style = 'display:flex;align-items:center;position:relative;margin-bottom:14px;min-height:40px;';
            let backBtn = document.createElement('button');
            backBtn.textContent = TEXT.back;
            backBtn.style = 'margin:0;position:relative;z-index:1;';
            backBtn.onclick = onClick;
            let cityTitle = document.createElement('strong');
            cityTitle.style = 'font-size:1.8em;position:absolute;left:0;right:0;text-align:center;pointer-events:none;';
            cityTitle.textContent = displayName.split(',')[0];
            headerBar.appendChild(backBtn);
            headerBar.appendChild(cityTitle);
            fc.insertBefore(headerBar, fc.firstChild);
        }
        async function renderHourlyForecast() {
            currentView = 'hourly';
            document.querySelector('.city-info-panel').style.display = 'none';
            let hourlyHtml = `<b>${TEXT.hourly} (${TEXT.hours48}):</b><br>`;
            let lastDate = '';
            hourlyHtml += '<div class="hourly-grid">';
            const now = new Date();
            const queryStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const queryEndDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
            try {
                const hourlyData = await cachedFetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day&daily=sunrise,sunset&timezone=auto&start_date=${queryStartDate.toISOString().slice(0,10)}&end_date=${queryEndDate.toISOString().slice(0,10)}&lang=en`);
                if (!hourlyData.hourly) {
                    hourlyHtml += TEXT.noHourly;
                } else {
                    const offsetSec = typeof hourlyData.utc_offset_seconds === 'number' ? hourlyData.utc_offset_seconds : 0;
                    const cityNowUtcBased = new Date(Date.now() + offsetSec * 1000);
                    const cityNowForCompare = new Date(
                        cityNowUtcBased.getUTCFullYear(), cityNowUtcBased.getUTCMonth(), cityNowUtcBased.getUTCDate(),
                        cityNowUtcBased.getUTCHours(), cityNowUtcBased.getUTCMinutes(), cityNowUtcBased.getUTCSeconds()
                    );
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
                        const dateStr = hour.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        if (dateStr !== lastDate) {
                            hourlyHtml += `<div style="flex-basis:100%;text-align:center;font-weight:bold;font-size:1.1em;margin:10px 0 0 0;">${dateStr}</div>`;
                            lastDate = dateStr;
                        }
                        if (item.type === 'sunrise' || item.type === 'sunset') {
                            const label = item.type === 'sunrise' ? TEXT.sunrise : TEXT.sunset;
                            const emoji = item.type === 'sunrise' ? '🌅' : '🌇';
                            const timeStr = hour.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                            hourlyHtml += `<div class="sun-event animate-fade-in" style="flex-basis:100%;text-align:center;font-size:1em;margin:6px 0;color:#ff8a00;">${emoji} ${label} ${timeStr}</div>`;
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
                        hourlyHtml += `<div class="forecast-hour animate-fade-in">
                            <div style="font-size:1em;font-weight:bold;">${hour.getHours()}:00</div>
                            <span style="font-size:1.6em;">${iconUrl}</span>
                            <div style="font-size:1.2em;font-weight:bold;margin:2px 0;">${temp}°C</div>
                            <div style="font-size:0.9em;color:#2471a3;">${TEXT.wind}: ${windSpeed} ${TEXT.windUnit} ${windDirectionText(windDir)}</div>
                            <div style="font-size:0.9em;">${TEXT.humidity}: ${humidity}%</div>
                            <div style="font-size:0.9em;">${TEXT.precip}: ${precipitation} mm</div>
                        </div>`;
                    }
                }
                hourlyHtml += '</div>';
                document.getElementById('forecastContainer').innerHTML = hourlyHtml;
                showBackButton(() => { history.back(); });
            } catch (e) {
                document.getElementById('forecastContainer').innerHTML = TEXT.error;
                showBackButton(() => { history.back(); });
            }
        }
        showCityMain();
        document.getElementById('btnHourly').onclick = () => {
            renderHourlyForecast();
            pushCityViewState(lastSearchedCity, 'hourly', lat, lon);
        };
        window.__renderHourlyForecast = renderHourlyForecast;
        window.__showCityMain = showCityMain;
    } catch (err) {
        resultDiv.textContent = TEXT.error;
    }
}

// Open-Meteo weather code to icon
function getMeteoIcon(code, isDay) {
    const night = isDay === 0 || isDay === false;
    const emojiMapDay = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌦️', 56: '🌧️', 57: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
        80: '🌦️', 81: '🌦️', 82: '🌦️', 85: '❄️', 86: '❄️',
        95: '⛈️', 96: '⛈️', 99: '⛈️',
    };
    const emojiMapNight = {
        0: '🌙', 1: '🌙', 2: '☁️', 3: '☁️',
        51: '🌧️', 53: '🌧️', 55: '🌧️',
        80: '🌧️', 81: '🌧️', 82: '🌧️',
    };
    if (night && emojiMapNight[code] !== undefined) return emojiMapNight[code];
    return emojiMapDay[code] || '❔';
}

// Open-Meteo weather code to a short condition label (used in the 7-day list)
function getMeteoCondition(code) {
    const conditionMap = {
        0: 'Sunny', 1: 'Sunny', 2: 'Cloudy', 3: 'Cloudy',
        45: 'Foggy', 48: 'Foggy',
        51: 'Rainy', 53: 'Rainy', 55: 'Rainy', 56: 'Rainy', 57: 'Rainy',
        61: 'Rainy', 63: 'Rainy', 65: 'Rainy', 66: 'Rainy', 67: 'Rainy',
        71: 'Snowy', 73: 'Snowy', 75: 'Snowy', 77: 'Snowy',
        80: 'Rainy', 81: 'Rainy', 82: 'Rainy', 85: 'Snowy', 86: 'Snowy',
        95: 'Storm', 96: 'Storm', 99: 'Storm',
    };
    return conditionMap[code] || 'Unknown';
}


// --- Shared helpers for rendering a grid of city weather cards ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCityWeatherCardHtml(c, attempt) {
    try {
        const meteoData = await cachedFetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true&lang=en`);
        if (!meteoData.current_weather) throw new Error('no current_weather');
        const temp = Math.round(meteoData.current_weather.temperature);
        const code = meteoData.current_weather.weathercode;
        const icon = getMeteoIcon(code, meteoData.current_weather.is_day);
        const windSpeed = meteoData.current_weather.windspeed;
        const windDir = meteoData.current_weather.winddirection;
        const windDirText = windDirectionText(windDir);
        return `<div class="capital-card" data-city="${c.name}" data-country="${c.country || ''}" data-lat="${c.lat}" data-lon="${c.lon}">
            <div class="city">${c.name}${c.country ? ', ' + c.country : ''}</div>
            <div class="temp">${icon} ${temp}°C</div>
            <div class="desc">${windSpeed} km/h, Wind (${windDirText})</div>
        </div>`;
    } catch (e) {
        // Retry up to 3 times with a short backoff delay, since
        // firing requests for many cities at once can occasionally
        // trigger temporary rate limiting / network hiccups.
        if (attempt < 3) {
            await delay(300 * (attempt + 1));
            return fetchCityWeatherCardHtml(c, attempt + 1);
        }
        return '';
    }
}

function attachCardInteractions(grid) {
    Array.from(grid.querySelectorAll('.capital-card')).forEach(card => {
        const cityName = card.getAttribute('data-city');
        const country = card.getAttribute('data-country') || '';
        const cardLat = parseFloat(card.getAttribute('data-lat'));
        const cardLon = parseFloat(card.getAttribute('data-lon'));
        card.style.cursor = 'pointer';
        const star = createFavouriteStar({ name: cityName, country, lat: cardLat, lon: cardLon }, () => {
            if (typeof window.__refreshFavouritesSection === 'function') {
                window.__refreshFavouritesSection();
            }
        });
        card.appendChild(star);
        card.addEventListener('click', async function() {
            document.getElementById('cityInput').value = cityName;
            showSearch();
            await getWeather(false, { lat: cardLat, lon: cardLon });
            pushCityState(cityName, cardLat, cardLon);
        });
    });
}

// --- HOME PAGE: favourites section ---
async function showFavouritesWeather() {
    const section = document.getElementById('favouritesSection');
    const grid = document.getElementById('favouritesWeather');
    if (!section || !grid) return;
    const favourites = getFavourites();
    if (favourites.length === 0) {
        section.style.display = 'none';
        grid.innerHTML = '';
        return;
    }
    section.style.display = '';
    const promises = favourites.map((c, idx) =>
        delay(idx * 80).then(() => fetchCityWeatherCardHtml(c, 0))
    );
    const results = await Promise.all(promises);
    const successfulResults = results.filter(r => r);
    grid.innerHTML = successfulResults.join('');
    attachCardInteractions(grid);
}
window.__refreshFavouritesSection = showFavouritesWeather;

// --- HOME PAGE: static list of 10 major cities ---
async function showCapitalsWeather() {
    const grid = document.getElementById('capitalsWeather');
    const subtitleEl = document.getElementById('capitalsSubtitle');
    if (subtitleEl) {
        subtitleEl.style.display = '';
        subtitleEl.textContent = TEXT.subtitle;
    }
    grid.innerHTML = TEXT.loading;
    showFavouritesWeather();

    // Stagger the initial requests slightly instead of firing all 10 at
    // once, to reduce the chance of hitting a rate limit in the first place.
    const promises = worldCities.map((c, idx) =>
        delay(idx * 80).then(() => fetchCityWeatherCardHtml(c, 0))
    );
    const results = await Promise.all(promises);
    const successfulResults = results.filter(r => r);
    if (successfulResults.length === 0) {
        grid.innerHTML = '';
        return;
    }
    grid.innerHTML = successfulResults.join('');
    attachCardInteractions(grid);
}

// Show home / search sections
function showHome() {
    document.getElementById('homeSection').style.display = '';
    document.getElementById('searchSection').style.display = 'none';
}
function showSearch() {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('searchSection').style.display = '';
    setTimeout(() => { document.getElementById('cityInput').focus(); }, 200);
}

// --- URL routing (for browser Back/Forward) ---
function pushHomeState() {
    history.pushState({ view: 'home' }, '', '#home');
}
function pushCityState(cityName, lat, lon) {
    history.pushState({ view: 'city', city: cityName, lat, lon }, '', `#city/${encodeURIComponent(cityName)}`);
}
function pushCityViewState(cityName, viewName, lat, lon) {
    history.pushState({ view: viewName, city: cityName, lat, lon }, '', `#city/${encodeURIComponent(cityName)}/${viewName}`);
}
function replaceHomeState() {
    history.replaceState({ view: 'home' }, '', '#home');
}
function replaceCityState(cityName, lat, lon) {
    history.replaceState({ view: 'city', city: cityName, lat, lon }, '', `#city/${encodeURIComponent(cityName)}`);
}

window.addEventListener('popstate', async (e) => {
    const state = e.state;
    const stateCoords = (state && typeof state.lat === 'number' && typeof state.lon === 'number')
        ? { lat: state.lat, lon: state.lon }
        : null;
    if (!state || state.view === 'home') {
        document.getElementById('cityInput').value = '';
        showHome();
        showCapitalsWeather();
    } else if (state.view === 'city') {
        document.getElementById('cityInput').value = state.city;
        lastSearchedCity = state.city;
        showSearch();
        await getWeather(true, stateCoords);
    } else if (state.view === 'hourly') {
        document.getElementById('cityInput').value = state.city;
        lastSearchedCity = state.city;
        showSearch();
        await getWeather(true, stateCoords);
        if (typeof window.__renderHourlyForecast === 'function') {
            window.__renderHourlyForecast();
        }
    }
});

// Navigation / init
window.addEventListener('DOMContentLoaded', async () => {
    document.title = TEXT.title;
    const logoEl = document.querySelector('.logo');
    if (logoEl) logoEl.textContent = TEXT.title;
    document.getElementById('cityInput').placeholder = TEXT.searchPlaceholder;
    document.getElementById('searchBtn').textContent = TEXT.searchBtn;

    const initialHashMatch = location.hash.match(/^#city\/([^/]+)(?:\/(hourly))?$/);
    if (initialHashMatch) {
        const initialCity = decodeURIComponent(initialHashMatch[1]);
        const initialView = initialHashMatch[2];
        if (initialView) {
            history.replaceState({ view: initialView, city: initialCity }, '', `#city/${encodeURIComponent(initialCity)}/${initialView}`);
        } else {
            replaceCityState(initialCity);
        }
        document.getElementById('cityInput').value = initialCity;
        showSearch();
        await getWeather();
        if (initialView === 'hourly' && typeof window.__renderHourlyForecast === 'function') {
            window.__renderHourlyForecast();
        }
    } else {
        replaceHomeState();
        showHome();
        showCapitalsWeather();
    }
    document.getElementById('logo').onclick = (e) => {
        e.preventDefault();
        document.getElementById('cityInput').value = '';
        showHome();
        pushHomeState();
        showCapitalsWeather();
    };
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
});
