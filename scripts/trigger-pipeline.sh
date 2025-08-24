#!/bin/bash

# Manual Jenkins Pipeline Trigger Script
# This script manually triggers the Jenkins pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Manually triggering Jenkins pipeline...${NC}"

# Check if Jenkins is running
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${RED}❌ Jenkins is not running on port 8080${NC}"
    echo -e "${YELLOW}   Start Jenkins: brew services start jenkins-lts${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Jenkins is running${NC}"

# Get Jenkins admin password
JENKINS_PASSWORD=$(cat ~/.jenkins/secrets/initialAdminPassword 2>/dev/null || echo "jenkins")

echo -e "${YELLOW}🔑 Using Jenkins password: ${JENKINS_PASSWORD}${NC}"

# Trigger the pipeline
echo -e "${YELLOW}📡 Triggering devstream-pipeline...${NC}"

RESPONSE=$(curl -s -w "%{http_code}" -X POST \
    "http://localhost:8080/job/devstream-pipeline/build" \
    --user "admin:${JENKINS_PASSWORD}")

HTTP_CODE="${RESPONSE: -3}"
RESPONSE_BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Pipeline triggered successfully!${NC}"
    echo -e "${BLUE}📊 Check build status at: http://localhost:8080/job/devstream-pipeline/${NC}"
else
    echo -e "${RED}❌ Failed to trigger pipeline (HTTP ${HTTP_CODE})${NC}"
    echo -e "${YELLOW}Response: ${RESPONSE_BODY}${NC}"
    
    # Try alternative method
    echo -e "${YELLOW}🔄 Trying alternative trigger method...${NC}"
    
    # Get CSRF token
    CSRF_TOKEN=$(curl -s -c cookies.txt \
        "http://localhost:8080/job/devstream-pipeline/" | \
        grep -o 'name="crumb" value="[^"]*"' | \
        cut -d'"' -f4)
    
    if [ -n "$CSRF_TOKEN" ]; then
        echo -e "${YELLOW}🔐 Got CSRF token: ${CSRF_TOKEN}${NC}"
        
        ALTERNATIVE_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
            -b cookies.txt \
            -H "Jenkins-Crumb: ${CSRF_TOKEN}" \
            "http://localhost:8080/job/devstream-pipeline/build" \
            --user "admin:${JENKINS_PASSWORD}")
        
        ALT_HTTP_CODE="${ALTERNATIVE_RESPONSE: -3}"
        
        if [ "$ALT_HTTP_CODE" = "201" ] || [ "$ALT_HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Pipeline triggered successfully (alternative method)!${NC}"
        else
            echo -e "${RED}❌ Alternative method also failed (HTTP ${ALT_HTTP_CODE})${NC}"
        fi
        
        rm -f cookies.txt
    else
        echo -e "${RED}❌ Could not get CSRF token${NC}"
    fi
fi

echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "${YELLOW}   1. Open Jenkins dashboard: http://localhost:8080${NC}"
echo -e "${YELLOW}   2. Go to: devstream-pipeline${NC}"
echo -e "${YELLOW}   3. Check the latest build status${NC}"
echo -e "${YELLOW}   4. View build logs for details${NC}"
