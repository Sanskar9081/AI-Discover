import { motion } from "framer-motion";
import { ExternalLink, Megaphone } from "lucide-react";
import type { Ad } from "@/data/tools";

interface AdCardProps {
  ad: Ad;
  index?: number;
}

export function AdCard({ ad, index = 0 }: AdCardProps) {
  return (
    <motion.a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0, 0, 1] as const }}
      whileHover={{ y: -12 }}
      className="group relative rounded-2xl border border-accent/20 bg-gradient-to-br from-card via-card/90 to-card/60 p-5 shadow-lg hover:shadow-premium transition-all duration-300 hover:border-accent/40 overflow-hidden block"
    >
      {/* Premium gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0" />
      
      {/* Animated glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

      <div className="relative z-10">
        <div className="absolute top-4 right-4 z-10">
          <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold bg-gradient-to-r from-accent/20 to-accent/10 text-accent ring-1 ring-accent/40 shadow-md hover:shadow-lg transition-all duration-200">
            <Megaphone className="h-3.5 w-3.5" /> Sponsored
          </motion.span>
        </div>

        {ad.type === "video" && ad.video ? (
          <video
            src={ad.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-40 object-cover rounded-2xl mb-5 transition-transform duration-500 group-hover:scale-110"
          />
        ) : ad.image ? (
          <img
            src={ad.image}
            alt={ad.name}
            className="w-full h-40 object-cover rounded-2xl mb-5 transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}

        <h3 className="text-[16px] font-bold text-foreground leading-snug">{ad.name}</h3>
        <p className="mt-2 text-[13px] text-muted-foreground/85 line-clamp-2 font-medium">{ad.description}</p>

        <motion.div whileHover={{ x: 2 }} className="mt-5 flex items-center gap-2 text-[13px] font-bold text-accent hover:text-accent/80 transition-colors">
          Learn more <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </motion.div>
      </div>
    </motion.a>
  );
}
