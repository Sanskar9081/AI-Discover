import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Heart, Clock } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { AdCard } from "@/components/AdCard";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { useTools, useCategories, useAds } from "@/hooks/useQueries";
import { useApp } from "@/contexts/AppContext";

type SortOption = "popular" | "newest" | "rating";

const Tools = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [pricing, setPricing] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [showSubmit, setShowSubmit] = useState(false);
  const { savedTools, recentlyViewed } = useApp();
  
  // Fetch data from Supabase via React Query
  const { data: tools = [], isLoading: toolsLoading } = useTools();
  const { data: categories = [] } = useCategories();
  const { data: ads = [] } = useAds();

  const savedToolsList = tools.filter((t) => savedTools.includes(t.id));
  const recentToolsList = tools.filter((t) => recentlyViewed.includes(t.id));
  const gridAds = ads.filter((a) => a.placement === "grid");

  let filtered = tools.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (pricing !== "all" && t.pricing !== pricing) return false;
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
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">AI Tools</h1>
            <p className="mt-2 text-body text-muted-foreground">Browse and discover the best AI tools.</p>
          </div>
          <button onClick={() => setShowSubmit(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> Submit Tool
          </button>
        </motion.div>

        {/* Saved Tools */}
        {!toolsLoading && savedToolsList.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-rose-500" />
              <h2 className="text-lg font-semibold text-foreground">Saved Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {savedToolsList.slice(0, 4).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {!toolsLoading && recentToolsList.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentToolsList.slice(0, 4).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
            </div>
          </div>
        )}

        <div className="mt-8 max-w-xl sticky top-20 z-30">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {["all", "Free", "Freemium", "Paid"].map((p) => (
              <button key={p} onClick={() => setPricing(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${pricing === p ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {p === "all" ? "All Pricing" : p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-muted-foreground">Sort:</span>
            {([["popular", "Most Popular"], ["newest", "Newest"], ["rating", "Highest Rated"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setSort(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {toolsLoading ? (
          <div className="mt-8 text-center text-muted-foreground">Loading tools...</div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((tool, i) => (
                <>
                  <ToolCard key={tool.id} tool={tool} index={i} />
                  {/* Insert ad after every 6th tool */}
                  {(i + 1) % 6 === 0 && gridAds[Math.floor(i / 6)] && (
                    <AdCard key={`ad-${i}`} ad={gridAds[Math.floor(i / 6)]} index={i + 1} />
                  )}
                </>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-foreground mb-2">No tools found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            )}
          </>
        )}
      </div>

      <SubmitToolModal open={showSubmit} onClose={() => setShowSubmit(false)} />
    </div>
  );
};

export default Tools;
