import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CARDS } from '../utils/demoCards';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertCircle, CreditCard, Sparkles } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const [manualCardNumber, setManualCardNumber] = useState<string>('');
  const [selectedDemoCard, setSelectedDemoCard] = useState<string | null>(null);
  const { checkCard, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleCardSubmit = async (cardNumberToTest: string) => {
    clearError();
    const cardNum = cardNumberToTest.trim().toUpperCase();
    if (!cardNum) return;

    const success = await checkCard(cardNum);
    if (success) {
      navigate('/pin');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* ATM Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Touchscreen Banking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-blue-300 font-display tracking-tight">
          WELCOME TO APEX ATM
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Please insert your ATM card or select one of the classroom demo cards below to begin.
        </p>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full max-w-md mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/40"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-bold">Card Acceptance Error</p>
              <p className="text-xs text-rose-200/90 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Input or Card Insertion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md mb-8"
      >
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Enter Card Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCardNumber}
              onChange={(e) => setManualCardNumber(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCardSubmit(manualCardNumber);
              }}
              placeholder="e.g. CARD1001"
              maxLength={12}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 font-mono text-base tracking-wider uppercase placeholder:text-slate-600 transition-all outline-none"
            />
            <CreditCard className="absolute right-3 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>

          <Button
            variant="accent"
            size="md"
            isLoading={isLoading}
            onClick={() => handleCardSubmit(manualCardNumber)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Insert
          </Button>
        </div>
      </motion.div>

      {/* Demo Cards Quick Rack */}
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Classroom Demo Cards (Click to Test)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Real Java Backend Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_CARDS.map((card) => {
            const isSelected = selectedDemoCard === card.cardNumber;
            return (
              <motion.div
                key={card.cardNumber}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDemoCard(card.cardNumber);
                  setManualCardNumber(card.cardNumber);
                  handleCardSubmit(card.cardNumber);
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-cyan-300">{card.cardNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      card.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : card.status === 'expired'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>

                <p className="font-semibold text-slate-200 text-sm truncate">{card.holder}</p>
                <p className="text-xs text-slate-400 mt-0.5">{card.accountType}</p>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>PIN: <strong className="text-slate-200">{card.pin}</strong></span>
                  <span>Bal: <strong className="text-slate-200">₹{card.balance}</strong></span>
                </div>

                <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {card.notes}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
