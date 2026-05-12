import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check, Star, Flame, Sparkles, Heart, Share2, Flag, Eye, MousePointerClick, Copy } from "lucide-react";
import { useToolById, useTools, useCategories } from "@/hooks/useQueries";
import { ToolCard } from "@/components/ToolCard";
import { StarRating } from "@/components/StarRating";
import { useApp } from "@/contexts/AppContext";
import { useIncrementClicks, useIncrementViews } from "@/api/mutations";

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tool, refetch: refetchTool } = useToolById(id);
  const { data: tools = [] } = useTools();
  const { data: categories = [] } = useCategories();
  const { toggleSavedTool, isToolSaved, addRecentlyViewed } = useApp();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [shared, setShared] = useState(false);
  const viewsIncrementedRef = useRef(false);
  
  const incrementClicksMutation = useIncrementClicks();
  const incrementViewsMutation = useIncrementViews();

  useEffect(() => {
    if (id) {
      addRecentlyViewed(id);
    }
  }, [id]);

  // Increment views when tool loads (only once per page visit)
  useEffect(() => {
    if (tool?.id && !viewsIncrementedRef.current) {
      viewsIncrementedRef.current = true;
      incrementViewsMutation.mutate(tool.id);
    }
  }, [tool?.id]);

  if (!tool) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Tool not found</h1>
        <Link to="/tools" className="mt-4 inline-block text-accent hover:underline">← Back to tools</Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === tool.category);
  const similarTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);
  const saved = isToolSaved(tool.id);

  const pricingColors: Record<string, string> = {
    Free: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
    Freemium: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20",
    Paid: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
  };

  const copyCoupon = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (tool.couponCode) {
      try {
        await navigator.clipboard.writeText(tool.couponCode);
        setCopiedCoupon(true);
        setTimeout(() => setCopiedCoupon(false), 2000);
        console.log('✅ Coupon code copied to clipboard');
      } catch (err) {
        console.error('❌ Failed to copy coupon code:', err);
      }
    }
  };

  const shareTool = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      console.log('✅ Tool URL copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy tool URL:', err);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to tools
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/60 shadow-card p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-secondary p-2.5 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
              <img src={tool.logo} alt={tool.name} className="h-full w-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=f1f5f9&color=475569&bold=true&size=64`; }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground break-words">{tool.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${pricingColors[tool.pricing]}`}>{tool.pricing}</span>
                {tool.trending && (
                  <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20">
                    <Flame className="h-2.5 w-2.5" /> Trending
                  </span>
                )}
                {tool.isNew && (
                  <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Sparkles className="h-2.5 w-2.5" /> New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {category && <span className="text-ui-label text-muted-foreground">{category.name}</span>}
                <StarRating toolId={tool.id} currentRating={tool.rating || 0} reviewCount={tool.reviewCount || 0} onRatingSubmitted={() => refetchTool()} />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button onClick={() => toggleSavedTool(tool.id)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Heart className={`h-5 w-5 ${saved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} strokeWidth={1.5} />
              </button>
              <button onClick={shareTool} onTouchEnd={shareTool} disabled={shared} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-60">
                {shared ? <Check className="h-5 w-5 text-emerald-500" /> : <Share2 className="h-5 w-5" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <p className="mt-6 text-body text-muted-foreground">{tool.description}</p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-secondary text-[12px] font-medium text-muted-foreground">{tag}</span>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Features</h3>
            <ul className="space-y-2">
              {tool.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-ui-label text-muted-foreground">Ease of Use</p>
              <p className="mt-1 text-sm font-medium text-foreground">{tool.easeOfUse}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-ui-label text-muted-foreground">Free Plan</p>
              <p className="mt-1 text-sm font-medium text-foreground">{tool.freePlan ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Coupon Code */}
          {tool.couponCode && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Coupon Code</p>
                <code className="block text-sm sm:text-lg font-mono font-bold text-accent break-all">{tool.couponCode}</code>
              </div>
              <button 
                onClick={copyCoupon} 
                onTouchEnd={copyCoupon}
                disabled={copiedCoupon}
                className="flex items-center justify-center sm:justify-start gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity disabled:cursor-not-allowed shrink-0"
              >
                {copiedCoupon ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
          )}

          {/* Analytics Placeholder */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-ui-label text-muted-foreground">Views</p>
                <p className="text-sm font-semibold text-foreground">{tool.views?.toLocaleString() || "—"}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-ui-label text-muted-foreground">Clicks</p>
                <p className="text-sm font-semibold text-foreground">{tool.clicks?.toLocaleString() || "—"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => {
                incrementClicksMutation.mutate(tool.id);
                window.open(tool.url, '_blank');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              Visit Official Website <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate('/contact', { state: { tool: tool.name } })} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              <Flag className="h-4 w-4" strokeWidth={1.5} /> Report
            </button>
          </div>
        </motion.div>

        {similarTools.length > 0 && (
          <div className="mt-12 px-4 sm:px-0">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {similarTools.map((t, i) => <ToolCard key={t.id} tool={t} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;
