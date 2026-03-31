const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function resetAndMigrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Resetting database and adding constraints...');
    
    await client.query('BEGIN');
    
    // Drop existing tables (cascade will handle foreign keys)
    await client.query('DROP TABLE IF EXISTS client_details CASCADE');
    await client.query('DROP TABLE IF EXISTS clients CASCADE');
    
    // Recreate tables with unique constraints
    await client.query(`
      CREATE TABLE clients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          industry VARCHAR(100) NOT NULL,
          overview TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE client_details (
          id SERIAL PRIMARY KEY,
          client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
          offerings TEXT[],
          capabilities TEXT[],
          benefits TEXT[],
          differentiators TEXT[],
          pricing TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry)');
    
    // Create triggers for updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    await client.query(`
      CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`
      CREATE TRIGGER update_client_details_updated_at BEFORE UPDATE ON client_details
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query('COMMIT');
    
    console.log('✅ Database reset and migration completed successfully');
    console.log('📋 Added unique constraints:');
    console.log('   - UNIQUE (name) on clients table');
    console.log('   - UNIQUE (client_id) on client_details table');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Reset failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  resetAndMigrate().catch(console.error);
}

module.exports = { resetAndMigrate };
