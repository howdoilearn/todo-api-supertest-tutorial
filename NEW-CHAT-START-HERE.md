# 🚀 Starting a New Chat? Read This First!

This file helps Claude quickly understand the project when resuming work in a new chat.

## ⚡ Quick Start (3 minutes)

**Copy this into your new chat:**

```
Continue working on todo-api-supertest-tutorial.

Start by reading the project context at:
/Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md

Then read:
/Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

---

## 📋 Project Overview (Quick Reference)

**What:** Todo API with Supertest integration testing tutorial  
**Status:** Phase 1 Complete (Backend), Ready for Phase 2 (Testing)  
**Tech:** Node.js, Express, SQLite, JWT, bcrypt, Supertest, Jest

---

## ✅ What's Already Done

### Phase 1: Backend (100% Complete)
- ✅ Database schema (SQLite with Users + Todos tables)
- ✅ User model with bcrypt password hashing
- ✅ Todo model with full CRUD
- ✅ JWT authentication middleware
- ✅ All 7 API endpoints working:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/todos
  - GET /api/todos
  - GET /api/todos/:id
  - PUT /api/todos/:id
  - DELETE /api/todos/:id
- ✅ Input validation (express-validator)
- ✅ Error handling middleware
- ✅ Ownership verification (users can only access their own todos)

### Testing Verified
- ✅ Server starts successfully (`npm run dev`)
- ✅ Health check works
- ✅ User registration works
- ✅ User login returns valid JWT
- ✅ Todo creation works with auth
- ✅ Todo retrieval works

---

## 🎯 What's Next: Phase 2 (Supertest Testing)

**NOT started yet** - This is what we need to build:

1. Test infrastructure setup
2. Authentication tests (register, login, token validation)
3. CRUD operation tests (create, read, update, delete todos)
4. Validation error tests
5. Authorization tests (ownership checks)
6. Integration tests (complete workflows)

---

## 🔑 Critical Decisions Made (FINAL - Don't Change)

### Tech Stack
- **Database:** SQLite (better-sqlite3) - NOT PostgreSQL, NOT MySQL
- **Auth:** JWT tokens (24hr expiry) - NOT session-based
- **Testing:** Supertest + Jest - NOT Mocha, NOT Playwright
- **Validation:** express-validator - NOT Joi, NOT custom

### Architecture
- **Models:** Synchronous SQLite methods (not async/await for DB)
- **Password:** bcrypt with 10 rounds
- **Completed field:** Stored as 0/1 integer, converted to boolean on read
- **Foreign keys:** CASCADE on delete enabled
- **Error format:** `{ error: { message, code, details? } }`

### Project Scope (VERY IMPORTANT)
- **Build:** Backend API + Supertest tests ONLY
- **Document:** Frontend/Playwright as future extensions
- **DO NOT:** Add features, suggest different stack, or expand scope

---

## 📂 File Structure

```
todo-api-supertest-tutorial/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_PLAN.md
├── NEW-CHAT-START-HERE.md (this file)
├── NEW-CHAT-PROMPT-TEMPLATE.md
├── docs/
│   ├── CONTEXT.md (READ THIS - full project context)
│   ├── REQUIREMENTS.md
│   ├── SESSION_NOTES.md
│   ├── FILES-OVERVIEW.md
│   ├── CONVERSATION-STRATEGY.md
│   ├── LINKEDIN-ARTICLE.md
│   └── openapi.yaml
├── prompts/
│   ├── README.md
│   ├── MCP-GUIDANCE-TEMPLATE.txt
│   └── *.html (prompt generators)
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/database.js
│   ├── db/schema.sql
│   ├── models/ (User.js, Todo.js)
│   ├── routes/ (auth.js, todos.js)
│   ├── controllers/ (authController.js, todosController.js)
│   └── middleware/ (authenticate.js, errorHandler.js, validation.js)
└── tests/ (EMPTY - to be created in Phase 2)
```

---

## 📖 Documentation Reading Order

**For new chat continuation:**

1. **This file** (3 min) - Quick overview ✅
2. **docs/CONTEXT.md** (15 min) - Complete project context
3. **docs/SESSION_NOTES.md** (5 min) - What's been done

**Total:** ~23 minutes to get fully oriented

**Optional (if needed):**
- docs/REQUIREMENTS.md - API specification details
- docs/openapi.yaml - OpenAPI 3.x spec
- docs/CONVERSATION-STRATEGY.md - Token optimization approach
- prompts/README.md - How prompts work with MCP

---

## 🚨 CRITICAL: MCP Filesystem Requirements

**When creating files, Claude MUST use `filesystem:write_file` tool.**

❌ **DO NOT** use bash_tool with heredocs/cat  
✅ **ALWAYS** use filesystem:write_file for .js, .json, .sql, .md files

**Why:** bash_tool writes to container (invisible to npm/node on Mac)

**Verification after creating files:**
```bash
ls -la /Users/testuser/git/todo-api-supertest-tutorial/tests/
find /Users/testuser/git/todo-api-supertest-tutorial/tests -type f
```

---

## ✨ Communication Preferences

**Ian prefers:**
- Concise updates (show results, not process)
- Move forward decisively
- Batch file creation (not one-by-one)
- Minimal back-and-forth

**Avoid:**
- Over-explaining decisions already made
- Asking permission for documented choices
- Suggesting tech stack changes
- Creating files one-at-a-time with confirmations

---

## 🎯 Success Checklist for New Chat

Before starting work, verify:

- [ ] Read this file completely
- [ ] Read docs/CONTEXT.md
- [ ] Understand Phase 1 is complete
- [ ] Know Phase 2 is next (Supertest tests)
- [ ] Understand MCP filesystem requirement
- [ ] Know the tech stack (no changes allowed)
- [ ] Reviewed critical decisions (FINAL)

**Then:** Ask Ian "Ready to proceed with Phase 2?" or wait for instructions.

---

## 💡 Quick Tips

1. **Trust the documentation** - All decisions are documented and final
2. **Use filesystem:write_file** - ALWAYS for file creation
3. **Batch operations** - Create all test files at once
4. **Test incrementally** - Verify each test suite works before moving on
5. **Keep scope tight** - Backend + Supertest only, no extras

---

## 📞 If Something's Unclear

**Check in this order:**
1. This file (quick reference)
2. docs/CONTEXT.md (detailed context)
3. docs/SESSION_NOTES.md (what's been done)
4. Ask Ian for clarification

---

**Ready to continue? Use the prompt at the top of this file in a new chat!** 🚀
