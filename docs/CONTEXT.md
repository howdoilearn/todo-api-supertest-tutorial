# Project Context - Complete Reference

This document contains everything needed to understand and continue working on this project.

**Reading time:** ~15 minutes  
**Last updated:** 2026-02-11

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Current Status](#current-status)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Critical Decisions](#critical-decisions)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [File Structure](#file-structure)
9. [Quality Standards](#quality-standards)
10. [Common Pitfalls](#common-pitfalls)
11. [Working with Ian](#working-with-ian)
12. [MCP Filesystem Requirements](#mcp-filesystem-requirements)

---

## 🎯 Project Overview

**Name:** todo-api-supertest-tutorial  
**Purpose:** Production-quality Todo API with comprehensive Supertest integration testing  
**Goal:** Teach Supertest testing patterns through a complete, working API

**Methodology:**
- Quality-first approach (testability built in from start)
- API-first design (OpenAPI specification drives implementation)
- Documentation-driven development (requirements before code)
- Multi-session friendly (can pause/resume work easily)

**Audience:** Intermediate developers familiar with Node.js/Express basics

---

## ✅ Current Status

### Phase 1: Backend API - 100% COMPLETE ✅

**Completed:**
- Project setup and documentation
- OpenAPI 3.x specification (all 7 endpoints)
- Database schema (SQLite with Users + Todos)
- User model with bcrypt hashing
- Todo model with full CRUD
- Express app structure (app.js, server.js)
- All routes with validation (auth.js, todos.js)
- All controllers (authController, todosController)
- All middleware (authenticate, errorHandler, validation)
- Tested and verified working

**Testing Status:**
- Server starts: ✅
- User registration: ✅
- User login: ✅
- JWT token generation: ✅
- Todo creation with auth: ✅
- Todo retrieval: ✅

### Phase 2: Supertest Testing - NOT STARTED ❌

**To be built:**
- Test infrastructure setup
- Authentication tests (register, login, tokens)
- CRUD operation tests
- Validation error tests
- Authorization tests (ownership)
- Integration tests (complete workflows)

---

## 🛠️ Tech Stack (FINAL - Do Not Change)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** SQLite (better-sqlite3) - synchronous API
- **Authentication:** JWT (jsonwebtoken) - 24 hour expiry
- **Password Hashing:** bcrypt - 10 rounds
- **Validation:** express-validator

### Testing
- **Test Framework:** Jest
- **HTTP Testing:** Supertest
- **Coverage:** Built into Jest

### Development
- **Hot Reload:** nodemon
- **Environment:** dotenv

### Why These Choices?

**SQLite vs PostgreSQL:**
- No Docker needed
- File-based (simple for tutorials)
- Perfect for learning/testing
- Not production-scale, but realistic

**JWT vs Sessions:**
- Stateless (easier to test)
- No session store needed
- Industry standard for APIs
- Works with mobile clients

**Supertest vs Alternatives:**
- Purpose-built for HTTP testing
- Works with Express natively
- Better than Playwright for API testing
- Industry standard

---

## 🏗️ Architecture

### Layered Structure

```
Request → Routes → Middleware → Controllers → Models → Database
                     ↓
                Error Handler
```

**Separation of Concerns:**
- **Routes:** Define endpoints, attach validation
- **Middleware:** Authentication, error handling
- **Controllers:** Business logic, orchestration
- **Models:** Database operations only
- **Database:** SQLite file + schema

### Data Flow Examples

**User Registration:**
```
POST /api/auth/register
→ Route (validation)
→ Controller.register()
→ User.create() (hash password)
→ Database INSERT
→ Generate JWT
→ Response with user + token
```

**Get Todos:**
```
GET /api/todos
→ Route
→ Auth Middleware (verify JWT)
→ Controller.getTodos()
→ Todo.findByUserId()
→ Database SELECT WHERE userId
→ Response with todos array
```

---

## 🔑 Critical Decisions (FINAL)

These decisions are **locked in** and implemented. Do NOT change them.

### 1. Database: SQLite (better-sqlite3)

**Decision:** Use SQLite with synchronous API  
**Rationale:** 
- No Docker dependency
- Simple file-based storage
- Synchronous API is simpler for tutorials
- Real enough for learning patterns

**Implementation:**
- Database file: `./data/todos.db`
- Schema: `src/db/schema.sql`
- Connection: `src/config/database.js`
- Models: Synchronous methods (not async)

### 2. Authentication: JWT

**Decision:** JWT tokens with 24-hour expiry  
**Rationale:**
- Stateless (no session store)
- Testable (token in header)
- Industry standard
- Mobile-friendly

**Implementation:**
- Secret: Environment variable `JWT_SECRET`
- Expiry: 24 hours (configurable)
- Payload: `{ userId, email }`
- Format: `Bearer <token>` in Authorization header

### 3. Password Hashing: bcrypt (10 rounds)

**Decision:** bcrypt with 10 salt rounds  
**Rationale:**
- Industry standard
- Proven security
- Good balance of speed/security

**Implementation:**
- Hash on user creation
- Verify on login
- Never return passwords in responses

### 4. Validation: express-validator

**Decision:** Use express-validator for all input validation  
**Rationale:**
- Express middleware pattern
- Declarative validation rules
- Good error messages

**Implementation:**
- Validation rules in routes
- handleValidationErrors middleware
- Consistent error format

### 5. Error Handling: Centralized Middleware

**Decision:** Single error handler middleware  
**Rationale:**
- Consistent error responses
- Single source of truth
- Easier to test

**Implementation:**
```javascript
{
  error: {
    message: "Human readable message",
    code: "ERROR_CODE",
    details: [...]  // Optional validation details
  }
}
```

### 6. Completed Field: Integer Storage

**Decision:** Store as 0/1 integer, convert to boolean on read  
**Rationale:**
- SQLite doesn't have native boolean
- Clear representation
- Type coercion on retrieval

**Implementation:**
- Database: `completed INTEGER DEFAULT 0`
- Model: Convert to Boolean on read
- API: Accept/return boolean

### 7. Tutorial Scope: Backend + Supertest ONLY

**Decision:** Build Backend API + Supertest tests. Document but don't build frontend/Playwright.  
**Rationale:**
- Focus creates better tutorial
- Maintainability (each extension = work)
- Clear positioning (API testing tutorial)
- Extension points documented for community

**Out of Scope:**
- Frontend (Vue/React)
- E2E testing (Playwright)
- Advanced features (pagination, search, file uploads)
- Deployment (Docker, CI/CD)

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
```

**Constraints:**
- Email must be unique
- Password stored as bcrypt hash
- Timestamps in ISO 8601 format

### Todos Table

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0,  -- 0 = false, 1 = true
  dueDate TEXT,  -- ISO 8601, nullable
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_todos_userId ON todos(userId);
CREATE INDEX idx_todos_completed ON todos(completed);
```

**Constraints:**
- userId must reference valid user
- CASCADE delete (deleting user deletes their todos)
- completed is 0 or 1 (converted to boolean in code)

### Foreign Key Behavior

```sql
-- Foreign keys are ENABLED
db.pragma('foreign_keys = ON');
```

**Implications:**
- Can't create todo for non-existent user
- Deleting user deletes all their todos
- Database enforces referential integrity

---

## 🔌 API Endpoints (All 7)

### Authentication (Public)

#### POST /api/auth/register
**Purpose:** Create new user account  
**Auth:** None (public)  
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",  // min 8 chars
  "name": "John Doe"
}
```
**Success (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-11T06:00:00.000Z",
    "updatedAt": "2026-02-11T06:00:00.000Z"
  },
  "token": "eyJhbGci..."
}
```
**Errors:**
- 400: Validation errors
- 409: Email already exists

#### POST /api/auth/login
**Purpose:** Authenticate and get JWT token  
**Auth:** None (public)  
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Success (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-11T06:00:00.000Z",
    "updatedAt": "2026-02-11T06:00:00.000Z"
  },
  "token": "eyJhbGci..."
}
```
**Errors:**
- 400: Validation errors
- 401: Invalid credentials

### Todos (All Require Authentication)

**Authentication Required:**
```
Authorization: Bearer <jwt-token>
```

#### POST /api/todos
**Purpose:** Create new todo  
**Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",  // optional
  "completed": false,  // optional, default false
  "dueDate": "2026-02-12T00:00:00.000Z"  // optional
}
```
**Success (201):**
```json
{
  "id": 1,
  "userId": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "dueDate": "2026-02-12T00:00:00.000Z",
  "createdAt": "2026-02-11T06:00:00.000Z",
  "updatedAt": "2026-02-11T06:00:00.000Z"
}
```

#### GET /api/todos
**Purpose:** Get all user's todos  
**Success (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Buy groceries",
    "completed": false,
    ...
  }
]
```

#### GET /api/todos/:id
**Purpose:** Get single todo  
**Success (200):** Single todo object  
**Errors:**
- 401: Not authenticated
- 403: Not resource owner
- 404: Todo not found

#### PUT /api/todos/:id
**Purpose:** Update todo  
**Request:** Partial update allowed
```json
{
  "completed": true
}
```
**Success (200):** Updated todo object  
**Errors:**
- 400: Validation errors
- 401: Not authenticated
- 403: Not resource owner
- 404: Todo not found

#### DELETE /api/todos/:id
**Purpose:** Delete todo  
**Success (204):** No content  
**Errors:**
- 401: Not authenticated
- 403: Not resource owner
- 404: Todo not found

---

## 📂 File Structure

```
todo-api-supertest-tutorial/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_PLAN.md
├── NEW-CHAT-START-HERE.md
├── NEW-CHAT-PROMPT-TEMPLATE.md
├── docs/
│   ├── CONTEXT.md (this file)
│   ├── REQUIREMENTS.md
│   ├── SESSION_NOTES.md
│   ├── FILES-OVERVIEW.md
│   ├── CONVERSATION-STRATEGY.md
│   ├── LINKEDIN-ARTICLE.md
│   └── openapi.yaml
├── prompts/
│   ├── README.md
│   ├── MCP-GUIDANCE-TEMPLATE.txt
│   └── *.html
├── src/
│   ├── app.js                      # Express app config
│   ├── server.js                   # Server entry point
│   ├── config/
│   │   └── database.js             # SQLite connection
│   ├── db/
│   │   └── schema.sql              # Database schema
│   ├── models/
│   │   ├── User.js                 # User model
│   │   └── Todo.js                 # Todo model
│   ├── routes/
│   │   ├── auth.js                 # Auth routes + validation
│   │   └── todos.js                # Todo routes + validation
│   ├── controllers/
│   │   ├── authController.js       # Register, login
│   │   └── todosController.js      # CRUD operations
│   └── middleware/
│       ├── authenticate.js         # JWT verification
│       ├── errorHandler.js         # Error handling
│       └── validation.js           # Validation errors
├── tests/ (TO BE CREATED)
│   ├── setup.js
│   ├── auth.test.js
│   ├── todos.test.js
│   ├── validation.test.js
│   └── integration.test.js
└── data/
    └── todos.db (auto-created)
```

---

## ✨ Quality Standards

### Code Organization

**Separation of Concerns:**
- Routes: Define endpoints only
- Controllers: Business logic
- Models: Database operations only
- Middleware: Cross-cutting concerns

**Example:**
```javascript
// ❌ BAD - Logic in route
router.post('/todos', async (req, res) => {
  const todo = await db.query(...);
  // business logic here
});

// ✅ GOOD - Delegated to controller
router.post('/todos', validate, createTodo);
```

### Async/Await

**Controllers:** Always async
```javascript
async function register(req, res, next) {
  try {
    const user = await User.create(...);
    // ...
  } catch (error) {
    next(error);
  }
}
```

**Models:** Synchronous (SQLite better-sqlite3)
```javascript
static create({ email, password, name }) {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO...');
  const result = stmt.run(...);
  return { id: result.lastInsertRowid, ... };
}
```

### Validation

**All routes have validation:**
```javascript
router.post('/todos',
  [
    body('title').trim().isLength({ min: 1, max: 200 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('completed').optional().isBoolean(),
    body('dueDate').optional().isISO8601()
  ],
  handleValidationErrors,
  createTodo
);
```

### Error Handling

**Consistent format:**
```javascript
{
  error: {
    message: "Todo not found",
    code: "TODO_NOT_FOUND",
    details: []  // Optional validation details
  }
}
```

**HTTP Status Codes:**
- 200: Success (GET, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation)
- 401: Unauthorized (auth missing/invalid)
- 403: Forbidden (not owner)
- 404: Not Found
- 409: Conflict (duplicate email)
- 500: Internal Error

### Security

**Passwords:**
- Never returned in responses
- Always bcrypt hashed (10 rounds)
- Verified with bcrypt.compare()

**JWT:**
- Secret from environment variable
- Token expiry enforced
- Proper verification in middleware

**Ownership:**
- Every todo operation checks userId
- 403 Forbidden if not owner
- Can't access other users' todos

---

## 🚫 Common Pitfalls (Avoid These)

### DO NOT:

1. **Change Tech Stack**
   - Don't suggest PostgreSQL, MongoDB, MySQL
   - Don't suggest sessions, OAuth
   - Don't suggest Mocha, Ava, Tape

2. **Add Features**
   - Don't add pagination
   - Don't add search/filtering
   - Don't add todo categories
   - Don't add file uploads
   - Don't add password reset
   - Don't add email verification

3. **Create Frontend**
   - Don't suggest Vue/React
   - Don't create HTML/CSS
   - Don't suggest Playwright for API testing

4. **Use Wrong Tools**
   - Don't use bash_tool for file creation
   - Don't use callbacks (use async/await)
   - Don't use manual SQL strings (use prepared statements)

5. **Skip Validation**
   - All routes MUST have validation
   - All errors MUST use consistent format
   - All ownership MUST be checked

6. **Ask Permission for Documented Decisions**
   - Tech stack is final
   - Architecture is decided
   - Just implement per docs

### DO:

1. **Use filesystem:write_file** for all files
2. **Follow existing patterns** in the code
3. **Batch file creation** (create all test files at once)
4. **Move forward decisively** per documentation
5. **Check ownership** on all todo operations
6. **Use consistent error format** everywhere

---

## 👤 Working with Ian

### Communication Preferences

**Ian prefers:**
- Concise updates (results not process)
- Batch operations (not one-by-one)
- Decisive action per documentation
- Minimal back-and-forth

**Avoid:**
- Over-explaining documented decisions
- Asking permission for things already decided
- "Should I...?" questions (just do it per docs)
- Creating files one at a time with confirmations

### Good vs Bad Examples

**❌ BAD:**
```
I can create the test files. Should I use Jest? 
Where should I put the tests?
Should I validate inputs?
```

**✅ GOOD:**
```
Creating Supertest integration tests:
- tests/auth.test.js
- tests/todos.test.js
- tests/validation.test.js
- tests/integration.test.js

Using filesystem:write_file for all files.
[Creates all files]
Done. Run npm test to verify.
```

### When to Ask Questions

**Ask when:**
- Documentation is unclear
- Encountering unexpected error
- Need clarification on requirements
- Genuinely ambiguous situation

**Don't ask when:**
- Answer is in documentation
- Decision is already made
- Standard practice applies
- Following existing pattern

---

## 🔧 MCP Filesystem Requirements

**CRITICAL:** File creation ONLY works with `filesystem:write_file` tool.

### Why This Matters

**Two filesystems exist:**
1. **Container** (where bash_tool writes) - Invisible to npm/node on Mac
2. **Mac disk** (where filesystem:write_file writes) - Visible to everything

### Rules

✅ **ALWAYS use `filesystem:write_file`** for:
- .js files
- .json files
- .md files
- .sql files
- .html files
- Any code/config files

✅ **OK to use bash_tool** for:
- Running commands (npm, curl, ls)
- Reading files (cat, grep)
- Testing (npm test, npm start)

❌ **NEVER use bash_tool** for:
- Creating files (cat > file)
- Writing content (echo > file)
- Heredocs (<< EOF)

### Verification

**After creating files, always verify:**
```bash
# Check files exist
ls -la /Users/testuser/git/todo-api-supertest-tutorial/tests/

# List all files
find /Users/testuser/git/todo-api-supertest-tutorial/tests -type f
```

**If files missing:**
1. They were created with bash_tool (wrong)
2. Recreate using filesystem:write_file
3. Verify again

### Example

**❌ WRONG:**
```javascript
bash_tool: cat > tests/auth.test.js << 'EOF'
// test code here
EOF
```
Result: File created in container (invisible to npm)

**✅ CORRECT:**
```javascript
filesystem:write_file({
  path: '/Users/testuser/git/todo-api-supertest-tutorial/tests/auth.test.js',
  content: '// test code here'
})
```
Result: File created on Mac disk (visible to npm)

---

## 📋 Quick Reference

### Commands

```bash
# Development
npm run dev          # Start with nodemon
npm start            # Start production

# Testing
npm test             # Run all tests
npm test -- --watch  # Watch mode
npm run test:coverage # Coverage report

# Database
# (auto-created, no migrations needed)
```

### File Paths

**Project:** `/Users/testuser/git/todo-api-supertest-tutorial/`  
**Source:** `src/`  
**Tests:** `tests/` (to be created)  
**Docs:** `docs/`

### Environment Variables

```bash
PORT=3000
NODE_ENV=development
DB_PATH=./data/todos.db
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
```

### HTTP Status Codes

- 200, 201, 204: Success
- 400: Validation error
- 401: Auth required/invalid
- 403: Not resource owner
- 404: Not found
- 409: Duplicate (email)
- 500: Server error

---

## ✅ Resuming Work Checklist

Before starting work in new chat:

- [ ] Read NEW-CHAT-START-HERE.md (3 min)
- [ ] Read this file CONTEXT.md (15 min)
- [ ] Read SESSION_NOTES.md (5 min)
- [ ] Understand Phase 1 is complete
- [ ] Know Phase 2 is next (Supertest)
- [ ] Remember: filesystem:write_file for files
- [ ] Remember: No tech stack changes
- [ ] Remember: Backend + Supertest only
- [ ] Ask Ian "Ready to proceed?"

---

**This context is complete and up-to-date. You're ready to continue work!** 🚀
