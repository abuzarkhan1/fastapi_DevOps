pipeline {
    agent any

    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        DOCKER_HUB_USER    = "abuzarkhan1" 
        BACKEND_IMAGE      = "fastapi-backend"
        FRONTEND_IMAGE     = "fastapi-frontend"
        EC2_USER           = "ubuntu"
        EC2_HOST           = credentials('ec2-public-ip') 
        COMMIT_SHA         = "${GIT_COMMIT.take(7)}"
        REPO_URL           = "https://github.com/abuzarkhan1/fastapi_DevOps.git"
        // SONAR_SCANNER_HOME = tool 'SonarScanner'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: "${REPO_URL}"
            }
        }

        stage('SonarQube Analysis - Backend') {
            when { expression { return false } }
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube Server') {
                        sh """
                            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=fastapi-backend \
                                -Dsonar.projectName="FastAPI Backend" \
                                -Dsonar.projectVersion=1.0 \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=venv/**,**/__pycache__/**,*.log \
                                -Dsonar.python.version=3.13
                        """
                    }
                }
            }
        }

        stage('SonarQube Analysis - Frontend') {
            when { expression { return false } }
            steps {
                dir('frontend') {
                    withSonarQubeEnv('SonarQube Server') {
                        sh """
                            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=fastapi-frontend \
                                -Dsonar.projectName="FastAPI Frontend" \
                                -Dsonar.projectVersion=1.0 \
                                -Dsonar.sources=src \
                                -Dsonar.exclusions=node_modules/**,dist/**,build/**,*.log
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            when { expression { return false } }
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            echo "Quality Gate failed: ${qg.status}"
                            currentBuild.result = 'UNSTABLE'
                        } else {
                            echo "Quality Gate passed!"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Backend Image..."
                    sh "docker build -t ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA} ./backend"
                    sh "docker tag ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA} ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"

                    echo "Building Frontend Image..."
                    sh "docker build --build-arg VITE_API_URL=/api/v1 -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA} ./frontend"
                    sh "docker tag ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA} ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Security Scan - Backend') {
            steps {
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA}"
            }
        }

        stage('Security Scan - Frontend') {
            steps {
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA}
                        docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                        docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA}
                        docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        # Ensure the target directory exists
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} 'mkdir -p /home/${EC2_USER}/app'
                        
                        # Copy the docker-compose file and monitoring configuration
                        scp -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/app/
                        scp -r -o StrictHostKeyChecking=no monitoring ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/app/
                        
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd /home/${EC2_USER}/app
                            export DOCKER_USERNAME=${DOCKER_HUB_USER}
                            
                            echo "Stopping and cleaning up existing containers..."
                            docker-compose down --remove-orphans || true
                            
                            echo "Pulling latest images from Docker Hub..."
                            docker-compose pull
                            
                            echo "Starting services in detached mode..."
                            docker-compose up -d --remove-orphans
                            
                            echo "Waiting for services to initialize..."
                            sleep 15
                            
                            echo "Deployment Status:"
                            docker-compose ps
                            
                            echo "Checking API logs for errors (last 20 lines):"
                            docker-compose logs --tail=20 api || true
                            
                            echo "Cleaning up dangling images..."
                            docker image prune -f
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            sh '''
                echo "Cleaning up workspace and Docker resources..."
                docker system prune -f || true
            '''
            cleanWs()
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check the logs."
        }
    }
}
