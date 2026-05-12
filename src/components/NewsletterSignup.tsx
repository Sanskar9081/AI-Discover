import { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/emailService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "bi-weekly" | "monthly">("weekly");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");
    
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .upsert(
          {
            email,
            frequency,
            is_active: true,
          },
          { onConflict: "email" }
        );

      if (error) {
        if (error.message.includes("duplicate")) {
          setStatus("success");
          setMessage("You're already subscribed! 📧");
        } else {
          throw error;
        }
      } else {
        // Send welcome email (fails gracefully if backend not available)
        try {
          await sendWelcomeEmail(email, frequency);
          console.log("✅ Welcome email sent to", email);
        } catch (emailErr) {
          console.warn("⚠️ Welcome email failed (backend not configured):", emailErr);
        }
        
        setStatus("success");
        setMessage("Subscribed! Check your email for confirmation.");
        setEmail("");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
      setMessage("Failed to subscribe. Try again later.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-3xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-8 w-8 text-accent" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground mb-2">Stay ahead of AI</h2>
        <p className="text-muted-foreground mb-8">
          Get weekly curated picks, trending tools, and the best prompts delivered to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-accent/20 text-foreground placeholder-muted-foreground outline-none focus:border-accent/40 transition-colors disabled:opacity-50"
          />
          <Select value={frequency} onValueChange={(val: any) => setFrequency(val)} disabled={status === "loading"}>
            <SelectTrigger className="w-full sm:w-40 px-4 py-3 rounded-xl bg-background/50 border border-accent/20 text-foreground outline-none focus:border-accent/40 transition-colors disabled:opacity-50">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-accent/20 bg-background shadow-lg">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 rounded-xl bg-white text-accent font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center justify-center gap-2 text-green-500 text-sm">
            <Check className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          ✓ No spam, unsubscribe anytime • Respects your inbox preferences
        </p>
      </div>
    </section>
  );
};
