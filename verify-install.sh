#!/bin/bash

# Installation Verification Script
# Checks that all dependencies and environment are correctly set up

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🔍 Todo API - Installation Verification"
echo "========================================"
echo ""

# 1. Check Node.js version
echo -n "1. Checking Node.js version... "
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -ge 18 ]; then
  echo -e "${GREEN}✅ $(node -v)${NC}"
else
  echo -e "${RED}❌ Node.js 18+ required (found v${NODE_VERSION})${NC}"
  exit 1
fi

# 2. Check npm
echo -n "2. Checking npm... "
if command -v npm &> /dev/null; then
  echo -e "${GREEN}✅ $(npm -v)${NC}"
else
  echo -e "${RED}❌ npm not found${NC}"
  exit 1
fi

# 3. Check dependencies installed
echo -n "3. Checking node_modules... "
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠️  node_modules not found${NC}"
  echo "   Run: npm install"
  exit 1
fi

# 4. Check .env file
echo -n "4. Checking .env file... "
if [ -f ".env" ]; then
  echo -e "${GREEN}✅ .env exists${NC}"
  
  # Check JWT_SECRET
  if grep -q "JWT_SECRET=" .env; then
    JWT_SECRET=$(grep "JWT_SECRET=" .env | cut -d '=' -f 2 | tr -d ' ')
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-secret-key-change-in-production" ]; then
      echo -e "   ${YELLOW}⚠️  JWT_SECRET not set or using default${NC}"
      echo "   Generate secure secret with:"
      echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    else
      echo -e "   ${GREEN}✅ JWT_SECRET configured${NC}"
    fi
  else
    echo -e "   ${YELLOW}⚠️  JWT_SECRET not found in .env${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .env not found${NC}"
  echo "   Run: cp .env.example .env"
  exit 1
fi

# 5. Check project structure
echo -n "5. Checking project structure... "
REQUIRED_DIRS=("src" "src/routes" "src/controllers" "src/models" "src/middleware" "src/config" "docs")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    MISSING_DIRS+=("$dir")
  fi
done

if [ ${#MISSING_DIRS[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All directories present${NC}"
else
  echo -e "${RED}❌ Missing directories: ${MISSING_DIRS[*]}${NC}"
  exit 1
fi

# 6. Check required files
echo -n "6. Checking required files... "
REQUIRED_FILES=(
  "src/server.js"
  "src/app.js"
  "src/config/database.js"
  "src/routes/auth.js"
  "src/routes/todos.js"
  "src/controllers/authController.js"
  "src/controllers/todosController.js"
  "package.json"
)
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All required files present${NC}"
else
  echo -e "${RED}❌ Missing files: ${MISSING_FILES[*]}${NC}"
  exit 1
fi

# 7. Check package.json scripts
echo -n "7. Checking npm scripts... "
if grep -q '"start"' package.json && grep -q '"dev"' package.json; then
  echo -e "${GREEN}✅ Scripts configured${NC}"
else
  echo -e "${RED}❌ Missing start or dev scripts${NC}"
  exit 1
fi

# 8. Check data directory (will be created on first run)
echo -n "8. Checking data directory... "
if [ -d "data" ]; then
  echo -e "${GREEN}✅ Data directory exists${NC}"
  if [ -f "data/todos.db" ]; then
    echo -e "   ${GREEN}✅ Database file exists${NC}"
  else
    echo -e "   ${YELLOW}⚠️  Database not yet created (will be created on first run)${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Data directory not yet created (normal - will be created on first run)${NC}"
fi

# 9. Check curl availability
echo -n "9. Checking curl (for testing)... "
if command -v curl &> /dev/null; then
  echo -e "${GREEN}✅ curl available${NC}"
else
  echo -e "${YELLOW}⚠️  curl not found (needed for manual testing)${NC}"
fi

# 10. Check sqlite3 (optional)
echo -n "10. Checking sqlite3 (optional)... "
if command -v sqlite3 &> /dev/null; then
  echo -e "${GREEN}✅ sqlite3 available${NC}"
else
  echo -e "${YELLOW}⚠️  sqlite3 not found (optional - for database inspection)${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✅ Installation verification complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure JWT_SECRET is set in .env (if not already)"
echo "2. Start the server: npm run dev"
echo "3. Verify health check: curl http://localhost:3000/"
echo "4. Run manual tests: see MANUAL_TESTING.md"
echo ""
