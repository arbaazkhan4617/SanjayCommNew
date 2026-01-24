#!/bin/bash

# Railway Deployment Script
# Run this after: railway login

set -e

echo "🚂 Railway Backend Deployment"
echo "=============================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    exit 1
fi

# Check authentication
if ! railway whoami &> /dev/null; then
    echo "❌ Not authenticated. Please run: railway login"
    exit 1
fi

echo "✅ Authenticated as: $(railway whoami)"
echo ""

# Navigate to backend
cd backend

echo "📦 Step 1: Linking to Railway project..."
if [ ! -f .railway/project.json ]; then
    railway link
else
    echo "   Already linked"
fi

echo ""
echo "🔧 Step 2: Configuring service settings..."
# Railway should auto-detect from railway.json and nixpacks.toml
echo "   ✓ Root directory: backend (automatic)"
echo "   ✓ Build command: mvn clean package -DskipTests"
echo "   ✓ Start command: java -jar target/integrators-backend-1.0.0.jar"

echo ""
echo "🗄️  Step 3: Checking MySQL database..."
# Check if MySQL is already added
if railway variables 2>/dev/null | grep -q MYSQLHOST; then
    echo "   ✓ MySQL database already configured"
else
    echo "   Adding MySQL database..."
    railway add mysql
    echo "   ✓ MySQL database added"
fi

echo ""
echo "🔐 Step 4: Setting environment variables..."
# Set Spring profile
railway variables set SPRING_PROFILES_ACTIVE=prod 2>/dev/null || echo "   Variable already set"

# Verify MySQL variables exist
echo "   Checking MySQL variables..."
if railway variables 2>/dev/null | grep -q MYSQLHOST; then
    echo "   ✓ MySQL variables configured"
else
    echo "   ⚠️  MySQL variables not found. Make sure MySQL service is added."
fi

echo ""
echo "🌐 Step 5: Exposing service..."
DOMAIN=$(railway domain 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
if [ -z "$DOMAIN" ]; then
    echo "   Generating domain..."
    railway domain generate
    DOMAIN=$(railway domain 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
fi

if [ -n "$DOMAIN" ]; then
    echo "   ✓ Service exposed at: $DOMAIN"
    echo ""
    echo "📝 Update src/utils/apiConfig.js with:"
    echo "   $DOMAIN/api"
else
    echo "   ⚠️  Could not get domain. Check Railway dashboard."
fi

echo ""
echo "🚀 Step 6: Deploying..."
railway up --detach

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Monitor deployment:"
echo "   railway logs --follow"
echo ""
echo "🔍 Check status:"
echo "   railway status"
echo ""
echo "🌐 Your API URL:"
if [ -n "$DOMAIN" ]; then
    echo "   $DOMAIN/api"
    echo ""
    echo "🧪 Test health endpoint:"
    echo "   curl $DOMAIN/api/products/services"
fi

echo ""
echo "✨ Done! Check Railway dashboard for deployment progress."
