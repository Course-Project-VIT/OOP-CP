import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CARDS } from '../utils/demoCards';
import { CardGraphic } from '../components/atm/CardGraphic';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertCircle, CreditCard } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>('CARD1001');
  const [manualCardNumber, setManualCardNumber] = useState<string>('CARD1001');
  const [isInserting, setIsInserting] = useState<boolean>(false);
  const { checkCard, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Find the selected demo card metadata (names, status)
  const currentDemo = DEMO_CARDS.find((c) => c.cardNumber === selectedCardId) || {
    cardNumber: manualCardNumber || 'CARD1001',
    holder: 'VALUED CARDHOLDER',
    accountType: 'Savings Account',
    expiry: '12/28',
    status: 'active' as const,
  };

  const handleSelectDemo = (cardNum: string) => {
    clearError();
    setSelectedCardId(cardNum);
    setManualCardNumber(cardNum);
  };

  const handleInsert = async (cardNumToInsert: string) => {
    clearError();
    const cleanNum = cardNumToInsert.trim().toUpperCase();
    if (!cleanNum) return;

    setIsInserting(true);
    // Smooth insertion delay for natural tactile feel
    setTimeout(async () => {
      const success = await checkCard(cleanNum);
      setIsInserting(false);
      if (success) {
        navigate('/pin');
      }
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 sm:py-4">
      {/* Refined Welcome Typography */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          Welcome to Apex
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-secondary">
          Insert your debit card or select a demo profile below to begin.
        </p>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm mb-6 p-3 rounded-xl bg-danger-subtle border border-danger/20 text-danger text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Card Notice</p>
              <p className="opacity-90 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Card Presentation & Slot Simulation */}
      <div className="flex flex-col items-center mb-8 relative">
        {/* Subtle Insertion Slot */}
        <div className="w-64 sm:w-72 h-2.5 bg-surface-subdued rounded-full border border-border-subtle mb-4 flex items-center justify-center shadow-inner">
          <div className="w-48 h-1 bg-border-strong rounded-full opacity-60" />
        </div>

        {/* 3D Apple-Style Minimalist Debit Card */}
        <motion.div
          animate={
            isInserting
              ? { y: -30, opacity: 0.4, scale: 0.92 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <CardGraphic
            cardNumber={currentDemo.cardNumber}
            cardHolderName={currentDemo.holder}
            expiryDate={currentDemo.expiry}
            accountType={currentDemo.accountType}
            isBlocked={currentDemo.status === 'blocked'}
            isExpired={currentDemo.status === 'expired'}
            interactive={true}
            onClick={() => handleInsert(currentDemo.cardNumber)}
          />
        </motion.div>
      </div>

      {/* Minimal Card Number Input & Insert Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-sm mb-8"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCardNumber}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setManualCardNumber(val);
                setSelectedCardId(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInsert(manualCardNumber);
              }}
              placeholder="e.g. CARD1001"
              maxLength={12}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-subdued border border-border-subtle focus:border-accent focus:bg-surface text-primary font-mono text-sm tracking-wider uppercase placeholder:text-tertiary transition-all outline-none"
            />
            <CreditCard className="absolute right-3 top-3 w-4 h-4 text-tertiary pointer-events-none" />
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={isLoading || isInserting}
            onClick={() => handleInsert(manualCardNumber)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Insert
          </Button>
        </div>
      </motion.div>

      {/* Compact Demo Profile Selector (Strictly NO PINs or balances displayed) */}
      <div className="w-full max-w-md pt-4 border-t border-border-subtle">
        <div className="text-[11px] font-medium text-tertiary uppercase tracking-wider text-center mb-3">
          Select Demo Profile to Test
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_CARDS.map((card) => {
            const isSelected = selectedCardId === card.cardNumber;
            return (
              <motion.button
                key={card.cardNumber}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDemo(card.cardNumber)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface border-accent shadow-sm'
                    : 'bg-surface-subdued hover:bg-surface-hover border-border-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {card.cardNumber}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-medium ${
                      card.status === 'blocked'
                        ? 'bg-danger-subtle text-danger'
                        : card.status === 'expired'
                        ? 'bg-warning-subtle text-warning'
                        : 'bg-success-subtle text-success'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <div className="text-[11px] text-secondary truncate mt-0.5">
                  {card.holder}
                </div>
                <div className="text-[10px] text-tertiary">
                  {card.accountType.replace(' Account', '')}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
