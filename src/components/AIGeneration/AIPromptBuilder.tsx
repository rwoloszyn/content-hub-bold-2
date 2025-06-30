import React from 'react';
import { Zap, RefreshCw, Info } from 'lucide-react';
import { AITemplate } from '../../types';
import { AI_MODELS } from '../../services/aiService';

interface AIPromptBuilderProps {
  template: AITemplate;
  variables: Record<string, string>;
  onVariableChange: (variable: string, value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  selectedModel: string;
}

export function AIPromptBuilder({
  template,
  variables,
  onVariableChange,
  onGenerate,
  isGenerating,
  canGenerate,
  selectedModel
}: AIPromptBuilderProps) {
  const getVariableLabel = (variable: string) => {
    return variable
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getVariablePlaceholder = (variable: string) => {
    const placeholders: Record<string, string> = {
      topic: 'e.g., sustainable living, remote work, digital marketing',
      product: 'e.g., eco-friendly water bottle, productivity app',
      features: 'e.g., BPA-free, 24-hour insulation, leak-proof design',
      audience: 'e.g., health-conscious millennials, busy professionals',
      tone: 'e.g., professional, casual, enthusiastic',
      length: 'e.g., short, medium, long',
      keywords: 'e.g., sustainability, innovation, quality',
    };
    
    return placeholders[variable] || `Enter ${getVariableLabel(variable).toLowerCase()}...`;
  };

  const previewPrompt = template.prompt.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value ? `**${value}**` : `[${key}]`;
  });

  const modelInfo = AI_MODELS[selectedModel] || { name: 'AI Model', provider: 'Provider' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Template</h3>
      
      <div className="space-y-4">
        {/* Template Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">{template.name}</h4>
              <p className="text-sm text-blue-700 mt-1">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Variables */}
        {template.variables.map((variable) => (
          <div key={variable}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getVariableLabel(variable)} *
            </label>
            <input
              type="text"
              value={variables[variable] || ''}
              onChange={(e) => onVariableChange(variable, e.target.value)}
              placeholder={getVariablePlaceholder(variable)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        ))}

        {/* Prompt Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Preview
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
            <div dangerouslySetInnerHTML={{ 
              __html: previewPrompt
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-600">$1</strong>')
                .replace(/\[(.*?)\]/g, '<span class="text-gray-400 italic">[$1]</span>')
            }} />
          </div>
        </div>

        {/* Model Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Selected Model:</span>
          <span className="font-medium">{modelInfo.name} by {modelInfo.provider}</span>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            !canGenerate || isGenerating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Generate Content</span>
            </>
          )}
        </button>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h5 className="font-medium text-yellow-900 mb-1">💡 Tips for better results:</h5>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Be specific with your inputs</li>
            <li>• Include target audience details</li>
            <li>• Mention desired tone and style</li>
            <li>• Add relevant keywords or themes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}