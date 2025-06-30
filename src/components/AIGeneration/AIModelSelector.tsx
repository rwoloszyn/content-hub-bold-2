import React from 'react';
import { 
  Zap, 
  Check, 
  Info, 
  ExternalLink, 
  Star 
} from 'lucide-react';
import { AI_MODELS } from '../../services/aiService';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function AIModelSelector({ selectedModel, onModelChange }: AIModelSelectorProps) {
  const handleModelChange = (model: string) => {
    onModelChange(model);
  };
  
  const getProviderColor = (provider: string) => {
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Model</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600 mb-4">
          Select the AI model to use for content generation. Different models have different capabilities and performance characteristics.
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(AI_MODELS).map(([modelId, model]) => (
            <button
              key={modelId}
              onClick={() => handleModelChange(modelId)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedModel === modelId
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getProviderColor(model.provider)}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getProviderColor(model.provider)}`}>
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Max Tokens: {model.maxTokens.toLocaleString()}</span>
                      {model.supportsImages && (
                        <span className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>Image Support</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedModel === modelId && (
                  <div className="ml-2">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">About AI Models</h5>
              <p className="text-sm text-blue-800 mb-2">
                Different models have different strengths. Gemini Pro is great for general content, while GPT-4 excels at complex reasoning. Claude models are known for their helpful and harmless outputs.
              </p>
              <a 
                href="https://ai.google/discover/generative-ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>Learn more about AI models</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}