#!/bin/bash

# ECS Service Control Script
# Easily start/stop the Fintrak API to manage costs

CLUSTER="fintrak-cluster"
SERVICE="fintrak-api-production"
REGION="eu-west-1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_usage() {
  echo "Usage: $0 {start|stop|status}"
  echo ""
  echo "Commands:"
  echo "  start   - Start the ECS service (desired count = 1)"
  echo "  stop    - Stop the ECS service (desired count = 0)"
  echo "  status  - Show current service status"
  exit 1
}

get_status() {
  aws ecs describe-services \
    --cluster $CLUSTER \
    --services $SERVICE \
    --region $REGION \
    --query 'services[0].[runningCount,desiredCount,status]' \
    --output text
}

show_status() {
  echo -e "${YELLOW}📊 Checking service status...${NC}"
  STATUS=$(get_status)

  if [ -z "$STATUS" ]; then
    echo -e "${RED}❌ Service not found${NC}"
    exit 1
  fi

  RUNNING=$(echo $STATUS | awk '{print $1}')
  DESIRED=$(echo $STATUS | awk '{print $2}')
  STATE=$(echo $STATUS | awk '{print $3}')

  echo ""
  echo "Service: $SERVICE"
  echo "Cluster: $CLUSTER"
  echo "Status: $STATE"
  echo "Running tasks: $RUNNING"
  echo "Desired tasks: $DESIRED"
  echo ""

  if [ "$RUNNING" -gt 0 ]; then
    echo -e "${GREEN}✅ Service is RUNNING${NC}"

    # Get the public IP
    echo -e "\n${YELLOW}🌐 Getting API endpoint...${NC}"
    TASK_ARN=$(aws ecs list-tasks \
      --cluster $CLUSTER \
      --service-name $SERVICE \
      --region $REGION \
      --query 'taskArns[0]' \
      --output text)

    if [ "$TASK_ARN" != "None" ] && [ -n "$TASK_ARN" ]; then
      ENI_ID=$(aws ecs describe-tasks \
        --cluster $CLUSTER \
        --tasks $TASK_ARN \
        --region $REGION \
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
        --output text)

      PUBLIC_IP=$(aws ec2 describe-network-interfaces \
        --network-interface-ids $ENI_ID \
        --region $REGION \
        --query 'NetworkInterfaces[0].Association.PublicIp' \
        --output text)

      echo ""
      echo "API Endpoint: http://$PUBLIC_IP:3000"
      echo "API Docs: http://$PUBLIC_IP:3000/api/docs"
    fi
  else
    echo -e "${RED}⏸️  Service is STOPPED${NC}"
  fi
}

start_service() {
  echo -e "${YELLOW}🚀 Starting ECS service...${NC}"

  aws ecs update-service \
    --cluster $CLUSTER \
    --service $SERVICE \
    --desired-count 1 \
    --region $REGION \
    --query 'service.[serviceName,desiredCount]' \
    --output text > /dev/null

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Service started successfully${NC}"
    echo ""
    echo "⏳ Waiting for task to start (this may take 1-2 minutes)..."

    aws ecs wait services-stable \
      --cluster $CLUSTER \
      --services $SERVICE \
      --region $REGION

    echo ""
    show_status
  else
    echo -e "${RED}❌ Failed to start service${NC}"
    exit 1
  fi
}

stop_service() {
  echo -e "${YELLOW}⏸️  Stopping ECS service...${NC}"

  aws ecs update-service \
    --cluster $CLUSTER \
    --service $SERVICE \
    --desired-count 0 \
    --region $REGION \
    --query 'service.[serviceName,desiredCount]' \
    --output text > /dev/null

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Service stopped successfully${NC}"
    echo ""
    echo "💰 Cost savings: ~\$0.30/day (~\$9/month)"
  else
    echo -e "${RED}❌ Failed to stop service${NC}"
    exit 1
  fi
}

# Main script
case "${1}" in
  start)
    start_service
    ;;
  stop)
    stop_service
    ;;
  status)
    show_status
    ;;
  *)
    show_usage
    ;;
esac
