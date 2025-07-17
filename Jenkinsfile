pipeline {
  agent any

  environment {
    GITHUB_REPO = 'vatspratapsingh/devstream'
    WEBHOOK_ID = '558587274' // Update this if it changes
    NGROK_PORT = '8080'
  }

  stages {
    stage('Start ngrok') {
      steps {
        script {
          // Kill previous ngrok instance if any
          sh 'pkill ngrok || true'

          // Start ngrok in background
          sh "nohup ngrok http ${env.NGROK_PORT} > ngrok.log 2>&1 &"
          sleep 5 // Wait for ngrok to initialize
        }
      }
    }

    stage('Update GitHub Webhook') {
      steps {
        withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
          script {
            // Fetch public ngrok URL
            def ngrokUrl = sh(
              script: "curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url'",
              returnStdout: true
            ).trim()

            echo "🔄 Updating GitHub webhook with ngrok URL: ${ngrokUrl}/github-webhook/"

            // PATCH the GitHub webhook
            sh """
              curl -s -X PATCH \
              -H "Authorization: token ${GITHUB_TOKEN}" \
              -H "Accept: application/vnd.github.v3+json" \
              https://api.github.com/repos/${GITHUB_REPO}/hooks/${WEBHOOK_ID} \
              -d '{
                "config": {
                  "url": "${ngrokUrl}/github-webhook/",
                  "content_type": "json"
                }
              }'
            """
          }
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t devstream-backend ./backend'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'docker run --rm devstream-backend npm test'
      }
    }

    stage('Run Container') {
      steps {
        script {
          def portInUse = sh(
            script: "docker ps --format '{{.ID}} {{.Ports}}' | grep '0.0.0.0:3100' | awk '{print \$1}'",
            returnStdout: true
          ).trim()

          if (portInUse) {
            sh "docker rm -f ${portInUse}"
          }

        // Start new container on different host port
        sh 'docker run -d -p 3100:3000 devstream-backend'
      }
    }
  }
}