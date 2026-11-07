import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NumberTicker } from '../components/ui/NumberTicker';
import { api } from '../services/api';
import type { TransactionItem } from '../types';
import { motion } from 'motion/react';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
  KeyRound,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { session, account, refreshBalance } = useAuth();
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    refreshBalance();
    const fetchRecent = async () => {
      try {
        const items = await api.getRecentTransactions(3);
        setRecentTransactions(items);
      } catch {
        // Ignore recent fetch errors on dashboard
      }
    };
    fetchRecent();
  }, []);

  const actionItems = [
    {
      title: 'Balance Inquiry',
      desc: 'View detailed available balance & statements',
      icon: <Wallet className="w-6 h-6 text-cyan-400" />,
      path: '/balance',
      gradient: 'from-cyan-500/20 to-blue-500/20 hover:border-cyan-500/50',
    },
    {
      title: 'Cash Deposit',
      desc: 'Deposit currency notes directly to account',
      icon: <ArrowDownToLine className="w-6 h-6 text-emerald-400" />,
      path: '/deposit',
      gradient: 'from-emerald-500/20 to-teal-500/20 hover:border-emerald-500/50',
    },
    {
      title: 'Cash Withdrawal',
      desc: 'Fast cash presets or custom withdrawal',
      icon: <ArrowUpFromLine className="w-6 h-6 text-amber-400" />,
      path: '/withdraw',
      gradient: 'from-amber-500/20 to-yellow-500/20 hover:border-amber-500/50',
    },
    {
      title: 'Transfer Money',
      desc: 'Send funds instantly to any bank account',
      icon: <ArrowLeftRight className="w-6 h-6 text-blue-400" />,
      path: '/transfer',
      gradient: 'from-blue-500/20 to-indigo-500/20 hover:border-blue-500/50',
    },
    {
      title: 'Transaction History',
      desc: 'Review latest transactions & receipts',
      icon: <History className="w-6 h-6 text-purple-400" />,
      path: '/history',
      gradient: 'from-purple-500/20 to-pink-500/20 hover:border-purple-500/50',
    },
    {
      title: 'Change Card PIN',
      desc: 'Update your 4-digit security PIN',
      icon: <KeyRound className="w-6 h-6 text-rose-400" />,
      path: '/change-pin',
      gradient: 'from-rose-500/20 to-orange-500/20 hover:border-rose-500/50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950 border border-blue-500/20 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              AUTHENTICATED SESSION
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display mt-0.5">
            Welcome, {session?.customerName || account?.fullName || 'Valued Customer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Account: <span className="font-mono text-slate-300 font-semibold">{account?.accountNumber}</span> |{' '}
            {account?.accountType} | Card: <span className="font-mono text-slate-300 font-semibold">{session?.maskedCardNumber}</span>
          </p>
        </div>

        {/* Live Balance Summary Pill */}
        <div className="flex flex-col items-start md:items-end justify-center px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Balance</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">
            <NumberTicker value={account?.availableBalance ?? 0} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Total: ₹{(account?.balance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </motion.div>

      {/* Main Touchscreen Action Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
          Select Banking Operation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${item.gradient} bg-slate-900/60 border border-slate-800/80 shadow-lg cursor-pointer transition-all flex items-start gap-4 select-none group`}
            >
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 shadow-md group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Strip */}
      {recentTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-400" />
              Recent Operations
            </span>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              View Full History →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.transactionId}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  {tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="font-semibold text-slate-200">{tx.description}</span>
                </div>
                <span className="font-mono font-bold text-slate-100">
                  ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
