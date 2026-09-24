import { useState } from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import type { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { toggleSavedTool, isToolSaved } = useApp();
  const saved = isToolSaved(tool.id);

  const getDomain = (url: string) => {
    try { return new URL(url).hostname; } catch { return ""; }
  };
  
  const [imgSrc, setImgSrc] = useState(tool.logo || (tool.url ? `https://logo.clearbit.com/${getDomain(tool.url)}` : ""));
  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=F7F6F2&color=000000&bold=true`;

  return (
    <div className="group flex flex-col pt-6 border-t border-border hover:border-foreground/30 transition-colors h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border border-border/50 bg-background flex items-center justify-center p-1.5 flex-shrink-0">
            <img 
              src={imgSrc || fallbackImg} 
              alt={tool.name} 
              className="h-full w-full object-contain grayscale" 
              onError={() => {
                if (imgSrc !== fallbackImg) setImgSrc(fallbackImg);
              }}
            />
          </div>
          <div>
            <Link to={`/tools/${tool.id}`} className="inline-block">
              <h3 className="font-bold text-[15px] text-foreground hover:text-accent transition-colors">
                {tool.name}
              </h3>
            </Link>
          </div>
        </div>
        
        <button
          onClick={(e) => { e.preventDefault(); toggleSavedTool(tool.id); }}
          className="text-muted-foreground/40 hover:text-foreground transition-colors"
          title={saved ? "Remove bookmark" : "Bookmark tool"}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-foreground text-foreground" : ""}`} />
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1">
        {tool.description}
      </p>

      <div className="flex items-center justify-between mt-auto pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{tool.category}</span>
          <span className="text-[11px] text-muted-foreground capitalize">{tool.pricing}</span>
        </div>
        
        <Link to={`/tools/${tool.id}`} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
