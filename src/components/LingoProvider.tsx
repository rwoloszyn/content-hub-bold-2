import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lingoService, DesignToken, DesignAsset } from '../services/lingoService';

interface LingoContextType {
  colorTokens: DesignToken[];
  typographyTokens: DesignToken[];
  spacingTokens: DesignToken[];
  assets: DesignAsset[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getAssetById: (id: string) => Promise<DesignAsset | null>;
  searchAssets: (query: string) => Promise<DesignAsset[]>;
}

const LingoContext = createContext<LingoContextType | undefined>(undefined);

export function LingoProvider({ children }: { children: ReactNode }) {
  const [colorTokens, setColorTokens] = useState<DesignToken[]>([]);
  const [typographyTokens, setTypographyTokens] = useState<DesignToken[]>([]);
  const [spacingTokens, setSpacingTokens] = useState<DesignToken[]>([]);
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLingoService();
  }, []);

  const initializeLingoService = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lingoService.initialize();
      
      setColorTokens(lingoService.getColorTokens());
      setTypographyTokens(lingoService.getTypographyTokens());
      setSpacingTokens(lingoService.getSpacingTokens());
      setAssets(lingoService.getAssets());
    } catch (err) {
      console.error('Failed to initialize Lingo service:', err);
      setError('Failed to load design system. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lingoService.refreshData();
      
      setColorTokens(lingoService.getColorTokens());
      setTypographyTokens(lingoService.getTypographyTokens());
      setSpacingTokens(lingoService.getSpacingTokens());
      setAssets(lingoService.getAssets());
    } catch (err) {
      console.error('Failed to refresh Lingo data:', err);
      setError('Failed to refresh design system. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetById = async (id: string) => {
    return lingoService.getAssetById(id);
  };

  const searchAssets = async (query: string) => {
    return lingoService.searchAssets(query);
  };

  const value = {
    colorTokens,
    typographyTokens,
    spacingTokens,
    assets,
    isLoading,
    error,
    refreshData,
    getAssetById,
    searchAssets,
  };

  return (
    <LingoContext.Provider value={value}>
      {children}
    </LingoContext.Provider>
  );
}

export function useLingo() {
  const context = useContext(LingoContext);
  if (context === undefined) {
    throw new Error('useLingo must be used within a LingoProvider');
  }
  return context;
}