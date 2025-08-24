const express = require('express');
const notesRouter = require('./routes/notes');

const app = express();

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/notes', notesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevStream API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      notes: '/api/notes'
    },
    documentation: 'Check README.md for API documentation'
  });
});

module.exports = app;
