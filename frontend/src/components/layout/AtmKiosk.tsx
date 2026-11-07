import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AtmKioskProps {
  children: React.ReactNode;
  activeScreenTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AtmKiosk: React.FC<AtmKioskProps> = ({
  children,
  activeScreenTitle,
  showBack = false,
  onBack,
}) => {
  const { session, cardStatus, clearCard } = useAuth();
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEject = async () => {
    if (session?.authenticated) {
      navigate('/eject');
    } else {
      clearCard();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
      {/* ATM Main Enclosure */}
      <div className="w-full max-w-5xl rounded-3xl bg-slate-950/90 border border-slate-800 shadow-[0_20px_70px_rgba(0,0,0,0.85)] p-3 sm:p-6 backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle Outer Neon Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

        {/* ATM Screen Header / Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-4 sm:mb-6 text-xs text-slate-300">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-[11px] shadow">
              A
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-slate-100 font-display">APEX BANK</span>
              <span className="ml-1 text-[10px] text-cyan-400 font-mono">TOUCH TERMINAL #042</span>
            </div>
          </div>

          {/* Screen Title */}
          {activeScreenTitle && (
            <div className="hidden sm:block font-bold text-slate-200 uppercase tracking-widest text-[11px]">
              {activeScreenTitle}
            </div>
          )}

          {/* System Telemetry & Controls */}
          <div className="flex items-center gap-3 font-mono">
            <span className="hidden md:flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-BIT ENCRYPTED
            </span>

            <span className="text-slate-400">{timeStr}</span>

            {(session?.authenticated || cardStatus) && (
              <button
                onClick={handleEject}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-semibold"
                title="Eject Card and End Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Eject Card</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic ATM Interactive Screen Content */}
        <main className="relative min-h-[520px] rounded-2xl bg-gradient-to-b from-atm-card/90 to-slate-950/95 border border-atm-border p-4 sm:p-8 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Top Screen Breadcrumb / Back button */}
          {showBack && (
            <div className="mb-4">
              <button
                onClick={onBack ? onBack : () => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}

          {/* Inner Content */}
          <div className="flex-1 flex flex-col justify-center">{children}</div>
        </main>

        {/* ATM Physical Slot Simulation Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>Card Slot:</span>
            {cardStatus ? (
              <span className="font-mono text-cyan-400 font-semibold">{cardStatus.maskedCardNumber} Inserted</span>
            ) : (
              <span className="text-slate-500">Ready for Card</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">ATM Online & Operating Normally</span>
          </div>
        </div>
      </div>
    </div>
  );
};
