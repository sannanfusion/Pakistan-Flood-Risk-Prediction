import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, duration = 1.5 }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const start = displayed;
    const diff = value - start;
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(start + diff * eased);
      if (step >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-mono text-lg font-bold text-foreground tabular-nums"
    >
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </motion.span>
  );
}
