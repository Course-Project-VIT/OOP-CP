import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CardGraphic } from '../components/atm/CardGraphic';
import { Keypad } from '../components/ui/Keypad';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const PinPage: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const { cardStatus, login, isLoading, error, clearCard, clearError } = useAuth();
  const navigate = useNavigate();

  // If no card is inserted, redirect back to welcome
  if (!cardStatus) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">No card has been inserted yet.</p>
        <button
          onClick={() => navigate('/')}
          className="text-cyan-400 font-bold underline cursor-pointer"
        >
          Return to Card Selection
        </button>
      </div>
    );
  }

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      clearError();
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    clearError();
  };

  const handleClear = () => {
    setPin('');
    clearError();
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) return;

    const success = await login(pin);
    if (success) {
      navigate('/dashboard');
    } else {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setPin('');
    }
  };

  const triggerShake = isShaking
    ? {
        x: [-12, 12, -10, 10, -6, 6, 0],
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
      {/* Left Column: Card Visual & Security Advice */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-sm text-center"
      >
        <CardGraphic
          cardNumber={cardStatus.cardNumber}
          cardHolderName={cardStatus.cardHolderName}
          expiryDate={cardStatus.expiryDate}
          accountType={cardStatus.accountType}
          isBlocked={cardStatus.blocked}
          isExpired={cardStatus.expired}
          className="mb-6"
        />

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-left w-full space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>PIN Security Guidelines</span>
          </div>
          <p>• Never disclose your 4-digit PIN to anyone.</p>
          <p>• 3 consecutive wrong attempts will automatically lock your card.</p>
          <p>• Remaining attempts: <strong className="text-amber-400">{cardStatus.remainingAttempts}</strong></p>
        </div>

        <button
          onClick={() => {
            clearCard();
            navigate('/');
          }}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel & Eject Card
        </button>
      </motion.div>

      {/* Right Column: PIN Dots and Touchscreen Keypad */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-sm"
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-black text-slate-100 font-display">ENTER 4-DIGIT PIN</h2>
          <p className="text-xs text-slate-400 mt-1">Please use the touchscreen numeric keypad below</p>
        </div>

        {/* PIN Indicators with Shake Motion */}
        <motion.div
          animate={triggerShake}
          className="flex items-center justify-center gap-4 my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner w-full"
        >
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={{
                  scale: hasDigit ? [1, 1.3, 1] : 1,
                  backgroundColor: hasDigit ? '#06B6D4' : '#1E293B',
                  borderColor: hasDigit ? '#38BDF8' : '#334155',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  hasDigit ? 'shadow-[0_0_15px_#06b6d4]' : ''
                }`}
              />
            );
          })}
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Numeric Keypad */}
        <Keypad
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onSubmit={handleSubmit}
          submitDisabled={pin.length !== 4}
          submitLabel="Authenticate"
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};
