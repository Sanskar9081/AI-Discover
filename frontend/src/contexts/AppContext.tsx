import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { queryClient } from "../lib/queryClient";
import { authAPI } from "../api/auth";
import { savedAPI } from "../api/saved";
import client from "../api/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
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
  register: (profile: any) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedTools, setSavedTools] = useState<string[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const isLoggedIn = !!user;
  const isAdminUser = user?.role === 'admin';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser({ id: userData._id, name: userData.name, email: userData.email, role: userData.role });
        
        // Fetch user data
        try {
          const savedItems = await savedAPI.getSavedItems();
          setSavedTools(savedItems.filter((i: any) => i.itemType === 'tool').map((i: any) => i.tool._id || i.tool));
          setSavedPrompts(savedItems.filter((i: any) => i.itemType === 'prompt').map((i: any) => i.prompt._id || i.prompt));
          
          const recentItems = await client.get('/recently-viewed');
          setRecentlyViewed(recentItems.map((i: any) => i.tool._id || i.tool));
        } catch (e) {
          console.error("Failed to fetch user items", e);
        }
      } catch (e) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const requireAuth = useCallback(() => {
    if (!user) {
      setAuthModalTab("register");
      setAuthModalOpen(true);
      return false;
    }
    return true;
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authAPI.login({ email, password });
      setUser({ id: userData._id, name: userData.name, email: userData.email, role: userData.role });
      setAuthModalOpen(false);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (profile: any) => {
    try {
      const userData = await authAPI.register(profile);
      setUser({ id: userData._id, name: userData.name, email: userData.email, role: userData.role });
      setAuthModalOpen(false);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = async () => {
    console.warn("Google login is disabled during migration.");
  };

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const toggleSavedTool = async (id: string) => {
    if (!user) return;
    try {
      if (savedTools.includes(id)) {
        await savedAPI.deleteSavedItem(id); // Wait, API expects the saved item ID, not tool ID!
      } else {
        await savedAPI.saveItem({ toolId: id, itemType: 'tool' });
      }
      
      setSavedTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
      queryClient.invalidateQueries({ queryKey: ['savedTools', user.id] });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSavedPrompt = async (id: string) => {
    if (!user) return;
    try {
      if (savedPrompts.includes(id)) {
        await savedAPI.deleteSavedItem(id);
      } else {
        await savedAPI.saveItem({ promptId: id, itemType: 'prompt' });
      }
      
      setSavedPrompts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
      queryClient.invalidateQueries({ queryKey: ['savedPrompts', user.id] });
    } catch (error) {
      console.error(error);
    }
  };

  const isToolSaved = useCallback((id: string) => savedTools.includes(id), [savedTools]);
  const isPromptSaved = useCallback((id: string) => savedPrompts.includes(id), [savedPrompts]);

  const addRecentlyViewed = async (id: string) => {
    if (!user) return;
    try {
      await client.post(`/recently-viewed/${id}`);
      queryClient.invalidateQueries({ queryKey: ['recentlyViewed', user.id] });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <AppContext.Provider value={{
      isAdminUser, isLoggedIn, user, savedTools, savedPrompts, recentlyViewed, darkMode, isAuthModalOpen, authModalTab,
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
