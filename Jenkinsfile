pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub' 
        DOCKERHUB_REPO = 'salindadocker/fileuploder' 
        DOCKERHUB_API_URL = "https://hub.docker.com/v2/repositories/${DOCKERHUB_REPO}/"
        HOST_SSH_CREDENTIALS ="hostmachine-ssh-id"
        HOST_MACHINE_IP = '54.221.77.162' 
        HOST_MACHINE_USER = 'client' 
        MONGO_URI_CREDENTIALS_ID = 'mongo-url'
    }
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

        stage('Deploy to Host Machine') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: HOST_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY'), 
                                     string(credentialsId: MONGO_URI_CREDENTIALS_ID, variable: 'MONGO_URI')]) {
                        sh """
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${env.HOST_MACHINE_USER}@${env.HOST_MACHINE_IP} '
                            docker pull ${DOCKERHUB_REPO}:latest
                            docker stop fileuploader || true
                            docker rm fileuploader || true
                            docker run -d -p 4000:4000 --name fileuploader \
                                -e MONGO_URI="$MONGO_URI" \
                                -e PORT="4000" \
                                ${DOCKERHUB_REPO}:latest
                        '
                        """
                    }
            }
        }
    }
}
