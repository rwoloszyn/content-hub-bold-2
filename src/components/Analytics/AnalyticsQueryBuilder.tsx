import React, { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  Search, 
  Download, 
  RefreshCw,
  Play,
  Save,
  X,
  Plus
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface AnalyticsQueryBuilderProps {
  onRunQuery: (results: any[], query: string) => void;
  onSaveQuery?: (name: string, query: string) => void;
}

export function AnalyticsQueryBuilder({ onRunQuery, onSaveQuery }: AnalyticsQueryBuilderProps) {
  const [queryType, setQueryType] = useState<'pageviews' | 'events' | 'purchases'>('pageviews');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filters, setFilters] = useState<Array<{ field: string, operator: string, value: string }>>([]);
  const [groupBy, setGroupBy] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [queryName, setQueryName] = useState('');

  const availableFields = {
    pageviews: [
      'page_url', 'page_title', 'device_type', 'browser', 'os', 'referrer', 'time_on_page'
    ],
    events: [
      'event_name', 'category', 'action', 'label', 'value', 'device_type', 'browser', 'os'
    ],
    purchases: [
      'product_id', 'currency', 'price', 'device_type', 'browser', 'os'
    ]
  };

  const operators = ['equals', 'contains', 'starts_with', 'ends_with', 'greater_than', 'less_than'];

  const addFilter = () => {
    setFilters([...filters, { field: availableFields[queryType][0], operator: 'equals', value: '' }]);
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const buildQuery = () => {
    let query = `SELECT `;
    
    if (groupBy) {
      query += `${groupBy}, COUNT(*) `;
    } else {
      query += `* `;
    }
    
    query += `FROM ${queryType} WHERE timestamp >= `;
    
    // Add date range
    let fromDate: Date;
    const toDate = new Date();
    
    if (dateRange === 'today') {
      fromDate = new Date();
      fromDate.setHours(0, 0, 0, 0);
    } else if (dateRange === '7days') {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (dateRange === '30days') {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
    } else {
      // Custom date range
      fromDate = startDate ? new Date(startDate) : new Date();
      if (endDate) {
        toDate.setTime(new Date(endDate).getTime());
      }
    }
    
    query += `'${fromDate.toISOString()}' AND timestamp <= '${toDate.toISOString()}'`;
    
    // Add filters
    filters.forEach(filter => {
      if (filter.field && filter.operator && filter.value) {
        query += ` AND `;
        
        switch (filter.operator) {
          case 'equals':
            query += `${filter.field} = '${filter.value}'`;
            break;
          case 'contains':
            query += `${filter.field} ILIKE '%${filter.value}%'`;
            break;
          case 'starts_with':
            query += `${filter.field} ILIKE '${filter.value}%'`;
            break;
          case 'ends_with':
            query += `${filter.field} ILIKE '%${filter.value}'`;
            break;
          case 'greater_than':
            query += `${filter.field} > ${filter.value}`;
            break;
          case 'less_than':
            query += `${filter.field} < ${filter.value}`;
            break;
        }
      }
    });
    
    // Add group by
    if (groupBy) {
      query += ` GROUP BY ${groupBy} ORDER BY COUNT(*) DESC`;
    } else {
      query += ` ORDER BY timestamp DESC`;
    }
    
    // Add limit
    query += ` LIMIT 100`;
    
    return query;
  };

  const runQuery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const query = buildQuery();
      
      // Execute the query using Supabase's rpc function
      const { data, error } = await supabase.rpc('run_analytics_query', {
        query_string: query
      });
      
      if (error) {
        throw error;
      }
      
      onRunQuery(data || [], query);
    } catch (err) {
      console.error('Query failed:', err);
      setError('Failed to run query. Please check your query parameters and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuery = () => {
    if (!queryName.trim()) {
      setError('Please enter a name for your query');
      return;
    }
    
    const query = buildQuery();
    
    if (onSaveQuery) {
      onSaveQuery(queryName, query);
      setShowSaveDialog(false);
      setQueryName('');
    }
  };

  const exportResults = () => {
    // This would export the results to CSV
    console.log('Export results');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Query Builder</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Query</span>
          </button>
          <button
            onClick={exportResults}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Query Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setQueryType('pageviews')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                queryType === 'pageviews'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Page Views
            </button>
            <button
              onClick={() => setQueryType('events')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                queryType === 'events'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setQueryType('purchases')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                queryType === 'purchases'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Purchases
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <button
              onClick={() => setDateRange('today')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === 'today'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === '7days'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('30days')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === '30days'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dateRange === 'custom'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Custom
            </button>
          </div>
          
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Filters
            </label>
            <button
              onClick={addFilter}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Filter</span>
            </button>
          </div>
          
          {filters.length === 0 ? (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              No filters applied. Click "Add Filter" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {availableFields[queryType].map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {operators.map((op) => (
                      <option key={op} value={op}>{op.replace('_', ' ')}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  
                  <button
                    onClick={() => removeFilter(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group By (Optional)
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">No Grouping</option>
            {availableFields[queryType].map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>

        {/* Run Query Button */}
        <div className="pt-2">
          <button
            onClick={runQuery}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Query...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Query</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Query Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Query</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Name
              </label>
              <input
                type="text"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Enter a name for this query"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuery}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Save Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}