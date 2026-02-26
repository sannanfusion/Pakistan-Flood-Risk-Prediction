import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function LiveIndicator() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
        <motion.div
          className="w-2 h-2 rounded-full bg-risk-low"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[11px] text-foreground font-mono font-medium">LIVE</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
        {time.toLocaleTimeString('en-US', { hour12: false })} UTC
      </span>
    </div>
  );
}
