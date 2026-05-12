import { useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/emailService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "bi-weekly" | "monthly">("weekly");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Invalid email");
      return;
    }

    setStatus("loading");
    
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .upsert(
          {
            email,
            frequency: frequency,
            is_active: true,
          },
          { onConflict: "email" }
        );

      if (error) {
        if (error.message.includes("duplicate")) {
          setStatus("success");
          setMessage("Already subscribed!");
        } else {
          throw error;
        }
      } else {
        // Send welcome email (fails gracefully if backend not available)
        try {
          await sendWelcomeEmail(email, "weekly");
          console.log("✅ Welcome email sent to", email);
        } catch (emailErr) {
          console.warn("⚠️ Welcome email failed (backend not configured):", emailErr);
        }
        
        setStatus("success");
        setMessage("Subscribed!");
        setEmail("");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
      setMessage("Failed to subscribe");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <div>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 h-9 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 disabled:opacity-50 transition-colors"
        />
        <Select value={frequency} onValueChange={(val: any) => setFrequency(val)} disabled={status === "loading"}>
          <SelectTrigger className="w-full sm:w-32 h-9 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors disabled:opacity-50">
            <SelectValue placeholder="Weekly" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border border-border/60 bg-secondary shadow-lg">
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Join"}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-center gap-1.5 text-green-500 text-xs mt-2">
          <Check className="h-3.5 w-3.5" />
          <span>{message}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};
