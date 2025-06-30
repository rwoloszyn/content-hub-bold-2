import React, { useState } from 'react';
import { Zap, Wand2, Copy, RefreshCw, Plus, Save, Calendar, AlertTriangle } from 'lucide-react';
import { AITemplateSelector } from './AITemplateSelector';
import { AIPromptBuilder } from './AIPromptBuilder';
import { AIContentPreview } from './AIContentPreview';
import { AIGenerationHistory } from './AIGenerationHistory';
import { AIModelSelector } from './AIModelSelector';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import { useSubscription } from '../../hooks/useSubscription';
import { UpgradePrompt } from '../UpgradePrompt';

export function AIGeneration() {
  const [activeTab, setActiveTab] = useState<'templates' | 'custom' | 'history' | 'models'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    templates,
    generateContent,
    saveToLibrary,
    scheduleContent,
    loading,
    generationHistory,
    availableModels,
    selectedModel,
    changeModel,
    hasAIAccess,
    aiGenerationLimit
  } = useAIGeneration();

  const { checkFeatureAccess } = useSubscription();
  const hasAIAccess = checkFeatureAccess('AI content generation');
  const aiGenerationsUsed = generationHistory.length; // This would come from your usage tracking

  const handleGenerate = async () => {
    // Check if user has reached their AI generation limit
    if (aiGenerationLimit !== -1 && aiGenerationsUsed >= aiGenerationLimit) {
      setError(`You've reached your limit of ${aiGenerationLimit} AI generations. Please upgrade your plan for unlimited generations.`);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let prompt = '';
      
      if (activeTab === 'templates' && selectedTemplate) {
        const template = templates.find(t => t.id === selectedTemplate);
        if (template) {
          prompt = template.prompt.replace(/\{(\w+)\}/g, (match, key) => variables[key] || `[${key}]`);
        }
      } else if (activeTab === 'custom') {
        prompt = customPrompt;
      }

      const result = await generateContent(prompt, {
        template: selectedTemplate,
        variables,
        type: activeTab
      });
      
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    // Could add a toast notification here
  };

  const handleSaveToLibrary = async () => {
    if (!generatedContent) return;
    
    try {
      await saveToLibrary({
        title: `AI Generated Content - ${new Date().toLocaleDateString()}`,
        content: generatedContent,
        type: 'post',
        status: 'draft',
        platforms: [],
        tags: ['ai-generated'],
        aiGenerated: true,
        author: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah@contenthub.com',
        }
      });
      
      // Show success message or redirect
      console.log('Content saved to library');
    } catch (error) {
      console.error('Failed to save content:', error);
      setError('Failed to save content to library. Please try again.');
    }
  };

  const handleScheduleContent = () => {
    // This would open a scheduling modal
    console.log('Schedule content:', generatedContent);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Reset variables for new template
      const newVariables: Record<string, string> = {};
      template.variables.forEach(variable => {
        newVariables[variable] = '';
      });
      setVariables(newVariables);
    }
    setGeneratedContent('');
    setError(null);
  };

  const handleModelChange = (model: string) => {
    changeModel(model);
  };

  const canGenerate = () => {
    if (activeTab === 'templates') {
      if (!selectedTemplate) return false;
      const template = templates.find(t => t.id === selectedTemplate);
      return template ? template.variables.every(v => variables[v]?.trim()) : false;
    }
    return customPrompt.trim().length > 0;
  };

  if (!hasAIAccess) {
    return (
      <div className="space-y-6">
        <UpgradePrompt
          feature="AI Content Generation"
          description="Generate high-quality content with our advanced AI tools. Upgrade to Pro to unlock unlimited AI-powered content creation."
          planRequired="pro"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Content Generation</h2>
            <p className="text-gray-600 mt-1">Create engaging content with artificial intelligence</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              ✨ AI Powered
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'templates', label: 'Templates', icon: Wand2 },
            { id: 'custom', label: 'Custom Prompt', icon: Zap },
            { id: 'history', label: 'History', icon: RefreshCw },
            { id: 'models', label: 'AI Models', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 mb-1">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Usage Limit Banner */}
      {aiGenerationLimit !== -1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  AI Generation Usage: {aiGenerationsUsed} / {aiGenerationLimit}
                </p>
                <div className="w-48 bg-blue-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.min((aiGenerationsUsed / aiGenerationLimit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {}} 
              className="text-sm text-blue-700 font-medium hover:text-blue-800"
            >
              Upgrade for more
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div className="space-y-6">
            <AITemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
            
            {selectedTemplate && (
              <AIPromptBuilder
                template={templates.find(t => t.id === selectedTemplate)!}
                variables={variables}
                onVariableChange={handleVariableChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                canGenerate={canGenerate()}
                selectedModel={selectedModel}
              />
            )}
          </div>

          {/* Content Preview */}
          <AIContentPreview
            content={generatedContent}
            isGenerating={isGenerating}
            onCopy={handleCopy}
            onSave={handleSaveToLibrary}
            onSchedule={handleScheduleContent}
            onRegenerate={handleGenerate}
            canRegenerate={canGenerate()}
            model={selectedModel}
          />
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Prompt Builder */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Prompt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe what you want to create
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Write a detailed prompt for the AI to generate content. Be specific about tone, style, length, and target audience..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {customPrompt.length}/1000 characters
                </p>
              </div>

              {/* Prompt Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Suggestions
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Write a compelling social media post about sustainable living",
                    "Create an engaging blog introduction about remote work trends",
                    "Generate a product description for an eco-friendly water bottle",
                    "Write a professional LinkedIn post about career development"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomPrompt(suggestion)}
                      className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Selected Model:</span>
                <span className="font-medium">{availableModels[selectedModel].name}</span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate() || isGenerating}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  !canGenerate() || isGenerating
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
            </div>
          </div>

          {/* Content Preview */}
          <AIContentPreview
            content={generatedContent}
            isGenerating={isGenerating}
            onCopy={handleCopy}
            onSave={handleSaveToLibrary}
            onSchedule={handleScheduleContent}
            onRegenerate={handleGenerate}
            canRegenerate={canGenerate()}
            model={selectedModel}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <AIGenerationHistory
          history={generationHistory}
          onReuse={(item) => {
            if (item.type === 'templates') {
              setActiveTab('templates');
              setSelectedTemplate(item.template);
              setVariables(item.variables);
            } else {
              setActiveTab('custom');
              setCustomPrompt(item.prompt);
            }
            setGeneratedContent(item.content);
          }}
          onSave={handleSaveToLibrary}
          availableModels={availableModels}
        />
      )}

      {activeTab === 'models' && (
        <AIModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      )}

      {/* Usage Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{generationHistory.length}</div>
            <div className="text-sm text-gray-600">Content Generated</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Saved to Library</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">8.7</div>
            <div className="text-sm text-gray-600">Avg. Engagement</div>
          </div>
        </div>
      </div>
    </div>
  );
}