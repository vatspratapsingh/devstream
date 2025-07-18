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

          withCredentials([string(credentialsId: 'ngrok-token', variable: 'NGROK_TOKEN')]) {
            sh 'ngrok config add-authtoken $NGROK_TOKEN'
          }

          // Start ngrok in background
          sh "nohup ngrok http http://localhost:${env.NGROK_PORT} > ngrok.log 2>&1 &"
          sleep 5 // Wait for ngrok to initialize

          // Print ngrok logs for debugging
          sh 'cat ngrok.log || echo "ngrok log not found"'
        }
      }
    }

    stage('Update GitHub Webhook') {
      steps {
        withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
          script {
            def ngrokUrl = ""
            def attempts = 0
            while (attempts < 15) {
              def response = sh(script: "curl -s http://127.0.0.1:4040/api/tunnels", returnStdout: true).trim()
              echo "🌐 NGROK Raw Response (attempt ${attempts + 1}): ${response}"

              if (response && response.contains("public_url")) {
                ngrokUrl = sh(script: "echo '${response}' | jq -r '.tunnels[0].public_url'", returnStdout: true).trim()
                break
              }

              attempts++
              sleep 2
            }

            if (!ngrokUrl) {
              error("❌ ngrok URL could not be retrieved after ${attempts} attempts")
            }

            echo "🔄 Updating GitHub webhook with ngrok URL: ${ngrokUrl}/github-webhook/"

            sh 'curl -s -X PATCH ' +
              '-H "Authorization: token ' + GITHUB_TOKEN + '" ' +
              '-H "Accept: application/vnd.github.v3+json" ' +
              'https://api.github.com/repos/' + GITHUB_REPO + '/hooks/' + WEBHOOK_ID + ' ' +
              '-d ' +
              "'{\"config\": {\"url\": \"" + ngrokUrl + "/github-webhook/\", \"content_type\": \"json\"}}'"
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
}
