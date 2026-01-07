#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to check if a command exists and say if it's installed
check_installation() {
    if command -v "$1" &> /dev/null; then
        echo "✅ $1 is installed correctly."
    else
        echo "❌ $1 installation FAILED."
        exit 1
    fi
}

echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 1. Install Docker
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
check_installation "docker"

# 2. Install Docker Compose (Standalone)
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
check_installation "docker-compose"

# 3. Install Java (Required for Jenkins)
echo "Installing OpenJDK 17..."
sudo apt-get install -y fontconfig openjdk-17-jre
check_installation "java"

# 4. Install Jenkins
echo "Installing Jenkins..."
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install -y jenkins

# 5. Install Trivy
echo "Installing Trivy..."
sudo apt-get install -y wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install -y trivy
check_installation "trivy"

# 6. Post-Installation Configuration
echo "Configuring permissions..."
sudo usermod -aG docker jenkins || true
sudo usermod -aG docker $USER || true

# Start and Enable Services
echo "Starting services..."
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl start docker
sudo systemctl enable docker

echo "--------------------------------------------------"
echo "VERIFYING ALL COMPONENTS..."
check_installation "docker"
check_installation "docker-compose"
check_installation "java"
check_installation "jenkins"
check_installation "trivy"

echo "--------------------------------------------------"
echo "SETUP COMPLETE!"
echo "Jenkins Initial Admin Password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo "--------------------------------------------------"
echo "Please REBOOT your server or logout/login for group changes to take effect."
