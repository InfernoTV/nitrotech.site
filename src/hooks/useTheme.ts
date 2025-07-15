import { useState, useEffect, createContext, useContext } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  primaryRgb: string;
  secondaryRgb: string;
  accentRgb: string;
}

interface ThemeChangeListener {
  (theme: Theme): void;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  addThemeChangeListener: (listener: ThemeChangeListener) => void;
  removeThemeChangeListener: (listener: ThemeChangeListener) => void;
}

const defaultTheme: Theme = {
  primary: '#00ff41',
  secondary: '#00d4ff',
  accent: '#ff0040',
  background: '#000000',
  text: '#00ff41',
  primaryRgb: '0, 255, 65',
  secondaryRgb: '0, 212, 255',
  accentRgb: '255, 0, 64'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  addThemeChangeListener: () => {},
  removeThemeChangeListener: () => {}
});

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('navi-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });
  const [listeners, setListeners] = useState<ThemeChangeListener[]>([]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('navi-theme', JSON.stringify(newTheme));
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', newTheme.primary);
    root.style.setProperty('--secondary-color', newTheme.secondary);
    root.style.setProperty('--accent-color', newTheme.accent);
    root.style.setProperty('--background-color', newTheme.background);
    root.style.setProperty('--text-color', newTheme.text);
    root.style.setProperty('--primary-rgb', newTheme.primaryRgb);
    root.style.setProperty('--secondary-rgb', newTheme.secondaryRgb);
    root.style.setProperty('--accent-rgb', newTheme.accentRgb);
    
    // Notify all listeners
    listeners.forEach(listener => listener(newTheme));
  };

  const addThemeChangeListener = (listener: ThemeChangeListener) => {
    setListeners(prev => [...prev, listener]);
  };

  const removeThemeChangeListener = (listener: ThemeChangeListener) => {
    setListeners(prev => prev.filter(l => l !== listener));
  };

  useEffect(() => {
    // Apply theme on mount
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--primary-rgb', theme.primaryRgb);
    root.style.setProperty('--secondary-rgb', theme.secondaryRgb);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    
    // Apply theme to all UI elements
    document.body.style.color = theme.primary;
  }, [theme]);

  return { theme, setTheme, addThemeChangeListener, removeThemeChangeListener };
};