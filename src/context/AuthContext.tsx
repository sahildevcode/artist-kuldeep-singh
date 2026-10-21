import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

interface SendOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  demoOtp?: string;
}

interface CheckUsernameResponse {
  available: boolean;
  username?: string;
  error?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  deviceId: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithCredentials: (loginIdentifier: string, password: string) => Promise<AuthResponse>;
  sendRegistrationOtp: (email: string, username: string, password: string, name: string, role?: 'collector' | 'student') => Promise<SendOtpResponse>;
  verifyRegistrationOtp: (email: string, otp: string) => Promise<AuthResponse>;
  checkUsernameAvailability: (username: string) => Promise<CheckUsernameResponse>;
  registerWithCredentials: (email: string, password: string, name: string, role?: 'collector' | 'student', username?: string) => Promise<AuthResponse>;
  login: (email: string, name?: string, role?: 'collector' | 'student') => void;
  logout: () => void;
  quickDemoLogin: (role: 'collector' | 'student') => Promise<void>;
  unlockCourse: (courseId: string) => void;
  isCourseUnlocked: (courseId: string) => boolean;
  sessionKickedOutAlert: string | null;
  clearSessionAlert: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getBackendUrl = (): string => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://kuldeep-singh-backend-q1di.onrender.com';
};

const getDeviceId = (): string => {
  try {
    let devId = localStorage.getItem('ks_device_identifier');
    if (!devId) {
      devId = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem('ks_device_identifier', devId);
    }
    return devId;
  } catch {
    return 'dev_' + Date.now();
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceId] = useState<string>(getDeviceId);
  const [sessionKickedOutAlert, setSessionKickedOutAlert] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_art_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('kuldeep_art_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('kuldeep_art_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Periodic Session Validation: Ensures single active device across Phone and Laptop
  useEffect(() => {
    if (!currentUser?.email || !currentUser?.sessionToken) return;

    let isMounted = true;
    const validateCurrentSession = async () => {
      try {
        const primaryUrl = getBackendUrl();
        const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
        const uniqueUrls = Array.from(new Set(urlsToTry));

        for (const baseUrl of uniqueUrls) {
          try {
            const res = await fetch(`${baseUrl}/api/auth/validate-session`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: currentUser.email,
                sessionToken: currentUser.sessionToken,
                deviceId: deviceId
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (isMounted && data.kickedOut === true) {
                console.warn('[AUTH] Session superseded by another device:', data.message);
                setSessionKickedOutAlert(data.message || 'Security Alert: Aapka account doosre device par login kar liya gaya hai.');
                setCurrentUser(null);
                localStorage.removeItem('kuldeep_art_user');
                break;
              }
              if (res.status === 200) break;
            }
          } catch {
            // Try next url
          }
        }
      } catch (e) {
        // network silent
      }
    };

    const interval = setInterval(validateCurrentSession, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser?.email, currentUser?.sessionToken, deviceId]);

  // Check unique username availability
  const checkUsernameAvailability = async (username: string): Promise<CheckUsernameResponse> => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { available: false, error: 'Username must be at least 3 characters long.' };
    }
    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/check-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUsername })
        });
        const data = await res.json();
        return { available: Boolean(data.available), username: cleanUsername, error: data.error };
      } catch {}
    }
    return { available: true, username: cleanUsername };
  };

  // Step 1: Send 6-digit OTP to user email
  const sendRegistrationOtp = async (
    email: string,
    username: string,
    password: string,
    name: string,
    role: 'collector' | 'student' = 'student'
  ): Promise<SendOtpResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'Failed to send verification code. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/send-registration-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            username: cleanUsername,
            password: cleanPassword,
            name: cleanName,
            role
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          return { success: true, message: data.message, demoOtp: data.demoOtp };
        } else {
          return { success: false, error: data.error || 'Registration verification could not be started.' };
        }
      } catch (err: any) {
        lastError = err.message || lastError;
      }
    }

    return { success: false, error: lastError };
  };

  // Step 2: Verify 6-digit OTP and finalize account registration
  const verifyRegistrationOtp = async (email: string, otp: string): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'OTP verification failed. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/verify-registration-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
            deviceId: deviceId
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const userWithProfile: UserProfile = {
            id: data.user.id || `usr_${Date.now()}`,
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role || 'student',
            avatar:
              data.user.role === 'collector'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
            memberSince: '2026',
            collectedCount: data.user.role === 'collector' ? 1 : 0,
            enrolledCoursesCount: (data.user.enrolledCourseIds || []).length,
            enrolledCourseIds: data.user.enrolledCourseIds || [],
            sessionToken: data.user.sessionToken,
            deviceId: deviceId,
            isEmailVerified: true
          };

          setCurrentUser(userWithProfile);
          setIsAuthModalOpen(false);
          setSessionKickedOutAlert(null);
          return { success: true, user: userWithProfile };
        } else {
          return { success: false, error: data.error || 'Galat ya expired OTP code.' };
        }
      } catch (err: any) {
        lastError = err.message || lastError;
      }
    }

    return { success: false, error: lastError };
  };

  // Login with Email OR Username + Password against backend
  const loginWithCredentials = async (loginIdentifier: string, password: string): Promise<AuthResponse> => {
    const cleanIdentifier = loginIdentifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'Unable to connect to server. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loginIdentifier: cleanIdentifier,
            password: cleanPassword,
            deviceId: deviceId
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const userWithProfile: UserProfile = {
            id: data.user.id || `usr_${Date.now()}`,
            name: data.user.name || 'Fine Art Patron',
            email: data.user.email,
            username: data.user.username,
            role: data.user.role || 'student',
            avatar:
              data.user.role === 'collector'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
            memberSince: '2026',
            collectedCount: data.user.role === 'collector' ? 2 : 0,
            enrolledCoursesCount: (data.user.enrolledCourseIds || []).length,
            enrolledCourseIds: data.user.enrolledCourseIds || [],
            sessionToken: data.user.sessionToken,
            deviceId: deviceId,
            isEmailVerified: Boolean(data.user.isEmailVerified)
          };

          setCurrentUser(userWithProfile);
          setIsAuthModalOpen(false);
          setSessionKickedOutAlert(null);
          return { success: true, user: userWithProfile };
        } else {
          return { success: false, error: data.error || 'Invalid credentials' };
        }
      } catch (err: any) {
        lastError = err.message || lastError;
      }
    }

    return { success: false, error: lastError };
  };

  // Direct Register with credentials
  const registerWithCredentials = async (
    email: string,
    password: string,
    name: string,
    role: 'collector' | 'student' = 'student',
    username?: string
  ): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend-q1di.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'Registration failed. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            username: cleanUsername,
            password: cleanPassword,
            name: cleanName,
            role: role,
            deviceId: deviceId
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const userWithProfile: UserProfile = {
            id: data.user.id || `usr_${Date.now()}`,
            name: data.user.name || cleanName,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role || role,
            avatar:
              role === 'collector'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
            memberSince: '2026',
            collectedCount: role === 'collector' ? 1 : 0,
            enrolledCoursesCount: (data.user.enrolledCourseIds || []).length,
            enrolledCourseIds: data.user.enrolledCourseIds || [],
            sessionToken: data.user.sessionToken,
            deviceId: deviceId,
            isEmailVerified: true
          };

          setCurrentUser(userWithProfile);
          setIsAuthModalOpen(false);
          setSessionKickedOutAlert(null);
          return { success: true, user: userWithProfile };
        } else {
          return { success: false, error: data.error || 'Registration rejected' };
        }
      } catch (err: any) {
        lastError = err.message || lastError;
      }
    }

    return { success: false, error: lastError };
  };

  // Backwards compatible fallback login
  const login = (email: string, name = 'Art Patron', role: 'collector' | 'student' = 'collector') => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      role,
      avatar:
        role === 'collector'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      memberSince: '2026',
      collectedCount: role === 'collector' ? 2 : 0,
      enrolledCoursesCount: role === 'student' ? 2 : 1,
      enrolledCourseIds: role === 'student' ? ['course-oil-mastery'] : [],
      sessionToken: 'sess_' + Date.now(),
      deviceId: deviceId
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
  };

  const quickDemoLogin = async (role: 'collector' | 'student') => {
    if (role === 'collector') {
      const res = await loginWithCredentials('collector@kuldeepsingh.art', 'collector123');
      if (!res.success) {
        login('collector@kuldeepsingh.art', 'Countess Vivienne', 'collector');
      }
    } else {
      const res = await loginWithCredentials('student@kuldeepsingh.art', 'student123');
      if (!res.success) {
        login('student@kuldeepsingh.art', 'Aarav Sharma', 'student');
      }
    }
  };

  const logout = () => {
    if (currentUser?.email) {
      const primaryUrl = getBackendUrl();
      fetch(`${primaryUrl}/api/session/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, deviceId })
      }).catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('kuldeep_art_user');
  };

  const unlockCourse = (courseId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.enrolledCourseIds || [];
    if (!currentList.includes(courseId)) {
      const updatedList = [...currentList, courseId];
      const updatedUser: UserProfile = {
        ...currentUser,
        enrolledCourseIds: updatedList,
        enrolledCoursesCount: updatedList.length,
      };
      setCurrentUser(updatedUser);
    }
  };

  const isCourseUnlocked = useCallback((courseId: string): boolean => {
    if (!currentUser) return false;
    return Boolean(currentUser.enrolledCourseIds?.includes(courseId));
  }, [currentUser]);

  const clearSessionAlert = () => {
    setSessionKickedOutAlert(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        deviceId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithCredentials,
        sendRegistrationOtp,
        verifyRegistrationOtp,
        checkUsernameAvailability,
        registerWithCredentials,
        login,
        logout,
        quickDemoLogin,
        unlockCourse,
        isCourseUnlocked,
        sessionKickedOutAlert,
        clearSessionAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
