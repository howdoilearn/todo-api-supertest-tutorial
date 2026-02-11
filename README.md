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
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (file-based, easy cleanup)
- **Authentication:** JWT with bcrypt password hashing
- **Testing:** Jest + Supertest
- **API Specification:** OpenAPI 3.x

## Project Structure
```
todo-api-supertest-tutorial/
├── docs/
│   ├── REQUIREMENTS.md          # Complete API specification
│   ├── SESSION_NOTES.md         # Multi-session progress tracker
│   └── openapi.yaml             # OpenAPI 3.x specification
├── src/
│   ├── server.js                # Application entry point
│   ├── app.js                   # Express app configuration
│   ├── config/                  # Configuration files
│   ├── routes/                  # API route definitions
│   ├── controllers/             # Request handlers
│   ├── models/                  # Database models
│   └── middleware/              # Custom middleware (auth, validation, errors)
├── tests/
│   ├── integration/             # Supertest integration tests
│   ├── fixtures/                # Test data and fixtures
│   └── helpers/                 # Test utilities
├── prompts/                     # Structured prompt generators
├── .gitignore
├── package.json
└── README.md
```

## Tutorial Roadmap
1. ✅ **Setup** - Project structure and documentation
2. **OpenAPI** - Complete API specification with quality attributes
3. **Database** - Schema, migrations, and models
4. **Implementation** - Express app with quality-first patterns
5. **Testing** - Comprehensive Supertest integration tests

## Current Status

### Session 1 - Project Setup (✅ Complete)
- [x] Project structure defined
- [x] Documentation framework created
- [x] REQUIREMENTS.md with complete API spec
- [x] SESSION_NOTES.md for progress tracking
- [x] OpenAPI 3.x stub created
- [x] .gitignore configured

### Next Steps
1. Complete OpenAPI 3.x specification
2. Initialize npm project with dependencies
3. Create database schema and migrations
4. Build Express app structure with quality-first patterns
5. Implement Supertest integration tests

## Quick Start
(To be populated as project develops)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Quality-First Approach

This project emphasizes building quality in from the start:
- **Testability**: Code designed for easy testing without mocking
- **Validation**: Input validation at API boundaries
- **Error Handling**: Defensive programming with comprehensive error scenarios
- **Security**: JWT authentication, bcrypt hashing, input sanitization

## Contributing
This is a tutorial project. See SESSION_NOTES.md for development progress and next steps.

## License
MIT
