import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Image, Video, Code, Music, Zap, TrendingUp, ArrowRight, Sparkles, GraduationCap, Palette, PenTool, Flame, Trophy, Mail } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { PromptCard } from "@/components/PromptCard";
import { AdCard } from "@/components/AdCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useTools, useCategories, usePrompts, useAds, useSettings, useUseCases } from "@/hooks/useQueries";
import { categories as defaultCategories } from "@/data/tools";

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Image, Video, Code, Music, Zap, GraduationCap, Palette, PenTool, Flame, Trophy, Mail,
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const } },
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch data from Supabase via React Query
  const { data: tools = [], isError: toolsError, error: toolsErrorMsg } = useTools();
  const { data: dbCategories = [], isError: categoriesError, error: categoriesErrorMsg } = useCategories();
  const { data: prompts = [] } = usePrompts();
  const { data: ads = [] } = useAds();
  const { data: settings = [] } = useSettings();
  const { data: useCasesList = [] } = useUseCases();

  // Use database categories, fallback to defaults if empty
  const categories = (dbCategories && dbCategories.length > 0) ? dbCategories : defaultCategories;

  // Debug logging
  console.log('🔍 Index page categories (DB):', dbCategories?.length || 0, 'Error:', categoriesError);
  console.log('🔍 Index page categories (using):', categories?.length || 0, categories);
  console.log('🔍 Index page tools:', tools?.length || 0, 'Error:', toolsError);
  
  // Build dynamic use cases with icons
  const useCases = (useCasesList && useCasesList.length > 0 ? useCasesList : [
    { label: "For Students", icon: "GraduationCap", key: "students" },
    { label: "For Developers", icon: "Code", key: "developers" },
    { label: "For Creators", icon: "PenTool", key: "creators" },
  ]).map((uc: any) => ({
    ...uc,
    icon: iconMap[uc.icon] || Zap,
  }));

  // Build stats from settings
  const settingMap = new Map(settings?.map((s: any) => [s.key, s.value]) || []);
  const stats = [
    { value: settingMap.get('homepage_total_tools') || '100+', label: "AI Tools" },
    { value: settingMap.get('homepage_categories') || '10+', label: "Categories" },
    { value: settingMap.get('homepage_update_freq') || 'Daily', label: "Updated" },
    { value: settingMap.get('homepage_pricing') || 'Free', label: "To Use" },
  ];

  const featuredTools = tools.filter((t) => t.featured);
  const trendingTools = tools.filter((t) => t.trending);
  const featuredPrompts = prompts.filter((p) => p.featured);
  const featuredAds = ads.filter((a) => a.placement === "featured");
  
  // Get Tool of the Day from settings, fallback to highest rated tool
  const toolOfTheDayId = settingMap.get('tool_of_the_day');
  const toolOfTheDay = toolOfTheDayId ? tools.find(t => t.id === toolOfTheDayId) : (tools.length > 0 ? tools.reduce((best, t) => t.rating > best.rating ? t : best, tools[0]) : null);
  
  // Get Prompt of the Day from settings, fallback to first featured prompt
  const promptOfTheDayId = settingMap.get('prompt_of_the_day');
  const promptOfTheDay = promptOfTheDayId ? prompts.find(p => p.id === promptOfTheDayId) : (featuredPrompts.length > 0 ? featuredPrompts[0] : null);

  const filteredFeatured = searchQuery
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featuredTools;

  return (
    <div>
      {/* Hero - Premium Redesign */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background border-b border-border/30">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[10%] w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
        </div>

        {/* Premium dot grid pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative py-20 md:py-32 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Eyebrow text */}
            <div className="flex items-center justify-center gap-2 mb-8 opacity-80">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/50" />
              <span className="text-ui-label text-accent/90 font-bold">Discover • Learn • Build</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/50" />
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] leading-[1.15] text-foreground mb-8 text-center">
              <span className="bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
                Discover the Right AI<br />
                Tool for Every Task
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-display-sub text-muted-foreground/95 max-w-3xl mx-auto mb-12 leading-relaxed text-center">
              Handpicked, verified, and rated by the community. Find the perfect AI tools to supercharge your workflow.
            </p>

            {/* CTA Section */}
            <div className="space-y-8">
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={setSearchQuery} placeholder='Try "AI for video editing" or "image generator"' large redirectToAssistant={true} />
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground/70">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent/60" />
                  <span className="font-medium">700+ Tools</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent/60" />
                  <span className="font-medium">Updated Daily</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent/60" />
                  <span className="font-medium">Free Forever</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Enhanced Premium */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute -top-40 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <motion.div 
                key={s.label} 
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 border border-accent/15 shadow-md hover:shadow-lg transition-all duration-300 hover:border-accent/30 group cursor-pointer"
              >
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent/90 to-accent/70 mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground/80 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories - Premium Grid */}
      <section className="py-24 px-4 border-y border-border/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-14">
              <div>
                <p className="text-ui-label text-accent/80 mb-3 font-bold">EXPLORE</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Categories</h2>
              </div>
              <Link to="/tools" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-300 hover:shadow-lg group font-semibold text-sm">
                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories && categories.length > 0 ? (
                categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Zap;
                  return (
                    <motion.div key={cat.id} variants={fadeUp}>
                      <Link to={`/tools?category=${cat.id}`} className="flex flex-col items-center gap-3 p-6 md:p-7 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 border border-accent/20 shadow-md hover:shadow-lg transition-all duration-300 group hover-lift hover:border-accent/50 hover:bg-gradient-to-br hover:from-card hover:to-card/40">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-120 relative overflow-hidden" style={{ backgroundColor: `${cat.color}15` }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Icon className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-hover:scale-125 relative z-10" style={{ color: cat.color }} strokeWidth={1.8} />
                        </div>
                        <span className="text-sm md:text-base font-bold text-foreground text-center">{cat.name}</span>
                        <span className="text-[11px] md:text-[12px] text-muted-foreground/70 font-medium">{tools.filter(t => t.category === cat.id).length} tools</span>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center p-8 bg-gradient-to-br from-card/80 to-card/50 rounded-2xl border border-border/40">
                  <p className="text-muted-foreground">No categories found. Using default categories.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-background/50 to-background border-t border-border/20">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-16">
              <div>
                <p className="text-ui-label text-accent/80 mb-3 font-bold">CURATED</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">{searchQuery ? "Search Results" : "Featured Tools"}</h2>
              </div>
              <Link to="/tools" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-lg transition-all duration-300 group font-semibold text-sm">
                Browse all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Link>
            </motion.div>
          </motion.div>
          {filteredFeatured.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No tools found matching "<span className="text-foreground font-medium">{searchQuery}</span>"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeatured.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
              {featuredAds.map((ad, i) => <AdCard key={ad.id} ad={ad} index={filteredFeatured.length + i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Tool of the Day */}
      <section className="py-24 px-4 border-t border-border/20 relative">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/4 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-ui-label text-accent mb-0.5">Editor's pick</p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Tool of the Day</h2>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              {toolOfTheDay && <ToolCard tool={toolOfTheDay} index={0} />}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-ui-label text-accent mb-0.5">Community favorites</p>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Prompts</h2>
                </div>
              </div>
              <Link to="/prompts" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group">
                View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.slice(0, 6).map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Prompt of the Day */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-ui-label text-accent mb-0.5">Daily inspiration</p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Prompt of the Day</h2>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              {promptOfTheDay && <PromptCard prompt={promptOfTheDay} index={0} />}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-10">
              <p className="text-ui-label text-accent mb-2">Curated collections</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Tools by Use Case</h2>
            </motion.div>
            {useCases.map(({ label, icon: UCIcon, key, id }) => {
              // Filter by use case ID (primary) or fallback to key for default use cases
              const filterValue = id || key;
              let ucTools = tools.filter((t) => t.useCase?.includes(filterValue)).slice(0, 4);
              
              // If no use case-specific tools found, fallback to featured tools
              if (ucTools.length === 0) {
                ucTools = featuredTools.slice(0, 4);
              }
              
              // Skip if still no tools available
              if (ucTools.length === 0) return null;
              
              return (
                <motion.div key={key} variants={fadeUp} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <UCIcon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{label}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ucTools.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-ui-label text-accent mb-0.5">Most popular right now</p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Tools</h2>
              </div>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingTools.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
          </div>
        </div>
      </section>

      {/* Trending Prompts */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
              <div>
                <p className="text-ui-label text-accent mb-2">Most popular prompts</p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Prompts</h2>
              </div>
              <Link to="/prompts" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group">
                View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.slice(0, 3).map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}>
            <NewsletterSignup />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Can't find the right tool?</h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">Ask our AI assistant to recommend the perfect AI tools for your specific needs.</p>
            <Link to="/assistant" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 hover:shadow-xl">
              <Sparkles className="h-4 w-4" strokeWidth={1.5} /> Try AI Assistant
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
