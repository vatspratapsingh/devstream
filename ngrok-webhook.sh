GITHUB_TOKEN="$GITHUB_PAT"#!/bin/bash

# -------------- Configuration ---------------- #
REPO_OWNER="vatspratapsingh"
REPO_NAME="devstream"
WEBHOOK_ID="558587274"  # example: 12345678
GITHUB_TOKEN="${GITHUB_TOKEN}"  # Uses environment variable
PORT=8080
# --------------------------------------------- #

# Kill previous ngrok process (optional but safe)
pkill -f ngrok

echo "Starting ngrok on port $PORT..."
ngrok http $PORT > /dev/null &

# Wait for ngrok to start
sleep 3

# Get public URL from ngrok
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels \
  | jq -r '.tunnels[0].public_url')

echo "ngrok URL is: $NGROK_URL"

# Update GitHub webhook
echo "Updating GitHub webhook..."

curl -s -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/hooks/$WEBHOOK_ID \
  -d '{
    "config": {
      "url": "'"$NGROK_URL"'/github-webhook/",
      "content_type": "json"
    }
  }' | jq .

echo "✅ Webhook updated successfully!"
