import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.2.1";

// Define the allowed models
const ALLOWED_MODELS = {
  "gemini-pro": {
    provider: "google",
    model: "gemini-pro",
    maxTokens: 8192,
  },
  "gemini-pro-vision": {
    provider: "google",
    model: "gemini-pro-vision",
    maxTokens: 8192,
  },
  "gpt-3.5-turbo": {
    provider: "openai",
    model: "gpt-3.5-turbo",
    maxTokens: 4096,
  },
  "gpt-4": {
    provider: "openai",
    model: "gpt-4",
    maxTokens: 8192,
  },
  "claude-3-haiku": {
    provider: "anthropic",
    model: "claude-3-haiku",
    maxTokens: 4096,
  },
  "claude-3-sonnet": {
    provider: "anthropic",
    model: "claude-3-sonnet",
    maxTokens: 8192,
  },
};

// Define the request body interface
interface GenerationRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  images?: string[];
}

// Define the response interface
interface GenerationResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Initialize Google Generative AI
function initGoogleAI() {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
}

// Generate content with Google Gemini
async function generateWithGemini(
  prompt: string,
  model: string,
  maxTokens?: number,
  temperature?: number,
  topP?: number,
  topK?: number,
  images?: string[]
): Promise<GenerationResponse> {
  try {
    const genAI = initGoogleAI();
    const modelConfig = ALLOWED_MODELS[model];
    
    if (!modelConfig || modelConfig.provider !== "google") {
      throw new Error(`Invalid model: ${model}`);
    }
    
    const geminiModel = genAI.getGenerativeModel({
      model: modelConfig.model,
    });
    
    const generationConfig = {
      maxOutputTokens: maxTokens || modelConfig.maxTokens,
      temperature: temperature || 0.7,
      topP: topP || 0.95,
      topK: topK || 40,
    };
    
    let result;
    
    if (model === "gemini-pro-vision" && images && images.length > 0) {
      // Handle image inputs for vision model
      const imageObjects = await Promise.all(
        images.map(async (imageUrl) => {
          const response = await fetch(imageUrl);
          const imageData = await response.arrayBuffer();
          return {
            inlineData: {
              data: btoa(String.fromCharCode(...new Uint8Array(imageData))),
              mimeType: response.headers.get("content-type") || "image/jpeg",
            },
          };
        })
      );
      
      result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              ...imageObjects,
            ],
          },
        ],
        generationConfig,
      });
    } else {
      // Text-only generation
      result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig,
      });
    }
    
    const response = result.response;
    const text = response.text();
    
    return {
      content: text,
      model: modelConfig.model,
      provider: modelConfig.provider,
      usage: {
        promptTokens: 0, // Gemini doesn't provide token usage yet
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  } catch (error) {
    console.error("Error generating with Gemini:", error);
    throw error;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
  
  try {
    // Parse request body
    const requestData: GenerationRequest = await req.json();
    const { prompt, model, maxTokens, temperature, topP, topK, images } = requestData;
    
    // Validate required fields
    if (!prompt) {
      throw new Error("Prompt is required");
    }
    
    if (!model || !ALLOWED_MODELS[model]) {
      throw new Error(`Invalid model: ${model}. Allowed models: ${Object.keys(ALLOWED_MODELS).join(", ")}`);
    }
    
    // Generate content based on the provider
    const modelConfig = ALLOWED_MODELS[model];
    let response: GenerationResponse;
    
    if (modelConfig.provider === "google") {
      response = await generateWithGemini(
        prompt,
        model,
        maxTokens,
        temperature,
        topP,
        topK,
        images
      );
    } else {
      // For now, we only support Google Gemini
      // In the future, we can add support for OpenAI and Anthropic
      throw new Error(`Provider not supported: ${modelConfig.provider}`);
    }
    
    // Return the response
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during content generation",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});