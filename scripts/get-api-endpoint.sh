#!/bin/bash

# Script to get the current Fintrak API endpoint
# Usage: ./scripts/get-api-endpoint.sh

CLUSTER="fintrak-cluster"
REGION="eu-west-1"

echo "🔍 Finding running Fintrak API task..."

# Get the task ARN
TASK_ARN=$(aws ecs list-tasks \
  --cluster $CLUSTER \
  --region $REGION \
  --query 'taskArns[0]' \
  --output text)

if [ "$TASK_ARN" == "None" ] || [ -z "$TASK_ARN" ]; then
  echo "❌ No running tasks found in cluster '$CLUSTER'"
  exit 1
fi

echo "✅ Found task: $(basename $TASK_ARN)"

# Get the network interface ID
ENI_ID=$(aws ecs describe-tasks \
  --cluster $CLUSTER \
  --tasks $TASK_ARN \
  --region $REGION \
  --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
  --output text)

if [ -z "$ENI_ID" ]; then
  echo "❌ Could not find network interface"
  exit 1
fi

# Get the public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces \
  --network-interface-ids $ENI_ID \
  --region $REGION \
  --query 'NetworkInterfaces[0].Association.PublicIp' \
  --output text)

if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" == "None" ]; then
  echo "❌ No public IP assigned to task"
  exit 1
fi

echo ""
echo "🌐 Your Fintrak API endpoint:"
echo "   http://$PUBLIC_IP:3000"
echo ""
echo "📋 Test it:"
echo "   curl http://$PUBLIC_IP:3000/api/health"
