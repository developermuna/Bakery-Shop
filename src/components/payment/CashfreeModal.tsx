import React, { useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  QrCode,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Check,
} from 'lucide-react';

interface CashfreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (details: {
    txnId: string;
    method: string;
    amountPaid: number;
    paymentType: 'full' | 'advance';
    balanceDue: number;
  }) => void;
  amountToPay: number;
  totalGrandAmount: number;
  paymentType: 'full' | 'advance';
  orderNumber: string;
  customerName: string;
  customerPhone: string;
}

export const CashfreeModal: React.FC<CashfreeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amountToPay,
  totalGrandAmount,
  paymentType,
  orderNumber,
  customerName,
  customerPhone,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const [paymentState, setPaymentState] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const balanceDue = paymentType === 'advance' ? Math.max(0, totalGrandAmount - amountToPay) : 0;

  const handleUpiIntent = (appName: string, defaultVpa: string) => {
    setUpiId(defaultVpa);
    setSelectedMethod('upi');
    setPaymentState('processing');
    const generatedTxnId = `CF_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setTxnId(generatedTxnId);

    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        onSuccess({
          txnId: generatedTxnId,
          method: `UPI Intent (${appName})`,
          amountPaid: amountToPay,
          paymentType,
          balanceDue,
        });
      }, 1200);
    }, 2000);
  };

  const handlePay = () => {
    setPaymentState('processing');
    const generatedTxnId = `CF_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setTxnId(generatedTxnId);

    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        let methodLabel = 'UPI / QR Code';
        if (selectedMethod === 'card') methodLabel = 'Credit/Debit Card';
        if (selectedMethod === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
        if (selectedMethod === 'wallet') methodLabel = `Wallet (${selectedWallet})`;

        onSuccess({
          txnId: generatedTxnId,
          method: methodLabel,
          amountPaid: amountToPay,
          paymentType,
          balanceDue,
        });
      }, 1200);
    }, 2000);
  };

  const autofillTestCard = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('12/28');
    setCardCvv('789');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 font-sans flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto overflow-hidden">
        
        {/* Cashfree Top Header */}
        <div className="bg-[#0A1128] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-extrabold text-white text-lg tracking-tighter">cf</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-base tracking-wide">Cashfree</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  DEMO GATEWAY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>100% Encrypted &amp; Secured Payment</span>
              </p>
            </div>
          </div>

          {paymentState === 'checkout' && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Order Details Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
          <div>
            <span className="text-slate-500 block text-[11px]">
              Merchant: <strong className="text-slate-800">Bento Cakery</strong> {customerName ? `• ${customerName}` : ''}
            </span>
            <span className="font-mono text-slate-600">Order: #{orderNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">
              {paymentType === 'advance' ? '50% Advance Payable' : 'Total Amount'}
            </span>
            <span className="text-lg font-bold text-slate-900">₹{amountToPay.toLocaleString('en-IN')}</span>
            {paymentType === 'advance' && (
              <span className="text-[10px] text-amber-600 font-medium block">
                (Balance ₹{balanceDue.toLocaleString('en-IN')} at pickup)
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          {paymentState === 'checkout' && (
            <div className="space-y-4">
              {/* Payment Methods Nav Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`py-2 px-1 rounded-lg flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`py-2 px-1 rounded-lg flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px]">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`py-2 px-1 rounded-lg flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px]">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`py-2 px-1 rounded-lg flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    selectedMethod === 'wallet'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-[10px]">Wallets</span>
                </button>
              </div>

              {/* Tab 1: UPI */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  
                  {/* UPI App Intent Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Pay via Installed UPI App (Direct Intent)</span>
                      </label>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                        Fastest
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpiIntent('Google Pay', 'gpay@okaxis')}
                        className="p-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-sky-600 text-[10px] group-hover:scale-105 transition-transform">
                          GPay
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">Google Pay</span>
                          <span className="text-[9px] text-sky-600 font-medium block">App Intent</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpiIntent('PhonePe', 'phonepe@ybl')}
                        className="p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-600 shadow-xs flex items-center justify-center font-bold text-white text-[10px] group-hover:scale-105 transition-transform">
                          Pe
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">PhonePe</span>
                          <span className="text-[9px] text-purple-600 font-medium block">App Intent</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpiIntent('Paytm UPI', 'paytm@paytm')}
                        className="p-2.5 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-900 shadow-xs flex items-center justify-center font-bold text-sky-300 text-[9px] group-hover:scale-105 transition-transform">
                          Paytm
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">Paytm UPI</span>
                          <span className="text-[9px] text-cyan-600 font-medium block">App Intent</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpiIntent('BHIM UPI', 'bhim@upi')}
                        className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-500 shadow-xs flex items-center justify-center font-bold text-white text-[9px] group-hover:scale-105 transition-transform">
                          BHIM
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">BHIM UPI</span>
                          <span className="text-[9px] text-orange-600 font-medium block">App Intent</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpiIntent('CRED Pay', 'cred@axis')}
                        className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center font-bold text-emerald-400 text-[9px] group-hover:scale-105 transition-transform">
                          CRED
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">CRED Pay</span>
                          <span className="text-[9px] text-emerald-600 font-medium block">App Intent</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpiIntent('WhatsApp Pay', 'wa@upi')}
                        className="p-2.5 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 shadow-xs flex items-center justify-center font-bold text-white text-[9px] group-hover:scale-105 transition-transform">
                          WA
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block leading-tight truncate">WhatsApp</span>
                          <span className="text-[9px] text-emerald-600 font-medium block">App Intent</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-semibold uppercase">Or Scan / Enter VPA</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* QR Code & VPA Input */}
                  <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-100 text-center">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">Scan &amp; Pay using any UPI App</span>
                    <div className="w-28 h-28 bg-white p-2 rounded-xl mx-auto shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                      <QrCode className="w-20 h-20 text-slate-800" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Supports Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">Or enter UPI ID / VPA</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. mobileNumber@upi / username@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId(`${customerPhone || '9876543210'}@paytm`)}
                        className="px-2.5 py-1.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        Autofill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Credit / Debit Card */}
              {selectedMethod === 'card' && (
                <div className="space-y-3 pt-1 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">Enter Card Details</label>
                    <button
                      type="button"
                      onClick={autofillTestCard}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                    >
                      Auto-fill Demo Card
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (4111 2222 3333 4444)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV (123)"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-3 pt-1 animate-fade-in">
                  <label className="text-xs font-semibold text-slate-700 block">Select Popular Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 text-xs rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Wallet */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-3 pt-1 animate-fade-in">
                  <label className="text-xs font-semibold text-slate-700 block">Select Wallet</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'MobiKwik', 'Freecharge', 'LazyPay'].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-2.5 text-xs rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedWallet === wallet
                            ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{wallet}</span>
                        {selectedWallet === wallet && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Action Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{amountToPay.toLocaleString('en-IN')} via Cashfree</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-400">
                  🔒 Cashfree Payments • 256-Bit SSL Encrypted • PCI-DSS Certified
                </span>
              </div>
            </div>
          )}

          {/* Processing Screen */}
          {paymentState === 'processing' && (
            <div className="py-10 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Processing Payment...</h3>
                <p className="text-xs text-slate-500 mt-1">Connecting securely with Cashfree gateway &amp; bank</p>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">Ref: {txnId}</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {paymentState === 'success' && (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">
                  Cashfree Transaction Approved
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Payment Successful!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  ₹{amountToPay.toLocaleString('en-IN')} received via Cashfree
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Txn ID: {txnId}</p>
              </div>
              <p className="text-xs text-indigo-600 font-semibold animate-pulse pt-2">
                Redirecting to order summary...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
