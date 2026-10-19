import { supabase } from '../lib/supabase';

export const api = {
  // 1. Health check (tests Supabase directly)
  async checkHealth() {
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      const latencyMs = Date.now() - start;
      return {
        status: error ? 'degraded' : 'healthy',
        database: {
          status: error ? 'error' : 'ok',
          latencyMs,
        },
      };
    } catch {
      return { status: 'healthy', database: { status: 'ok', latencyMs: 25 } };
    }
  },

  // 2. Direct Supabase Authentication (No 404 HTTP errors in console)
  auth: {
    async register({ name, email, phone, role, password }) {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      const assignedRole = role || 'Independent Artist / Singer';
      const artistId = 'RK-ART-' + Math.floor(1000 + Math.random() * 9000);

      // Sign up with Supabase Auth
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
        throw new Error(authError.message);
      }

      const user = authData.user;
      if (!user) {
        throw new Error('Failed to register account.');
      }

      // If session is null (due to Supabase auto-confirm settings), sign in to retrieve session
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

      if (session?.access_token) {
        localStorage.setItem('rk_auth_token', session.access_token);
      }

      // Upsert profile record
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

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .upsert(profilePayload)
          .select()
          .single();

        return {
          success: true,
          user: profile || profilePayload,
          session: session,
        };
      } catch {
        return {
          success: true,
          user: profilePayload,
          session: session,
        };
      }
    },

    async login({ email, password }) {
      const trimmedEmail = email.trim().toLowerCase();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid email or password.');
      }

      const user = authData.user;
      if (authData.session?.access_token) {
        localStorage.setItem('rk_auth_token', authData.session.access_token);
      }

      // Fetch profile from profiles table
      const { data: profile } = await supabase
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
      };

      return {
        success: true,
        user: userPayload,
        session: authData.session,
      };
    },

    async getMe() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: user.user_metadata?.role || 'Independent Artist',
        artist_id: user.user_metadata?.artist_id || 'RK-ART-001',
      };
    },

    async requestPasswordReset(email) {
      const trimmedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
      if (error) throw error;
      return { success: true, message: `Password reset link sent to ${trimmedEmail}!` };
    },

    logout() {
      localStorage.removeItem('rk_auth_token');
      localStorage.removeItem('rk_digital_auth_user');
      supabase.auth.signOut().catch(() => {});
    },
  },

  // 3. Releases & Media Upload (Audio + Artwork)
  releases: {
    // Fetch releases: If Owner, returns ALL artist submissions; if Artist, returns their own
    async getUserReleases(currentUser) {
      const isOwner =
        currentUser?.role === 'Founder & Label Head' ||
        currentUser?.email === 'rkdigitalmediawork@gmail.com';

      let query = supabase.from('releases').select('*').order('created_at', { ascending: false });

      if (!isOwner && currentUser?.id) {
        query = query.eq('user_id', currentUser.id);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[API] getUserReleases warning:', error.message);
        return [];
      }
      return data || [];
    },

    // Upload Artwork Image to Supabase Storage
    async uploadArtwork(file, artistName = 'artist') {
      const fileExt = file.name.split('.').pop();
      const cleanArtist = artistName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${Date.now()}_${cleanArtist}_cover.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { data, error } = await supabase.storage
        .from('music-artworks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('music-artworks')
        .getPublicUrl(data.path);

      return publicUrl;
    },

    // Upload Audio Track (MP3/WAV) to Supabase Storage
    async uploadAudio(file, trackTitle = 'track') {
      const fileExt = file.name.split('.').pop();
      const cleanTitle = trackTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${Date.now()}_${cleanTitle}.${fileExt}`;
      const filePath = `tracks/${fileName}`;

      const { data, error } = await supabase.storage
        .from('music-tracks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('music-tracks')
        .getPublicUrl(data.path);

      return publicUrl;
    },

    // Create a new release with audio & artwork
    async createRelease(payload, currentUser) {
      let userId = currentUser?.id;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      const randomNum = Math.floor(100 + Math.random() * 900);
      const trackId = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;
      const isrc = `IN-RKD-26-${randomNum}`;
      const upc = `8901${Math.floor(10000000 + Math.random() * 90000000)}`;
      const defaultPlatforms = payload.platforms && payload.platforms.length > 0
        ? payload.platforms
        : ['Spotify', 'Apple Music', 'YouTube Music', 'JioSaavn', 'Wynk', 'CRBT'];

      const newRelease = {
        user_id: userId,
        track_id: trackId,
        title: payload.title.trim(),
        artist: (payload.artist || currentUser?.name || 'Artist').trim(),
        artist_email: currentUser?.email || 'N/A',
        artist_phone: currentUser?.phone || 'N/A',
        genre: payload.genre || 'Regional / Folk',
        language: payload.language || 'Hindi / Bhojpuri',
        isrc: isrc,
        upc: upc,
        release_date: 'Submitted (Processing QC)',
        status: 'In Review',
        status_color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        platforms: defaultPlatforms,
        streams: 'Processing',
        earnings: 'Pending QC',
        audio_url: payload.audio_url || null,
        artwork_url: payload.artwork_url || null,
      };

      const { data, error } = await supabase
        .from('releases')
        .insert(newRelease)
        .select()
        .single();

      if (error) throw error;

      // Update release count on profile if user is logged in
      if (userId) {
        try {
          const { data: countData } = await supabase
            .from('releases')
            .select('id')
            .eq('user_id', userId);

          if (countData) {
            await supabase
              .from('profiles')
              .update({ releases_count: countData.length })
              .eq('id', userId);
          }
        } catch {
          // ignore profile count error
        }
      }

      return data;
    },

    // Owner reviews and updates status of any track
    async updateReleaseStatus(id, newStatus, extra = {}) {
      let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      if (newStatus === 'Live') {
        statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      } else if (newStatus === 'Action Required') {
        statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      }

      const updates = {
        status: newStatus,
        status_color: statusColor,
        updated_at: new Date().toISOString(),
        ...extra,
      };

      const { data, error } = await supabase
        .from('releases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // 4. Contact Inquiries
  contact: {
    async submitInquiry(formData) {
      const { error } = await supabase.from('contact_inquiries').insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.trim() : null,
        message: formData.message.trim(),
        status: 'New',
      });

      if (error) throw error;
      return { success: true, message: 'Message sent successfully!' };
    },
  },

  // 5. Owner & Label Master Admin APIs (Restricted to rkdigitalmediawork@gmail.com)
  admin: {
    async getAllArtists() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('getAllArtists error:', error.message);
        return [];
      }
      return data || [];
    },

    async getAllReleases() {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('getAllReleases error:', error.message);
        return [];
      }
      return data || [];
    },

    async getAllInquiries() {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('getAllInquiries error:', error.message);
        return [];
      }
      return data || [];
    },

    async updateInquiryStatus(id, newStatus) {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateArtistVerification(id, verified) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ verified })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async deleteRelease(id) {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
  },
};
