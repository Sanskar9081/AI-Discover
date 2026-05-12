import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";

const ADMIN_EMAIL = "sanskarsolanki9081@gmail.com";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  joinedAt: string;
}

interface AppContextType {
  isAdminUser: boolean;
  isLoggedIn: boolean;
  user: UserProfile | null;
  savedTools: string[];
  savedPrompts: string[];
  recentlyViewed: string[];
  darkMode: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  toggleSavedTool: (id: string) => void;
  isToolSaved: (id: string) => boolean;
  toggleSavedPrompt: (id: string) => void;
  isPromptSaved: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  toggleDarkMode: () => void;
  requireAuth: () => boolean;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: "login" | "register") => void;
  login: (email: string, password: string) => void;
  register: (profile: Omit<UserProfile, "id" | "joinedAt">) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdminUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(() => loadFromStorage("user", null));
  const [savedTools, setSavedTools] = useState<string[]>(() => loadFromStorage("savedTools", []));
  const [savedPrompts, setSavedPrompts] = useState<string[]>(() => loadFromStorage("savedPrompts", []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadFromStorage("recentlyViewed", []));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [supaSavedTools, setSupaSavedTools] = useState<string[]>([]);
  const [supaSavedPrompts, setSupaSavedPrompts] = useState<string[]>([]);

  const isLoggedIn = !!user;
  const shouldBeAdminUser = user?.email === ADMIN_EMAIL;

  // Sync Supabase auth state and user-specific data
  useEffect(() => {
    const syncSupabaseData = async () => {
      if (!user?.id) {
        setSupaSavedTools([]);
        setSupaSavedPrompts([]);
        return;
      }

      try {
        // Fetch saved tools
        const { data: toolData } = await supabase
          .from('user_saved_items')
          .select('tool_id')
          .eq('user_id', user.id)
          .eq('item_type', 'tool');
        
        setSupaSavedTools(toolData ? toolData.map(item => item.tool_id) : []);

        // Fetch saved prompts
        const { data: promptData } = await supabase
          .from('user_saved_items')
          .select('prompt_id')
          .eq('user_id', user.id)
          .eq('item_type', 'prompt');
        
        setSupaSavedPrompts(promptData ? promptData.map(item => item.prompt_id) : []);
      } catch (error) {
        console.error('Error syncing Supabase data:', error);
      }
    };

    syncSupabaseData();
  }, [user?.id]);

  useEffect(() => { localStorage.setItem("savedTools", JSON.stringify(savedTools)); }, [savedTools]);
  useEffect(() => { localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts)); }, [savedPrompts]);
  useEffect(() => { localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const requireAuth = useCallback(() => {
    if (!user) {
      setAuthModalTab("register");
      setAuthModalOpen(true);
      return false;
    }
    return true;
  }, [user]);

  const login = useCallback((email: string, _password: string) => {
    setUser({
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email,
      mobile: "",
      joinedAt: new Date().toISOString(),
    });
    setAuthModalOpen(false);
  }, []);

  const register = useCallback((profile: Omit<UserProfile, "id" | "joinedAt">) => {
    setUser({
      ...profile,
      id: `user-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    });
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      console.log('🔐 Google OAuth redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Must match Supabase URL Configuration exactly
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        console.error('⚠️  If you see "redirect URL mismatch", make sure this URL is added to:');
        console.error('   1. Google Cloud Console → OAuth redirect URIs');
        console.error('   2. Supabase → Authentication → URL Configuration');
        throw error;
      }

      // After successful sign-in, get the user data
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          mobile: '',
          avatar: session.user.user_metadata?.avatar_url,
          joinedAt: new Date().toISOString(),
        };
        setUser(userData);
        setAuthModalOpen(false);
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }, []);

  const toggleSavedTool = useCallback(async (id: string) => {
    // Update local state for instant UI feedback
    setSavedTools((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

    // Sync to Supabase if logged in
    if (user?.id) {
      try {
        const isCurrentlySaved = supaSavedTools.includes(id);
        
        if (isCurrentlySaved) {
          await supabase
            .from('user_saved_items')
            .delete()
            .eq('user_id', user.id)
            .eq('tool_id', id)
            .eq('item_type', 'tool');
        } else {
          await supabase
            .from('user_saved_items')
            .insert([{ user_id: user.id, tool_id: id, item_type: 'tool' }]);
        }

        // Invalidate queries to refetch
        queryClient.invalidateQueries({ queryKey: ['savedTools', user.id] });
      } catch (error) {
        console.error('Error toggling saved tool:', error);
        // Revert local state on error
        setSavedTools((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
      }
    }
  }, [user?.id, supaSavedTools]);

  const toggleSavedPrompt = useCallback(async (id: string) => {
    setSavedPrompts((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

    if (user?.id) {
      try {
        const isCurrentlySaved = supaSavedPrompts.includes(id);
        
        if (isCurrentlySaved) {
          await supabase
            .from('user_saved_items')
            .delete()
            .eq('user_id', user.id)
            .eq('prompt_id', id)
            .eq('item_type', 'prompt');
        } else {
          await supabase
            .from('user_saved_items')
            .insert([{ user_id: user.id, prompt_id: id, item_type: 'prompt' }]);
        }

        queryClient.invalidateQueries({ queryKey: ['savedPrompts', user.id] });
      } catch (error) {
        console.error('Error toggling saved prompt:', error);
        setSavedPrompts((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
      }
    }
  }, [user?.id, supaSavedPrompts]);

  const isToolSaved = useCallback((id: string) => savedTools.includes(id), [savedTools]);
  const isPromptSaved = useCallback((id: string) => savedPrompts.includes(id), [savedPrompts]);

  const addRecentlyViewed = useCallback(async (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((t) => t !== id);
      return [id, ...filtered].slice(0, 8);
    });

    if (user?.id) {
      try {
        await supabase
          .from('user_recently_viewed')
          .insert([{ user_id: user.id, tool_id: id, viewed_at: new Date().toISOString() }]);

        queryClient.invalidateQueries({ queryKey: ['recentlyViewed', user.id] });
      } catch (error) {
        console.error('Error adding to recently viewed:', error);
      }
    }
  }, [user?.id]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <AppContext.Provider value={{
      isAdminUser: shouldBeAdminUser, isLoggedIn, user, savedTools, savedPrompts, recentlyViewed, darkMode, isAuthModalOpen, authModalTab,
      toggleSavedTool, isToolSaved, toggleSavedPrompt, isPromptSaved,
      addRecentlyViewed, toggleDarkMode, requireAuth, setAuthModalOpen, setAuthModalTab,
      login, register, loginWithGoogle, logout, updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
