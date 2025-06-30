import React from 'react';
import { Zap, Star, ArrowRight } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '../services/revenueCatService';

interface UpgradePromptProps {
  feature: string;
  description: string;
  planRequired: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export function UpgradePrompt({ 
  feature, 
  description, 
  planRequired, 
  onUpgrade, 
  onDismiss 
}: UpgradePromptProps) {
  const { currentPlan, upgradePlan, getPlanDetails } = useSubscription();
  const planDetails = getPlanDetails();
  
  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade flow
      const targetPlan = planRequired === 'pro' ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.ENTERPRISE;
      await upgradePlan(targetPlan);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="bg-primary-100 p-3 rounded-full">
          <Zap className="w-6 h-6 text-primary-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upgrade to access {feature}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          
          <div className="bg-white bg-opacity-60 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <h4 className="font-medium text-gray-900">
                {planRequired === 'pro' ? 'Pro Plan' : 'Enterprise Plan'} includes:
              </h4>
            </div>
            
            <ul className="space-y-2">
              {planDetails.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUpgrade}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}