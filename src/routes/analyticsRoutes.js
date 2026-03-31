const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const db = require('../db/connection');

// Apply rate limiting
router.use(apiLimiter);

// Get industry distribution
router.get('/industry-distribution', async (req, res) => {
  try {
    const query = `
      SELECT industry, COUNT(*) as count 
      FROM clients 
      GROUP BY industry 
      ORDER BY count DESC
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching industry distribution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch industry distribution',
      message: error.message
    });
  }
});

// Get monthly growth
router.get('/monthly-growth', async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_clients
      FROM clients 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching monthly growth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly growth',
      message: error.message
    });
  }
});

// Get intelligence summary by industry
router.get('/intelligence-summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.industry,
        COUNT(*) as total_clients,
        AVG(CASE 
          WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 3 THEN 9
          WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 2 THEN 7
          WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 1 THEN 5
          ELSE 3
        END) as avg_differentiator_score
      FROM clients c
      LEFT JOIN client_details cd ON c.id = cd.client_id
      GROUP BY c.industry
      ORDER BY total_clients DESC
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching intelligence summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch intelligence summary',
      message: error.message
    });
  }
});

module.exports = router;
