#!/bin/bash

# Token Testing Script

echo "🔑 Testing ngrok and GitHub tokens..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing ngrok token...${NC}"
echo "1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken"
echo "2. Copy your auth token"
echo "3. Run: ngrok config add-authtoken YOUR_TOKEN"
echo ""

echo -e "${YELLOW}Testing GitHub token...${NC}"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Generate new token with these permissions:"
echo "   - repo (Full control of private repositories)"
echo "   - admin:repo_hook (Full control of repository hooks)"
echo "   - workflow (Update GitHub Action workflows)"
echo "3. Copy the generated token"
echo ""

echo -e "${YELLOW}To test your tokens:${NC}"
echo ""

echo "Test ngrok token:"
echo "ngrok config add-authtoken YOUR_NGROK_TOKEN"
echo "ngrok http 8080"
echo ""

echo "Test GitHub token:"
echo "curl -H 'Authorization: token YOUR_GITHUB_TOKEN' https://api.github.com/user"
echo ""

echo -e "${GREEN}Once you have both tokens, add them to Jenkins:${NC}"
echo "1. Go to Jenkins → Manage Jenkins → Manage Credentials"
echo "2. Add ngrok token:"
echo "   - Kind: Secret text"
echo "   - Secret: YOUR_NGROK_TOKEN"
echo "   - ID: ngrok-token"
echo ""
echo "3. Add GitHub token:"
echo "   - Kind: Secret text"
echo "   - Secret: YOUR_GITHUB_TOKEN"
echo "   - ID: github-token"
echo ""

echo -e "${YELLOW}⚠️  Keep your tokens secure and never share them!${NC}"
