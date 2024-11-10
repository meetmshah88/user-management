describe('Create User Form', () => {
    beforeEach(() => {
        cy.visit('/create-user');
    });

    it('should display validation errors for empty fields', () => {
        cy.get('button[type="submit"]').click();

        cy.contains("First name should contain only letters and be less than 100 characters.").should('be.visible');
        cy.contains("Last name should contain only letters and be less than 100 characters.").should('be.visible');
        cy.contains("Please enter a valid email address.").should('be.visible');
    });

    it('should show validation error for invalid email', () => {
        cy.get('input[name="firstName"]').type('Meet');
        cy.get('input[name="lastName"]').type('Shah');
        cy.get('input[name="emailId"]').type('invalid@email');
        cy.get('button[type="submit"]').click();

        cy.contains("Please enter a valid email address.").should('be.visible');
    });

    it('should submit the form successfully with valid inputs', () => {
        // Mock the API response
        cy.intercept('POST', '**/api/users', {
            statusCode: 200,
            body: { message: 'Form submitted successfully' },
        }).as('createUser');

        cy.get('input[name="firstName"]').type('Meet');
        cy.get('input[name="lastName"]').type('Shah');
        cy.get('input[name="emailId"]').type('meetshah@gmail.com');
        cy.get('button[type="submit"]').click();

        // Check if the success message appears
        cy.contains('Form submitted successfully').should('be.visible');

        // Verify the form was cleared after submission
        cy.get('input[name="firstName"]').should('have.value', '');
        cy.get('input[name="lastName"]').should('have.value', '');
        cy.get('input[name="emailId"]').should('have.value', '');
    });

    it('should display error message if API request fails', () => {
        // Mock API response with error
        cy.intercept('POST', '**/api/users', {
            statusCode: 400,
            body: { message: 'Error submitting form' },
        }).as('createUserError');

        cy.get('input[name="firstName"]').type('Meet');
        cy.get('input[name="lastName"]').type('Shah');
        cy.get('input[name="emailId"]').type('meetshah@gmail.com');
        cy.get('button[type="submit"]').click();

        // Check if error message appears
        cy.contains('Error submitting form').should('be.visible');
    });

    it('should create a user and verify it appears on the user list page', () => {
        const user = {
            firstName: 'Meet',
            lastName: 'Shah',
            emailId: 'meetshah@gmail.com',
        };

        // Mock the API response for creating a user
        cy.intercept('POST', '**/api/users', {
            statusCode: 201,
            body: { message: 'Form submitted successfully' },
        }).as('createUser');

        // Mock the API response for fetching the user list
        cy.intercept('GET', '**/api/users', (req) => {
            req.reply((res) => {
                res.send({
                    statusCode: 200,
                    body: [
                        {
                            id: 1,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            emailId: user.emailId,
                        }
                    ],
                });
            });
        }).as('fetchUsers');

        // Visit the "Create User" page
        cy.visit('/create-user'); 

        // Fill out the form fields
        cy.get('input[name="firstName"]').type(user.firstName);
        cy.get('input[name="lastName"]').type(user.lastName);
        cy.get('input[name="emailId"]').type(user.emailId);
        cy.get('button[type="submit"]').click();

        // Wait for the create user API call to complete
        cy.wait('@createUser');

        // Check if the success message appears
        cy.contains('Form submitted successfully').should('be.visible');

        // Navigate to the user list page
        cy.visit('/');

        // Wait for the user list API call to complete
        cy.wait('@fetchUsers');

        // Check if the new user appears in the first row of the list
        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(0).should('contain', user.firstName);
            cy.get('td').eq(1).should('contain', user.lastName);
            cy.get('td').eq(2).should('contain', user.emailId);
        });
    });
});
