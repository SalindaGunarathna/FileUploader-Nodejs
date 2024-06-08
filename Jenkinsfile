pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub' 
        DOCKERHUB_REPO = 'salindadocker/fileuploder' 
        DOCKERHUB_API_URL = "https://hub.docker.com/v2/repositories/${DOCKERHUB_REPO}/"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKERHUB_REPO}:${env.BUILD_ID}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push("${env.BUILD_ID}")
                        dockerImage.push("latest")
                    }
                }
            }
        }

        stage('Set Image to Public') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                        sh """
                        curl -u $DOCKERHUB_USERNAME:$DOCKERHUB_TOKEN \
                             -X PATCH \
                             -H "Content-Type: application/json" \
                             -d '{"is_private":false}' \
                             $DOCKERHUB_API_URL
                        """
                    }
                }
            }
        }
    }
}
