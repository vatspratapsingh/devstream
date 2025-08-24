#!/bin/bash

# GitHub Webhook Setup Script for Jenkins
# This script sets up automatic triggers for Jenkins pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up GitHub Webhook for Jenkins...${NC}"

# Check if required tools are installed
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl is not installed${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is not installed${NC}"
    exit 1
fi

# Get ngrok URL
echo -e "${YELLOW}📡 Getting ngrok URL...${NC}"
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ "$NGROK_URL" = "null" ] || [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ ngrok is not running. Please start ngrok first:${NC}"
    echo -e "${YELLOW}   ngrok http 8080${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ngrok URL: ${NGROK_URL}${NC}"

# Check if GitHub token is available
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}🔑 Please enter your GitHub Personal Access Token:${NC}"
    echo -e "${YELLOW}   (Get it from: https://github.com/settings/tokens)${NC}"
    read -s GITHUB_TOKEN
    echo
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ GitHub token is required${NC}"
    exit 1
fi

# GitHub repository details
REPO_OWNER="vatspratapsingh"
REPO_NAME="DevStream"
WEBHOOK_URL="${NGROK_URL}/github-webhook/"

echo -e "${YELLOW}📋 Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
echo -e "${YELLOW}🔗 Webhook URL: ${WEBHOOK_URL}${NC}"

# Check if webhook already exists
echo -e "${YELLOW}🔍 Checking existing webhooks...${NC}"
EXISTING_WEBHOOK=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/hooks" | \
    jq -r ".[] | select(.config.url == \"${WEBHOOK_URL}\") | .id")

if [ "$EXISTING_WEBHOOK" != "" ]; then
    echo -e "${YELLOW}🔄 Updating existing webhook (ID: ${EXISTING_WEBHOOK})...${NC}"
    
    # Update existing webhook
    curl -X PATCH \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/hooks/${EXISTING_WEBHOOK}" \
        -d "{
            \"config\": {
                \"url\": \"${WEBHOOK_URL}\",
                \"content_type\": \"json\",
                \"secret\": \"jenkins-webhook-secret\"
            },
            \"events\": [\"push\"],
            \"active\": true
        }"
    
    echo -e "${GREEN}✅ Webhook updated successfully!${NC}"
else
    echo -e "${YELLOW}🆕 Creating new webhook...${NC}"
    
    # Create new webhook
    curl -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/hooks" \
        -d "{
            \"name\": \"web\",
            \"config\": {
                \"url\": \"${WEBHOOK_URL}\",
                \"content_type\": \"json\",
                \"secret\": \"jenkins-webhook-secret\"
            },
            \"events\": [\"push\"],
            \"active\": true
        }"
    
    echo -e "${GREEN}✅ Webhook created successfully!${NC}"
fi

echo -e "${GREEN}🎉 GitHub webhook setup complete!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "${YELLOW}   1. Make sure Jenkins is running: brew services start jenkins-lts${NC}"
echo -e "${YELLOW}   2. Keep ngrok running: ngrok http 8080${NC}"
echo -e "${YELLOW}   3. Push code to GitHub to trigger the pipeline${NC}"
echo -e "${YELLOW}   4. Check Jenkins dashboard for build status${NC}"

# Test the webhook
echo -e "${YELLOW}🧪 Testing webhook...${NC}"
TEST_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-GitHub-Event: push" \
    -H "X-GitHub-Delivery: test-delivery-id" \
    -H "X-Hub-Signature-256: sha256=test" \
    "${WEBHOOK_URL}" \
    -d '{"ref": "refs/heads/main", "repository": {"full_name": "'${REPO_OWNER}'/'${REPO_NAME}'"}}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Webhook endpoint is accessible${NC}"
else
    echo -e "${RED}❌ Webhook endpoint test failed${NC}"
    echo -e "${YELLOW}   Make sure Jenkins is running and the webhook URL is correct${NC}"
fi
