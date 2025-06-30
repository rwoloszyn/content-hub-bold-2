import { useState, useEffect } from 'react';
import { lingoService, DesignToken, DesignAsset } from '../services/lingoService';
import { useAuth } from './useAuth';

export function useLingo() {
  const { user } = useAuth();
  const [colorTokens, setColorTokens] = useState<DesignToken[]>([]);
  const [typographyTokens, setTypographyTokens] = useState<DesignToken[]>([]);
  const [spacingTokens, setSpacingTokens] = useState<DesignToken[]>([]);
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLingoService();
  }, [user]);

  const initializeLingoService = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lingoService.initialize(user || undefined);
      
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

  const getColorTokenById = async (id: string) => {
    return lingoService.getColorTokenById(id);
  };

  const getTypographyTokenById = async (id: string) => {
    return lingoService.getTypographyTokenById(id);
  };

  const searchAssets = async (query: string) => {
    return lingoService.searchAssets(query);
  };

  const getAssetsByType = (type: string) => {
    return lingoService.getAssets(type);
  };

  const getAssetsByTags = (tags: string[]) => {
    return lingoService.getAssets(undefined, tags);
  };

  return {
    colorTokens,
    typographyTokens,
    spacingTokens,
    assets,
    isLoading,
    error,
    refreshData,
    getAssetById,
    getColorTokenById,
    getTypographyTokenById,
    searchAssets,
    getAssetsByType,
    getAssetsByTags
  };
}