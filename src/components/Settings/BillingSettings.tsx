import { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Clock,
  DollarSign,
  Package,
  Edit3,
  Trash2
} from 'lucide-react';

export function BillingSettings() {
  const [currentPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const plans = [
    {
      id: 'free',
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
      ]
    },
    {
      id: 'pro',
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
      limitations: []
    },
    {
      id: 'enterprise',
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
      limitations: []
    }
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    }
  ];

  const invoices = [
    {
      id: 'inv_001',
      date: '2024-01-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - January 2024',
    },
    {
      id: 'inv_002',
      date: '2023-12-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - December 2023',
    },
    {
      id: 'inv_003',
      date: '2023-11-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - November 2023',
    },
  ];

  const handlePlanChange = (planId: string) => {
    if (planId !== currentPlan) {
      // Handle plan change logic
      console.log('Changing plan to:', planId);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId);
  };

  const getSavings = () => {
    const plan = plans.find(p => p.id === currentPlan);
    if (!plan) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-green-900">
              {plans.find(p => p.id === currentPlan)?.name} Plan
            </h4>
            <p className="text-sm text-green-700">
              ${plans.find(p => p.id === currentPlan)?.price[billingCycle]}/{billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">Next billing date</p>
            <p className="font-medium text-green-900">February 1, 2024</p>
          </div>
        </div>
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-xl p-6 transition-all ${
                currentPlan === plan.id
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
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handlePlanChange(plan.id)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <Package className="w-4 h-4" />
            <span>Add Payment Method</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {method.brand.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      •••• •••• •••• {method.last4}
                    </span>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
        </div>
        
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{invoice.description}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(invoice.date).toLocaleDateString()} • ${invoice.amount.toFixed(2)}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {invoice.status}
                </span>
                <button
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Invoices
        </button>
      </div>

      {/* Usage & Limits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Social Media Accounts</span>
              <span className="font-medium">8 / Unlimited</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Scheduled Posts This Month</span>
              <span className="font-medium">47 / Unlimited</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Team Members</span>
              <span className="font-medium">3 / 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">AI Generations This Month</span>
              <span className="font-medium">156 / Unlimited</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Billing Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your subscription will automatically renew on February 1, 2024</li>
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