import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lingoService, DesignToken } from '../services/lingoService';

interface ThemeContextType {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [typography, setTypography] = useState<Record<string, any>>({});
  const [spacing, setSpacing] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lingoService.initialize();
      
      // Process color tokens
      const colorTokens = lingoService.getColorTokens();
      const colorMap: Record<string, string> = {};
      
      colorTokens.forEach(token => {
        // Convert token name to camelCase
        const name = token.name
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        
        colorMap[name] = token.value;
      });
      
      setColors(colorMap);
      
      // Process typography tokens
      const typographyTokens = lingoService.getTypographyTokens();
      const typographyMap: Record<string, any> = {};
      
      typographyTokens.forEach(token => {
        // Convert token name to camelCase
        const name = token.name
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        
        try {
          typographyMap[name] = JSON.parse(token.value);
        } catch (e) {
          console.error(`Failed to parse typography token ${token.name}:`, e);
        }
      });
      
      setTypography(typographyMap);
      
      // Process spacing tokens
      const spacingTokens = lingoService.getSpacingTokens();
      const spacingMap: Record<string, string> = {};
      
      spacingTokens.forEach(token => {
        // Convert token name to camelCase
        const name = token.name
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        
        spacingMap[name] = token.value;
      });
      
      setSpacing(spacingMap);
    } catch (err) {
      console.error('Failed to load theme:', err);
      setError('Failed to load theme. Using default theme instead.');
      
      // Set default theme values
      setColors({
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      });
      
      setTypography({
        heading1: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.025em'
        },
        body: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0'
        }
      });
      
      setSpacing({
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTheme = async () => {
    await loadTheme();
  };

  const value = {
    colors,
    typography,
    spacing,
    isLoading,
    error,
    refreshTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
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