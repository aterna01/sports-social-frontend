Cypress.on('uncaught:exception', (err) => {
  // Ignore hydration errors
  if (err.message.includes('Hydration failed')) {
    return false;
  }
});

describe('User Registration', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  it('registers a new user successfully', () => {
    cy.visit('/register');

    // Fill the form
    cy.get('input[type=email]').type(testEmail);
    cy.get('input[type=password]').type(password);

    // Submit
    cy.get('button').contains(/register/i).click();

    // Check success (change based on actual behavior)
    cy.contains(/was successfully registered/i).should('exist');

    // Optional: Wait for redirect
    cy.url().should('include', '/login');
  });

  it('shows error for existing email', () => {
    cy.visit('/register');

    // Try using the same email again
    cy.get('input[type=email]').type(testEmail);
    cy.get('input[type=password]').type(password);
    cy.get('button').contains(/register/i).click();

    // Check for error
    cy.contains(/already exists/i).should('exist');
  });
});
