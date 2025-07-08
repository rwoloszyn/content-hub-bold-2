import { useState, useEffect } from 'react';
import { 
  Globe, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  Copy,
  Settings,
  Check,
  Clock,
  X,
  AlertTriangle
} from 'lucide-react';
import { getEntriLinks } from '../../services/domainService';

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'active' | 'error';
  primary: boolean;
  createdAt: Date;
  errorMessage?: string;
  dnsRecords?: {
    type: string;
    name: string;
    value: string;
    status: 'pending' | 'valid' | 'invalid';
  }[];
}

export function DomainSettings() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showDomainDetails, setShowDomainDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getEntriLinks();
      
      // For demo purposes, we'll use mock data
      const mockDomains: Domain[] = [
        {
          id: 'dom_1',
          domain: 'contenthub.example.com',
          status: 'active',
          primary: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          dnsRecords: [
            {
              type: 'CNAME',
              name: 'contenthub',
              value: 'contenthub-demo.netlify.app',
              status: 'valid'
            }
          ]
        }
      ];
      
      setDomains(mockDomains);
    } catch (err) {
      console.error('Failed to load domains:', err);
      setError('Failed to load domains. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain) return;
    
    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(newDomain)) {
      setError('Please enter a valid domain name');
      return;
    }
    
    setIsAddingDomain(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your API to add the domain
      console.log('Adding domain:', newDomain);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new domain to the list
      const newDomainObj: Domain = {
        id: `dom_${Date.now()}`,
        domain: newDomain,
        status: 'pending',
        primary: domains.length === 0,
        createdAt: new Date(),
        dnsRecords: [
          {
            type: 'CNAME',
            name: newDomain.split('.')[0],
            value: 'contenthub-demo.netlify.app',
            status: 'pending'
          }
        ]
      };
      
      setDomains([...domains, newDomainObj]);
      setNewDomain('');
      setShowAddDomain(false);
      
      // Select the new domain to show details
      setSelectedDomain(newDomainObj);
      setShowDomainDetails(true);
    } catch (err) {
      console.error('Failed to add domain:', err);
      setError('Failed to add domain. Please try again.');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) {
      return;
    }
    
    try {
      // In a real implementation, this would call your API to delete the domain
      console.log('Deleting domain:', domainId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the domain from the list
      setDomains(domains.filter(d => d.id !== domainId));
      
      // If the selected domain was deleted, close the details panel
      if (selectedDomain?.id === domainId) {
        setSelectedDomain(null);
        setShowDomainDetails(false);
      }
    } catch (err) {
      console.error('Failed to delete domain:', err);
      setError('Failed to delete domain. Please try again.');
    }
  };

  const handleSetPrimary = async (domainId: string) => {
    try {
      // In a real implementation, this would call your API to set the primary domain
      console.log('Setting primary domain:', domainId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the domains list
      setDomains(domains.map(d => ({
        ...d,
        primary: d.id === domainId
      })));
    } catch (err) {
      console.error('Failed to set primary domain:', err);
      setError('Failed to set primary domain. Please try again.');
    }
  };

  const handleRefreshDomain = async (domainId: string) => {
    setRefreshing(true);
    
    try {
      // In a real implementation, this would call your API to refresh the domain status
      console.log('Refreshing domain status:', domainId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the domain status (randomly for demo)
      setDomains(domains.map(d => {
        if (d.id === domainId) {
          // For demo purposes, randomly set the status
          const statuses: ('pending' | 'active' | 'error')[] = ['pending', 'active', 'error'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            ...d,
            status: randomStatus,
            dnsRecords: d.dnsRecords?.map(record => ({
              ...record,
              status: Math.random() > 0.3 ? 'valid' : 'pending'
            }))
          };
        }
        return d;
      }));
      
      // Update the selected domain if it's the one being refreshed
      if (selectedDomain?.id === domainId) {
        const updatedDomain = domains.find(d => d.id === domainId);
        if (updatedDomain) {
          setSelectedDomain(updatedDomain);
        }
      }
    } catch (err) {
      console.error('Failed to refresh domain status:', err);
      setError('Failed to refresh domain status. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: 'pending' | 'active' | 'error' | 'valid' | 'invalid') => {
    switch (status) {
      case 'active':
      case 'valid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'invalid':
        return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status: 'pending' | 'active' | 'error' | 'valid' | 'invalid') => {
    switch (status) {
      case 'active':
      case 'valid':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'error':
      case 'invalid':
        return <X className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Custom Domains</h3>
          </div>
          
          <button
            onClick={() => setShowAddDomain(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain</span>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Connect your own domain to your ContentHub site. You can use a subdomain (e.g., app.yourdomain.com) or your root domain.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Domain List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No domains configured</h4>
            <p className="text-gray-600 mb-4">
              Add your first custom domain to make your ContentHub site accessible from your own domain.
            </p>
            <button
              onClick={() => setShowAddDomain(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Add Custom Domain
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {domains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(domain.status)}`}>
                    {getStatusIcon(domain.status)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{domain.domain}</h4>
                      {domain.primary && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Added {domain.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDomain(domain);
                      setShowDomainDetails(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleRefreshDomain(domain.id)}
                    disabled={refreshing}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh Status"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  
                  {!domain.primary && domain.status === 'active' && (
                    <button
                      onClick={() => handleSetPrimary(domain.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Set as Primary"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteDomain(domain.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Domain Setup Guide */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Setup Guide</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to set up your custom domain</h4>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. Add your domain in the ContentHub settings</li>
              <li>2. Configure the required DNS records at your domain registrar</li>
              <li>3. Wait for DNS propagation (can take up to 48 hours)</li>
              <li>4. Verify your domain</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">DNS Configuration</h4>
            <p className="text-sm text-gray-600 mb-3">
              To connect your domain, you'll need to add the following DNS records at your domain registrar:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CNAME</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">www</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">contenthub-demo.netlify.app</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ALIAS/ANAME</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">@</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">contenthub-demo.netlify.app</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              Note: ALIAS/ANAME record types may not be supported by all domain registrars. If not available, you can use an A record pointing to our IP address.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">SSL Certificate</h4>
            <p className="text-sm text-gray-600">
              SSL certificates are automatically provisioned for your custom domains. Once your DNS is properly configured, we'll issue a certificate to enable HTTPS.
            </p>
          </div>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Custom Domain</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Name
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g., app.yourdomain.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your domain without http:// or https://
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Make sure you have access to modify DNS records for this domain before adding it.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddDomain(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDomain}
                disabled={!newDomain || isAddingDomain}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingDomain ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Details Modal */}
      {showDomainDetails && selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Domain Details</h3>
              <button
                onClick={() => setShowDomainDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(selectedDomain.status)}`}>
                    {getStatusIcon(selectedDomain.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedDomain.domain}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedDomain.status === 'active' ? 'Active and serving traffic' : 
                       selectedDomain.status === 'pending' ? 'Waiting for DNS verification' : 
                       'Configuration error'}
                    </p>
                  </div>
                </div>
                
                <div>
                  {selectedDomain.status === 'active' && (
                    <a
                      href={`https://${selectedDomain.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm hover:bg-primary-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit Site</span>
                    </a>
                  )}
                </div>
              </div>
              
              {selectedDomain.status === 'error' && selectedDomain.errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{selectedDomain.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">DNS Configuration</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Configure the following DNS records at your domain registrar:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDomain.dnsRecords?.map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => copyToClipboard(record.value)}
                              className="text-primary-600 hover:text-primary-700"
                              title="Copy Value"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900 mb-1">DNS Propagation</h5>
                    <p className="text-sm text-yellow-800">
                      DNS changes can take up to 48 hours to propagate worldwide. We'll check periodically, but you can also manually refresh the status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div>
                {!selectedDomain.primary && selectedDomain.status === 'active' && (
                  <button
                    onClick={() => handleSetPrimary(selectedDomain.id)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    <span>Set as Primary</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleRefreshDomain(selectedDomain.id)}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
                </button>
                
                <button
                  onClick={() => handleDeleteDomain(selectedDomain.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Domain</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Star icon component
function Star({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Eye icon component
function Eye({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}