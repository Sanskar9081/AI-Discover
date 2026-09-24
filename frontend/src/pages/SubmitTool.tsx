import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { categories } from "@/data/tools";
import { useCreateTool } from "@/api/mutations";

const SubmitTool = () => {
  console.log('🔧 SubmitTool component mounted');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createToolMutation = useCreateTool();
  const [form, setForm] = useState({
    name: "", url: "", logo: "", category: "chat", pricing: "Free", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📋 Form submitted! Fields:', { name: form.name, url: form.url, description: form.description });
    
    if (!form.name.trim() || !form.url.trim()) {
      console.warn('⚠️ Form validation failed - missing Name or URL');
      alert('Please fill in Tool Name and Website URL');
      return;
    }
    
    setIsLoading(true);
    try {
      const toolData = {
        name: form.name,
        description: form.description,
        url: form.url,
        logo: form.logo,
        category: form.category,
        pricing: form.pricing as "Free" | "Freemium" | "Paid",
        featured: false,
        trending: false,
        status: 'pending', // User submissions go to pending
      } as any;
      
      console.log('📤 Submitting tool with data:', toolData);
      console.log('📤 Mutation object:', createToolMutation);
      const result = await createToolMutation.mutateAsync(toolData);
      console.log('✅ Tool submitted successfully! Result:', result);
      setSubmitted(true);
    } catch (error: any) {
      console.error('❌ Error submitting tool - Full error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      alert(`Error submitting tool: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Tool Submitted!</h1>
          <p className="mt-3 text-muted-foreground">Thank you for submitting <strong className="text-foreground">{form.name}</strong>. We'll review it and add it to our directory soon.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: "", url: "", logo: "", category: "chat", pricing: "Free", description: "" }); }}
            className="mt-8 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 focus:ring-2 focus:ring-accent/20 transition-all";

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Submit Your AI Tool</h1>
          <p className="mt-2 text-body text-muted-foreground">Share an AI tool with the community.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-8 bg-card rounded-2xl border border-border/60 card-shadow p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tool Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. ChatGPT" className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Website URL *</label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com" className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Logo URL</label>
            <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://example.com/logo.png" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Pricing</label>
              <select value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} className={inputClass}>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the tool..." rows={4} className={`${inputClass} resize-none`} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" strokeWidth={1.5} /> {isLoading ? 'Submitting...' : 'Submit Tool'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default SubmitTool;
