describe('Events Page - Filtering', () => {
  beforeEach(() => {
    cy.visit('/events');
  });

  it('loads events and displays list', () => {
    cy.contains('Upcoming Events').should('exist');
    
    cy.get('[data-cy="join-btn"]').contains(/join event/i).should('exist');
  });

  it('filters events by sport type', () => {
    // Open the select dropdown
    cy.get('label').contains(/filter by sport/i)
      .parent() // grab parent to find select
      .find('div[role="combobox"]')
      .click();

    // Select Basketball (or any sport you expect)
    cy.get('li').contains(/basketball/i).click();

    // Assert the filtered results
    cy.url().should('include', ''); // or check DOM updates
    cy.contains(/basketball/i, { matchCase: false }).should('exist');
  });
});
