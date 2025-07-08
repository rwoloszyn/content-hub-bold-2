import { Zap, Star, ArrowRight, X, Crown, Check } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '../services/revenueCatService';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  planRequired?: 'pro' | 'enterprise';
}

export function UpgradePrompt({ 
  isOpen, 
  onClose, 
  feature = 'this feature', 
  planRequired = 'pro' 
}: UpgradePromptProps) {
  const { upgradePlan, getPlanDetails } = useSubscription();

  if (!isOpen) return null;

  const planDetails = getPlanDetails();

  const handleUpgrade = async () => {
    try {
      await upgradePlan(planRequired);
      onClose();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            To access {feature}, you need to upgrade to the {planDetails.name} plan.
          </p>

          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {planDetails.name} Plan - ${planDetails.price}/month
            </h3>
            <ul className="space-y-1">
              {planDetails.features.slice(0, 4).map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Upgrade Now
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}