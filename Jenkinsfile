pipeline {
    agent any

    tools {
        nodejs 'Nodejs' 
    }
    // Define parameters
    parameters {
        string(name: 'HOST_MACHINE_IP', defaultValue: '52.23.231.169', description: 'IP address of the host machine')
    }
    // Define environment variables
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub' 
        DOCKERHUB_REPO = 'salindadocker/fileuploder' 
        DOCKERHUB_API_URL = "https://hub.docker.com/v2/repositories/${DOCKERHUB_REPO}/"
        HOST_SSH_CREDENTIALS = 'hostmachine-ssh-id'
        HOST_MACHINE_IP = "${params.HOST_MACHINE_IP}" 
        HOST_MACHINE_USER = 'client' 
        MONGO_URI_CREDENTIALS_ID = 'mongo-url'
    }
    // Define stages
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        // Run unit tests using Jest
        stage('Run Unit Tests') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        // Build Docker image
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKERHUB_REPO}:${env.BUILD_ID}")
                }
            }
        }

        // Push Docker image
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

        // Set image to public
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
                    withCredentials([
                        sshUserPrivateKey(credentialsId: HOST_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY'),  
                        string(credentialsId: MONGO_URI_CREDENTIALS_ID, variable: 'MONGO_URI')
                    ]) {
                        withEnv(["SSH_KEY=$SSH_KEY", "MONGO_URI=$MONGO_URI"]) {
                        sh '''
                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ${HOST_MACHINE_USER}@${HOST_MACHINE_IP} '
                            docker pull ${DOCKERHUB_REPO}:latest
                            docker stop fileuploader || true
                            docker rm fileuploader || true
                            docker run -d -p 4000:4000 --name fileuploader \
                                -e MONGO_URI="$MONGO_URI" \
                                -e PORT="4000" \
                                ${DOCKERHUB_REPO}:latest
                        '
                        '''
                    }
                    }
                }
            }
        }
    }
}
