import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  X,
  Download,
  QrCode,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '../../utils/cartUtils';

interface PickupPassCardProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  autoDownload?: boolean;
}

export const PickupPassCardModal: React.FC<PickupPassCardProps> = ({
  order,
  isOpen,
  onClose,
  autoDownload = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadCardImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Bento-Cakery-Pickup-Pass-${order?.orderNumber || 'Pass'}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
    } catch (err) {
      console.error('Failed to capture credit card pickup pass', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (isOpen && autoDownload) {
      const timer = setTimeout(() => {
        downloadCardImage();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const customerName = order?.customer?.name || order?.customerName || 'Valued Guest';
  const customerPhone = order?.customer?.phone || order?.customerPhone || '';
  const orderNumber = order?.orderNumber || 'MK-849201';
  const pickupDate = order?.pickup?.date || order?.pickupDate || '2026-08-25';
  const timeSlot = order?.pickup?.timeSlot || order?.pickupTimeSlot || '10:00 AM - 11:00 AM';
  
  const paymentType = order?.payment?.type || 'full';
  const balanceDue = order?.payment?.balanceDue || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-500/20 text-white font-sans overflow-hidden">
        
        {/* Glow effect behind */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Store Pickup Pass</h3>
              <p className="text-[11px] text-slate-400">Show this card at counter for instant verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Pill */}
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {downloaded ? 'Card downloaded as image!' : 'Downloading pass image automatically...'}
            </span>
          </div>
          {isDownloading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
        </div>

        {/* CREDIT CARD SIZED CONTAINER FOR HTML2CANVAS CAPTURE */}
        <div className="flex justify-center my-2">
          <div
            ref={cardRef}
            className="w-[380px] h-[225px] sm:w-[420px] sm:h-[245px] rounded-2xl bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 p-4 sm:p-5 shadow-2xl border border-amber-400/40 relative flex flex-col justify-between overflow-hidden text-white select-none"
            style={{
              boxShadow: '0 20px 40px -15px rgba(245, 158, 11, 0.25)',
            }}
          >
            {/* Card Background Pattern & Watermark */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            <div className="absolute -right-8 -bottom-8 text-amber-500/5 text-8xl font-black font-serif pointer-events-none select-none">
              BC
            </div>

            {/* Card Top Row */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-bold text-amber-300 text-lg tracking-wider">BENTO CAKERY</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold block">
                  VIP Store Pickup Pass
                </span>
              </div>

              <div className="text-right">
                {/* Metallic Chip look */}
                <div className="w-8 h-6 bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-500 rounded-md shadow-sm border border-amber-300/60 mb-1 ml-auto flex items-center justify-center opacity-90">
                  <div className="w-5 h-3 border border-amber-800/40 rounded-sm" />
                </div>
                <span className="font-mono text-xs font-bold text-amber-200 tracking-wider">#{orderNumber}</span>
              </div>
            </div>

            {/* Card Middle Row */}
            <div className="relative z-10 my-auto py-1 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-8 space-y-1">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Customer</span>
                  <span className="text-sm font-bold text-white truncate block">{customerName}</span>
                  {customerPhone && <span className="text-[10px] text-slate-300 font-mono block">{customerPhone}</span>}
                </div>

                <div className="pt-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                    Pickup Schedule
                  </span>
                  <span className="text-xs font-semibold text-white block">
                    {pickupDate} • {timeSlot}
                  </span>
                </div>
              </div>

              {/* QR Code representation */}
              <div className="col-span-4 flex flex-col items-center justify-center bg-white p-1.5 rounded-xl shadow-md border border-slate-200">
                <QrCode className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-800 font-bold tracking-tighter mt-0.5">
                  SCAN @ COUNTER
                </span>
              </div>
            </div>

            {/* Card Bottom Row */}
            <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-300 uppercase tracking-tight">
                  {paymentType === 'advance' ? 'Cashfree 50% Adv Paid' : 'Cashfree Paid in Full'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[9px] uppercase">Balance Due</span>
                <span className={`font-bold text-xs ${balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {balanceDue > 0 ? formatCurrency(balanceDue) : '₹0 (Fully Paid)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={downloadCardImage}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download Card Image</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            View Full Order Summary
          </button>
        </div>

      </div>
    </div>
  );
};
