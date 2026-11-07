import React from 'react';
import { motion } from 'motion/react';
import { Wifi, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

interface CardGraphicProps {
  cardNumber: string;
  cardHolderName?: string;
  expiryDate?: string;
  accountType?: string;
  isBlocked?: boolean;
  isExpired?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CardGraphic: React.FC<CardGraphicProps> = ({
  cardNumber,
  cardHolderName = 'VALUED CUSTOMER',
  expiryDate = '12/28',
  accountType = 'Savings Account',
  isBlocked = false,
  isExpired = false,
  interactive = false,
  onClick,
  className = '',
}) => {
  // Format card number with spaces (e.g. CARD 1001 or **** **** 1001)
  const formatCardNumber = (num: string) => {
    if (num.startsWith('CARD')) {
      return `CARD •••• •••• ${num.replace('CARD', '')}`;
    }
    return num;
  };

  const getStatusBadge = () => {
    if (isBlocked) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <ShieldAlert className="w-3.5 h-3.5" /> BLOCKED
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Clock className="w-3.5 h-3.5" /> EXPIRED
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
        <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE
      </span>
    );
  };

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.03, rotateY: 5, y: -4 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative w-80 h-48 sm:w-96 sm:h-56 rounded-2xl p-6 text-white overflow-hidden shadow-2xl border border-white/10 select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${
        isBlocked
          ? 'bg-gradient-to-br from-slate-900 via-rose-950/50 to-slate-900 shadow-rose-900/20'
          : isExpired
          ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 shadow-amber-900/20'
          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 shadow-blue-900/30'
      } ${className}`}
    >
      {/* Background Holographic Glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Top Row: Bank Brand + Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-xs shadow-md">
            APEX
          </div>
          <div>
            <p className="text-xs tracking-widest font-black uppercase text-blue-200">APEX BANK</p>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">PLATINUM TOUCH</p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Chip and Contactless Waves */}
      <div className="relative z-10 mt-4 flex items-center gap-3">
        {/* EMV Chip */}
        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-500 border border-amber-600/50 shadow-inner flex flex-col justify-between p-1">
          <div className="w-full h-0.5 bg-amber-700/30 rounded" />
          <div className="w-full h-0.5 bg-amber-700/30 rounded" />
          <div className="w-full h-0.5 bg-amber-700/30 rounded" />
        </div>
        <Wifi className="w-5 h-5 text-slate-300 rotate-90 opacity-80" />
      </div>

      {/* Card Number */}
      <div className="relative z-10 mt-3 sm:mt-4">
        <p className="font-mono text-base sm:text-lg tracking-widest text-slate-100 font-bold drop-shadow">
          {formatCardNumber(cardNumber)}
        </p>
      </div>

      {/* Bottom Info: Holder + Expiry */}
      <div className="relative z-10 mt-3 sm:mt-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Cardholder</p>
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200 truncate max-w-[180px]">
            {cardHolderName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Expires</p>
          <p className="text-xs sm:text-sm font-mono font-semibold tracking-wide text-slate-200">
            {expiryDate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-semibold">{accountType}</p>
          <div className="flex -space-x-2 justify-end mt-0.5">
            <div className="w-5 h-5 rounded-full bg-rose-500/80" />
            <div className="w-5 h-5 rounded-full bg-amber-400/80" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

