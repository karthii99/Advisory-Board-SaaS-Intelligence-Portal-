const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running migration: Add unique constraints...');
    
    // Read and execute migration
    const fs = require('fs');
    const path = require('path');
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations/add_unique_constraints.sql'),
      'utf8'
    );
    
    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully');
    console.log('📋 Added unique constraints:');
    console.log('   - unique_client_name on clients table');
    console.log('   - unique_client_details on client_details table');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Constraints already exist - migration not needed');
    } else {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };
