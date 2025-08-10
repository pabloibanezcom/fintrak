# AWS ECS Deployment Guide

## Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Docker installed** and running
3. **AWS Account** with ECS, ECR, and Parameter Store access

## Setup Steps

### 1. Create AWS Resources

```bash
# Create ECR repository
aws ecr create-repository --repository-name fintrak-api --region eu-west-1

# Create ECS cluster
aws ecs create-cluster --cluster-name fintrak-cluster --region eu-west-1

# Create CloudWatch log group
aws logs create-log-group --log-group-name /ecs/fintrak-api --region eu-west-1
```

### 2. Store Secrets in AWS Parameter Store

```bash
# Store your environment variables as secure parameters
aws ssm put-parameter --name "/fintrak/mongodb-uri" --value "YOUR_MONGODB_ATLAS_CONNECTION_STRING" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/jwt-secret" --value "YOUR_JWT_SECRET" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-auth-ui" --value "YOUR_MI_AUTH_UI" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-api" --value "YOUR_MI_API" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-user" --value "YOUR_MI_USER" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-pass" --value "YOUR_MI_PASS" --type "SecureString" --region eu-west-1
```

### 3. Create IAM Roles

Create two IAM roles:

**ecsTaskExecutionRole** (for ECS to pull images and logs):
- Attach policy: `AmazonECSTaskExecutionRolePolicy`
- Attach custom policy for Parameter Store access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameters",
                "ssm:GetParameter"
            ],
            "Resource": "arn:aws:ssm:eu-west-1:*:parameter/fintrak/*"
        }
    ]
}
```

**ecsTaskRole** (for your application):
- Basic role for application-level permissions

### 4. Create VPC and Security Groups

Set up networking (or use default VPC):
- Create security group allowing inbound traffic on port 3000
- Note subnet IDs for the service configuration

### 5. Create Application Load Balancer

```bash
# Create target group
aws elbv2 create-target-group \
    --name fintrak-api-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id YOUR_VPC_ID \
    --target-type ip \
    --health-check-path /health

# Create load balancer (requires 2 subnets in different AZs)
aws elbv2 create-load-balancer \
    --name fintrak-api-lb \
    --subnets subnet-12345 subnet-67890 \
    --security-groups sg-12345
```

### 6. Update Configuration Files

Update the following placeholders in the AWS config files:
- `YOUR_ACCOUNT_ID`: Your AWS account ID
- `YOUR_ECR_REPO_URI`: ECR repository URI 
- `YOUR_SUBNET_ID_1/2`: Your subnet IDs
- `YOUR_SECURITY_GROUP_ID`: Your security group ID
- `YOUR_TARGET_GROUP_ID`: Your target group ID

### 7. Deploy

```bash
# Run the deployment script
./aws/deploy.sh
```

## Monitoring

- **ECS Console**: Check service status and logs
- **CloudWatch**: View application logs at `/ecs/fintrak-api`
- **Load Balancer**: Monitor health checks and traffic

## Scaling

To scale your service:

```bash
aws ecs update-service \
    --cluster fintrak-cluster \
    --service fintrak-api-service \
    --desired-count 2
```

## Costs

- **Fargate**: ~$0.04048/vCPU/hour + ~$0.004445/GB/hour
- **Load Balancer**: ~$16.20/month
- **CloudWatch**: Minimal for logs
- **Parameter Store**: Free for standard parameters

Estimated monthly cost for 1 container (0.25 vCPU, 0.5GB): ~$15-20/month