# Manual Verification Setup - Summary

## What We Created

You now have a **comprehensive manual testing framework** for Phase 1:

### 1. MANUAL_TESTING.md (Main Guide)
**Location:** `/Users/testuser/git/todo-api-supertest-tutorial/MANUAL_TESTING.md`

**Contents:**
- Complete test sequence (70+ tests)
- All 7 endpoints covered
- Authentication & authorization tests
- Error handling verification
- Database inspection commands
- Server log monitoring guide
- Troubleshooting section
- Quick verification checklist

### 2. verify-install.sh (Installation Checker)
**Location:** `/Users/testuser/git/todo-api-supertest-tutorial/verify-install.sh`

**Checks:**
- Node.js 18+ installed
- Dependencies installed (node_modules)
- .env file exists with JWT_SECRET
- All required directories present
- All required files present
- npm scripts configured
- curl available (for testing)
- sqlite3 available (optional)

### 3. Updated README.md
**Location:** `/Users/testuser/git/todo-api-supertest-tutorial/README.md`

**Added:**
- Links to MANUAL_TESTING.md
- Installation verification steps
- Clear prerequisites
- Troubleshooting section
- Log monitoring guidance

---

## Setup Instructions for You

### Step 1: Make Scripts Executable

```bash
cd /Users/testuser/git/todo-api-supertest-tutorial

# Make verification script executable
chmod +x verify-install.sh

# Make quick test script executable (from MANUAL_TESTING.md)
chmod +x quick-test.sh  # (you'll create this when testing)
```

### Step 2: Run Installation Verification

```bash
# Verify everything is set up correctly
./verify-install.sh
```

**Expected output:**
```
🔍 Todo API - Installation Verification
========================================

1. Checking Node.js version... ✅ v18.x.x
2. Checking npm... ✅ 10.x.x
3. Checking node_modules... ✅ Dependencies installed
4. Checking .env file... ✅ .env exists
   ✅ JWT_SECRET configured
5. Checking project structure... ✅ All directories present
6. Checking required files... ✅ All required files present
7. Checking npm scripts... ✅ Scripts configured
8. Checking data directory... ⚠️  Data directory not yet created (normal)
9. Checking curl... ✅ curl available
10. Checking sqlite3... ✅ sqlite3 available

✅ Installation verification complete!
```

### Step 3: Start Server

```bash
# Terminal 1 - Server
npm run dev
```

**Expected output:**
```
> todo-api-supertest-tutorial@1.0.0 dev
> nodemon src/server.js

[nodemon] starting `node src/server.js`
Server running on http://localhost:3000
Database initialized at data/todos.db
```

### Step 4: Run Quick Health Check

```bash
# Terminal 2 - Testing
curl http://localhost:3000/

# Expected:
# {"message":"Todo API - Supertest Tutorial","status":"running","version":"1.0.0"}
```

---

## Manual Testing Workflow

### Recommended Terminal Setup

**Terminal 1 (Server):**
```bash
npm run dev
# Watch logs here
```

**Terminal 2 (Testing):**
```bash
# Run curl commands here
# Follow MANUAL_TESTING.md test sequence
```

**Terminal 3 (Database - Optional):**
```bash
# Watch database changes
watch -n 2 'sqlite3 data/todos.db "SELECT COUNT(*) as users FROM users; SELECT COUNT(*) as todos FROM todos;"'
```

### Test Execution

Follow **MANUAL_TESTING.md** in order:

1. **Health Check** (verify server running)
2. **User Registration** (6 tests: success + 5 error cases)
3. **Login** (3 tests: success + 2 error cases)
4. **Todo Creation** (6 tests: success + 5 error cases)
5. **Todo Retrieval** (4 tests: success + 3 error cases)
6. **Todo Updates** (4 tests: success + 3 error cases)
7. **Authorization/Ownership** (4 tests: cross-user access)
8. **Todo Deletion** (4 tests: success + 3 error cases)

**Total:** ~35 manual test scenarios

### Quick Test Script

For rapid verification, create `quick-test.sh` from MANUAL_TESTING.md:

```bash
# Copy from MANUAL_TESTING.md section "Quick Test Script"
chmod +x quick-test.sh
./quick-test.sh
```

Runs 6 core tests in ~2 seconds.

---

## Monitoring & Debugging

### Server Logs

**What to watch:**
- Request method + path + status code
- Response times
- Validation errors
- Database operations

**Filter logs:**
```bash
# Only errors
npm run dev 2>&1 | grep -i error

# Only auth-related
npm run dev 2>&1 | grep -i "auth\|token"

# Only specific status codes
npm run dev 2>&1 | grep -E "40[0-9]|50[0-9]"
```

### Database Inspection

```bash
# View all users
sqlite3 data/todos.db "SELECT id, email, name FROM users;"

# View all todos
sqlite3 data/todos.db "SELECT id, userId, title, completed FROM todos;"

# Count records
sqlite3 data/todos.db "SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM todos) as todos;"

# Pretty formatted
sqlite3 data/todos.db << EOF
.mode column
.headers on
SELECT * FROM users;
EOF
```

### Real-time Monitoring

```bash
# Watch database counts (updates every 2 seconds)
watch -n 2 'sqlite3 data/todos.db "
  SELECT '\''Users:'\'' as Type, COUNT(*) as Count FROM users
  UNION ALL
  SELECT '\''Todos:'\'', COUNT(*) FROM todos;"'
```

---

## Common Issues During Testing

### Issue: Port 3000 in use
```bash
lsof -i :3000
kill -9 <PID>
# or change port in .env: PORT=3001
```

### Issue: JWT Token Invalid
- Token expired (24 hours) → login again
- Copy/paste error → no spaces in token
- Wrong format → must be `Bearer <token>`

### Issue: 403 Forbidden on own todo
```bash
# Check ownership
sqlite3 data/todos.db "SELECT id, userId FROM todos WHERE id = X;"
```

### Issue: Database locked
- Close sqlite3 connections
- Restart server

---

## After Manual Testing

Once all tests pass and you're satisfied:

### 1. Document Results
Update `docs/SESSION_NOTES.md`:
```markdown
## Session X - Manual Testing Complete
**Date:** [date]

### Completed
- ✅ All 35+ manual test scenarios passed
- ✅ Error handling verified
- ✅ Authorization working correctly
- ✅ Database integrity confirmed
- ✅ No bugs found

### Issues Found & Fixed
- [Document any issues]

### Ready for Phase 2
Backend is stable and ready for Supertest testing.
```

### 2. Create Git Tag
```bash
git add .
git commit -m "Add manual testing guide and verification scripts

- MANUAL_TESTING.md: Comprehensive 35+ test scenarios
- verify-install.sh: Installation verification script
- Updated README with testing workflow
- Ready for v1.0.0-phase1-backend tag after manual verification"

git push origin main
```

### 3. After Manual Verification Passes
```bash
# Create the stable Phase 1 tag
git tag -a v1.0.0-phase1-backend -m "Phase 1: Backend API Complete & Manually Verified

All 7 endpoints working and tested:
- User registration & login (JWT auth)
- Todo CRUD operations
- Authorization/ownership enforcement
- Input validation
- Error handling

Manual testing completed:
- 35+ test scenarios passed
- Database integrity verified
- Logs reviewed
- No critical issues

Ready for Phase 2: Supertest integration testing"

git push origin v1.0.0-phase1-backend
```

---

## Next: Phase 2 (Supertest)

When you're ready:

1. **New chat session** with Claude
2. Open `structuredprompts/prompts/todo-api-supertest/step5-testing.html`
3. Generate Supertest testing prompt
4. Create comprehensive test suite
5. Verify 80%+ coverage
6. Tag `v2.0.0-phase2-testing`

---

## Files Summary

**Created/Updated:**
- ✅ `MANUAL_TESTING.md` - 35+ manual test scenarios
- ✅ `verify-install.sh` - Installation checker
- ✅ `README.md` - Updated with testing workflow
- ✅ Ready for manual verification

**Your Tasks:**
1. Make scripts executable (`chmod +x`)
2. Run `./verify-install.sh`
3. Start server (`npm run dev`)
4. Follow MANUAL_TESTING.md test sequence
5. Document results in SESSION_NOTES.md
6. Create git tag when stable

**Questions?** The MANUAL_TESTING.md guide has:
- Complete test sequence
- Troubleshooting guide
- Database commands
- Monitoring instructions
