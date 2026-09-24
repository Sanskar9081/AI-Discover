import { Wrench, Clock, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUpdateSettings } from "@/api/mutations";

export function Maintenance() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const updateSettingsMutation = useUpdateSettings();

  const handleDisableMaintenance = async () => {
    // Simple password check (in production, this would be more secure)
    if (adminPassword.trim() === "admin123") {
      try {
        await updateSettingsMutation.mutateAsync([
          { key: 'maintenance_mode', value: 'false' }
        ]);
        setAdminPassword("");
        setShowAdminPanel(false);
        // Refresh page to show live site
        window.location.reload();
      } catch (error) {
        console.error('Error disabling maintenance:', error);
        alert('Error disabling maintenance mode');
      }
    } else {
      alert('Invalid password');
      setAdminPassword("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Icon */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl"></div>
            <div className="relative bg-accent/10 rounded-full p-6 border border-accent/20">
              <Wrench className="h-12 w-12 text-accent animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Under Maintenance
          </h1>
          <p className="text-muted-foreground">
            We're upgrading the site to serve you better
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border/60 shadow-lg p-8 mb-8"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-accent mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">Expected Return</p>
                <p className="text-muted-foreground">We'll be back online shortly</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-accent mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">What's Happening?</p>
                <p className="text-muted-foreground">Deploying exciting new features and improvements</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-8">
          <div className="h-2 w-2 rounded-full bg-accent/40 animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-accent/60 animate-bounce animation-delay-100"></div>
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce animation-delay-200"></div>
        </motion.div>

        {/* Footer Text */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-muted-foreground">
            We appreciate your patience. Follow us for updates.
          </p>
        </motion.div>

        {/* Admin Panel Toggle - Hidden until clicked */}
        <motion.div variants={itemVariants} className="mt-8">
          {!showAdminPanel && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="w-full py-2 text-xs text-muted-foreground hover:text-accent transition-colors rounded opacity-40 hover:opacity-100"
              title="Admin access"
            >
              <Lock className="h-3 w-3 inline mr-1" /> Admin
            </button>
          )}

          {showAdminPanel && (
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 space-y-3">
              <p className="text-xs font-medium text-foreground">Disable Maintenance Mode</p>
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDisableMaintenance()}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/40 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-background text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableMaintenance}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Disable
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes bounce-delayed {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
