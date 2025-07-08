import { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail,
  ExternalLink,
  Search,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Phone,
  Users,
  Zap,
  Server
} from 'lucide-react';

export function SupportSettings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
  });

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Learn the basics of ContentHub',
      icon: Zap,
      articles: 12,
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      description: 'Creating and managing content',
      icon: Book,
      articles: 18,
    },
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Platform connections and posting',
      icon: Users,
      articles: 15,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Understanding your performance data',
      icon: Star,
      articles: 8,
    },
    {
      id: 'deployment',
      name: 'Deployment',
      description: 'Deploying your ContentHub instance',
      icon: Server,
      articles: 6,
    }
  ];

  const popularArticles = [
    {
      id: '1',
      title: 'How to connect your social media accounts',
      category: 'Social Media',
      views: 1250,
      helpful: 89,
    },
    {
      id: '2',
      title: 'Setting up your first content calendar',
      category: 'Getting Started',
      views: 980,
      helpful: 92,
    },
    {
      id: '3',
      title: 'Using AI to generate content ideas',
      category: 'Content Creation',
      views: 756,
      helpful: 87,
    },
    {
      id: '4',
      title: 'Understanding your analytics dashboard',
      category: 'Analytics',
      views: 634,
      helpful: 91,
    },
    {
      id: '5',
      title: 'How to deploy ContentHub to production',
      category: 'Deployment',
      views: 528,
      helpful: 94,
    }
  ];

  const supportTickets = [
    {
      id: 'TICK-001',
      subject: 'Unable to connect Instagram account',
      status: 'open',
      priority: 'high',
      created: '2024-01-15',
      lastUpdate: '2 hours ago',
    },
    {
      id: 'TICK-002',
      subject: 'Question about billing cycle',
      status: 'resolved',
      priority: 'medium',
      created: '2024-01-10',
      lastUpdate: '3 days ago',
    },
  ];

  const handleSubmitTicket = () => {
    console.log('Submit support ticket:', supportTicket);
    // Reset form
    setSupportTicket({
      subject: '',
      category: '',
      priority: 'medium',
      message: '',
    });
  };

  const handleTicketChange = (field: string, value: string) => {
    setSupportTicket(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Quick Help Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Search Help Center</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, tutorials, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {['Getting Started', 'Social Media Setup', 'AI Generation', 'Deployment', 'Billing', 'Integrations'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.articles} articles</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Popular Articles</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
            <span>View All</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {popularArticles.map((article) => (
            <button
              key={article.id}
              className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{article.category}</span>
                    <span>{article.views} views</span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{article.helpful}% helpful</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Live Chat</h4>
            <p className="text-sm text-gray-600 mb-3">Get instant help from our team</p>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Available now
            </span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
            <p className="text-sm text-gray-600 mb-3">We'll respond within 24 hours</p>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              24h response
            </span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Phone Support</h4>
            <p className="text-sm text-gray-600 mb-3">Enterprise customers only</p>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              Enterprise
            </span>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Submit a Support Ticket</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={supportTicket.subject}
                  onChange={(e) => handleTicketChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={supportTicket.category}
                  onChange={(e) => handleTicketChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Management</option>
                  <option value="deployment">Deployment Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'low', label: 'Low', color: 'text-green-600' },
                  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
                  { value: 'high', label: 'High', color: 'text-red-600' },
                ].map((priority) => (
                  <label key={priority.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={supportTicket.priority === priority.value}
                      onChange={(e) => handleTicketChange('priority', e.target.value)}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={supportTicket.message}
                onChange={(e) => handleTicketChange('message', e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            
            <button
              onClick={handleSubmitTicket}
              disabled={!supportTicket.subject || !supportTicket.message}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Your Support Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Support Tickets</h3>
        
        {supportTickets.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No support tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>#{ticket.id}</span>
                    <span>•</span>
                    <span>Created {ticket.created}</span>
                    <span>•</span>
                    <span>Last update: {ticket.lastUpdate}</span>
                  </div>
                </div>
                
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Video className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-gray-900">Video Tutorials</h4>
            </div>
            <p className="text-sm text-gray-600">Watch step-by-step video guides</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Community Forum</h4>
            </div>
            <p className="text-sm text-gray-600">Connect with other users</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Book className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">API Documentation</h4>
            </div>
            <p className="text-sm text-gray-600">Technical documentation for developers</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Server className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Deployment Guide</h4>
            </div>
            <p className="text-sm text-gray-600">Learn how to deploy ContentHub</p>
          </button>
        </div>
      </div>
    </div>
  );
}