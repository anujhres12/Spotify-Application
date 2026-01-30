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
        docker rm -f spotify-app 2>/dev/null || true

        echo "Starting new container..."
        docker run -d --name spotify-app -p 8080:80 spotify-clone:latest
        '''
    }
}

    }

    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
