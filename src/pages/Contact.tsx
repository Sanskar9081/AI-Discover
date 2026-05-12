import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bug, Megaphone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

type TabType = "bug" | "ad";

export default function Contact() {
  const location = useLocation();
  const toolName = (location.state as any)?.tool;
  const [activeTab, setActiveTab] = useState<TabType>("bug");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Bug report form states
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    page_feature: toolName || "",
    severity: "medium",
    user_email: "",
  });

  // Ad request form states
  const [adData, setAdData] = useState({
    business_name: "",
    website: "",
    description: "",
    budget: "contact for pricing",
    contact_email: "",
  });

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("bug_reports")
        .insert([bugData]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setBugData({
        title: "",
        description: "",
        page_feature: "",
        severity: "medium",
        user_email: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit bug report");
      console.error("Bug submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("ad_requests")
        .insert([adData]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setAdData({
        business_name: "",
        website: "",
        description: "",
        budget: "contact for pricing",
        contact_email: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ad request");
      console.error("Ad submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a bug to report? Want to advertise with us? Let us know!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border/50">
          <button
            onClick={() => {
              setActiveTab("bug");
              setSubmitted(false);
              setError("");
            }}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === "bug"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bug className="h-4 w-4" /><span>Report Bug</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("ad");
              setSubmitted(false);
              setError("");
            }}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === "ad"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="h-4 w-4" /><span>Request Advertisement</span>
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
          >
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">
              {activeTab === "bug"
                ? "Bug report submitted successfully! Thank you for helping us improve."
                : "Ad request submitted! We'll review it and contact you soon."}
            </span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{error}</span>
          </motion.div>
        )}

        {/* Forms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-8"
        >
          {activeTab === "bug" ? (
            <form onSubmit={handleBugSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bug Title *
                </label>
                <Input
                  required
                  placeholder="e.g., Search button not responding"
                  value={bugData.title}
                  onChange={(e) =>
                    setBugData({ ...bugData, title: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <Textarea
                  required
                  placeholder="Describe what happened, what you expected to happen, and how to reproduce it..."
                  value={bugData.description}
                  onChange={(e) =>
                    setBugData({ ...bugData, description: e.target.value })
                  }
                  disabled={loading}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Page or Feature *
                  </label>
                  <Input
                    required
                    placeholder="e.g., Tools page, Search feature"
                    value={bugData.page_feature}
                    onChange={(e) =>
                      setBugData({ ...bugData, page_feature: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Severity Level
                  </label>
                  <Select
                    value={bugData.severity}
                    onValueChange={(value) =>
                      setBugData({ ...bugData, severity: value })
                    }
                  >
                    <SelectTrigger disabled={loading}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Email *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={bugData.user_email}
                  onChange={(e) =>
                    setBugData({ ...bugData, user_email: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Bug Report"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAdSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name *
                </label>
                <Input
                  required
                  placeholder="Your company name"
                  value={adData.business_name}
                  onChange={(e) =>
                    setAdData({ ...adData, business_name: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Website URL *
                </label>
                <Input
                  required
                  type="url"
                  placeholder="https://your-website.com"
                  value={adData.website}
                  onChange={(e) =>
                    setAdData({ ...adData, website: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <Textarea
                  required
                  placeholder="Tell us about your product/service and why it would be a good fit for AIDiscover..."
                  value={adData.description}
                  onChange={(e) =>
                    setAdData({ ...adData, description: e.target.value })
                  }
                  disabled={loading}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget
                  </label>
                  <Input
                    placeholder="e.g., $500-$1000/month"
                    value={adData.budget}
                    onChange={(e) =>
                      setAdData({ ...adData, budget: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="your@business.com"
                    value={adData.contact_email}
                    onChange={(e) =>
                      setAdData({ ...adData, contact_email: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Ad Request"}
              </Button>
            </form>
          )}
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Direct Email</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Prefer to email us directly?
            </p>
            <a
              href="mailto:contact@aidiscover.app"
              className="text-accent hover:underline font-medium"
            >
              contact@aidiscover.app
            </a>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Response Time</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              We typically respond to bug reports and ad requests within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
