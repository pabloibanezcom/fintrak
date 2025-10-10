import json
import urllib3
import os

# Create HTTP client
http = urllib3.PoolManager()

def lambda_handler(event, context):
    """
    Lambda function to trigger daily snapshots via HTTP endpoint
    Triggered by EventBridge schedule
    """

    # Configuration from environment variables
    api_url = os.environ.get('API_URL', 'http://3.255.229.158:3000/api/cron/snapshots/daily')
    api_key = os.environ['CRON_API_KEY']

    try:
        # Make POST request to the cron endpoint
        response = http.request(
            'POST',
            api_url,
            headers={
                'x-api-key': api_key,
                'Content-Type': 'application/json'
            },
            timeout=300.0  # 5 minutes timeout
        )

        # Parse response
        response_data = json.loads(response.data.decode('utf-8'))

        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(response_data, indent=2)}")

        if response.status == 200:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Daily snapshots triggered successfully',
                    'results': response_data.get('results', {})
                })
            }
        else:
            raise Exception(f"API returned status {response.status}: {response_data}")

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }
