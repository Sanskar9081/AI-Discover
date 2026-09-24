import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/tools";
import { useCreateTool } from "@/api/mutations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubmitToolModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubmitToolModal({ open, onClose }: SubmitToolModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createToolMutation = useCreateTool();
  
  const [form, setForm] = useState<{
    name: string;
    url: string;
    logo: string;
    description: string;
    category: string;
    pricing: 'Free' | 'Freemium' | 'Paid' | '';
    freePlan: string;
    easeOfUse: string;
    trending: boolean;
    couponCode: string;
  }>({
    name: '',
    url: '',
    logo: '',
    description: '',
    category: '',
    pricing: '',
    freePlan: '',
    easeOfUse: '',
    trending: false,
    couponCode: '',
  });
  
  const [features, setFeatures] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setForm(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) {
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
        pricing: form.pricing,
        featured: false,
        trending: form.trending,
        status: 'pending',
        features: features.filter(f => f.trim()),
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        couponcode: form.couponCode,
      };
      
      console.log('📤 Submitting tool from modal:', toolData);
      await createToolMutation.mutateAsync(toolData);
      console.log('✅ Tool submitted successfully from modal!');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setForm({
          name: '', url: '', logo: '', description: '', category: '',
          pricing: '' as 'Free' | 'Freemium' | 'Paid' | '', freePlan: '', easeOfUse: '', trending: false, couponCode: '',
        });
        setFeatures([""]);
        setTags("");
        setLogoPreview(null);
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error submitting tool from modal:', error);
      alert(`Error: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => {
    const updated = [...features];
    updated[i] = val;
    setFeatures(updated);
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none border border-accent/15 focus:border-accent/40 focus:ring-2 focus:ring-accent/20 focus:shadow-glow transition-all duration-300 font-medium";

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-accent/15 bg-gradient-to-br from-card via-card/95 to-card/90 p-8 shadow-premium"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Submit an AI Tool</h2>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-all">
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {submitted ? (
              <div className="text-center py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mb-6 ring-1 ring-emerald-500/30">
                  <Check className="h-7 w-7 text-emerald-500" strokeWidth={2} />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Tool Submitted!</h3>
                <p className="mt-3 text-sm text-muted-foreground/80">We'll review and add it shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-3 uppercase">Basic Info</label>
                  <input 
                    placeholder="Tool name" 
                    required 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className={inputClass} 
                  />
                </div>
                <input 
                  placeholder="Website URL" 
                  type="url" 
                  required 
                  value={form.url}
                  onChange={(e) => setForm({...form, url: e.target.value})}
                  className={inputClass} 
                />

                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-3 uppercase">Logo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent/15 to-accent/5 border-2 border-accent/30 cursor-pointer hover:border-accent/50 hover:bg-accent/20 transition-all text-sm font-semibold text-accent/80 hover:text-accent">
                      <Upload className="h-4 w-4" /> Choose file
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    {logoPreview && <img src={logoPreview} alt="Preview" className="h-10 w-10 rounded-xl object-cover border border-accent/20 ring-1 ring-accent/10" />}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-3 uppercase">Details</label>
                  <textarea 
                    placeholder="Description" 
                    required 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className={`${inputClass} min-h-[100px] py-3 resize-none`} 
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-accent/80 tracking-wider uppercase">Features</label>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button" 
                      onClick={addFeature} 
                      className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add feature
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          value={f} 
                          onChange={(e) => updateFeature(i, e.target.value)} 
                          placeholder={`Feature ${i + 1}`} 
                          className={inputClass} 
                        />
                        {features.length > 1 && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button" 
                            onClick={() => removeFeature(i)} 
                            className="p-3 rounded-xl hover:bg-destructive/15 text-muted-foreground/60 hover:text-destructive transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <input 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="Tags (comma separated, e.g. GPT-4, Writing)" 
                  className={inputClass} 
                />

                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-3 uppercase">Metadata</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Select value={form.category} onValueChange={(val) => setForm({...form, category: val})}>
                      <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                        {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={form.pricing} onValueChange={(val: any) => setForm({...form, pricing: val})}>
                      <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                        <SelectValue placeholder="Pricing" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Freemium">Freemium</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={form.freePlan} onValueChange={(val) => setForm({...form, freePlan: val})}>
                      <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                        <SelectValue placeholder="Free Plan?" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={form.easeOfUse} onValueChange={(val) => setForm({...form, easeOfUse: val})}>
                      <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                        <SelectValue placeholder="Ease of Use" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                        <SelectItem value="1">Easy</SelectItem>
                        <SelectItem value="2">Moderate</SelectItem>
                        <SelectItem value="3">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-accent/10 pt-6">
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-4 uppercase">Growth (optional)</label>
                  <input 
                    placeholder="Coupon code (optional)" 
                    value={form.couponCode}
                    onChange={(e) => setForm({...form, couponCode: e.target.value})}
                    className={inputClass} 
                  />
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.trending}
                      onChange={(e) => setForm({...form, trending: e.target.checked})}
                      className="w-5 h-5 rounded-lg border-2 border-accent/30 bg-secondary accent-accent cursor-pointer transition-all" 
                    /> 
                    <span className="text-sm font-semibold text-foreground">Mark as Trending</span>
                  </label>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-accent via-accent to-accent/90 text-accent-foreground text-sm font-bold shadow-lg hover:shadow-premium hover:brightness-110 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100 mt-8"
                >
                  {isLoading ? 'Submitting...' : 'Submit Tool'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
