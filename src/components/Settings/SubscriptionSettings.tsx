import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  Check, 
  Star,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Clock,
  Zap
} from 'lucide-react';
import { revenueCatService, SUBSCRIPTION_PLANS, PLAN_FEATURES } from '../../services/revenueCatService';
import { useAuth } from '../../hooks/useAuth';

export function SubscriptionSettings() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(SUBSCRIPTION_PLANS.FREE);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [offerings, setOfferings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        await revenueCatService.initialize(user);
        const offerings = await revenueCatService.getOfferings();
        setOfferings(offerings);
        
        // Get current subscription
        const currentSubscription = revenueCatService.getCurrentSubscription();
        setCurrentPlan(currentSubscription);
        
        // Set billing cycle based on current plan
        if (currentSubscription.includes('yearly')) {
          setBillingCycle('yearly');
        } else {
          setBillingCycle('monthly');
        }
      } catch (err) {
        console.error('Failed to initialize RevenueCat:', err);
        setError('Failed to load subscription information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeRevenueCat();
  }, [user]);

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    
    try {
      setPurchaseInProgress(true);
      setError(null);
      
      await revenueCatService.purchasePackage(planId);
      
      setCurrentPlan(planId);
      setSuccess('Subscription updated successfully!');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Failed to update subscription. Please try again.');
    } finally {
      setPurchaseInProgress(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await revenueCatService.restorePurchases();
      
      // Get updated subscription
      const currentSubscription = revenueCatService.getCurrentSubscription();
      setCurrentPlan(currentSubscription);
      
      setSuccess('Purchases restored successfully!');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Restore failed:', err);
      setError('Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlansForCycle = () => {
    if (billingCycle === 'monthly') {
      return [
        SUBSCRIPTION_PLANS.FREE,
        SUBSCRIPTION_PLANS.PRO,
        SUBSCRIPTION_PLANS.ENTERPRISE
      ];
    } else {
      return [
        SUBSCRIPTION_PLANS.FREE,
        SUBSCRIPTION_PLANS.PRO_YEARLY,
        SUBSCRIPTION_PLANS.ENTERPRISE_YEARLY
      ];
    }
  };

  const getSavings = () => {
    const proMonthly = PLAN_FEATURES[SUBSCRIPTION_PLANS.PRO].price.monthly * 12;
    const proYearly = PLAN_FEATURES[SUBSCRIPTION_PLANS.PRO_YEARLY].price.yearly;
    return proMonthly - proYearly;
  };

  const getNextBillingDate = () => {
    // For demo purposes, set next billing date to 30 days from now
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getUsageLimits = () => {
    const plan = PLAN_FEATURES[currentPlan];
    return {
      socialAccounts: {
        current: 8,
        limit: plan.limits.socialAccounts === -1 ? 'Unlimited' : plan.limits.socialAccounts
      },
      scheduledPosts: {
        current: 47,
        limit: plan.limits.scheduledPosts === -1 ? 'Unlimited' : plan.limits.scheduledPosts
      },
      teamMembers: {
        current: 3,
        limit: plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers
      },
      aiGenerations: {
        current: 156,
        limit: plan.limits.aiGenerations === -1 ? 'Unlimited' : plan.limits.aiGenerations
      }
    };
  };

  const usageLimits = getUsageLimits();

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-700">{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-green-900">
              {PLAN_FEATURES[currentPlan].name}
            </h4>
            <p className="text-sm text-green-700">
              ${PLAN_FEATURES[currentPlan].price[billingCycle]}/{billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">Next billing date</p>
            <p className="font-medium text-green-900">{getNextBillingDate()}</p>
          </div>
        </div>
        
        {currentPlan !== SUBSCRIPTION_PLANS.FREE && (
          <div className="mt-4 flex items-center justify-end space-x-3">
            <button
              onClick={handleRestorePurchases}
              disabled={loading}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restore Purchases</span>
            </button>
            <button
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Manage Billing</span>
            </button>
          </div>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Cycle</h3>
        
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              {getSavings() > 0 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Save ${getSavings()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getPlansForCycle().map((planId) => {
            const plan = PLAN_FEATURES[planId];
            return (
              <div
                key={planId}
                className={`border-2 rounded-xl p-6 transition-all ${
                  currentPlan === planId
                    ? 'border-green-500 bg-green-50'
                    : plan.popular
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center mb-4">
                  {plan.popular && (
                    <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm rounded-full mb-2">
                      Most Popular
                    </span>
                  )}
                  <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>• {limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPlan === planId ? (
                  <button
                    disabled
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanChange(planId)}
                    disabled={purchaseInProgress}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      purchaseInProgress 
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {purchaseInProgress ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      planId === SUBSCRIPTION_PLANS.FREE ? 'Downgrade' : 'Upgrade'
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage & Limits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Social Media Accounts</span>
              <span className="font-medium">{usageLimits.socialAccounts.current} / {usageLimits.socialAccounts.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ 
                  width: typeof usageLimits.socialAccounts.limit === 'string' 
                    ? '40%' 
                    : `${Math.min((usageLimits.socialAccounts.current / usageLimits.socialAccounts.limit) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Scheduled Posts This Month</span>
              <span className="font-medium">{usageLimits.scheduledPosts.current} / {usageLimits.scheduledPosts.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: typeof usageLimits.scheduledPosts.limit === 'string' 
                    ? '30%' 
                    : `${Math.min((usageLimits.scheduledPosts.current / usageLimits.scheduledPosts.limit) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Team Members</span>
              <span className="font-medium">{usageLimits.teamMembers.current} / {usageLimits.teamMembers.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: typeof usageLimits.teamMembers.limit === 'string' 
                    ? '60%' 
                    : `${Math.min((usageLimits.teamMembers.current / usageLimits.teamMembers.limit) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">AI Generations This Month</span>
              <span className="font-medium">{usageLimits.aiGenerations.current} / {usageLimits.aiGenerations.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ 
                  width: typeof usageLimits.aiGenerations.limit === 'string' 
                    ? '25%' 
                    : `${Math.min((usageLimits.aiGenerations.current / usageLimits.aiGenerations.limit) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Security</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Secure Payment Processing</h4>
              <p className="text-sm text-gray-600">
                All payments are processed securely through RevenueCat using industry-standard encryption.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Automatic Renewal</h4>
              <p className="text-sm text-gray-600">
                Your subscription will automatically renew at the end of each billing period. You can cancel anytime.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Refund Policy</h4>
              <p className="text-sm text-gray-600">
                If you're not satisfied with your purchase, contact us within 14 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Billing Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your subscription will automatically renew on {getNextBillingDate()}</li>
              <li>• You can cancel or change your plan at any time</li>
              <li>• Downgrades take effect at the end of your current billing period</li>
              <li>• Need help? <button className="underline hover:no-underline">Contact our billing support</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}