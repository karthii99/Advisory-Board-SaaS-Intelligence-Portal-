const http = require('http');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== ${path} ===`);
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error(`Error for ${path}:`, error.message);
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('Testing API endpoints...\n');
    
    await testAPI('/api/clients');
    await testAPI('/api/clients/1');
    await testAPI('/api/clients/health');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
