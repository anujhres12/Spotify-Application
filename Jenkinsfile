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
    sh '''
    if [ "$(docker ps -q -f name=spotify-app)" ]; then
        docker stop spotify-app
        docker rm spotify-app
    fi

    docker run -d --name spotify-app -p 8080:80 spotify-clone:latest
    '''
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
