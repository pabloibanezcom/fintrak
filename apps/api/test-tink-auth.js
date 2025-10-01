const axios = require('axios');
require('dotenv').config();

async function testTinkAuth() {
  const secretId = process.env.TINK_SECRET_ID;
  const secretKey = process.env.TINK_SECRET_KEY;

  console.log('Testing Tink/GoCardless Authentication...');
  console.log('Secret ID:', secretId ? `${secretId.substring(0, 8)}...` : 'NOT SET');
  console.log('Secret Key:', secretKey ? `${secretKey.substring(0, 8)}...` : 'NOT SET');
  console.log('');

  if (!secretId || !secretKey) {
    console.error('❌ Credentials not found in .env file');
    process.exit(1);
  }

  try {
    console.log('Attempting authentication...');
    const response = await axios.post(
      'https://bankaccountdata.gocardless.com/api/v2/token/new/',
      {
        secret_id: secretId,
        secret_key: secretKey,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('✅ Authentication successful!');
    console.log('Access token:', response.data.access.substring(0, 20) + '...');
    console.log('Token expires in:', response.data.access_expires, 'seconds');
    console.log('');

    // Test fetching institutions
    console.log('Testing institutions endpoint...');
    const institutionsResponse = await axios.get(
      'https://bankaccountdata.gocardless.com/api/v2/institutions/?country=ES',
      {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
          Accept: 'application/json',
        },
      }
    );

    console.log('✅ Institutions fetched successfully!');
    console.log(`Found ${institutionsResponse.data.length} institutions`);

    // Find BBVA
    const bbva = institutionsResponse.data.find(inst =>
      inst.name.toLowerCase().includes('bbva')
    );

    if (bbva) {
      console.log('');
      console.log('BBVA Bank found:');
      console.log('  ID:', bbva.id);
      console.log('  Name:', bbva.name);
      console.log('  BIC:', bbva.bic);
      console.log('  Countries:', bbva.countries.join(', '));
    } else {
      console.log('⚠️  BBVA not found in the list');
    }

  } catch (error) {
    console.error('❌ Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testTinkAuth();
