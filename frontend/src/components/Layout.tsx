import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Editorial Header */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${
          scrolled ? "bg-background border-b border-border" : "bg-background"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="font-bold text-[22px] tracking-normal text-foreground">AI-Discover</span>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[13px] font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-transparent border-b border-border/60 pb-1 w-48 focus-within:border-foreground transition-colors cursor-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60" />
            </div>
            
            <button
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded hover:bg-secondary text-foreground transition-colors duration-200"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border mt-3">
              <ProfileDropdown />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Editorial Footer */}
      <footer className="bg-[#11110F] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Logo & Description */}
            <div className="md:col-span-12 lg:col-span-4 pr-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-sans text-3xl tracking-normal">AI-Discover</span>
              </div>
              <p className="text-[15px] text-white/60 leading-relaxed mb-8 max-w-sm">
                The curated directory of AI tools, prompts and resources for modern work.
              </p>
              <div className="flex items-center gap-5 text-white/50">
                <a href="#" className="hover:text-white transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-white/50 mb-6 uppercase">Product</h4>
              <div className="space-y-4">
                {[
                  { label: "Tools", path: "/tools" },
                  { label: "Prompts", path: "/prompts" },
                  { label: "Categories", path: "/tools" },
                  { label: "Compare", path: "/compare" },
                  { label: "AI Assistant", path: "/assistant" },
                ].map((item) => (
                  <div key={item.path}>
                    <Link to={item.path} className="text-[13px] text-white/80 hover:text-white transition-colors duration-200">
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-white/50 mb-6 uppercase">Company</h4>
              <div className="space-y-4">
                {[
                  { id: "about", label: "About", path: "/about" },
                  { id: "contact-us", label: "Contact", path: "/contact-us" },
                  { id: "advertise", label: "Advertise", path: "/contact" },
                  { id: "changelog", label: "Changelog", path: "/" },
                ].map((item) => (
                  <div key={item.id}>
                    <Link to={item.path} className="text-[13px] text-white/80 hover:text-white transition-colors duration-200">
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-white/50 mb-6 uppercase">Legal</h4>
              <div className="space-y-4">
                {[
                  { id: "privacy", label: "Privacy Policy", path: "/legal" },
                  { id: "terms", label: "Terms of Service", path: "/legal" },
                ].map((item) => (
                  <div key={item.id}>
                    <Link to={item.path} className="text-[13px] text-white/80 hover:text-white transition-colors duration-200">
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-12 lg:col-span-2">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-white/50 mb-6 uppercase">Newsletter</h4>
              <p className="text-[13px] text-white/70 mb-4">Get the latest tools, prompts and insights.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="you@email.com" 
                  className="w-full bg-[#1A1A18] border border-white/10 rounded-md h-12 pl-4 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                />
                <button className="absolute right-1 top-1 bottom-1 aspect-square bg-[#3A2D28] hover:bg-[#4A3A35] text-white flex items-center justify-center rounded-md transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40">
            <p>© {new Date().getFullYear()} AI-Discover. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white transition-colors">Cookies</a>
               <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatbot />
      <AuthModal />
    </div>
  );
}
