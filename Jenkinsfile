pipeline {
  agent any

  stages {
    stage('Clone Repo') {
      steps {
        git url: 'https://github.com/vatspratapsingh/devstream.git', branch: 'main'
      }
    }

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
        sh 'docker run -d -p 3000:3000 devstream-backend'
      }
    }
  }
}
