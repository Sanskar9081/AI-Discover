import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { useTools } from "@/hooks/useQueries";
import { createSystemPrompt, callGroq, extractToolNames } from "@/lib/groq";
import type { AITool } from "@/data/tools";

interface Message {
  role: "user" | "assistant";
  content: string;
  tools?: AITool[];
  isLoading?: boolean;
}

function findRelevantTools(query: string, tools: AITool[]): AITool[] {
  const q = query.toLowerCase();
  return tools.filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.mainFunctionality.toLowerCase().includes(q) ||
    t.features.some((f) => f.toLowerCase().includes(q))
  ).slice(0, 4);
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
  } catch (error) {
    console.error("Failed to load messages from localStorage:", error);
  }
  
  // Return default message if nothing in storage
  return [
    {
      role: "assistant",
      content: "Hi! I'm your AI Tools assistant. Ask me anything like \"Best AI tools for video generation\" or \"Suggest tools for writing blogs\". I can recommend, compare, and analyze AI tools for you!",
    },
  ];
};

const Assistant = ({ embedded = false }: AssistantProps) => {
  const { data: tools = [] } = useTools();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromStorage);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const hasInitialQueryProcessed = useRef(false);

  // Reset window scroll on mount and scroll chat container on message change
  useEffect(() => {
    // Reset page scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll the chat container only (not window)
  useEffect(() => {
    if (chatContainerRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  }, [messages]);

  // Auto-submit initial query from URL parameters
  useEffect(() => {
    if (initialQuery && !hasInitialQueryProcessed.current && tools.length > 0) {
      hasInitialQueryProcessed.current = true;
      setInput("");
      handleSend();
    }
  }, [initialQuery, tools.length]);

  const handleNewChat = () => {
    const defaultMessage: Message = {
      role: "assistant",
      content: "Hi! I'm your AI Tools assistant. Ask me anything like \"Best AI tools for video generation\" or \"Suggest tools for writing blogs\". I can recommend, compare, and analyze AI tools for you!",
    };
    setMessages([defaultMessage]);
    setInput("");
    setIsLoading(false);
    // Clear localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultMessage]));
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !initialQuery) return;
    if (isLoading) return;

    const queryToSend = input.trim() || initialQuery;
    if (!queryToSend) return;
    
    const userMsg: Message = { role: "user", content: queryToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let response: Message;

      if (apiKey) {
        // Use Groq API if key is available (FREE and FAST!)
        const systemPrompt = createSystemPrompt(tools);
        const conversationMessages = messages
          .filter(m => !m.isLoading)
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
        
        conversationMessages.push({ role: "user", content: queryToSend });

        const aiResponse = await callGroq(conversationMessages, systemPrompt, apiKey);
        const mentionedTools = extractToolNames(aiResponse, tools);

        response = {
          role: "assistant",
          content: aiResponse,
          tools: mentionedTools.length > 0 ? mentionedTools : undefined,
        };
      } else {
        // Fallback to local search-based logic
        const relevantTools = findRelevantTools(queryToSend, tools);

        if (relevantTools.length > 0) {
          response = {
            role: "assistant",
            content: `I found ${relevantTools.length} AI tool${relevantTools.length > 1 ? "s" : ""} related to "${queryToSend}". Here are my recommendations:`,
            tools: relevantTools,
          };
        } else if (
          queryToSend.toLowerCase().includes("writing") ||
          queryToSend.toLowerCase().includes("blog") ||
          queryToSend.toLowerCase().includes("content")
        ) {
          const writingTools = tools.filter((t) => ["chat", "productivity"].includes(t.category));
          response = {
            role: "assistant",
            content: "For writing and content creation, I recommend these AI tools:",
            tools: writingTools.slice(0, 4),
          };
        } else {
          response = {
            role: "assistant",
            content: "I couldn't find specific tools matching your query. Try searching for categories like 'video', 'coding', 'image', 'audio', or 'chat'.",
          };
        }
      }

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMsg: Message = {
        role: "assistant",
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}` 
          : "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatContent = (
    <div className={`bg-card ${embedded ? "h-full flex flex-col" : "rounded-2xl border border-border/60 card-shadow"} overflow-hidden`}>
      <div ref={chatContainerRef} className={`${embedded ? "flex-1" : "h-[430px]"} overflow-y-auto p-4 sm:p-6 space-y-6`}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                {msg.isLoading ? (
                  <Loader className="h-4 w-4 text-accent-foreground animate-spin" />
                ) : (
                  <Bot className="h-4 w-4 text-accent-foreground" strokeWidth={1.5} />
                )}
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Thinking...
                  </span>
                ) : (
                  msg.content
                )}
              </div>
              {msg.tools && !embedded && !msg.isLoading && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {msg.tools.map((tool, j) => (
                    <ToolCard key={tool.id} tool={tool} index={j} />
                  ))}
                </div>
              )}
              {msg.tools && embedded && !msg.isLoading && (
                <div className="mt-2 space-y-1.5">
                  {msg.tools.map((tool) => (
                    <div key={tool.id} className="text-xs text-accent font-medium">• {tool.name}</div>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-foreground" strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3 sm:p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about AI tools..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </form>
      </div>
    </div>
  );

  if (embedded) return chatContent;

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">AI Assistant</h1>
            <p className="mt-2 text-body text-muted-foreground">Ask me to recommend AI tools for your needs.</p>
          </div>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            New Chat
          </button>
        </motion.div>
        <div className="mt-8">{chatContent}</div>
      </div>
    </div>
  );
};

export default Assistant;
