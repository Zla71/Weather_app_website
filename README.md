# Weather Forecast App 🌤️

A modern, multilingual weather forecast web application built with vanilla JavaScript, HTML, and CSS. The app provides real-time weather information for cities worldwide, with support for **Bulgarian**, **English**, and **Spanish** languages.

## Features

### 🌍 Core Functionality
- **Real-time Weather Data**: Displays current weather conditions including temperature, wind speed, wind direction, and humidity
- **7-Day Forecast**: Extended weather predictions with daily high/low temperatures and precipitation
- **Hourly Forecast**: Detailed 48-hour weather outlook with hourly temperature, wind, humidity, and precipitation data
- **City Search**: Search for any city worldwide and get instant weather information
- **Capital Cities Display**: Homepage shows weather for major European capitals (London, Paris, Berlin, Madrid, Rome, Vienna, Budapest, Athens, Bucharest, Sofia)

### 🗺️ Enhanced City Information
- **Wikipedia Integration**: Displays city description and history fetched from Wikipedia API
- **City Images**: Automatically loads and displays images of searched cities
- **OpenStreetMap Embed**: Interactive map showing the exact location of the searched city

### 🌐 Multilingual Support
- **Bulgarian (Български)**: Full interface in Bulgarian with Cyrillic text
- **English**: Complete English translations
- **Spanish (Español)**: Full interface in Spanish
- **Language Switcher**: Easy toggle buttons in the header with flag emojis (🇧🇬 🇬🇧 🇪🇸)
- **Dynamic Translation**: Interface updates instantly when language is changed

### 🎨 User Interface
- **Modern Design**: Gradient background (blue to cyan) with clean card-based layouts
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in effects for forecast cards and hourly data
- **Interactive Cards**: Clickable capital city cards for quick weather access
- **Intuitive Navigation**: Sticky header with search bar, logo click returns to home

## Technology Stack

### APIs Used
- **OpenCage Geocoding API**: Converts city names to coordinates (supports multilingual queries)
- **Open-Meteo API**: Free weather forecast data with multilingual support
- **Wikipedia API**: City descriptions and images
- **OpenStreetMap**: Interactive map embedding
- **Nominatim (OSM)**: Alternative geocoding for capital cities

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

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Zla71/Weather_app_website.git
```

2. Open `index.html` in your web browser (no build process required)

### Using the App

1. **Homepage**: See current weather for major European capitals
2. **Search**: Use the search bar at the top to find any city
3. **View Details**: Click on a capital city card or search for a new city to see:
   - Current weather with conditions
   - City information and description
   - Interactive map location
4. **Forecast Modes**: Switch between:
   - **7-Day Forecast**: Daily weather overview
   - **Hourly Forecast**: Detailed 48-hour predictions
5. **Language**: Click the flag buttons (🇧🇬 🇬🇧 🇪🇸) to change the interface language

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

### Language Support
The app maintains a `LANGS` object containing translations for:
- UI elements (titles, buttons, placeholders)
- Weather descriptors
- Wind direction abbreviations (Cardinal directions in local language)

## API Integrations

### OpenCage Geocoding
- Converts city names to latitude/longitude coordinates
- Supports multilingual city name queries
- Rate limit: 2,500 requests/day (free tier)

### Open-Meteo
- Provides weather forecast data
- No API key required
- Supports 100+ languages
- Data includes: temperature, weather codes, precipitation, wind data

### Wikipedia
- Fetches city descriptions and summaries
- Provides city images and media
- Multilingual support (queries adjusted per selected language)

### OpenStreetMap & Nominatim
- Interactive map display for city locations
- Geocoding for capital cities
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

### Main Components

**Language Management** (`app.js` lines 1-100)
- `LANGS` object: Centralized translations for Bulgarian, English, and Spanish
- `setLang(lang)`: Updates entire UI to selected language
- `windDirectionText(deg)`: Converts wind direction degrees to localized compass text

**Weather Fetching** (`app.js` lines 159-360)
- `getWeather()`: Main function that:
  1. Takes user input (city name)
  2. Uses OpenCage API to get coordinates
  3. Fetches Wikipedia data (description and images)
  4. Gets current and forecast weather from Open-Meteo
  5. Displays results with interactive buttons for 7-day and hourly forecasts

**Forecast Rendering**
- `renderDailyForecast()`: Shows 7-day forecast with cards
- `renderHourlyForecast()`: Displays 48-hour detailed forecast in grid layout

**Homepage** (`app.js` lines 405-494)
- `showCapitalsWeather()`: Loads and displays 10 major European capitals
- `showHome()` / `showSearch()`: Navigation between homepage and search results

### Styling Highlights (`style.css`)
- Gradient background: `linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)`
- Color scheme: Primary blue (#2471a3), accent cyan (#89f7fe)
- Animations: Smooth fade-in effects with transform transitions
- Grid system: Responsive hourly grid (8 → 4 → 2 → 1 columns)

## Future Enhancements

Potential improvements:
- [ ] Save favorite cities to local storage
- [ ] Weather alerts and notifications
- [ ] Air quality index display
- [ ] UV index information
- [ ] Historical weather data
- [ ] PWA support for offline access
- [ ] Dark mode theme
- [ ] More language options

## Notes

- No API keys required for Open-Meteo and Nominatim
- OpenCage API key is embedded in the code (for demo purposes)
- Consider securing API keys in production environments
- Weather data updates according to API refresh intervals

## Author

Created by **Zla71**

## License

This project is available on GitHub. Feel free to use and modify as needed.

---

**Last Updated**: 2026  
**Branch**: feature/EOL-6-make-translations-to-english-spanish
