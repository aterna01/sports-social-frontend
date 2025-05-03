describe('Home Page', () => {
  it('displays welcome content', () => {
    cy.visit('/');

    cy.contains('Welcome to Sports Social').should('be.visible');
    cy.contains('Find, create, and join local sports events near you.').should('be.visible');
  });
});
