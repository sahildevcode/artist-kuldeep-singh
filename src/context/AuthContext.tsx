import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  deviceId: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithCredentials: (email: string, password: string) => Promise<AuthResponse>;
  registerWithCredentials: (email: string, password: string, name: string, role?: 'collector' | 'student') => Promise<AuthResponse>;
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
  return 'https://kuldeep-singh-backend.onrender.com';
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
        const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend.onrender.com'];
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

  // Login with email & password against backend
  const loginWithCredentials = async (email: string, password: string): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'Unable to connect to server. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
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
            deviceId: deviceId
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

  // Register with email, password & name against backend
  const registerWithCredentials = async (
    email: string,
    password: string,
    name: string,
    role: 'collector' | 'student' = 'student'
  ): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    const primaryUrl = getBackendUrl();
    const urlsToTry = [primaryUrl, 'https://kuldeep-singh-backend.onrender.com'];
    const uniqueUrls = Array.from(new Set(urlsToTry));

    let lastError = 'Registration failed. Kripya punah prayas karein.';

    for (const baseUrl of uniqueUrls) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
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
            deviceId: deviceId
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
