import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('artisan_color_theme');
      if (saved === 'dark') {
        localStorage.setItem('artisan_color_theme', 'light');
        document.documentElement.classList.remove('dark');
        return 'light';
      }
      if (saved === 'light') return 'light';
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('artisan_color_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
