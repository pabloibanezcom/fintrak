# GitHub Actions Setup for PR Deployments

This guide will help you set up automatic deployments to AWS ECS for every Pull Request.

## Required GitHub Secrets

Add these secrets to your repository settings (`Settings > Secrets and variables > Actions`):

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key  
- `AWS_ACCOUNT_ID` - Your 12-digit AWS account ID

### Network Configuration
- `SUBNET_IDS` - Comma-separated subnet IDs (e.g., "subnet-12345,subnet-67890")
- `SECURITY_GROUP_ID` - Security group ID for ECS tasks (e.g., "sg-12345")

## Setup Steps

### 1. Create IAM User for GitHub Actions

Create an IAM user with the following policies:

**Custom Policy - ECS and ECR Access:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecs:RegisterTaskDefinition",
                "ecs:CreateService",
                "ecs:UpdateService",
                "ecs:DeleteService",
                "ecs:DescribeServices",
                "ecs:DescribeTasks",
                "ecs:ListTasks",
                "ecs:ListTaskDefinitions",
                "ecs:DeregisterTaskDefinition"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:DeleteLogGroup",
                "logs:DescribeLogGroups"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeNetworkInterfaces"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/ecsTaskExecutionRole",
                "arn:aws:iam::*:role/ecsTaskRole"
            ]
        }
    ]
}
```

### 2. Get Network Information

Find your VPC subnets and security group:

```bash
# List VPC subnets (use public subnets in different AZs)
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=YOUR_VPC_ID" \
  --query 'Subnets[?MapPublicIpOnLaunch==`true`].[SubnetId,AvailabilityZone]' \
  --output table

# Create or find a security group that allows inbound traffic on port 3000
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=YOUR_VPC_ID" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table
```

### 3. Set Parameter Store Values

Make sure your environment variables are stored in AWS Parameter Store:

```bash
# Store your secrets (update with your actual values)
aws ssm put-parameter --name "/fintrak/mongodb-uri" --value "YOUR_MONGODB_ATLAS_CONNECTION_STRING" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/jwt-secret" --value "YOUR_JWT_SECRET" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-auth-ui" --value "YOUR_MI_AUTH_UI" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-api" --value "YOUR_MI_API" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-user" --value "YOUR_MI_USER" --type "SecureString" --region eu-west-1
aws ssm put-parameter --name "/fintrak/mi-pass" --value "YOUR_MI_PASS" --type "SecureString" --region eu-west-1
```

## How It Works

### PR Deployment Workflow (`deploy-pr.yml`)
- **Trigger**: When PRs are opened, updated, or reopened
- **Process**: 
  1. Builds Docker image with PR-specific tag
  2. Creates/updates ECS service with unique name (`fintrak-api-pr-{number}`)
  3. Deploys to isolated environment
  4. Comments on PR with preview URL

### Cleanup Workflow (`cleanup-pr.yml`)  
- **Trigger**: When PRs are closed/merged
- **Process**:
  1. Stops and deletes ECS service
  2. Deregisters task definitions
  3. Cleans up CloudWatch logs
  4. Comments on PR confirming cleanup

## Testing the Setup

1. Create a test PR with changes to `apps/api/`
2. Check the Actions tab for workflow progress
3. Look for the preview URL comment on your PR
4. Close the PR and verify cleanup occurs

## Costs

Each PR environment costs approximately:
- **Fargate**: ~$0.01-0.02/hour per container
- **Data transfer**: Minimal for testing
- **CloudWatch**: ~$0.50/month per log group

Most PR environments run for hours, not days, keeping costs very low.

## Troubleshooting

- **Deployment fails**: Check IAM permissions and Parameter Store values
- **Service won't start**: Verify security group allows inbound port 3000
- **Can't reach endpoint**: Ensure subnets are public with internet gateway
- **ECR push fails**: Confirm ECR repository exists and IAM user has push permissions