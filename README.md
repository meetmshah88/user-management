# Project Design Document

## 1. Project Overview

### 1.1. Purpose
This application is designed to provide a user-friendly interface for managing users. The solution includes:
- A frontend UI for user interaction.
- A backend API to handle user data and validation.
- A cloud-hosted MongoDB database to store user data.  

Using Docker, the application is packaged for easy deployment, ensuring consistency across different environments.

### 1.2. Components
- **Frontend**: Built with React and Vite, utilizing Material UI for styling, Axios for API communication, and Cypress for E2E testing.
- **Backend**: A Node.js and Express-based API that handles all business logic, interacts with MongoDB, and provides secure REST endpoints.
- **Database**: Cloud-hosted MongoDB to store user data, enabling high availability and scalability.

---

## 2. Features

### 2.1. User List
- **Purpose**: Displays a list of users.
- **Functionality**: Each user entry can include information like first name, last name and email. The newly added user will be shown as top as list is sorting by created date descending.  
- **UI Components**: A Material UI table that displays user data in rows.

### 2.2. Create User
- **Purpose**: Provides a form for adding new users.
- **Functionality**: Input fields for first name, last name, and email. Includes client-side validation (e.g., valid email format) and server-side validation same as front end with unique emails validation.
- **UI Components**: Material UI `TextField` for inputs and `Button` for submission.

### 2.3. Notifications
- **Purpose**: Alerts the user to the success or failure of actions.
- **UI Components**: Snackbar notifications displayed at the bottom of the screen, informing users of successful submissions, validation errors, and system errors.

---

## 3. Technical Architecture

### 3.1. Frontend
- **Tech Stack**: React with TypeScript, Vite for faster development builds, Material UI for UI components, Axios for making HTTP requests.
- **Folder Structure**:
  - `/components` – Reusable React components(can be) like table and top nav.
  - `/containers` – Main application screens like `UserList` and `CreateUser`.
  - `/types` – TypeScript interfaces and types for props, API responses, and form data.
  - `/constant` – Stores constant values for regex patterns, API URLs, etc.

### 3.2. Backend
- **Tech Stack**: Node.js with Express, Mongoose for MongoDB schema definitions and data validation.
- **Folder Structure**:
  - `/controllers` – Contains logic for handling API requests and responses.
  - `/models` – Mongoose models that define data structure and validation for user documents.
  - `/routes` – Express routes for handling HTTP requests like GET and POST.


#### Request Payload
The **Create User** API expects a JSON payload to add a new user to the system. This payload includes:

```json
{
  "firstName": "string (required, 1-100 characters)",
  "lastName": "string (required, 1-100 characters)",
  "emailId": "string (required, valid email format)"
}
```

- **Field Definitions**:
  - **firstName**: String, required, containing only letters and having a minimum of 1 and a maximum of 100 characters.
  - **lastName**: String, required, containing only letters and having a minimum of 1 and a maximum of 100 characters.
  - **emailId**: String, required, must be in a valid email format, and must be unique in the database.

### 3.3. Docker
- **Frontend Dockerfile**: Multi-stage build (first stage builds the application, second stage serves it through Nginx).
- **Backend Dockerfile**: Configured to run with minimal memory overhead. Connects to MongoDB using environment variables.
- **Docker Compose**: Orchestrates both frontend and backend services, linking containers.

---

## 4. Test Plan

### 4.1. Unit Tests

#### Frontend Unit Tests

Run below script to run the frontend test cases in `frontend` repo.
```bash
npm run test
```

**Testing Library**: Jest, React Testing Library
- **UserList Component**:
  - **Test Case 1**: should render table with user data.
  - **Test Case 2**: should render the correct table headers.
  - **Test Case 3**: should display error message when API request fails.
- **CreateUser Component**:
  - **Test Case 1**: should render the form with input fields.
  - **Test Case 2**: should validate and show error when fields are invalid.
- **TopNav Component**:
  - **Test Case 1**: should render TopNav with correct tabs and selected tab based on location.

#### Backend Unit Tests

Run below script to run the backend test cases in `backend` repo.
```bash
npm run test
```

**Testing Library**: Jest, Supertest
- **POST /api/users**:
  - **Test Case 1**: should return 400 if input validation fails.
  - **Test Case 2**: should return 400 if the user already exists.
  - **Test Case 3**: should return 400 if the first name is invalid.
  - **Test Case 4**: should return 400 if required fields are missing
- **GET /api/users**:
  - **Test Case 1**: should return a list of users when users are found
  - **Test Case 2**: should return an empty list if no users are found
  - **Test Case 3**: should call next with an error if User.find throws an error

### 4.2. End-to-End Tests

Make sure that the frontend server is running before you run Cypress tests.

Your running server of frontend (e.g. http://localhost:3000/) then the same needs to be configured in `cypress.config.ts` file with `baseUrl` attribute. 

To open Cypress and interact with the Test Runner UI:
```bash
npm run cypress:open
```

To run Cypress tests in headless mode (useful for CI pipelines):
```bash
npm run cypress:run
```

**Testing Tool**: Cypress
- **List Users E2E**:
    - **Test Scenario 1**: should display the list of users after loading.
    - **Test Scenario 2**: should display a loading indicator before data loads.
    - **Test Scenario 3**: should display an error message if API request fails creation.
    - **Test Scenario 4**: should display a message if no users are found
- **Create User E2E**:
    - **Test Scenario 1**: should display validation errors for empty fields
    - **Test Scenario 2**: should show validation error for invalid email
    - **Test Scenario 3**: should submit the form successfully with valid inputs
    - **Test Scenario 4**: should display error message if API request fails
    - **Test Scenario 5**: should create a user and verify it appears on the user list page

---

## 5. Validation Rules

### 5.1. Frontend Validation
- **First Name / Last Name**:
  - Only letters allowed.
  - Minimum length: 1 character.
  - Maximum length: 100 characters.
- **Email**:
  - Follows standard email format validation.
  - Unique check performed through API validation.

### 5.2. Backend Validation
- **Any Routes Handling**
  - Handle all the routes. If routes not available then server send 404 with Route not found message in json. 
- **Schema Validation**:
  - Mongoose schema enforces data types and required fields.
  - Custom validation for email format and uniqueness.
- **All Server Error Handling**:
  - Standardized error messages returned for invalid data and server errors.
- **Trimmed All String values in the request body**
  - Created a middleware which trimmed all the string values in the request body. 
- **Incoming Request body Guard**
  - No one can pass extra key value pair in the request body of Create user. Only expected/defined json can be accepted as request. 
- **All FirstName/LastName and email validations on backend too**
  - Validations on the fields are added. If it doesn't match then throws an error with Bad request. 
---

## 6. Implementation Steps

### 6.1. Frontend Development
1. **Setup Project**: Initialize a new Vite + React project with TypeScript.
2. **Install Dependencies**: Add Material UI, Axios, and React Router for UI, HTTP requests, and routing.
3. **Build Components**: Develop individual components for user listing, forms, and notifications.
4. **Implement API Calls**: Use Axios to communicate with backend API endpoints.
5. **Set Up Routing**: Use React Router to enable page navigation.

### 6.2. Backend Development
1. **Initialize Project**: Set up an Express project with TypeScript, Mongoose for MongoDB, and validation libraries.
2. **Define User Model**: Use Mongoose to enforce schema and validation rules for user data.
3. **Implement API Endpoints**: Create routes and controllers for user list and creation.
4. **Set Up Error Handling**: Standardize error responses for improved user experience.

---

## 7. Configuration and Deployment

### 7.1. Local Development

#### Prerequisites
- Node.js and npm
- Docker and Docker Compose
- Cloud MongoDB URI

### 7.2. Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd project-root
   ```

2. **Set Up Environment Variables**:
   Create `.env` files for backend directory with the following structure.
   **Backend `.env`**:
   ```env
   MONGO_URI=<your-cloud-mongodb-uri>
   PORT=5000
   ```

   Create `.env` files in root directory with the following structure for docker compose.
   **Docker Compose `.env`**:
   ```env
   MONGO_URI=<your-cloud-mongodb-uri>
   NODE_ENV=production
   ```

3. **Run Docker Compose**:
   Build and start all containers using Docker Compose.
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   - **Frontend**: Accessible at http://localhost:3000
   - **Backend**: Accessible at http://localhost:5000

---

## 8. Scripts and Commands

### 8.1. Docker Commands
The below command will take some time to build both the repo. Once it will be done then you can try to visit the above given urls for accessing the application. 

- **Build and Run Services**:
  ```bash
  docker-compose up --build
  ```
- **Stop Services**:
  ```bash
  docker-compose down
  ```

## 9. Run the Frontend and Backend Individually

### 9.1. Run command for starting Separate Frontend 
- **Start the frontend repo**:
  ```bash
  npm run local:watch
  ```
### 9.2. Run command for starting Separate Backend 
- **Start the backend repo**:
  ```bash
  npm run dev
  ```

---

## 9. README Setup Instructions

### Installation
1. **Install Docker and Docker Compose**: Ensure Docker and Docker Compose are installed on your machine.
2. **Clone the Repository**: Download the code by cloning the repository.
3. **Configure Environment Variables**: Define the necessary `.env` files for backend and docker compose.
4. **Run Docker Compose**: Use Docker Compose to build and run the services.
