describe('Language switcher', () => {
  beforeEach(() => {
    cy.stubWeatherApis();
    cy.visit('/');
  });

  it('defaults to Bulgarian', () => {
    cy.title().should('eq', 'Прогноза за времето');
    cy.get('#cityInput').should('have.attr', 'placeholder', 'Въведи град');
  });

  it('switches the UI to English', () => {
    cy.get('#langEn').click();
    cy.title().should('eq', 'Weather Forecast');
    cy.get('.logo').should('contain.text', 'Weather Forecast');
    cy.get('#cityInput').should('have.attr', 'placeholder', 'Enter city');
    cy.get('#searchBtn').should('contain.text', 'Search');
  });

  it('switches the UI to Spanish', () => {
    cy.get('#langEs').click();
    cy.title().should('eq', 'Pronóstico del tiempo');
    cy.get('.logo').should('contain.text', 'Pronóstico del tiempo');
    cy.get('#cityInput').should('have.attr', 'placeholder', 'Introduce ciudad');
    cy.get('#searchBtn').should('contain.text', 'Buscar');
  });

  it('switches back to Bulgarian', () => {
    cy.get('#langEn').click();
    cy.get('#langBg').click();
    cy.title().should('eq', 'Прогноза за времето');
    cy.get('#cityInput').should('have.attr', 'placeholder', 'Въведи град');
  });
});
