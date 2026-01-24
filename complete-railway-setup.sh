#!/bin/bash

# Complete Railway Setup and Deployment
# This script handles the entire Railway deployment process

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}🚂 Complete Railway Deployment Setup${NC}"
echo "=========================================="
echo ""

# Step 1: Check Railway CLI
echo -e "${YELLOW}Step 1: Checking Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
else
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

# Step 2: Check Authentication
echo ""
echo -e "${YELLOW}Step 2: Checking authentication...${NC}"
if railway whoami &> /dev/null; then
    USER=$(railway whoami)
    echo -e "${GREEN}✅ Authenticated as: $USER${NC}"
else
    echo -e "${RED}❌ Not authenticated${NC}"
    echo ""
    echo "Please authenticate first:"
    echo "  railway login"
    echo ""
    echo "This will open your browser for authentication."
    echo "After authentication, run this script again."
    exit 1
fi

# Step 3: Navigate to backend
cd "$(dirname "$0")/backend"

# Step 4: Link to Railway project
echo ""
echo -e "${YELLOW}Step 3: Linking to Railway project...${NC}"
if [ -f .railway/project.json ]; then
    echo -e "${GREEN}✅ Already linked to Railway project${NC}"
    PROJECT_ID=$(cat .railway/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    echo "   Project ID: $PROJECT_ID"
else
    echo "Linking to Railway project..."
    echo "Please select 'SanjayCommNew' when prompted"
    railway link
    echo -e "${GREEN}✅ Linked successfully${NC}"
fi

# Step 5: Add MySQL Database
echo ""
echo -e "${YELLOW}Step 4: Configuring MySQL database...${NC}"
if railway variables 2>/dev/null | grep -q MYSQLHOST; then
    echo -e "${GREEN}✅ MySQL database already configured${NC}"
    MYSQL_HOST=$(railway variables 2>/dev/null | grep MYSQLHOST | awk '{print $2}')
    echo "   MySQL Host: $MYSQL_HOST"
else
    echo "Adding MySQL database..."
    railway add mysql
    sleep 3
    if railway variables 2>/dev/null | grep -q MYSQLHOST; then
        echo -e "${GREEN}✅ MySQL database added${NC}"
    else
        echo -e "${YELLOW}⚠️  MySQL variables not found. Please add MySQL service manually in Railway dashboard.${NC}"
    fi
fi

# Step 6: Set Environment Variables
echo ""
echo -e "${YELLOW}Step 5: Setting environment variables...${NC}"
railway variables set SPRING_PROFILES_ACTIVE=prod 2>/dev/null && echo -e "${GREEN}✅ SPRING_PROFILES_ACTIVE=prod${NC}" || echo -e "${YELLOW}⚠️  Variable may already be set${NC}"

# Step 7: Configure Domain
echo ""
echo -e "${YELLOW}Step 6: Configuring public domain...${NC}"
DOMAIN=$(railway domain 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
if [ -z "$DOMAIN" ]; then
    echo "Generating domain..."
    railway domain generate 2>&1
    sleep 2
    DOMAIN=$(railway domain 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
fi

if [ -n "$DOMAIN" ]; then
    echo -e "${GREEN}✅ Service exposed at: $DOMAIN${NC}"
    API_URL="$DOMAIN/api"
else
    echo -e "${YELLOW}⚠️  Could not get domain. Check Railway dashboard.${NC}"
    API_URL="https://your-railway-url.railway.app/api"
fi

# Step 8: Deploy
echo ""
echo -e "${YELLOW}Step 7: Deploying backend...${NC}"
echo "This may take a few minutes..."
railway up --detach

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo -e "${BOLD}📋 Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Project: SanjayCommNew"
echo "  Service: Backend (Java/Spring Boot)"
echo "  Database: MySQL (configured)"
echo "  Profile: prod"
if [ -n "$DOMAIN" ]; then
    echo "  API URL: $API_URL"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$DOMAIN" ]; then
    echo -e "${BOLD}📝 Next Steps:${NC}"
    echo ""
    echo "1. Update mobile app API URL:"
    echo "   Edit: src/utils/apiConfig.js"
    echo "   Change line 37 to:"
    echo "   return '$API_URL';"
    echo ""
    echo "2. Test the API:"
    echo "   curl $API_URL/products/services"
    echo ""
    echo "3. Monitor deployment:"
    echo "   railway logs --follow"
    echo ""
    echo "4. Check deployment status:"
    echo "   railway status"
fi

echo ""
echo -e "${GREEN}✨ Setup complete! Check Railway dashboard for deployment progress.${NC}"
