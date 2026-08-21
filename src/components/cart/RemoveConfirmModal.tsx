import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { FocusTrap } from 'focus-trap-react';

interface RemoveConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveConfirmModal: React.FC<RemoveConfirmModalProps> = ({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-bento-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal Dialog */}
        <FocusTrap focusTrapOptions={{ initialFocus: '#cancel-btn', allowOutsideClick: true }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-bento-black w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-dialog-title"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-bento-grey hover:text-white rounded-full hover:bg-bento-grey/60 transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-red-700 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 id="remove-dialog-title" className="text-xl font-serif font-bold text-white mb-2">
              Remove from Cart?
            </h3>
            <p className="text-sm text-bento-grey font-light leading-relaxed mb-6">
              Are you sure you want to remove <span className="font-medium text-white">“{itemName}”</span> from your pickup cart?
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                id="cancel-btn"
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-full font-medium shadow-md bg-white/5 text-white hover:bg-bento-grey/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-bento-yellow"
              >
                Keep in Cart
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 font-medium text-white hover:bg-red-700 transition-colors text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, Remove
              </button>
            </div>
          </motion.div>
        </FocusTrap>
      </div>
    </AnimatePresence>
  );
};
