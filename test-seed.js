const axios = require('axios');

async function testSeeding() {
  try {
    console.log('🌱 Testing seeding functionality...');
    
    // First seeding attempt
    console.log('\n📦 First seeding attempt:');
    const response1 = await axios.post('http://localhost:3000/api/clients/seed');
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(response1.data, null, 2));
    
    // Second seeding attempt (should be idempotent)
    console.log('\n🔄 Second seeding attempt (should be idempotent):');
    const response2 = await axios.post('http://localhost:3000/api/clients/seed');
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(response2.data, null, 2));
    
    // Third seeding attempt (should still be idempotent)
    console.log('\n🔄 Third seeding attempt (should still be idempotent):');
    const response3 = await axios.post('http://localhost:3000/api/clients/seed');
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(response3.data, null, 2));
    
    console.log('\n✅ Seeding test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testSeeding();
