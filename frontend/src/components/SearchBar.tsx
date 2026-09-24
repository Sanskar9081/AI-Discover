import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  large?: boolean;
  redirectToAssistant?: boolean;
}

export function SearchBar({ onSearch, placeholder = "Search AI tools...", large = false, redirectToAssistant = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (redirectToAssistant && query.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(query)}`);
    } else {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        animate={focused ? { scale: 1.04 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative flex items-center rounded-2xl bg-gradient-to-br from-card via-card/80 to-card/50 border backdrop-blur-sm transition-all duration-300 group ${
          focused
            ? "border-accent/50 shadow-lg-glow ring-2 ring-accent/30 shadow-premium"
            : "border-border/50 shadow-md hover:shadow-lg hover:border-accent/30"
        } ${large ? "h-16" : "h-11"}`}
      >
        {/* Animated glow border on focus */}
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 via-accent/2 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        )}

        <Search className={`absolute left-5 transition-all duration-300 ${focused ? "text-accent scale-120" : "text-muted-foreground/60"} ${large ? "h-5 w-5" : "h-4 w-4"}`} strokeWidth={2} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`w-full h-full bg-transparent rounded-2xl outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors duration-300 ${
            large ? "pl-14 pr-14 text-[15px] font-medium" : "pl-12 pr-4 text-sm"
          }`}
        />
        {large && (
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2.5 h-12 px-5 rounded-xl bg-gradient-to-r from-accent via-accent/95 to-accent/90 text-accent-foreground font-semibold text-sm flex items-center justify-center hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 active:scale-95 group/btn"
          >
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
          </motion.button>
        )}
      </motion.div>
    </form>
  );
}
