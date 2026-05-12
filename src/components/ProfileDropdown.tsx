import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, BookOpen, Settings, LogOut, Sparkles, ChevronDown, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { isLoggedIn, user, isAdminUser, setAuthModalOpen, setAuthModalTab, logout } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Support both mouse and touch events
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setAuthModalTab("login"); setAuthModalOpen(true); }}
          className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => { setAuthModalTab("register"); setAuthModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Register
        </button>
      </div>
    );
  }

  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const menuItems = [
    { label: "My Profile", icon: User, path: "/profile" },
    { label: "My Contributions", icon: Sparkles, path: "/profile/contributions" },
    { label: "Saved Tools", icon: Heart, path: "/profile/saved" },
    { label: "Saved Prompts", icon: BookOpen, path: "/profile/saved" },
    { label: "Account Settings", icon: Settings, path: "/profile/settings" },
    ...(isAdminUser ? [{ label: "Admin Panel", icon: Shield, path: "/admin" }] : []),
  ];

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors"
        title="My Profile"
      >
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              aria-hidden="true"
            />
            {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 sm:right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border/30">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-[12px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => navigate(item.path), 0);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:bg-secondary/70 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-border/30 py-1">
              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  setOpen(false);
                  logout(); 
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors active:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Logout
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
