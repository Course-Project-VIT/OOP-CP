import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  className = '',
  prefix = '₹',
  suffix = '',
  decimals = 2,
}) => {
  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={`inline-block font-mono tracking-tight ${className}`}>{display}</motion.span>;
};
