import { useState, useEffect } from 'react';
import { AITemplate, ContentItem } from '../types';

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

  useEffect(() => {
    // Simulate API call to load templates
    const loadTemplates = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setTemplates(mockTemplates);
      setLoading(false);
    };

    loadTemplates();
  }, []);

  const generateContent = async (prompt: string, options?: any) => {
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated content based on prompt
    let mockContent = '';
    
    if (prompt.includes('social media post')) {
      mockContent = `🚀 Exciting news about ${options?.variables?.topic || 'innovation'}! 

Did you know that innovative approaches to ${options?.variables?.topic || 'this topic'} can transform your entire strategy? Here are 3 key insights that will change how you think about this:

✨ Focus on user experience first
📊 Data-driven decisions lead to better outcomes  
🎯 Consistency builds trust and recognition

What's your experience with ${options?.variables?.topic || 'this topic'}? Share your thoughts below! 👇

#${options?.variables?.topic?.replace(/\s+/g, '') || 'Innovation'} #ContentMarketing #DigitalStrategy #GrowthHacking`;
    } else if (prompt.includes('blog introduction')) {
      mockContent = `In today's rapidly evolving digital landscape, ${options?.variables?.topic || 'this topic'} has become more crucial than ever before. Whether you're a seasoned professional or just starting your journey, understanding the nuances of ${options?.variables?.topic || 'this subject'} can be the difference between success and falling behind the competition.

This comprehensive guide will walk you through everything you need to know about ${options?.variables?.topic || 'this topic'}, from fundamental concepts to advanced strategies that industry leaders are using to stay ahead. By the end of this article, you'll have a clear roadmap for implementing these insights in your own work.

Let's dive into the transformative world of ${options?.variables?.topic || 'this subject'} and discover how you can leverage these powerful techniques to achieve remarkable results.`;
    } else if (prompt.includes('product description')) {
      mockContent = `Introducing the ${options?.variables?.product || 'revolutionary product'} – the perfect solution for ${options?.variables?.audience || 'modern consumers'} who demand quality and innovation.

**Key Features:**
${options?.variables?.features || 'Premium materials, innovative design, user-friendly interface'}

**Why Choose This Product?**
• Designed specifically for ${options?.variables?.audience || 'your needs'}
• Backed by extensive research and development
• Proven results with thousands of satisfied customers
• 30-day money-back guarantee

Don't settle for ordinary. Experience the difference that quality makes. Order your ${options?.variables?.product || 'product'} today and join the thousands of customers who have already transformed their experience.

**Limited Time Offer:** Get 20% off your first order with code SAVE20. Order now!`;
    } else if (prompt.includes('email subject')) {
      mockContent = `Here are 5 compelling email subject lines for your ${options?.variables?.topic || 'campaign'}:

1. "🔥 Don't Miss Out: ${options?.variables?.topic || 'Exclusive Offer'} Inside"
2. "Last Chance: ${options?.variables?.topic || 'Special Deal'} Ends Tonight"
3. "You're Invited: Exclusive ${options?.variables?.topic || 'Event'} for VIP Members"
4. "Breaking: New ${options?.variables?.topic || 'Innovation'} Changes Everything"
5. "Quick Question About Your ${options?.variables?.topic || 'Goals'}..."

Each subject line is designed to increase open rates by creating urgency, curiosity, or personal connection with your ${options?.variables?.audience || 'target audience'}.`;
    } else {
      // Generic content for custom prompts
      mockContent = `Based on your prompt, here's the generated content:

${prompt.substring(0, 100)}...

This content has been crafted to meet your specific requirements while maintaining engagement and clarity. The AI has analyzed your prompt and generated content that balances creativity with your stated objectives.

Key elements included:
• Clear and engaging opening
• Structured information flow
• Call-to-action elements
• Audience-appropriate tone

Feel free to regenerate or modify this content to better suit your needs.`;
    }

    return {
      content: mockContent,
      metadata: {
        wordCount: mockContent.split(/\s+/).length,
        charCount: mockContent.length,
        tone: options?.variables?.tone || 'professional',
        readingTime: Math.ceil(mockContent.split(/\s+/).length / 200)
      }
    };
  };

  const saveToLibrary = async (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // This would integrate with the content management system
    console.log('Saving to library:', contentData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const scheduleContent = async (content: string, scheduleData: any) => {
    // This would integrate with the scheduling system
    console.log('Scheduling content:', { content, scheduleData });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  return {
    templates,
    loading,
    generateContent,
    saveToLibrary,
    scheduleContent,
  };
}