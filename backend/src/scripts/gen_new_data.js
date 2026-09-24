const fs = require('fs');

const categories = [
  { id: "chat", name: "Chat AI", icon: "MessageSquare", color: "hsl(263.4, 70%, 50.4%)" },
  { id: "image", name: "Image AI", icon: "Image", color: "hsl(330, 70%, 50%)" },
  { id: "video", name: "Video AI", icon: "Video", color: "hsl(200, 70%, 50%)" },
  { id: "audio", name: "Audio AI", icon: "Music", color: "hsl(30, 70%, 50%)" },
  { id: "coding", name: "Coding AI", icon: "Code", color: "hsl(150, 70%, 40%)" },
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
  "ChatGPT|chat.openai.com|chat", "Claude|claude.ai|chat", "Gemini|gemini.google.com|chat", "Perplexity|perplexity.ai|chat", "Microsoft Copilot|copilot.microsoft.com|chat", 
  "Grok|grok.x.ai|chat", "DeepSeek|chat.deepseek.com|chat", "Mistral|chat.mistral.ai|chat", "Meta AI|meta.ai|chat", "Poe|poe.com|chat", "Pi|pi.ai|chat", "HuggingChat|huggingface.co/chat|chat", "You.com|you.com|chat", "ChatSonic|writesonic.com/chat|chat", "Kuki|kuki.ai|chat", "Replika|replika.com|chat", "Character.AI|character.ai|chat", "Jasper Chat|jasper.ai|chat", "Ora|ora.ai|chat", "Phind|phind.com|coding",
  "Midjourney|midjourney.com|image", "Adobe Firefly|firefly.adobe.com|image", "Ideogram|ideogram.ai|image", "Leonardo AI|leonardo.ai|image", "Recraft|recraft.ai|image", "Stable Diffusion|stability.ai|image", "Flux|blackforestlabs.ai|image", "Canva AI|canva.com|image", "DALL-E 3|openai.com/dall-e-3|image", "Krea|krea.ai|image", "Playground AI|playgroundai.com|image", "Tensor.art|tensor.art|image", "SeaArt|seaart.ai|image", "Lexica|lexica.art|image", "Mage.space|mage.space|image", "Civitai|civitai.com|image", "NightCafe|nightcafe.studio|image", "StarryAI|starryai.com|image", "Craiyon|craiyon.com|image", "Artbreeder|artbreeder.com|image", "DeepAI|deepai.org|image", "Dream by WOMBO|dream.ai|image", "Pikazo|pikazoapp.com|image", "DeepDream|deepdreamgenerator.com|image",
  "Runway|runwayml.com|video", "Pika|pika.art|video", "Luma Dream Machine|lumalabs.ai/dream-machine|video", "Kling AI|klingai.com|video", "Synthesia|synthesia.io|video", "HeyGen|heygen.com|video", "InVideo|invideo.io|video", "VEED|veed.io|video", "Sora|openai.com/sora|video", "Opus Clip|opus.pro|video", "CapCut AI|capcut.com|video", "Pictory|pictory.ai|video", "Munch|getmunch.com|video", "Kaiber|kaiber.ai|video", "Descript|descript.com|video", "Fliki|fliki.ai|video", "Colossyan|colossyan.com|video", "D-ID|d-id.com|video", "Visla|visla.us|video", "GliaCloud|gliacloud.com|video", "Steve AI|steve.ai|video", "DeepBrain AI|deepbrain.io|video",
  "ElevenLabs|elevenlabs.io|audio", "Suno|suno.com|audio", "Udio|udio.com|audio", "Murf|murf.ai|audio", "Adobe Podcast|podcast.adobe.com|audio", "Lovo|lovo.ai|audio", "Resemble AI|resemble.ai|audio", "Voiceify|voiceify.ai|audio", "Play.ht|play.ht|audio", "Suno AI|suno.ai|audio", "WellSaid Labs|wellsaidlabs.com|audio", "Listnr|listnr.fm|audio", "Mubert|mubert.com|audio", "Boomy|boomy.com|audio", "Soundraw|soundraw.io|audio", "Beatoven|beatoven.ai|audio", "Voicemaker|voicemaker.in|audio", "Respeecher|respeecher.com|audio",
  "GitHub Copilot|github.com/features/copilot|coding", "Cursor|cursor.sh|coding", "Windsurf|codeium.com/windsurf|coding", "Replit|replit.com|coding", "Codeium|codeium.com|coding", "Tabnine|tabnine.com|coding", "Amazon Q Developer|aws.amazon.com/q/developer|coding", "Lovable|lovable.dev|coding", "Bolt.new|bolt.new|coding", "v0 by Vercel|v0.dev|coding", "Supermaven|supermaven.com|coding", "CodiumAI|codium.ai|coding", "Blackbox AI|blackbox.ai|coding", "Sourcegraph Cody|sourcegraph.com/cody|coding", "Warp|warp.dev|coding", "Codeium|codeium.com|coding", "Mutable.ai|mutable.ai|coding", "Devin|cognition-labs.com|coding", "Bito|bito.ai|coding", "CodeGeeX|codegeex.cn|coding",
  "Gamma|gamma.app|productivity", "Notion AI|notion.so|productivity", "Otter|otter.ai|productivity", "Grammarly|grammarly.com|productivity", "Tome|tome.app|productivity", "ChatPDF|chatpdf.com|productivity", "Beautiful.ai|beautiful.ai|productivity", "Motion|usemotion.com|productivity", "Taskade|taskade.com|productivity", "Mem|mem.ai|productivity", "Fathom|fathom.video|productivity", "Fireflies.ai|fireflies.ai|productivity", "Rewind|rewind.ai|productivity", "Anydo|any.do|productivity", "ClickUp AI|clickup.com|productivity", "SaneBox|sanebox.com|productivity", "Reclaim|reclaim.ai|productivity", "Clockwise|getclockwise.com|productivity", "Dust|dust.tt|productivity",
  "NotebookLM|notebooklm.google.com|research", "Elicit|elicit.com|research", "Consensus|consensus.app|research", "Humata|humata.ai|research", "SciSpace|typeset.io|research", "Perplexity Pro|perplexity.ai/pro|research", "Scholarcy|scholarcy.com|research", "Genei|genei.io|research", "Trinka|trinka.ai|research", "Paperpal|paperpal.com|research", "Explainpaper|explainpaper.com|research", "Lateral|lateral.io|research",
  "Jasper|jasper.ai|marketing", "Copy.ai|copy.ai|marketing", "Writesonic|writesonic.com|marketing", "Surfer SEO|surferseo.com|marketing", "Anyword|anyword.com|marketing", "Frase|frase.io|marketing", "Rytr|rytr.me|marketing", "Mutiny|mutinyhq.com|marketing", "Clearscope|clearscope.io|marketing", "Peppertype|peppertype.ai|marketing", "ClosersCopy|closerscopy.com|marketing", "INK|inkforall.com|marketing", "Hypotenuse AI|hypotenuse.ai|marketing", "Copysmith|copysmith.ai|marketing", "Mark Copy|markcopy.ai|marketing", "Scalenut|scalenut.com|marketing",
  "Figma AI|figma.com|design", "Khroma|khroma.co|design", "Relume|relume.io|design", "Looka|looka.com|design", "Uizard|uizard.io|design", "Galileo AI|usegalileo.ai|design", "Spline AI|spline.design/ai|design", "Autodraw|autodraw.com|design", "Fontjoy|fontjoy.com|design", "Brandmark|brandmark.io|design", "Miro AI|miro.com|design", "Designs.ai|designs.ai|design",
  "Monic AI|monic.ai|education", "Quizgecko|quizgecko.com|education", "Khanmigo|khanacademy.org/khan-labs|education", "Socratic|socratic.org|education", "Duolingo Max|duolingo.com|education", "Explain Like I'm Five AI|explainlikeimfive.io|education", "TutorAI|tutorai.me|education", "Coursebox|coursebox.ai|education", "Yippity|yippity.io|education", "Knowt|knowt.io|education",
  "Numerous.ai|numerous.ai|finance", "Rows|rows.com|finance", "Julius AI|julius.ai|finance", "Formula Bot|formulabot.com|finance", "Glean|glean.com|business", "Dialpad Ai|dialpad.com|business", "Zendesk AI|zendesk.com/ai|business", "Intercom Fin|intercom.com/fin|business", "SheetAI|sheetai.app|finance", "Arc|arc.net|productivity"
];

const tools = rawTools.map(t => {
  const [name, url, category] = t.split('|');
  return {
    name,
    description: "An advanced AI tool focused on " + category + " workflows, providing top-tier capabilities.",
    category,
    pricing: ["Free", "Freemium", "Paid"][Math.floor(Math.random() * 3)],
    logo: "", // Let frontend fallback to default icon
    url: "https://" + url,
    featured: Math.random() > 0.9,
    trending: Math.random() > 0.8,
    features: ["Cloud Based", "AI Powered", "Fast Processing"],
    easeOfUse: ["Easy", "Moderate", "Advanced"][Math.floor(Math.random() * 3)],
    mainFunctionality: category + " AI Solution",
    freePlan: Math.random() > 0.5,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
    reviewCount: Math.floor(Math.random() * 5000) + 100,
    isNew: Math.random() > 0.8,
    isPremium: Math.random() > 0.8,
    useCase: [category],
    tags: ["AI", category],
    status: "approved"
  }
});

// Remove exact duplicates
const uniqueToolsMap = new Map();
tools.forEach(t => {
  uniqueToolsMap.set(t.name.toLowerCase(), t);
});
const finalTools = Array.from(uniqueToolsMap.values());

const promptTemplates = [
  "Write an engaging blog post about AI in {topic}.",
  "Debug this React component that manages {topic} state.",
  "Create a comprehensive business plan for a {topic} startup.",
  "Design a robust SQL schema for a {topic} application.",
  "Write a highly converting marketing email about {topic}.",
  "Summarize the latest research papers on {topic}.",
  "Develop a complete SEO strategy for {topic}.",
  "Create a 30-day social media content calendar for {topic}.",
  "Act as an expert in {topic} and explain its core concepts to a beginner.",
  "Write a polite but firm professional email regarding {topic}."
];

const topics = [
  "Finance", "Healthcare", "Education", "SaaS", "E-commerce",
  "Cybersecurity", "Blockchain", "Green Energy", "Real Estate", "Fitness",
  "Travel", "Food Delivery", "Machine Learning", "Cloud Computing"
];

const prompts = [];
let id = 1;
for (const tpl of promptTemplates) {
  for (const topic of topics) {
    if (prompts.length >= 50) break;
    const task = tpl.replace("{topic}", topic);
    prompts.push({
      title: task.substring(0, 45) + (task.length > 45 ? "..." : ""),
      prompt: task + "\\n\\nPlease make the output highly detailed, professional, and directly actionable. Include bullet points where necessary.",
      category: "Chat AI",
      author: "AI Expert",
      featured: Math.random() > 0.8,
      status: "approved"
    });
  }
}

fs.writeFileSync('src/data/tools.json', JSON.stringify(finalTools, null, 2));
fs.writeFileSync('src/data/prompts.json', JSON.stringify(prompts, null, 2));
fs.writeFileSync('src/data/categories.json', JSON.stringify(categories, null, 2));

console.log("Total unique tools:", finalTools.length);
console.log("Total unique prompts:", prompts.length);
