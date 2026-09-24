import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { User, Heart, Sparkles, Settings } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { ToolCard } from "@/components/ToolCard";
import { PromptCard } from "@/components/PromptCard";
import { useTools, usePrompts } from "@/hooks/useQueries";

type ProfileTab = "profile" | "contributions" | "saved" | "settings";

const Profile = () => {
  const { section } = useParams<{ section?: string }>();
  const { isLoggedIn, user, savedTools, savedPrompts, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    (section as ProfileTab) || "profile"
  );
  
  const { data: tools = [] } = useTools();
  const { data: prompts = [] } = usePrompts();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const savedToolsList = tools.filter((t) => savedTools.includes(t.id));
  const savedPromptsList = prompts.filter((p) => savedPrompts.includes(p.id));

  const tabs = [
    { id: "profile" as const, label: "Identity", icon: User },
    { id: "saved" as const, label: "Index", icon: Heart },
    { id: "contributions" as const, label: "Submissions", icon: Sparkles },
    { id: "settings" as const, label: "Preferences", icon: Settings },
  ];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 px-6 lg:px-20 text-foreground">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Profile Header */}
        <div className="mb-16 border-b border-border pb-12 flex flex-col md:flex-row md:items-end gap-8">
          <div className="h-24 w-24 border border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover grayscale" />
            ) : (
              <span className="font-sans text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Account</h2>
            <h1 className="font-sans text-4xl lg:text-[56px] leading-[1.05] text-foreground">
              {user?.name}
            </h1>
            <p className="text-[13px] text-muted-foreground mt-4">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:w-48 flex-shrink-0 flex flex-col gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`text-left py-3 px-4 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === t.id ? "bg-foreground text-background" : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="border border-border p-8 md:p-12">
                <h3 className="font-sans text-3xl mb-8">Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="border-b border-border pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Name</p>
                    <p className="text-[15px] font-medium">{user?.name}</p>
                  </div>
                  <div className="border-b border-border pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</p>
                    <p className="text-[15px] font-medium">{user?.email}</p>
                  </div>
                  <div className="border-b border-border pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Member Since</p>
                    <p className="text-[15px] font-medium">{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div>
                <h3 className="font-sans text-3xl mb-8">Personal Index</h3>
                <p className="text-[13px] text-muted-foreground mb-12">Your curated catalogue of AI tools and prompts.</p>
                
                <div className="mb-16">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-4 mb-8">Saved Tools</h4>
                  {savedToolsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                      {savedToolsList.map((tool, i) => (
                        <ToolCard key={tool.id} tool={tool} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 border border-dashed border-border flex flex-col items-center justify-center text-center">
                      <p className="text-[13px] text-muted-foreground mb-4">No tools saved yet.</p>
                      <Link to="/tools" className="text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent">Browse Tools</Link>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-4 mb-8">Saved Prompts</h4>
                  {savedPromptsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                      {savedPromptsList.map((prompt, i) => (
                        <PromptCard key={prompt.id} prompt={prompt} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 border border-dashed border-border flex flex-col items-center justify-center text-center">
                      <p className="text-[13px] text-muted-foreground mb-4">No prompts saved yet.</p>
                      <Link to="/prompts" className="text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent">Browse Prompts</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === "contributions" && (
              <div className="border border-border p-8 md:p-12 text-center">
                 <h3 className="font-sans text-2xl mb-4">Submissions</h3>
                 <p className="text-[13px] text-muted-foreground">You haven't submitted any tools or prompts yet.</p>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="border border-border p-8 md:p-12 text-center">
                 <h3 className="font-sans text-2xl mb-4">Preferences</h3>
                 <p className="text-[13px] text-muted-foreground">Notification and display preferences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
