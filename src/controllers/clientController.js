const clientService = require('../services/clientService');
const intelligenceService = require('../services/intelligenceService');

class ClientController {
  async getClients(req, res) {
    try {
      const clients = await clientService.getAllClients();
      
      res.json({
        success: true,
        data: clients,
        count: clients.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clients',
        message: error.message
      });
    }
  }

  async getClientById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid client ID',
          message: 'Client ID must be a valid number'
        });
      }

      const result = await clientService.getClientById(parseInt(id));
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      
      if (error.message === 'Client not found') {
        return res.status(404).json({
          success: false,
          error: 'Client not found',
          message: 'No client exists with the provided ID'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client',
        message: error.message
      });
    }
  }

  async seedClients(req, res) {
    try {
      const result = await clientService.seedClients();
      
      // Determine appropriate status code
      const statusCode = result.inserted > 0 ? 201 : 200;
      const statusMessage = result.inserted > 0 ? 'created' : 'ok';
      
      res.status(statusCode).json({
        success: true,
        message: result.message,
        data: {
          inserted: result.inserted,
          skipped: result.skipped,
          total: result.total,
          clients: result.clients
        },
        status: statusMessage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error seeding clients:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to seed database',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async enhanceWithAI(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid client ID',
          message: 'Client ID must be a valid number'
        });
      }

      const result = await clientService.getClientById(parseInt(id));
      
      // Check if OpenAI API key is available
      if (!process.env.GROK_API_KEY) {
        return res.status(503).json({
          success: false,
          error: 'AI enhancement unavailable',
          message: 'OpenAI API key not configured'
        });
      }

      // Use AI service for enhancement
      const aiService = require('../services/aiService');
      console.log('Attempting AI enhancement for client:', id);
      const aiIntelligence = await aiService.enhanceIntelligence(result.client, result.details);
      console.log('AI enhancement successful for client:', id);
      
      // Merge AI intelligence with existing intelligence
      const enhancedIntelligence = {
        ...result.intelligence,
        ai_enhanced: true,
        ai_analysis: aiIntelligence,
        enhancement_timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'AI enhancement completed',
        data: {
          client: result.client,
          details: result.details,
          intelligence: enhancedIntelligence
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error enhancing with AI:', error);
      
      if (error.message === 'Client not found') {
        return res.status(404).json({
          success: false,
          error: 'Client not found',
          message: 'No client exists with the provided ID'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to enhance with AI',
        message: error.message
      });
    }
  }

  async getHealthCheck(req, res) {
    try {
      // Test database connection
      const db = require('../db/connection');
      await db.query('SELECT 1');
      
      res.json({
        success: true,
        status: 'healthy',
        services: {
          database: 'connected',
          api: 'running',
          ai_service: process.env.GROK_API_KEY ? 'configured (OpenAI)' : 'not configured'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Service unavailable',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new ClientController();
