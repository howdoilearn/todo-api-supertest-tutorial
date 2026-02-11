# Manual Testing Guide - Phase 1

This guide provides comprehensive manual testing procedures for the Todo API before implementing automated Supertest tests in Phase 2.

**Purpose:** Verify all endpoints work correctly, error handling is robust, and security rules are enforced.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup & Preparation](#setup--preparation)
3. [Test Sequence](#test-sequence)
4. [Monitoring & Debugging](#monitoring--debugging)
5. [Database Inspection](#database-inspection)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Verification Checklist](#verification-checklist)

---

## Prerequisites

### Required Tools

```bash
# curl (built-in on macOS/Linux)
curl --version

# jq (JSON formatter - optional but helpful)
brew install jq  # macOS
# or
sudo apt-get install jq  # Linux

# sqlite3 (for database inspection)
sqlite3 --version
```

### Environment Setup

```bash
# 1. Navigate to project
cd /Users/testuser/git/todo-api-supertest-tutorial

# 2. Install dependencies
npm install

# 3. Set JWT secret
cp .env.example .env
# Edit .env and set JWT_SECRET
# Generate secure secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Start server with logging
npm run dev
```

**Verify server is running:**
```bash
curl http://localhost:3000/
# Expected: {"message":"Todo API - Supertest Tutorial","status":"running","version":"1.0.0"}
```

---

## Setup & Preparation

### Terminal Setup (Recommended)

Open **3 terminal windows:**

**Terminal 1 - Server:**
```bash
cd /Users/testuser/git/todo-api-supertest-tutorial
npm run dev
# Watch server logs here
```

**Terminal 2 - Testing:**
```bash
cd /Users/testuser/git/todo-api-supertest-tutorial
# Run curl commands here
```

**Terminal 3 - Database Monitoring:**
```bash
cd /Users/testuser/git/todo-api-supertest-tutorial
# Watch database changes (optional)
watch -n 2 'sqlite3 data/todos.db "SELECT COUNT(*) as users FROM users; SELECT COUNT(*) as todos FROM todos;"'
```

### Create Test Variables File

Create `test-vars.sh` to store tokens and IDs between tests:

```bash
cat > test-vars.sh << 'EOF'
#!/bin/bash
# Test variables - source this file to use variables
export API_URL="http://localhost:3000"
export USER1_EMAIL="test1@example.com"
export USER1_PASSWORD="password123"
export USER1_NAME="Test User 1"
export USER2_EMAIL="test2@example.com"
export USER2_PASSWORD="password456"
export USER2_NAME="Test User 2"

# These will be populated during tests
export USER1_TOKEN=""
export USER1_ID=""
export USER2_TOKEN=""
export USER2_ID=""
export TODO1_ID=""
export TODO2_ID=""
EOF

chmod +x test-vars.sh
source test-vars.sh
```

---

## Test Sequence

### 1. Health Check

**Verify server is running:**
```bash
curl -i http://localhost:3000/
```

**Expected:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"Todo API - Supertest Tutorial","status":"running","version":"1.0.0"}
```

---

### 2. User Registration Tests

#### 2.1 Register First User (Success)

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "password123",
    "name": "Test User 1"
  }'
```

**Expected:**
- Status: `201 Created`
- Response contains `user` object (no password field)
- Response contains `token` (JWT string)

**Save the token:**
```bash
# Copy token from response and export
export USER1_TOKEN="paste-token-here"
```

#### 2.2 Register Second User (For Ownership Tests)

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "password456",
    "name": "Test User 2"
  }'
```

**Save the token:**
```bash
export USER2_TOKEN="paste-token-here"
```

#### 2.3 Duplicate Email (Error)

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "newpassword",
    "name": "Duplicate User"
  }'
```

**Expected:**
- Status: `409 Conflict`
- Error message about duplicate email

#### 2.4 Missing Required Fields (Error)

```bash
# Missing email
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "password": "password123",
    "name": "No Email"
  }'
```

**Expected:**
- Status: `400 Bad Request`
- Error details about missing email field

#### 2.5 Invalid Email Format (Error)

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "password123",
    "name": "Bad Email"
  }'
```

**Expected:**
- Status: `400 Bad Request`
- Error about invalid email format

#### 2.6 Password Too Short (Error)

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "short@example.com",
    "password": "pass",
    "name": "Short Pass"
  }'
```

**Expected:**
- Status: `400 Bad Request`
- Error about password length (min 8 characters)

---

### 3. Login Tests

#### 3.1 Login with Valid Credentials (Success)

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "password123"
  }'
```

**Expected:**
- Status: `200 OK`
- Response contains user object and token

#### 3.2 Login with Wrong Password (Error)

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "wrongpassword"
  }'
```

**Expected:**
- Status: `401 Unauthorized`
- Error message about invalid credentials

#### 3.3 Login with Non-existent Email (Error)

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doesnotexist@example.com",
    "password": "password123"
  }'
```

**Expected:**
- Status: `401 Unauthorized`
- Error message about invalid credentials

---

### 4. Todo Creation Tests

#### 4.1 Create Todo with Full Data (Success)

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "dueDate": "2026-02-15T00:00:00.000Z"
  }'
```

**Expected:**
- Status: `201 Created`
- Response contains todo with id, userId, all fields

**Save the todo ID:**
```bash
export TODO1_ID="paste-id-here"
```

#### 4.2 Create Todo with Minimal Data (Success)

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "title": "Simple task"
  }'
```

**Expected:**
- Status: `201 Created`
- completed defaults to false
- description and dueDate are null

#### 4.3 Create Todo Without Auth (Error)

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No auth"
  }'
```

**Expected:**
- Status: `401 Unauthorized`
- Error about missing authentication

#### 4.4 Create Todo with Invalid Token (Error)

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid-token-here" \
  -d '{
    "title": "Bad token"
  }'
```

**Expected:**
- Status: `401 Unauthorized`
- Error about invalid token

#### 4.5 Create Todo Without Title (Error)

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "description": "No title provided"
  }'
```

**Expected:**
- Status: `400 Bad Request`
- Error about missing title

#### 4.6 Create Todo with Title Too Long (Error)

```bash
# Generate 201 character title
LONG_TITLE=$(printf 'a%.0s' {1..201})

curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d "{
    \"title\": \"$LONG_TITLE\"
  }"
```

**Expected:**
- Status: `400 Bad Request`
- Error about title length (max 200 characters)

---

### 5. Todo Retrieval Tests

#### 5.1 Get All Todos (Success)

```bash
curl -i -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `200 OK`
- Array of todos belonging to User 1
- Should NOT include User 2's todos

#### 5.2 Get All Todos Without Auth (Error)

```bash
curl -i -X GET http://localhost:3000/api/todos
```

**Expected:**
- Status: `401 Unauthorized`

#### 5.3 Get Single Todo (Success)

```bash
curl -i -X GET http://localhost:3000/api/todos/$TODO1_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `200 OK`
- Todo object with matching ID

#### 5.4 Get Non-existent Todo (Error)

```bash
curl -i -X GET http://localhost:3000/api/todos/99999 \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `404 Not Found`
- Error message about todo not found

---

### 6. Todo Update Tests

#### 6.1 Update Todo (Success)

```bash
curl -i -X PUT http://localhost:3000/api/todos/$TODO1_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "completed": true,
    "description": "Updated description"
  }'
```

**Expected:**
- Status: `200 OK`
- Updated todo with new values

#### 6.2 Mark Todo Complete (Success)

```bash
curl -i -X PUT http://localhost:3000/api/todos/$TODO1_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "completed": true
  }'
```

**Expected:**
- Status: `200 OK`
- completed field is true

#### 6.3 Update Todo Without Auth (Error)

```bash
curl -i -X PUT http://localhost:3000/api/todos/$TODO1_ID \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Expected:**
- Status: `401 Unauthorized`

#### 6.4 Update Non-existent Todo (Error)

```bash
curl -i -X PUT http://localhost:3000/api/todos/99999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "completed": true
  }'
```

**Expected:**
- Status: `404 Not Found`

---

### 7. Authorization Tests (Ownership)

#### 7.1 Create Todo as User 2

```bash
curl -i -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d '{
    "title": "User 2 todo"
  }'
```

**Save User 2's todo ID:**
```bash
export TODO2_ID="paste-id-here"
```

#### 7.2 User 1 Tries to Access User 2's Todo (Error)

```bash
curl -i -X GET http://localhost:3000/api/todos/$TODO2_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `403 Forbidden`
- Error about not being resource owner

#### 7.3 User 1 Tries to Update User 2's Todo (Error)

```bash
curl -i -X PUT http://localhost:3000/api/todos/$TODO2_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "completed": true
  }'
```

**Expected:**
- Status: `403 Forbidden`

#### 7.4 User 1 Tries to Delete User 2's Todo (Error)

```bash
curl -i -X DELETE http://localhost:3000/api/todos/$TODO2_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `403 Forbidden`

---

### 8. Todo Deletion Tests

#### 8.1 Delete Todo (Success)

```bash
curl -i -X DELETE http://localhost:3000/api/todos/$TODO1_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `204 No Content`
- Empty response body

#### 8.2 Verify Todo is Deleted

```bash
curl -i -X GET http://localhost:3000/api/todos/$TODO1_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `404 Not Found`

#### 8.3 Delete Already Deleted Todo (Error)

```bash
curl -i -X DELETE http://localhost:3000/api/todos/$TODO1_ID \
  -H "Authorization: Bearer $USER1_TOKEN"
```

**Expected:**
- Status: `404 Not Found`

#### 8.4 Delete Without Auth (Error)

```bash
curl -i -X DELETE http://localhost:3000/api/todos/$TODO2_ID
```

**Expected:**
- Status: `401 Unauthorized`

---

## Monitoring & Debugging

### Server Logs

**Terminal 1 (Server) shows:**
```
POST /api/auth/register 201 - 45.234 ms
POST /api/auth/login 200 - 123.456 ms
POST /api/todos 201 - 12.345 ms
GET /api/todos 200 - 5.678 ms
```

**What to watch for:**
- ✅ 2xx status codes = success
- ❌ 4xx status codes = client errors (check request)
- ❌ 5xx status codes = server errors (check logs)

**Enable detailed logging (optional):**

Edit `src/app.js` and add:
```javascript
// After other middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
```

### Real-time Log Filtering

```bash
# In Terminal 1 (Server), filter specific logs
npm run dev 2>&1 | grep -E "(POST|GET|PUT|DELETE|Error)"

# Watch only errors
npm run dev 2>&1 | grep -i error

# Watch authentication
npm run dev 2>&1 | grep -i "auth\|token\|jwt"
```

---

## Database Inspection

### View All Data

```bash
# All users
sqlite3 data/todos.db "SELECT id, email, name, createdAt FROM users;"

# All todos
sqlite3 data/todos.db "SELECT id, userId, title, completed, createdAt FROM todos;"

# Count records
sqlite3 data/todos.db "SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM todos) as todos;"
```

### Formatted Output

```bash
# Pretty print users
sqlite3 data/todos.db << EOF
.mode column
.headers on
SELECT id, email, name, createdAt FROM users;
EOF

# Pretty print todos
sqlite3 data/todos.db << EOF
.mode column
.headers on
SELECT id, userId, title, completed, dueDate FROM todos;
EOF
```

### Watch Database Changes (Real-time)

```bash
# Terminal 3 - continuous monitoring
watch -n 1 'sqlite3 data/todos.db "
.mode column
.headers on
SELECT '\''Users:'\'' as Type, COUNT(*) as Count FROM users
UNION ALL
SELECT '\''Todos:'\'', COUNT(*) FROM todos;"'
```

### Verify Data Integrity

```bash
# Check for orphaned todos (userId doesn't exist)
sqlite3 data/todos.db "
SELECT t.id, t.title, t.userId 
FROM todos t 
LEFT JOIN users u ON t.userId = u.id 
WHERE u.id IS NULL;"

# Should return no rows (empty result = good)
```

### Database Reset

```bash
# Stop server (Ctrl+C in Terminal 1)

# Remove database
rm -rf data/

# Restart server (recreates schema)
npm run dev

# Verify clean state
sqlite3 data/todos.db "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM todos;"
# Should show 0, 0
```

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
echo "PORT=3001" >> .env
npm run dev
```

### Issue: JWT Token Invalid

**Symptom:**
```
401 Unauthorized - Invalid token
```

**Solutions:**
1. Check JWT_SECRET is set in .env
2. Token may have expired (24 hour limit) - login again
3. Verify no extra spaces when copying token
4. Check Authorization header format: `Bearer <token>`

### Issue: Database Locked

**Symptom:**
```
Error: SQLITE_BUSY: database is locked
```

**Solution:**
```bash
# Close any sqlite3 connections
# Restart server
npm run dev
```

### Issue: Module Not Found

**Symptom:**
```
Error: Cannot find module './routes/auth'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Validation Errors Not Showing Details

**Check:**
- Request has `Content-Type: application/json` header
- Request body is valid JSON
- Check server logs for validation error details

### Issue: 403 Forbidden on Own Todo

**Debug:**
```bash
# Verify you're the owner
sqlite3 data/todos.db "SELECT id, userId FROM todos WHERE id = $TODO1_ID;"

# Check your user ID from token
# Token payload: {"userId": X, "email": "..."}
```

---

## Verification Checklist

Use this checklist to verify all functionality works:

### Authentication
- [ ] Register new user succeeds (201)
- [ ] Register duplicate email fails (409)
- [ ] Register missing fields fails (400)
- [ ] Register invalid email fails (400)
- [ ] Register short password fails (400)
- [ ] Login valid credentials succeeds (200)
- [ ] Login wrong password fails (401)
- [ ] Login non-existent email fails (401)

### Todo Creation
- [ ] Create todo with full data succeeds (201)
- [ ] Create todo with minimal data succeeds (201)
- [ ] Create todo without auth fails (401)
- [ ] Create todo with invalid token fails (401)
- [ ] Create todo without title fails (400)
- [ ] Create todo with long title fails (400)

### Todo Retrieval
- [ ] Get all todos succeeds (200)
- [ ] Get all todos without auth fails (401)
- [ ] Get single todo succeeds (200)
- [ ] Get non-existent todo fails (404)
- [ ] User only sees own todos (not other users')

### Todo Updates
- [ ] Update todo succeeds (200)
- [ ] Partial update succeeds (200)
- [ ] Update without auth fails (401)
- [ ] Update non-existent todo fails (404)

### Authorization (Ownership)
- [ ] User cannot view another user's todo (403)
- [ ] User cannot update another user's todo (403)
- [ ] User cannot delete another user's todo (403)

### Todo Deletion
- [ ] Delete todo succeeds (204)
- [ ] Deleted todo not retrievable (404)
- [ ] Delete already deleted todo fails (404)
- [ ] Delete without auth fails (401)

### Database Integrity
- [ ] No orphaned todos (all have valid userId)
- [ ] Passwords are hashed (not plain text)
- [ ] Timestamps are ISO 8601 format
- [ ] Completed field stored as 0/1

### Error Responses
- [ ] All errors have consistent format
- [ ] Error messages are clear
- [ ] No stack traces exposed
- [ ] No sensitive data in errors

---

## Quick Test Script

Save this as `quick-test.sh` for rapid verification:

```bash
#!/bin/bash
source test-vars.sh

echo "🧪 Quick API Test"
echo "================="

# 1. Register
echo -n "1. Register user... "
RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER1_EMAIL\",\"password\":\"$USER1_PASSWORD\",\"name\":\"$USER1_NAME\"}")
if echo $RESPONSE | grep -q "token"; then
  echo "✅"
  export USER1_TOKEN=$(echo $RESPONSE | jq -r '.token')
else
  echo "❌"
  exit 1
fi

# 2. Login
echo -n "2. Login... "
RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER1_EMAIL\",\"password\":\"$USER1_PASSWORD\"}")
if echo $RESPONSE | grep -q "token"; then
  echo "✅"
else
  echo "❌"
  exit 1
fi

# 3. Create todo
echo -n "3. Create todo... "
RESPONSE=$(curl -s -X POST $API_URL/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{"title":"Test todo"}')
if echo $RESPONSE | grep -q "id"; then
  echo "✅"
  export TODO1_ID=$(echo $RESPONSE | jq -r '.id')
else
  echo "❌"
  exit 1
fi

# 4. Get todos
echo -n "4. Get todos... "
RESPONSE=$(curl -s -X GET $API_URL/api/todos \
  -H "Authorization: Bearer $USER1_TOKEN")
if echo $RESPONSE | grep -q "$TODO1_ID"; then
  echo "✅"
else
  echo "❌"
  exit 1
fi

# 5. Update todo
echo -n "5. Update todo... "
RESPONSE=$(curl -s -X PUT $API_URL/api/todos/$TODO1_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{"completed":true}')
if echo $RESPONSE | grep -q '"completed":true'; then
  echo "✅"
else
  echo "❌"
  exit 1
fi

# 6. Delete todo
echo -n "6. Delete todo... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API_URL/api/todos/$TODO1_ID \
  -H "Authorization: Bearer $USER1_TOKEN")
if [ "$HTTP_CODE" = "204" ]; then
  echo "✅"
else
  echo "❌"
  exit 1
fi

echo ""
echo "✅ All tests passed!"
```

Make it executable:
```bash
chmod +x quick-test.sh
./quick-test.sh
```

---

## Next Steps

Once all manual tests pass:

1. **Create git tag:** `v1.0.0-phase1-backend`
2. **Document any issues** in docs/SESSION_NOTES.md
3. **Proceed to Phase 2:** Supertest integration tests
4. **Use prompt generators** from structuredprompts.com

---

**Manual testing complete? Ready for Phase 2!** 🚀
