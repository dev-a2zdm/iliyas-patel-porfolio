import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import path from 'path';
import pool, { testConnection } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

// Enable trust proxy (essential for accurate client IP detection behind Hostinger / Cloudflare / Nginx reverse proxy)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, server-to-server) or matching origins
      if (!origin || allowedOrigins.includes(origin) || !isProduction) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing with safe size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// General Rate Limiting
app.use('/api', generalLimiter);

// API Routes
app.use('/api', routes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Server startup & connection check (only start listener if executed directly as main process)
let server;
if (isMain) {
  server = app.listen(PORT, async () => {
    console.log(`[Server] Portfolio backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    
    // Test database connection at startup
    const dbStatus = await testConnection();
    if (dbStatus.connected) {
      console.log('[Database] Connected successfully to MySQL database.');
    } else {
      console.warn(`[Database] Warning: Initial connection failed (${dbStatus.error}). The server will retry queries automatically.`);
    }
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Closing HTTP server and database pool...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log('[Server] Database pool closed. Exiting process.');
        process.exit(0);
      } catch (err) {
        console.error('[Server] Error while closing database pool:', err.message);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

export default app;
