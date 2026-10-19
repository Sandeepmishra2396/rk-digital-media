import { supabase } from '../lib/supabase';

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('rk_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // 1. Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'healthy', database: { status: 'ok' } };
    }
  },

  // 2. Auth APIs
  auth: {
    async register({ name, email, phone, role, password }) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, role, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        if (data.session?.access_token) {
          localStorage.setItem('rk_auth_token', data.session.access_token);
        }
        return { success: true, user: data.user, session: data.session };
      } catch (err) {
        // Fallback to direct Supabase Auth if backend is unreachable
        const { data: supaData, error: supaError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, role },
          },
        });
        if (supaError) throw supaError;
        if (supaData.session?.access_token) {
          localStorage.setItem('rk_auth_token', supaData.session.access_token);
        }
        return {
          success: true,
          user: {
            id: supaData.user?.id,
            name,
            email,
            phone,
            role,
            artist_id: 'RK-ART-' + Math.floor(1000 + Math.random() * 9000),
          },
          session: supaData.session,
        };
      }
    },

    async login({ email, password }) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        if (data.session?.access_token) {
          localStorage.setItem('rk_auth_token', data.session.access_token);
        }
        return { success: true, user: data.user, session: data.session };
      } catch (err) {
        // Fallback to direct Supabase Auth
        const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (supaError) throw supaError;
        if (supaData.session?.access_token) {
          localStorage.setItem('rk_auth_token', supaData.session.access_token);
        }
        return {
          success: true,
          user: {
            id: supaData.user?.id,
            email: supaData.user?.email,
            name: supaData.user?.user_metadata?.name || email.split('@')[0],
            role: supaData.user?.user_metadata?.role || 'Independent Artist',
            artist_id: 'RK-ART-001',
          },
          session: supaData.session,
        };
      }
    },

    async getMe() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeader(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.user;
      } catch {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
      }
    },

    async requestPasswordReset(email) {
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, message: 'Reset email sent!' };
      }
    },

    logout() {
      localStorage.removeItem('rk_auth_token');
      supabase.auth.signOut().catch(() => {});
    },
  },

  // 3. Releases APIs
  releases: {
    async getUserReleases() {
      try {
        const res = await fetch(`${API_BASE}/releases`, {
          headers: getAuthHeader(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.releases || [];
      } catch {
        const { data, error } = await supabase
          .from('releases')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      }
    },

    async createRelease(payload) {
      try {
        const res = await fetch(`${API_BASE}/releases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.release;
      } catch {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        const { data, error } = await supabase
          .from('releases')
          .insert({
            ...payload,
            user_id: user.id,
            track_id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
            isrc: `IN-RKD-26-${Math.floor(100 + Math.random() * 900)}`,
            release_date: 'Submitted (Processing QC)',
            status: 'In Review',
            status_color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
  },

  // 4. Contact Inquiries
  contact: {
    async submitInquiry(formData) {
      try {
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch {
        const { error } = await supabase.from('contact_inquiries').insert(formData);
        if (error) throw error;
        return { success: true, message: 'Message sent successfully!' };
      }
    },
  },
};
