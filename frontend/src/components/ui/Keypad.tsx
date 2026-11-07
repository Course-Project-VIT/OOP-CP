import React from 'react';
import { motion } from 'motion/react';
import { Delete, CheckCircle2, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onSubmit,
  submitLabel = 'Confirm',
  submitDisabled = false,
  isLoading = false,
  disabled = false,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-sm mx-auto p-4 rounded-2xl bg-atm-panel/80 border border-atm-border/80 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-2.5">
        {keys.map((num) => (
          <motion.button
            key={num}
            type="button"
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={() => onKeyPress(num)}
            className="h-14 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 active:bg-blue-600/40 border border-slate-700/60 hover:border-blue-500/50 text-2xl font-bold text-slate-100 shadow-md transition-colors flex items-center justify-center font-mono select-none"
          >
            {num}
          </motion.button>
        ))}

        {/* Clear Key */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={onClear}
          className="h-14 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-1 select-none"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </motion.button>

        {/* Zero */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={() => onKeyPress('0')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/50 text-2xl font-bold text-slate-100 shadow-md transition-colors flex items-center justify-center font-mono select-none"
        >
          0
        </motion.button>

        {/* Backspace */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={onBackspace}
          className="h-14 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-1 select-none"
        >
          <Delete className="w-5 h-5" />
        </motion.button>
      </div>

      {onSubmit && (
        <motion.button
          type="button"
          disabled={submitDisabled || isLoading || disabled}
          whileHover={{ scale: submitDisabled || isLoading || disabled ? 1 : 1.02 }}
          whileTap={{ scale: submitDisabled || isLoading || disabled ? 1 : 0.96 }}
          onClick={onSubmit}
          className="w-full mt-3 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all select-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {submitLabel}
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};
