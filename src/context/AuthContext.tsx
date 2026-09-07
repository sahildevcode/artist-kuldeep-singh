import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, name?: string, role?: 'collector' | 'student') => void;
  logout: () => void;
  quickDemoLogin: (role: 'collector' | 'student') => void;
  unlockCourse: (courseId: string) => void;
  isCourseUnlocked: (courseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('aura_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('aura_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email: string, name = 'Art Patron', role: 'collector' | 'student' = 'collector') => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      avatar:
        role === 'collector'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      memberSince: '2026',
      collectedCount: role === 'collector' ? 2 : 0,
      enrolledCoursesCount: role === 'student' ? 3 : 1,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
  };

  const quickDemoLogin = (role: 'collector' | 'student') => {
    if (role === 'collector') {
      login('collector.vance@gallery.com', 'Countess Vivienne', 'collector');
    } else {
      login('student.atelier@fineart.org', 'Leo Montoya', 'student');
    }
  };

  const logout = () => {
    setCurrentUser(null);
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

  const isCourseUnlocked = (courseId: string): boolean => {
    if (!currentUser) return false;
    return Boolean(currentUser.enrolledCourseIds?.includes(courseId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        quickDemoLogin,
        unlockCourse,
        isCourseUnlocked,
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
