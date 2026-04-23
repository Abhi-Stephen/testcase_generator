const { Pool } = require('pg');

let pool;

function isPostgresEnabled() {
  return (process.env.STORAGE_MODE || 'json') === 'postgres' && Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isPostgresEnabled()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

async function checkDatabaseConnection() {
  const currentPool = getPool();

  if (!currentPool) {
    return {
      enabled: false,
      connected: false,
      message: 'PostgreSQL mode is disabled.'
    };
  }

  try {
    await currentPool.query('SELECT 1');
    return {
      enabled: true,
      connected: true,
      message: 'PostgreSQL connection is healthy.'
    };
  } catch (error) {
    return {
      enabled: true,
      connected: false,
      message: error.message || 'Unable to connect to PostgreSQL.'
    };
  }
}

module.exports = {
  getPool,
  closePool,
  isPostgresEnabled,
  checkDatabaseConnection
};
