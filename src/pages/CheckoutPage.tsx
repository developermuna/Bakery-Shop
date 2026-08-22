import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Lock,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Gift,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency, getAvailablePickupSlots, getEarliestPickupDate, isDateValidForPickup } from '../utils/cartUtils';
import { CelebrationAddonsGrid } from '../components/CelebrationAddonsGrid';
import { CashfreeModal } from '../components/payment/CashfreeModal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video background auto-playback attempt:', err);
        });
      }
    }
  }, []);

  const {
    items,
    orderNotes,
    globalPickupDate,
    globalPickupTimeSlot,
    setGlobalPickup,
    setOrderNotes,
    getTotals,
    clearCart,
    updateItemQuantity,
    removeItem,
  } = useCartStore();

  const { addToast } = useToastStore();
  const totals = getTotals();

  // Customer Details Form State
  const [name, setName] = useState('');
  const email = "";
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const earliestDateStr = getEarliestPickupDate(totals.maxLeadTimeHours || 24);
  const [pickupDate, setPickupDateLocal] = useState(globalPickupDate || earliestDateStr);
  const [pickupTimeSlot, setPickupTimeSlotLocal] = useState(globalPickupTimeSlot || '10:00 AM - 11:00 AM');
  const [notes, setNotes] = useState(orderNotes);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment Form State (Cashfree Modal)
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);
  const [pendingPaymentType, setPendingPaymentType] = useState<'full' | 'advance'>('full');
  const [orderNumber] = useState(() => `MK-${Math.floor(100000 + Math.random() * 900000)}`);

  const availableSlots = getAvailablePickupSlots(pickupDate);
  const giftFee = isGift ? 49 : 0;
  const grandTotal = totals.total + giftFee;

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim() || phone.length < 7) errors.phone = 'Valid phone number is required';
    if (!address.trim()) errors.address = 'Address is required';
    
    const dateCheck = isDateValidForPickup(pickupDate, totals.maxLeadTimeHours);
    if (!dateCheck.valid) {
      errors.pickupDate = dateCheck.reason || 'Invalid pickup date';
    }

    if (!pickupTimeSlot) {
      errors.pickupTimeSlot = 'Pickup time slot is required';
    }

    if (isGift && !giftMessage.trim()) {
      errors.giftMessage = 'Please provide a gift message or instructions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProcessPayment = (type: 'total' | 'advance') => {
    if (!validateStep2()) {
      addToast({
        type: 'error',
        title: 'Missing Required Details',
        description: 'Please complete all customer and pickup details.',
      });
      return;
    }

    setGlobalPickup(pickupDate, pickupTimeSlot);
    setOrderNotes(notes);
    setPendingPaymentType(type === 'total' ? 'full' : 'advance');
    setShowCashfreeModal(true);
  };

  const handleCashfreeSuccess = (paymentDetails: {
    txnId: string;
    method: string;
    amountPaid: number;
    paymentType: 'full' | 'advance';
    balanceDue: number;
  }) => {
    setShowCashfreeModal(false);
    setIsProcessing(true);

    const orderId = `ord_${Date.now()}`;

    const orderData = {
      orderNumber,
      customer: { name, email, phone, address, isGift },
      pickup: { date: pickupDate, timeSlot: pickupTimeSlot },
      items: [...items],
      totals: { ...totals, giftFee, total: grandTotal },
      payment: {
        gateway: 'Cashfree Payments',
        txnId: paymentDetails.txnId,
        method: paymentDetails.method,
        type: paymentDetails.paymentType,
        amountPaid: paymentDetails.amountPaid,
        balanceDue: paymentDetails.balanceDue,
        status: 'PAID',
      },
      notes: isGift
        ? `${notes ? notes + ' | ' : ''}Surprise Gift: Luxury wrapping & greeting card (+₹49). Message: ${giftMessage}`
        : notes,
      placedAt: new Date().toISOString(),
    };

    // Save order data to sessionStorage for confirmation page
    sessionStorage.setItem('mk_last_order', JSON.stringify(orderData));

    // Save to global order store
    useOrderStore.getState().addOrder({
      id: orderId,
      orderNumber,
      customer: { name, email, phone },
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.unitPrice,
        quantity: i.quantity,
        size: i.selectedSize?.label,
        flavor: i.selectedFlavor,
        eggless: i.dietaryNotes?.toLowerCase().includes('eggless') || i.dietaryNotes?.toLowerCase().includes('veg') || false,
        message: i.cakeMessage,
      })),
      pickupDate,
      pickupTimeSlot,
      totals: {
        ...totals,
        total: grandTotal,
        advancePaid: paymentDetails.amountPaid,
        balanceDue: paymentDetails.balanceDue,
      },
      notes: orderData.notes,
      status: 'New',
      createdAt: new Date().toISOString(),
    });

    clearCart();
    setIsProcessing(false);

    navigate('/confirmation');
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center px-4 relative overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            className="w-full h-full object-cover scale-105"
          >
            <source src="/pickup_process_video.mp4" type="video/mp4" />
            <source src="/pickup_process_video_2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
        </div>

        <div className="max-w-md w-full mx-auto bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/80 relative z-10">
          <h2 className="text-2xl font-bold text-bento-text mb-3">No Items in Cart</h2>
          <p className="text-xs text-bento-text font-light mb-6">
            Your cart is currently empty. Please select cakes from our menu before proceeding to buy.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-strawberry text-white text-xs font-semibold rounded-full shadow-md hover:bg-bento-yellow hover:text-bento-text transition-all cursor-pointer"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-18 pb-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
      {/* Background Video & Fallback */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#1e1715]">
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
          alt="Bakery background"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={(e) => {
            e.currentTarget.muted = true;
            e.currentTarget.play().catch(() => {});
          }}
          className="relative w-full h-full object-cover scale-105"
        >
          <source src="/pickup_process_video.mp4" type="video/mp4" />
          <source src="/pickup_process_video_2.mp4" type="video/mp4" />
        </video>
        {/* Soft atmospheric overlay for readability of cards and text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1715]/70 via-[#1e1715]/55 to-[#1e1715]/75 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 max-w-6xl relative z-10 my-auto">
        {/* Top Section: Party & Celebration Add-Ons Recommendation Row */}
        <CelebrationAddonsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 items-stretch">
          {/* Left Column: Step Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <form
              onSubmit={(e) => { e.preventDefault(); handleProcessPayment('total'); }}
              className="bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-white/60 flex-1 flex flex-col space-y-2"
            >
                {/* Header bar: Step Timeline */}
                <div className="pb-2 border-b border-black/5 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs sm:text-sm font-bold text-bento-text font-serif">
                      Step 2 of 3
                    </span>
                  </div>

                  {/* Step Timeline */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Step 1 */}
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bento-yellow text-bento-text font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs">
                        ✓
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-bento-text font-medium hidden sm:inline">1. Cart</span>
                    </div>

                    <div className="w-3 sm:w-4 h-0.5 bg-black/10" />

                    {/* Step 2 */}
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs bg-strawberry text-white scale-105 ring-2 ring-strawberry/30">
                        2
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-strawberry">
                        2. Pickup
                      </span>
                    </div>

                    <div className="w-3 sm:w-4 h-0.5 bg-black/10" />

                    {/* Step 3 */}
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs bg-black/10 text-bento-text">
                        3
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-bento-text hidden sm:inline">
                        3. Payment
                      </span>
                    </div>

                    <div className="w-3 sm:w-4 h-0.5 bg-black/10" />

                    {/* Step 4 */}
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/10 text-bento-text font-medium text-[10px] sm:text-[11px] flex items-center justify-center">
                        4
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-bento-text hidden sm:inline">4. Confirmation</span>
                    </div>
                  </div>
                </div>

                {/* Heading and description with slightly increased font sizes */}
                <div className="pb-1 border-b border-black/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-bento-text leading-tight font-serif">
                      Customer &amp; Pickup Details
                    </h2>
                    <p className="text-[11px] sm:text-xs text-bento-text/80 font-normal mt-0.5">
                      Please enter your contact, pickup schedule &amp; address details below.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {/* Contact Information (2 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-bento-text mb-0.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full bg-white border rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors ${
                          formErrors.name ? 'border-red-500' : 'border-black/10'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-bento-text mb-0.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className={`w-full bg-white border rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors ${
                          formErrors.phone ? 'border-red-500' : 'border-black/10'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Pickup Scheduling & Address (3 fields in one row, aligned perfectly to Name & Phone columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {/* Nested Container for Date & Time (Width 50%, sharing sm:col-span-2) split 40/60 */}
                    <div className="col-span-1 sm:col-span-2 grid grid-cols-10 gap-1.5">
                      {/* Pickup Date (Col span 4 - 40% of the half) */}
                      <div className="col-span-4">
                        <label className="block text-[11px] font-semibold text-bento-text mb-0.5 truncate">
                          Pickup Date *
                        </label>
                        <input
                          type="date"
                          min={earliestDateStr}
                          value={pickupDate}
                          onChange={(e) => setPickupDateLocal(e.target.value)}
                          className={`w-full bg-white border rounded-xl px-2 py-1.5 sm:py-2 text-[10px] sm:text-xs text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors ${
                            formErrors.pickupDate ? 'border-red-500' : 'border-black/10'
                          }`}
                        />
                        {formErrors.pickupDate && (
                          <p className="text-[10px] text-red-600 mt-0.5">{formErrors.pickupDate}</p>
                        )}
                      </div>

                      {/* Pickup Time Slot (Col span 6 - 60% of the half) */}
                      <div className="col-span-6">
                        <label className="block text-[11px] font-semibold text-bento-text mb-0.5 truncate">
                          Pickup Time Slot *
                        </label>
                        <select
                          value={pickupTimeSlot}
                          onChange={(e) => setPickupTimeSlotLocal(e.target.value)}
                          className={`w-full bg-white border rounded-xl px-1.5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors ${
                            formErrors.pickupTimeSlot ? 'border-red-500' : 'border-black/10'
                          }`}
                        >
                          {availableSlots.map((slot) => (
                            <option key={slot.id} value={slot.time} disabled={!slot.available}>
                              {slot.time} {!slot.available ? '(Booked)' : ''}
                            </option>
                          ))}
                        </select>
                        {formErrors.pickupTimeSlot && (
                          <p className="text-[10px] text-red-600 mt-0.5">
                            {formErrors.pickupTimeSlot}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer / Delivery / Pickup Address (Col span 2 - 50% of grid) */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-bento-text mb-0.5">
                        Address *
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Flat No., Street, Landmark, Rayagada"
                        className={`w-full bg-white border rounded-xl px-3 py-1.5 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors resize-none ${
                          formErrors.address ? 'border-red-500' : 'border-black/10'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-[10px] text-red-600 mt-0.5">{formErrors.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Special Pickup Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-bento-text mb-0.5">
                      Special Pickup Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Handle with extra care, add ribbon..."
                      className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors"
                    />
                  </div>

                  {/* Gift Checkbox & Gift Message in One Row */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-strawberry/20 hover:border-strawberry/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      {/* Left: Checkbox & Label */}
                      <label className="flex items-center space-x-2 cursor-pointer select-none shrink-0 pt-0.5">
                        <input
                          type="checkbox"
                          checked={isGift}
                          onChange={(e) => setIsGift(e.target.checked)}
                          className="accent-strawberry rounded w-3.5 h-3.5 cursor-pointer shrink-0"
                        />
                        <div className="flex items-center space-x-1.5">
                          <Gift className="w-3.5 h-3.5 text-strawberry shrink-0" />
                          <span className="text-[11px] sm:text-xs font-bold text-bento-text">
                            Is this a surprise gift?
                          </span>
                          <span className="text-[10px] text-strawberry font-semibold">(+₹49)</span>
                        </div>
                      </label>

                      {/* Right: Gift Message 2-Row Textarea in the same row when checked */}
                      {isGift ? (
                        <div className="flex-1 min-w-0">
                          <textarea
                            rows={2}
                            value={giftMessage}
                            onChange={(e) => setGiftMessage(e.target.value)}
                            placeholder="Gift message / instructions *"
                            className={`w-full bg-white border rounded-xl px-2.5 py-1 text-xs text-bento-text focus:outline-none focus:border-strawberry shadow-xs transition-colors resize-none ${
                              formErrors.giftMessage ? 'border-red-500' : 'border-black/10'
                            }`}
                          />
                          {formErrors.giftMessage && (
                            <p className="text-[10px] text-red-600 mt-0.5">{formErrors.giftMessage}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-strawberry font-medium hidden sm:inline text-right shrink-0 pt-0.5">
                          Includes luxury gift wrapping &amp; greeting card
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Pickup Store Info */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-2 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => navigate('/menu')}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-bento-text hover:text-strawberry transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Menu</span>
                  </button>

                  <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-bento-text bg-black/[0.03] px-2.5 py-1 rounded-xl border border-black/5 self-end sm:self-auto">
                    <MapPin className="w-3.5 h-3.5 text-strawberry flex-shrink-0" />
                    <span className="font-medium">
                      Pickup Store: <span className="text-bento-text">Main Road, Near New Bus Stand, Rayagada, Odisha</span>
                    </span>
                  </div>
                </div>
              </form>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-full lg:sticky lg:top-24">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-white/60 flex-1 flex flex-col justify-between space-y-2">
              <h3 className="font-bold text-bento-text text-sm sm:text-base font-serif pb-1.5 border-b border-black/5 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-sans font-semibold text-bento-text">({totals.itemCount} items)</span>
              </h3>

              {/* Items Miniature List */}
              <div 
                className="space-y-1.5 max-h-[22vh] lg:max-h-[28vh] overflow-y-auto pr-1 custom-scrollbar flex-1 overscroll-contain"
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                onWheel={(e) => e.stopPropagation()}
              >
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-black/5 last:border-0">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md flex-shrink-0 shadow-xs"
                      />
                      <div className="truncate flex flex-col justify-center">
                        <span className="font-medium text-bento-text block truncate text-[11px] sm:text-xs">
                          {item.name}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] text-bento-text">
                            {item.selectedSize?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                      <span className="font-semibold text-bento-text flex-shrink-0 text-xs">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                      {/* Quantity Control */}
                      <div className="flex items-center space-x-1 bg-black/5 rounded-full px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateItemQuantity(item.id, item.quantity - 1);
                            } else {
                              removeItem(item.id);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white hover:shadow-xs transition-colors cursor-pointer text-bento-text hover:text-strawberry"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] font-bold text-bento-text w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white hover:shadow-xs transition-colors cursor-pointer text-bento-text hover:text-strawberry"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 pt-2 text-[11px] sm:text-xs border-t border-black/5">
                <div className="flex justify-between text-bento-text">
                  <span>Subtotal</span>
                  <span className="font-medium text-bento-text">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-strawberry font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                {isGift && (
                  <div className="flex justify-between text-strawberry font-semibold">
                    <span>Gift Wrapping &amp; Card</span>
                    <span>+₹49</span>
                  </div>
                )}
                <div className="flex justify-between text-bento-text">
                  <span>GST ({Math.round(totals.taxRate * 100)}% Included)</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-bento-text">
                  <span>Pickup</span>
                  <span className="text-strawberry font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-bento-text pt-2 border-t border-black/5">
                  <span>Total</span>
                  <span className="text-strawberry">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Buttons directly under Order Summary */}
              <div className="pt-3 border-t border-black/5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleProcessPayment('total')}
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-strawberry text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-bento-yellow hover:text-bento-text transition-all shadow-md flex items-center justify-center space-x-1 disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Pay Total</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessPayment('advance')}
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-pink-50 border border-strawberry text-strawberry text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-pink-100 transition-all flex items-center justify-center space-x-1 disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  <Lock className="w-3 h-3" />
                  <span>Pay 50% Adv</span>
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>

      <CashfreeModal
        isOpen={showCashfreeModal}
        onClose={() => setShowCashfreeModal(false)}
        onSuccess={handleCashfreeSuccess}
        amountToPay={pendingPaymentType === 'advance' ? Math.round(grandTotal / 2) : grandTotal}
        totalGrandAmount={grandTotal}
        paymentType={pendingPaymentType}
        orderNumber={orderNumber}
        customerName={name}
        customerPhone={phone}
      />
    </div>
  );
};

