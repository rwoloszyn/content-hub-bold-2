import { useState, useEffect } from 'react';
import { AITemplate, ContentItem } from '../types';
import { aiService, AI_MODELS } from '../services/aiService';
import { analyticsService } from '../services/analyticsService';
import { sentryService } from '../services/sentryService';
import { useSubscription } from './useSubscription';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
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
    
    // Load generation history from database if user is authenticated
    const loadGenerationHistory = async () => {
      if (!user) {
        // Load from local storage for unauthenticated users
        const savedHistory = localStorage.getItem('ai_generation_history');
        if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory);
            const historyWithDates = parsedHistory.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt)
            }));
            setGenerationHistory(historyWithDates);
          } catch (error) {
            console.error('Failed to parse generation history:', error);
            sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
          }
        }
        return;
      }

      try {
        // Load from Supabase for authenticated users
        const { data, error } = await supabase
          .from('ai_generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          throw error;
        }

        // Transform database data to match expected format
        const transformedHistory = data.map((item: any) => ({
          id: item.id,
          content: item.generated_content,
          prompt: item.prompt,
          template: item.template_id,
          templateName: item.template_name,
          variables: item.variables || {},
          model: item.model,
          provider: item.provider,
          createdAt: new Date(item.created_at),
          type: 'ai-generated',
          usage: item.usage_data,
        }));

        setGenerationHistory(transformedHistory);
      } catch (error) {
        console.error('Failed to load generation history from database:', error);
        sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
        
        // Fallback to local storage
        const savedHistory = localStorage.getItem('ai_generation_history');
        if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory);
            const historyWithDates = parsedHistory.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt)
            }));
            setGenerationHistory(historyWithDates);
          } catch (error) {
            console.error('Failed to parse generation history:', error);
            sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
          }
        }
      }
    };

    loadGenerationHistory();
    
    // Load selected model from local storage
    const savedModel = localStorage.getItem('ai_selected_model');
    if (savedModel && (savedModel as keyof typeof AI_MODELS) in AI_MODELS) {
      setSelectedModel(savedModel);
      aiService.setDefaultModel(savedModel);
    }
  }, [user]);

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
      
      // Create history item
      const historyItem = {
        id: Date.now().toString(),
        content: result.content,
        prompt,
        template: options?.template,
        templateName: options?.templateName,
        variables: options?.variables ? { ...options.variables } : {},
        model: selectedModel,
        provider: result.provider,
        createdAt: new Date(),
        type: options?.type || 'custom',
        usage: result.usage,
      };
      
      // Save to database if user is authenticated
      if (user) {
        try {
          const { data, error } = await supabase
            .from('ai_generations')
            .insert({
              id: historyItem.id,
              user_id: user.id,
              prompt: historyItem.prompt,
              generated_content: historyItem.content,
              template_id: historyItem.template,
              template_name: historyItem.templateName,
              variables: historyItem.variables,
              model: historyItem.model,
              provider: historyItem.provider,
              usage_data: historyItem.usage,
            })
            .select()
            .single();

          if (error) {
            console.error('Failed to save generation to database:', error);
            // Continue with local storage fallback
          } else {
            // Update history item with database ID
            historyItem.id = data.id;
          }
        } catch (dbError) {
          console.error('Database save failed:', dbError);
          // Continue with local storage fallback
        }
      }
      
      // Add to local history
      const updatedHistory = [historyItem, ...generationHistory];
      setGenerationHistory(updatedHistory);
      
      // Save to local storage as backup (limit to last 50 items)
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      
      // Log error to Sentry
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      
      // Track failed generation
      analyticsService.event('AI', 'Generation Error', errorMessage);
      
      throw error;
    }
  };

  const saveToLibrary = async (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('User must be authenticated to save content');
    }

    try {
      // Add breadcrumb for save to library
      sentryService.addBreadcrumb({
        category: 'content',
        message: 'Saving AI-generated content to library',
        data: {
          contentType: contentData.type,
          title: contentData.title,
        },
        level: 'info'
      });

      // Prepare data for Supabase
      const supabaseData = {
        user_id: user.id,
        title: contentData.title,
        content: contentData.content,
        type: contentData.type,
        status: contentData.status,
        platforms: contentData.platforms || [],
        scheduled_date: contentData.scheduledDate?.toISOString(),
        published_date: contentData.publishedDate?.toISOString(),
        tags: contentData.tags || [],
        ai_generated: contentData.aiGenerated || false,
        media_url: contentData.mediaUrl,
        preview: contentData.preview,
      };

      // Insert into content_items table
      const { data, error } = await supabase
        .from('content_items')
        .insert(supabaseData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Track save to library event
      analyticsService.event('AI', 'Saved to Library', contentData.type);

      return { success: true, contentId: data.id };
    } catch (error) {
      console.error('Failed to save to library:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  const scheduleContent = async (content: string, scheduleData: any) => {
    if (!user) {
      throw new Error('User must be authenticated to schedule content');
    }

    try {
      // Add breadcrumb for content scheduling
      sentryService.addBreadcrumb({
        category: 'content',
        message: 'Scheduling AI-generated content',
        data: {
          scheduledDate: scheduleData.date,
          platforms: scheduleData.platforms,
        },
        level: 'info'
      });

      // First, save the content if it doesn't exist
      let contentId = scheduleData.contentId;
      
      if (!contentId) {
        // Create new content item
        const contentData = {
          user_id: user.id,
          title: scheduleData.title || 'AI Generated Content',
          content: content,
          type: scheduleData.type || 'post',
          status: 'scheduled',
          platforms: scheduleData.platforms || [],
          scheduled_date: scheduleData.date,
          tags: scheduleData.tags || [],
          ai_generated: true,
          media_url: scheduleData.mediaUrl,
        };

        const { data: contentResult, error: contentError } = await supabase
          .from('content_items')
          .insert(contentData)
          .select()
          .single();

        if (contentError) {
          throw contentError;
        }

        contentId = contentResult.id;
      }

      // Create schedule entry
      const scheduleEntry = {
        content_id: contentId,
        user_id: user.id,
        scheduled_date: scheduleData.date,
        scheduled_time: scheduleData.time || '09:00',
        platforms: scheduleData.platforms || [],
        status: 'scheduled',
      };

      const { data: scheduleResult, error: scheduleError } = await supabase
        .from('content_schedules')
        .insert(scheduleEntry)
        .select()
        .single();

      if (scheduleError) {
        throw scheduleError;
      }

      // Track schedule event
      analyticsService.event('AI', 'Scheduled Content', scheduleData.platforms?.join(',') || 'unknown');

      return { success: true, contentId, scheduleId: scheduleResult.id };
    } catch (error) {
      console.error('Failed to schedule content:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };
  
  const changeModel = (model: string) => {
    if ((model as keyof typeof AI_MODELS) in AI_MODELS) {
      setSelectedModel(model);
      aiService.setDefaultModel(model);
      localStorage.setItem('ai_selected_model', model);
      return true;
    }
    return false;
  };
  
  const clearHistory = async () => {
    try {
      // Clear database history if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('ai_generations')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to clear database history:', error);
          sentryService.captureException(error);
          // Continue with local clear even if database clear fails
        }
      }

      // Clear local state and storage
      setGenerationHistory([]);
      localStorage.removeItem('ai_generation_history');
      
      // Track history clear event
      analyticsService.event('AI', 'History Cleared');
    } catch (error) {
      console.error('Failed to clear history:', error);
      sentryService.captureException(error instanceof Error ? error : new Error(String(error)));
      
      // Still clear local state even if database operation fails
      setGenerationHistory([]);
      localStorage.removeItem('ai_generation_history');
    }
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