import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Bookmark, Check } from "lucide-react";
import { useToolById, useTools } from "@/hooks/useQueries";
import { ToolCard } from "@/components/ToolCard";
import { useApp } from "@/contexts/AppContext";
import { useIncrementClicks, useIncrementViews } from "@/api/mutations";

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tool } = useToolById(id);
  const { data: tools = [] } = useTools();
  const { toggleSavedTool, isToolSaved, addRecentlyViewed } = useApp();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  
  const incrementClicksMutation = useIncrementClicks();
  const incrementViewsMutation = useIncrementViews();
  const viewsIncrementedRef = useRef(false);

  const getDomain = (url: string) => {
    try { return new URL(url).hostname; } catch { return ""; }
  };
  
  const domain = tool?.url ? getDomain(tool.url) : "";
  const fallbackImg = tool ? `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=F7F6F2&color=000000&bold=true` : "";
  const [imgSrc, setImgSrc] = useState(tool?.logo || (domain ? `https://logo.clearbit.com/${domain}` : fallbackImg));

  useEffect(() => {
    if (tool) {
      setImgSrc(tool.logo || (domain ? `https://logo.clearbit.com/${domain}` : fallbackImg));
    }
  }, [tool]);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id, addRecentlyViewed]);

  useEffect(() => {
    if (tool?.id && !viewsIncrementedRef.current) {
      viewsIncrementedRef.current = true;
      incrementViewsMutation.mutate(tool.id);
    }
  }, [tool?.id]);

  if (!tool) {
    return (
      <div className="bg-background min-h-screen pt-12 pb-24 px-6 flex items-center justify-center">
        <p className="text-[13px] text-muted-foreground uppercase tracking-widest">Loading tool...</p>
      </div>
    );
  }

  const similarTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);
  const saved = isToolSaved(tool.id);

  const copyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (tool.couponCode) {
      try {
        await navigator.clipboard.writeText(tool.couponCode);
        setCopiedCoupon(true);
        setTimeout(() => setCopiedCoupon(false), 2000);
      } catch (err) {}
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-12 pb-24 px-6 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="h-3 w-3" /> Back to catalogue
        </Link>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 mb-24">
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 border border-border flex items-center justify-center p-3 bg-background flex-shrink-0">
                 <img 
                   src={imgSrc || fallbackImg} 
                   alt={tool.name} 
                   className="w-full h-full object-contain grayscale" 
                   onError={() => {
                     if (imgSrc !== fallbackImg) setImgSrc(fallbackImg);
                   }} 
                 />
              </div>
              <h1 className="font-sans text-5xl lg:text-[72px] leading-[1.05] text-foreground">
                {tool.name}
              </h1>
            </div>
            
            <p className="text-[20px] text-muted-foreground leading-relaxed mb-12 max-w-2xl">
              {tool.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => incrementClicksMutation.mutate(tool.id)}
                className="px-8 py-4 bg-foreground text-background text-[13px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-foreground/90 transition-colors"
              >
                Visit website <ArrowRight className="h-4 w-4 -rotate-45" />
              </a>
              <button
                onClick={(e) => { e.preventDefault(); toggleSavedTool(tool.id); }}
                className="h-[52px] w-[52px] border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title={saved ? "Remove bookmark" : "Bookmark tool"}
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-foreground text-foreground" : ""}`} />
              </button>
            </div>
          </div>
          
          <div className="lg:w-64 flex-shrink-0 pt-2 lg:pt-0">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Metadata</h3>
             <div className="flex flex-col border-t border-border">
               <div className="py-4 border-b border-border flex justify-between items-center">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                 <span className="text-[13px] font-bold text-foreground">{tool.category}</span>
               </div>
               <div className="py-4 border-b border-border flex justify-between items-center">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pricing</span>
                 <span className="text-[13px] font-bold text-foreground">{tool.pricing}</span>
               </div>
               <div className="py-4 border-b border-border flex justify-between items-center">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Provider</span>
                 <span className="text-[13px] font-bold text-foreground">{tool.provider || "Independent"}</span>
               </div>
               <div className="py-4 border-b border-border flex justify-between items-center">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rating</span>
                 <span className="text-[13px] font-bold text-foreground">★ {tool.rating?.toFixed(1) || "New"}</span>
               </div>
               {tool.couponCode && (
                 <div className="py-4 border-b border-border flex justify-between items-center">
                   <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Deal</span>
                   <button onClick={copyCoupon} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                     {copiedCoupon ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> {tool.couponCode}</>}
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
          <div className="lg:w-1/3 flex-shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Overview</h3>
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              {tool.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex-1">
             <div className="prose prose-p:text-muted-foreground prose-p:text-[15px] prose-p:leading-relaxed prose-headings:font-sans prose-headings:text-foreground max-w-none">
               <p>{tool.overview || tool.description}</p>
             </div>
             
             {tool.features && tool.features.length > 0 && (
               <div className="mt-16">
                 <h3 className="font-sans text-2xl text-foreground mb-6">Key Features</h3>
                 <ul className="space-y-4">
                   {tool.features.map((feature, i) => (
                     <li key={i} className="flex items-start gap-4 pb-4 border-b border-border">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{(i+1).toString().padStart(2,'0')}</span>
                       <span className="text-[15px] text-foreground leading-relaxed">{feature}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>

        {/* Related Tools */}
        {similarTools.length > 0 && (
          <div className="pt-24 border-t border-border">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Related Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {similarTools.map((t, i) => (
                <ToolCard key={t.id} tool={t} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;
