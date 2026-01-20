#!/bin/bash

# Deployment Script for Integrators App
# This script helps automate the deployment process

set -e

echo "🚀 Integrators App Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠ Railway CLI not found. Installing...${NC}"
        npm install -g @railway/cli
    else
        echo -e "${GREEN}✓ Railway CLI found${NC}"
    fi
}

# Check if Expo CLI is installed
check_expo_cli() {
    if ! command -v expo &> /dev/null; then
        echo -e "${YELLOW}⚠ Expo CLI not found. Installing...${NC}"
        npm install -g expo-cli eas-cli
    else
        echo -e "${GREEN}✓ Expo CLI found${NC}"
    fi
}

# Deploy backend to Railway
deploy_backend() {
    echo ""
    echo -e "${GREEN}📦 Deploying Backend to Railway...${NC}"
    echo ""
    
    cd backend
    
    # Check if railway is logged in
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}Please login to Railway:${NC}"
        railway login
    fi
    
    echo -e "${YELLOW}Select deployment method:${NC}"
    echo "1. Deploy from GitHub (Recommended)"
    echo "2. Deploy using Railway CLI"
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" == "1" ]; then
        echo -e "${GREEN}✓ Please deploy from Railway dashboard:${NC}"
        echo "  1. Go to railway.app"
        echo "  2. New Project → Deploy from GitHub"
        echo "  3. Select repository"
        echo "  4. Set Root Directory: backend"
        echo "  5. Add MySQL database"
        echo "  6. Set SPRING_PROFILES_ACTIVE=prod"
    elif [ "$choice" == "2" ]; then
        echo -e "${YELLOW}Deploying via Railway CLI...${NC}"
        railway up
    fi
    
    cd ..
}

# Deploy mobile app to Expo
deploy_mobile() {
    echo ""
    echo -e "${GREEN}📱 Deploying Mobile App to Expo...${NC}"
    echo ""
    
    # Check if logged in
    if ! expo whoami &> /dev/null; then
        echo -e "${YELLOW}Please login to Expo:${NC}"
        expo login
    fi
    
    # Update API URL if Railway URL is provided
    read -p "Enter your Railway backend URL (e.g., https://your-app.railway.app): " railway_url
    
    if [ ! -z "$railway_url" ]; then
        echo -e "${YELLOW}Updating API configuration...${NC}"
        # Remove trailing slash if present
        railway_url="${railway_url%/}"
        api_url="${railway_url}/api"
        
        # Update apiConfig.js
        sed -i.bak "s|https://your-app-name.railway.app/api|${api_url}|g" src/utils/apiConfig.js
        echo -e "${GREEN}✓ API URL updated to: ${api_url}${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}Select deployment method:${NC}"
    echo "1. Publish to Expo (Development)"
    echo "2. Build with EAS (Production)"
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" == "1" ]; then
        expo publish
    elif [ "$choice" == "2" ]; then
        echo -e "${YELLOW}Select platform:${NC}"
        echo "1. Android"
        echo "2. iOS"
        echo "3. Both"
        read -p "Enter choice (1, 2, or 3): " platform
        
        if [ "$platform" == "1" ]; then
            eas build --platform android
        elif [ "$platform" == "2" ]; then
            eas build --platform ios
        elif [ "$platform" == "3" ]; then
            eas build --platform all
        fi
    fi
}

# Main menu
main() {
    echo ""
    echo "What would you like to deploy?"
    echo "1. Backend to Railway"
    echo "2. Mobile App to Expo"
    echo "3. Both"
    echo "4. Exit"
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            check_railway_cli
            deploy_backend
            ;;
        2)
            check_expo_cli
            deploy_mobile
            ;;
        3)
            check_railway_cli
            check_expo_cli
            deploy_backend
            deploy_mobile
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            main
            ;;
    esac
}

# Run main function
main

echo ""
echo -e "${GREEN}✅ Deployment process completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Test your backend: curl https://your-app.railway.app/api/products/services"
echo "2. Test mobile app: Open Expo Go and scan QR code"
echo "3. Check deployment guides: See DEPLOYMENT.md for details"
