#!/bin/bash

# Fintrak API AWS ECS Deployment Script
# Make sure to configure AWS CLI and replace placeholders before running

set -e

# Configuration - Update these values
AWS_REGION="eu-west-1"
ECR_REPO_NAME="fintrak-api"
CLUSTER_NAME="fintrak-cluster"
SERVICE_NAME="fintrak-api-service"
TASK_DEFINITION_NAME="fintrak-api"

echo "🚀 Starting Fintrak API deployment to AWS ECS..."

# 1. Build and tag Docker image
echo "📦 Building Docker image..."
cd apps/api
docker build -t $ECR_REPO_NAME:latest .
cd ../..

# 2. Get ECR login token
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# 3. Tag and push image to ECR
echo "📤 Pushing image to ECR..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

docker tag $ECR_REPO_NAME:latest $ECR_URI:latest
docker push $ECR_URI:latest

# 4. Update task definition with new image URI
echo "📝 Updating task definition..."
sed "s|YOUR_ECR_REPO_URI|$ECR_URI|g" aws/ecs-task-definition.json > aws/ecs-task-definition-updated.json
sed -i "s|YOUR_ACCOUNT_ID|$ACCOUNT_ID|g" aws/ecs-task-definition-updated.json

# 5. Register new task definition
echo "📋 Registering task definition..."
aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition-updated.json --region $AWS_REGION

# 6. Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $TASK_DEFINITION_NAME \
    --region $AWS_REGION

echo "✅ Deployment complete! Your API is updating..."
echo "📊 Check service status: aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"

# Cleanup
rm -f aws/ecs-task-definition-updated.json