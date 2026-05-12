import { motion } from "framer-motion";
import { Copy, Check, Heart, Instagram, Eye, Flame, Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import type { Prompt } from "@/data/tools";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const { toggleSavedPrompt, isPromptSaved } = useApp();
  const saved = isPromptSaved(prompt.id);

  const copyPrompt = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log('✅ Prompt copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy prompt:', err);
    }
  };

  const sharePrompt = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/prompts/${prompt.id}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      console.log('✅ Prompt URL copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to share prompt:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0, 0, 1] as const }}
      whileHover={{ y: -12 }}
      className="group rounded-2xl border border-accent/20 bg-gradient-to-br from-card via-card/90 to-card/60 shadow-lg hover:shadow-premium overflow-hidden transition-all duration-300 hover:border-accent/40"
    >
      {/* Premium gradient overlay on hover - pointer-events-none prevents blocking clicks */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0 pointer-events-none" />
      
      {/* Animated glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10 pointer-events-none" />

      {/* Before/After Images */}
      <div className="grid grid-cols-2 h-40 relative z-10 overflow-hidden">
        <div className="relative overflow-hidden group/img">
          <img src={prompt.beforeImage} alt="Before" className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-120" />
          <motion.span whileHover={{ scale: 1.05 }} className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-background/70 text-[11px] font-bold text-foreground backdrop-blur-md ring-1 ring-white/30">Before</motion.span>
        </div>
        <div className="relative overflow-hidden group/img">
          <img src={prompt.afterImage} alt="After" className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-120" />
          <motion.span whileHover={{ scale: 1.05 }} className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-background/70 text-[11px] font-bold text-foreground backdrop-blur-md ring-1 ring-white/30">After</motion.span>
        </div>
      </div>

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-foreground leading-snug">{prompt.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {prompt.featured && (
              <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-600 ring-1 ring-orange-500/40 whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-200">
                <Flame className="h-3.5 w-3.5" /> Featured
              </motion.span>
            )}
            <motion.span whileHover={{ scale: 1.1 }} className="rounded-full px-3 py-1.5 text-[9px] font-bold bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-1 ring-accent/40 whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-200">{prompt.category}</motion.span>
          </div>
        </div>

        {/* Prompt Preview - Premium */}
        <div className="relative mt-4">
          <pre className="p-4 rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/20 text-xs text-muted-foreground/85 font-mono leading-relaxed whitespace-pre-wrap overflow-hidden max-h-16 line-clamp-2 ring-1 ring-accent/20 border border-accent/15 hover:ring-accent/30 hover:border-accent/25 transition-all duration-300 font-medium">
            {prompt.prompt}
          </pre>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyPrompt}
            onTouchEnd={copyPrompt}
            disabled={copied}
            className="absolute top-3 right-3 p-2 rounded-lg bg-accent/20 backdrop-blur-sm hover:bg-accent/30 text-accent hover:text-accent/80 disabled:opacity-60 transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
          </motion.button>
        </div>

        {/* Author + Actions */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-accent/15">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.15 }} className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center ring-1 ring-accent/30">
              <span className="text-[11px] font-bold text-accent">{prompt.author.charAt(0).toUpperCase()}</span>
            </motion.div>
            <div>
              <p className="text-[12px] font-bold text-foreground">{prompt.author}</p>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href={`https://instagram.com/${prompt.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-[10px] text-muted-foreground/70 hover:text-accent transition-all duration-200 font-medium"
              >
                <Instagram className="h-3 w-3" /> {prompt.instagram}
              </motion.a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.preventDefault(); toggleSavedPrompt(prompt.id); }}
              className="p-2 rounded-lg hover:bg-accent/15 transition-all duration-200"
            >
              <Heart className={`h-4 w-4 transition-all duration-300 ${saved ? "fill-rose-500 text-rose-500 scale-125" : "text-muted-foreground/70 hover:text-rose-400"}`} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={sharePrompt}
              onTouchEnd={sharePrompt}
              disabled={shared}
              className="p-2 rounded-lg hover:bg-secondary/60 transition-all duration-200 text-muted-foreground/70 hover:text-foreground disabled:opacity-60"
            >
              {shared ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} /> : <Share2 className="h-4 w-4" strokeWidth={1.5} />}
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to={`/prompts/${prompt.id}`}
                className="flex items-center gap-1.5 text-[12px] font-bold text-accent hover:text-accent/80 transition-colors hover:underline"
              >
                <Eye className="h-3.5 w-3.5" /> View Full
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Suggested Tool */}
        {prompt.suggestedTool && (
          <motion.div whileHover={{ scale: 1.02 }} className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 text-[11px] text-muted-foreground/80 ring-1 ring-accent/20 hover:ring-accent/40 transition-all duration-200 font-medium">
            <span>✨ Best used with</span>
            <Link to={`/tools/${prompt.suggestedToolId}`} className="font-bold text-accent hover:text-accent/80 transition-colors">
              {prompt.suggestedTool}
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
