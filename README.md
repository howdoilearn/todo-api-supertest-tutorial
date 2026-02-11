# Todo API - Supertest Tutorial

## Project Purpose
A professional Todo API built with quality-first design principles for comprehensive Supertest integration testing tutorials. This project demonstrates how to build testable, defensive code from the ground up using structured prompts and "vibe coding" methodology.

## Goals and Learning Objectives
- Build a production-quality REST API with proper separation of concerns
- Implement comprehensive Supertest integration testing patterns
- Demonstrate API-first design with OpenAPI 3.x specifications
- Practice quality-first development: testability, validation, error handling, security
- Learn multi-session development workflow with clear progress tracking

## Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite (file-based, easy cleanup)
- **Authentication:** JWT with bcrypt password hashing
- **Testing:** Jest + Supertest
- **API Specification:** OpenAPI 3.x

---

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- curl or similar HTTP client for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/todo-api-supertest-tutorial.git
cd todo-api-supertest-tutorial

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set JWT_SECRET
# Generate a strong secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Running the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3000`

### Verify Installation

```bash
# Health check
curl http://localhost:3000/

# Expected response:
# {"message":"Todo API - Supertest Tutorial","status":"running","version":"1.0.0"}
```

---

## Manual Testing

**Before Phase 2 (Supertest)**, verify the API works correctly using manual tests.

See **[MANUAL_TESTING.md](./MANUAL_TESTING.md)** for:
- Complete test sequence covering all endpoints
- Authentication and authorization tests
- Error handling verification
- Server log monitoring
- Database inspection commands
- Troubleshooting guide

**Quick test sequence:**
1. Register user
2. Login and get JWT token
3. Create todos
4. Retrieve todos (verify ownership)
5. Update and delete todos
6. Test error cases (401, 403, 404, etc.)

---

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",  # min 8 characters
  "name": "John Doe"
}

Response: 201 Created
{
  "user": { "id": 1, "email": "...", "name": "...", ... },
  "token": "eyJhbGci..."
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGci..."
}
```

### Todo Endpoints (Require Authentication)

**All todo endpoints require:**
```
Authorization: Bearer <jwt-token>
```

#### Create Todo
```bash
POST /api/todos
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",  # optional
  "completed": false,                   # optional, default false
  "dueDate": "2026-02-12T00:00:00.000Z" # optional
}

Response: 201 Created
{
  "id": 1,
  "userId": 1,
  "title": "Buy groceries",
  ...
}
```

#### Get All Todos
```bash
GET /api/todos
Authorization: Bearer <token>

Response: 200 OK
[ { "id": 1, "title": "...", ... }, ... ]
```

#### Get Single Todo
```bash
GET /api/todos/:id
Authorization: Bearer <token>

Response: 200 OK
{ "id": 1, "title": "...", ... }
```

#### Update Todo
```bash
PUT /api/todos/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "completed": true  # partial update allowed
}

Response: 200 OK
{ "id": 1, "completed": true, ... }
```

#### Delete Todo
```bash
DELETE /api/todos/:id
Authorization: Bearer <token>

Response: 204 No Content
```

### Error Responses

All errors follow this format:
```json
{
  "error": {
    "message": "Human readable message",
    "code": "ERROR_CODE",
    "details": []  // Optional field-level errors
  }
}
```

**Status Codes:**
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not resource owner)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

---

## Project Structure

```
todo-api-supertest-tutorial/
├── docs/
│   ├── REQUIREMENTS.md          # Complete API specification
│   ├── SESSION_NOTES.md         # Multi-session progress tracker
│   ├── CONTEXT.md               # Full project context
│   └── openapi.yaml             # OpenAPI 3.x specification
├── src/
│   ├── server.js                # Application entry point
│   ├── app.js                   # Express app configuration
│   ├── config/
│   │   └── database.js          # SQLite connection
│   ├── db/
│   │   └── schema.sql           # Database schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── todos.js             # Todo routes
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── todosController.js   # Todo CRUD logic
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Todo.js              # Todo model
│   └── middleware/
│       ├── authenticate.js      # JWT verification
│       ├── errorHandler.js      # Error handling
│       └── validation.js        # Validation middleware
├── tests/                       # (Phase 2 - Supertest tests)
│   └── (to be created)
├── data/
│   └── todos.db                 # SQLite database (auto-created)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── MANUAL_TESTING.md            # Manual test guide
└── README.md
```

---

## Development Workflow

### Logs & Monitoring

**Server logs show:**
- Incoming requests (method, path, status)
- Database operations
- Validation errors
- Authentication attempts

**Watch database changes:**
```bash
# Monitor database file
watch -n 1 'ls -lh data/todos.db'

# Query database directly
sqlite3 data/todos.db "SELECT * FROM users;"
sqlite3 data/todos.db "SELECT * FROM todos;"
```

### Database Reset

```bash
# Remove database (server will recreate on restart)
rm -rf data/

# Restart server
npm run dev
```

---

## Testing

### Phase 1: Manual Testing (Current)
See [MANUAL_TESTING.md](./MANUAL_TESTING.md) for comprehensive manual test guide.

### Phase 2: Supertest Integration Tests (Coming)
```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

---

## Tutorial Roadmap

1. ✅ **Setup** - Project structure and documentation
2. ✅ **OpenAPI** - Complete API specification with quality attributes
3. ✅ **Database** - Schema and models with SQLite
4. ✅ **Implementation** - Express app with quality-first patterns
5. ⏳ **Testing** - Comprehensive Supertest integration tests (Phase 2)

---

## Quality-First Approach

This project emphasizes building quality in from the start:

### Testability
- Code designed for easy testing without mocking
- Clear separation of concerns (routes, controllers, models)
- Synchronous database operations for predictable tests

### Validation
- Input validation at API boundaries (express-validator)
- Field-level error messages
- Boundary condition checks

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- Appropriate HTTP status codes
- No stack traces exposed

### Security
- JWT authentication with 24-hour expiry
- bcrypt password hashing (10 rounds)
- Ownership verification on all todo operations
- Input sanitization
- No sensitive data in error responses

---

## Git Tags

### v1.0.0-phase1-backend
**Status:** Ready for manual testing  
**Contains:**
- Complete backend API (7 endpoints)
- JWT authentication
- SQLite database
- Input validation
- Error handling
- Ownership verification
- OpenAPI specification
- Manual testing guide

**Use this tag to:**
- Start with a working backend
- Follow Phase 2 testing tutorial
- Reference implementation patterns

```bash
git checkout v1.0.0-phase1-backend
```

### v2.0.0-phase2-testing (Coming)
Will include complete Supertest integration test suite.

---

## Documentation

- **[MANUAL_TESTING.md](./MANUAL_TESTING.md)** - Complete manual test guide
- **[docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)** - Detailed API requirements
- **[docs/CONTEXT.md](./docs/CONTEXT.md)** - Full project context
- **[docs/openapi.yaml](./docs/openapi.yaml)** - OpenAPI 3.x specification
- **[docs/SESSION_NOTES.md](./docs/SESSION_NOTES.md)** - Development progress

---

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001
```

### Database Errors
```bash
# Ensure data directory exists with correct permissions
mkdir -p data
chmod 755 data
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Issues
- Verify JWT_SECRET is set in .env
- Check token is correctly copied (no spaces)
- Token expires after 24 hours - re-login for fresh token

See [MANUAL_TESTING.md](./MANUAL_TESTING.md#common-issues--solutions) for more troubleshooting.

---

## Contributing

This is a tutorial project. See [docs/SESSION_NOTES.md](./docs/SESSION_NOTES.md) for development progress and next steps.

---

## License

MIT
