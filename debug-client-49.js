require('dotenv').config();
const db = require('./src/db/connection');

async function debugClient49() {
  try {
    console.log('=== Debugging Client 49 ===');
    
    // Check if client exists
    const clientQuery = 'SELECT * FROM clients WHERE id = $1';
    const clientResult = await db.query(clientQuery, [49]);
    
    console.log('Client query result:', {
      rowCount: clientResult.rowCount,
      data: clientResult.rows[0] || 'NULL'
    });
    
    if (clientResult.rows.length === 0) {
      console.log('❌ Client 49 not found');
      return;
    }
    
    const client = clientResult.rows[0];
    console.log('✅ Client found:', {
      id: client.id,
      name: client.name,
      industry: client.industry,
      overview: client.overview ? 'Yes' : 'No'
    });
    
    // Check details
    const detailsQuery = 'SELECT * FROM client_details WHERE client_id = $1';
    const detailsResult = await db.query(detailsQuery, [49]);
    
    console.log('Details query result:', {
      rowCount: detailsResult.rowCount,
      data: detailsResult.rows[0] || 'NULL'
    });
    
    const details = detailsResult.rows[0] || {};
    
    // Test intelligence generation
    console.log('\n=== Testing Intelligence Generation ===');
    const intelligenceService = require('./src/services/intelligenceService');
    
    try {
      const intelligence = intelligenceService.generateDecisionIntelligence(client, details);
      console.log('✅ Intelligence generated successfully');
      console.log('Summary:', intelligence.summary);
      console.log('Positioning:', intelligence.positioning);
    } catch (error) {
      console.log('❌ Intelligence generation failed:', error.message);
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await db.end();
  }
}

debugClient49();
