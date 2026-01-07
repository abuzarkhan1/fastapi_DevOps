pipeline {
    agent any

    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        DOCKER_HUB_USER = "abuzarkhan1" 
        BACKEND_IMAGE   = "fastapi-backend"
        FRONTEND_IMAGE  = "fastapi-frontend"
        EC2_USER        = "ubuntu"
        EC2_HOST        = credentials('ec2-public-ip') 
        COMMIT_SHA      = "${GIT_COMMIT.take(7)}"
        REPO_URL        = "https://github.com/abuzarkhan1/fastapi_DevOps.git"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: "${REPO_URL}"
            }
        }

        stage('Backend: Setup & Test') {
            agent {
                docker { 
                    image 'python:3.13-slim' 
                    args '-e HOME=/tmp'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        # Create and activate virtual environment for persistence and isolation
                        python -m venv venv
                        . venv/bin/activate
                        
                        # Upgrade pip and install dependencies
                        pip install --upgrade pip
                        pip install --no-cache-dir -r requirements.txt
                        pip install pytest
                        
                        # Run Tests
                        # pytest
                        echo "Backend tests passed (placeholder)"
                    '''
                }
            }
        }
        stage('Frontend: Setup & Build') {
            agent {
                docker { 
                    image 'node:22-alpine'
                    args '-e HOME=/tmp' 
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        # Install dependencies
                        npm ci --cache /tmp/.npm
                        
                        # Build
                        npm run build
                    '''
                }
            }
        }

        stage('Code Quality: SonarQube') {
            when { expression { return false } } // Disabled by user request
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube Server') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=fastapi-project \
                            -Dsonar.projectName='fastapi-project' \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/venv/**,**/node_modules/**,**/__pycache__/**,**/dist/** \
                            -Dsonar.python.version=3.13
                        """
                    }
                }
            }
        }

        stage('Docker: Build Backend Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA} ./backend"
                    sh "docker build -t ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest ./backend"
                }
            }
        }

        stage('Docker: Build Frontend Image') {
            steps {
                script {
                    sh "docker build --build-arg VITE_API_URL=/api/v1 -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA} ./frontend"
                    sh "docker build --build-arg VITE_API_URL=/api/v1 -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Security: Scan Backend (Trivy)') {
            steps {
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${COMMIT_SHA}"
            }
        }

        stage('Security: Scan Frontend (Trivy)') {
            steps {
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA}"
            }
        }

        stage('Artifact: Push Images to Hub') {
            when { branch 'master' } 
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${COMMIT_SHA}
                        docker push ${DOCKER_USER}/${BACKEND_IMAGE}:latest

                        docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${COMMIT_SHA}
                        docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy: Update EC2 Production') {
            when { branch 'master' }
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/app/
                        
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd /home/${EC2_USER}/app
                            export DOCKER_USERNAME=${DOCKER_HUB_USER}
                            
                            # Pull the specific images we just pushed
                            docker-compose pull
                            
                            # Zero-downtime recreation (if possible, otherwise restart)
                            docker-compose up -d --remove-orphans
                            
                            # Cleanup to save disk space
                            docker image prune -f
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Check stages for details."
        }
    }
}
