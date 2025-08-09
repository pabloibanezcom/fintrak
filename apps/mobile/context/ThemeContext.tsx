import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  shadow: string;
}

const lightTheme: ThemeColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#8e8e93',
  border: '#f0f0f0',
  primary: '#007AFF',
  success: '#00D09C',
  danger: '#FF3B30',
  shadow: '#000000',
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  card: '#2c2c2e',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  border: '#38383a',
  primary: '#0a84ff',
  success: '#32d74b',
  danger: '#ff453a',
  shadow: '#000000',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{
      theme,
      colors,
      toggleTheme,
      isDark,
    }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}