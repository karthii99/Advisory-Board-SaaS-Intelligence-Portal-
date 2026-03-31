const axios = require('axios');

async function debugSeedError() {
  try {
    console.log('🔍 Debugging seeding error...');
    
    const response = await axios.post('http://localhost:3000/api/clients/seed');
    
    console.log('✅ Request successful');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Request failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Request made but no response received');
    } else {
      console.error('Request setup error');
    }
  }
}

debugSeedError();
