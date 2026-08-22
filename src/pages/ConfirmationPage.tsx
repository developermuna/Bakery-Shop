import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Car,
  Receipt,
  ShoppingBag,
  Download,
  Loader2,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { formatCurrency } from '../utils/cartUtils';
import { PickupPassCardModal } from '../components/payment/PickupPassCard';

export const ConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [showPassModal, setShowPassModal] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('mk_last_order');
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse order', e);
      }
    }
  }, []);

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Bento-Cakery-Receipt-${order?.orderNumber || fallbackOrder.orderNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating receipt image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const fallbackOrder = {
    orderNumber: 'MK-849201',
    customer: { name: 'Valued Guest', email: 'guest@example.com', phone: '(555) 123-4567' },
    pickup: { date: '2026-08-25', timeSlot: '10:00 AM - 11:00 AM' },
    items: [
      {
        id: 'sample_1',
        name: 'Vanilla Bean Cloud Cake',
        selectedSize: { label: '8 inch', price: 85, servings: '12-16' },
        selectedFlavor: 'Classic Madagascar Vanilla',
        quantity: 1,
        unitPrice: 85,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80',
      },
    ],
    totals: {
      subtotal: 85,
      tax: 7.01,
      discount: 0,
      total: 92.01,
      itemCount: 1,
    },
  };

  const activeOrder = order || fallbackOrder;

  return (
    <div className="pt-20 sm:pt-22 pb-12 bg-vanilla min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bento-yellow/20 text-bento-yellow rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-bento-yellow font-bold mb-1 block">
            Order Confirmed & Scheduled
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-bento-text mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-bento-text text-xs font-light max-w-lg mx-auto">
            We've received your pickup order for <strong className="text-bento-text">{activeOrder.customer.name}</strong>.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-bento-text/5 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 mb-5">
          {/* Order Number & Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black/5 gap-2">
            <div>
              <span className="text-[10px] text-bento-text uppercase tracking-wider block">Order Number</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-bento-text tracking-wide">
                #{activeOrder.orderNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bento-yellow/15 text-bento-text font-semibold text-xs shadow-xs">
                <Clock className="w-3.5 h-3.5 text-bento-yellow" />
                <span>Scheduled for Baking</span>
              </span>
            </div>
          </div>

          {/* Pickup Details Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-vanilla-dark/20 p-4 rounded-xl shadow-inner">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-bento-text flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-bento-yellow" />
                Pickup Date & Time
              </h3>
              <p className="text-xs sm:text-sm text-bento-text font-semibold">
                {activeOrder.pickup.date} • {activeOrder.pickup.timeSlot}
              </p>
              <p className="text-[11px] text-bento-text font-light">
                Present order <strong className="text-bento-text">#{activeOrder.orderNumber}</strong> at the pickup counter.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-bento-text flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-bento-yellow" />
                Bakery Pickup Location
              </h3>
              <p className="text-xs text-bento-text font-semibold leading-tight">
                Bento Cakery & Sweets<br />
                <span className="font-normal text-[11px] text-bento-text">Main Road, Near New Bus Stand, Rayagada</span>
              </p>
              <a
                href="https://maps.google.com/?q=Rayagada,+Odisha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-strawberry hover:text-bento-yellow transition-colors pt-0.5"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div className="bg-bento-text/5 p-3.5 rounded-xl shadow-xs space-y-1.5">
            <h4 className="text-[11px] font-bold text-bento-text uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-bento-yellow" />
              Pickup Guidance
            </h4>
            <ul className="text-[11px] text-bento-text font-light space-y-1 list-disc list-inside">
              <li>
                <strong>Express Pickup:</strong> Proceed directly to the "Online Order Pickup" counter.
              </li>
              <li>
                <strong>Cake Handling:</strong> Keep cake box level on flat vehicle floor with AC on.
              </li>
            </ul>
          </div>

          {/* Full Itemized Summary */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm sm:text-base font-bold text-bento-text flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-bento-yellow" />
              Itemized Receipt
            </h3>

            <div className="space-y-2">
              {activeOrder.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-bento-text/5 rounded-xl shadow-xs text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shadow-xs"
                    />
                    <div>
                      <span className="font-semibold text-bento-text text-xs block">
                        {item.name}
                      </span>
                      <span className="text-bento-text text-[11px]">
                        {item.selectedSize?.label} {item.selectedFlavor ? `• ${item.selectedFlavor}` : ''} × {item.quantity}
                      </span>
                      {item.cakeMessage && (
                        <span className="text-[10px] text-bento-text italic block">
                          Piped: “{item.cakeMessage}”
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-bento-text text-xs">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Details Card */}
            {activeOrder.payment && (
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl shadow-xs space-y-1.5 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Payment Confirmed (Cashfree)</span>
                  </div>
                  <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {activeOrder.payment.type === 'advance' ? '50% ADVANCE PAID' : 'FULL PAYMENT'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800 pt-1">
                  <div>
                    <span className="text-emerald-600 block text-[10px]">Method</span>
                    <strong className="font-semibold">{activeOrder.payment.method}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-600 block text-[10px]">Cashfree Txn ID</span>
                    <strong className="font-mono text-[10px]">{activeOrder.payment.txnId}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-600 block text-[10px]">Amount Paid</span>
                    <strong className="font-bold text-emerald-900">{formatCurrency(activeOrder.payment.amountPaid)}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-600 block text-[10px]">Balance Due at Pickup</span>
                    <strong className={`font-bold ${activeOrder.payment.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-800'}`}>
                      {activeOrder.payment.balanceDue > 0 ? formatCurrency(activeOrder.payment.balanceDue) : '₹0 (Fully Paid)'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Totals Breakdown */}
            <div className="bg-vanilla-dark/30 p-3 rounded-xl shadow-inner space-y-1 text-xs">
              <div className="flex justify-between text-bento-text">
                <span>Subtotal</span>
                <span className="font-medium text-bento-text">
                  {formatCurrency(activeOrder.totals.subtotal)}
                </span>
              </div>
              {activeOrder.totals.discount > 0 && (
                <div className="flex justify-between text-strawberry font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(activeOrder.totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-bento-text">
                <span>GST ({Math.round((activeOrder.totals.taxRate || 0.18) * 100)}% Included)</span>
                <span>{formatCurrency(activeOrder.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-bento-text">
                <span>In-Store Pickup</span>
                <span className="text-strawberry font-semibold">FREE</span>
              </div>
              <div className="pt-1.5 flex justify-between font-bold text-sm text-bento-text border-t border-black/5">
                <span>Grand Total</span>
                <span>{formatCurrency(activeOrder.totals.total)}</span>
              </div>
              {activeOrder.payment && activeOrder.payment.type === 'advance' && (
                <>
                  <div className="flex justify-between font-semibold text-emerald-700 pt-1">
                    <span>Paid via Cashfree (50% Advance)</span>
                    <span>-{formatCurrency(activeOrder.payment.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-800 text-sm pt-1 border-t border-amber-200/60">
                    <span>Remaining Balance at Pickup</span>
                    <span>{formatCurrency(activeOrder.payment.balanceDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Receipt for Download */}
        <div className="absolute top-0 left-[-9999px] w-[500px] pointer-events-none" ref={receiptRef}>
           <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl p-8 pt-20">
             {/* Background Image */}
             <div 
               className="absolute inset-0 z-0 opacity-20"
               style={{ 
                 backgroundImage: `url(${activeOrder.items[0]?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1089'})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 filter: 'blur(4px)'
               }}
             />
             
             {/* Overlay Gradient */}
             <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95" />
             
             <div className="relative z-10 space-y-6">
                <div className="text-center border-b border-bento-grey/20 pb-6">
                   <h2 className="text-3xl font-serif font-bold text-bento-text mb-1">Bento Cakery</h2>
                   <p className="text-bento-text text-sm">Order Confirmation Receipt</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-vanilla/80 p-4 rounded-xl border border-bento-grey/10">
                   <div>
                     <p className="text-bento-text text-xs uppercase tracking-wider mb-0.5">Order ID</p>
                     <p className="font-bold text-bento-text">#{activeOrder.orderNumber}</p>
                   </div>
                   <div>
                     <p className="text-bento-text text-xs uppercase tracking-wider mb-0.5">Pickup Date & Time</p>
                     <p className="font-bold text-bento-text">{activeOrder.pickup.date}</p>
                     <p className="text-bento-text">{activeOrder.pickup.timeSlot}</p>
                   </div>
                   <div className="col-span-2">
                     <p className="text-bento-text text-xs uppercase tracking-wider mb-0.5">Customer</p>
                     <p className="font-bold text-bento-text">{activeOrder.customer.name}</p>
                   </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-bold text-bento-text mb-3 uppercase text-xs tracking-wider border-b border-bento-grey/10 pb-2">Itemized Order</h3>
                  <div className="space-y-3">
                    {activeOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                         <div>
                            <p className="font-semibold text-bento-text">{item.name}</p>
                            <p className="text-xs text-bento-text">
                               Qty: {item.quantity} {item.selectedSize?.label ? `| ${item.selectedSize.label}` : ''}
                            </p>
                         </div>
                         <p className="font-bold text-bento-text">{formatCurrency(item.unitPrice * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-bento-grey/20 flex justify-between items-center text-lg font-bold text-bento-text">
                   <span>Total Paid</span>
                   <span>{formatCurrency(activeOrder.totals.total)}</span>
                </div>
                
                <div className="text-center pt-6 pb-2">
                   <p className="text-xs text-bento-text italic">Thank you for supporting our bakery!</p>
                </div>
             </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row flex-wrap sm:flex-nowrap gap-2 justify-center items-center max-w-2xl mx-auto pt-2">
          <button
            onClick={() => setShowPassModal(true)}
            className="px-3 sm:px-4 py-2.5 bg-bento-yellow text-bento-text-inverse rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-bento-yellow/80 transition-colors shadow-soft inline-flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
          >
            <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Store Pass</span>
          </button>
          
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="px-3 sm:px-4 py-2.5 bg-vanilla text-bento-text border border-bento-grey/20 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-bento-yellow hover:border-bento-yellow hover:text-white transition-all shadow-sm inline-flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>Download Receipt</span>
          </button>
          
          <Link
            to="/"
            className="px-3 sm:px-4 py-2.5 bg-bento-text text-bento-text-inverse rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-bento-text/80 transition-colors shadow-sm inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-bento-text-inverse flex-shrink-0" />
            <span>Return to Home</span>
          </Link>
        </div>

        <PickupPassCardModal
          order={activeOrder}
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          autoDownload={true}
        />
      </div>
    </div>
  );
};
