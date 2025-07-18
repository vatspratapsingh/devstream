#!/bin/bash

echo "🔁 Starting Jenkins container..."
docker start jenkins

echo "🌐 Starting ngrok tunnel..."
# Kill any existing ngrok first
pkill ngrok || true
nohup ngrok http 8080 > ngrok.log 2>&1 &

echo "⏳ Waiting for ngrok to initialize..."
sleep 5

echo "🔎 Fetching new ngrok URL..."
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')

echo "🔄 Updating GitHub webhook..."
curl -s -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/vatspratapsingh/devstream/hooks/558587274 \
  -d '{
    "config": {
      "url": "'"$NGROK_URL"'/github-webhook/",
      "content_type": "json"
    }
  }'

echo "🚀 Triggering Jenkins pipeline (just push to GitHub or trigger from UI)"