import { supabase } from './supabaseClient';
import { sentryService } from './sentryService';
import { analyticsService } from './analyticsService';

// Define the allowed models
export const AI_MODELS = {
  "gemini-pro": {
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's advanced language model for text generation",
    maxTokens: 8192,
    supportsImages: false,
  },
  "gemini-pro-vision": {
    name: "Gemini Pro Vision",
    provider: "Google",
    description: "Google's multimodal model that can process both text and images",
    maxTokens: 8192,
    supportsImages: true,
  },
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "OpenAI's efficient language model for general-purpose text generation",
    maxTokens: 4096,
    supportsImages: false,
  },
  "gpt-4": {
    name: "GPT-4",
    provider: "OpenAI",
    description: "OpenAI's most advanced language model with enhanced reasoning capabilities",
    maxTokens: 8192,
    supportsImages: false,
  },
  "claude-3-haiku": {
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Anthropic's fastest and most compact model for efficient text generation",
    maxTokens: 4096,
    supportsImages: false,
  },
  "claude-3-sonnet": {
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Anthropic's balanced model offering high-quality outputs with good efficiency",
    maxTokens: 8192,
    supportsImages: false,
  },
};

// Define the request interface
export interface GenerationRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  images?: string[];
}

// Define the response interface
export interface GenerationResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AIService {
  private defaultModel = "gemini-pro";
  
  async generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Add breadcrumb for AI generation
      sentryService.addBreadcrumb({
        category: 'ai',
        message: `Generating content with ${request.model}`,
        data: {
          model: request.model,
          promptLength: request.prompt.length,
          hasImages: request.images && request.images.length > 0,
        },
        level: 'info'
      });
      
      // Track AI generation event
      analyticsService.event('AI', 'Generate', request.model);
      
      // Get the Supabase URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("SUPABASE_URL is not set");
      }
      
      // Get the session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        throw new Error("Not authenticated");
      }
      
      // Call the Supabase Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }
      
      const data: GenerationResponse = await response.json();
      
      // Track successful generation
      analyticsService.event('AI', 'Generation Success', request.model, data.usage?.totalTokens);
      
      return data;
    } catch (error) {
      // Log error to Sentry
      sentryService.captureException(error);
      
      // Track failed generation
      analyticsService.event('AI', 'Generation Error', error.message);
      
      console.error("AI generation error:", error);
      throw error;
    }
  }
  
  getAvailableModels() {
    return AI_MODELS;
  }
  
  getDefaultModel() {
    return this.defaultModel;
  }
  
  setDefaultModel(model: string) {
    if (AI_MODELS[model]) {
      this.defaultModel = model;
      return true;
    }
    return false;
  }
  
  getModelDetails(model: string) {
    return AI_MODELS[model] || null;
  }
  
  supportsImages(model: string) {
    return AI_MODELS[model]?.supportsImages || false;
  }
}

export const aiService = new AIService();