import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-6 left-1/2 -translate-x-1/2 items-center z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-2xl backdrop-blur-md transition-all ${
                isSuccess
                  ? 'bg-bento-bg/95 border-bento-yellow/40 text-bento-text'
                  : isError
                  ? 'bg-red-50/95 border-red-200 text-red-900'
                  : 'bg-bento-grey/95 border-bento-black/20 text-bento-text'
              }`}
              role="alert"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-bento-yellow" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-600" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-bento-text" />}
              </div>

              <div className="flex-1 mr-2">
                <h4 className="text-sm font-semibold tracking-wide font-serif">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-bento-text font-light mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-semibold text-bento-text underline hover:text-bento-yellow transition-colors focus:outline-none"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-bento-text hover:text-bento-text p-1 rounded-full hover:bg-bento-bg-dark/5 transition-colors focus:outline-none"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
