# Project Files Overview

**Purpose**: Quick reference for understanding what each file contains and when to use it.

---

## Documentation Files

### Core Documentation (Always Current)

**NEW-CHAT-START-HERE.md** (Root)
- **Purpose**: Quick onboarding for Claude in new chat
- **Read When**: Starting any new chat session
- **Reading Time**: 2-3 minutes
- **Contains**: Quick checklist, key decisions, what to read next

**docs/CONTEXT.md**
- **Purpose**: Complete project context and onboarding
- **Read When**: New chat, or when needing full context
- **Reading Time**: 10-15 minutes  
- **Contains**: All decisions, rationale, code standards, pitfalls

**docs/SESSION_NOTES.md**
- **Purpose**: Real-time progress tracking
- **Read When**: Every session
- **Update When**: After completing any task
- **Contains**: Completed tasks, in progress, next steps

**PROJECT_PLAN.md** (Root)
- **Purpose**: Complete methodology
- **Read When**: Understanding overall strategy
- **Contains**: Vision, phases, approach, success criteria

**docs/REQUIREMENTS.md**
- **Purpose**: Complete API specification
- **Read When**: Implementing features
- **Contains**: All endpoints, schemas, validation rules

**docs/openapi.yaml**
- **Purpose**: OpenAPI 3.x API contract
- **Read When**: Implementing endpoints
- **Contains**: Complete API spec with quality attributes

**README.md** (Root)
- **Purpose**: Project overview
- **Read When**: First time, quick reference
- **Contains**: Purpose, tech stack, quick start

---

## Reading Strategy for New Chat

### Minimum Required (23 min):
1. NEW-CHAT-START-HERE.md (3 min)
2. docs/CONTEXT.md (15 min)
3. docs/SESSION_NOTES.md (5 min)

### Optional Deep Dive:
- PROJECT_PLAN.md (methodology)
- docs/REQUIREMENTS.md (specs)
- docs/openapi.yaml (contract)

---

## Quick Decision Tree

**Need to know...**

→ "What's next?" → docs/SESSION_NOTES.md  
→ "Why this approach?" → PROJECT_PLAN.md  
→ "What are requirements?" → docs/REQUIREMENTS.md  
→ "API contract?" → docs/openapi.yaml  
→ "How to resume?" → NEW-CHAT-START-HERE.md  
→ "All context?" → docs/CONTEXT.md  
→ "Which file is which?" → This file

---

**Last Updated**: 2026-02-10  
**Status**: Phase 1, Step 2 Complete
