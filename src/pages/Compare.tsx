import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useTools } from "@/hooks/useQueries";
import type { AITool } from "@/data/tools";

const Compare = () => {
  const { data: tools = [] } = useTools();
  const [selected, setSelected] = useState<AITool[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addTool = (tool: AITool) => {
    if (selected.length < 10 && !selected.find((s) => s.id === tool.id)) {
      setSelected([...selected, tool]);
    }
    setDropdownOpen(false);
  };

  const removeTool = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const available = tools.filter((t) => !selected.find((s) => s.id === t.id));

  const rows = [
    { label: "Category", key: "category" as const },
    { label: "Pricing", key: "pricing" as const },
    { label: "Free Plan", key: "freePlan" as const },
    { label: "Main Functionality", key: "mainFunctionality" as const },
    { label: "Ease of Use", key: "easeOfUse" as const },
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Compare AI Tools</h1>
          <p className="mt-2 text-body text-muted-foreground">Select up to 10 tools to compare side by side.</p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          {selected.map((tool) => (
            <div key={tool.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-foreground">
              {tool.name}
              <button onClick={() => removeTool(tool.id)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selected.length < 10 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add tool
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-10 w-64 bg-card border border-border rounded-xl card-shadow max-h-64 overflow-y-auto">
                  {available.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => addTool(tool)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-foreground"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {selected.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-ui-label text-muted-foreground bg-secondary rounded-tl-xl min-w-[160px]">Feature</th>
                  {selected.map((tool) => (
                    <th key={tool.id} className="p-4 text-center bg-secondary last:rounded-tr-xl min-w-[180px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-card p-1.5 border border-border/50 overflow-hidden">
                          <img src={tool.logo} alt={tool.name} className="h-full w-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=f1f5f9&color=475569&bold=true&size=40`; }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{tool.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
                    <td className="p-4 text-sm font-medium text-foreground">{row.label}</td>
                    {selected.map((tool) => (
                      <td key={tool.id} className="p-4 text-center text-sm text-muted-foreground">
                        {row.key === "freePlan" ? (tool.freePlan ? "✓ Yes" : "✗ No") : String(tool[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-card">
                  <td className="p-4 text-sm font-medium text-foreground rounded-bl-xl">Features</td>
                  {selected.map((tool, idx) => (
                    <td key={tool.id} className={`p-4 text-center text-sm text-muted-foreground ${idx === selected.length - 1 ? "rounded-br-xl" : ""}`}>
                      <ul className="space-y-1">
                        {tool.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}

        {selected.length < 2 && (
          <p className="mt-16 text-center text-muted-foreground">Select at least 2 tools to start comparing.</p>
        )}
      </div>
    </div>
  );
};

export default Compare;
