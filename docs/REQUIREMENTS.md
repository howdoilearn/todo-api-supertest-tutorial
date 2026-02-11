# API Requirements Specification

## Functional Requirements

- Basic CRUD operations
- User authentication (register/login)
- Simple validation
- Error handling

## API Endpoints

### POST /api/auth/register
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email format)",
    "password": "string (required, min 8 characters)",
    "name": "string (required, 2-50 characters)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Validation errors (missing fields, invalid format)
  - 409 Conflict: Email already exists

### POST /api/auth/login
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email format)",
    "password": "string (required)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Validation errors (missing fields)
  - 401 Unauthorized: Invalid credentials

### POST /api/todos
- **Authentication**: Required (JWT token)
- **Request Body**:
  ```json
  {
    "title": "string (required, 1-200 characters)",
    "description": "string (optional, max 1000 characters)",
    "dueDate": "string (optional, ISO datetime format)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Validation errors
  - 401 Unauthorized: Missing or invalid token

### GET /api/todos
- **Authentication**: Required (JWT token)
- **Query Parameters**: None
- **Success Response** (200 OK):
  ```json
  [
    {
      "id": 1,
      "userId": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "dueDate": "2025-12-31T23:59:59.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
  ```
- **Error Responses**:
  - 401 Unauthorized: Missing or invalid token

### GET /api/todos/:id
- **Authentication**: Required (JWT token)
- **Path Parameters**: id (integer)
- **Success Response** (200 OK):
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
  ```
- **Error Responses**:
  - 401 Unauthorized: Missing or invalid token
  - 403 Forbidden: Todo belongs to another user
  - 404 Not Found: Todo does not exist

### PUT /api/todos/:id
- **Authentication**: Required (JWT token)
- **Path Parameters**: id (integer)
- **Request Body**:
  ```json
  {
    "title": "string (optional, 1-200 characters)",
    "description": "string (optional, max 1000 characters)",
    "completed": "boolean (optional)",
    "dueDate": "string (optional, ISO datetime format, null to clear)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Buy groceries - Updated",
    "description": "Milk, eggs, bread, cheese",
    "completed": true,
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Validation errors
  - 401 Unauthorized: Missing or invalid token
  - 403 Forbidden: Todo belongs to another user
  - 404 Not Found: Todo does not exist

### DELETE /api/todos/:id
- **Authentication**: Required (JWT token)
- **Path Parameters**: id (integer)
- **Success Response** (204 No Content): Empty body
- **Error Responses**:
  - 401 Unauthorized: Missing or invalid token
  - 403 Forbidden: Todo belongs to another user
  - 404 Not Found: Todo does not exist

## Data Models

### Users Table
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- email: TEXT UNIQUE NOT NULL
- password: TEXT NOT NULL (bcrypt hashed)
- name: TEXT NOT NULL
- createdAt: TEXT (ISO datetime)
- updatedAt: TEXT (ISO datetime)

### Todos Table
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- userId: INTEGER NOT NULL (FOREIGN KEY → users.id)
- title: TEXT NOT NULL
- description: TEXT
- completed: INTEGER DEFAULT 0 (0 = false, 1 = true)
- dueDate: TEXT (ISO datetime, nullable)
- createdAt: TEXT (ISO datetime)
- updatedAt: TEXT (ISO datetime)

## Authentication & Authorization

- JWT (JSON Web Tokens) with bcrypt password hashing
- Token format: JWT with payload { userId, email }
- Token expiration: 24 hours
- Token storage: Client manages (localStorage/sessionStorage)
- Authorization rules:
  - Users can only access their own todos
  - Attempting to access another user's todo returns 403 Forbidden
- Security considerations:
  - Passwords hashed with bcrypt (10 rounds)
  - JWTs signed with secret key from environment variable
  - No sensitive data in error messages

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- 200: Success (GET, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (not resource owner)
- 404: Not Found
- 409: Conflict (duplicate email)
- 500: Internal Server Error

## Non-Functional Requirements

- **Database**: SQLite (file-based, no Docker needed)
- **Testing**: Supertest integration testing with Jest
- **Code Quality**: 
  - Separation of concerns (routes, controllers, models, middleware)
  - Express middleware pattern for auth, validation, error handling
  - Async/await for database operations
  - Clear error messages
- **Documentation**: OpenAPI spec (required)

## Out of Scope

Features NOT included in this project:
- Password reset flows
- Email verification
- Rate limiting
- Pagination
- Todo sharing/collaboration
- File attachments
- Todo categories or tags
- Soft deletes
- User profile management beyond registration
