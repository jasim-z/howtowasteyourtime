import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  card: string;
  text: string;
  textLight: string;
}

const lightColors: ThemeColors = {
  background: '#E8E0F0',
  primary: '#FF8A80',
  secondary: '#B8F0D8',
  card: '#FFF8F0',
  text: '#5C5470',
  textLight: '#8E8A9D',
};

const darkColors: ThemeColors = {
  background: '#1E1B2E',
  primary: '#FF8A80',
  secondary: '#2D5A4A',
  card: '#2A2640',
  text: '#E8E0F0',
  textLight: '#9890A8',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
  iconColor: string;
  iconColorLight: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme preference on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const iconColor = theme === 'light' ? '#5C5470' : '#E8E0F0';
  const iconColorLight = theme === 'light' ? '#8E8A9D' : '#9890A8';

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, iconColor, iconColorLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

