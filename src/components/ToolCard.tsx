import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, ArrowUpRight, Star, Flame, Sparkles, Heart, Share2, Crown, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import type { AITool } from "@/data/tools";

interface ToolCardProps {
  tool: AITool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { toggleSavedTool, isToolSaved } = useApp();
  const [shared, setShared] = useState(false);
  const saved = isToolSaved(tool.id);

  const pricingStyles: Record<string, string> = {
    Free: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30 font-bold",
    Freemium: "bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/30 font-bold",
    Paid: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 font-bold",
  };

  const shareTool = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/tools/${tool.id}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      console.log('✅ Tool URL copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy to clipboard:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0, 0, 1] as const }}
      whileHover={{ y: -12, transition: { type: "spring", stiffness: 300, damping: 25 } }}
      className="group relative rounded-2xl border border-accent/20 bg-gradient-to-br from-card via-card/90 to-card/60 p-5 shadow-lg hover:shadow-premium transition-all duration-300 hover:border-accent/40 overflow-hidden flex flex-col h-full"
    >
      {/* Multiple layered gradient underlay for premium depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Animated glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Logo + Badges Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Logo Badge - Premium */}
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 p-2.5 border border-accent/30 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-125 group-hover:border-accent/60 shadow-lg group-hover:shadow-glow relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-full w-full object-contain relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=f1f5f9&color=475569&bold=true&size=48`;
              }}
            />
          </div>

          {/* Badges Section - Vertical Stack */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {tool.isNew && (
                <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[9px] font-bold bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-1 ring-accent/40 whitespace-nowrap shadow-sm hover:shadow-md hover:ring-accent/60 transition-all duration-200">
                  <Sparkles className="h-3 w-3" /> NEW
                </motion.span>
              )}
              {tool.trending && (
                <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[9px] font-bold bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-600 ring-1 ring-orange-500/40 whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200">
                  <Flame className="h-3 w-3" /> TRENDING
                </motion.span>
              )}
              {tool.isPremium && (
                <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[9px] font-bold bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-600 ring-1 ring-amber-500/40 whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200">
                  <Crown className="h-3 w-3" />
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`rounded-full px-2.5 py-1 text-[8px] font-bold whitespace-nowrap ${pricingStyles[tool.pricing] || "bg-secondary/50 text-muted-foreground ring-1 ring-border/40"}`}>
                {tool.pricing}
              </span>
            </div>
          </div>
        </div>

        {/* Content: Title + Description (Flex Grow) */}
        <div className="flex-1 mb-3">
          {/* Title with hover animation */}
          <Link to={`/tools/${tool.id}`}>
            <h3 className="text-base font-bold tracking-tight text-foreground transition-all duration-200 group-hover:text-accent flex items-center gap-1 line-clamp-2">
              {tool.name}
              <ArrowUpRight className="h-4 w-4 opacity-0 translate-y-1 translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0" strokeWidth={2.5} />
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground/85 line-clamp-2 leading-relaxed font-medium">{tool.description}</p>

          {/* Tags - Single Row */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {tool.tags.slice(0, 2).map((tag) => (
                <motion.span 
                  key={tag} 
                  whileHover={{ scale: 1.05 }}
                  className="px-2.5 py-1 rounded-full bg-gradient-to-r from-accent/15 to-accent/10 text-[10px] font-bold text-accent ring-1 ring-accent/30 transition-all duration-200 group-hover:bg-accent/20 group-hover:ring-accent/50 cursor-pointer whitespace-nowrap"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Stats and Actions (Fixed) */}
        <div className="flex flex-col gap-3 pt-3 border-t border-accent/15">
          {/* Rating + Category Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <motion.div whileHover={{ scale: 1.08 }} className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="text-sm font-bold text-foreground">{tool.rating}</span>
              <span className="text-xs text-muted-foreground/60 font-medium whitespace-nowrap">({tool.reviewCount?.toLocaleString()})</span>
            </motion.div>
            <span className="text-xs font-bold text-muted-foreground/70 px-2.5 py-1 rounded-lg bg-secondary/50 ring-1 ring-border/40 whitespace-nowrap">{tool.category}</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); toggleSavedTool(tool.id); }}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-accent/15 active:scale-95"
                title="Save tool"
              >
                <Heart className={`h-4 w-4 transition-all duration-300 ${saved ? "fill-rose-500 text-rose-500 scale-125" : "text-muted-foreground/70 hover:text-rose-400"}`} strokeWidth={1.5} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareTool}
                onTouchEnd={shareTool}
                disabled={shared}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-secondary/60 text-muted-foreground/70 hover:text-foreground disabled:opacity-60 active:scale-95"
                title="Share tool"
              >
                {shared ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} /> : <Share2 className="h-4 w-4" strokeWidth={1.5} />}
              </motion.button>
            </div>
            <motion.a
              whileHover={{ scale: 1.08, x: 2 }}
              whileTap={{ scale: 0.95 }}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-accent-foreground bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              Visit <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
