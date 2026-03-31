const http = require('http');

function testAIEnhance(clientId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/clients/ai-intelligence/${clientId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== AI Enhancement for Client ${clientId} ===`);
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error(`Error for AI enhancement:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTest() {
  try {
    console.log('Testing AI enhancement for client 1...\n');
    await testAIEnhance(1);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();
