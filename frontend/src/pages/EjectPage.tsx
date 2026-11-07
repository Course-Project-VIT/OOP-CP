import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CardGraphic } from '../components/atm/CardGraphic';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const EjectPage: React.FC = () => {
  const { session, cardStatus, logout } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number>(5);

  const cardNumber = session?.cardNumber || cardStatus?.cardNumber || 'CARD1001';
  const customerName = session?.customerName || cardStatus?.cardHolderName || 'Customer';

  useEffect(() => {
    // Perform server-side session logout
    logout();

    // 5-second countdown to return to welcome screen
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 max-w-lg mx-auto">
      {/* Animated Card Ejection Slot */}
      <div className="relative mb-8">
        {/* Card Slot Opening */}
        <div className="w-80 sm:w-96 h-4 rounded-full bg-black border-2 border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] mx-auto relative z-20" />

        {/* Card Sliding Out of Slot Motion */}
        <motion.div
          initial={{ y: 50, opacity: 0.6, scale: 0.95 }}
          animate={{ y: -20, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          className="relative z-10 -mt-2"
        >
          <CardGraphic
            cardNumber={cardNumber}
            cardHolderName={customerName}
            className="shadow-2xl shadow-blue-500/20"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Card Successfully Ejected</span>
        </div>

        <h1 className="text-3xl font-black text-white font-display">
          PLEASE COLLECT YOUR CARD
        </h1>

        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Thank you for banking with <strong className="text-slate-200">APEX GLOBAL BANK</strong>.
          Your session has been securely closed.
        </p>

        <p className="text-xs text-cyan-400 font-mono mt-4">
          Returning to home screen in <strong className="text-base text-white">{countdown}</strong> seconds...
        </p>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Start New Transaction
        </Button>
      </motion.div>
    </div>
  );
};
