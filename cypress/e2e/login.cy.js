describe('Login Flow', () => {
  it('allows a user to log in and see Create Event page', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('user1@mail.com');
    cy.get('input[type="password"]').type('123123Strong!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/create-event');
    cy.contains('Create Event');
  });
});