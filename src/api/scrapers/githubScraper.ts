/**
 * GitHub Awesome Lists Scraper
 * Fetches AI tools from awesome-ai-tools GitHub repositories
 */

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  topics?: string[];
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
 * Fetch AI tools from GitHub awesome-ai-tools repositories
 * Uses GitHub API to search for trending AI tool repos
 */
export const fetchGitHubAwesomeTools = async (): Promise<TransformedTool[]> => {
  // Real demo tools when API fails (actual consumer AI tools)
  const demoTools: TransformedTool[] = [
    {
      name: 'Claude',
      description: 'Anthropic\'s advanced AI assistant for analysis, writing, and reasoning.',
      category: 'chat',
      pricing: 'Freemium',
      logo: 'https://claude.ai/favicon.ico',
      url: 'https://claude.ai',
      featured: true,
      trending: true,
      rating: 4.7,
      reviewCount: 35000,
      features: ['Conversational AI', 'Document Analysis', 'Coding', 'Reasoning'],
      tags: ['Claude', 'LLM', 'AI Assistant', 'Advanced'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'Conversational AI',
      views: 350000,
      clicks: 87500,
      status: 'approved',
    },
    {
      name: 'Copilot',
      description: 'GitHub Copilot AI coding assistant powered by GPT models.',
      category: 'coding',
      pricing: 'Paid',
      logo: 'https://github.com/favicon.ico',
      url: 'https://github.com/copilot',
      featured: true,
      trending: true,
      rating: 4.7,
      reviewCount: 45000,
      features: ['Code Completion', 'AI Pair Programming', 'Multi-language'],
      tags: ['Coding', 'GitHub', 'AI Assistant', 'Development'],
      freePlan: false,
      easeOfUse: 'Easy',
      mainFunctionality: 'Code Generation',
      views: 300000,
      clicks: 75000,
      status: 'approved',
    },
    {
      name: 'Perplexity AI',
      description: 'AI search engine combining web search with conversational AI.',
      category: 'search',
      pricing: 'Freemium',
      logo: 'https://www.perplexity.ai/favicon.ico',
      url: 'https://www.perplexity.ai',
      featured: true,
      trending: true,
      rating: 4.6,
      reviewCount: 28000,
      features: ['Web Search', 'Citations', 'Real-time Info', 'Conversational'],
      tags: ['Search', 'AI', 'Research', 'Information'],
      freePlan: true,
      easeOfUse: 'Very Easy',
      mainFunctionality: 'AI Powered Search',
      views: 280000,
      clicks: 70000,
      status: 'approved',
    },
  ];

  try {
    console.log('🔍 Fetching from GitHub Awesome Lists...');

    // Try to fetch from GitHub README files with curated AI tools lists
    const repos = [
      'sindresorhus/awesome',
      'F0RE1KKUMA/awesome-chatgpt-api',
      'notion-alternative/www',
    ];

    const tools: TransformedTool[] = [];

    // Try to fetch README content from repos
    for (const repo of repos) {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
            // Add GitHub token if available for higher rate limits
            ...(import.meta.env.VITE_GITHUB_API_TOKEN && {
              'Authorization': `token ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
            }),
          },
        });

        if (response.ok) {
          const content = await response.text();
          // Simple extraction of URLs from markdown
          const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const matches = [...content.matchAll(urlRegex)];
          
          for (const match of matches.slice(0, 3)) {
            const [, name, url] = match;
            if (name && url && !url.startsWith('#')) {
              tools.push({
                name: name.substring(0, 50),
                description: `AI tool: ${name}`,
                category: 'productivity',
                pricing: 'Unknown',
                logo: 'https://github.com/favicon.ico',
                url: url,
                featured: false,
                trending: false,
                rating: 4.0,
                reviewCount: 100,
                features: ['From GitHub'],
                tags: ['GitHub', 'AI'],
                freePlan: true,
                easeOfUse: 'Medium',
                mainFunctionality: 'AI Tool',
                views: 10000,
                clicks: 2500,
                status: 'approved',
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${repo}:`, error);
      }
    }

    // If we found real tools, return them
    if (tools.length > 0) {
      console.log(`✅ Fetched ${tools.length} tools from GitHub`);
      return tools;
    }
    
    console.log('📦 GitHub: Using demo tools (no data fetched)');
    return demoTools;
  } catch (error) {
    console.error('❌ Error fetching GitHub tools:', error);
    console.log('📦 GitHub: Falling back to demo tools');
    return demoTools;
  }
};

/**
 * Transform GitHub repository to AI Tool schema
 */
export const transformGitHubRepo = (repo: GitHubRepo): TransformedTool => {
  const isTrending = repo.stargazers_count > 1000;
  
  return {
    name: repo.name.replace(/-/g, ' ').charAt(0).toUpperCase() + repo.name.slice(1),
    description: repo.description || 'Open-source AI tool',
    category: detectCategoryFromDescription(repo.description || ''),
    pricing: 'Free', // GitHub repos are typically free
    logo: `https://github.com/${repo.html_url.split('/')[3]}.png`,
    url: repo.html_url,
    featured: isTrending && repo.stargazers_count > 5000,
    trending: isTrending,
    rating: Math.min(5, 3 + (repo.stargazers_count / 10000)), // Rate based on stars
    reviewCount: repo.stargazers_count,
    features: ['Open Source', 'Community Driven', 'Customizable'],
    tags: repo.topics || ['ai', 'github', 'opensource'],
    freePlan: true,
    easeOfUse: 'Medium',
    mainFunctionality: repo.description || 'AI Tool',
    views: repo.stargazers_count,
    clicks: Math.floor(repo.stargazers_count * 0.3),
    status: 'approved',
  };
};

/**
 * Detect category from repository description
 */
const detectCategoryFromDescription = (description: string): string => {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes('chat') || lowerDesc.includes('conversation')) return 'chat';
  if (lowerDesc.includes('image') || lowerDesc.includes('vision')) return 'image-generation';
  if (lowerDesc.includes('video')) return 'video';
  if (lowerDesc.includes('code') || lowerDesc.includes('programmer')) return 'coding';
  if (lowerDesc.includes('music') || lowerDesc.includes('audio')) return 'music';
  if (lowerDesc.includes('writing') || lowerDesc.includes('text')) return 'writing';
  if (lowerDesc.includes('3d') || lowerDesc.includes('design')) return 'design';
  if (lowerDesc.includes('voice') || lowerDesc.includes('speech')) return 'voice';

  return 'other';
};

/**
 * Parse awesome-ai-tools markdown content
 * Extracts links and descriptions from markdown format
 */
export const parseAwesomeMarkdown = (content: string): TransformedTool[] => {
  const tools: TransformedTool[] = [];
  
  // Match markdown links: [name](url) - description
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)[^\n]*(?:- ([^\n]+))?/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [, name, url, description] = match;
    
    if (name && url && !url.includes('github.com/awesome')) {
      tools.push({
        name: name.trim(),
        description: description?.trim() || 'AI Tool',
        category: 'other',
        pricing: 'Unknown',
        logo: extractLogoUrl(url),
        url: url.trim(),
        featured: false,
        trending: false,
        rating: 4.0,
        reviewCount: 0,
        features: [],
        tags: ['ai'],
        freePlan: true,
        easeOfUse: 'Easy',
        mainFunctionality: description?.trim() || 'AI Tool',
        views: 0,
        clicks: 0,
        status: 'approved',
      });
    }
  }

  return tools;
};

/**
 * Extract logo URL from website
 */
const extractLogoUrl = (websiteUrl: string): string => {
  try {
    const url = new URL(websiteUrl);
    return `${url.origin}/favicon.ico`;
  } catch {
    return '';
  }
};
