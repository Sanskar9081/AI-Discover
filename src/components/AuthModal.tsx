import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Mail, User, Phone, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register, loginWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const reset = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setName(""); setMobile(""); setShowPassword(false); setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { login(email, password); reset(); }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirmPassword) return;
    setLoading(true);
    setTimeout(() => { register({ name, email, mobile, avatar: undefined }); reset(); }, 600);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      setAuthModalOpen(false);
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass = "w-full h-11 pl-10 pr-4 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40 transition-colors";

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => { setAuthModalOpen(false); reset(); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
          >
            <button onClick={() => { setAuthModalOpen(false); reset(); }} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 rounded-xl btn-gradient flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {authModalTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {authModalTab === "login"
                  ? "Sign in to access your saved tools and prompts."
                  : "Create an account to save tools and access them from any device 🚀"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-secondary mb-6">
              <button
                onClick={() => setAuthModalTab("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authModalTab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthModalTab("register")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authModalTab === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Register
              </button>
            </div>

            {authModalTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={`${inputClass} pr-10`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full h-11 rounded-xl border border-border/60 bg-background hover:bg-secondary text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Chrome className="h-4 w-4" />
                  {googleLoading ? "Signing in..." : "Sign in with Google"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className={inputClass} required />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" className={inputClass} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={`${inputClass} pr-10`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={inputClass} required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Creating account..." : "Create Account"}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full h-11 rounded-xl border border-border/60 bg-background hover:bg-secondary text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Chrome className="h-4 w-4" />
                  {googleLoading ? "Signing up..." : "Sign up with Google"}
                </button>
              </form>
            )}

            <button
              onClick={() => { setAuthModalOpen(false); reset(); }}
              className="w-full mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue as guest
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
