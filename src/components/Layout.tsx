import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, Moon, Sun, Facebook, Linkedin, Twitter, Youtube, Instagram } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { AuthModal } from "@/components/AuthModal";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { FooterNewsletter } from "@/components/FooterNewsletter";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Tools", path: "/tools" },
  { label: "Compare", path: "/compare" },
  { label: "Prompts", path: "/prompts" },
  { label: "AI Assistant", path: "/assistant" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 20));
  }, [scrollY]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm" 
            : "bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="h-11 w-11 flex items-center justify-center transition-all duration-300 flex-shrink-0"
            >
              <img src="/logo.svg" alt="AIDiscover Logo" className="h-11 w-11" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter text-foreground group-hover:text-accent transition-colors duration-200">AIDiscover</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 group hover:bg-secondary/60"
              >
                <span className={`relative z-10 transition-all duration-200 ${
                  location.pathname === item.path
                    ? "text-accent"
                    : "text-muted-foreground/80 group-hover:text-foreground"
                }`}>
                  {item.label}
                </span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg ring-1 ring-accent/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-secondary text-muted-foreground/70 hover:text-foreground transition-all duration-200 hover:shadow-md"
            >
              {darkMode ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
            </motion.button>
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-secondary text-foreground transition-all duration-200 hover:shadow-md"
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="lg:hidden border-t border-border/20 bg-gradient-to-b from-background/50 to-background/30 backdrop-blur-md overflow-visible"
            >
              <div className="px-4 py-4 space-y-1 relative z-50">
                {navItems.map((item, i) => (
                  <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-1 ring-accent/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-3 border-t border-border/20 mt-3">
                  <ProfileDropdown />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-border/20 bg-gradient-to-b from-background/80 to-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo & Social Icons */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <motion.div whileHover={{ scale: 1.1 }} className="h-9 w-9 flex items-center justify-center flex-shrink-0">
                  <img src="/logo.svg" alt="AIDiscover Logo" className="h-9 w-9" />
                </motion.div>
                <span className="font-black tracking-tighter text-foreground text-lg">AIDiscover</span>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6 font-medium">
                The index of everything intelligent. Find, compare, and explore the best AI tools for every workflow.
              </p>
              <div className="flex items-center gap-4">
                {[Facebook, Linkedin, Twitter, Youtube, Instagram].map((Icon, i) => (
                  <motion.a 
                    key={i}
                    whileHover={{ scale: 1.15, y: -2 }}
                    href="#" 
                    className="text-muted-foreground/60 hover:text-accent transition-all duration-200 hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-accent/80 mb-5 uppercase">Platform</h4>
              <div className="space-y-3">
                {navItems.map((item) => (
                  <motion.div key={item.path} whileHover={{ x: 4 }}>
                    <Link to={item.path} className="text-sm text-muted-foreground/70 hover:text-foreground hovertransition-all duration-200 font-medium">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-accent/80 mb-5 uppercase">Support</h4>
              <div className="space-y-3">
                {[
                  { id: "about", label: "About Us", path: "/about" },
                  { id: "contact-us", label: "Contact Us", path: "/contact-us" },
                  { id: "report-bug", label: "Report Bug", path: "/contact" },
                  { id: "advertise", label: "Advertise", path: "/contact" },
                  { id: "legal", label: "Legal", path: "/legal" },
                ].map((item) => (
                  <motion.div key={item.id} whileHover={{ x: 4 }}>
                    <Link to={item.path} className="text-sm text-muted-foreground/70 hover:text-foreground transition-all duration-200 font-medium">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-accent/80 mb-5 uppercase">Newsletter</h4>
              <p className="text-sm text-muted-foreground/70 mb-4 font-medium">Get weekly AI tool updates.</p>
              <FooterNewsletter />
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-border/20">
            <p className="text-xs text-muted-foreground/50 font-medium">© {new Date().getFullYear()} AIDiscover. Built for the AI era.</p>
          </div>
        </div>
      </footer>

      <FloatingChatbot />
      <AuthModal />
    </div>
  );
}
