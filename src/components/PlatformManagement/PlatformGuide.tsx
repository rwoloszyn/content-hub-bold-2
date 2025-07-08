import { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Info,
  Shield,
  Zap,
  Users,
  Settings,
  Globe
} from 'lucide-react';

interface PlatformGuideProps {
  onClose: () => void;
}

const guideSteps = [
  {
    id: 'overview',
    title: 'Platform Overview',
    icon: Globe,
    content: {
      title: 'Understanding Social Media Platforms',
      description: 'Each platform has unique characteristics, audiences, and best practices.',
      sections: [
        {
          title: 'Platform Characteristics',
          items: [
            'Facebook: Broad audience, long-form content, community building',
            'Instagram: Visual content, younger demographics, stories & reels',
            'Twitter: Real-time updates, news, professional networking',
            'LinkedIn: Professional content, B2B marketing, thought leadership',
            'Pinterest: Visual discovery, DIY content, shopping inspiration',
            'TikTok: Short-form videos, Gen Z audience, trending content'
          ]
        },
        {
          title: 'Content Strategy Tips',
          items: [
            'Tailor content to each platform\'s unique format and audience',
            'Maintain consistent brand voice across all platforms',
            'Use platform-specific features (hashtags, stories, etc.)',
            'Post at optimal times for each platform\'s audience'
          ]
        }
      ]
    }
  },
  {
    id: 'setup',
    title: 'Account Setup',
    icon: Settings,
    content: {
      title: 'Setting Up Your Accounts',
      description: 'Proper account setup is crucial for successful social media management.',
      sections: [
        {
          title: 'Before You Connect',
          items: [
            'Ensure you have admin access to all accounts you want to connect',
            'Have your brand assets ready (logos, cover images, bio text)',
            'Prepare your content strategy and posting schedule',
            'Review each platform\'s terms of service and API policies'
          ]
        },
        {
          title: 'Connection Methods',
          items: [
            'OAuth (Recommended): Secure, one-click connection',
            'Manual Setup: For advanced users with existing API credentials',
            'Business Accounts: Required for most platforms\' advanced features',
            'Two-Factor Authentication: Enable for additional security'
          ]
        }
      ]
    }
  },
  {
    id: 'permissions',
    title: 'Permissions & Security',
    icon: Shield,
    content: {
      title: 'Understanding Permissions',
      description: 'Learn what permissions are required and how to keep your accounts secure.',
      sections: [
        {
          title: 'Required Permissions',
          items: [
            'Read access: View your profile and content',
            'Write access: Create and publish posts',
            'Analytics access: View performance metrics',
            'Management access: Manage comments and messages'
          ]
        },
        {
          title: 'Security Best Practices',
          items: [
            'Regularly review connected applications',
            'Use strong, unique passwords for all accounts',
            'Enable two-factor authentication',
            'Monitor account activity for suspicious behavior',
            'Revoke access for unused applications'
          ]
        }
      ]
    }
  },
  {
    id: 'features',
    title: 'Platform Features',
    icon: Zap,
    content: {
      title: 'Available Features',
      description: 'Discover what you can do with each connected platform.',
      sections: [
        {
          title: 'Content Management',
          items: [
            'Schedule posts across multiple platforms',
            'Auto-optimize content for each platform',
            'Bulk upload and organize media files',
            'Create and save content templates'
          ]
        },
        {
          title: 'Analytics & Insights',
          items: [
            'Track engagement metrics across platforms',
            'Monitor follower growth and demographics',
            'Analyze best performing content',
            'Generate comprehensive reports'
          ]
        },
        {
          title: 'Automation',
          items: [
            'Auto-post at optimal times',
            'Cross-post content with platform-specific formatting',
            'Automated hashtag suggestions',
            'Smart content recommendations'
          ]
        }
      ]
    }
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: AlertCircle,
    content: {
      title: 'Common Issues & Solutions',
      description: 'Resolve common connection and posting issues.',
      sections: [
        {
          title: 'Connection Issues',
          items: [
            'Invalid credentials: Double-check your API keys and tokens',
            'Expired tokens: Reconnect your account to refresh tokens',
            'Permission errors: Ensure you have admin access to the account',
            'Rate limits: Wait before retrying if you hit API limits'
          ]
        },
        {
          title: 'Posting Issues',
          items: [
            'Content too long: Check character limits for each platform',
            'Invalid media format: Ensure images/videos meet platform requirements',
            'Scheduling conflicts: Verify your timezone settings',
            'Failed posts: Check platform status and retry'
          ]
        },
        {
          title: 'Getting Help',
          items: [
            'Check our knowledge base for detailed guides',
            'Contact support for technical issues',
            'Join our community forum for tips and tricks',
            'Follow our blog for updates and best practices'
          ]
        }
      ]
    }
  }
];

export function PlatformGuide({ onClose }: PlatformGuideProps) {
  const [activeStep, setActiveStep] = useState('overview');

  const currentStep = guideSteps.find(step => step.id === activeStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Platform Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {guideSteps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeStep === step.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{step.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Need More Help?</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Check out our comprehensive documentation
                </p>
                <button className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1">
                  <span>View Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentStep && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentStep.content.title}
                </h1>
                <p className="text-gray-600">
                  {currentStep.content.description}
                </p>
              </div>

              {currentStep.content.sections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Additional Resources */}
              {activeStep === 'overview' && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Start Checklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Create business accounts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Optimize profiles with keywords</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Upload brand assets</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Connect to ContentHub</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Plan content strategy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Schedule first posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'troubleshooting' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Still Having Issues?</h3>
                  <div className="space-y-3">
                    <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                      <ExternalLink className="w-4 h-4" />
                      <span>Contact Support</span>
                    </button>
                    <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                      <Users className="w-4 h-4" />
                      <span>Join Community Forum</span>
                    </button>
                    <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                      <BookOpen className="w-4 h-4" />
                      <span>Browse Knowledge Base</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}