import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COLORS } from '@utils/constants';

// ==========================================
// CONTEXTE DE THEME JUDCD
// ==========================================

const ThemeContext = createContext(null);

// Themes disponibles
const themes = {
  light: {
    name: 'light',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    border: '#E0E0E0',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    footerBg: '#002060',
    footerText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    inputBg: '#FFFFFF',
    inputBorder: '#E0E0E0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    green: COLORS.green,
    greenLight: COLORS.greenLight,
    yellow: COLORS.yellow,
    red: COLORS.red,
    blue: COLORS.blue,
  },
  dark: {
    name: 'dark',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#F5F5F5',
    textSecondary: '#CCCCCC',
    textLight: '#999999',
    border: '#404040',
    headerBg: 'rgba(26, 26, 26, 0.95)',
    footerBg: '#0D0D0D',
    footerText: '#F5F5F5',
    cardBg: '#2D2D2D',
    cardShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    inputBg: '#2D2D2D',
    inputBorder: '#404040',
    overlay: 'rgba(0, 0, 0, 0.7)',
    green: COLORS.green,
    greenLight: COLORS.greenLight,
    yellow: COLORS.yellow,
    red: COLORS.red,
    blue: COLORS.blueLight,
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('judcd_theme');
    return saved || 'light';
  });

  const [colors, setColors] = useState(themes[theme] || themes.light);

  // Applique les couleurs au DOM via variables CSS
  useEffect(() => {
    const themeColors = themes[theme] || themes.light;
    setColors(themeColors);

    // Injection des variables CSS dans :root
    const root = document.documentElement;
    root.style.setProperty('--color-bg', themeColors.background);
    root.style.setProperty('--color-surface', themeColors.surface);
    root.style.setProperty('--color-text', themeColors.text);
    root.style.setProperty('--color-text-secondary', themeColors.textSecondary);
    root.style.setProperty('--color-border', themeColors.border);
    root.style.setProperty('--color-header-bg', themeColors.headerBg);
    root.style.setProperty('--color-footer-bg', themeColors.footerBg);
    root.style.setProperty('--color-footer-text', themeColors.footerText);
    root.style.setProperty('--color-card-bg', themeColors.cardBg);
    root.style.setProperty('--color-input-bg', themeColors.inputBg);
    root.style.setProperty('--color-input-border', themeColors.inputBorder);

    // Sauvegarde dans le localStorage
    localStorage.setItem('judcd_theme', theme);

    // Met a jour la meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#1A1A1A' : COLORS.green);
    }
  }, [theme]);

  // Changement de theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Definition directe du theme
  const setThemeMode = useCallback((mode) => {
    if (themes[mode]) {
      setTheme(mode);
    }
  }, []);

  // Verification si le theme est dark
  const isDark = theme === 'dark';

  const value = {
    theme,
    colors,
    isDark,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalise
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit etre utilise a l\'interieur d\'un ThemeProvider.');
  }
  return context;
}

export default ThemeContext;