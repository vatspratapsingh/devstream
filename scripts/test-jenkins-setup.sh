#!/bin/bash

# DevStream Jenkins Setup Test Script

echo "🧪 Testing Jenkins Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test command
test_command() {
    local command_name=$1
    local command_path=$2
    
    echo -e "${YELLOW}Testing ${command_name}...${NC}"
    
    if command -v "$command_path" &> /dev/null; then
        echo -e "${GREEN}✅ ${command_name} is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${command_name} is not installed${NC}"
        return 1
    fi
}

# Function to test service
test_service() {
    local service_name=$1
    local service_command=$2
    
    echo -e "${YELLOW}Testing ${service_name}...${NC}"
    
    if $service_command &> /dev/null; then
        echo -e "${GREEN}✅ ${service_name} is running${NC}"
        return 0
    else
        echo -e "${RED}❌ ${service_name} is not running${NC}"
        return 1
    fi
}

# Test required tools
echo "🔧 Testing Required Tools..."
test_command "Docker" "docker"
test_command "ngrok" "ngrok"
test_command "jq" "jq"
test_command "curl" "curl"

echo ""

# Test services
echo "🚀 Testing Services..."
test_service "Jenkins" "curl -s http://localhost:8080"
test_service "Docker" "docker ps"

echo ""

# Test Docker functionality
echo "🐳 Testing Docker Functionality..."
if docker ps &> /dev/null; then
    echo -e "${GREEN}✅ Docker daemon is accessible${NC}"
    
    # Test if our image exists
    if docker images | grep -q "devstream-backend"; then
        echo -e "${GREEN}✅ DevStream Docker image exists${NC}"
    else
        echo -e "${YELLOW}⚠️  DevStream Docker image not found (run: docker build -t devstream-backend .)${NC}"
    fi
else
    echo -e "${RED}❌ Docker daemon is not accessible${NC}"
fi

echo ""

# Test Jenkins access
echo "🔗 Testing Jenkins Access..."
if curl -s http://localhost:8080 &> /dev/null; then
    echo -e "${GREEN}✅ Jenkins is accessible at http://localhost:8080${NC}"
    echo -e "${YELLOW}📝 Initial admin password: $(cat ~/.jenkins/secrets/initialAdminPassword 2>/dev/null || echo 'Not found')${NC}"
else
    echo -e "${RED}❌ Jenkins is not accessible${NC}"
fi

echo ""

# Test ngrok functionality
echo "🌐 Testing ngrok..."
if ngrok version &> /dev/null; then
    echo -e "${GREEN}✅ ngrok is installed${NC}"
    echo -e "${YELLOW}📝 You'll need to configure ngrok auth token for webhook tunneling${NC}"
else
    echo -e "${RED}❌ ngrok is not working${NC}"
fi

echo ""

# Test project structure
echo "📁 Testing Project Structure..."
cd "$(dirname "$0")/.." || exit

required_files=("Jenkinsfile" "backend/Dockerfile" "backend/package.json" "backend/server.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        missing_files+=("$file")
    fi
done

echo ""

# Summary
echo "📊 Setup Summary:"
echo "=================="

if [ ${#missing_files[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All required files are present${NC}"
else
    echo -e "${RED}❌ Missing files: ${missing_files[*]}${NC}"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Complete Jenkins setup with the admin password"
echo "3. Install required plugins (Pipeline, Git, Docker, Credentials)"
echo "4. Configure credentials for ngrok and GitHub tokens"
echo "5. Create the pipeline job using the Jenkinsfile"
echo "6. Run your first build!"

echo ""
echo "📚 For detailed instructions, see: JENKINS_SETUP.md"
