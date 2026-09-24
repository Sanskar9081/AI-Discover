import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { useTools } from "@/hooks/useQueries";
import type { Tool } from "@/data/tools";

const Compare = () => {
  const { data: tools = [] } = useTools();
  const [selected, setSelected] = useState<Tool[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addTool = (tool: Tool) => {
    if (selected.length < 5 && !selected.find((s) => s.id === tool.id)) {
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
    { label: "Overview", key: "description" as const },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen pt-12 pb-24 px-6 lg:px-20">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 pb-12 border-b border-border">
           <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Evaluate</h2>
           <h1 className="font-sans text-5xl lg:text-[64px] leading-[1.05] text-foreground">
             Compare Tools
           </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-16">
          {selected.map((tool) => (
            <div key={tool.id} className="flex items-center gap-3 px-4 py-2 border border-border bg-background">
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{tool.name}</span>
              <button onClick={() => removeTool(tool.id)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selected.length < 5 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-border/50 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add tool
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-20 w-64 bg-card border border-border shadow-md max-h-64 overflow-y-auto py-2">
                  {available.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => addTool(tool)}
                      className="w-full text-left px-4 py-2 text-[12px] font-bold text-foreground hover:bg-secondary transition-colors"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {selected.length >= 1 ? (
          <div className="overflow-x-auto pb-8">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-background z-10 border-b border-border">
                <tr>
                  <th className="text-left p-6 text-[10px] font-bold tracking-widest uppercase text-muted-foreground w-1/5">Feature</th>
                  {selected.map((tool) => (
                    <th key={tool.id} className="p-6 text-left w-1/5 border-l border-border/50">
                      <div className="flex flex-col gap-4">
                        <div className="h-12 w-12 border border-border bg-background flex items-center justify-center p-2 shrink-0">
                          <img src={tool.logo} alt={tool.name} className="h-full w-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=f1f5f9&color=475569&bold=true&size=40`; }}
                          />
                        </div>
                        <span className="text-[15px] font-bold text-foreground">{tool.name}</span>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: 4 - selected.length }).map((_, i) => (
                    <th key={i} className="p-6 w-1/5 border-l border-border/50"></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-border">
                    <td className="p-6 align-top text-[12px] font-bold text-foreground">{row.label}</td>
                    {selected.map((tool) => (
                      <td key={tool.id} className="p-6 align-top text-[14px] text-muted-foreground border-l border-border/50">
                        {tool[row.key]}
                      </td>
                    ))}
                    {Array.from({ length: 4 - selected.length }).map((_, i) => (
                      <td key={i} className="p-6 align-top border-l border-border/50"></td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-border">
                    <td className="p-6 align-top text-[12px] font-bold text-foreground">Tags</td>
                    {selected.map((tool) => (
                      <td key={tool.id} className="p-6 align-top border-l border-border/50">
                        <div className="flex flex-wrap gap-2">
                           {tool.tags?.map(t => <span key={t} className="px-2 py-1 bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t}</span>)}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 4 - selected.length }).map((_, i) => (
                      <td key={i} className="p-6 align-top border-l border-border/50"></td>
                    ))}
                </tr>
                <tr className="border-b border-border">
                    <td className="p-6 align-top text-[12px] font-bold text-foreground">Key Features</td>
                    {selected.map((tool) => (
                      <td key={tool.id} className="p-6 align-top border-l border-border/50">
                        <ul className="flex flex-col gap-3">
                           {tool.features?.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                                <Check className="h-3 w-3 text-foreground mt-1 flex-shrink-0" />
                                <span>{f}</span>
                              </li>
                           ))}
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: 4 - selected.length }).map((_, i) => (
                      <td key={i} className="p-6 align-top border-l border-border/50"></td>
                    ))}
                </tr>
                <tr>
                    <td className="p-6"></td>
                    {selected.map((tool) => (
                      <td key={tool.id} className="p-6 border-l border-border/50">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-block border border-border bg-background px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors text-foreground">
                           Visit Website
                        </a>
                      </td>
                    ))}
                    {Array.from({ length: 4 - selected.length }).map((_, i) => (
                      <td key={i} className="p-6 border-l border-border/50"></td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center border-t border-border">
            <h3 className="font-sans text-3xl mb-4 text-foreground">No tools selected</h3>
            <p className="text-[13px] text-muted-foreground">Select at least one tool to view the comparison table.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
