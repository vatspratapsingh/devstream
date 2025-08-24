const config = {
  development: {
    type: 'memory',
    host: 'localhost',
    port: 3000,
    dataFile: './data/notes.json'
  },
  test: {
    type: 'memory',
    host: 'localhost',
    port: 3001,
    dataFile: './data/test-notes.json'
  },
  production: {
    type: 'memory', // Can be changed to 'postgres', 'mongodb', etc.
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3000,
    dataFile: process.env.DATA_FILE || './data/notes.json'
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
