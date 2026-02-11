# Quick Reference - Manual Testing

## Setup (One-time)

```bash
cd /Users/testuser/git/todo-api-supertest-tutorial
chmod +x verify-install.sh
./verify-install.sh
```

---

## Daily Testing Workflow

### 1. Start Server
```bash
# Terminal 1
npm run dev
```

### 2. Health Check
```bash
# Terminal 2
curl http://localhost:3000/
```

### 3. Run Test Sequence

**Variables:**
```bash
export API_URL="http://localhost:3000"
export TOKEN=""  # Fill in after register/login
export TODO_ID=""  # Fill in after creating todo
```

**Register:**
```bash
curl -i -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Copy token from response
export TOKEN="paste-token-here"
```

**Create Todo:**
```bash
curl -i -X POST $API_URL/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test todo","description":"Description"}'

# Copy id from response
export TODO_ID="paste-id-here"
```

**Get Todos:**
```bash
curl -i -X GET $API_URL/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

**Update Todo:**
```bash
curl -i -X PUT $API_URL/api/todos/$TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'
```

**Delete Todo:**
```bash
curl -i -X DELETE $API_URL/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Monitoring

**Server logs (Terminal 1):**
- Watch for status codes
- Check error messages
- Monitor response times

**Database (Terminal 3 - optional):**
```bash
watch -n 2 'sqlite3 data/todos.db "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM todos;"'
```

---

## Quick Database Queries

```bash
# All users
sqlite3 data/todos.db "SELECT * FROM users;"

# All todos
sqlite3 data/todos.db "SELECT * FROM todos;"

# Reset database
rm -rf data/ && npm run dev
```

---

## Expected Status Codes

✅ **Success:**
- 200 - GET, PUT
- 201 - POST (create)
- 204 - DELETE

❌ **Errors:**
- 400 - Bad request (validation)
- 401 - Unauthorized (no/bad token)
- 403 - Forbidden (not owner)
- 404 - Not found
- 409 - Conflict (duplicate)

---

## Troubleshooting

**Port in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Token issues:**
- Re-login for fresh token
- Check no spaces when copying
- Format: `Bearer <token>`

**Database locked:**
- Restart server

---

## Full Guide

See **MANUAL_TESTING.md** for:
- Complete 35+ test scenarios
- Error case testing
- Authorization tests
- Detailed troubleshooting

---

## After Testing

**When all tests pass:**

1. Update docs/SESSION_NOTES.md
2. Commit changes
3. Create git tag: `v1.0.0-phase1-backend`
4. Ready for Phase 2 (Supertest)
