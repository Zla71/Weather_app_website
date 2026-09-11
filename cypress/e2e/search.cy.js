describe('City search flow', () => {
  beforeEach(() => {
    cy.stubWeatherApis();
    cy.visit('/');
  });

  function searchFor(city) {
    cy.get('#cityInput').clear().type(city);
    cy.get('#searchBtn').click();
    cy.wait('@openCage');
  }

  it('shows weather details for a searched city', () => {
    searchFor('Paris');
    cy.get('#searchSection').should('be.visible');
    cy.get('#weatherResult .city-info-panel').should('contain.text', 'Paris');
    cy.get('#weatherResult .current-weather').should('contain.text', '°C');
    cy.get('#btnDaily').should('be.visible');
    cy.get('#btnHourly').should('be.visible');
  });

  it('shows a 7-day forecast and can navigate back', () => {
    searchFor('Paris');
    cy.get('#btnDaily').click();
    cy.get('#forecastContainer .forecast-day').should('have.length', 7);
    cy.get('.city-info-panel').should('not.be.visible');

    cy.get('#forecastContainer button').contains('Назад').click();
    cy.get('.city-info-panel').should('be.visible');
    cy.get('#forecastContainer').should('be.empty');
  });

  it('shows an hourly forecast and can navigate back', () => {
    searchFor('Paris');
    cy.get('#btnHourly').click();
    cy.get('#forecastContainer .forecast-hour').should('have.length.greaterThan', 0);
    cy.get('.city-info-panel').should('not.be.visible');

    cy.get('#forecastContainer button').contains('Назад').click();
    cy.get('.city-info-panel').should('be.visible');
  });

  it('returns to the homepage when the logo is clicked', () => {
    searchFor('Paris');
    cy.get('#searchSection').should('be.visible');
    cy.get('#logo').click();
    cy.get('#homeSection').should('be.visible');
    cy.get('#searchSection').should('not.be.visible');
  });

  it('shows a not-found message for an unknown city', () => {
    cy.intercept('GET', 'https://api.opencagedata.com/geocode/v1/json*', {
      results: [],
    }).as('openCageEmpty');
    cy.get('#cityInput').clear().type('Nonexistentcityxyz');
    cy.get('#searchBtn').click();
    cy.wait('@openCageEmpty');
    cy.get('#weatherResult').should('contain.text', 'Градът не е намерен.');
  });
});
