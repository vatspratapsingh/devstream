const config = {
  development: {
    port: 3000,
    host: 'localhost',
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    security: {
      helmet: true,
      trustProxy: false
    }
  },
  test: {
    port: 3001,
    host: 'localhost',
    cors: {
      origin: ['http://localhost:3001'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000
    },
    security: {
      helmet: true,
      trustProxy: false
    }
  },
  production: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },
    security: {
      helmet: true,
      trustProxy: true
    }
  }
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env] || config.development;
};

module.exports = {
  getConfig,
  config
};
