import { useState, useEffect } from 'react';
import { AITemplate, ContentItem } from '../types';
import { aiService, AI_MODELS } from '../services/aiService';
import { analyticsService } from '../services/analyticsService';
import { sentryService } from '../services/sentryService';
import { useSubscription } from './useSubscription';

const mockTemplates: AITemplate[] = [
  {
    id: 'social-post',
    name: 'Social Media Post',
    description: 'Generate engaging social media content with hashtags and CTAs',
    prompt: 'Create an engaging social media post about {topic} that includes relevant hashtags and a call-to-action. The tone should be {tone} and target {audience}.',
    category: 'social',
    variables: ['topic', 'tone', 'audience']
  },
  {
    id: 'blog-intro',
    name: 'Blog Introduction',
    description: 'Write compelling blog post introductions that hook readers',
    prompt: 'Write an engaging introduction for a blog post about {topic} that hooks the reader and sets up the main points. The target audience is {audience} and the tone should be {tone}.',
    category: 'blog',
    variables: ['topic', 'audience', 'tone']
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Create compelling product descriptions that convert',
    prompt: 'Write a compelling product description for {product} highlighting its key features: {features} and target audience: {audience}. Focus on benefits and include a strong call-to-action.',
    category: 'marketing',
    variables: ['product', 'features', 'audience']
  },
  {
    id: 'email-subject',
    name: 'Email Subject Lines',
    description: 'Generate catchy email subject lines that increase open rates',
    prompt: 'Generate 5 compelling email subject lines for a campaign about {topic} that will increase open rates. The tone should be {tone} and target {audience}.',
    category: 'marketing',
    variables: ['topic', 'tone', 'audience']
  },
  {
    id: 'video-script',
    name: 'Video Script',
    description: 'Create engaging video scripts for social media',
    prompt: 'Write a {length} video script about {topic} for {platform}. Include a hook, main content, and call-to-action. Target audience: {audience}.',
    category: 'creative',
    variables: ['topic', 'length', 'platform', 'audience']
  },
  {
    id: 'linkedin-article',
    name: 'LinkedIn Article',
    description: 'Professional LinkedIn articles that establish thought leadership',
    prompt: 'Write a professional LinkedIn article about {topic} that establishes thought leadership. Include industry insights, personal experience, and actionable advice for {audience}.',
    category: 'blog',
    variables: ['topic', 'audience']
  },
  {
    id: 'instagram-caption',
    name: 'Instagram Caption',
    description: 'Engaging Instagram captions with relevant hashtags',
    prompt: 'Create an engaging Instagram caption for a post about {topic}. Include storytelling elements, relevant hashtags, and encourage engagement. Target audience: {audience}.',
    category: 'social',
    variables: ['topic', 'audience']
  },
  {
    id: 'press-release',
    name: 'Press Release',
    description: 'Professional press releases for announcements',
    prompt: 'Write a professional press release announcing {announcement}. Include key details: {details}, quotes, and contact information. Target media: {media}.',
    category: 'marketing',
    variables: ['announcement', 'details', 'media']
  }
];

export function useAIGeneration() {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<typeof AI_MODELS>(AI_MODELS);
  const [selectedModel, setSelectedModel] = useState<string>(aiService.getDefaultModel());
  const [error, setError] = useState<string | null>(null);
  
  const { checkFeatureAccess, getFeatureLimit } = useSubscription();
  const hasAIAccess = checkFeatureAccess('AI content generation');
  const aiGenerationLimit = getFeatureLimit('aiGenerations');

  useEffect(() => {
    // Simulate API call to load templates
    const loadTemplates = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setTemplates(mockTemplates);
      setLoading(false);
    };

    loadTemplates();
    
    // Load generation history from local storage
    const savedHistory = localStorage.getItem('ai_generation_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setGenerationHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to parse generation history:', error);
        sentryService.captureException(error);
      }
    }
    
    // Load selected model from local storage
    const savedModel = localStorage.getItem('ai_selected_model');
    if (savedModel && AI_MODELS[savedModel]) {
      setSelectedModel(savedModel);
      aiService.setDefaultModel(savedModel);
    }
  }, []);

  const generateContent = async (prompt: string, options?: any) => {
    setError(null);
    
    try {
      // Check if user has reached their AI generation limit
      if (aiGenerationLimit !== -1) {
        const usedGenerations = generationHistory.length;
        if (usedGenerations >= aiGenerationLimit) {
          throw new Error(`You've reached your limit of ${aiGenerationLimit} AI generations. Please upgrade your plan for unlimited generations.`);
        }
      }
      
      // Add breadcrumb for content generation
      sentryService.addBreadcrumb({
        category: 'ai',
        message: 'Generating content',
        data: {
          template: options?.template,
          model: selectedModel,
        },
        level: 'info'
      });
      
      // Prepare the generation request
      const request = {
        prompt,
        model: selectedModel,
        maxTokens: 1024,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        images: options?.images || [],
      };
      
      // Call the AI service
      const result = await aiService.generateContent(request);
      
      // Track successful generation
      analyticsService.event('AI', 'Content Generated', selectedModel);
      
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        content: result.content,
        prompt,
        template: options?.template,
        variables: options?.variables ? { ...options.variables } : {},
        model: selectedModel,
        provider: result.provider,
        createdAt: new Date(),
        type: options?.type || 'custom'
      };
      
      const updatedHistory = [historyItem, ...generationHistory];
      setGenerationHistory(updatedHistory);
      
      // Save to local storage (limit to last 50 items to prevent storage issues)
      localStorage.setItem('ai_generation_history', JSON.stringify(updatedHistory.slice(0, 50)));
      
      return {
        content: result.content,
        metadata: {
          wordCount: result.content.split(/\s+/).length,
          charCount: result.content.length,
          model: result.model,
          provider: result.provider,
          usage: result.usage,
        }
      };
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.message || 'Failed to generate content');
      
      // Log error to Sentry
      sentryService.captureException(error);
      
      // Track failed generation
      analyticsService.event('AI', 'Generation Error', error.message);
      
      throw error;
    }
  };

  const saveToLibrary = async (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // This would integrate with the content management system
    console.log('Saving to library:', contentData);
    
    // Track save to library event
    analyticsService.event('AI', 'Saved to Library');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const scheduleContent = async (content: string, scheduleData: any) => {
    // This would integrate with the scheduling system
    console.log('Scheduling content:', { content, scheduleData });
    
    // Track schedule event
    analyticsService.event('AI', 'Scheduled Content');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };
  
  const changeModel = (model: string) => {
    if (AI_MODELS[model]) {
      setSelectedModel(model);
      aiService.setDefaultModel(model);
      localStorage.setItem('ai_selected_model', model);
      return true;
    }
    return false;
  };
  
  const clearHistory = () => {
    setGenerationHistory([]);
    localStorage.removeItem('ai_generation_history');
  };

  return {
    templates,
    loading,
    generateContent,
    saveToLibrary,
    scheduleContent,
    generationHistory,
    availableModels,
    selectedModel,
    changeModel,
    clearHistory,
    error,
    hasAIAccess,
    aiGenerationLimit,
  };
}