#!/bin/bash

# Jenkins Fix Script

echo "🔧 Fixing Jenkins Configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Check Jenkins Status${NC}"
echo "=================================="

# Check if Jenkins is running
if brew services list | grep -q "jenkins-lts.*started"; then
    echo -e "${GREEN}✅ Jenkins is running${NC}"
else
    echo -e "${RED}❌ Jenkins is not running${NC}"
    echo "Starting Jenkins..."
    brew services start jenkins-lts
fi

echo ""
echo -e "${YELLOW}Step 2: Jenkins Configuration Steps${NC}"
echo "=============================================="
echo ""
echo "1. Open Jenkins: http://localhost:8080"
echo ""
echo "2. Go to: Manage Jenkins → Configure System"
echo ""
echo "3. Add Global Environment Variables:"
echo "   - Name: PATH"
echo "   - Value: /opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin"
echo ""
echo "4. Add Docker Host Variable:"
echo "   - Name: DOCKER_HOST"
echo "   - Value: unix:///var/run/docker.sock"
echo ""
echo "5. Save the configuration"
echo ""
echo "6. Restart Jenkins:"
echo "   brew services restart jenkins-lts"
echo ""

echo -e "${YELLOW}Step 3: Alternative - Use Docker Agent${NC}"
echo "=============================================="
echo ""
echo "If the above doesn't work, use the Docker agent version:"
echo "1. Copy Jenkinsfile.docker-agent to Jenkinsfile"
echo "2. Commit and push to GitHub"
echo "3. Re-run the pipeline"
echo ""

echo -e "${YELLOW}Step 4: Test Jenkins Access${NC}"
echo "=================================="

# Test Jenkins access
if curl -s http://localhost:8080 > /dev/null; then
    echo -e "${GREEN}✅ Jenkins is accessible at http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Jenkins is not accessible${NC}"
fi

echo ""
echo -e "${YELLOW}Step 5: Check Docker Access${NC}"
echo "=================================="

# Test Docker access
if docker ps > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is accessible${NC}"
else
    echo -e "${RED}❌ Docker is not accessible${NC}"
    echo "Make sure Docker Desktop is running"
fi

echo ""
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo "1. Follow the configuration steps above"
echo "2. Restart Jenkins"
echo "3. Try running the pipeline again"
echo ""
echo -e "${YELLOW}💡 Tip: You can also use the local pipeline script:${NC}"
echo "./scripts/run-pipeline-local.sh"
