import { useState, useEffect } from 'react';
import { revenueCatService, SUBSCRIPTION_PLANS } from '../services/revenueCatService';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(SUBSCRIPTION_PLANS.FREE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSubscription = async () => {
      if (!user) {
        setCurrentPlan(SUBSCRIPTION_PLANS.FREE);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        await revenueCatService.initialize(user);
        const subscription = revenueCatService.getCurrentSubscription();
        setCurrentPlan(subscription);
      } catch (err) {
        console.error('Failed to initialize subscription:', err);
        setError('Failed to load subscription information');
        setCurrentPlan(SUBSCRIPTION_PLANS.FREE); // Fallback to free plan
      } finally {
        setIsLoading(false);
      }
    };

    initializeSubscription();
  }, [user]);

  const checkFeatureAccess = (feature: string): boolean => {
    if (isLoading) return false;
    return revenueCatService.isFeatureAvailable(feature);
  };

  const getFeatureLimit = (feature: string): number => {
    if (isLoading) return 0;
    return revenueCatService.getFeatureLimit(feature as any);
  };

  const getPlanDetails = () => {
    return revenueCatService.getSubscriptionFeatures();
  };

  const upgradePlan = async (planId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await revenueCatService.purchasePackage(planId);
      setCurrentPlan(planId);
      return true;
    } catch (err) {
      console.error('Failed to upgrade plan:', err);
      setError('Failed to upgrade plan. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPlan,
    isLoading,
    error,
    checkFeatureAccess,
    getFeatureLimit,
    getPlanDetails,
    upgradePlan
  };
}