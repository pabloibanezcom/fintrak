# Daily Product Snapshots Setup

This guide explains how to configure automatic daily snapshots of user products in AWS production.

## Overview

The API includes a cron endpoint (`POST /api/cron/snapshots/daily`) that creates daily snapshots for all users. This endpoint is secured with an API key and should be triggered daily by AWS EventBridge.

## Setup Steps

### 1. Generate and Set API Key

Generate a secure API key and add it to your AWS secrets/environment variables:

```bash
# Generate a secure random key
openssl rand -base64 32

# Add to your ECS task definition environment variables:
CRON_API_KEY=<your-generated-key>
```

### 2. Create EventBridge Rule

#### Option A: Using AWS Console

1. Go to **AWS EventBridge** > **Rules**
2. Click **Create rule**
3. Configure:
   - **Name**: `fintrak-daily-snapshots`
   - **Description**: Create daily product snapshots for all users
   - **Event bus**: default
   - **Rule type**: Schedule
   - **Schedule pattern**: Cron expression
   - **Cron expression**: `0 2 * * ? *` (runs daily at 2 AM UTC)
4. Click **Next**
5. Select target:
   - **Target type**: AWS service
   - **Target**: API destination
   - **Create new API destination**:
     - **Name**: `fintrak-api-cron`
     - **API destination endpoint**: `http://<your-ecs-public-ip>:3000/api/cron/snapshots/daily`
     - **HTTP method**: POST
   - **Create new connection**:
     - **Connection name**: `fintrak-api-connection`
     - **Authorization type**: API key
     - **API key name**: `x-api-key`
     - **Value**: `<your-CRON_API_KEY>`
6. Click **Next** > **Next** > **Create rule**

#### Option B: Using AWS CLI

```bash
# Create API destination connection
aws events create-connection \
  --name fintrak-api-connection \
  --authorization-type API_KEY \
  --auth-parameters '{"ApiKeyAuthParameters":{"ApiKeyName":"x-api-key","ApiKeyValue":"<your-CRON_API_KEY>"}}'

# Create API destination
aws events create-api-destination \
  --name fintrak-api-cron \
  --connection-arn <connection-arn-from-previous-command> \
  --invocation-endpoint http://<your-ecs-public-ip>:3000/api/cron/snapshots/daily \
  --http-method POST \
  --invocation-rate-limit-per-second 1

# Create EventBridge rule
aws events put-rule \
  --name fintrak-daily-snapshots \
  --schedule-expression "cron(0 2 * * ? *)" \
  --state ENABLED \
  --description "Create daily product snapshots"

# Add target to rule
aws events put-targets \
  --rule fintrak-daily-snapshots \
  --targets "Id"="1","Arn"="<api-destination-arn>","HttpParameters"={},"RoleArn"="<events-role-arn>"
```

### 3. Test the Setup

You can manually test the endpoint using curl:

```bash
curl -X POST http://<your-api-url>/api/cron/snapshots/daily \
  -H "x-api-key: <your-CRON_API_KEY>"
```

Expected response:
```json
{
  "message": "Daily snapshots creation completed",
  "results": {
    "total": 5,
    "successful": 5,
    "failed": 0,
    "errors": []
  }
}
```

## Alternative: Using AWS Lambda

If you prefer to use Lambda instead of EventBridge:

1. Create a Lambda function that calls the cron endpoint
2. Set up CloudWatch Events to trigger the Lambda daily
3. Configure the Lambda with the API key in environment variables

## Monitoring

- Check CloudWatch Logs for the cron endpoint execution
- Monitor the ECS task logs for snapshot creation success/failures
- Set up CloudWatch alarms for failed snapshot creations

## Security Notes

- The `CRON_API_KEY` should be a strong, randomly generated string
- Store it securely in AWS Secrets Manager or ECS environment variables
- Restrict access to the cron endpoint by IP if possible
- Consider using VPC endpoints if your ECS service is in a private subnet

## Schedule Options

Common cron expressions for EventBridge:

- Daily at 2 AM UTC: `0 2 * * ? *`
- Daily at midnight UTC: `0 0 * * ? *`
- Every 12 hours: `0 */12 * * ? *`
- Weekly on Sunday at 2 AM: `0 2 ? * SUN *`

Note: EventBridge uses a 6-field cron expression format.
