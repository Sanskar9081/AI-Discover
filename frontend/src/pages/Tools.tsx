import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Search, Heart, Clock } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { useTools, useCategories } from "@/hooks/useQueries";
import { useApp } from "@/contexts/AppContext";

type SortOption = "popular" | "newest" | "rating";

const Tools = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [pricing, setPricing] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const { savedTools, recentlyViewed } = useApp();
  
  const { data: tools = [], isLoading: toolsLoading } = useTools();
  const { data: categories = [] } = useCategories();

  const savedToolsList = tools.filter((t) => savedTools.includes(t.id));
  const recentToolsList = tools.filter((t) => recentlyViewed.includes(t.id));

  let filtered = tools.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (pricing !== "all" && t.pricing?.toLowerCase() !== pricing.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags?.some(tag => tag.toLowerCase().includes(q));
    }
    return true;
  });

  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else filtered = [...filtered].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));

  return (
    <div className="bg-background text-foreground min-h-screen pt-12 pb-24 px-6 lg:px-20">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 border-b border-border pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
             <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Catalogue</h2>
             <h1 className="font-sans text-5xl lg:text-[64px] leading-[1.05] text-foreground">
               Tools
             </h1>
          </div>
          
          <div className="max-w-md w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search the catalogue..." 
              className="w-full bg-transparent border-b border-border h-12 pl-12 text-[14px] focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60 rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar / Filters */}
          <div className="lg:w-64 flex-shrink-0 flex flex-col gap-10">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Category</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setCategory("all")}
                  className={`text-left text-[13px] hover:text-foreground transition-colors ${category === "all" ? "text-foreground font-bold" : "text-muted-foreground"}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setCategory(cat.name)}
                    className={`text-left text-[13px] hover:text-foreground transition-colors ${category === cat.name ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Pricing</h4>
              <div className="flex flex-col gap-2">
                {["all", "free", "freemium", "paid"].map((price) => (
                  <button 
                    key={price}
                    onClick={() => setPricing(price)}
                    className={`text-left text-[13px] capitalize hover:text-foreground transition-colors ${pricing === price ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Sort by</h4>
              <div className="flex flex-col gap-2">
                {[
                  { value: "popular", label: "Most relevant" },
                  { value: "newest", label: "Recently added" },
                  { value: "rating", label: "Highest rated" },
                ].map((s) => (
                  <button 
                    key={s.value}
                    onClick={() => setSort(s.value as SortOption)}
                    className={`text-left text-[13px] hover:text-foreground transition-colors ${sort === s.value ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalogue Grid */}
          <div className="flex-1">
             {/* Saved / Recent - Editorial Treatment */}
             {(!toolsLoading && savedToolsList.length > 0 && category === "all" && !searchQuery) && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                    <Heart className="h-4 w-4 text-accent" />
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground">Saved Tools</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {savedToolsList.slice(0, 3).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                  </div>
                </div>
             )}

             {(!toolsLoading && recentToolsList.length > 0 && category === "all" && !searchQuery) && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground">Recently Viewed</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {recentToolsList.slice(0, 3).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                  </div>
                </div>
             )}

            {/* Main Catalogue */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
                {category === "all" ? "All Tools" : category}
              </h3>
              <span className="text-[11px] font-bold text-muted-foreground">{filtered.length} entries</span>
            </div>
            
            {toolsLoading ? (
              <div className="py-20 text-center text-[13px] text-muted-foreground">Loading catalogue...</div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filtered.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <p className="text-[13px] text-muted-foreground mb-4">No tools found matching your criteria.</p>
                <button onClick={() => { setCategory("all"); setPricing("all"); setSearchQuery(""); }}
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

export default Tools;
