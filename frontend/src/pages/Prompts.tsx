import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Search, ExternalLink } from "lucide-react";
import { usePrompts, useToolById, useCategories } from "@/hooks/useQueries";
import { PromptCard } from "@/components/PromptCard";

const Prompts = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: prompts = [], isLoading } = usePrompts();
  const { data: categories = [] } = useCategories();
  
  const prompt = id ? prompts.find((p) => p.id === id) : null;
  const { data: suggestedTool } = useToolById(prompt?.suggestedToolId);

  const copyPrompt = async (promptId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {}
  };

  if (id) {
    if (isLoading) {
      return (
        <div className="bg-background min-h-screen pt-12 pb-24 px-6 flex items-center justify-center">
          <p className="text-[13px] text-muted-foreground uppercase tracking-widest">Loading prompt...</p>
        </div>
      );
    }
    
    if (!prompt) {
      return (
        <div className="bg-background min-h-screen pt-12 pb-24 px-6 flex flex-col items-center justify-center">
          <h1 className="font-sans text-3xl mb-4">Prompt not found</h1>
          <Link to="/prompts" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">← Back to catalogue</Link>
        </div>
      );
    }

    return (
      <div className="bg-background min-h-screen pt-12 pb-24 px-6 lg:px-20">
        <div className="max-w-[1000px] mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-16">
            <ArrowLeft className="h-3 w-3" /> Back to catalogue
          </Link>

          <div className="flex flex-col gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="px-3 py-1.5 bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {prompt.category}
                </span>
                {prompt.tags?.map(t => (
                   <span key={t} className="px-3 py-1.5 bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     {t}
                   </span>
                ))}
              </div>
              <h1 className="font-sans text-4xl md:text-5xl lg:text-[64px] leading-[1.1] text-foreground mb-6">
                {prompt.title}
              </h1>
              <p className="text-[16px] text-muted-foreground leading-relaxed max-w-2xl">
                {prompt.description}
              </p>
            </div>

            <div className="border border-border bg-card p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Prompt</h3>
                <button
                  onClick={() => copyPrompt(prompt.id, prompt.prompt)}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedId === prompt.id ? (
                    <><span className="text-emerald-600">Copied</span> <Check className="h-3 w-3 text-emerald-600" /></>
                  ) : (
                    <>Copy to clipboard <Copy className="h-3 w-3" /></>
                  )}
                </button>
              </div>
              <p className="text-[16px] leading-[1.8] text-foreground whitespace-pre-wrap font-medium">
                {prompt.prompt.replace(/\\n/g, '\n')}
              </p>
            </div>

            {suggestedTool && (
              <div className="mt-12 pt-12 border-t border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Recommended Tool</h3>
                <Link to={`/tools/${suggestedTool.id}`} className="group flex items-center justify-between py-6 border-b border-border hover:pl-4 transition-all duration-300 max-w-xl">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 border border-border bg-background flex items-center justify-center p-2 flex-shrink-0">
                      <img src={suggestedTool.logo} alt={suggestedTool.name} className="h-full w-full object-contain" onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${suggestedTool.name}&background=f1f5f9&color=1a1a1a&bold=true`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[16px] text-foreground group-hover:text-accent transition-colors mb-1">{suggestedTool.name}</h4>
                      <p className="text-[12px] text-muted-foreground line-clamp-1">{suggestedTool.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Catalogue View
  let filtered = prompts.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-background text-foreground min-h-screen pt-12 pb-24 px-6 lg:px-20">
      <div className="max-w-[1500px] mx-auto">
        <div className="mb-16 border-b border-border pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
             <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Catalogue</h2>
             <h1 className="font-sans text-5xl lg:text-[64px] leading-[1.05] text-foreground">
               Prompt Library
             </h1>
          </div>
          
          <div className="max-w-md w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search prompts..." 
              className="w-full bg-transparent border-b border-border h-12 pl-12 text-[14px] focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60 rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-64 flex-shrink-0 flex flex-col gap-10">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Category</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setCategoryFilter("all")}
                  className={`text-left text-[13px] hover:text-foreground transition-colors ${categoryFilter === "all" ? "text-foreground font-bold" : "text-muted-foreground"}`}
                >
                  All Prompts
                </button>
                {Array.from(new Set(prompts.map(p => p.category))).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-left text-[13px] hover:text-foreground transition-colors ${categoryFilter === cat ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
                {categoryFilter === "all" ? "All Prompts" : categoryFilter}
              </h3>
              <span className="text-[11px] font-bold text-muted-foreground">{filtered.length} entries</span>
            </div>
            
            {isLoading ? (
              <div className="py-20 text-center text-[13px] text-muted-foreground">Loading prompts...</div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filtered.map((prompt, i) => (
                   <Link key={prompt.id} to={`/prompts/${prompt.id}`} className="contents">
                      <PromptCard prompt={prompt} index={i} />
                   </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <p className="text-[13px] text-muted-foreground mb-4">No prompts found matching your criteria.</p>
                <button onClick={() => { setCategoryFilter("all"); setSearchQuery(""); }}
                  className="text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompts;
