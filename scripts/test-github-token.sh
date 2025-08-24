#!/bin/bash

# GitHub Token Test Script

echo "🔑 Testing GitHub Personal Access Token..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step-by-step guide to get your GitHub PAT:${NC}"
echo ""
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Give it a name: 'DevStream Jenkins Pipeline'"
echo "4. Select these permissions:"
echo "   - ✅ repo (Full control of private repositories)"
echo "   - ✅ admin:repo_hook (Full control of repository hooks)"
echo "   - ✅ workflow (Update GitHub Action workflows)"
echo "5. Click 'Generate token'"
echo "6. COPY THE TOKEN IMMEDIATELY (you won't see it again!)"
echo ""

echo -e "${YELLOW}To test your token, run:${NC}"
echo "curl -H 'Authorization: token YOUR_GITHUB_TOKEN' https://api.github.com/user"
echo ""

echo -e "${YELLOW}Expected response:${NC}"
echo '{
  "login": "your-username",
  "id": 123456,
  "name": "Your Name",
  ...
}'
echo ""

echo -e "${GREEN}Once you have the token:${NC}"
echo "1. Go to Jenkins → Manage Jenkins → Manage Credentials"
echo "2. Add new credential:"
echo "   - Kind: Secret text"
echo "   - Secret: YOUR_GITHUB_TOKEN"
echo "   - ID: github-token"
echo "   - Description: GitHub personal access token"
echo ""

echo -e "${YELLOW}⚠️  Security Tips:${NC}"
echo "- Never share your token"
echo "- Store it securely"
echo "- Set an expiration date"
echo "- Use minimal required permissions"
