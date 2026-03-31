const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function cleanupDuplicates() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Cleaning up duplicate data...');
    
    await client.query('BEGIN');
    
    // Get counts before cleanup
    const beforeClients = await client.query('SELECT COUNT(*) FROM clients');
    const beforeDetails = await client.query('SELECT COUNT(*) FROM client_details');
    
    console.log(`📊 Before cleanup: ${beforeClients.rows[0].count} clients, ${beforeDetails.rows[0].count} details`);
    
    // Find and delete duplicate client details (keep only one per client_id)
    const duplicateDetails = await client.query(`
      SELECT client_id, COUNT(*) as count
      FROM client_details
      GROUP BY client_id
      HAVING COUNT(*) > 1
    `);
    
    let totalDeletedDetails = 0;
    for (const row of duplicateDetails.rows) {
      const deleteResult = await client.query(`
        DELETE FROM client_details 
        WHERE id NOT IN (
          SELECT id FROM client_details 
          WHERE client_id = $1 
          ORDER BY id ASC 
          LIMIT 1
        ) AND client_id = $1
      `, [row.client_id]);
      totalDeletedDetails += deleteResult.rowCount;
    }
    
    // Find and delete duplicate clients (keep only one per name)
    const duplicateClients = await client.query(`
      SELECT name, COUNT(*) as count
      FROM clients
      GROUP BY name
      HAVING COUNT(*) > 1
    `);
    
    let totalDeletedClients = 0;
    for (const row of duplicateClients.rows) {
      const deleteResult = await client.query(`
        DELETE FROM clients 
        WHERE id NOT IN (
          SELECT id FROM clients 
          WHERE name = $1 
          ORDER BY id ASC 
          LIMIT 1
        ) AND name = $1
      `, [row.name]);
      totalDeletedClients += deleteResult.rowCount;
    }
    
    // Get counts after cleanup
    const afterClients = await client.query('SELECT COUNT(*) FROM clients');
    const afterDetails = await client.query('SELECT COUNT(*) FROM client_details');
    
    console.log(`📊 After cleanup: ${afterClients.rows[0].count} clients, ${afterDetails.rows[0].count} details`);
    console.log(`🗑️  Deleted ${totalDeletedClients} duplicate clients and ${totalDeletedDetails} duplicate details`);
    
    await client.query('COMMIT');
    console.log('✅ Cleanup completed successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupDuplicates().catch(console.error);
}

module.exports = { cleanupDuplicates };
