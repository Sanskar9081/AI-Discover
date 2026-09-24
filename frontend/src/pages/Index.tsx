import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { PromptCard } from "@/components/PromptCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useTools, useCategories, usePrompts, useSettings } from "@/hooks/useQueries";
import { categories as defaultCategories } from "@/data/tools";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch data from API via React Query
  const { data: tools = [] } = useTools();
  const { data: dbCategories = [] } = useCategories();
  const { data: prompts = [] } = usePrompts();
  const { data: settings = [] } = useSettings();

  // Use database categories, fallback to defaults if empty
  const categories = (dbCategories && dbCategories.length > 0) ? dbCategories : defaultCategories;

  // Build stats from settings
  const settingMap = new Map(settings?.map((s: any) => [s.key, s.value]) || []);
  const stats = [
    { value: settingMap.get('homepage_total_tools') || '150+', label: "Curated Tools" },
    { value: settingMap.get('homepage_categories') || '14', label: "Categories" },
    { value: settingMap.get('homepage_update_freq') || 'Daily', label: "Updated" },
  ];

  const featuredTools = tools.filter((t) => t.featured);
  const featuredPrompts = prompts.filter((p) => p.featured);
  
  const filteredFeatured = searchQuery
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featuredTools;

  return (
    <div className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-background">
        <div className="flex flex-col lg:flex-row min-h-[600px] max-w-[1400px] mx-auto">
          {/* Left Side: Content */}
          <div className="flex-1 px-6 lg:pl-8 lg:pr-12 py-16 lg:py-24 flex flex-col justify-center">
            <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-6">
              CURATED TOOLS. REAL WORKFLOWS.
            </p>
            <h1 className="font-sans text-5xl md:text-6xl lg:text-[72px] tracking-normal leading-[1.05] mb-6 text-foreground">
              Work<br />
              smarter with<br />
              <span className="text-accent italic">better AI tools.</span>
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md mb-12 leading-relaxed">
              A thoughtfully curated directory of AI tools, prompts and resources to help you do better work, faster.
            </p>
            
            <div className="max-w-xl mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search tools, prompts, categories, or use cases..." 
                className="w-full bg-card border border-border h-14 pl-12 pr-14 text-[15px] focus:outline-none focus:border-foreground transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square bg-foreground hover:bg-foreground/90 text-background flex items-center justify-center transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-foreground mr-1">Popular:</span>
              {['ChatGPT', 'Image generation', 'Video editing', 'Code assistant', 'Research'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-medium rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side: Editorial Visual */}
          <div className="flex-1 relative hidden lg:block overflow-hidden h-full min-h-[700px]">
            <img 
              src="/images/hero-workspace.jpg" 
              alt="Premium Workspace" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark Side Panel Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-[#111111]/90 backdrop-blur-sm p-12 flex flex-col justify-center border-l border-white/10">
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase mb-8">
                AI-DISCOVER
              </p>
              <h2 className="font-sans text-[42px] text-white leading-[1.1] mb-12">
                A more<br />
                focused way<br />
                to explore AI.
              </h2>
              <div className="flex flex-col gap-3 text-[10px] tracking-[0.2em] font-bold text-white/60 mb-24">
                <span className="hover:text-white transition-colors cursor-pointer border-b border-white/20 pb-2 w-16">DISCOVER</span>
                <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent pb-2 w-16">EXPLORE</span>
                <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent pb-2 w-16">COMPARE</span>
                <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent pb-2 w-16">LEARN</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                 <span className="text-white/50 text-xs font-bold">01 / 04</span>
                 <div className="flex gap-2">
                   <button className="h-8 w-12 border border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"><ArrowRight className="h-3 w-3 rotate-180" /></button>
                   <button className="h-8 w-12 border border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"><ArrowRight className="h-3 w-3" /></button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Index */}
      <section className="py-24 px-6 lg:px-20 border-b border-border bg-background">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="lg:w-64 flex-shrink-0">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-4">Categories</h2>
            <h3 className="font-sans text-[40px] leading-[1.05] text-foreground">
              Find tools<br />
              by what you do.
            </h3>
          </div>
          
          <div className="flex-1 max-w-3xl">
            <div className="flex flex-col border-t border-border">
              {categories.slice(0, 10).map((cat, index) => {
                const count = tools.filter(t => t.category === cat.name).length || 0;
                return (
                  <Link key={cat.id} to={`/tools?category=${encodeURIComponent(cat.name)}`} className="group flex items-center justify-between py-5 border-b border-border hover:pl-4 transition-all duration-300">
                    <div className="flex items-center gap-8">
                      <span className="text-[11px] font-bold text-muted-foreground/50 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                      <span className="text-[15px] font-bold text-foreground group-hover:text-accent transition-colors">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] text-muted-foreground">{count} tools</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                );
              })}
              {categories.length > 10 && (
                <Link to="/tools" className="group flex items-center justify-between py-5 border-b border-border hover:pl-4 transition-all duration-300">
                  <div className="flex items-center gap-8">
                    <span className="text-[11px] font-bold text-muted-foreground/50 w-6">{(Math.min(categories.length, 11)).toString().padStart(2, '0')}</span>
                    <span className="text-[15px] font-bold text-foreground group-hover:text-accent transition-colors">More Categories</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[13px] text-muted-foreground">{categories.length - 10} more</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="py-24 px-6 lg:px-20 border-b border-border bg-background">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-64 flex-shrink-0 flex flex-col">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-4">Editor's Picks</h2>
            <h3 className="font-sans text-[40px] leading-[1.05] text-foreground mb-4">
              The tools<br />
              worth your<br />
              time.
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-8">
              A handpicked selection of AI tools making a real difference right now.
            </p>
            <div className="flex gap-2 mt-auto">
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4 rotate-180" /></button>
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col lg:flex-row gap-6 relative">
            <div className="absolute right-0 -top-12 text-[11px] font-bold">
               <Link to="/tools" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                 View all tools <ArrowRight className="h-3 w-3" />
               </Link>
             </div>

            {/* Left: Featured Dominant Tool */}
            {filteredFeatured.length > 0 && (
              <div className="lg:w-[60%] border-t border-border pt-8 flex flex-col group h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 border border-border bg-background flex items-center justify-center flex-shrink-0 p-3">
                    <img src={filteredFeatured[0].logo} alt={filteredFeatured[0].name} className="w-full h-full object-contain" onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${filteredFeatured[0].name}&background=f1f5f9&color=1a1a1a&bold=true`} />
                  </div>
                  <div>
                    <h3 className="font-sans text-[42px] text-foreground leading-none mb-2">{filteredFeatured[0].name}</h3>
                    <p className="text-muted-foreground text-[13px] uppercase tracking-wider">{filteredFeatured[0].provider || "Anthropic"}</p>
                  </div>
                </div>
                
                <p className="text-foreground/80 text-[18px] leading-relaxed max-w-md mb-8">
                  {filteredFeatured[0].description}
                </p>
                
                {filteredFeatured[0].tags && (
                  <div className="flex items-center gap-2 mb-10 flex-wrap">
                    {filteredFeatured[0].tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-6 mb-10">
                  <a href={filteredFeatured[0].url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors">
                    Visit website <ArrowRight className="h-3 w-3 -rotate-45" />
                  </a>
                  <Link to={`/tools/${filteredFeatured[0].id}`} className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    View details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                
                <div className="flex-1 min-h-[240px] w-full bg-secondary relative mt-auto border border-border">
                   <img src={`https://picsum.photos/seed/${filteredFeatured[0].name}/800/400`} alt="Editorial Abstract" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80" />
                </div>
              </div>
            )}
            
            {/* Right: Small Featured List */}
            <div className="lg:w-[40%] flex flex-col pt-8 lg:pt-0">
              <div className="flex flex-col border-t border-border h-full">
                {filteredFeatured.slice(1, 4).map((tool, index) => (
                  <Link key={tool.id} to={`/tools/${tool.id}`} className="group flex flex-col justify-center flex-1 border-b border-border py-6 hover:pl-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground/50 mb-4 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="font-bold text-[18px] text-foreground group-hover:text-accent transition-colors">{tool.name}</h4>
                          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{tool.provider || "Unknown"}</span>
                        </div>
                        <p className="text-[13px] text-muted-foreground max-w-sm leading-relaxed">{tool.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all self-end mb-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Tools */}
      <section className="py-24 px-6 lg:px-20 bg-background border-b border-border">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-64 flex-shrink-0 flex flex-col">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-4">Latest Tools</h2>
            <h3 className="font-sans text-[40px] leading-[1.05] text-foreground mb-4">
              New and<br />
              noteworthy.
            </h3>
            <div className="flex gap-2 mt-8">
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4 rotate-180" /></button>
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 relative">
             <div className="absolute right-0 -top-12 text-[11px] font-bold">
               <Link to="/tools" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                 View all tools <ArrowRight className="h-3 w-3" />
               </Link>
             </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {tools.slice(0, 4).map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prompt Library */}
      <section className="py-24 px-6 lg:px-20 bg-background border-b border-border">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-64 flex-shrink-0 flex flex-col">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-4">Prompt Library</h2>
            <h3 className="font-sans text-[40px] leading-[1.05] text-foreground mb-4">
              Practical prompts<br />
              for real work.
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-8">
              Save time with ready-to-use prompts for writing, coding, marketing and research.
            </p>
            <div className="flex gap-2 mt-auto">
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4 rotate-180" /></button>
               <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 relative">
             <div className="absolute right-0 -top-12 text-[11px] font-bold">
               <Link to="/prompts" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                 View all prompts <ArrowRight className="h-3 w-3" />
               </Link>
             </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredPrompts.slice(0, 4).map((p, i) => (
                <PromptCard key={p.id} prompt={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="bg-[#1C1B19] text-white">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row min-h-[400px]">
          
          <div className="flex-1 px-6 lg:pl-10 lg:pr-24 py-20 flex flex-col justify-center">
             <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase mb-4">AI-Discover Assistant</p>
             <h2 className="font-sans text-[42px] leading-[1.1] text-white mb-4">Not sure which tool to use?</h2>
             <p className="text-white/70 text-[15px] leading-relaxed mb-8 max-w-md">
               Describe your workflow and get personalized recommendations from the AI-Discover Assistant.
             </p>
             
             <div>
                <Link 
                  to="/assistant" 
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black font-bold text-[13px] hover:bg-white/90 transition-colors rounded-sm"
                >
                  Get recommendations <ArrowRight className="h-4 w-4" />
                </Link>
             </div>
          </div>
          
          <div className="flex-1 relative hidden md:block">
            <img 
              src="/images/assistant-cta.jpg" 
              alt="Workspace" 
              className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-luminosity opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1B19] to-transparent w-1/4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
