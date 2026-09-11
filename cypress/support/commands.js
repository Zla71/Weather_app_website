// Stubs every external API call the app makes so tests run fully offline
// and deterministically, without depending on third-party services.
Cypress.Commands.add('stubWeatherApis', () => {
  cy.fixture('nominatim.json').then((nominatim) => {
    cy.intercept('GET', 'https://nominatim.openstreetmap.org/search*', (req) => {
      req.reply(nominatim);
    }).as('nominatim');
  });

  cy.intercept('GET', 'https://api.open-meteo.com/v1/forecast*', (req) => {
    if (req.url.includes('daily=')) {
      req.reply({ fixture: 'openMeteoDaily.json' });
    } else if (req.url.includes('hourly=temperature_2m')) {
      // The hourly-forecast endpoint expects data within the next 48h from "now",
      // so it is generated relative to the current time instead of a static fixture.
      // Open-Meteo returns local (timezone=auto) time strings without a "Z" suffix,
      // and app.js parses them with `new Date(...)`, which interprets a string
      // without "Z" as local time. So we must build the string from local date
      // parts (not toISOString, which is UTC) to avoid a timezone-offset mismatch
      // that could push the generated hours outside the 48h filter window.
      const toLocalISOHour = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00:00`;
      };
      const hour1 = new Date(Date.now() + 60 * 60 * 1000);
      hour1.setMinutes(0, 0, 0);
      const hour2 = new Date(hour1.getTime() + 60 * 60 * 1000);
      req.reply({
        hourly: {
          time: [toLocalISOHour(hour1), toLocalISOHour(hour2)],
          weathercode: [1, 2],
          temperature_2m: [15, 16],
          wind_speed_10m: [10, 11],
          wind_direction_10m: [180, 190],
          relative_humidity_2m: [55, 60],
          precipitation: [0, 0.1],
        },
      });
    } else {
      req.reply({ fixture: 'openMeteoCurrent.json' });
    }
  }).as('openMeteo');

  cy.intercept('GET', 'https://api.opencagedata.com/geocode/v1/json*', {
    fixture: 'openCage.json',
  }).as('openCage');

  cy.intercept('GET', 'https://*.wikipedia.org/api/rest_v1/page/summary/*', {
    statusCode: 404,
    body: {},
  }).as('wikiSummary');

  cy.intercept('GET', 'https://*.wikipedia.org/api/rest_v1/page/media-list/*', {
    statusCode: 404,
    body: {},
  }).as('wikiMedia');
});
