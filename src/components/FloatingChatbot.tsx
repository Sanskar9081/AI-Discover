import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Assistant from "@/pages/Assistant";

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] sm:w-[420px] h-[520px] rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/50">
              <span className="text-sm font-semibold text-foreground">AI Assistant</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100%-48px)] overflow-hidden">
              <Assistant embedded />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 h-14 w-14 rounded-full btn-gradient shadow-glow flex items-center justify-center text-accent-foreground hover:shadow-[0_0_50px_-10px_hsla(263.4,70%,50.4%,0.5)] transition-shadow"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </motion.button>
    </>
  );
}
