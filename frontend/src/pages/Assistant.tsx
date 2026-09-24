import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { useTools } from "@/hooks/useQueries";
import { assistantAPI } from "@/api/assistant";
import type { Tool } from "@/data/tools";

interface Message {
  role: "user" | "assistant";
  content: string;
  tools?: Tool[];
  isLoading?: boolean;
}

function findRelevantTools(query: string, tools: Tool[]): Tool[] {
  const q = query.toLowerCase();
  return tools.filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
  ).slice(0, 3);
}

interface AssistantProps {
  embedded?: boolean;
}

const STORAGE_KEY = "ai-assistant-messages";

const loadMessagesFromStorage = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {}
  return [];
};

const Assistant = ({ embedded = false }: AssistantProps) => {
  const { data: tools = [] } = useTools();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromStorage);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialQueryProcessed = useRef(false);

  useEffect(() => {
    if (!embedded) window.scrollTo(0, 0);
  }, [embedded]);

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {}
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !hasInitialQueryProcessed.current && tools.length > 0) {
      hasInitialQueryProcessed.current = true;
      setInput("");
      handleSend(initialQuery);
    }
  }, [initialQuery, tools.length]);

  const handleSend = async (textToSubmit: string = input) => {
    if (!textToSubmit.trim() || isLoading) return;
    const userText = textToSubmit.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await assistantAPI.chat([
        ...newMessages.map((m) => ({ role: m.role, content: m.content })),
      ]);

      const aiText = response.message || response.choices?.[0]?.message?.content || "I couldn't process that request.";
      const relevantTools = response.tools && response.tools.length > 0 ? response.tools : findRelevantTools(userText + " " + aiText, tools);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiText,
          tools: relevantTools,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const containerClass = embedded 
    ? "h-full flex flex-col bg-background" 
    : "min-h-screen bg-background pt-12 pb-24 px-6 lg:px-20";

  return (
    <div className={containerClass}>
      {!embedded && (
        <div className="max-w-[1000px] mx-auto w-full mb-16 border-b border-border pb-12">
           <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Assistant</h2>
           <h1 className="font-sans text-5xl lg:text-[64px] leading-[1.05] text-foreground">
             AI-Discover Assistant
           </h1>
        </div>
      )}

      <div className={`max-w-[1000px] mx-auto w-full flex flex-col ${embedded ? 'h-full' : 'h-[600px] border border-border bg-card shadow-sm'}`}>
        
        {messages.length === 0 && !embedded && (
          <div className="flex-1 flex flex-col justify-center items-center p-12 text-center border-b border-border">
            <h3 className="font-sans text-3xl mb-4 text-foreground">What are you trying to do?</h3>
            <p className="text-[13px] text-muted-foreground max-w-md">Describe your workflow, task, or the problem you're trying to solve. The assistant will recommend the perfect tools for the job.</p>
          </div>
        )}

        {messages.length > 0 && (
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth border-b border-border"
          >
            <div className="space-y-12">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col">
                  {m.role === "user" ? (
                    <div className="max-w-[80%] border-l-2 border-foreground pl-6 py-2 my-6">
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-3">You</p>
                      <div className="text-[18px] text-foreground leading-relaxed font-medium">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[100%] pb-12 mb-8 border-b border-border/50">
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Assistant</p>
                      <div className="prose prose-p:text-muted-foreground prose-p:text-[16px] prose-p:leading-relaxed max-w-none">
                        {m.content}
                      </div>
                      
                      {m.tools && m.tools.length > 0 && (
                        <div className="mt-8 pt-8">
                          <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-6">Recommended Tools</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {m.tools.map((t, idx) => (
                              <ToolCard key={t.id} tool={t} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="self-start">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">Assistant</p>
                  <div className="flex items-center gap-1 h-6">
                    <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-background">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Describe your workflow..."
              className="w-full bg-card border border-border resize-none h-16 pl-4 pr-16 py-5 text-[14px] focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50 rounded-2xl shadow-sm"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-foreground text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          </div>
          {messages.length > 0 && (
            <div className="flex justify-between items-center mt-3">
              <span className="text-[11px] text-muted-foreground">Press Enter to send, Shift+Enter for new line</span>
              <button onClick={clearChat} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Clear Conversation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assistant;
