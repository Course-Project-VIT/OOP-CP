import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../services/api';
import { CashDispenser } from '../components/atm/CashDispenser';
import { Keypad } from '../components/ui/Keypad';
import { Button } from '../components/ui/Button';
import type { TransactionItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpFromLine, AlertCircle } from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [dispenserMode, setDispenserMode] = useState<'idle' | 'dispensing' | 'ready'>('idle');
  const [completedTx, setCompletedTx] = useState<TransactionItem | null>(null);
  const [dispensedAmount, setDispensedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { account, refreshBalance } = useAuth();
  const navigate = useNavigate();

  const quickAmounts = [500, 1000, 2000, 5000];
  const availableBalance = account?.availableBalance ?? 0;

  const handleKeyPress = (num: string) => {
    setError(null);
    if (amountStr.length < 8) {
      setAmountStr((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setError(null);
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(null);
    setAmountStr('');
  };

  const handleQuickSelect = (amt: number) => {
    setError(null);
    setAmountStr(amt.toString());
  };

  const handleWithdraw = async () => {
    const numericAmount = parseFloat(amountStr);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid withdrawal amount greater than zero.');
      return;
    }

    if (numericAmount > availableBalance) {
      setError(`Cannot withdraw ₹${numericAmount.toFixed(2)}. Available to withdraw is ₹${availableBalance.toFixed(2)}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDispenserMode('dispensing');
    setDispensedAmount(numericAmount);

    try {
      const record = await api.withdraw(numericAmount);
      await refreshBalance();
      setDispenserMode('ready');
      setCompletedTx(record);
    } catch (err) {
      setDispenserMode('idle');
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
          <ArrowUpFromLine className="w-3.5 h-3.5" />
          <span>Fast Cash Withdrawal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
          WITHDRAW CASH
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Available to withdraw: <strong className="text-cyan-300 font-mono">₹{availableBalance.toFixed(2)}</strong> (Minimum balance enforced)
        </p>
      </div>

      <AnimatePresence mode="wait">
        {completedTx ? (
          /* Dispense & Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-3xl bg-slate-900/90 border border-blue-500/30 text-center shadow-2xl max-w-md mx-auto"
          >
            <CashDispenser
              mode={dispenserMode}
              amount={dispensedAmount}
              onTakeCash={() => setDispenserMode('idle')}
            />

            <h2 className="text-2xl font-black text-white font-display mt-4">WITHDRAWAL DISPENSED</h2>
            <p className="text-xs text-slate-400 mt-1">Ref: {completedTx.transactionId}</p>

            <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Dispensed Cash:</span>
                <span className="font-bold text-amber-400">
                  -₹{completedTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-bold text-white">
                  ₹{completedTx.balanceAfterTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setCompletedTx(null);
                  setAmountStr('');
                  setDispenserMode('idle');
                }}
                className="flex-1"
              >
                Withdraw More
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Dashboard
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Withdrawal Entry Screen */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Presets and Amount */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Withdrawal Amount (₹)
                </label>
                <div className="flex items-center text-3xl sm:text-4xl font-black font-mono text-cyan-300">
                  <span>₹</span>
                  <span className="ml-1 tracking-tight">{amountStr || '0.00'}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Fast Cash Options:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleQuickSelect(amt)}
                      className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 font-mono font-bold text-sm text-slate-200 transition-colors shadow"
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cash Dispenser Preview */}
              <CashDispenser mode={dispenserMode} />

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Keypad */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 text-center">
                Use Touch Keypad to Enter Custom Amount:
              </p>
              <Keypad
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onClear={handleClear}
                onSubmit={handleWithdraw}
                submitDisabled={!amountStr || parseFloat(amountStr) <= 0}
                submitLabel="Dispense Cash"
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
