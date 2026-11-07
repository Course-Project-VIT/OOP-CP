import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ChangePinPage: React.FC = () => {
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentPin.length !== 4 || !/^\d{4}$/.test(currentPin)) {
      setError('Current PIN must be exactly 4 numeric digits.');
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('New PIN and Confirm PIN do not match.');
      return;
    }

    if (newPin === currentPin) {
      setError('New PIN cannot be the same as the current PIN.');
      return;
    }

    setIsLoading(true);
    try {
      await api.changePin(currentPin, newPin, confirmPin);
      setIsSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Security & PIN Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
          CHANGE CARD PIN
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Your new PIN will take effect immediately for all ATM operations.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white font-display">PIN CHANGED</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your 4-digit security PIN has been updated successfully on the Bank's secure repository.
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full"
            >
              Return to Dashboard
            </Button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleChangePin}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
          >
            {/* Current PIN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Current 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 font-mono tracking-widest text-center text-xl outline-none"
              />
            </div>

            {/* New PIN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 font-mono tracking-widest text-center text-xl outline-none"
              />
            </div>

            {/* Confirm New PIN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 font-mono tracking-widest text-center text-xl outline-none"
              />
            </div>

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

            <Button
              variant="accent"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Update PIN
            </Button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};
