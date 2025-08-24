#!/bin/bash

# DevStream API Testing Script

echo "🧪 Testing DevStream API..."

# Base URL
BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -e "${YELLOW}Testing ${method} ${endpoint}...${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X ${method} \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "%{http_code}" -X ${method} \
            "${BASE_URL}${endpoint}")
    fi
    
    # Extract status code (last 3 characters)
    status_code=${response: -3}
    # Extract response body (everything except last 3 characters)
    response_body=${response%???}
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ ${method} ${endpoint} - Status: ${status_code}${NC}"
        echo "Response: $response_body" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ ${method} ${endpoint} - Expected: ${expected_status}, Got: ${status_code}${NC}"
        echo "Response: $response_body"
    fi
    echo ""
}

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test health endpoint
test_endpoint "GET" "/health" "" "200"

# Test root endpoint
test_endpoint "GET" "/" "" "200"

# Test get all notes
test_endpoint "GET" "/api/notes" "" "200"

# Test create note
test_endpoint "POST" "/api/notes" '{"title":"Test Note","content":"This is a test note"}' "201"

# Test get note by ID (using demo note)
test_endpoint "GET" "/api/notes/demo-1" "" "200"

# Test search functionality
test_endpoint "GET" "/api/notes?search=DevStream" "" "200"

# Test pagination
test_endpoint "GET" "/api/notes?page=1&limit=5" "" "200"

echo "🎉 API testing completed!"
