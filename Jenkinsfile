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
                echo "Removing old container if it exists..."
                docker rm -f spotify-app || true

                echo "Starting new container on port 8082..."
                docker run -d --name spotify-app -p 8082:80 spotify-clone:latest
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
