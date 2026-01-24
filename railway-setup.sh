#!/bin/bash

# Railway Deployment Setup Script
# This script configures and deploys the backend to Railway

set -e

echo "🚂 Railway Deployment Setup"
echo "============================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "⚠️  Not logged in to Railway"
    echo "Please run: railway login"
    echo "This will open a browser for authentication"
    exit 1
fi

echo "✅ Logged in to Railway"
railway whoami

# Navigate to backend directory
cd backend

echo ""
echo "📦 Linking to Railway project..."
railway link

echo ""
echo "🔧 Configuring service..."

# Set root directory (this should be automatic when linking from backend/)
echo "Setting root directory to: backend"

# Add MySQL database
echo ""
echo "🗄️  Adding MySQL database..."
railway add mysql

# Set environment variables
echo ""
echo "🔐 Setting environment variables..."
railway variables set SPRING_PROFILES_ACTIVE=prod

# Expose service
echo ""
echo "🌐 Exposing service..."
railway domain

# Deploy
echo ""
echo "🚀 Deploying..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Railway URL from: railway domain"
echo "2. Update src/utils/apiConfig.js with the Railway URL"
echo "3. Test the health endpoint: https://your-url.railway.app/api/products/services"
