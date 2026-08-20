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
      className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
                isSuccess
                  ? 'bg-cream/95 border-bento-yellow/40 text-bento-black'
                  : isError
                  ? 'bg-red-50/95 border-red-200 text-red-900'
                  : 'bg-beige/95 border-bento-black/20 text-bento-black'
              }`}
              role="alert"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-bento-yellow" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-600" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-bento-black" />}
              </div>

              <div className="flex-1 mr-2">
                <h4 className="text-sm font-semibold tracking-wide font-serif">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-bento-grey font-light mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-semibold text-bento-black underline hover:text-bento-yellow transition-colors focus:outline-none"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-bento-grey hover:text-bento-black p-1 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
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
