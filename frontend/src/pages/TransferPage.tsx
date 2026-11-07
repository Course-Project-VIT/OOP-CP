import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../services/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { TransactionItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TransferPage: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<TransactionItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { account, refreshBalance } = useAuth();
  const navigate = useNavigate();

  const demoRecipients = [
    { acc: 'ACC1001', name: 'Aarav Sharma' },
    { acc: 'ACC1002', name: 'Priya Patel' },
    { acc: 'ACC1003', name: 'Rahul Verma' },
    { acc: 'ACC1004', name: 'Neha Iyer' },
  ].filter((item) => item.acc !== account?.accountNumber);

  const handleInitiateTransfer = () => {
    setError(null);
    const rec = recipient.trim().toUpperCase();
    const amt = parseFloat(amountStr);

    if (!rec) {
      setError('Please specify a recipient account number.');
      return;
    }

    if (rec === account?.accountNumber) {
      setError('Cannot transfer money to your own account.');
      return;
    }

    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid transfer amount greater than zero.');
      return;
    }

    if (amt > (account?.availableBalance ?? 0)) {
      setError(`Transfer amount exceeds available balance of ₹${(account?.availableBalance ?? 0).toFixed(2)}.`);
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleExecuteTransfer = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const record = await api.transfer(recipient.trim().toUpperCase(), parseFloat(amountStr));
      await refreshBalance();
      setIsConfirmOpen(false);
      setCompletedTx(record);
    } catch (err) {
      setIsConfirmOpen(false);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Account-to-Account Electronic Transfer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
          TRANSFER FUNDS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sender: <strong className="text-slate-200">{account?.fullName}</strong> ({account?.accountNumber})
        </p>
      </div>

      <AnimatePresence mode="wait">
        {completedTx ? (
          /* Transfer Success Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-3xl bg-slate-900/90 border border-blue-500/30 text-center shadow-2xl max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-cyan-400 border border-blue-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white font-display">TRANSFER COMPLETE</h2>
            <p className="text-xs text-slate-400 mt-1">Ref: {completedTx.transactionId}</p>

            <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transferred:</span>
                <span className="font-bold text-cyan-400">
                  -₹{completedTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold text-slate-200">{recipient.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Updated Balance:</span>
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
                  setRecipient('');
                  setAmountStr('');
                }}
                className="flex-1"
              >
                New Transfer
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
          /* Transfer Input Form */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            {/* Recipient Account Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Recipient Account Number
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.toUpperCase())}
                placeholder="e.g. ACC1002"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 font-mono tracking-wider outline-none text-base"
              />

              {/* Demo Recipient Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                <span className="text-[11px] font-semibold text-slate-500">Quick Select:</span>
                {demoRecipients.map((d) => (
                  <button
                    key={d.acc}
                    type="button"
                    onClick={() => setRecipient(d.acc)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono font-semibold transition-colors border border-slate-700/60"
                  >
                    {d.acc} ({d.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Transfer Amount (₹)
                </label>
                <span className="text-xs font-mono text-cyan-400">
                  Available: ₹{(account?.availableBalance ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-mono text-lg font-bold">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 font-mono font-bold text-lg outline-none"
                />
              </div>
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
              onClick={handleInitiateTransfer}
              className="w-full"
            >
              Review Transfer
            </Button>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="CONFIRM FUNDS TRANSFER"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Please verify the transaction details carefully. Funds will be deducted immediately from your account.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">From Account:</span>
              <span className="text-white font-bold">{account?.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">To Account:</span>
              <span className="text-cyan-400 font-bold">{recipient.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-slate-800">
              <span className="text-slate-300">Amount:</span>
              <span className="text-white font-black">
                ₹{parseFloat(amountStr || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isLoading}
              onClick={handleExecuteTransfer}
              className="flex-1"
            >
              Confirm & Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
