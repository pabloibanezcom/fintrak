# EventBridge Daily Snapshots - Setup Complete

## Summary

I've successfully set up AWS EventBridge to automatically trigger daily product snapshots. Here's what was configured:

## ✅ Completed Steps

### 1. Generated Secure API Key
- **CRON_API_KEY**: `mmuc5iCI73b3bMrx3BYe6ZaNjf8zWyP+c+5Moz3DjGI=`
- Stored in AWS Systems Manager Parameter Store: `/fintrak/cron-api-key`

### 2. Updated ECS Task Definition
- Added CRON_API_KEY to `aws/ecs-task-definition.json`
- Points to SSM parameter for secure storage

### 3. Created Lambda Function
- **Function Name**: `fintrak-daily-snapshots`
- **Runtime**: Python 3.12
- **Timeout**: 300 seconds (5 minutes)
- **Purpose**: Calls the HTTP cron endpoint since EventBridge requires HTTPS
- **Location**: `aws/lambda-daily-snapshots.py`

### 4. Created IAM Role
- **Role Name**: `fintrak-lambda-execution-role`
- **Policies**: AWSLambdaBasicExecutionRole (for CloudWatch logs)

### 5. Created EventBridge Rule
- **Rule Name**: `fintrak-daily-snapshots`
- **Schedule**: `cron(0 2 * * ? *)` - Daily at 2:00 AM UTC
- **Target**: Lambda function `fintrak-daily-snapshots`
- **Status**: ENABLED

## 🔧 Next Step Required

**Deploy the updated API with CRON_API_KEY:**

You need to trigger your GitHub Actions workflow "Deploy Main to AWS ECS" to deploy the updated task definition that includes the CRON_API_KEY environment variable.

1. Go to GitHub Actions
2. Select "Deploy Main to AWS ECS"
3. Click "Run workflow"
4. Select "production" environment
5. Wait for deployment to complete

## 🧪 Testing

After deploying the API with the new environment variable, test the setup:

### Test the API endpoint directly:
```bash
curl -X POST http://3.255.229.158:3000/api/cron/snapshots/daily \
  -H "x-api-key: mmuc5iCI73b3bMrx3BYe6ZaNjf8zWyP+c+5Moz3DjGI="
```

Expected response:
```json
{
  "message": "Daily snapshots creation completed",
  "results": {
    "total": <number_of_users>,
    "successful": <number_of_users>,
    "failed": 0,
    "errors": []
  }
}
```

### Test the Lambda function:
```bash
aws lambda invoke \
  --function-name fintrak-daily-snapshots \
  --region eu-west-1 \
  /tmp/response.json && cat /tmp/response.json
```

### Manually trigger the EventBridge rule (for testing):
```bash
aws events put-events \
  --entries '[{"Source":"manual","DetailType":"test","Detail":"{}"}]' \
  --region eu-west-1
```

Then invoke the rule:
```bash
aws lambda invoke \
  --function-name fintrak-daily-snapshots \
  --region eu-west-1 \
  /tmp/response.json
```

## 📊 Monitoring

### CloudWatch Logs
- **Lambda logs**: `/aws/lambda/fintrak-daily-snapshots`
- **ECS logs**: `/ecs/fintrak-api-production`

View Lambda logs:
```bash
aws logs tail /aws/lambda/fintrak-daily-snapshots --follow --region eu-west-1
```

### Check EventBridge Rule Status
```bash
aws events describe-rule \
  --name fintrak-daily-snapshots \
  --region eu-west-1
```

### View Recent Invocations
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=fintrak-daily-snapshots \
  --start-time 2025-10-09T00:00:00Z \
  --end-time 2025-10-11T00:00:00Z \
  --period 86400 \
  --statistics Sum \
  --region eu-west-1
```

## 🔐 Security Notes

1. The CRON_API_KEY is stored securely in AWS Systems Manager Parameter Store
2. Lambda function has minimal permissions (only CloudWatch Logs)
3. The cron endpoint validates the API key before processing
4. All resources are in the eu-west-1 region

## 📅 Schedule Details

- **Current Schedule**: Daily at 2:00 AM UTC (3:00 AM CET in winter, 4:00 AM CEST in summer)
- **Cron Expression**: `0 2 * * ? *`

### To Change the Schedule

Update the EventBridge rule:
```bash
# Daily at midnight UTC
aws events put-rule \
  --name fintrak-daily-snapshots \
  --schedule-expression "cron(0 0 * * ? *)" \
  --region eu-west-1

# Every 12 hours
aws events put-rule \
  --name fintrak-daily-snapshots \
  --schedule-expression "cron(0 */12 * * ? *)" \
  --region eu-west-1
```

## 🗑️ Cleanup (if needed)

To remove the setup:
```bash
# Delete EventBridge rule
aws events remove-targets --rule fintrak-daily-snapshots --ids 1 --region eu-west-1
aws events delete-rule --name fintrak-daily-snapshots --region eu-west-1

# Delete Lambda function
aws lambda delete-function --function-name fintrak-daily-snapshots --region eu-west-1

# Delete IAM role
aws iam detach-role-policy --role-name fintrak-lambda-execution-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name fintrak-lambda-execution-role

# Delete EventBridge connection
aws events delete-connection --name fintrak-api-cron-connection --region eu-west-1

# Delete SSM parameter
aws ssm delete-parameter --name /fintrak/cron-api-key --region eu-west-1
```

## 📁 Files Added/Modified

- `apps/api/src/controllers/CronController.ts` - Cron endpoint controller
- `apps/api/src/routes/cronRoutes.ts` - Cron routes
- `apps/api/src/app.ts` - Registered cron routes
- `aws/ecs-task-definition.json` - Added CRON_API_KEY
- `aws/lambda-daily-snapshots.py` - Lambda function code
- `aws/lambda-trust-policy.json` - IAM trust policy
- `apps/api/Fintrak-API.postman_collection.json` - Added cron endpoint
- `apps/api/DAILY_SNAPSHOTS_SETUP.md` - Setup documentation

## 🎯 Current Status

- ✅ AWS resources created
- ✅ EventBridge rule configured
- ⏳ **Waiting for API deployment with CRON_API_KEY**
- ⏳ Final testing pending

Once you deploy the API, the daily snapshots will run automatically at 2 AM UTC every day!
