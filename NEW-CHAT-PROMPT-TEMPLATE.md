# New Chat Prompt Templates

Use these prompts when starting a new chat to continue work on this project.

---

## 📋 Recommended Prompt (Minimal - Use This)

```
Continue working on todo-api-supertest-tutorial.

Start by reading the project context at:
/Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md

Then read:
/Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

**Why this works:**
- Points Claude to documentation
- Claude reads context from files
- No need to paste large context manually
- Saves tokens

---

## 🔄 Alternative Prompts

### If Claude Doesn't Read Files

```
Continue working on todo-api-supertest-tutorial.

IMPORTANT: Read these files first:
1. /Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md
2. /Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md
3. /Users/testuser/git/todo-api-supertest-tutorial/docs/SESSION_NOTES.md

Use the filesystem:read_text_file tool to read them.

After reading, confirm you understand:
- Project status (Phase 1 complete, Phase 2 next)
- Tech stack (SQLite, JWT, Express, Supertest)
- MCP filesystem requirements (use filesystem:write_file)

Then ask me what to work on next.
```

### If You Want Immediate Action

```
Continue working on todo-api-supertest-tutorial.

Read project context:
- /Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md
- /Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md

Phase 1 (Backend) is complete and tested.

Proceed with Phase 2: Create Supertest integration tests.

IMPORTANT: Use filesystem:write_file for all test files.

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

---

## ✅ Expected Claude Behavior

### Good Response
```
I've read the project context. I can see:
- Backend API is complete (7 endpoints working)
- Tech stack: Express, SQLite, JWT, Supertest
- Phase 1 done, Phase 2 next (Supertest tests)

I'll use filesystem:write_file for all test files.

Ready to create the test infrastructure. Should I proceed?
```

### Bad Response (Fix This)
```
What kind of API are we building?
What database should we use?
Should we use JWT or sessions?
```

**If Claude asks basic questions:**
- Say: "Read NEW-CHAT-START-HERE.md and CONTEXT.md first"
- Or: "All context is in the documentation files, please read them"

---

## 🛠️ Troubleshooting

### Claude Doesn't Read Files

**Try:**
```
Use the filesystem:read_text_file tool to read:
/Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md
```

**Or:**
```
Read the project context using view tool or filesystem:read_text_file
```

### Claude Forgets MCP Requirements

**Remind:**
```
IMPORTANT: Use filesystem:write_file tool for all files.
Do NOT use bash_tool with heredocs.
```

### Claude Suggests Wrong Tech Stack

**Correct:**
```
The tech stack is already decided and implemented:
- SQLite (NOT PostgreSQL)
- JWT (NOT sessions)
- Supertest (NOT Playwright)

Please read CONTEXT.md for full details.
```

---

## 📊 Success Checklist

After using prompt, verify Claude:

- [ ] Reads documentation files
- [ ] Understands Phase 1 is complete
- [ ] Knows what Phase 2 entails
- [ ] Mentions using filesystem:write_file
- [ ] Doesn't suggest tech stack changes
- [ ] Asks what to work on (or proceeds with Phase 2)

---

## 🎯 Scenario-Specific Prompts

### After Long Break (Days/Weeks)

```
I'm resuming work on todo-api-supertest-tutorial after a break.

Read the current project status:
- /Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md
- /Users/testuser/git/todo-api-supertest-tutorial/docs/SESSION_NOTES.md

Summarize what's been completed and what's next.

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

### Starting New Phase

```
Continue todo-api-supertest-tutorial.

Read context: /Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md

Phase 1 complete. Start Phase 2: Supertest integration tests.

Use filesystem:write_file for all test files.

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

### Debugging/Fixing Issues

```
Continue todo-api-supertest-tutorial.

Read context: /Users/testuser/git/todo-api-supertest-tutorial/NEW-CHAT-START-HERE.md

I'm encountering [describe issue].

Help me debug this.

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

### Code Review/Improvements

```
Continue todo-api-supertest-tutorial.

Read: /Users/testuser/git/todo-api-supertest-tutorial/docs/CONTEXT.md

Review the existing code for:
- [ ] Security issues
- [ ] Code quality
- [ ] Test coverage gaps
- [ ] Documentation needs

Project location: /Users/testuser/git/todo-api-supertest-tutorial/
```

---

## 💡 Pro Tips

1. **Always start with minimal prompt** - Let Claude read files
2. **Don't paste long context** - Use file references instead
3. **Verify Claude read files** - Ask "What phase are we on?"
4. **Keep prompts short** - Documentation has the details
5. **Trust the system** - Files are the source of truth

---

## 🔧 If Nothing Works

**Nuclear option - Full context prompt:**

```
Continue todo-api-supertest-tutorial.

Project: Todo API with Supertest integration testing
Location: /Users/testuser/git/todo-api-supertest-tutorial/

Tech Stack: Node.js, Express, SQLite (better-sqlite3), JWT, bcrypt, Supertest, Jest

Phase 1: Backend COMPLETE (all 7 endpoints working)
Phase 2: Supertest tests NEXT (not started)

Critical Rules:
1. Use filesystem:write_file for ALL files (NOT bash_tool)
2. Do NOT change tech stack
3. Do NOT add features beyond Backend + Supertest
4. Read CONTEXT.md for full details

What should I do next?
```

---

**Use the minimal prompt first. Only escalate if Claude doesn't respond appropriately.** 🚀
