pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/anujhres12/Spotify-Application.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t spotify-clone:latest .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop spotify-app || true
                docker rm spotify-app || true
                docker run -d --name spotify-app -p 8080:80 spotify-clone:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
