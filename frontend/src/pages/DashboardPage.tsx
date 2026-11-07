import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NumberTicker } from '../components/ui/NumberTicker';
import { api } from '../services/api';
import type { TransactionItem } from '../types';
import { motion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Receipt,
  KeyRound,
  Eye,
  ArrowRight,
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
        if (Array.isArray(items)) {
          setRecentTransactions(items);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchRecent();
  }, []);

  const actionItems = [
    {
      title: 'Withdraw',
      desc: 'Fast cash or custom amount',
      icon: <ArrowUpRight className="w-5 h-5" />,
      path: '/withdraw',
    },
    {
      title: 'Deposit',
      desc: 'Instant currency deposit',
      icon: <ArrowDownLeft className="w-5 h-5" />,
      path: '/deposit',
    },
    {
      title: 'Transfer',
      desc: 'Account-to-account funds',
      icon: <ArrowLeftRight className="w-5 h-5" />,
      path: '/transfer',
    },
    {
      title: 'Balance Details',
      desc: 'Account limits & statements',
      icon: <Eye className="w-5 h-5" />,
      path: '/balance',
    },
    {
      title: 'Activity Ledger',
      desc: 'Full transaction statement',
      icon: <Receipt className="w-5 h-5" />,
      path: '/history',
    },
    {
      title: 'Security & PIN',
      desc: 'Change your card PIN',
      icon: <KeyRound className="w-5 h-5" />,
      path: '/change-pin',
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Top Section: Balance & Account Identity (Typography & Spacing Driven) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border-subtle"
      >
        <div>
          <div className="text-xs font-medium text-secondary">
            {session?.customerName || account?.fullName || 'Valued Client'}
          </div>
          <div className="text-xs text-tertiary mt-0.5 font-mono">
            {account?.accountNumber} • {account?.accountType?.replace(' Account', '')}
          </div>
          <div className="mt-4">
            <span className="text-xs text-tertiary block font-medium uppercase tracking-wider">
              Available Balance
            </span>
            <div className="text-3xl sm:text-4xl font-semibold text-primary tracking-tight mt-0.5">
              <NumberTicker value={account?.availableBalance ?? 0} />
            </div>
          </div>
        </div>

        {/* Minimal Secondary Details Pill */}
        <div className="flex items-center gap-4 text-xs font-mono text-tertiary">
          <div>
            <span className="block text-[10px] uppercase text-secondary">Card</span>
            <span className="text-primary font-medium">{session?.maskedCardNumber || '•••• •••• ••••'}</span>
          </div>
          <div className="w-[1px] h-6 bg-border-subtle" />
          <div>
            <span className="block text-[10px] uppercase text-secondary">Min Required</span>
            <span className="text-primary font-medium">₹{(account?.minimumBalance ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Actions Grid: Minimalist Tiles */}
      <div>
        <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
          ATM Operations
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionItems.map((item, index) => (
            <motion.button
              key={item.title}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className="p-4 rounded-2xl bg-surface-subdued hover:bg-surface-hover border border-border-subtle text-left transition-all cursor-pointer flex items-center gap-3.5 group select-none shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-primary group-hover:text-accent transition-colors shadow-xs">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-primary group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-secondary" />
                </div>
                <div className="text-xs text-secondary truncate mt-0.5">
                  {item.desc}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity List: Clean Stripe / Linear Row Style */}
      {recentTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="pt-2"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-secondary uppercase tracking-wider">
              Recent Activity
            </span>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs font-medium text-accent hover:underline cursor-pointer"
            >
              View Statement →
            </button>
          </div>

          <div className="divide-y divide-border-subtle border-t border-b border-border-subtle">
            {recentTransactions.map((tx) => {
              const isPositive = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
              const safeAmount = typeof tx.amount === 'number' ? tx.amount : 0;
              const safeBalanceAfter = typeof tx.balanceAfterTransaction === 'number' ? tx.balanceAfterTransaction : 0;

              return (
                <div
                  key={tx.transactionId}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium ${
                        isPositive
                          ? 'bg-success-subtle text-success'
                          : 'bg-surface-subdued text-secondary'
                      }`}
                    >
                      {isPositive ? '+' : '-'}
                    </span>
                    <div>
                      <div className="font-medium text-primary">{tx.description}</div>
                      <div className="text-[11px] text-tertiary">
                        {tx.timestamp
                          ? new Date(tx.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent'}{' '}
                        • Ref: {tx.transactionId}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-medium text-sm ${
                        isPositive ? 'text-success' : 'text-primary'
                      }`}
                    >
                      {isPositive ? '+' : '-'}₹
                      {safeAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-[10px] text-tertiary font-mono">
                      Bal: ₹{safeBalanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
