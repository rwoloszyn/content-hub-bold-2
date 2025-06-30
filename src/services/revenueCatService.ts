import { User } from '../types';

// RevenueCat configuration
const REVENUECAT_PUBLIC_SDK_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_SDK_KEY || 'your_revenuecat_public_sdk_key';

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro_monthly',
  PRO_YEARLY: 'pro_yearly',
  ENTERPRISE: 'enterprise_monthly',
  ENTERPRISE_YEARLY: 'enterprise_yearly',
};

// Plan features and limits
export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    features: [
      '5 social media accounts',
      '10 scheduled posts per month',
      'Basic analytics',
      'Email support',
    ],
    limitations: [
      'Limited AI generation',
      'No team collaboration',
      'Basic templates only',
    ],
    limits: {
      socialAccounts: 5,
      scheduledPosts: 10,
      aiGenerations: 5,
      teamMembers: 1,
      mediaStorage: 100, // MB
    }
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    price: { monthly: 29, yearly: 290 },
    popular: true,
    features: [
      'Unlimited social media accounts',
      'Unlimited scheduled posts',
      'Advanced analytics',
      'AI content generation',
      'Team collaboration (5 members)',
      'Priority support',
      'Custom templates',
      'Notion integration',
    ],
    limitations: [],
    limits: {
      socialAccounts: -1, // unlimited
      scheduledPosts: -1, // unlimited
      aiGenerations: 100,
      teamMembers: 5,
      mediaStorage: 5000, // MB
    }
  },
  [SUBSCRIPTION_PLANS.PRO_YEARLY]: {
    name: 'Pro (Yearly)',
    price: { monthly: 24, yearly: 290 },
    popular: true,
    features: [
      'Unlimited social media accounts',
      'Unlimited scheduled posts',
      'Advanced analytics',
      'AI content generation',
      'Team collaboration (5 members)',
      'Priority support',
      'Custom templates',
      'Notion integration',
    ],
    limitations: [],
    limits: {
      socialAccounts: -1, // unlimited
      scheduledPosts: -1, // unlimited
      aiGenerations: 100,
      teamMembers: 5,
      mediaStorage: 5000, // MB
    }
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced AI features',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'White-label options',
      'Advanced security',
    ],
    limitations: [],
    limits: {
      socialAccounts: -1, // unlimited
      scheduledPosts: -1, // unlimited
      aiGenerations: -1, // unlimited
      teamMembers: -1, // unlimited
      mediaStorage: 50000, // MB
    }
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE_YEARLY]: {
    name: 'Enterprise (Yearly)',
    price: { monthly: 82, yearly: 990 },
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced AI features',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'White-label options',
      'Advanced security',
    ],
    limitations: [],
    limits: {
      socialAccounts: -1, // unlimited
      scheduledPosts: -1, // unlimited
      aiGenerations: -1, // unlimited
      teamMembers: -1, // unlimited
      mediaStorage: 50000, // MB
    }
  },
};

class RevenueCatService {
  private initialized = false;
  private currentUser: User | null = null;
  private currentSubscription: string = SUBSCRIPTION_PLANS.FREE;
  private revenuecat: any = null;

  async initialize(user: User): Promise<void> {
    if (this.initialized) return;

    try {
      // In a real implementation, we would initialize the RevenueCat SDK here
      // For this demo, we'll simulate the initialization
      console.log('Initializing RevenueCat with SDK key:', REVENUECAT_PUBLIC_SDK_KEY);
      
      // Simulate loading the RevenueCat SDK
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.revenuecat = {
        identify: this.mockIdentify.bind(this),
        getOfferings: this.mockGetOfferings.bind(this),
        purchasePackage: this.mockPurchasePackage.bind(this),
        restorePurchases: this.mockRestorePurchases.bind(this),
        getCustomerInfo: this.mockGetCustomerInfo.bind(this),
      };
      
      // Identify the user
      await this.identify(user);
      
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async identify(user: User): Promise<void> {
    if (!this.revenuecat) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      this.currentUser = user;
      await this.revenuecat.identify(user.id);
      
      // Get customer info after identifying
      const customerInfo = await this.revenuecat.getCustomerInfo();
      this.currentSubscription = customerInfo.activeSubscription || SUBSCRIPTION_PLANS.FREE;
      
      console.log('User identified with RevenueCat:', user.id);
      console.log('Current subscription:', this.currentSubscription);
    } catch (error) {
      console.error('Failed to identify user with RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<any> {
    if (!this.revenuecat) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const offerings = await this.revenuecat.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to get offerings from RevenueCat:', error);
      throw error;
    }
  }

  async purchasePackage(packageId: string): Promise<any> {
    if (!this.revenuecat) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const result = await this.revenuecat.purchasePackage(packageId);
      
      // Update current subscription
      this.currentSubscription = packageId;
      
      return result;
    } catch (error) {
      console.error('Failed to purchase package from RevenueCat:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<any> {
    if (!this.revenuecat) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const result = await this.revenuecat.restorePurchases();
      
      // Update current subscription based on restored purchases
      const customerInfo = await this.revenuecat.getCustomerInfo();
      this.currentSubscription = customerInfo.activeSubscription || SUBSCRIPTION_PLANS.FREE;
      
      return result;
    } catch (error) {
      console.error('Failed to restore purchases from RevenueCat:', error);
      throw error;
    }
  }

  getCurrentSubscription(): string {
    return this.currentSubscription;
  }

  getSubscriptionFeatures(): any {
    return PLAN_FEATURES[this.currentSubscription] || PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE];
  }

  isFeatureAvailable(feature: string): boolean {
    const plan = PLAN_FEATURES[this.currentSubscription] || PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE];
    return plan.features.includes(feature);
  }

  getFeatureLimit(feature: keyof typeof PLAN_FEATURES[typeof SUBSCRIPTION_PLANS.FREE]['limits']): number {
    const plan = PLAN_FEATURES[this.currentSubscription] || PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE];
    return plan.limits[feature];
  }

  // Mock methods for demonstration
  private async mockIdentify(userId: string): Promise<void> {
    console.log('Mock: Identifying user with RevenueCat:', userId);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private async mockGetOfferings(): Promise<any> {
    console.log('Mock: Getting offerings from RevenueCat');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      current: {
        identifier: 'default',
        availablePackages: [
          {
            identifier: SUBSCRIPTION_PLANS.PRO,
            offeringIdentifier: 'default',
            product: {
              identifier: SUBSCRIPTION_PLANS.PRO,
              title: 'Pro Monthly',
              description: 'Pro subscription with monthly billing',
              price: 29.99,
              priceString: '$29.99',
              currencyCode: 'USD',
            }
          },
          {
            identifier: SUBSCRIPTION_PLANS.PRO_YEARLY,
            offeringIdentifier: 'default',
            product: {
              identifier: SUBSCRIPTION_PLANS.PRO_YEARLY,
              title: 'Pro Yearly',
              description: 'Pro subscription with yearly billing',
              price: 290.00,
              priceString: '$290.00',
              currencyCode: 'USD',
            }
          },
          {
            identifier: SUBSCRIPTION_PLANS.ENTERPRISE,
            offeringIdentifier: 'default',
            product: {
              identifier: SUBSCRIPTION_PLANS.ENTERPRISE,
              title: 'Enterprise Monthly',
              description: 'Enterprise subscription with monthly billing',
              price: 99.99,
              priceString: '$99.99',
              currencyCode: 'USD',
            }
          },
          {
            identifier: SUBSCRIPTION_PLANS.ENTERPRISE_YEARLY,
            offeringIdentifier: 'default',
            product: {
              identifier: SUBSCRIPTION_PLANS.ENTERPRISE_YEARLY,
              title: 'Enterprise Yearly',
              description: 'Enterprise subscription with yearly billing',
              price: 990.00,
              priceString: '$990.00',
              currencyCode: 'USD',
            }
          }
        ]
      }
    };
  }

  private async mockPurchasePackage(packageId: string): Promise<any> {
    console.log('Mock: Purchasing package from RevenueCat:', packageId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      productIdentifier: packageId,
      transactionIdentifier: `transaction_${Date.now()}`,
      purchaseDate: new Date().toISOString(),
    };
  }

  private async mockRestorePurchases(): Promise<any> {
    console.log('Mock: Restoring purchases from RevenueCat');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      restoredPurchases: [
        {
          productIdentifier: SUBSCRIPTION_PLANS.PRO,
          transactionIdentifier: `transaction_${Date.now() - 30 * 24 * 60 * 60 * 1000}`,
          purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
    };
  }

  private async mockGetCustomerInfo(): Promise<any> {
    console.log('Mock: Getting customer info from RevenueCat');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For demo purposes, randomly assign a subscription
    const subscriptions = [
      SUBSCRIPTION_PLANS.FREE,
      SUBSCRIPTION_PLANS.PRO,
      SUBSCRIPTION_PLANS.PRO_YEARLY,
      SUBSCRIPTION_PLANS.ENTERPRISE
    ];
    
    // For demo, let's use PRO as the default
    const activeSubscription = SUBSCRIPTION_PLANS.PRO;
    
    return {
      originalAppUserId: this.currentUser?.id,
      entitlements: {
        pro: {
          identifier: 'pro',
          isActive: activeSubscription !== SUBSCRIPTION_PLANS.FREE,
          willRenew: true,
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          latestPurchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          originalPurchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          periodType: 'normal',
          store: 'app_store',
          isSandbox: true,
        }
      },
      activeSubscription,
    };
  }
}

export const revenueCatService = new RevenueCatService();