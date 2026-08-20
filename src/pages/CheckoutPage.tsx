import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency, getAvailablePickupSlots, getEarliestPickupDate, isDateValidForPickup } from '../utils/cartUtils';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    orderNotes,
    globalPickupDate,
    globalPickupTimeSlot,
    setGlobalPickup,
    setOrderNotes,
    getTotals,
    clearCart,
  } = useCartStore();

  const { addToast } = useToastStore();
  const totals = getTotals();

  // Wizard Step: 2 = Pickup & Customer Info, 3 = Payment
  const [currentStep, setCurrentStep] = useState<2 | 3>(2);

  // Customer Details Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const earliestDateStr = getEarliestPickupDate(totals.maxLeadTimeHours || 24);
  const [pickupDate, setPickupDateLocal] = useState(globalPickupDate || earliestDateStr);
  const [pickupTimeSlot, setPickupTimeSlotLocal] = useState(globalPickupTimeSlot || '10:00 AM - 11:00 AM');
  const [notes, setNotes] = useState(orderNotes);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment Form State (Stripe Mockup)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableSlots = getAvailablePickupSlots(pickupDate);

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required';
    if (!phone.trim() || phone.length < 7) errors.phone = 'Valid phone number is required';
    
    const dateCheck = isDateValidForPickup(pickupDate, totals.maxLeadTimeHours);
    if (!dateCheck.valid) {
      errors.pickupDate = dateCheck.reason || 'Invalid pickup date';
    }

    if (!pickupTimeSlot) {
      errors.pickupTimeSlot = 'Pickup time slot is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
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
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardExpiry || !cardCvc) {
      addToast({
        type: 'error',
        title: 'Payment Details Incomplete',
        description: 'Please enter a valid mock card number, expiry, and CVC.',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment intent confirmation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderNumber = `MK-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}`;

    const orderData = {
      orderNumber,
      customer: { name, email, phone },
      pickup: { date: pickupDate, timeSlot: pickupTimeSlot },
      items: [...items],
      totals: { ...totals },
      notes,
      placedAt: new Date().toISOString(),
    };

    // Save order data to sessionStorage for confirmation page
    sessionStorage.setItem('mk_last_order', JSON.stringify(orderData));

    // Save to global order store
    useOrderStore.getState().addOrder({
      id: orderId,
      orderNumber,
      customer: { name, email, phone },
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.unitPrice,
        quantity: i.quantity,
        size: i.selectedSize?.label,
        flavor: i.selectedFlavor,
        eggless: i.dietaryNotes?.toLowerCase().includes('eggless') || false,
        message: i.cakeMessage
      })),
      pickupDate,
      pickupTimeSlot,
      totals: { ...totals },
      notes,
      status: 'New',
      createdAt: new Date().toISOString(),
    });

    clearCart();
    setIsProcessing(false);

    navigate('/confirmation');
  };

  if (items.length === 0 && currentStep === 2) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen text-center px-4">
        <div className="max-w-md mx-auto bg-off-white p-8 rounded-3xl border border-beige shadow-soft">
          <h2 className="text-2xl font-serif font-bold text-bento-black mb-3">No Items in Cart</h2>
          <p className="text-xs text-bento-grey font-light mb-6">
            Your cart is currently empty. Please select cakes from our menu before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-bento-black text-cream text-xs font-semibold rounded-full"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Step Indicator: Cart → Pickup Details → Payment → Confirmation */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-beige -z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-bento-yellow text-bento-black font-bold text-xs flex items-center justify-center ring-4 ring-cream shadow-xs">
                ✓
              </div>
              <span className="text-xs text-bento-grey/70 mt-2">1. Your Cart</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ring-4 ring-cream ${
                  currentStep === 2
                    ? 'bg-bento-black text-cream shadow-sm'
                    : 'bg-bento-yellow text-bento-black'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span
                className={`text-xs mt-2 ${
                  currentStep === 2 ? 'font-semibold text-bento-black' : 'text-bento-grey/70'
                }`}
              >
                2. Pickup Details
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full font-medium text-xs flex items-center justify-center ring-4 ring-cream ${
                  currentStep === 3
                    ? 'bg-bento-black text-cream shadow-sm'
                    : 'bg-beige text-bento-grey'
                }`}
              >
                3
              </div>
              <span
                className={`text-xs mt-2 ${
                  currentStep === 3 ? 'font-semibold text-bento-black' : 'text-bento-grey/70'
                }`}
              >
                3. Payment
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-beige text-bento-grey font-medium text-xs flex items-center justify-center ring-4 ring-cream">
                4
              </div>
              <span className="text-xs text-bento-grey/70 mt-2">4. Confirmation</span>
            </div>
          </div>
        </div>

        {/* Pickup Notice */}
        <div className="bg-beige/60 border border-beige rounded-2xl px-5 py-3 mb-8 flex items-center justify-between text-xs text-bento-grey">
          <div className="flex items-center space-x-2 font-medium text-bento-black">
            <MapPin className="w-4 h-4 text-bento-yellow flex-shrink-0" />
            <span>Pickup Location: Main Road, Near New Bus Stand, Rayagada, Odisha</span>
          </div>
          <span className="text-[11px] text-bento-grey font-light hidden sm:inline">
            Free Curbside & Counter Collection
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Step Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {currentStep === 2 ? (
              /* STEP 2: Customer Contact & Pickup Details */
              <form
                onSubmit={handleContinueToPayment}
                className="bg-off-white border border-beige rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
              >
                <div className="border-b border-beige pb-4">
                  <h2 className="text-2xl font-serif font-bold text-bento-black">
                    Customer & Pickup Details
                  </h2>
                  <p className="text-xs text-bento-grey font-light mt-1">
                    We will send your pickup barcode and order confirmation to this contact.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-serif font-bold text-bento-black">
                    Contact Information
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-bento-black mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={`w-full bg-cream border rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow ${
                        formErrors.name ? 'border-red-500' : 'border-beige'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bento-black mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className={`w-full bg-cream border rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow ${
                          formErrors.email ? 'border-red-500' : 'border-beige'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-bento-black mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 019-2834"
                        className={`w-full bg-cream border rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow ${
                          formErrors.phone ? 'border-red-500' : 'border-beige'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pickup Scheduling Details */}
                <div className="space-y-4 pt-4 border-t border-beige">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-serif font-bold text-bento-black flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-bento-yellow" />
                      Pickup Time & Date
                    </h3>
                    <span className="text-[11px] font-semibold text-bento-yellow bg-bento-yellow/10 px-2 py-0.5 rounded-full">
                      Min {totals.maxLeadTimeHours}h notice required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-bento-black mb-1">
                        Pickup Date *
                      </label>
                      <input
                        type="date"
                        min={earliestDateStr}
                        value={pickupDate}
                        onChange={(e) => setPickupDateLocal(e.target.value)}
                        className={`w-full bg-cream border rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow ${
                          formErrors.pickupDate ? 'border-red-500' : 'border-beige'
                        }`}
                      />
                      {formErrors.pickupDate && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.pickupDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-bento-black mb-1">
                        Pickup Time Slot *
                      </label>
                      <select
                        value={pickupTimeSlot}
                        onChange={(e) => setPickupTimeSlotLocal(e.target.value)}
                        className={`w-full bg-cream border rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow ${
                          formErrors.pickupTimeSlot ? 'border-red-500' : 'border-beige'
                        }`}
                      >
                        {availableSlots.map((slot) => (
                          <option key={slot.id} value={slot.time} disabled={!slot.available}>
                            {slot.time} {!slot.available ? '(Booked)' : ''}
                          </option>
                        ))}
                      </select>
                      {formErrors.pickupTimeSlot && (
                        <p className="text-[11px] text-red-600 mt-1">
                          {formErrors.pickupTimeSlot}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-4 border-t border-beige">
                  <label className="block text-xs font-semibold text-bento-black mb-1">
                    Special Pickup Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please box each slice individually"
                    className="w-full bg-cream border border-beige rounded-xl p-3 text-xs text-bento-black focus:outline-none focus:border-bento-yellow"
                  />
                </div>

                {/* Submit to Step 3 */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-bento-grey hover:text-bento-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Cart</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-bento-black text-cream text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-bento-black/90 transition-colors shadow-soft inline-flex items-center space-x-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 3: Payment (Stripe Mockup Element) */
              <form
                onSubmit={handleProcessPayment}
                className="bg-off-white border border-beige rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
              >
                <div className="border-b border-beige pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-bento-black">
                      Payment Details
                    </h2>
                    <p className="text-xs text-bento-grey font-light mt-1">
                      Encrypted 256-Bit SSL payment processing via Stripe.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-bento-yellow/15 text-bento-yellow flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>

                {/* Customer Review Recap */}
                <div className="bg-cream p-4 rounded-2xl border border-beige text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-bento-grey">Customer:</span>
                    <strong className="text-bento-black">{name} ({phone})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bento-grey">Scheduled Pickup:</span>
                    <strong className="text-bento-black">{pickupDate} at {pickupTimeSlot}</strong>
                  </div>
                </div>

                {/* Stripe Elements Mock Card Field */}
                <div className="space-y-4 pt-2">
                  <label className="block text-xs font-semibold text-bento-black flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-bento-yellow" />
                    Credit / Debit Card
                  </label>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full bg-cream border border-beige rounded-xl px-4 py-3 text-sm text-bento-black font-mono tracking-wider focus:outline-none focus:border-bento-yellow"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-cream border border-beige rounded-xl px-3 py-2.5 text-xs text-bento-black text-center font-mono focus:outline-none focus:border-bento-yellow"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full bg-cream border border-beige rounded-xl px-3 py-2.5 text-xs text-bento-black text-center font-mono focus:outline-none focus:border-bento-yellow"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardZip}
                          onChange={(e) => setCardZip(e.target.value)}
                          placeholder="ZIP Code"
                          className="w-full bg-cream border border-beige rounded-xl px-3 py-2.5 text-xs text-bento-black text-center focus:outline-none focus:border-bento-yellow"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-beige/40 p-4 rounded-2xl border border-beige flex items-center space-x-3 text-xs text-bento-grey">
                  <ShieldCheck className="w-5 h-5 text-bento-yellow flex-shrink-0" />
                  <p>
                    Your card will be charged{' '}
                    <strong className="text-bento-black">{formatCurrency(totals.total)}</strong> upon
                    confirmation. We will begin fresh baking according to your pickup time.
                  </p>
                </div>

                {/* Submit Payment */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-bento-grey hover:text-bento-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Pickup Details</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-3.5 bg-bento-black text-cream text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-bento-black/90 transition-colors shadow-soft inline-flex items-center space-x-2 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay {formatCurrency(totals.total)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-off-white border border-beige rounded-3xl p-6 sm:p-8 shadow-soft space-y-5 sticky top-24">
              <h3 className="font-serif font-bold text-bento-black text-xl pb-3 border-b border-beige">
                Order Summary ({totals.itemCount} items)
              </h3>

              {/* Items Miniature List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-beige flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-medium text-bento-black block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-bento-grey">
                          {item.selectedSize?.label} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-bento-black flex-shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-beige text-xs">
                <div className="flex justify-between text-bento-grey">
                  <span>Subtotal</span>
                  <span className="font-medium text-bento-black">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-bento-yellow font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-bento-grey">
                  <span>Sales Tax ({Math.round(totals.taxRate * 100)}%)</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-bento-grey">
                  <span>Pickup</span>
                  <span className="text-bento-yellow font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-bento-black pt-3 border-t border-beige font-serif">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Security guarantee */}
              <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-bento-grey font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-bento-yellow" />
                <span>Verified Fresh Baked on Order Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
