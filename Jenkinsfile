pipeline {
  agent any

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t devstream-backend ./backend'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'echo "✅ Tests passed (placeholder)"'
      }
    }

    stage('Run Container') {
      steps {
        // 👇 Add this: stop old containers based on this image
        sh 'docker rm -f $(docker ps -aq --filter ancestor=devstream-backend) || true'

        // Run the new one
        sh 'docker run -d -p 3000:3000 devstream-backend'
      }
    }
  }
}