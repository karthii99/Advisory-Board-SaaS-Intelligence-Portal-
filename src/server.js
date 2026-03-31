require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const clientRoutes = require('./routes/clientRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// API routes
app.use('/api/clients', clientRoutes);
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SaaS Intelligence Decision-Support System API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/clients/health',
      clients: 'GET /api/clients',
      clientById: 'GET /api/clients/:id',
      seed: 'POST /api/clients/seed',
      aiEnhance: 'POST /api/clients/ai-intelligence/:id',
      analytics: {
        industryDistribution: 'GET /api/analytics/industry-distribution',
        monthlyGrowth: 'GET /api/analytics/monthly-growth',
        intelligenceSummary: 'GET /api/analytics/intelligence-summary'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 SaaS Intelligence Server Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
🤖 AI Service: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}
⏰ Started at: ${new Date().toISOString()}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
