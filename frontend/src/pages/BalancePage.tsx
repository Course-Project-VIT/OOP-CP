import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NumberTicker } from '../components/ui/NumberTicker';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { motion } from 'motion/react';
import {
  Wallet,
  RefreshCw,
  Printer,
  ArrowUpFromLine,
  ShieldCheck,
} from 'lucide-react';

export const BalancePage: React.FC = () => {
  const { account, balanceInfo, refreshBalance } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  useEffect(() => {
    refreshBalance();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const totalBalance = balanceInfo?.currentBalance ?? account?.balance ?? 0;
  const availableBalance = balanceInfo?.availableBalance ?? account?.availableBalance ?? 0;
  const minimumBalance = balanceInfo?.minimumBalance ?? account?.minimumBalance ?? 0;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <Wallet className="w-3.5 h-3.5" />
          <span>Real-Time Balance Inquiry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
          ACCOUNT BALANCE SUMMARY
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {account?.accountType} • Account Number: <span className="font-mono text-slate-300 font-bold">{account?.accountNumber}</span>
        </p>
      </motion.div>

      {/* Main Glass Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 shadow-2xl relative overflow-hidden mb-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big Available Balance Display */}
        <div className="text-center pb-6 border-b border-slate-800">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
            Available To Withdraw
          </p>
          <div className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 font-mono tracking-tight drop-shadow-md">
            <NumberTicker value={availableBalance} />
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Funds verified by Apex Core Banking Engine
          </p>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium">Total Ledger Balance</p>
            <p className="text-lg font-bold font-mono text-slate-100 mt-1">
              ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium">Mandatory Minimum Balance</p>
            <p className="text-lg font-bold font-mono text-amber-300 mt-1">
              ₹{minimumBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Customer Information Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
          <span>Primary Holder: <strong className="text-slate-200">{account?.fullName}</strong></span>
          <span>Card: <strong className="text-slate-200">{account?.maskedCardNumber}</strong></span>
        </div>
      </motion.div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
        <Button
          variant="secondary"
          size="md"
          onClick={handleRefresh}
          isLoading={isRefreshing}
          icon={<RefreshCw className="w-4 h-4" />}
          className="flex-1"
        >
          Refresh
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsReceiptOpen(true)}
          icon={<Printer className="w-4 h-4" />}
          className="flex-1"
        >
          Print Slip
        </Button>

        <Button
          variant="accent"
          size="md"
          onClick={() => navigate('/withdraw')}
          icon={<ArrowUpFromLine className="w-4 h-4" />}
          className="flex-1"
        >
          Withdraw
        </Button>
      </div>

      {/* Printable ATM Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="ATM TRANSACTION RECORD"
      >
        <div className="font-mono text-xs text-slate-300 space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="text-center pb-2 border-b border-dashed border-slate-700">
            <p className="font-black text-sm text-white">APEX GLOBAL BANK</p>
            <p className="text-[10px] text-slate-400">TOUCH TERMINAL #042 • VIT CAMPUS</p>
            <p className="text-[10px] text-slate-400">{new Date().toLocaleString()}</p>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction:</span>
              <span className="font-bold text-white">BALANCE INQUIRY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account No:</span>
              <span className="font-bold text-white">{account?.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Card Number:</span>
              <span className="text-white">{account?.maskedCardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Holder:</span>
              <span className="text-white">{account?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Type:</span>
              <span className="text-white">{account?.accountType}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-slate-700 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Total Balance:</span>
              <span className="font-bold text-white">₹{totalBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cyan-400 font-bold">Available to Withdraw:</span>
              <span className="font-bold text-cyan-300">₹{availableBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-3 text-[10px] text-slate-500 border-t border-slate-800">
            <p>Thank you for banking with APEX BANK.</p>
            <p>Save paper, save trees. Go digital!</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setIsReceiptOpen(false)}>
            Close Receipt
          </Button>
        </div>
      </Modal>
    </div>
  );
};
