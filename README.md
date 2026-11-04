# Weather Forecast App 🌤️

A modern weather forecast web application built with vanilla JavaScript, HTML, and CSS. The app provides real-time weather information for cities worldwide, with an English-only interface.

**Live site:** https://zla71.github.io/Weather_app_website/

## Features

### 🌍 Core Functionality
- **Real-time Weather Data**: Displays current weather conditions including temperature, wind speed, wind direction, and humidity
- **7-Day Forecast**: Extended weather predictions with daily high/low temperatures and precipitation
- **Hourly Forecast**: Detailed 48-hour weather outlook with hourly temperature, wind, humidity, and precipitation data
- **City Search**: Search for any city worldwide and get instant weather information
- **Major Cities Display**: Homepage shows weather for 10 of the world's largest cities (Beijing, Tokyo, Moscow, Jakarta, Lima, Cairo, Seoul, Mexico City, London, Dhaka) — no location permission is ever requested
- **5-Minute Response Caching**: Weather/geocoding API responses are cached in memory for 5 minutes to avoid hitting free-tier API rate limits when revisiting the homepage or a city

### 🗺️ Enhanced City Information
- **Wikipedia Integration**: Displays city description and history fetched from Wikipedia API
- **City Images**: Automatically loads and displays images of searched cities
- **OpenStreetMap Embed**: Interactive map showing the exact location of the searched city

### 🎨 User Interface
- **Modern Dark Theme**: Clean, card-based layout with a dark navy background and red accents
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in effects for forecast cards and hourly data
- **Interactive Cards**: Clickable city cards for quick weather access, showing city, country, temperature, and wind
- **Intuitive Navigation**: Sticky header with search bar, logo click returns to home, browser Back/Forward supported via URL routing

## Technology Stack

### APIs Used
- **OpenCage Geocoding API**: Converts city names to coordinates
- **Open-Meteo API**: Free weather forecast data (current, daily, and hourly)
- **Wikipedia API**: City descriptions and images
- **OpenStreetMap**: Interactive map embedding

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox, grid, gradients, and animations
- **Vanilla JavaScript**: No external libraries - pure JS for all functionality

## Project Structure

```
Weather_app_website/
├── index.html          # Main HTML structure
├── app.js             # Core application logic and API calls
├── style.css          # Styling and responsive design
└── README.md          # This file
```

## How to Use

### Live site
The app is hosted on GitHub Pages:

https://zla71.github.io/Weather_app_website/

Pushes to `master` deploy automatically via `.github/workflows/deploy-github-pages.yml`. The first time, set **Settings → Pages → Source** to **GitHub Actions**.

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Zla71/Weather_app_website.git
```

2. Open `index.html` in your web browser (no build process required)

### Using the App

1. **Homepage**: See current weather for 10 of the world's largest cities
2. **Search**: Use the search bar at the top to find any city
3. **View Details**: Click on a city card or search for a new city to see:
   - Current weather with conditions
   - City information and description
   - Interactive map location
4. **Forecast Modes**: Switch between:
   - **7-Day Forecast**: Daily weather overview
   - **Hourly Forecast**: Detailed 48-hour predictions

## Key Functionality

### Weather Information Displayed

**Current Weather**:
- Temperature with emoji weather icon
- Wind speed and direction (cardinal/intercardinal compass points)
- Humidity percentage
- City name and country

**Daily Forecast**:
- Date and day of week
- Weather condition icon
- Maximum and minimum temperatures
- Daily precipitation amount

**Hourly Forecast**:
- Hour and time
- Temperature
- Weather condition icon
- Wind speed and direction
- Humidity percentage
- Precipitation amount

### Caching
To stay within the free API rate limits, all outgoing API requests (OpenCage, Open-Meteo, Wikipedia) go through a shared in-memory cache (`cachedFetchJson` in `app.js`) with a 5-minute TTL. Repeated requests for the same URL within that window are served from the cache instead of hitting the network again. Homepage city requests are also staggered and retried with backoff to reduce the chance of transient failures leaving a city card blank.

## API Integrations

### OpenCage Geocoding
- Converts city names to latitude/longitude coordinates
- Rate limit: 2,500 requests/day (free tier)

### Open-Meteo
- Provides weather forecast data
- No API key required
- Data includes: temperature, weather codes, precipitation, wind data

### Wikipedia
- Fetches city descriptions and summaries
- Provides city images and media

### OpenStreetMap
- Interactive map display for city locations
- Free and open-source

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS3 (Flexbox, Grid, Gradients)
- Fetch API
- LocalStorage (for future enhancements)

Tested on:
- Chrome/Chromium (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

## Responsive Design

- **Desktop**: Full-width display with 8-column hourly grid
- **Tablet (1400px)**: 4-column hourly grid
- **Medium (900px)**: 2-column hourly grid
- **Mobile (600px)**: Single column layout

## Code Architecture

### Main Components (`app.js`)

**Text & Caching**
- `TEXT` object: Centralized English UI strings
- `cachedFetchJson(url)`: Fetch wrapper with a 5-minute in-memory cache (`fetchCache`) to avoid rate-limit errors
- `windDirectionText(deg)`: Converts wind direction degrees to compass text

**Weather Fetching**
- `getWeather()`: Main function that:
  1. Takes user input (city name) or explicit coordinates (e.g. from a clicked city card)
  2. Uses OpenCage API to get coordinates / localized name
  3. Fetches Wikipedia data (description and images)
  4. Gets current and forecast weather from Open-Meteo
  5. Displays results with interactive buttons for 7-day and hourly forecasts

**Forecast Rendering**
- `renderDailyForecast()`: Shows 7-day forecast with cards
- `renderHourlyForecast()`: Displays 48-hour detailed forecast in grid layout

**Homepage**
- `worldCities`: Static list of the 10 major cities shown on the homepage
- `showCapitalsWeather()`: Loads and displays weather for all 10 cities (staggered requests + retries with backoff)
- `showHome()` / `showSearch()`: Navigation between homepage and search results
- URL routing (`pushHomeState`, `pushCityState`, `pushCityViewState`, `popstate` handler) keeps Back/Forward browser navigation in sync with the current view

### Styling Highlights (`style.css`)
- Dark navy theme with red accent color
- Animations: Smooth fade-in effects with transform transitions
- Grid system: Responsive hourly grid (8 → 4 → 2 → 1 columns)

## Future Enhancements

Potential improvements:
- [ ] Save favorite/recently viewed cities to local storage
- [ ] Weather alerts and notifications
- [ ] Air quality index display
- [ ] UV index information
- [ ] Historical weather data
- [ ] PWA support for offline access
- [ ] Light mode theme
- [ ] Multi-language support

## End-to-End Testing (Cypress)

The app has an automated Cypress test suite covering the homepage and the city search flow (7-day/hourly forecasts, back navigation, and logo navigation). All external APIs (OpenCage, Open-Meteo, Wikipedia) are stubbed with `cy.intercept`, so the tests run deterministically and offline.

### Setup
```bash
npm install
npx cypress install   # downloads the Cypress binary (requires internet access)
```

### Running the tests
```bash
npm test            # starts a local static server and runs Cypress headlessly
npm run cypress:open  # interactive mode (requires the app to be served, e.g. `npm start`)
```

Test files live in `cypress/e2e/`, fixtures in `cypress/fixtures/`, and shared setup (including the `cy.stubWeatherApis()` command) in `cypress/support/`.

## Notes

- No API key required for Open-Meteo
- OpenCage API key is embedded in the code (for demo purposes)
- Consider securing API keys in production environments
- Weather data updates according to API refresh intervals, subject to the 5-minute response cache described above
- The app never requests the user's geolocation; the homepage always shows the same static list of 10 cities

## Author

Created by **Zla71**

## License

This project is available on GitHub. Feel free to use and modify as needed.

---

**Last Updated**: 2026  
