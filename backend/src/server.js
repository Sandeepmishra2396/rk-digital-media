import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

// Prevent server crash on unhandled errors
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception caught by safety barrier:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 RK DIGITAL MEDIA API SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🛡️  Environment: ${env.NODE_ENV}`);
  console.log(`🔒 Supabase Connected: ${env.SUPABASE_URL}`);
  console.log(`👥 High-concurrency architecture ready (10,000+ users)`);
  console.log(`====================================================`);
});

// Configure Keep-Alive timeouts for high load and load-balancers (AWS/Nginx/Cloudflare)
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n[SHUTDOWN] Received ${signal}. Closing server gracefully...`);
  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed. Process exiting.');
    process.exit(0);
  });

  // Force close after 10 seconds if lingering connections exist
  setTimeout(() => {
    console.error('[SHUTDOWN] Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
