import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setName(""); setMobile(""); setShowPassword(false); setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      reset();
    } catch (error: any) {
      setLoading(false);
      alert(error?.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirmPassword) return;
    setLoading(true);
    try {
      await register({ name, email, password, mobile, avatar: undefined });
      reset();
    } catch (error: any) {
      setLoading(false);
      alert(error?.message || 'Registration failed. Please try again.');
    }
  };

  const inputClass = "w-full h-12 px-4 bg-background border border-border text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors rounded-2xl";

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => { setAuthModalOpen(false); reset(); }} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-background border border-border p-8 md:p-12 shadow-2xl"
          >
            <button onClick={() => { setAuthModalOpen(false); reset(); }} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>

            <div className="mb-10">
              <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4">Account</h2>
              <h1 className="font-serif text-4xl leading-[1.05] text-foreground">
                {authModalTab === "login" ? "Welcome Back" : "Create Account"}
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-8">
              <button
                onClick={() => setAuthModalTab("login")}
                className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 ${
                  authModalTab === "login" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthModalTab("register")}
                className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 ${
                  authModalTab === "register" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>

            {authModalTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Mobile (Optional)</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={inputClass}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-[11px] text-red-500">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || password !== confirmPassword}
                  className="w-full h-12 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
