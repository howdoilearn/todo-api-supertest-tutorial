# Supertest Tutorial Project - Approach & Plan

## Project Vision

Create a **structured prompt-based tutorial system** for learning Supertest API integration testing. Users build both the System Under Test (SUT) and comprehensive test suite through guided prompts, learning prompt engineering and testing simultaneously.

## Core Philosophy: "Vibe Coding"

- **No manual coding** - all development via structured prompts
- **Prompts are the product** - they teach both testing AND prompt engineering
- **Iterative refinement** - discover gaps → create prompt → Claude fixes
- **Learning by building** - users understand because they built it step-by-step

## Technical Architecture

### Prerequisites (User Requirements)
- Claude Desktop with MCP configured
- Filesystem MCP with access to project directory (e.g., `/Users/testuser/git`)
- Web browser for HTML prompt generators
- Node.js installed (for running the final application)

### MCP Integration
- **Filesystem MCP**: Read/write all project files
- **Claude Context**: Full access to existing code for analysis
- **Prompt Pattern**: "Examine [file] and generate [tests/code]"
- **Iterative**: Prompts can reference and modify existing files

### Project Structure
```
todo-api-supertest-tutorial/
├── prompts/                    # Structured prompt generators (HTML)
│   ├── sut-step1-setup.html
│   ├── sut-step2-openapi.html
│   ├── sut-step3-database.html
│   ├── sut-step4-express.html
│   ├── sut-step5-auth.html
│   ├── test-step1-setup.html
│   ├── test-step2-auth.html
│   ├── test-step3-todos.html
│   ├── test-step4-validation.html
│   └── test-step5-integration.html
├── docs/                       # Generated documentation
│   ├── REQUIREMENTS.md
│   ├── SESSION_NOTES.md
│   └── openapi.yaml
├── src/                        # Generated SUT code
│   ├── server.js
│   ├── app.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── tests/                      # Generated Supertest assets
│   ├── integration/
│   ├── fixtures/
│   └── helpers/
├── .gitignore
├── package.json
└── README.md
```

## Two-Phase Development

### Phase 1: Build the SUT (System Under Test)

**Goal**: Create a working Todo API that serves as the testing target

**Tech Stack**:
- Node.js + Express.js
- SQLite database (no Docker needed)
- JWT authentication with bcrypt
- OpenAPI 3.x specification
- RESTful API design

**Structured Prompts** (each generates specific files):

1. **sut-step1-setup.html** ✅ COMPLETED
   - Creates: README.md, REQUIREMENTS.md, SESSION_NOTES.md, .gitignore
   - Establishes: Project goals, API requirements, data models
   - Status: Built and ready to test

2. **sut-step2-openapi.html** (NEXT)
   - Creates: Complete OpenAPI 3.x specification
   - Defines: All endpoints, schemas, authentication, error responses
   - Purpose: API-first design, contract for implementation

3. **sut-step3-database.html**
   - Creates: SQLite schema, migrations, database models
   - Defines: Users table, Todos table, relationships
   - Purpose: Data layer foundation

4. **sut-step4-express.html**
   - Creates: Express app structure, routes, controllers
   - Implements: CRUD operations, middleware, error handling
   - Purpose: Core API functionality

5. **sut-step5-auth.html**
   - Creates: JWT authentication, bcrypt password hashing
   - Implements: Register, login, auth middleware
   - Purpose: Security layer

**Key Decisions**:
- SQLite over PostgreSQL: Simpler setup, no Docker
- JWT over sessions: Better for API testing tutorials
- API-first approach: OpenAPI spec drives implementation
- Simple complexity: CRUD + Auth only (no pagination, search, etc.)

### Phase 2: Build Supertest Test Assets

**Goal**: Generate comprehensive integration tests by examining the SUT code

**Testing Focus**:
- Integration testing with Supertest (primary)
- API contract validation against OpenAPI spec
- Authentication flow testing
- CRUD operation testing
- Error handling and validation testing
- Test data management and cleanup

**Structured Prompts** (each examines code and generates tests):

1. **test-step1-setup.html**
   - Creates: Test infrastructure, Jest config, test helpers
   - Generates: Database setup/teardown, test fixtures
   - Purpose: Testing foundation

2. **test-step2-auth.html**
   - Examines: src/routes/auth.js, src/controllers/auth.js
   - Generates: Registration tests, login tests, token validation
   - Purpose: Authentication testing

3. **test-step3-todos.html**
   - Examines: src/routes/todos.js, src/controllers/todos.js
   - Generates: CRUD operation tests, ownership validation
   - Purpose: Core functionality testing

4. **test-step4-validation.html**
   - Examines: All validation middleware and schemas
   - Generates: Input validation tests, edge cases, error responses
   - Purpose: Robustness testing

5. **test-step5-integration.html**
   - Examines: Entire application structure
   - Generates: End-to-end workflows, complete user journeys
   - Purpose: Full integration verification

**Test Generation Pattern**:
Each test prompt follows this pattern:
1. Read existing implementation files via MCP
2. Analyze OpenAPI spec for expected behavior
3. Generate Supertest tests matching implementation
4. Include setup/teardown, fixtures, assertions
5. Validate against API contract

## Workflow for Users

### Initial Setup
1. Open `prompts/sut-step1-setup.html` in browser
2. Customize form fields (or use defaults)
3. Click "Generate Setup Prompt"
4. Copy generated prompt
5. Paste into Claude Desktop (with MCP enabled)
6. Claude creates project structure

### Iterative Development
For each subsequent step:
1. Open next prompt HTML file
2. Generate prompt (may reference previous work)
3. Paste into **same Claude conversation** (maintains context)
4. Claude reads existing files, generates new code
5. Repeat for all prompts in sequence

### Handling Issues/Gaps
When discovering problems:
1. Don't manually edit code
2. Create new prompt or re-run existing prompt with modifications
3. Let Claude fix via MCP file operations
4. Document the issue in SESSION_NOTES.md

### Testing the Final Product
After all prompts complete:
```bash
cd /Users/testuser/git/todo-api-supertest-tutorial
npm install
npm test          # Run Supertest suite
npm run dev       # Start API server
```

## Distribution Model

### For Ian (Tutorial Creator)
- **Git Repository**: Complete working project
  - All prompts in `/prompts/`
  - Completed SUT in `/src/`
  - Completed tests in `/tests/`
  - Full documentation in `/docs/`
  - Purpose: Reference, debugging, iteration

### For structuredprompts.com (End Users)
- **Published Content**: Only HTML prompt files
  - Copy `/prompts/*.html` to website
  - Users download/open prompts
  - Users generate their own projects from scratch
  - No pre-built code distributed

### For Tutorial Viewers (YouTube/LinkedIn)
- **Learning Path**: 
  - Phase 1 videos: "Build the API" (sut-step1 through sut-step5)
  - Phase 2 videos: "Test with Supertest" (test-step1 through test-step5)
  - Each video demonstrates one structured prompt
  - Viewers follow along, building their own

## Key Benefits

### For Learners
1. **Active Learning**: Build, don't just read
2. **Prompt Engineering Skills**: Learn effective prompting patterns
3. **Testing Mindset**: Understand testability from design phase
4. **Reusable Templates**: Adapt prompts for their own projects
5. **Multi-Session Friendly**: Pick up where they left off

### For Ian (Creator)
1. **Scalable Content**: One prompt = infinite projects
2. **Easy Updates**: Fix prompt, not 1000s of code repos
3. **Quality Control**: Structured prompts ensure consistency
4. **Teaching Tool**: Prompts encode best practices
5. **Differentiated**: No one else teaching this way

### For the Industry
1. **New Tutorial Paradigm**: Interactive, AI-assisted learning
2. **Prompt Engineering Education**: Practical, project-based
3. **Testing Excellence**: Integration testing from day one
4. **Professional Patterns**: Industry-standard practices

## Technical Decisions Log

### Completed Decisions
1. **No Docker**: SQLite instead of PostgreSQL
   - Rationale: Simpler setup, easier tutorial follow-along
   - Trade-off: Less "production-like" but more accessible

2. **Folder Structure**: `/prompts/` for generators, `/docs/` for outputs
   - Rationale: Clear separation of tools vs artifacts
   - Benefit: Easy to publish prompts to website

3. **Naming Convention**: Prefix-based (`sut-step1`, `test-step1`)
   - Rationale: Flexibility for future expansion
   - Benefit: Clear sequencing and categorization

4. **OpenAPI First**: Spec before implementation
   - Rationale: Contract-driven development, better for testing
   - Benefit: Tests can validate against spec

5. **Simple Complexity**: CRUD + Auth only
   - Rationale: Keep tutorial focused, avoid scope creep
   - Benefit: Faster completion, easier to understand

### Future Considerations
- Add optional prompts for advanced features (pagination, search, etc.)
- Create "fix-it" prompts for common issues
- Build validation prompts to check OpenAPI compliance
- Add performance testing prompts (load testing, benchmarks)

## Next Immediate Steps

### Step 1: Test the Setup Prompt ✅ DONE
- File created: `prompts/sut-step1-setup.html`
- Status: Ready to test
- Action: Ian will test by running generated prompt

### Step 2: Build OpenAPI Prompt (NEXT UP)
- File to create: `prompts/sut-step2-openapi.html`
- Purpose: Generate complete OpenAPI 3.x specification
- Inputs needed:
  - Reference to REQUIREMENTS.md (from step 1)
  - API endpoints, data models, auth flows
  - Error responses, validation rules
- Outputs generated:
  - docs/openapi.yaml (complete specification)
  - Update SESSION_NOTES.md with progress
- Customization options:
  - OpenAPI version (3.0 vs 3.1)
  - Server URLs (local, staging, production)
  - Security schemes (JWT configuration)
  - Response example depth

### Step 3: Build Database Prompt
- File to create: `prompts/sut-step3-database.html`
- Purpose: Generate SQLite schema and models
- Depends on: OpenAPI spec for data structures

### Step 4: Build Express App Prompt
- File to create: `prompts/sut-step4-express.html`
- Purpose: Generate Express application structure
- Depends on: Database models, OpenAPI routes

### Step 5: Build Auth Implementation Prompt
- File to create: `prompts/sut-step5-auth.html`
- Purpose: Generate JWT authentication system
- Depends on: Express app structure, User model

### Then: Transition to Test Prompts
After Phase 1 (SUT) complete, build Phase 2 (Test) prompts

## Session Management

### Current Session Status
- **Session 1**: Project setup and planning
  - ✅ Created project vision and approach
  - ✅ Built first structured prompt (sut-step1-setup.html)
  - ✅ Documented methodology and next steps
  - 📋 Next: Test setup prompt, then build OpenAPI prompt

### For Future Sessions
- Read this document first to restore context
- Check SESSION_NOTES.md in project for detailed progress
- Continue from "Next Immediate Steps" section
- Update this document as approach evolves

## Success Criteria

### For Phase 1 (SUT)
- [ ] All prompts generate valid, working code
- [ ] API passes OpenAPI validation
- [ ] Manual testing shows all endpoints work
- [ ] Code follows Express best practices
- [ ] SQLite database schema is normalized
- [ ] JWT authentication is secure
- [ ] Error handling is comprehensive

### For Phase 2 (Tests)
- [ ] All Supertest tests pass
- [ ] Test coverage >80% for critical paths
- [ ] Tests validate against OpenAPI contract
- [ ] Test data setup/teardown works reliably
- [ ] Tests can run independently and in parallel
- [ ] Authentication flows fully tested
- [ ] Edge cases and error scenarios covered

### For Tutorial Content
- [ ] Prompts are intuitive and well-documented
- [ ] Each prompt teaches specific concepts
- [ ] Users can complete without getting stuck
- [ ] Prompts work across different Claude conversations
- [ ] Output is consistent and predictable
- [ ] Users learn both testing AND prompting

## Open Questions / Future Decisions

1. **Database Seeding**: Include seed data prompts?
2. **Environment Management**: .env file generation prompt?
3. **Deployment**: Add deployment prompts (Docker, Railway, etc.)?
4. **CI/CD**: GitHub Actions workflow generation?
5. **API Documentation**: Swagger UI integration prompt?
6. **Monitoring**: Logging and error tracking prompts?
7. **Advanced Testing**: Load testing, mutation testing prompts?
8. **Multiple LLMs**: Test prompts with different models (Opus, Haiku)?

## Resources & References

### Project Links
- Domain: structuredprompts.com (future home)
- Git Repo: /Users/testuser/git/todo-api-supertest-tutorial
- Prompts Directory: /Users/testuser/git/todo-api-supertest-tutorial/prompts

### Key Technologies
- Node.js: Runtime environment
- Express.js: Web framework
- SQLite: Database (via better-sqlite3 or sqlite3)
- Jest: Test framework
- Supertest: HTTP testing library
- OpenAPI 3.x: API specification
- JWT: Authentication tokens
- bcrypt: Password hashing

### Learning Resources
- Supertest documentation
- OpenAPI specification guide
- Jest testing best practices
- Express.js patterns and anti-patterns
- API testing strategies

## Revision History

- **2026-02-09**: Initial document creation
  - Defined project vision and approach
  - Created first structured prompt (sut-step1-setup)
  - Documented two-phase development plan
  - Outlined next steps and success criteria

---

**Last Updated**: 2026-02-09
**Status**: Phase 1 - Step 1 Complete, Step 2 Planning
**Next Action**: Test sut-step1-setup prompt, then build sut-step2-openapi
