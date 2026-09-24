const fs = require('fs');
const path = require('path');

const categories = [
  { id: "chat", name: "Chat AI", icon: "MessageSquare", color: "hsl(263.4, 70%, 50.4%)" },
  { id: "image", name: "Image Generation", icon: "Image", color: "hsl(330, 70%, 50%)" },
  { id: "video", name: "Video", icon: "Video", color: "hsl(200, 70%, 50%)" },
  { id: "audio", name: "Audio & Music", icon: "Music", color: "hsl(30, 70%, 50%)" },
  { id: "coding", name: "Coding", icon: "Code", color: "hsl(150, 70%, 40%)" },
  { id: "productivity", name: "Productivity", icon: "Zap", color: "hsl(50, 70%, 45%)" },
  { id: "marketing", name: "Marketing", icon: "TrendingUp", color: "hsl(15, 70%, 50%)" },
  { id: "design", name: "Design", icon: "Palette", color: "hsl(280, 70%, 50%)" },
  { id: "education", name: "Education", icon: "GraduationCap", color: "hsl(100, 70%, 40%)" },
  { id: "research", name: "Research", icon: "Code", color: "hsl(180, 70%, 40%)" },
  { id: "business", name: "Business", icon: "Zap", color: "hsl(220, 70%, 50%)" },
  { id: "finance", name: "Finance", icon: "TrendingUp", color: "hsl(120, 70%, 40%)" }
];

const toolsList = [
  // Chat
  { n: "ChatGPT", u: "chat.openai.com", c: "chat" },
  { n: "Claude", u: "claude.ai", c: "chat" },
  { n: "Gemini", u: "gemini.google.com", c: "chat" },
  { n: "Perplexity", u: "perplexity.ai", c: "chat" },
  { n: "Microsoft Copilot", u: "copilot.microsoft.com", c: "chat" },
  { n: "Grok", u: "grok.x.ai", c: "chat" },
  { n: "DeepSeek", u: "chat.deepseek.com", c: "chat" },
  { n: "Mistral", u: "chat.mistral.ai", c: "chat" },
  { n: "Meta AI", u: "meta.ai", c: "chat" },
  { n: "Poe", u: "poe.com", c: "chat" },
  { n: "Pi", u: "pi.ai", c: "chat" },
  { n: "HuggingChat", u: "huggingface.co/chat", c: "chat" },
  { n: "You.com", u: "you.com", c: "chat" },
  { n: "ChatSonic", u: "writesonic.com/chat", c: "chat" },
  
  // Image
  { n: "Midjourney", u: "midjourney.com", c: "image" },
  { n: "Adobe Firefly", u: "firefly.adobe.com", c: "image" },
  { n: "Ideogram", u: "ideogram.ai", c: "image" },
  { n: "Leonardo AI", u: "leonardo.ai", c: "image" },
  { n: "Recraft", u: "recraft.ai", c: "image" },
  { n: "Stable Diffusion", u: "stability.ai", c: "image" },
  { n: "Flux", u: "blackforestlabs.ai", c: "image" },
  { n: "Canva AI", u: "canva.com", c: "image" },
  { n: "DALL-E 3", u: "openai.com/dall-e-3", c: "image" },
  { n: "Krea", u: "krea.ai", c: "image" },
  { n: "Playground AI", u: "playgroundai.com", c: "image" },
  { n: "Tensor.art", u: "tensor.art", c: "image" },
  { n: "SeaArt", u: "seaart.ai", c: "image" },
  { n: "Lexica", u: "lexica.art", c: "image" },
  { n: "Mage.space", u: "mage.space", c: "image" },
  { n: "Civitai", u: "civitai.com", c: "image" },

  // Video
  { n: "Runway", u: "runwayml.com", c: "video" },
  { n: "Pika", u: "pika.art", c: "video" },
  { n: "Luma Dream Machine", u: "lumalabs.ai/dream-machine", c: "video" },
  { n: "Kling AI", u: "klingai.com", c: "video" },
  { n: "Synthesia", u: "synthesia.io", c: "video" },
  { n: "HeyGen", u: "heygen.com", c: "video" },
  { n: "InVideo", u: "invideo.io", c: "video" },
  { n: "VEED", u: "veed.io", c: "video" },
  { n: "Sora", u: "openai.com/sora", c: "video" },
  { n: "Opus Clip", u: "opus.pro", c: "video" },
  { n: "CapCut AI", u: "capcut.com", c: "video" },
  { n: "Pictory", u: "pictory.ai", c: "video" },
  { n: "Munch", u: "getmunch.com", c: "video" },
  { n: "Kaiber", u: "kaiber.ai", c: "video" },

  // Audio
  { n: "ElevenLabs", u: "elevenlabs.io", c: "audio" },
  { n: "Suno", u: "suno.com", c: "audio" },
  { n: "Udio", u: "udio.com", c: "audio" },
  { n: "Descript", u: "descript.com", c: "audio" },
  { n: "Murf", u: "murf.ai", c: "audio" },
  { n: "Adobe Podcast", u: "podcast.adobe.com", c: "audio" },
  { n: "Lovo", u: "lovo.ai", c: "audio" },
  { n: "Resemble AI", u: "resemble.ai", c: "audio" },
  { n: "Voiceify", u: "voiceify.ai", c: "audio" },
  { n: "Play.ht", u: "play.ht", c: "audio" },
  { n: "Kittl", u: "kittl.com", c: "design" },
  { n: "Suno AI", u: "suno.ai", c: "audio" },

  // Coding
  { n: "GitHub Copilot", u: "github.com/features/copilot", c: "coding" },
  { n: "Cursor", u: "cursor.sh", c: "coding" },
  { n: "Windsurf", u: "codeium.com/windsurf", c: "coding" },
  { n: "Replit", u: "replit.com", c: "coding" },
  { n: "Codeium", u: "codeium.com", c: "coding" },
  { n: "Tabnine", u: "tabnine.com", c: "coding" },
  { n: "Amazon Q Developer", u: "aws.amazon.com/q/developer", c: "coding" },
  { n: "Lovable", u: "lovable.dev", c: "coding" },
  { n: "Bolt.new", u: "bolt.new", c: "coding" },
  { n: "v0 by Vercel", u: "v0.dev", c: "coding" },
  { n: "Supermaven", u: "supermaven.com", c: "coding" },
  { n: "CodiumAI", u: "codium.ai", c: "coding" },
  { n: "Codeium", u: "codeium.com", c: "coding" },
  { n: "Phind", u: "phind.com", c: "coding" },

  // Productivity
  { n: "Gamma", u: "gamma.app", c: "productivity" },
  { n: "Notion AI", u: "notion.so", c: "productivity" },
  { n: "Otter", u: "otter.ai", c: "productivity" },
  { n: "Grammarly", u: "grammarly.com", c: "productivity" },
  { n: "Tome", u: "tome.app", c: "productivity" },
  { n: "ChatPDF", u: "chatpdf.com", c: "productivity" },
  { n: "Beautiful.ai", u: "beautiful.ai", c: "productivity" },
  { n: "Motion", u: "usemotion.com", c: "productivity" },
  { n: "Taskade", u: "taskade.com", c: "productivity" },
  { n: "Mem", u: "mem.ai", c: "productivity" },
  { n: "Fathom", u: "fathom.video", c: "productivity" },
  { n: "Fireflies.ai", u: "fireflies.ai", c: "productivity" },
  { n: "Rewind", u: "rewind.ai", c: "productivity" },

  // Research
  { n: "NotebookLM", u: "notebooklm.google.com", c: "research" },
  { n: "Elicit", u: "elicit.com", c: "research" },
  { n: "Consensus", u: "consensus.app", c: "research" },
  { n: "Humata", u: "humata.ai", c: "research" },
  { n: "SciSpace", u: "typeset.io", c: "research" },
  { n: "Perplexity Pro", u: "perplexity.ai/pro", c: "research" },
  { n: "Scholarcy", u: "scholarcy.com", c: "research" },
  { n: "Genei", u: "genei.io", c: "research" },

  // Marketing
  { n: "Jasper", u: "jasper.ai", c: "marketing" },
  { n: "Copy.ai", u: "copy.ai", c: "marketing" },
  { n: "Writesonic", u: "writesonic.com", c: "marketing" },
  { n: "Surfer SEO", u: "surferseo.com", c: "marketing" },
  { n: "Anyword", u: "anyword.com", c: "marketing" },
  { n: "Frase", u: "frase.io", c: "marketing" },
  { n: "Rytr", u: "rytr.me", c: "marketing" },
  { n: "Mutiny", u: "mutinyhq.com", c: "marketing" },
  { n: "Clearscope", u: "clearscope.io", c: "marketing" },

  // Design
  { n: "Figma AI", u: "figma.com", c: "design" },
  { n: "Khroma", u: "khroma.co", c: "design" },
  { n: "Relume", u: "relume.io", c: "design" },
  { n: "Looka", u: "looka.com", c: "design" },
  { n: "Uizard", u: "uizard.io", c: "design" },
  { n: "Galileo AI", u: "usegalileo.ai", c: "design" },
  { n: "Spline AI", u: "spline.design/ai", c: "design" },

  // Education
  { n: "Monic AI", u: "monic.ai", c: "education" },
  { n: "Quizgecko", u: "quizgecko.com", c: "education" },
  { n: "Khanmigo", u: "khanacademy.org/khan-labs", c: "education" },
  { n: "Socratic", u: "socratic.org", c: "education" },
  { n: "Duolingo Max", u: "duolingo.com", c: "education" },
  { n: "Explain Like I'm Five AI", u: "explainlikeimfive.io", c: "education" },

  // Business / Finance
  { n: "Numerous.ai", u: "numerous.ai", c: "finance" },
  { n: "Rows", u: "rows.com", c: "finance" },
  { n: "Julius AI", u: "julius.ai", c: "finance" },
  { n: "Formula Bot", u: "formulabot.com", c: "finance" },
  { n: "Glean", u: "glean.com", c: "business" },
  { n: "Dialpad Ai", u: "dialpad.com", c: "business" },
  { n: "Zendesk AI", u: "zendesk.com/ai", c: "business" },
  { n: "Intercom Fin", u: "intercom.com/fin", c: "business" },
];

const tools = toolsList.map(t => ({
  name: t.n,
  description: 'The best AI tool for ' + t.c + '. Explore ' + t.n + ' to boost your workflow.',
  category: t.c,
  pricing: ["Free", "Freemium", "Paid"][Math.floor(Math.random() * 3)],
  logo: "", // Left empty to avoid fake logos
  url: "https://" + t.u,
  featured: Math.random() > 0.8,
  trending: Math.random() > 0.7,
  features: ["AI Powered", "Cloud Based", "Fast Processing"],
  easeOfUse: ["Easy", "Moderate", "Advanced"][Math.floor(Math.random() * 3)],
  mainFunctionality: 'AI ' + t.c + ' solution',
  freePlan: Math.random() > 0.5,
  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
  reviewCount: Math.floor(Math.random() * 1000) + 10,
  isNew: Math.random() > 0.8,
  isPremium: Math.random() > 0.8,
  useCase: [t.c],
  tags: ["AI", t.c, "Tool"],
  status: "approved"
}));

// Now let's generate 150 unique prompts
const promptTemplates = [
  { c: "coding", roles: ["Senior Developer", "Software Engineer"], tasks: ["Debug this code", "Refactor this component", "Write tests for", "Optimize this algorithm"] },
  { c: "marketing", roles: ["Marketing Expert", "SEO Specialist"], tasks: ["Write a blog outline", "Generate SEO keywords", "Create a social media campaign", "Write ad copy"] },
  { c: "business", roles: ["Business Analyst", "Product Manager"], tasks: ["Create a product roadmap", "Analyze this market data", "Write a PRD", "Draft a business proposal"] },
  { c: "writing", roles: ["Expert Copywriter", "Editor"], tasks: ["Proofread this text", "Rewrite this email to sound more professional", "Summarize this article", "Draft a creative story"] },
  { c: "productivity", roles: ["Productivity Coach", "Project Manager"], tasks: ["Create a weekly schedule", "Organize these tasks", "Write meeting minutes from notes", "Draft a project timeline"] }
];

const prompts = [];
let pCount = 1;

for (let i = 0; i < 150; i++) {
  const tpl = promptTemplates[i % promptTemplates.length];
  const role = tpl.roles[Math.floor(Math.random() * tpl.roles.length)];
  const task = tpl.tasks[Math.floor(Math.random() * tpl.tasks.length)];
  const title = task + ' - Template ' + pCount;
  
  prompts.push({
    title: title,
    prompt: 'You are a ' + role + '.\n\nContext:\nI need help with a specific task.\n\nTask:\n' + task + '\n\nRequirements:\n- Be concise\n- Provide examples\n- Use professional tone',
    category: tpl.c,
    author: "AI Discover Team",
    featured: Math.random() > 0.9,
    status: "approved"
  });
  pCount++;
}

fs.writeFileSync(path.join(__dirname, '../data/categories.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(__dirname, '../data/tools.json'), JSON.stringify(tools, null, 2));
fs.writeFileSync(path.join(__dirname, '../data/prompts.json'), JSON.stringify(prompts, null, 2));

console.log('Generated ' + categories.length + ' categories, ' + tools.length + ' tools, and ' + prompts.length + ' prompts.');
