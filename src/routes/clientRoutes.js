const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { apiLimiter, aiLimiter, seedLimiter } = require('../middleware/rateLimiter');

// Apply general rate limiting to all routes
router.use(apiLimiter);

// Health check endpoint
router.get('/health', clientController.getHealthCheck);

// Client endpoints
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);

// AI enhancement endpoint with strict rate limiting
router.post('/ai-intelligence/:id', aiLimiter, clientController.enhanceWithAI);

// Seeding endpoint with strict rate limiting
router.post('/seed', seedLimiter, clientController.seedClients);

module.exports = router;
