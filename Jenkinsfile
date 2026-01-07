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
                        # Create a deployment package locally
                        tar -czf deploy.tar.gz docker-compose.yml monitoring
                        
                        # Stop everything and clean up
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            if [ -d /home/${EC2_USER}/app ]; then
                                cd /home/${EC2_USER}/app
                                # Create temp .env to allow clean stop
                                echo "DOCKER_USERNAME=${DOCKER_HUB_USER}" > .env
                                docker-compose down --volumes --remove-orphans || true
                                cd .. && rm -rf app
                            fi
                            # Deep cleanup for fresh state
                            docker system prune -a -f --volumes || true
                            mkdir -p /home/${EC2_USER}/app
                        '
                        
                        # Upload and extract
                        scp -o StrictHostKeyChecking=no deploy.tar.gz ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/app/
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd /home/${EC2_USER}/app
                            tar -xzf deploy.tar.gz
                            rm deploy.tar.gz
                            
                            # Create .env file
                            echo "DOCKER_USERNAME=${DOCKER_HUB_USER}" > .env
                            
                            echo "Pulling images..."
                            docker-compose pull
                            
                            echo "Starting services..."
                            docker-compose up -d --remove-orphans
                            
                            echo "Waiting 20s for services to stabilize..."
                            sleep 20
                            
                            echo "Container Status (ps -a):"
                            docker-compose ps -a
                            
                            echo "Checking API Logs:"
                            docker-compose logs --tail=100 api || true
                            
                            echo "Checking Frontend Logs:"
                            docker-compose logs --tail=100 frontend || true
                            
                            echo "Checking Prometheus Logs:"
                            docker-compose logs --tail=100 prometheus || true
                        '
                        
                        # Cleanup local package
                        rm -f deploy.tar.gz
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
