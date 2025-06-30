import React, { useState } from 'react';
import { 
  Clock, 
  Copy, 
  Save, 
  RefreshCw, 
  Search, 
  Filter,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { AI_MODELS } from '../../services/aiService';

interface HistoryItem {
  id: string;
  content: string;
  prompt: string;
  template?: string;
  variables: Record<string, string>;
  createdAt: Date;
  type: 'templates' | 'custom';
  model: string;
  provider: string;
}

interface AIGenerationHistoryProps {
  history: HistoryItem[];
  onReuse: (item: HistoryItem) => void;
  onSave: (content: string) => void;
  availableModels: typeof AI_MODELS;
}

export function AIGenerationHistory({ 
  history, 
  onReuse, 
  onSave,
  availableModels
}: AIGenerationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'templates' | 'custom'>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesModel = filterModel === 'all' || item.model === filterModel;
    return matchesSearch && matchesType && matchesModel;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getModelBadgeColor = (model: string) => {
    const provider = availableModels[model]?.provider || '';
    switch (provider) {
      case 'Google':
        return 'bg-blue-100 text-blue-700';
      case 'OpenAI':
        return 'bg-green-100 text-green-700';
      case 'Anthropic':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generation History</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="templates">Templates</option>
              <option value="custom">Custom Prompts</option>
            </select>
            
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Models</option>
              {Object.entries(availableModels).map(([id, model]) => (
                <option key={id} value={id}>{model.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {filteredHistory.length} of {history.length} generations
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No History Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterType !== 'all' || filterModel !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start generating content to see your history here'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'templates' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.type === 'templates' ? 'Template' : 'Custom'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getModelBadgeColor(item.model)}`}>
                      {availableModels[item.model]?.name || item.model}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(item.createdAt, 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  
                  {item.template && (
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Template: {item.template}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.content)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSave(item.content)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Save to Library"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReuse(item)}
                    className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                    title="Reuse"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.content}
                </p>
              </div>
              
              {Object.keys(item.variables).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(item.variables).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Content Preview</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Generated Content</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.content}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Original Prompt</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">{selectedItem.prompt}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Model Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Model:</span> {availableModels[selectedItem.model]?.name || selectedItem.model}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Provider:</span> {availableModels[selectedItem.model]?.provider || selectedItem.provider}
                    </p>
                  </div>
                </div>
                
                {Object.keys(selectedItem.variables).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Variables Used</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedItem.variables).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600 w-20">{key}:</span>
                          <span className="text-sm text-gray-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onReuse(selectedItem);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Reuse This
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}