#!/bin/bash

# Quick Railway Deployment - Run after authentication
# Usage: ./railway-quick-deploy.sh

set -e

echo "🚂 Quick Railway Deployment"
echo "==========================="
echo ""

# Check if authenticated
if ! railway whoami &> /dev/null; then
    echo "❌ Not authenticated!"
    echo ""
    echo "Please run first:"
    echo "  railway login"
    echo ""
    echo "Or set API token:"
    echo "  export RAILWAY_TOKEN=your_token"
    exit 1
fi

echo "✅ Authenticated: $(railway whoami)"
echo ""

cd backend

# Link if not already linked
if [ ! -f .railway/project.json ]; then
    echo "📦 Linking to Railway project..."
    railway link
    echo "   Select your 'SanjayCommNew' project when prompted"
    echo ""
fi

# Add MySQL if not exists
echo "🗄️  Checking MySQL database..."
if ! railway variables 2>/dev/null | grep -q MYSQLHOST; then
    echo "   Adding MySQL database..."
    railway add mysql
    sleep 2
else
    echo "   ✓ MySQL already configured"
fi

# Set Spring profile
echo ""
echo "🔐 Setting environment variables..."
railway variables set SPRING_PROFILES_ACTIVE=prod 2>/dev/null || true

# Get or create domain
echo ""
echo "🌐 Configuring domain..."
DOMAIN=$(railway domain 2>/dev/null | tail -1 | grep -o 'https://[^ ]*' || echo "")
if [ -z "$DOMAIN" ]; then
    echo "   Generating domain..."
    railway domain generate 2>&1 | grep -o 'https://[^ ]*' | head -1 || echo ""
    DOMAIN=$(railway domain 2>/dev/null | tail -1 | grep -o 'https://[^ ]*' || echo "")
fi

# Deploy
echo ""
echo "🚀 Deploying backend..."
railway up --detach

echo ""
echo "✅ Deployment complete!"
echo ""
if [ -n "$DOMAIN" ]; then
    echo "🌐 Your API URL: $DOMAIN/api"
    echo ""
    echo "📝 Update src/utils/apiConfig.js:"
    echo "   return '$DOMAIN/api';"
    echo ""
    echo "🧪 Test endpoint:"
    echo "   curl $DOMAIN/api/products/services"
fi

echo ""
echo "📊 Monitor logs: railway logs --follow"
