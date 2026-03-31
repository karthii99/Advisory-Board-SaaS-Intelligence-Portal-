require('dotenv').config();

console.log('=== Grok API Key Analysis ===');
console.log('Key:', process.env.GROK_API_KEY);
console.log('Length:', process.env.GROK_API_KEY.length);

// Check if it's actually an OpenAI key disguised as Grok
const key = process.env.GROK_API_KEY;
if (key.startsWith('sk-proj-')) {
  console.log('❌ This appears to be an OpenAI key, not a Grok key');
  console.log('OpenAI keys start with sk-proj-');
  console.log('Grok keys should start with xai- or similar format');
} else if (key.startsWith('xai-')) {
  console.log('✅ This appears to be a valid Grok key format');
} else {
  console.log('🤔 Unknown key format');
}

// Test a simple Grok API call
const axios = require('axios');

async function testGrokAPI() {
  try {
    console.log('\n=== Testing Grok API ===');
    
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello' }
        ],
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response:', response.data);
    
  } catch (error) {
    console.error('❌ Grok API Error:', error.response?.data || error.message);
  }
}

testGrokAPI();
