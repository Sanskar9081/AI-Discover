import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check } from "lucide-react";
import { useState } from "react";
import { useCreatePrompt } from "@/api/mutations";
import { useCategories, useTools } from "@/hooks/useQueries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubmitPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubmitPromptModal({ open, onClose }: SubmitPromptModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    category: "",
    author: "",
    instagram: "",
    suggestedToolId: "",
  });
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: tools = [] } = useTools();
  const createPromptMutation = useCreatePrompt();

  const handleFile = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.prompt.trim() || !formData.category) {
      alert("Please fill in required fields: title, prompt, and category");
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 Submitting prompt:', { title: formData.title, category: formData.category });
      await createPromptMutation.mutateAsync({
        title: formData.title,
        prompt: formData.prompt,
        category: formData.category,
        author: anonymous ? "Anonymous" : formData.author || "Anonymous",
        instagram: formData.instagram || "",
        beforeImage: beforePreview || "",
        afterImage: afterPreview || "",
        featured: false,
        suggestedToolId: formData.suggestedToolId || "",
        status: "pending",
      });
      
      console.log('✅ Prompt submitted successfully!');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ title: "", prompt: "", category: "", author: "", instagram: "", suggestedToolId: "" });
        setBeforePreview(null);
        setAfterPreview(null);
        setAnonymous(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error submitting prompt:', error);
      alert(`Error submitting prompt: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
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
              <h2 className="text-xl font-bold tracking-tight text-foreground">Submit a Prompt</h2>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-all">
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {submitted ? (
              <div className="text-center py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mb-6 ring-1 ring-emerald-500/30">
                  <Check className="h-7 w-7 text-emerald-500" strokeWidth={2} />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Prompt Submitted!</h3>
                <p className="mt-3 text-sm text-muted-foreground/80">Thank you for your contribution.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-2 uppercase">Prompt Details</label>
                  <input
                    placeholder="Prompt title *"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <textarea
                  placeholder="Your prompt text... *"
                  required
                  rows={4}
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  className={`${inputClass} min-h-[120px] py-3 resize-none`}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                      <SelectValue placeholder="Select category *" />
                    </SelectTrigger>
                    <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={formData.suggestedToolId} onValueChange={(val) => setFormData({ ...formData, suggestedToolId: val })}>
                    <SelectTrigger className="rounded-xl bg-secondary/50 border border-accent/15 text-foreground outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20">
                      <SelectValue placeholder="Suggested tool (opt.)" />
                    </SelectTrigger>
                    <SelectContent className="z-[200] rounded-xl border border-accent/15 bg-card shadow-lg">
                      {tools.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-accent/80 tracking-wider mb-3 uppercase">Images</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-dashed border-accent/30 cursor-pointer hover:border-accent/50 hover:bg-accent/15 transition-all duration-300">
                        {beforePreview ? (
                          <img src={beforePreview} alt="Before" className="h-20 w-full object-cover rounded-lg ring-1 ring-accent/20" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-accent/60" />
                            <span className="text-[11px] font-semibold text-muted-foreground/70">Before</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleFile(setBeforePreview)} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-dashed border-accent/30 cursor-pointer hover:border-accent/50 hover:bg-accent/15 transition-all duration-300">
                        {afterPreview ? (
                          <img src={afterPreview} alt="After" className="h-20 w-full object-cover rounded-lg ring-1 ring-accent/20" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-accent/60" />
                            <span className="text-[11px] font-semibold text-muted-foreground/70">After</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleFile(setAfterPreview)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-accent/10 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={anonymous} 
                      onChange={(e) => setAnonymous(e.target.checked)} 
                      className="w-5 h-5 rounded-lg border-2 border-accent/30 bg-secondary accent-accent cursor-pointer transition-all" 
                    />
                    <span className="text-sm font-semibold text-foreground">Submit anonymously</span>
                  </label>
                  {!anonymous && (
                    <div className="mt-6 space-y-4">
                      <p className="text-xs font-bold text-accent/80 tracking-wider uppercase">Your Info</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="Your name"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className={inputClass}
                        />
                        <input
                          placeholder="Instagram"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl bg-secondary/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-accent via-accent to-accent/90 text-accent-foreground text-sm font-bold shadow-lg hover:shadow-premium hover:brightness-110 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Prompt'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
