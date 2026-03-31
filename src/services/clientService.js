const db = require('../db/connection');
const intelligenceService = require('./intelligenceService');

class ClientService {
  async getAllClients() {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.industry,
          c.overview,
          cd.offerings,
          cd.capabilities,
          cd.pricing,
          cd.created_at
        FROM clients c
        LEFT JOIN client_details cd ON c.id = cd.client_id
        ORDER BY c.created_at DESC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(client => ({
        id: client.id,
        name: client.name,
        industry: client.industry,
        overview: client.overview,
        offering_count: client.offerings ? client.offerings.length : 0,
        capability_count: client.capabilities ? client.capabilities.length : 0,
        pricing: client.pricing,
        created_at: client.created_at
      }));
    } catch (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  async getClientById(id) {
    try {
      console.log('Fetching client by ID:', id);
      const clientQuery = 'SELECT * FROM clients WHERE id = $1';
      const clientResult = await db.query(clientQuery, [id]);
      
      if (clientResult.rows.length === 0) {
        throw new Error('Client not found');
      }
      
      const client = clientResult.rows[0];
      
      if (!client) {
        throw new Error('Client data is null');
      }
      
      console.log('Client found:', client.name);
      
      const detailsQuery = 'SELECT * FROM client_details WHERE client_id = $1';
      const detailsResult = await db.query(detailsQuery, [id]);
      const details = detailsResult.rows[0] || {};
      
      console.log('Details found:', details ? 'Yes' : 'No');
      
      const intelligence = intelligenceService.generateDecisionIntelligence(client, details);
      
      return {
        client: {
          id: client.id,
          name: client.name,
          industry: client.industry,
          overview: client.overview,
          created_at: client.created_at,
          updated_at: client.updated_at
        },
        details: {
          offerings: details.offerings || [],
          capabilities: details.capabilities || [],
          benefits: details.benefits || [],
          differentiators: details.differentiators || [],
          pricing: details.pricing || ''
        },
        intelligence
      };
    } catch (error) {
      console.error('Error in getClientById:', error);
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  async createClient(clientData, detailsData) {
    const client = await db.query(
      `INSERT INTO clients (name, industry, overview) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (name) DO NOTHING
       RETURNING id`,
      [clientData.name, clientData.industry, clientData.overview]
    );

    // If client already exists, return existing client ID
    if (client.rows.length === 0) {
      const existingClient = await db.query(
        'SELECT id FROM clients WHERE name = $1',
        [clientData.name]
      );
      return existingClient.rows[0].id;
    }

    const clientId = client.rows[0].id;

    // Only insert details if client was newly created
    if (client.rows.length > 0) {
      await db.query(
        `INSERT INTO client_details 
         (client_id, offerings, capabilities, benefits, differentiators, pricing) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (client_id) DO NOTHING`,
        [
          clientId,
          detailsData.offerings || [],
          detailsData.capabilities || [],
          detailsData.benefits || [],
          detailsData.differentiators || [],
          detailsData.pricing || ''
        ]
      );
    }

    return clientId;
  }

  async seedClients() {
    const seedData = [
      {
        client: {
          name: 'MindFlow AI',
          industry: 'AI Marketing Platform',
          overview: 'AI-powered marketing automation platform that optimizes customer journeys and personalization at scale.'
        },
        details: {
          offerings: [
            'Predictive Lead Scoring',
            'Dynamic Content Personalization',
            'Customer Journey Mapping',
            'Marketing Analytics Dashboard',
            'AI Campaign Optimization'
          ],
          capabilities: [
            'Machine Learning Models',
            'Real-time Data Processing',
            'Multi-channel Integration',
            'Advanced Segmentation',
            'A/B Testing Framework',
            'Revenue Attribution',
            'Custom Reporting',
            'API-first Architecture'
          ],
          benefits: [
            '40% increase in conversion rates',
            '60% reduction in manual campaign management',
            '35% improvement in customer lifetime value',
            'Real-time ROI tracking and optimization',
            'Seamless integration with existing marketing stack'
          ],
          differentiators: [
            'Predictive customer behavior modeling',
            'Cross-channel attribution tracking',
            'Real-time content optimization',
            'Self-learning campaign improvement',
            'Enterprise-grade security and compliance'
          ],
          pricing: 'Usage-based pricing: $2,000/month for mid-market, enterprise custom pricing available'
        }
      },
      {
        client: {
          name: 'SecureVault',
          industry: 'Cybersecurity SaaS',
          overview: 'Advanced cybersecurity platform providing real-time threat detection and automated response for modern enterprises.'
        },
        details: {
          offerings: [
            'Real-time Threat Detection',
            'Automated Incident Response',
            'Vulnerability Management',
            'Security Analytics Dashboard',
            'Compliance Monitoring'
          ],
          capabilities: [
            'AI-powered threat intelligence',
            'Zero-trust architecture',
            'Real-time monitoring',
            'Automated patching',
            'Threat hunting',
            'Incident automation',
            'Compliance reporting',
            '24/7 security operations'
          ],
          benefits: [
            '85% faster threat detection',
            '70% reduction in security incidents',
            'Automated compliance management',
            'Reduced security team workload',
            'Proactive threat prevention'
          ],
          differentiators: [
            'AI-driven threat prediction',
            'Automated incident response',
            'Zero-trust implementation',
            'Real-time vulnerability scanning',
            'Integrated compliance framework'
          ],
          pricing: 'Per-user pricing: $15/month for small teams, $25/month for enterprise, custom pricing available'
        }
      },
      {
        client: {
          name: 'TalentHub',
          industry: 'HR Tech',
          overview: 'Comprehensive talent management platform that streamlines recruitment, onboarding, and employee development.'
        },
        details: {
          offerings: [
            'Applicant Tracking System',
            'Employee Onboarding',
            'Performance Management',
            'Learning Management',
            'Workforce Analytics'
          ],
          capabilities: [
            'AI-powered candidate matching',
            'Automated interview scheduling',
            'Custom assessment creation',
            'Employee engagement tracking',
            'Compliance management',
            'Mobile recruiting',
            'Video interviewing',
            'Succession planning'
          ],
          benefits: [
            '45% reduction in time-to-hire',
            '30% improvement in quality of hires',
            '40% increase in employee retention',
            'Streamlined compliance processes',
            'Better workforce insights'
          ],
          differentiators: [
            'Predictive candidate success modeling',
            'Automated bias detection in hiring',
            'Personalized learning paths',
            'Real-time employee sentiment analysis',
            'Integrated talent marketplace'
          ],
          pricing: 'Per-employee pricing: $8/month for small teams, enterprise pricing available'
        }
      },
      {
        client: {
          name: 'DataPulse Analytics',
          industry: 'Analytics Platform',
          overview: 'Business intelligence platform with real-time data processing and AI-powered insights generation.'
        },
        details: {
          offerings: [
            'Real-time Dashboards',
            'Data Visualization',
            'Predictive Analytics',
            'Data Integration',
            'Automated Reporting'
          ],
          capabilities: [
            'Real-time data streaming',
            'Machine learning insights',
            'Natural language queries',
            'Custom visualization builder',
            'Data governance tools',
            'API access',
            'Collaborative analytics',
            'Advanced security'
          ],
          benefits: [
            '80% faster insight generation',
            'Improved decision-making accuracy',
            'Reduced reporting overhead by 70%',
            'Better data-driven culture',
            'Competitive advantage through data'
          ],
          differentiators: [
            'Natural language to SQL conversion',
            'Automated anomaly detection',
            'Predictive trend forecasting',
            'Self-service data preparation',
            'Industry-specific insight templates'
          ],
          pricing: 'Usage-based pricing: $500/month for small teams, $2,500/month for mid-market, enterprise custom'
        }
      },
      {
        client: {
          name: 'DevOps Pro',
          industry: 'Dev Tooling SaaS',
          overview: 'Comprehensive DevOps platform that automates CI/CD pipelines and infrastructure management.'
        },
        details: {
          offerings: [
            'CI/CD Pipeline Management',
            'Infrastructure as Code',
            'Container Orchestration',
            'Monitoring and Alerting',
            'Security Scanning'
          ],
          capabilities: [
            'Multi-cloud support',
            'Automated testing integration',
            'Rollback mechanisms',
            'Performance monitoring',
            'Security compliance',
            'Collaboration features',
            'Template library',
            'API-first design'
          ],
          benefits: [
            '60% faster deployment cycles',
            '90% reduction in deployment failures',
            'Improved developer productivity',
            'Better security posture',
            'Cost optimization'
          ],
          differentiators: [
            'AI-powered pipeline optimization',
            'Cross-cloud infrastructure management',
            'Automated security remediation',
            'Predictive performance monitoring',
            'Zero-downtime deployments'
          ],
          pricing: 'Per-developer pricing: $29/month for small teams, $49/month for growing teams, enterprise custom'
        }
      }
    ];

    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if data already exists
      const existingCount = await client.query('SELECT COUNT(*) FROM clients');
      const hasExistingData = parseInt(existingCount.rows[0].count) > 0;
      
      if (hasExistingData) {
        await client.query('ROLLBACK');
        return {
          success: true,
          inserted: 0,
          skipped: seedData.length,
          message: 'Data already seeded - no new clients inserted'
        };
      }

      const createdClients = [];
      let insertedCount = 0;
      let skippedCount = 0;
      
      for (const data of seedData) {
        try {
          const clientId = await this.createClient(data.client, data.details);
          
          // Check if this was a new insertion or existing client
          const existingClient = await client.query(
            'SELECT name FROM clients WHERE name = $1 AND created_at < NOW() - INTERVAL \'1 second\'',
            [data.client.name]
          );
          
          if (existingClient.rows.length > 0) {
            createdClients.push({ id: clientId, name: data.client.name, status: 'skipped' });
            skippedCount++;
          } else {
            createdClients.push({ id: clientId, name: data.client.name, status: 'inserted' });
            insertedCount++;
          }
        } catch (error) {
          console.warn(`Warning: Failed to process ${data.client.name}:`, error.message);
          skippedCount++;
        }
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        inserted: insertedCount,
        skipped: skippedCount,
        total: seedData.length,
        message: `Seeding completed safely: ${insertedCount} inserted, ${skippedCount} skipped`,
        clients: createdClients
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to seed clients: ${error.message}`);
    } finally {
      client.release();
    }
  }
}

module.exports = new ClientService();
