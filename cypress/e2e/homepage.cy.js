describe('Homepage - European capitals weather', () => {
  beforeEach(() => {
    cy.stubWeatherApis();
    cy.visit('/');
  });

  it('shows the page title and search UI', () => {
    cy.title().should('eq', 'Прогноза за времето');
    cy.get('.logo').should('contain.text', 'Прогноза за времето');
    cy.get('#cityInput').should('be.visible').and('have.attr', 'placeholder', 'Въведи град');
    cy.get('#searchBtn').should('be.visible').and('contain.text', 'Търси');
  });

  it('renders a weather card for every capital', () => {
    cy.wait(new Array(10).fill('@nominatim'));
    cy.get('#capitalsWeather .capital-card').should('have.length', 10);
    cy.get('#capitalsWeather .capital-card').first().within(() => {
      cy.get('.city').should('not.be.empty');
      cy.get('.temp').should('contain.text', '°C');
    });
  });

  it('opens the search view with the clicked capital pre-filled', () => {
    cy.get('#capitalsWeather .capital-card').contains('.city', 'Лондон').closest('.capital-card').click();
    cy.get('#homeSection').should('not.be.visible');
    cy.get('#searchSection').should('be.visible');
    cy.get('#cityInput').should('have.value', 'Лондон');
    cy.get('#weatherResult .city-info-panel').should('be.visible');
  });
});
