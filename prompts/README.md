# Tutorial Prompts Directory

This directory contains HTML prompt generators and markdown prompts for building this project with Claude Desktop + MCP.

## 📁 Files

- **sut-step1-setup.html** - Interactive form to generate Project Setup prompt
- **sut-step2-openapi.html** - Interactive form to generate OpenAPI Specification prompt  
- **MCP-GUIDANCE-TEMPLATE.txt** - Standard MCP filesystem guidance (auto-included in prompts)
- **README.md** - This file

## 🎯 How to Use

### Step 1: Open HTML Prompt Generator

```bash
# Open in your browser
open prompts/sut-step1-setup.html
```

### Step 2: Customize & Generate

1. Fill out the form with your project preferences
2. Click "Generate Setup Prompt"
3. Copy the generated prompt

### Step 3: Use with Claude Desktop

1. Start a **new conversation** in Claude Desktop
2. Paste the entire prompt
3. **Verify files are created**: After Claude responds, run:
   ```bash
   ls -la /Users/testuser/git/todo-api-supertest-tutorial/
   ```
4. If files are missing, see Troubleshooting below

## ⚠️ CRITICAL: MCP Filesystem Requirements

**All generated prompts include this guidance for Claude:**

> When creating project files (.js, .json, .sql, .md, etc.), you MUST use the `filesystem:write_file` tool.
>
> Do NOT use bash_tool with heredocs or cat commands - those write to a container that won't sync to the actual filesystem where npm/node can access files.

### Why This Matters

Claude Desktop's MCP has two file systems:
- ✅ **`filesystem:write_file`** → Files appear on your Mac for npm/node
- ❌ **`bash_tool` with cat/heredoc** → Files only in Claude's container (invisible to npm)

### Verification

After each prompt execution:

```bash
# Check files exist
ls -la /Users/testuser/git/todo-api-supertest-tutorial/

# For source files
find /Users/testuser/git/todo-api-supertest-tutorial/src -type f | sort
```

## 🔧 Troubleshooting

### Problem: Files Not Appearing

**Symptom:** Claude says files are created but `ls` shows they don't exist

**Solution:**
1. In Claude, say: "Please use filesystem:write_file tool, not bash commands"
2. Ask Claude to recreate the missing files
3. Verify again with `ls -la`

### Problem: npm Can't Find package.json

**Symptom:** `npm install` shows "ENOENT: no such file or directory"

**Solution:**
```bash
# Verify package.json exists
cat /Users/testuser/git/todo-api-supertest-tutorial/package.json

# If missing, ask Claude to recreate using filesystem:write_file
```

### Problem: Module Not Found Errors

**Symptom:** Server won't start - "Cannot find module './routes/auth'"

**Solution:**
```bash
# Check what files actually exist
find /Users/testuser/git/todo-api-supertest-tutorial/src -type f

# Compare to expected structure
# Ask Claude to create missing files using filesystem:write_file
```

## 📋 Prompt Sequence

Use prompts in this order:

1. **Setup** (sut-step1-setup.html)
   - Creates project structure
   - Generates README, REQUIREMENTS, .gitignore
   - Sets up documentation foundation

2. **OpenAPI** (sut-step2-openapi.html)  
   - Generates complete API specification
   - Documents all endpoints with examples
   - Defines data models and error formats

3. **Implementation** (future)
   - Database schema & models
   - Express app structure
   - Controllers & middleware

4. **Testing** (future)
   - Supertest integration tests
   - Test data management
   - CI/CD setup

## 🎨 Customizing Prompts

### HTML Prompt Generators

The HTML files contain JavaScript that generates prompts. To customize:

1. Open the HTML file in a text editor
2. Find the `generatePrompt()` function
3. Modify the template string
4. **Keep the MCP filesystem guidance section** (critical!)

### Example: Adding a New Field

```javascript
// In generatePrompt() function
const customField = document.getElementById('my-custom-field').value;

// Include in prompt template
const promptText = `
...existing content...

**Custom Requirement:** ${customField}

**IMPORTANT - MCP Filesystem Requirements:**
[Keep this section - do not remove!]
...
`;
```

## 🚀 Best Practices

### When Starting a New Chat

1. **Always use a fresh conversation** for each major phase
2. **Copy the entire prompt** (don't modify it)
3. **Verify files immediately** after Claude responds
4. **Don't proceed** until files are confirmed

### During Development

1. **Keep prompts updated** if you discover better approaches
2. **Document changes** in this README
3. **Test prompts** before committing
4. **Share learnings** about what works/doesn't work with MCP

### File Creation Pattern

**Good:**
```
User: [Pastes prompt with MCP guidance]
Claude: [Uses filesystem:write_file for all files]
User: [Verifies with ls/find]
User: ✅ "All files present, proceeding"
```

**Bad:**
```
User: [Pastes prompt without MCP guidance]
Claude: [Uses bash_tool with heredocs]
User: [npm install fails - files missing]
User: ❌ Has to debug and recreate files
```

## 📝 Template Variables

When creating new prompts, use these placeholders:

- `${projectName}` - Project folder name
- `${projectPath}` - Full path to project
- `${apiDomain}` - API business domain
- `${database}` - Database choice
- `${authType}` - Authentication method

## 🔄 Version History

- **v1.0** (2026-02-11)
  - Initial HTML prompt generators
  - Added MCP filesystem guidance
  - Created troubleshooting guide
  - Established best practices

## 💡 Tips

1. **One prompt, one chat** - Don't try to combine setup + implementation in one conversation
2. **Verify immediately** - Check files exist before continuing
3. **Save tokens** - Use prompts to avoid re-explaining requirements
4. **Trust but verify** - Claude may say files are created; always check with `ls`
5. **Fresh start** - If things go wrong, easier to start new chat than debug

## 📞 Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify you're using the latest prompt version
3. Ensure Claude Desktop + MCP is properly configured
4. Try in a fresh conversation
5. Check filesystem permissions on /Users/testuser/git/

## 🎓 Learning Resources

- [MCP Filesystem Documentation](#) (if available)
- [Claude Desktop Guide](#) (if available)
- This project's README.md
- SESSION_NOTES.md (tracks actual experiences)

---

**Remember: The key to success with these prompts is the MCP filesystem guidance. Never remove it from generated prompts!**
