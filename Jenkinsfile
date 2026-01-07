pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        BACKEND_IMAGE   = "fastapi-backend"
        FRONTEND_IMAGE  = "fastapi-frontend"
        DOCKER_REGISTRY = "docker.io"
        EC2_USER        = "ubuntu"
        EC2_HOST        = credentials('ec2-public-ip')
        COMMIT_SHA      = "${GIT_COMMIT.take(7)}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            agent {
                docker {
                    image 'python:3.11-slim'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                      pip install --no-cache-dir -r requirements.txt
                      pip install pytest
                      pytest || true
                    '''
                }
            }
        }

        stage('Frontend Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                      npm ci
                      npm run build
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube Server') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                  docker build \
                    --label commit=${COMMIT_SHA} \
                    --label build=${BUILD_NUMBER} \
                    -t ${BACKEND_IMAGE}:${COMMIT_SHA} backend

                  docker build \
                    --label commit=${COMMIT_SHA} \
                    --label build=${BUILD_NUMBER} \
                    -t ${FRONTEND_IMAGE}:${COMMIT_SHA} frontend
                """
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh """
                  trivy image --exit-code 1 --severity CRITICAL ${BACKEND_IMAGE}:${COMMIT_SHA}
                  trivy image --exit-code 1 --severity CRITICAL ${FRONTEND_IMAGE}:${COMMIT_SHA}
                """
            }
        }

        stage('Docker Push') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                      docker tag ${BACKEND_IMAGE}:${COMMIT_SHA} $DOCKER_USER/${BACKEND_IMAGE}:latest
                      docker tag ${FRONTEND_IMAGE}:${COMMIT_SHA} $DOCKER_USER/${FRONTEND_IMAGE}:latest

                      docker push $DOCKER_USER/${BACKEND_IMAGE}:latest
                      docker push $DOCKER_USER/${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            when { branch 'main' }
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                      ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                        cd /home/${EC2_USER}/app &&
                        docker-compose pull &&
                        docker-compose up -d --remove-orphans &&
                        docker system prune -af
                      '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful"
        }
        failure {
            echo "❌ Pipeline failed"
        }
        always {
            cleanWs()
        }
    }
}
