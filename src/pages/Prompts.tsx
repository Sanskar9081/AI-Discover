import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Instagram, Eye, Heart, ExternalLink, Share2 } from "lucide-react";
import { usePrompts, useToolById } from "@/hooks/useQueries";
import { useApp } from "@/contexts/AppContext";
import { PromptCard } from "@/components/PromptCard";
import { SubmitPromptModal } from "@/components/SubmitPromptModal";
import { Plus } from "lucide-react";

const Prompts = () => {
  const { id } = useParams<{ id: string }>();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const { savedPrompts } = useApp();

  // Fetch data from Supabase via React Query
  const { data: prompts = [], isLoading } = usePrompts();
  
  // Get the prompt from the list (if viewing detail)
  const prompt = id ? prompts.find((p) => p.id === id) : null;
  
  // Always call this hook at the top level (required by React hooks rules)
  const { data: suggestedTool } = useToolById(prompt?.suggestedToolId);
  
  const savedPromptsList = prompts.filter((p) => savedPrompts.includes(p.id));

  const copyPrompt = async (promptId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
      console.log('✅ Prompt copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy prompt:', err);
    }
  };

  const sharePrompt = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      console.log('✅ Prompt URL copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to share prompt:', err);
    }
  };

  // Prompt Detail View
  if (id) {
    // Show loading state while fetching
    if (isLoading) {
      return (
        <div className="py-24 text-center">
          <div className="inline-block">
            <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading prompt...</p>
        </div>
      );
    }
    
    if (!prompt) {
      return (
        <div className="py-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Prompt not found</h1>
          <Link to="/prompts" className="mt-4 inline-block text-accent hover:underline">← Back to prompts</Link>
        </div>
      );
    }

    return (
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to prompts
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
            {/* Before/After */}
            <div className="grid grid-cols-2 h-56 bg-secondary/30">
              <div className="relative overflow-hidden flex items-center justify-center bg-secondary/50">
                {prompt.beforeImage ? (
                  <img src={prompt.beforeImage} alt="Before" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                    <div className="text-5xl mb-2">📷</div>
                    <span className="text-sm">No before image</span>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-background/80 text-xs font-semibold text-foreground backdrop-blur-sm">Before</span>
              </div>
              <div className="relative overflow-hidden flex items-center justify-center bg-secondary/50">
                {prompt.afterImage ? (
                  <img src={prompt.afterImage} alt="After" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                    <div className="text-5xl mb-2">📷</div>
                    <span className="text-sm">No after image</span>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-background/80 text-xs font-semibold text-foreground backdrop-blur-sm">After</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{prompt.title}</h1>
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-accent/10 text-accent ring-1 ring-accent/20">{prompt.category}</span>
              </div>

              {/* Full Prompt */}
              <div className="relative">
                <pre className="p-5 rounded-xl bg-secondary text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt.prompt}
                </pre>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => copyPrompt(prompt.id, prompt.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedId === prompt.id ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                  <button
                    onClick={sharePrompt}
                    onTouchEnd={sharePrompt}
                    disabled={shared}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60 transition-colors disabled:cursor-not-allowed"
                  >
                    {shared ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Shared!</> : <><Share2 className="h-3.5 w-3.5" /> Share</>}
                  </button>
                </div>
              </div>

              {/* Suggested Tool */}
              {suggestedTool && (
                <div className="mt-6 flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="h-10 w-10 rounded-lg bg-background p-1.5 border border-border/30 flex items-center justify-center overflow-hidden">
                    <img src={suggestedTool.logo} alt={suggestedTool.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Best used with {suggestedTool.name}</p>
                    <p className="text-[12px] text-muted-foreground">{suggestedTool.mainFunctionality}</p>
                  </div>
                  <a href={suggestedTool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 pt-6 border-t border-border/30">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{prompt.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{prompt.author}</p>
                  <a href={`https://instagram.com/${prompt.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-accent transition-colors">
                    <Instagram className="h-3 w-3" /> {prompt.instagram}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Prompt Library
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Prompt Library</h1>
            <p className="mt-2 text-body text-muted-foreground">Explore curated AI prompts with before & after results.</p>
          </div>
          <button onClick={() => setShowSubmit(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> Submit Prompt
          </button>
        </motion.div>

        {/* Saved Prompts */}
        {savedPromptsList.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-rose-500" />
              <h2 className="text-lg font-semibold text-foreground">Saved Prompts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPromptsList.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts && prompts.length > 0 ? (
            prompts.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No prompts available yet.
            </div>
          )}
        </div>
      </div>

      <SubmitPromptModal open={showSubmit} onClose={() => setShowSubmit(false)} />
    </div>
  );
};

export default Prompts;
