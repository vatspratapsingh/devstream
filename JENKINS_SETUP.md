# Jenkins Pipeline Setup Guide

## 🚀 **Jenkins Installation & Setup**

### **Step 1: Access Jenkins**
1. **Open your browser** and go to: `http://localhost:8080`
2. **Enter the initial admin password**: `74557d13ad03402899a1b57751fd0d73`
3. **Follow the setup wizard** to complete Jenkins installation

### **Step 2: Install Required Plugins**
During the setup wizard, install these plugins:
- ✅ **Pipeline** (for Jenkinsfile support)
- ✅ **Git** (for GitHub integration)
- ✅ **Docker** (for container builds)
- ✅ **Credentials** (for storing tokens)

### **Step 3: Create Admin User**
- **Username**: `admin`
- **Password**: Choose a strong password
- **Email**: Your email address

## 🔧 **Configure Jenkins for DevStream Pipeline**

### **Step 1: Install Additional Tools**

#### **Install ngrok**
```bash
# Install ngrok
brew install ngrok

# Or download from https://ngrok.com/download
```

#### **Install jq (JSON processor)**
```bash
brew install jq
```

### **Step 2: Set Up Credentials**

1. **Go to Jenkins Dashboard** → **Manage Jenkins** → **Manage Credentials**
2. **Click on "System"** → **Global credentials** → **Add Credentials**

#### **Add ngrok Token**
- **Kind**: Secret text
- **ID**: `ngrok-token`
- **Secret**: Your ngrok auth token (get from https://dashboard.ngrok.com/get-started/your-authtoken)
- **Description**: ngrok authentication token

#### **Add GitHub Token**
- **Kind**: Secret text
- **ID**: `github-token`
- **Secret**: Your GitHub personal access token
- **Description**: GitHub personal access token

### **Step 3: Configure ngrok**

Create ngrok configuration:
```bash
# Create ngrok config directory
mkdir -p ~/.ngrok2

# Create ngrok config file
cat > ~/.ngrok2/ngrok.yml << EOF
version: "2"
authtoken: YOUR_NGROK_TOKEN_HERE
tunnels:
  jenkins:
    proto: http
    addr: 8080
EOF
```

## 🏗️ **Create Jenkins Pipeline**

### **Step 1: Create New Pipeline Job**

1. **Go to Jenkins Dashboard** → **New Item**
2. **Enter item name**: `devstream-pipeline`
3. **Select**: **Pipeline**
4. **Click OK**

### **Step 2: Configure Pipeline**

#### **General Settings**
- ✅ **Discard old builds** (Keep last 10 builds)
- ✅ **This project is parameterized**
  - Add parameter: `GITHUB_REPO` (String parameter)
  - Default value: `vatspratapsingh/devstream`
  - Add parameter: `WEBHOOK_ID` (String parameter)
  - Default value: `558587274`

#### **Pipeline Definition**
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/vatspratapsingh/devstream.git`
- **Branch Specifier**: `*/main` (or your default branch)
- **Script Path**: `Jenkinsfile`

#### **Build Triggers**
- ✅ **Poll SCM** (optional, for automatic builds)
- ✅ **GitHub hook trigger for GITScm polling** (for webhook triggers)

### **Step 3: Save Configuration**

Click **Save** to create the pipeline.

## 🚀 **Running the Pipeline**

### **Method 1: Manual Build**
1. **Go to your pipeline**: `devstream-pipeline`
2. **Click "Build with Parameters"**
3. **Enter parameters** (or use defaults)
4. **Click "Build"**

### **Method 2: GitHub Webhook (Automatic)**
1. **Push code to GitHub**
2. **Pipeline will automatically trigger**
3. **Monitor build progress in Jenkins**

### **Method 3: Direct Jenkinsfile Execution**
```bash
# From your project directory
curl -X POST http://localhost:8080/job/devstream-pipeline/build \
  --user admin:YOUR_JENKINS_PASSWORD
```

## 📊 **Monitor Pipeline Execution**

### **View Build Logs**
1. **Click on build number** in Jenkins
2. **Click "Console Output"** to see real-time logs
3. **Monitor each stage** as it executes

### **Pipeline Stages**
1. **Setup Environment** - Clean up existing containers
2. **Start ngrok Tunnel** - Create public tunnel for webhooks
3. **Update GitHub Webhook** - Configure webhook URL
4. **Build Docker Image** - Create container image
5. **Run Tests** - Execute test suite
6. **Deploy Application** - Start container
7. **Post-Deployment Verification** - Test endpoints

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. ngrok Not Starting**
```bash
# Check ngrok installation
ngrok version

# Test ngrok manually
ngrok http 8080
```

#### **2. Docker Permission Issues**
```bash
# Ensure Docker is running
docker ps

# Check Docker permissions
docker info
```

#### **3. GitHub Webhook Issues**
- Verify GitHub token has correct permissions
- Check webhook URL is accessible
- Review webhook delivery logs in GitHub

#### **4. Jenkins Credentials**
- Verify credentials are correctly configured
- Check credential IDs match Jenkinsfile
- Ensure secrets are properly stored

### **Debug Commands**

#### **Check Jenkins Status**
```bash
# Check if Jenkins is running
brew services list | grep jenkins

# View Jenkins logs
tail -f /opt/homebrew/var/log/jenkins-lts/jenkins.log
```

#### **Test ngrok Tunnel**
```bash
# Check ngrok tunnels
curl -s http://127.0.0.1:4040/api/tunnels | jq .

# Test ngrok URL
curl -s https://your-ngrok-url.ngrok.io/health
```

#### **Test Docker Build**
```bash
# Build image manually
cd backend
docker build -t devstream-backend .

# Run container manually
docker run -d -p 3100:3000 devstream-backend
```

## 🎯 **Success Indicators**

### **Pipeline Success**
- ✅ All stages complete without errors
- ✅ Docker image built successfully
- ✅ Tests pass (17/17 tests)
- ✅ Container deployed and healthy
- ✅ API endpoints responding

### **Expected Output**
```
🎉 Pipeline completed!
📱 Application URL: http://localhost:3100
🏥 Health Check: http://localhost:3100/health
📚 API Docs: http://localhost:3100/
```

## 📈 **Next Steps**

1. **Set up GitHub webhook** for automatic triggers
2. **Configure email notifications** for build results
3. **Add monitoring** and alerting
4. **Set up staging/production environments**
5. **Implement blue-green deployments**

## 🔗 **Useful Links**

- **Jenkins Dashboard**: http://localhost:8080
- **Pipeline Documentation**: https://www.jenkins.io/doc/book/pipeline/
- **ngrok Dashboard**: https://dashboard.ngrok.com/
- **GitHub Webhooks**: https://docs.github.com/en/developers/webhooks-and-events

---

**Your DevStream Jenkins pipeline is now ready to automate your CI/CD workflow! 🚀**
