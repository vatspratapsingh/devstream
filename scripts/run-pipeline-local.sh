#!/bin/bash

# Local DevStream Pipeline Script
# This script runs the same steps as the Jenkins pipeline locally

echo "🚀 Running DevStream Pipeline Locally..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Environment variables
DOCKER_IMAGE="devstream-backend"
CONTAINER_NAME="devstream-backend-container"
HOST_PORT="3100"
CONTAINER_PORT="3000"

# Function to check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed or not in PATH${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 is available${NC}"
        return 0
    fi
}

# Function to run stage
run_stage() {
    local stage_name=$1
    local stage_command=$2
    
    echo -e "\n${YELLOW}🔧 Stage: $stage_name${NC}"
    echo "=================================="
    
    if eval "$stage_command"; then
        echo -e "${GREEN}✅ $stage_name completed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ $stage_name failed${NC}"
        return 1
    fi
}

# Check prerequisites
echo "🔍 Checking prerequisites..."
check_command "docker" || exit 1
check_command "git" || exit 1
check_command "curl" || exit 1

# Stage 1: Setup Environment
run_stage "Setup Environment" '
    echo "Cleaning up existing containers..."
    docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.ID}}" | xargs -r docker rm -f
    docker images --filter "dangling=true" --format "{{.ID}}" | xargs -r docker rmi
'

# Stage 2: Build Docker Image
run_stage "Build Docker Image" '
    echo "Building Docker image..."
    cd backend
    docker build -t $DOCKER_IMAGE:latest .
    docker tag $DOCKER_IMAGE:latest $DOCKER_IMAGE:$(date +%s)
    cd ..
'

# Stage 3: Run Tests
run_stage "Run Tests" '
    echo "Running tests in Docker container..."
    docker run --rm --name test-container $DOCKER_IMAGE:latest npm test
    docker rm -f test-container 2>/dev/null || true
'

# Stage 4: Deploy Application
run_stage "Deploy Application" '
    echo "Deploying application..."
    docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.ID}}" | xargs -r docker rm -f
    docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT --restart unless-stopped $DOCKER_IMAGE:latest
    sleep 5
'

# Stage 5: Verify Deployment
run_stage "Verify Deployment" '
    echo "Verifying deployment..."
    echo "Container status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "{{.Status}}"
    echo ""
    echo "Testing endpoints:"
    curl -f http://localhost:$HOST_PORT/health || echo "Health check failed"
    curl -f http://localhost:$HOST_PORT/ || echo "Root endpoint failed"
    curl -f http://localhost:$HOST_PORT/api/notes || echo "Notes endpoint failed"
'

# Final status
echo -e "\n${GREEN}🎉 Local Pipeline Completed!${NC}"
echo "=================================="
echo "📱 Application URL: http://localhost:$HOST_PORT"
echo "🏥 Health Check: http://localhost:$HOST_PORT/health"
echo "📚 API Docs: http://localhost:$HOST_PORT/"
echo ""
echo -e "${YELLOW}To stop the application:${NC}"
echo "docker stop $CONTAINER_NAME"
echo "docker rm $CONTAINER_NAME"
