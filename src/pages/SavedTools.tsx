import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { useTools } from "@/hooks/useQueries";
import { useApp } from "@/contexts/AppContext";

const SavedTools = () => {
  const { savedTools } = useApp();
  const { data: tools = [] } = useTools();
  const saved = tools.filter((t) => savedTools.includes(t.id));

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Saved Tools</h1>
          <p className="mt-2 text-body text-muted-foreground">Your bookmarked AI tools.</p>
        </motion.div>

        {saved.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saved.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground">No saved tools yet. Click the ❤️ on any tool card to save it.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTools;
