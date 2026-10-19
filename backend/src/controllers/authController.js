import { supabase, getAuthenticatedSupabaseClient } from '../config/supabase.js';

export async function register(req, res, next) {
  try {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password (at least 6 characters) are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const assignedRole = role || 'Independent Artist / Singer';
    const artistId = 'RK-ART-' + Math.floor(1000 + Math.random() * 9000);

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
      options: {
        data: {
          name: trimmedName,
          phone: phone || '',
          role: assignedRole,
          artist_id: artistId,
        },
      },
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message,
      });
    }

    const user = authData.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create user account.',
      });
    }

    // 2. Obtain session
    let session = authData.session;
    if (!session) {
      const { data: loginData } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });
      if (loginData?.session) {
        session = loginData.session;
      }
    }

    // 3. Upsert profile using user's authenticated client (satisfies auth.uid() = id)
    const userClient = session ? getAuthenticatedSupabaseClient(session.access_token) : supabase;

    const profilePayload = {
      id: user.id,
      name: trimmedName,
      email: trimmedEmail,
      phone: phone || 'N/A',
      role: assignedRole,
      artist_id: artistId,
      avatar_url: null,
      verified: true,
      releases_count: 0,
      total_streams: '0',
      earnings: '₹0',
      claims_count: 0,
    };

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .upsert(profilePayload)
      .select()
      .single();

    if (profileError) {
      console.warn('[AuthController] Profile upsert note:', profileError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to RK Digital Media.',
      user: profile || profilePayload,
      session: session,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password,
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        error: authError.message || 'Invalid email or password.',
      });
    }

    const user = authData.user;
    const userClient = getAuthenticatedSupabaseClient(authData.session.access_token);

    // Fetch user profile from public.profiles using authenticated context
    const { data: profile } = await userClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const userPayload = profile || {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || trimmedEmail.split('@')[0],
      phone: user.user_metadata?.phone || 'N/A',
      role: user.user_metadata?.role || 'Independent Artist',
      artist_id: user.user_metadata?.artist_id || 'RK-ART-001',
      releases_count: 0,
      total_streams: '0',
      earnings: '₹0',
      claims_count: 0,
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: userPayload,
      session: authData.session,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User profile not found.',
      });
    }

    const userPayload = profile || {
      id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.name || req.user.email?.split('@')[0],
      phone: req.user.user_metadata?.phone || 'N/A',
      role: req.user.user_metadata?.role || 'Independent Artist',
      artist_id: req.user.user_metadata?.artist_id || 'RK-ART-001',
      releases_count: 0,
      total_streams: '0',
      earnings: '₹0',
      claims_count: 0,
    };

    return res.status(200).json({
      success: true,
      user: userPayload,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, phone, role, avatar_url } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (role) updates.role = role.trim();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data, error } = await req.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: data,
    });
  } catch (err) {
    next(err);
  }
}

export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required for password reset.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Password reset instructions sent to ${trimmedEmail}.`,
    });
  } catch (err) {
    next(err);
  }
}
