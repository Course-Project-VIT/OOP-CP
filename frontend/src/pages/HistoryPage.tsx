import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import type { TransactionItem } from '../types';
import { motion } from 'motion/react';
import {
  History,
  TrendingDown,
  TrendingUp,
  KeyRound,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getRecentTransactions(5);
      setTransactions(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return {
          icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          sign: '+',
          color: 'text-emerald-400',
        };
      case 'TRANSFER_IN':
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          sign: '+',
          color: 'text-emerald-400',
        };
      case 'WITHDRAWAL':
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-rose-400" />,
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          sign: '-',
          color: 'text-rose-400',
        };
      case 'TRANSFER_OUT':
        return {
          icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          sign: '-',
          color: 'text-rose-400',
        };
      case 'PIN_CHANGE':
        return {
          icon: <KeyRound className="w-4 h-4 text-blue-400" />,
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          sign: '',
          color: 'text-slate-400',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-400" />,
          badge: 'bg-slate-700 text-slate-300 border-slate-600',
          sign: '',
          color: 'text-slate-200',
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Activity Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
            RECENT TRANSACTIONS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying the last 5 operations (newest first)
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchHistory}
          isLoading={isLoading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Log
        </Button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {isLoading ? (
          <div className="text-center py-16">
            <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-xs text-slate-400 font-mono">Fetching transaction records from Bank...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-bold">No transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Your account currently has no recorded transactions.
            </p>
          </div>
        ) : (
          transactions.map((tx, index) => {
            const style = getBadge(tx.type);
            return (
              <motion.div
                key={tx.transactionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 shadow-md flex flex-wrap items-center justify-between gap-4 transition-all"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {style.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{tx.description}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                      >
                        {tx.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>ID: {tx.transactionId}</span>
                      <span>•</span>
                      <span>{formatTimestamp(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Running Balance */}
                <div className="text-right">
                  <p className={`font-mono text-base font-bold ${style.color}`}>
                    {style.sign}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Bal: ₹{tx.balanceAfterTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
