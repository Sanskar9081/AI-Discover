import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import type { Prompt } from "@/data/tools";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('❌ Failed to copy prompt:', err);
    }
  };

  return (
    <div className="group flex flex-col pt-6 border-t border-border hover:border-foreground/30 transition-colors h-full">
      <div className="mb-6">
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest block mb-4">
          Prompt {(index + 1).toString().padStart(3, '0')}
        </span>
        <h3 className="font-bold text-[18px] text-foreground leading-[1.2] mb-3 group-hover:text-accent transition-colors">
          {prompt.title}
        </h3>
        <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-4 opacity-80">
          {prompt.category} {prompt.tags?.[0] ? `· ${prompt.tags[0]}` : ''}
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
          {prompt.description || "Use this prompt to get better results from your AI assistant."}
        </p>
      </div>

      <div className="mt-auto pb-4">
        <button
          onClick={copyPrompt}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
               <span className="text-emerald-600">Copied</span> <Check className="h-3 w-3 text-emerald-600" />
            </>
          ) : (
            <>
               Copy prompt <ArrowRight className="h-3 w-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
