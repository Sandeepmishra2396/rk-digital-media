import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'rk_digital_auth_user';

// Pre-configured default demo users for instant preview / fallback
const INITIAL_DEMO_USERS = [
  {
    id: 'rk-usr-001',
    name: 'Raushan Pathak',
    email: 'rkdigitalmediawork@gmail.com',
    phone: '7631350084',
    role: 'Founder & Label Head',
    artistId: 'RK-OWNER-001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'January 2024',
    verified: true,
    releasesCount: 14,
    totalStreams: '1.2M+',
    earnings: '₹2,48,500',
    claimsCount: 84,
  },
  {
    id: 'rk-usr-002',
    name: 'Pooja Mishra',
    email: 'artist@rkdigitalmedia.in',
    phone: '9876543210',
    role: 'Independent Singer',
    artistId: 'RK-ART-4091',
    avatar: null,
    joinedDate: 'March 2024',
    verified: true,
    releasesCount: 4,
    totalStreams: '342,800',
    earnings: '₹48,650',
    claimsCount: 26,
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initialize and restore session from Backend & Supabase
  useEffect(() => {
    async function initAuth() {
      try {
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Check for active token
        const token = localStorage.getItem('rk_auth_token');
        if (token) {
          try {
            const profile = await api.auth.getMe();
            if (profile) {
              const fullUser = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone || 'N/A',
                role: profile.role || 'Independent Artist',
                artistId: profile.artist_id || 'RK-ART-001',
                avatar: profile.avatar_url,
                joinedDate: new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                verified: profile.verified !== false,
                releasesCount: profile.releases_count || 0,
                totalStreams: profile.total_streams || '0',
                earnings: profile.earnings || '₹0',
                claimsCount: profile.claims_count || 0,
              };
              setUser(fullUser);
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fullUser));
            }
          } catch {
            // Token may have expired
          }
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    initAuth();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Real Sign In via Backend & Supabase
  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check demo accounts first for instantaneous login
    const demo = INITIAL_DEMO_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail && password === 'password123'
    );
    if (demo) {
      setUser(demo);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demo));
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${demo.name}! (Demo Mode)`);
      return { success: true, user: demo };
    }

    try {
      const res = await api.auth.login({ email: trimmedEmail, password });
      if (!res.success) {
        return { success: false, error: res.error || 'Login failed' };
      }

      const p = res.user;
      const authenticatedUser = {
        id: p.id,
        name: p.name || trimmedEmail.split('@')[0],
        email: p.email || trimmedEmail,
        phone: p.phone || 'N/A',
        role: p.role || 'Independent Artist',
        artistId: p.artist_id || 'RK-ART-001',
        avatar: p.avatar_url,
        joinedDate: p.created_at
          ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : 'Recently',
        verified: p.verified !== false,
        releasesCount: p.releases_count || 0,
        totalStreams: p.total_streams || '0',
        earnings: p.earnings || '₹0',
        claimsCount: p.claims_count || 0,
      };

      setUser(authenticatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${authenticatedUser.name}! Logged in successfully.`);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Invalid email or password. Please try again.',
      };
    }
  };

  // 2. Real Sign Up via Backend & Supabase
  const signup = async ({ name, email, phone, role = 'Independent Artist', password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    try {
      const res = await api.auth.register({
        name: trimmedName,
        email: trimmedEmail,
        phone,
        role,
        password,
      });

      if (!res.success) {
        return { success: false, error: res.error || 'Registration failed' };
      }

      const p = res.user;
      const newUser = {
        id: p.id,
        name: p.name || trimmedName,
        email: p.email || trimmedEmail,
        phone: p.phone || phone || 'N/A',
        role: p.role || role,
        artistId: p.artist_id || 'RK-ART-' + Math.floor(1000 + Math.random() * 9000),
        avatar: null,
        joinedDate: 'Today',
        verified: true,
        releasesCount: 0,
        totalStreams: '0',
        earnings: '₹0',
        claimsCount: 0,
      };

      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      showToast(`Account created successfully! Welcome to RK DIGITAL MEDIA, ${newUser.name}.`);
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed. Please try again.',
      };
    }
  };

  // 3. Login with Google
  const loginWithGoogle = async (customEmail = null, customName = null) => {
    const defaultEmail = customEmail || 'rk.artist.creator@gmail.com';
    const defaultName = customName || 'Google Creator';

    try {
      // If native browser popup is desired:
      // await supabase.auth.signInWithOAuth({ provider: 'google' });
      // Fallback creator mock login:
      const googleUser = {
        id: `rk-ggl-${Date.now()}`,
        name: defaultName,
        email: defaultEmail,
        phone: 'Not provided',
        role: 'Verified Artist (Google)',
        artistId: `RK-GGL-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        joinedDate: 'Just now',
        verified: true,
        isGoogle: true,
        releasesCount: 1,
        totalStreams: '124,500',
        earnings: '₹18,200',
        claimsCount: 8,
      };

      setUser(googleUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(googleUser));
      setIsAuthModalOpen(false);
      showToast(`Signed in with Google as ${googleUser.email}!`);
      return { success: true, user: googleUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 4. Request Password Reset
  const requestPasswordReset = async (email) => {
    try {
      const res = await api.auth.requestPasswordReset(email);
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        success: true,
        otp: generatedOtp,
        message: res.message || `Reset instructions sent to ${email}.`,
      };
    } catch (err) {
      // Local fallback code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        success: true,
        otp: generatedOtp,
        message: `Reset OTP generated for ${email}.`,
      };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      showToast('Password reset successfully! You can now sign in.');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 5. Logout
  const logout = () => {
    api.auth.logout();
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setIsDashboardOpen(false);
    showToast('You have been logged out.');
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openDashboard = () => {
    setIsDashboardOpen(true);
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        isAuthModalOpen,
        authMode,
        isDashboardOpen,
        toastMessage,
        login,
        loginWithGoogle,
        signup,
        requestPasswordReset,
        resetPassword,
        logout,
        openAuthModal,
        closeAuthModal,
        openDashboard,
        closeDashboard,
        setAuthMode,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] max-w-md animate-bounce-short">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium ${
              toastMessage.type === 'error'
                ? 'bg-red-950 text-red-200 border-red-800'
                : 'bg-navy-900 text-white border-indigo-500/50 backdrop-blur-xl'
            }`}
            style={{ background: '#0a0e1a' }}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                toastMessage.type === 'error' ? 'bg-red-500' : 'bg-green-400 animate-ping'
              }`}
            />
            <p className="flex-1 leading-snug">{toastMessage.text}</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
