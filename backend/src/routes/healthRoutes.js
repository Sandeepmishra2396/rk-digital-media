import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'ok';
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    dbLatencyMs = Date.now() - start;
    if (error) {
      dbStatus = 'degraded';
    }
  } catch (err) {
    dbStatus = 'unreachable';
  }

  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    service: 'RK Digital Media API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      provider: 'Supabase PostgreSQL',
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
  });
});

export default router;
