# GitHub Webhook Setup for Jenkins

## Overview
This guide will help you set up automatic Jenkins pipeline triggers when you push code to GitHub.

## Prerequisites
- ✅ Jenkins running on localhost:8080
- ✅ ngrok running and exposing Jenkins
- ✅ GitHub Personal Access Token
- ✅ GitHub repository access

## Step-by-Step Setup

### Step 1: Get your ngrok URL
```bash
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```
**Example output:** `https://b1f3b2ccdff4.ngrok-free.app`

### Step 2: Configure Jenkins GitHub Plugin

1. **Open Jenkins Dashboard:**
   ```
   http://localhost:8080
   ```

2. **Go to Manage Jenkins > Configure System**

3. **Find "GitHub" section and configure:**
   - **GitHub Server:** Add new server
   - **Name:** `github`
   - **API URL:** `https://api.github.com`
   - **Credentials:** Add your GitHub Personal Access Token
   - **Test Connection:** Should show "Credentials verified for user vatspratapsingh"

### Step 3: Configure Pipeline for Webhooks

1. **Go to your pipeline:** `devstream-pipeline`

2. **Click "Configure"**

3. **In "Build Triggers" section:**
   - ✅ Check "GitHub hook trigger for GITScm polling"

4. **Save the configuration**

### Step 4: Set up GitHub Webhook

1. **Go to your GitHub repository:**
   ```
   https://github.com/vatspratapsingh/devstream
   ```

2. **Go to Settings > Webhooks**

3. **Click "Add webhook"**

4. **Configure the webhook:**
   - **Payload URL:** `https://YOUR_NGROK_URL/github-webhook/`
   - **Content type:** `application/json`
   - **Secret:** `jenkins-webhook-secret`
   - **Events:** Select "Just the push event"
   - **Active:** ✅ Checked

5. **Click "Add webhook"**

### Step 5: Test the Webhook

1. **Make a small change to your code:**
   ```bash
   echo "# Test webhook" >> README.md
   git add README.md
   git commit -m "Test webhook trigger"
   git push origin main
   ```

2. **Check Jenkins:**
   - Go to `http://localhost:8080/job/devstream-pipeline/`
   - You should see a new build triggered automatically

## Troubleshooting

### Issue 1: Webhook not triggering
**Solution:**
- Check ngrok is running: `curl http://localhost:4040/api/tunnels`
- Verify webhook URL is correct
- Check GitHub webhook delivery logs

### Issue 2: Jenkins not receiving webhooks
**Solution:**
- Ensure GitHub plugin is installed
- Check Jenkins logs: `tail -f ~/.jenkins/logs/jenkins.log`
- Verify webhook secret matches

### Issue 3: Build fails
**Solution:**
- Check build logs in Jenkins
- Verify Docker is running
- Check environment variables

## Manual Trigger (Alternative)

If webhook setup fails, you can manually trigger builds:

1. **Via Jenkins UI:**
   - Go to `http://localhost:8080/job/devstream-pipeline/`
   - Click "Build Now"

2. **Via Script:**
   ```bash
   ./scripts/trigger-pipeline.sh
   ```

## Verification

### Check Webhook Status
1. Go to GitHub repository > Settings > Webhooks
2. Click on your webhook
3. Check "Recent Deliveries" for success/failure

### Check Jenkins Builds
1. Go to `http://localhost:8080/job/devstream-pipeline/`
2. Look for recent builds
3. Check build status and logs

## Success Indicators

✅ **Webhook is working when:**
- GitHub shows successful webhook deliveries
- Jenkins automatically triggers builds on push
- Build logs show "Started by GitHub push"

✅ **Pipeline is working when:**
- Builds complete successfully
- Tests pass
- Docker image builds
- Application deploys

## Next Steps

Once webhook is working:
1. Push code changes to trigger automatic builds
2. Monitor build status in Jenkins
3. Check application deployment
4. Set up notifications (optional)

## Commands Reference

```bash
# Start ngrok
ngrok http 8080

# Check ngrok URL
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'

# Start Jenkins
brew services start jenkins-lts

# Check Jenkins status
brew services list | grep jenkins

# Manual trigger
./scripts/trigger-pipeline.sh

# Setup webhook
./scripts/setup-webhook.sh
```
