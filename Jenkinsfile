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
          // Stop any container using port 3000
          def portInUse = sh(
            script: "docker ps --filter 'publish=3000' -q",
            returnStdout: true
          ).trim()
          if (portInUse) {
            sh "docker rm -f ${portInUse}"
          }
        }

        // Run the new container
        sh 'docker run -d -p 3000:3000 devstream-backend'
      }
    }
  }
}