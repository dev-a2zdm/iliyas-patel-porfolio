import { testConnection } from '../config/db.js';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function getHealth(req, res) {
  const dbStatus = await testConnection();

  const response = {
    success: dbStatus.connected,
    status: dbStatus.connected ? 'healthy' : 'degraded',
    service: 'portfolio-backend-api',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.connected ? 'connected' : 'disconnected',
      ...(dbStatus.error ? { error: dbStatus.error } : {}),
    },
    uptime: process.uptime(),
  };

  return res.status(dbStatus.connected ? 200 : 503).json(response);
}

