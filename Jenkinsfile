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
        script {
          // Clean up old container *only if* it exists
          def oldContainers = sh(script: "docker ps -aq --filter ancestor=devstream-backend", returnStdout: true).trim()
          if (oldContainers) {
            sh "docker rm -f ${oldContainers}"
          }
        }

        // Now run the new one
        sh 'docker run -d -p 3000:3000 devstream-backend'
      }
    }
  }
}