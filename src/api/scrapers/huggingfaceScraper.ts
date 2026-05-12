/**
 * HuggingFace Models & Datasets Scraper
 * Fetches trending AI models from HuggingFace Hub
 */

interface HuggingFaceModel {
  id: string;
  modelId: string;
  name?: string;
  description?: string;
  private?: boolean;
  gated?: boolean;
  tags?: string[];
  pipeline_tag?: string;
  likes?: number;
  downloads?: number;
}

interface TransformedTool {
  name: string;
  description: string;
  category: string;
  pricing: string;
  logo: string;
  url: string;
  featured: boolean;
  trending: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  tags: string[];
  freePlan: boolean;
  easeOfUse: string;
  mainFunctionality: string;
  views: number;
  clicks: number;
  status: string;
}

/**
 * Fetch trending AI models from HuggingFace Hub
 * https://huggingface.co/docs/hub/api
 */
export const fetchHuggingFaceModels = async (): Promise<TransformedTool[]> => {
  // Real consumer AI tools (not ML models) for fallback and demo
  const demoModels: TransformedTool[] = [
    {
      name: 'ChatGPT',
      description: 'Advanced AI chatbot powered by GPT models for conversations, writing, coding, and more.',
      category: 'chat',
      pricing: 'Freemium',
      logo: 'https://cdn.openai.com/API/docs/images/model-icon.png',
      url: 'https://chatgpt.com',
      featured: true,
      trending: true,
      rating: 4.8,
      reviewCount: 50000,
      features: ['Conversational AI', 'Code Generation', 'Writing Assistant', 'API Available'],
      tags: ['ChatGPT', 'LLM', 'Productivity', 'AI Chat'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'Conversational AI',
      views: 500000,
      clicks: 125000,
      status: 'approved',
    },
    {
      name: 'Claude',
      description: 'Anthropic\'s powerful AI assistant for document analysis, research, and extended thinking.',
      category: 'chat',
      pricing: 'Freemium',
      logo: 'https://claude.ai/favicon.ico',
      url: 'https://claude.ai',
      featured: true,
      trending: true,
      rating: 4.7,
      reviewCount: 35000,
      features: ['Long Context', 'Document Analysis', 'Code Understanding', 'Vision'],
      tags: ['Claude', 'LLM', 'AI Assistant', 'Research'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'Conversational AI',
      views: 350000,
      clicks: 87500,
      status: 'approved',
    },
    {
      name: 'Midjourney',
      description: 'AI art generator creating stunning visuals from text prompts with exceptional quality.',
      category: 'image-generation',
      pricing: 'Paid',
      logo: 'https://www.midjourney.com/favicon.ico',
      url: 'https://www.midjourney.com',
      featured: true,
      trending: true,
      rating: 4.7,
      reviewCount: 45000,
      features: ['Text-to-Image', 'Style Control', 'Upscaling', 'Remix'],
      tags: ['Art', 'Image Generation', 'Creative', 'Design'],
      freePlan: false,
      easeOfUse: 'Easy',
      mainFunctionality: 'AI Image Generation',
      views: 450000,
      clicks: 112500,
      status: 'approved',
    },
    {
      name: 'Jasper',
      description: 'AI copywriter and content creator for marketing, blogs, and social media.',
      category: 'writing',
      pricing: 'Paid',
      logo: 'https://www.jasper.ai/favicon.ico',
      url: 'https://www.jasper.ai',
      featured: true,
      trending: true,
      rating: 4.5,
      reviewCount: 32000,
      features: ['AI Writing', 'Brand Voice', 'SEO Optimization', 'Templates'],
      tags: ['Writing', 'Content', 'Marketing', 'AI'],
      freePlan: false,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'AI Content Writing',
      views: 220000,
      clicks: 55000,
      status: 'approved',
    },
    {
      name: 'Descript',
      description: 'Video and audio editing with AI transcription and voice cloning capabilities.',
      category: 'video',
      pricing: 'Freemium',
      logo: 'https://www.descript.com/favicon.ico',
      url: 'https://www.descript.com',
      featured: true,
      trending: true,
      rating: 4.6,
      reviewCount: 28000,
      features: ['Video Editing', 'Transcription', 'Voice Cloning', 'Cloud Editing'],
      tags: ['Video', 'Audio', 'Editing', 'Content Creation'],
      freePlan: true,
      easeOfUse: 'Easy',
      mainFunctionality: 'AI Video Editor',
      views: 180000,
      clicks: 45000,
      status: 'approved',
    },
  ];

  try {
    console.log('🔍 Fetching from HuggingFace Hub...');
    
    // Always return curated consumer tools instead of technical ML models
    console.log('📦 HuggingFace: Using curated consumer AI tools');
    return demoModels;

    /* Commented out: HuggingFace API fetching - returns technical model names, not consumer tools
    const tools: TransformedTool[] = [];

    for (const pipeline of pipelines) {
      try {
        const response = await fetch(
          `https://huggingface.co/api/models?pipeline_tag=${pipeline}&sort=likes&direction=-1&limit=5`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (response.ok) {
          const models: HuggingFaceModel[] = await response.json();
          
          for (const model of models) {
            if (!model.private && !model.gated) {
              const tool = transformHuggingFaceModel(model);
              tools.push(tool);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${pipeline} models:`, error);
      }
    }

    console.log(`✅ Fetched ${tools.length} models from HuggingFace`);
    
    // If no tools fetched, return demo models
    if (tools.length === 0) {
      console.log('📦 HuggingFace: Using demo models (API failed or no data)');
      return demoModels;
    }
    
    return tools;
    */
  } catch (error) {
    console.error('❌ Error fetching HuggingFace models:', error);
    console.log('📦 HuggingFace: Falling back to demo models');
    return demoModels;
  }
};

/**
 * Transform HuggingFace model to AI Tool schema
 */
export const transformHuggingFaceModel = (model: HuggingFaceModel): TransformedTool => {
  const likes = model.likes || 0;
  const downloads = model.downloads || 0;
  const isFeatured = likes > 10000;
  const isTrending = downloads > 50000;

  return {
    name: model.modelId.split('/')[1] || model.modelId,
    description: model.description || `HuggingFace ${model.pipeline_tag} model`,
    category: mapPipelineToCategory(model.pipeline_tag),
    pricing: 'Free',
    logo: 'https://huggingface.co/front/assets/huggingface_logo.png',
    url: `https://huggingface.co/${model.modelId}`,
    featured: isFeatured,
    trending: isTrending,
    rating: Math.min(5, 3 + (likes / 5000)),
    reviewCount: likes,
    features: [model.pipeline_tag || 'AI Model', 'API Available', 'Open Source'],
    tags: model.tags || ['ai', 'huggingface', 'ml'],
    freePlan: true,
    easeOfUse: 'Easy',
    mainFunctionality: `${model.pipeline_tag} Model`,
    views: downloads,
    clicks: Math.floor(downloads * 0.2),
    status: 'approved',
  };
};

/**
 * Map HuggingFace pipeline tags to tool categories
 */
const mapPipelineToCategory = (pipeline?: string): string => {
  if (!pipeline) return 'other';

  const categoryMap: { [key: string]: string } = {
    'text-generation': 'chat',
    'text2text-generation': 'writing',
    'summarization': 'writing',
    'translation': 'writing',
    'question-answering': 'chat',
    'zero-shot-classification': 'coding',
    'sentiment-analysis': 'writing',
    'image-classification': 'image-generation',
    'object-detection': 'image-generation',
    'image-segmentation': 'image-generation',
    'image-to-text': 'image-generation',
    'text-to-image': 'image-generation',
    'speech-recognition': 'voice',
    'text-to-speech': 'voice',
    'music-generation': 'music',
    'video-classification': 'video',
  };

  return categoryMap[pipeline] || 'other';
};

/**
 * Get trending models from HuggingFace
 */
export const getHuggingFaceTrending = async (): Promise<TransformedTool[]> => {
  // Real trending consumer AI tools
  const demoTrending: TransformedTool[] = [
    {
      name: 'Copilot',
      description: 'GitHub Copilot AI-powered coding assistant with advanced code completion.',
      category: 'coding',
      pricing: 'Paid',
      logo: 'https://github.com/favicon.ico',
      url: 'https://github.com/copilot',
      featured: true,
      trending: true,
      rating: 4.7,
      reviewCount: 45000,
      features: ['Code Completion', 'Multi-language', 'AI Pair Programming', 'Integration'],
      tags: ['Coding', 'GitHub', 'AI', 'Development'],
      freePlan: false,
      easeOfUse: 'Easy',
      mainFunctionality: 'AI Code Generation',
      views: 300000,
      clicks: 75000,
      status: 'approved',
    },
    {
      name: 'Perplexity AI',
      description: 'AI search engine with real-time web access and conversational interface.',
      category: 'search',
      pricing: 'Freemium',
      logo: 'https://www.perplexity.ai/favicon.ico',
      url: 'https://www.perplexity.ai',
      featured: true,
      trending: true,
      rating: 4.6,
      reviewCount: 28000,
      features: ['Web Search', 'Citations', 'Real-time Info', 'Sources'],
      tags: ['Search', 'Research', 'Information', 'AI'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'AI Search Engine',
      views: 280000,
      clicks: 70000,
      status: 'approved',
    },
    {
      name: 'Notion AI',
      description: 'AI-powered workspace assistant for writing, brainstorming, and productivity.',
      category: 'productivity',
      pricing: 'Freemium',
      logo: 'https://www.notion.so/favicon.ico',
      url: 'https://www.notion.so',
      featured: true,
      trending: true,
      rating: 4.6,
      reviewCount: 38000,
      features: ['Writing Assistant', 'Brainstorming', 'Summarization', 'Task Generation'],
      tags: ['Productivity', 'Note-taking', 'AI', 'Workspace'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'AI Productivity',
      views: 320000,
      clicks: 80000,
      status: 'approved',
    },
    {
      name: 'Bing Image Creator',
      description: 'AI image generator powered by DALL-E with free integration in Bing search.',
      category: 'image-generation',
      pricing: 'Free',
      logo: 'https://www.bing.com/favicon.ico',
      url: 'https://www.bing.com/images/create',
      featured: false,
      trending: true,
      rating: 4.4,
      reviewCount: 25000,
      features: ['Text-to-Image', 'Free Access', 'High Quality', 'Web Integration'],
      tags: ['Image Generation', 'AI Art', 'Free', 'DALL-E'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'AI Image Generation',
      views: 150000,
      clicks: 37500,
      status: 'approved',
    },
  ];

  // Always return curated consumer tools
  console.log('📦 HuggingFace Trending: Using curated trending AI tools');
  return demoTrending;

  /* Commented out: Keep for future if API becomes available
  try {
    const response = await fetch(
      'https://huggingface.co/api/models?sort=downloads&direction=-1&limit=20'
    );

    if (response.ok) {
      const models: HuggingFaceModel[] = await response.json();
      const fetched = models
        .filter(m => !m.private && !m.gated)
        .map(transformHuggingFaceModel);
      
      if (fetched.length > 0) {
        console.log(`✅ Fetched ${fetched.length} trending models from HuggingFace`);
        return fetched;
      }
      
      console.log('📦 HuggingFace Trending: Using demo models (no data returned)');
      return demoTrending;
    }

    console.log('📦 HuggingFace Trending: Using demo models (API failed)');
    return demoTrending;
  } catch (error) {
    console.error('Error fetching HuggingFace trending:', error);
    console.log('📦 HuggingFace Trending: Falling back to demo models');
    return demoTrending;
  }
  */
};
