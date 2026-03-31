require('dotenv').config();

console.log('=== Grok API Key Test ===');
console.log('GROK_API_KEY:', process.env.GROK_API_KEY ? 'SET' : 'NOT SET');

if (process.env.GROK_API_KEY) {
  console.log('Key format check:');
  console.log('Starts with sk-proj:', process.env.GROK_API_KEY.startsWith('sk-proj-'));
  console.log('Starts with sk-or-v1:', process.env.GROK_API_KEY.startsWith('sk-or-v1-'));
  console.log('Key length:', process.env.GROK_API_KEY.length);
  console.log('First 20 chars:', process.env.GROK_API_KEY.substring(0, 20) + '...');
} else {
  console.log('❌ No Grok API key found in environment');
}
