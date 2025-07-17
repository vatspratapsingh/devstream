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
          def portInUse = sh(
            script: "docker ps --format '{{.ID}} {{.Ports}}' | grep '0.0.0.0:3000' | awk '{print \$1}'",
            returnStdout: true
          ).trim()
          if (portInUse) {
            sh "docker rm -f ${portInUse}"
          }
        }

        // Run the new container
        sh 'docker run -d -p 3100:3000 devstream-backend'     
      }
    }
  }
}