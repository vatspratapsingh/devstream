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
        // Run npm test in the built image
        sh 'docker run --rm devstream-backend npm test'
      }
    }

    stage('Run Container') {
      steps {
        // Remove any previously running container
        sh 'docker rm -f $(docker ps -aq --filter ancestor=devstream-backend) || true'

        // Run the new one
        sh 'docker run -d -p 3000:3000 devstream-backend'
      }
    }
  }
}