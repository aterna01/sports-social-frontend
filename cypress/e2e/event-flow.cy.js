Cypress.on('uncaught:exception', (err) => {
  // Ignore hydration errors
  if (err.message.includes('Hydration failed')) {
    return false;
  }
});

describe('Full Event Flow: Create -> Join -> Block Rejoin', () => {
  const eventTitle = `Cypress Test Event ${Date.now()}`; // unique event name
  const eventSelector = `event-${eventTitle.replace(/\s+/g, '-').toLowerCase()}`;

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('user1@mail.com');
    cy.get('input[type="password"]').type('123123Strong!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/create-event');
  });

  it('creates a new event', () => {
    cy.get('input[name="title"]').type(eventTitle);
    cy.get('input[name="location"]').type('Test Park');
    cy.get('input[name="postCode"]').type('12345');
    cy.get('input[name="date"]').type('2025-08-01');
    cy.get('input[name="time"]').type('14:00');
    cy.get('textarea[name="description"]').type('Test description');
    cy.get('[data-cy="sport-filter"]').click();              // Open dropdown
    cy.get('ul[role="listbox"] li').contains('Basketball').click();  // Select option

    cy.get('button[type="submit"]').click();

    cy.contains(/event created|success/i).should('be.visible');
  });

  it('joins the newly created event', () => {
    cy.visit('/events');
  
    cy.get(`[data-cy="${eventSelector}"]`).within(() => {
      cy.contains('Join Event').click();
    });
  
    // // Wait for the join confirmation first
    cy.contains(/registered for the event/i, { timeout: 5000 }).should('exist');

    // Then check the button changed to "Already Joined"
    cy.get(`[data-cy="${eventSelector}"]`).within(() => {
      cy.contains('Already Joined').should('exist');
    });
  });
  
  it('prevents joining same event again', () => {
    cy.visit('/events');
  
    cy.get(`[data-cy="${eventSelector}"]`).within(() => {
      cy.contains('Join Event').should('not.exist');
      cy.contains('Already Joined').should('exist');
    });
  });

});
