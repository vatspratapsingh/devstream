const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import configuration and middleware
const { getConfig: getAppConfig } = require('./config/app');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { successResponse } = require('./utils/response');

// Import routes
const notesRouter = require('./routes/notes');

const app = express();
const config = getAppConfig();

// Security middleware
if (config.security.helmet) {
  app.use(helmet());
}

// Trust proxy (for production behind load balancer)
if (config.security.trustProxy) {
  app.set('trust proxy', 1);
}

// CORS configuration
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Logging middleware
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// API routes
app.use('/api/notes', notesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid
  };
  
  logger.info('Health check requested', healthData);
  return successResponse(res, healthData, 'API is running');
});

// Root endpoint
app.get('/', (req, res) => {
  const apiInfo = {
    message: 'Welcome to DevStream API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      notes: '/api/notes'
    },
    documentation: 'Check README.md for API documentation',
    features: [
      'RESTful API for notes management',
      'Pagination, search, and sorting',
      'Input validation and sanitization',
      'Structured logging',
      'Error handling',
      'Rate limiting',
      'Security headers'
    ]
  };
  
  logger.info('Root endpoint accessed');
  return successResponse(res, apiInfo, 'DevStream API is running');
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
