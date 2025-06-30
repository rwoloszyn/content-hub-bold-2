import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Database, 
  CheckCircle, 
  Plus,
  RefreshCw,
  Filter,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Clock,
  ExternalLink
} from 'lucide-react';
import { NotionDatabase } from '../../services/notionService';

interface NotionDatabaseSelectorProps {
  onClose: () => void;
  onSelect: (database: NotionDatabase) => void;
  databases: NotionDatabase[];
}

export function NotionDatabaseSelector({ 
  onClose, 
  onSelect,
  databases
}: NotionDatabaseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'database' | 'page'>('all');
  const [loading, setLoading] = useState(false);
  const [filteredDatabases, setFilteredDatabases] = useState<NotionDatabase[]>(databases);

  useEffect(() => {
    filterDatabases();
  }, [searchQuery, selectedType, databases]);

  const filterDatabases = () => {
    let filtered = [...databases];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(db => 
        db.title.toLowerCase().includes(query) || 
        (db.description && db.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by type (currently all are databases, but keeping for future)
    if (selectedType !== 'all') {
      filtered = filtered.filter(db => selectedType === 'database');
    }
    
    setFilteredDatabases(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'page': return FileText;
      default: return Database;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Notion Database</h2>
            <p className="text-gray-600 mt-1">Choose databases to sync with ContentHub</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search databases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="database">Databases</option>
                <option value="page">Pages</option>
              </select>
            </div>
          </div>

          {/* Database List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : filteredDatabases.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No databases found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDatabases.map((database) => {
                const TypeIcon = getTypeIcon('database');
                const isConnected = database.isConnected;
                
                return (
                  <div
                    key={database.id}
                    className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                      isConnected
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isConnected ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <TypeIcon className={`w-5 h-5 ${
                            isConnected ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{database.title}</h3>
                            {isConnected && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          {database.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{database.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>Last edited {new Date(database.lastEditedTime).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(database.properties).slice(0, 4).map(([name, property], index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {name} ({(property as any).type})
                              </span>
                            ))}
                            {Object.keys(database.properties).length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{Object.keys(database.properties).length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {isConnected ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Connected</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelect(database)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Info Panel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Database Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Database must be shared with your integration</li>
                  <li>• Required properties: Title (recommended)</li>
                  <li>• Integration needs read/write permissions</li>
                  <li>• Changes will sync automatically once connected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}