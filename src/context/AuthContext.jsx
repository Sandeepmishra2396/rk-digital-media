import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS_KEY = 'rk_digital_registered_users';
const CURRENT_USER_KEY = 'rk_digital_auth_user';

// Sample pre-configured demo user
const INITIAL_DEMO_USERS = [
  {
    id: 'rk-usr-001',
    name: 'Raushan Pathak',
    email: 'rkdigitalmediawork@gmail.com',
    phone: '7631350084',
    password: 'password123',
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
    password: 'password123',
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

  // Initialize from localStorage
  useEffect(() => {
    try {
      // Initialize registered users if empty
      const existingUsers = localStorage.getItem(DEFAULT_USERS_KEY);
      if (!existingUsers) {
        localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      }

      // Check for saved logged-in session
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading auth from localStorage:', err);
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getUsers = () => {
    try {
      const stored = localStorage.getItem(DEFAULT_USERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  };

  const saveUsers = (users) => {
    try {
      localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Error saving users to localStorage:', err);
    }
  };

  // 1. Sign In
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!existing) {
      // For friendly first-time experience if user logs in with new credentials:
      // Create account on the fly or reject. Let's check password if existing
      return { success: false, error: 'No account found with this email. Please click Sign Up to register.' };
    }

    if (existing.password && existing.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again or click Forgot Password.' };
    }

    setUser(existing);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${existing.name}! Logged in successfully.`);
    return { success: true, user: existing };
  };

  // 2. Login with Gmail / Google
  const loginWithGoogle = (customEmail = null, customName = null) => {
    const defaultEmail = customEmail || 'rk.artist.creator@gmail.com';
    const defaultName = customName || 'Google Creator';

    const users = getUsers();
    let existing = users.find((u) => u.email.toLowerCase() === defaultEmail.toLowerCase());

    if (!existing) {
      existing = {
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
        releasesCount: 2,
        totalStreams: '124,500',
        earnings: '₹18,200',
        claimsCount: 8,
      };
      users.push(existing);
      saveUsers(users);
    }

    setUser(existing);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));
    setIsAuthModalOpen(false);
    showToast(`Signed in with Google as ${existing.email}!`);
    return { success: true, user: existing };
  };

  // 3. Sign Up
  const signup = ({ name, email, phone, role = 'Independent Artist', password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please Sign In.' };
    }

    const newUser = {
      id: `rk-usr-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone ? phone.trim() : 'N/A',
      role: role || 'Independent Artist',
      password: password,
      artistId: `RK-ART-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: null,
      joinedDate: 'Today',
      verified: true,
      releasesCount: 0,
      totalStreams: '0',
      earnings: '₹0',
      claimsCount: 0,
    };

    users.push(newUser);
    saveUsers(users);

    // Auto log in new user
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showToast(`Account created successfully! Welcome to RK DIGITAL MEDIA, ${newUser.name}.`);
    return { success: true, user: newUser };
  };

  // 4. Forgot Password / Reset
  const requestPasswordReset = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!existing) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      otp: generatedOtp,
      message: `Reset OTP generated for ${trimmedEmail}.`,
    };
  };

  const resetPassword = (email, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

    if (idx === -1) {
      return { success: false, error: 'User not found.' };
    }

    users[idx].password = newPassword;
    saveUsers(users);

    // If currently logged in user is this one, update session
    if (user && user.email.toLowerCase() === trimmedEmail) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    showToast('Password reset successfully! You can now sign in.');
    return { success: true };
  };

  // 5. Logout
  const logout = () => {
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
