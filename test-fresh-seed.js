const axios = require('axios');

async function testFreshSeed() {
  try {
    console.log('🧹 Testing fresh seed after database reset...');
    
    // Reset database first
    console.log('🔄 Resetting database...');
    const { resetAndMigrate } = require('./src/db/reset-and-migrate');
    await resetAndMigrate();
    
    // Wait a moment for database to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test seeding
    console.log('🌱 Testing fresh seeding...');
    const response = await axios.post('http://localhost:3000/api/clients/seed');
    
    console.log('✅ Request successful');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Test second attempt (should be idempotent)
    console.log('\n🔄 Testing idempotency...');
    const response2 = await axios.post('http://localhost:3000/api/clients/seed');
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(response2.data, null, 2));
    
    console.log('\n✅ Fresh seed test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testFreshSeed();
