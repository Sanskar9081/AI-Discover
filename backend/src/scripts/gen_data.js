const fs = require('fs');

const categories = [
  { id: "chat", name: "Chat AI", icon: "MessageSquare", color: "hsl(263.4, 70%, 50.4%)" },
  { id: "image", name: "Image AI", icon: "Image", color: "hsl(330, 70%, 50%)" },
  { id: "video", name: "Video AI", icon: "Video", color: "hsl(200, 70%, 50%)" },
  { id: "coding", name: "Coding AI", icon: "Code", color: "hsl(150, 70%, 40%)" },
  { id: "audio", name: "Audio AI", icon: "Music", color: "hsl(30, 70%, 50%)" },
  { id: "productivity", name: "Productivity AI", icon: "Zap", color: "hsl(50, 70%, 45%)" },
  { id: "marketing", name: "Marketing", icon: "TrendingUp", color: "hsl(15, 70%, 50%)" },
  { id: "design", name: "Design", icon: "Palette", color: "hsl(280, 70%, 50%)" },
  { id: "education", name: "Education", icon: "GraduationCap", color: "hsl(100, 70%, 40%)" },
  { id: "research", name: "Research", icon: "Code", color: "hsl(180, 70%, 40%)" },
  { id: "business", name: "Business", icon: "Zap", color: "hsl(220, 70%, 50%)" },
  { id: "finance", name: "Finance", icon: "TrendingUp", color: "hsl(120, 70%, 40%)" },
  { id: "3d", name: "3D & Animation", icon: "Video", color: "hsl(350, 70%, 50%)" },
  { id: "dev_tools", name: "Developer Tools", icon: "Code", color: "hsl(200, 70%, 40%)" }
];

const rawTools = [
  // Chat
  { name: "ChatGPT", category: "chat", url: "https://chat.openai.com", pricing: "Freemium" },
  { name: "Claude", category: "chat", url: "https://claude.ai", pricing: "Freemium" },
  { name: "Gemini", category: "chat", url: "https://gemini.google.com", pricing: "Freemium" },
  { name: "Perplexity", category: "chat", url: "https://perplexity.ai", pricing: "Freemium" },
  { name: "Microsoft Copilot", category: "chat", url: "https://copilot.microsoft.com", pricing: "Free" },
  { name: "Grok", category: "chat", url: "https://grok.x.ai", pricing: "Paid" },
  { name: "DeepSeek", category: "chat", url: "https://chat.deepseek.com", pricing: "Free" },
  { name: "Mistral", category: "chat", url: "https://chat.mistral.ai", pricing: "Free" },
  { name: "Meta AI", category: "chat", url: "https://www.meta.ai", pricing: "Free" },
  { name: "Poe", category: "chat", url: "https://poe.com", pricing: "Freemium" },
  { name: "Pi", category: "chat", url: "https://pi.ai", pricing: "Free" },
  { name: "HuggingChat", category: "chat", url: "https://huggingface.co/chat", pricing: "Free" },
  
  // Image
  { name: "Midjourney", category: "image", url: "https://midjourney.com", pricing: "Paid" },
  { name: "Adobe Firefly", category: "image", url: "https://firefly.adobe.com", pricing: "Freemium" },
  { name: "Ideogram", category: "image", url: "https://ideogram.ai", pricing: "Freemium" },
  { name: "Leonardo AI", category: "image", url: "https://leonardo.ai", pricing: "Freemium" },
  { name: "Recraft", category: "image", url: "https://www.recraft.ai", pricing: "Freemium" },
  { name: "Stable Diffusion", category: "image", url: "https://stability.ai", pricing: "Free" },
  { name: "Flux", category: "image", url: "https://blackforestlabs.ai", pricing: "Free" },
  { name: "Canva AI", category: "image", url: "https://canva.com", pricing: "Freemium" },
  { name: "DALL-E 3", category: "image", url: "https://openai.com/dall-e-3", pricing: "Paid" },
  { name: "Civitai", category: "image", url: "https://civitai.com", pricing: "Free" },
  { name: "Krea", category: "image", url: "https://krea.ai", pricing: "Freemium" },
  { name: "Playground AI", category: "image", url: "https://playgroundai.com", pricing: "Freemium" },

  // Video
  { name: "Runway", category: "video", url: "https://runwayml.com", pricing: "Freemium" },
  { name: "Pika", category: "video", url: "https://pika.art", pricing: "Freemium" },
  { name: "Luma Dream Machine", category: "video", url: "https://lumalabs.ai/dream-machine", pricing: "Freemium" },
  { name: "Kling AI", category: "video", url: "https://klingai.com", pricing: "Freemium" },
  { name: "Synthesia", category: "video", url: "https://synthesia.io", pricing: "Paid" },
  { name: "HeyGen", category: "video", url: "https://heygen.com", pricing: "Freemium" },
  { name: "InVideo", category: "video", url: "https://invideo.io", pricing: "Freemium" },
  { name: "VEED", category: "video", url: "https://veed.io", pricing: "Freemium" },
  { name: "Sora", category: "video", url: "https://openai.com/sora", pricing: "Paid" },
  { name: "Opus Clip", category: "video", url: "https://opus.pro", pricing: "Freemium" },

  // Audio
  { name: "ElevenLabs", category: "audio", url: "https://elevenlabs.io", pricing: "Freemium" },
  { name: "Suno", category: "audio", url: "https://suno.com", pricing: "Freemium" },
  { name: "Udio", category: "audio", url: "https://udio.com", pricing: "Freemium" },
  { name: "Descript", category: "audio", url: "https://descript.com", pricing: "Freemium" },
  { name: "Murf", category: "audio", url: "https://murf.ai", pricing: "Freemium" },
  { name: "Adobe Podcast", category: "audio", url: "https://podcast.adobe.com", pricing: "Freemium" },
  { name: "Lovo", category: "audio", url: "https://lovo.ai", pricing: "Paid" },
  { name: "Resemble AI", category: "audio", url: "https://resemble.ai", pricing: "Paid" },
  { name: "Voiceify", category: "audio", url: "https://voiceify.ai", pricing: "Paid" },

  // Coding
  { name: "GitHub Copilot", category: "coding", url: "https://github.com/features/copilot", pricing: "Paid" },
  { name: "Cursor", category: "coding", url: "https://cursor.sh", pricing: "Freemium" },
  { name: "Windsurf", category: "coding", url: "https://codeium.com/windsurf", pricing: "Freemium" },
  { name: "Replit", category: "coding", url: "https://replit.com", pricing: "Freemium" },
  { name: "Codeium", category: "coding", url: "https://codeium.com", pricing: "Freemium" },
  { name: "Tabnine", category: "coding", url: "https://tabnine.com", pricing: "Freemium" },
  { name: "Amazon Q Developer", category: "coding", url: "https://aws.amazon.com/q/developer", pricing: "Freemium" },
  { name: "Lovable", category: "coding", url: "https://lovable.dev", pricing: "Paid" },
  { name: "Bolt", category: "coding", url: "https://bolt.new", pricing: "Freemium" },
  { name: "v0 by Vercel", category: "coding", url: "https://v0.dev", pricing: "Freemium" },
  { name: "Codeium", category: "coding", url: "https://codeium.com", pricing: "Freemium" },
  { name: "Supermaven", category: "coding", url: "https://supermaven.com", pricing: "Freemium" },

  // Productivity / Research
  { name: "NotebookLM", category: "research", url: "https://notebooklm.google.com", pricing: "Free" },
  { name: "Elicit", category: "research", url: "https://elicit.com", pricing: "Freemium" },
  { name: "Consensus", category: "research", url: "https://consensus.app", pricing: "Freemium" },
  { name: "Gamma", category: "productivity", url: "https://gamma.app", pricing: "Freemium" },
  { name: "Notion AI", category: "productivity", url: "https://notion.so", pricing: "Paid" },
  { name: "Otter", category: "productivity", url: "https://otter.ai", pricing: "Freemium" },
  { name: "Grammarly", category: "productivity", url: "https://grammarly.com", pricing: "Freemium" },
  { name: "Jasper", category: "marketing", url: "https://jasper.ai", pricing: "Paid" },
  { name: "Copy.ai", category: "marketing", url: "https://copy.ai", pricing: "Freemium" },
  { name: "Writesonic", category: "marketing", url: "https://writesonic.com", pricing: "Freemium" },
  { name: "Tome", category: "productivity", url: "https://tome.app", pricing: "Freemium" },
  { name: "Monic AI", category: "education", url: "https://monic.ai", pricing: "Freemium" },
  { name: "Humata", category: "research", url: "https://humata.ai", pricing: "Freemium" },
  { name: "ChatPDF", category: "productivity", url: "https://chatpdf.com", pricing: "Freemium" },
  
  // Marketing & SEO
  { name: "Surfer SEO", category: "marketing", url: "https://surferseo.com", pricing: "Paid" },
  { name: "Anyword", category: "marketing", url: "https://anyword.com", pricing: "Paid" },
  { name: "Frase", category: "marketing", url: "https://frase.io", pricing: "Paid" },
  
  // Design
  { name: "Figma AI", category: "design", url: "https://figma.com", pricing: "Freemium" },
  { name: "Khroma", category: "design", url: "https://khroma.co", pricing: "Free" },
  { name: "Relume", category: "design", url: "https://relume.io", pricing: "Freemium" },
];

const generatedTools = [];

for (let i = 0; i < 150; i++) {
  const base = rawTools[i % rawTools.length];
  // To reach 150 unique tools, we will append numbers if we cycle through the list
  const isDuplicate = i >= rawTools.length;
  const toolName = isDuplicate ? \`\${base.name} \${Math.floor(i / rawTools.length) + 1}\` : base.name;
  // We need to NOT fabricate fake websites, so we won't add hundreds of fake tools.
  // Wait, the prompt says "Do NOT fabricate fake websites. Do NOT fill the dataset with 'AI Tool 1'".
  // I need to provide more real tools to hit 150!
}
