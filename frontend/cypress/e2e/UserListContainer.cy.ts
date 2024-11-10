describe("User List Page", () => {
  const apiUrl = "/api/users";

  // Sample users data for mocking
  const mockUsers = [
    { _id: "1", firstName: "Meet", lastName: "Shah", emailId: "meetshah@example.com" },
    { _id: "2", firstName: "Nisarg", lastName: "Shah", emailId: "nisargshah@example.com" },
  ];

  beforeEach(() => {
    // Intercept the API call and mock the response
    cy.intercept("GET", apiUrl, {
      statusCode: 200,
      body: mockUsers,
    }).as("getUsers");

    // Visit the user list page
    cy.visit("/");
  });

  it("should display the list of users after loading", () => {
    // Wait for the API call to complete
    cy.wait("@getUsers");

    // Check if the users table is displayed
    cy.get("table").should("be.visible");

    // Validate table headers
    cy.get("th").contains("First Name").should("exist");
    cy.get("th").contains("Last Name").should("exist");
    cy.get("th").contains("Email").should("exist");

    // Validate that the mock data is rendered correctly
    cy.get("tbody tr").should("have.length", mockUsers.length);
    mockUsers.forEach((user, index) => {
      cy.get("tbody tr").eq(index).within(() => {
        cy.contains(user.firstName).should("exist");
        cy.contains(user.lastName).should("exist");
        cy.contains(user.emailId).should("exist");
      });
    });
  });

  it("should display a loading indicator before data loads", () => {
    // Check for loading indicator
    cy.get("[data-testid=loading-indicator]").should("exist");
    cy.wait("@getUsers");
    cy.get("[data-testid=loading-indicator]").should("not.exist");
  });

  it("should display an error message if API request fails", () => {
    // Force the API request to fail
    cy.intercept("GET", apiUrl, {
      statusCode: 500,
      body: { message: "Failed to fetch users" },
    }).as("getUsersFail");

    cy.visit("/");
    cy.wait("@getUsersFail");

    // Check for error message on the page
    cy.contains("Failed to fetch users").should("be.visible");
  });

  it("should display a message if no users are found", () => {
    // Mock empty user list response
    cy.intercept("GET", apiUrl, {
      statusCode: 200,
      body: [],
    }).as("getEmptyUsers");

    cy.visit("/");
    cy.wait("@getEmptyUsers");

    // Check for 'No users found' message
    cy.contains("No users found").should("be.visible");
  });
});
