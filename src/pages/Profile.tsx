import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Navigate, Link } from "react-router-dom";
import { User, Heart, BookOpen, Settings, Sparkles, Save, Eye, EyeOff } from "lucide-react";
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
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editMobile, setEditMobile] = useState(user?.mobile || "");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const { data: tools = [] } = useTools();
  const { data: prompts = [] } = usePrompts();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const savedToolsList = tools.filter((t) => savedTools.includes(t.id));
  const savedPromptsList = prompts.filter((p) => savedPrompts.includes(p.id));

  const tabs = [
    { id: "profile" as const, label: "My Profile", icon: User },
    { id: "contributions" as const, label: "Contributions", icon: Sparkles },
    { id: "saved" as const, label: "Saved", icon: Heart },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const handleSave = () => {
    updateProfile({ name: editName, email: editEmail, mobile: editMobile });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-[12px] text-muted-foreground/60 mt-1">Joined {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "recently"}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" strokeWidth={1.5} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-ui-label text-muted-foreground mb-1">Name</p>
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-ui-label text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="text-ui-label text-muted-foreground mb-1">Mobile</p>
                  <p className="text-sm font-medium text-foreground">{user?.mobile || "Not set"}</p>
                </div>
                <div>
                  <p className="text-ui-label text-muted-foreground mb-1">Member Since</p>
                  <p className="text-sm font-medium text-foreground">{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contributions Tab */}
          {activeTab === "contributions" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Submitted Tools</h2>
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">You haven't submitted any tools yet.</p>
                  <Link to="/tools" className="mt-3 inline-block text-sm text-accent hover:underline">Submit your first tool →</Link>
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Submitted Prompts</h2>
                <div className="text-center py-8">
                  <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">You haven't submitted any prompts yet.</p>
                  <Link to="/prompts" className="mt-3 inline-block text-sm text-accent hover:underline">Submit your first prompt →</Link>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-accent shrink-0" />
                <p className="text-sm text-foreground">You haven't contributed yet — start today 🚀</p>
              </div>
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === "saved" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" /> Saved Tools
                </h2>
                {savedToolsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedToolsList.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border/60 shadow-card p-8 text-center">
                    <Heart className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No saved tools yet.</p>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" /> Saved Prompts
                </h2>
                {savedPromptsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPromptsList.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border/60 shadow-card p-8 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No saved prompts yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email"
                    className="w-full h-11 px-4 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mobile</label>
                  <input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} type="tel"
                    className="w-full h-11 px-4 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Change Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="New password"
                      className="w-full h-11 px-4 pr-10 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
