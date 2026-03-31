require('dotenv').config();
const db = require('./src/db/connection');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Check if tables exist
    const tablesResult = await db.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:', tablesResult.rows.map(r => r.table_name));
    
    // Check if clients table has data
    try {
      const clientsResult = await db.query('SELECT COUNT(*) FROM clients');
      console.log('Clients count:', clientsResult.rows[0].count);
    } catch (error) {
      console.log('Clients table does not exist or is empty:', error.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
