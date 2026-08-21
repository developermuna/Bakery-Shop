import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Car,
  Receipt,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '../utils/cartUtils';

export const ConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<any>(null);

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
    <div className="pt-28 pb-24 bg-bento-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-bento-yellow/20 text-bento-yellow rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold mb-2 block">
            Order Confirmed & Scheduled
          </span>
          <h1 className="text-3xl font-serif sm:text-4xl font-serif md:text-5xl font-serif  font-bold text-white mb-3">
            Thank You for Your Order!
          </h1>
          <p className="text-bento-grey text-sm sm:text-base font-light max-w-lg mx-auto">
            We've received your pickup order. A confirmation receipt and barcode has been sent to{' '}
            <strong className="text-white">{activeOrder.customer.email}</strong>.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 mb-8">
          {/* Order Number & Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
            <div>
              <span className="text-xs text-bento-grey uppercase tracking-wider block">Order Number</span>
              <span className="text-2xl font-mono font-bold text-white tracking-wide">
                #{activeOrder.orderNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-bento-yellow/15 text-white font-semibold text-xs shadow-md">
                <Clock className="w-3.5 h-3.5 text-bento-yellow" />
                <span>Scheduled for Baking</span>
              </span>
            </div>
          </div>

          {/* Pickup Details Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 rounded-2xl shadow-inner">
            <div className="space-y-3">
              <h3 className="text-sm  font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bento-yellow" />
                Pickup Date & Time
              </h3>
              <p className="text-sm text-white font-semibold">
                {activeOrder.pickup.date} • {activeOrder.pickup.timeSlot}
              </p>
              <p className="text-xs text-bento-grey font-light">
                Please present your order number <strong className="text-white">#{activeOrder.orderNumber}</strong> at the pickup counter.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm  font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-bento-yellow" />
                Bakery Pickup Location
              </h3>
              <p className="text-sm text-white font-semibold leading-tight">
                Bento Cakery & Sweets<br />
                <span className="font-normal text-xs text-bento-grey">Main Road, Near New Bus Stand, Rayagada, Odisha 765001</span>
              </p>
              <a
                href="https://maps.google.com/?q=Rayagada,+Odisha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white hover:text-bento-yellow transition-colors pt-1"
              >
                <span>Get Directions in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div className="bg-white/5 p-5 rounded-2xl shadow-md space-y-3">
            <h4 className="text-xs  font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-bento-yellow" />
              Pickup & Parking Guidance
            </h4>
            <ul className="text-xs text-bento-grey font-light space-y-1.5 list-disc list-inside">
              <li>
                <strong>Skip the regular bakery line:</strong> Head straight to the designated "Pickup Counter" located on the right side.
              </li>
              <li>
                <strong>Dedicated Parking:</strong> 15-minute quick collection parking spots are available directly behind the bakery via Maple Alley.
              </li>
              <li>
                <strong>Cake Handling:</strong> Keep your cake box level and store on the flat floor of your vehicle with AC running on warm days.
              </li>
            </ul>
          </div>

          {/* Full Itemized Summary */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg  font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-bento-yellow" />
              Itemized Receipt
            </h3>

            <div className="space-y-3">
              {activeOrder.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl shadow-sm text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg shadow-md"
                    />
                    <div>
                      <span className="font-semibold text-white text-sm block">
                        {item.name}
                      </span>
                      <span className="text-bento-grey text-xs">
                        {item.selectedSize?.label} {item.selectedFlavor ? `• ${item.selectedFlavor}` : ''} × {item.quantity}
                      </span>
                      {item.cakeMessage && (
                        <span className="text-[11px] text-bento-grey italic block">
                          Piped: “{item.cakeMessage}”
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-white text-sm">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="bg-black/30 p-4 rounded-xl shadow-inner space-y-1.5 text-xs">
              <div className="flex justify-between text-bento-grey">
                <span>Subtotal</span>
                <span className="font-medium text-white">
                  {formatCurrency(activeOrder.totals.subtotal)}
                </span>
              </div>
              {activeOrder.totals.discount > 0 && (
                <div className="flex justify-between text-bento-yellow font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(activeOrder.totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-bento-grey">
                <span>Sales Tax</span>
                <span>{formatCurrency(activeOrder.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-bento-grey">
                <span>In-Store Pickup</span>
                <span className="text-bento-yellow font-semibold">FREE</span>
              </div>
              <div className="pt-2 flex justify-between  font-bold text-base text-white">
                <span>Total Paid</span>
                <span>{formatCurrency(activeOrder.totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/menu"
            className="px-8 py-3.5 bg-bento-yellow text-black rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-soft inline-flex items-center justify-center space-x-2"
          >
            <span>Order Another Cake</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="px-8 py-3.5 bg-bento-yellow shadow-lg shadow-bento-yellow/20 text-black rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-bento-grey/40 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4 text-bento-yellow" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
