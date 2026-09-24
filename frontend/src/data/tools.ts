export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: "Free" | "Freemium" | "Paid";
  logo: string;
  url: string;
  featured: boolean;
  trending: boolean;
  features: string[];
  easeOfUse: "Easy" | "Moderate" | "Advanced";
  mainFunctionality: string;
  freePlan: boolean;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isPremium?: boolean;
  useCase?: string[];
  tags?: string[];
  couponCode?: string;
  views?: number;
  clicks?: number;
  status?: "pending" | "approved" | "rejected";
}

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  author: string;
  instagram: string;
  featured: boolean;
  suggestedTool?: string;
  suggestedToolId?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface Ad {
  id: string;
  name: string;
  description: string;
  image?: string;
  video?: string;
  url: string;
  type: "image" | "video";
  placement: "featured" | "grid";
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories = [
  { id: "chat", name: "Chat AI", icon: "MessageSquare", color: "hsl(263.4, 70%, 50.4%)" },
  { id: "image", name: "Image AI", icon: "Image", color: "hsl(330, 70%, 50%)" },
  { id: "video", name: "Video AI", icon: "Video", color: "hsl(200, 70%, 50%)" },
  { id: "coding", name: "Coding AI", icon: "Code", color: "hsl(150, 70%, 40%)" },
  { id: "audio", name: "Audio AI", icon: "Music", color: "hsl(30, 70%, 50%)" },
  { id: "productivity", name: "Productivity AI", icon: "Zap", color: "hsl(50, 70%, 45%)" },
];

export const tools: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Advanced AI chatbot by OpenAI for conversation, writing, coding, and analysis.",
    category: "chat",
    pricing: "Freemium",
    logo: "https://cdn.worldvectorlogo.com/logos/chatgpt-6.svg",
    url: "https://chat.openai.com",
    featured: true,
    trending: true,
    features: ["Natural language conversation", "Code generation", "Text analysis", "Image understanding", "Plugin ecosystem"],
    easeOfUse: "Easy",
    mainFunctionality: "Conversational AI assistant",
    freePlan: true,
    rating: 4.9,
    reviewCount: 12840,
    useCase: ["students", "developers", "creators"],
    tags: ["GPT-4", "OpenAI", "Chatbot"],
    couponCode: "AIDISCOVER20",
    views: 45200,
    clicks: 18900,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "AI-powered image generation tool creating stunning art from text descriptions.",
    category: "image",
    pricing: "Paid",
    logo: "https://cdn.worldvectorlogo.com/logos/midjourney.svg",
    url: "https://midjourney.com",
    featured: true,
    trending: true,
    isPremium: true,
    features: ["Text-to-image generation", "Style customization", "High resolution output", "Variation generation"],
    easeOfUse: "Moderate",
    mainFunctionality: "AI image generation",
    freePlan: false,
    rating: 4.8,
    reviewCount: 9560,
    useCase: ["designers", "creators"],
    tags: ["Image Generation", "Art", "Creative"],
    views: 38100,
    clicks: 15200,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with contextual suggestions.",
    category: "coding",
    pricing: "Paid",
    logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    url: "https://github.com/features/copilot",
    featured: true,
    trending: true,
    features: ["Code completion", "Multi-language support", "Context-aware suggestions", "IDE integration"],
    easeOfUse: "Easy",
    mainFunctionality: "AI code completion",
    freePlan: false,
    rating: 4.7,
    reviewCount: 7830,
    useCase: ["developers"],
    tags: ["Code", "GitHub", "Productivity"],
    couponCode: "COPILOT15",
    views: 32400,
    clicks: 14100,
  },
  {
    id: "runway",
    name: "Runway ML",
    description: "Creative AI toolkit for video generation, editing, and visual effects.",
    category: "video",
    pricing: "Freemium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Runway_AI_logo.svg/512px-Runway_AI_logo.svg.png",
    url: "https://runwayml.com",
    featured: true,
    trending: false,
    features: ["Text-to-video", "Video editing", "Background removal", "Motion tracking"],
    easeOfUse: "Moderate",
    mainFunctionality: "AI video creation",
    freePlan: true,
    rating: 4.5,
    reviewCount: 4210,
    useCase: ["creators", "designers"],
    tags: ["Video", "VFX", "Creative"],
    views: 21300,
    clicks: 8700,
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "AI voice synthesis platform for realistic text-to-speech and voice cloning.",
    category: "audio",
    pricing: "Freemium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/ElevenLabs_logo.svg/512px-ElevenLabs_logo.svg.png",
    url: "https://elevenlabs.io",
    featured: false,
    trending: true,
    features: ["Text-to-speech", "Voice cloning", "Multi-language support", "API access"],
    easeOfUse: "Easy",
    mainFunctionality: "AI voice synthesis",
    freePlan: true,
    rating: 4.6,
    reviewCount: 3870,
    isNew: true,
    useCase: ["creators"],
    tags: ["Voice", "TTS", "Audio"],
    views: 19800,
    clicks: 7600,
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "AI-powered workspace for notes, docs, and project management with smart features.",
    category: "productivity",
    pricing: "Freemium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    url: "https://notion.so",
    featured: true,
    trending: false,
    features: ["AI writing assistant", "Summarization", "Action items extraction", "Translation"],
    easeOfUse: "Easy",
    mainFunctionality: "AI-enhanced productivity",
    freePlan: true,
    rating: 4.4,
    reviewCount: 5120,
    useCase: ["students", "developers"],
    tags: ["Productivity", "Writing", "Notes"],
    views: 24600,
    clicks: 9800,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's AI assistant focused on safety, helpfulness, and long-context analysis.",
    category: "chat",
    pricing: "Freemium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/512px-Anthropic_logo.svg.png",
    url: "https://claude.ai",
    featured: true,
    trending: true,
    features: ["200K context window", "Document analysis", "Code generation", "Creative writing"],
    easeOfUse: "Easy",
    mainFunctionality: "Conversational AI assistant",
    freePlan: true,
    rating: 4.8,
    reviewCount: 6740,
    isNew: true,
    useCase: ["students", "developers", "creators"],
    tags: ["Anthropic", "Chatbot", "Analysis"],
    views: 29800,
    clicks: 12300,
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "Open-source AI image generation model for creating art and visuals from text.",
    category: "image",
    pricing: "Free",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Stability_AI_logo.svg/512px-Stability_AI_logo.svg.png",
    url: "https://stability.ai",
    featured: false,
    trending: false,
    features: ["Open source", "Local deployment", "ControlNet support", "Community models"],
    easeOfUse: "Advanced",
    mainFunctionality: "Open-source image generation",
    freePlan: true,
    rating: 4.3,
    reviewCount: 4560,
    useCase: ["developers", "designers"],
    tags: ["Open Source", "Image", "Self-hosted"],
    views: 18200,
    clicks: 6900,
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor built for pair programming with intelligent code assistance.",
    category: "coding",
    pricing: "Freemium",
    logo: "https://www.cursor.com/assets/images/logo.svg",
    url: "https://cursor.com",
    featured: false,
    trending: true,
    features: ["AI code editing", "Codebase understanding", "Multi-file editing", "Chat interface"],
    easeOfUse: "Moderate",
    mainFunctionality: "AI code editor",
    freePlan: true,
    rating: 4.7,
    reviewCount: 3290,
    isNew: true,
    useCase: ["developers"],
    tags: ["IDE", "Code", "Editor"],
    views: 22100,
    clicks: 9400,
  },
  {
    id: "descript",
    name: "Descript",
    description: "AI-powered audio and video editing platform with transcription and screen recording.",
    category: "video",
    pricing: "Freemium",
    logo: "https://cdn.worldvectorlogo.com/logos/descript-2.svg",
    url: "https://descript.com",
    featured: false,
    trending: false,
    features: ["Auto transcription", "Screen recording", "Filler word removal", "AI voice cloning"],
    easeOfUse: "Easy",
    mainFunctionality: "AI video & audio editing",
    freePlan: true,
    rating: 4.4,
    reviewCount: 2870,
    useCase: ["creators"],
    tags: ["Video", "Audio", "Editing"],
    views: 14500,
    clicks: 5800,
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "AI content creation platform for marketing copy, blog posts, and social media.",
    category: "productivity",
    pricing: "Paid",
    logo: "https://cdn.worldvectorlogo.com/logos/jasper-1.svg",
    url: "https://jasper.ai",
    featured: false,
    trending: false,
    isPremium: true,
    features: ["Marketing copy", "Blog generation", "Brand voice", "Template library"],
    easeOfUse: "Easy",
    mainFunctionality: "AI marketing content",
    freePlan: false,
    rating: 4.2,
    reviewCount: 2140,
    useCase: ["creators"],
    tags: ["Marketing", "Copy", "Content"],
    views: 11200,
    clicks: 4300,
  },
  {
    id: "suno",
    name: "Suno",
    description: "AI music generation platform that creates full songs from text prompts.",
    category: "audio",
    pricing: "Freemium",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/2c/Suno_AI_logo.png",
    url: "https://suno.com",
    featured: false,
    trending: true,
    features: ["Text-to-music", "Lyric generation", "Multiple genres", "Song extension"],
    easeOfUse: "Easy",
    mainFunctionality: "AI music generation",
    freePlan: true,
    rating: 4.5,
    reviewCount: 1980,
    isNew: true,
    useCase: ["creators"],
    tags: ["Music", "Audio", "Creative"],
    views: 16700,
    clicks: 6200,
  },
];

export const prompts: Prompt[] = [
  {
    id: "1",
    title: "Remove Background",
    prompt: "Remove the background from this image and replace it with a transparent layer. Keep the subject sharp and clean with no artifacts around the edges.",
    category: "Image AI",
    beforeImage: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    author: "Sarah Chen",
    instagram: "@sarahcreates",
    featured: true,
    suggestedTool: "Midjourney",
    suggestedToolId: "midjourney",
  },
  {
    id: "2",
    title: "Blog Post Generator",
    prompt: "Write a comprehensive blog post about the future of AI in healthcare with headings, subheadings, and a conclusion. Use a professional yet engaging tone.",
    category: "Chat AI",
    beforeImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    author: "James Rivera",
    instagram: "@jamesai",
    featured: true,
    suggestedTool: "ChatGPT",
    suggestedToolId: "chatgpt",
  },
  {
    id: "3",
    title: "Video Scene Generation",
    prompt: "Generate a 10-second cinematic video of a futuristic city at sunset with flying cars and neon lights reflecting off glass buildings.",
    category: "Video AI",
    beforeImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=300&fit=crop",
    author: "Luna Park",
    instagram: "@lunavisuals",
    featured: true,
    suggestedTool: "Runway ML",
    suggestedToolId: "runway",
  },
  {
    id: "4",
    title: "Code Refactoring",
    prompt: "Refactor this React component to use TypeScript, add proper error handling, optimize performance with useMemo and useCallback.",
    category: "Coding AI",
    beforeImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    author: "Dev Patel",
    instagram: "@devbuilds",
    featured: false,
    suggestedTool: "GitHub Copilot",
    suggestedToolId: "github-copilot",
  },
  {
    id: "5",
    title: "Voice Cloning",
    prompt: "Clone this voice sample and generate a narration for a 30-second product advertisement with a warm, professional tone.",
    category: "Audio AI",
    beforeImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
    author: "Alex Morgan",
    instagram: "@alexaudio",
    featured: true,
    suggestedTool: "ElevenLabs",
    suggestedToolId: "elevenlabs",
  },
  {
    id: "6",
    title: "Meeting Summary",
    prompt: "Summarize this 1-hour meeting transcript into key decisions, action items, and next steps. Format as bullet points.",
    category: "Productivity AI",
    beforeImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    author: "Maria Santos",
    instagram: "@mariaworks",
    featured: false,
    suggestedTool: "Notion AI",
    suggestedToolId: "notion-ai",
  },
];

export const ads: Ad[] = [
  {
    id: "ad-1",
    name: "SuperAI Pro",
    description: "The ultimate AI assistant for professionals. Try free for 30 days.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    url: "https://example.com/superai",
    type: "image",
    placement: "featured",
  },
  {
    id: "ad-2",
    name: "AI Studio",
    description: "Create stunning visuals with AI. No design skills needed.",
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4a028?w=400&h=300&fit=crop",
    url: "https://example.com/aistudio",
    type: "image",
    placement: "grid",
  },
];
