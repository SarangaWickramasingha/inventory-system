import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X, ExternalLink } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Toast = () => {
  const { toast, showToast } = useInventory();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    // Reset progress on new toast
    setProgress(100);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 2.5));
    }, 100);

    return () => clearInterval(interval);
  }, [toast]);

  if (!toast) return null;

  const { message, type = 'success', actionLabel, onAction } = toast;

  let containerStyle = 'bg-slate-900/95 text-white border-slate-800 shadow-2xl';
  let Icon = CheckCircle2;
  let iconBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  let progressBg = 'bg-emerald-500';
  let badgeLabel = 'SUCCESS';
  let badgeColor = 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';

  if (type === 'warning') {
    Icon = AlertTriangle;
    iconBg = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    progressBg = 'bg-amber-500';
    badgeLabel = 'WARNING';
    badgeColor = 'bg-amber-400/10 text-amber-400 border-amber-400/20';
  } else if (type === 'error') {
    Icon = XCircle;
    iconBg = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    progressBg = 'bg-rose-500';
    badgeLabel = 'ALERT';
    badgeColor = 'bg-rose-400/10 text-rose-400 border-rose-400/20';
  } else if (type === 'info') {
    Icon = Info;
    iconBg = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    progressBg = 'bg-blue-500';
    badgeLabel = 'INFO';
    badgeColor = 'bg-blue-400/10 text-blue-400 border-blue-400/20';
  }

  const handleClose = () => {
    // Manually clear toast
    if (typeof showToast === 'function') {
      // Trigger parent cleanup if needed
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md w-full px-4 sm:px-0">
      <div
        className={`relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 ${containerStyle}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Type Icon Badge */}
            <div className={`p-2 rounded-xl border flex-shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Message Body */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}
                >
                  {badgeLabel}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Just now</span>
              </div>
              <p className="text-xs font-bold text-slate-100 leading-snug break-words">
                {message}
              </p>
            </div>
          </div>

          {/* Optional Action or Close Button */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {actionLabel && (
              <button
                onClick={onAction}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-extrabold text-[11px] rounded-lg transition-colors flex items-center gap-1"
              >
                {actionLabel} <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/60 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${progressBg}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
