describe('Homepage - major cities weather', () => {
  beforeEach(() => {
    cy.stubWeatherApis();
    cy.visit('/');
  });

  it('shows the page title and search UI', () => {
    cy.title().should('eq', 'Weather Forecast');
    cy.get('.logo').should('contain.text', 'Weather Forecast');
    cy.get('#cityInput').should('be.visible').and('have.attr', 'placeholder', 'Enter city');
    cy.get('#searchBtn').should('be.visible').and('contain.text', 'Search');
  });

  it('renders a weather card for every city', () => {
    cy.get('#capitalsWeather .capital-card').should('have.length', 10);
    cy.get('#capitalsWeather .capital-card').first().within(() => {
      cy.get('.city').should('not.be.empty');
      cy.get('.temp').should('contain.text', '°C');
    });
  });

  it('opens the search view with the clicked city pre-filled', () => {
    cy.get('#capitalsWeather .capital-card').contains('.city', 'London').closest('.capital-card').click();
    cy.get('#homeSection').should('not.be.visible');
    cy.get('#searchSection').should('be.visible');
    cy.get('#cityInput').should('have.value', 'London');
    cy.get('#weatherResult .city-info-panel').should('be.visible');
  });
});
