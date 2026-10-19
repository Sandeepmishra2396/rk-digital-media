import { supabase, getAuthenticatedSupabaseClient } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required. Please sign in.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization token format.',
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid token. Please log in again.',
      });
    }

    // Attach user information and authenticated client to request
    req.user = user;
    req.jwtToken = token;
    req.supabase = getAuthenticatedSupabaseClient(token);

    next();
  } catch (err) {
    console.error('[AuthMiddleware] Error validating token:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed.',
    });
  }
}
