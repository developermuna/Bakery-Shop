import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, FileText, ChevronRight, HelpCircle, Phone, Mail, ArrowLeft } from 'lucide-react';

type PolicySection = 'shipping' | 'returns' | 'privacy' | 'terms';

export const PoliciesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<PolicySection>('shipping');

  // Handle URL query parameters or hash to set active tab & scroll to element
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section') as PolicySection | null;
    const hash = location.hash.replace('#', '') as PolicySection | null;

    const targetSection = sectionParam || hash;
    if (targetSection && ['shipping', 'returns', 'privacy', 'terms'].includes(targetSection)) {
      setActiveSection(targetSection as PolicySection);
      setTimeout(() => {
        const elem = document.getElementById(targetSection);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.search, location.hash]);

  const handleTabClick = (section: PolicySection) => {
    setActiveSection(section);
    navigate(`/policies?section=${section}`, { replace: true });
    const elem = document.getElementById(section);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center gap-2 text-xs text-bento-text/60 mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-strawberry transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
          <ChevronRight className="w-3 h-3 text-bento-text/30" />
          <span className="text-bento-text font-medium">Customer Policies</span>
        </div>

        {/* Header Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-black/5 mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-strawberry/10 text-strawberry font-semibold text-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Customer Care & Legal Center
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-bento-text mb-3">
              Policies & Store Guidelines
            </h1>
            <p className="text-xs sm:text-sm text-bento-text/70 leading-relaxed">
              Transparent, fair, and simple policies for your fresh artisanal bakery orders, custom cake bookings, local delivery, and data privacy.
            </p>
          </div>
        </div>

        {/* Sticky Tab Bar */}
        <div className="sticky top-20 z-20 bg-bento-bg/95 backdrop-blur-md py-3 mb-8 border-b border-black/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleTabClick('shipping')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeSection === 'shipping'
                  ? 'bg-strawberry text-white border-strawberry shadow-md'
                  : 'bg-white text-bento-text border-black/5 hover:border-black/15 shadow-xs'
              }`}
            >
              <Truck className="w-4 h-4" /> Shipping & Pickup
            </button>

            <button
              onClick={() => handleTabClick('returns')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeSection === 'returns'
                  ? 'bg-strawberry text-white border-strawberry shadow-md'
                  : 'bg-white text-bento-text border-black/5 hover:border-black/15 shadow-xs'
              }`}
            >
              <RotateCcw className="w-4 h-4" /> Return & Refund Policy
            </button>

            <button
              onClick={() => handleTabClick('privacy')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeSection === 'privacy'
                  ? 'bg-strawberry text-white border-strawberry shadow-md'
                  : 'bg-white text-bento-text border-black/5 hover:border-black/15 shadow-xs'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Privacy Policy
            </button>

            <button
              onClick={() => handleTabClick('terms')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeSection === 'terms'
                  ? 'bg-strawberry text-white border-strawberry shadow-md'
                  : 'bg-white text-bento-text border-black/5 hover:border-black/15 shadow-xs'
              }`}
            >
              <FileText className="w-4 h-4" /> Terms & Conditions
            </button>
          </div>
        </div>

        {/* All Policies Sections in One Scrollable Container */}
        <div className="space-y-10">

          {/* SECTION 1: SHIPPING & PICKUP */}
          <section id="shipping" className="scroll-mt-36 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-black/5">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-bento-text">Shipping & Pickup Policy</h2>
                <p className="text-xs text-bento-text/60">Guidelines for store pickups and local temperature-controlled deliveries</p>
              </div>
            </div>

            <div className="prose prose-sm text-bento-text/80 space-y-6 text-xs sm:text-sm leading-relaxed">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">1. In-Store Pickup</h3>
                <p className="mb-2">
                  All online orders placed for pickup can be collected directly from our main studio store at:
                </p>
                <div className="bg-bento-bg/50 p-3.5 rounded-2xl border border-black/5 text-xs text-bento-text font-medium mb-3">
                  📍 MK Bakery Studio • 123 Baker Street, Sweet District (Daily 9:00 AM – 8:00 PM)
                </div>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Time Slot Window:</strong> Please arrive during your chosen pickup time window selected during checkout.</li>
                  <li><strong>Modifying Pickup Time:</strong> If you need to reschedule or delay your pickup time, please contact us at least <strong>2 hours in advance</strong> at <a href="tel:+15551234567" className="text-strawberry font-semibold underline">(555) 123-4567</a>.</li>
                  <li><strong>Pickup Verification:</strong> Please bring your order confirmation email, SMS message, or order ID upon arrival.</li>
                  <li><strong>Transporting Cakes Safely:</strong> Cakes must be transported flat on the floor of an air-conditioned car. Avoid placing cake boxes on slanted vehicle seats or carrying them on two-wheelers.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">2. Local Doorstep Delivery</h3>
                <p className="mb-2">
                  We offer specialized temperature-controlled delivery within a 15-km radius of our studio to guarantee your cake arrives in pristine condition.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Delivery Fee:</strong> Delivery charges are distance-calculated and transparently displayed at checkout.</li>
                  <li><strong>Recipient Availability:</strong> The recipient or a designated representative must be present at the delivery location during the scheduled window.</li>
                  <li><strong>Redelivery Terms:</strong> If our driver cannot contact the recipient after 10 minutes at the destination, the order will be safely brought back to our bakery for self-pickup. Redelivery attempts will incur an additional delivery charge.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">3. Preparation Lead Times</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Standard Bakery & Ready Cakes:</strong> Require a minimum 24-hour advance booking notice.</li>
                  <li><strong>Bespoke Custom & Multi-Tier Cakes:</strong> Require at least <strong>72 hours advance notice</strong> due to hand-sculpted decorations and custom ingredient sourcing.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2: RETURN & REFUND POLICY */}
          <section id="returns" className="scroll-mt-36 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-black/5">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-bento-text">Return & Refund Policy</h2>
                <p className="text-xs text-bento-text/60">Fair guidelines for order cancellations, physical defects, and quality guarantees</p>
              </div>
            </div>

            <div className="prose prose-sm text-bento-text/80 space-y-6 text-xs sm:text-sm leading-relaxed">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">1. Perishable Food Items Notice</h3>
                <p>
                  Due to strict health, hygiene, and food safety regulations, <strong>edible products, freshly baked pastries, and custom cakes cannot be physically returned or exchanged</strong> once they have left our bakery studio or been accepted upon delivery.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">2. Order Cancellation Policy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs">
                    <span className="font-bold text-green-800 block mb-1">48+ Hours Notice</span>
                    <span className="text-green-700">100% Full Refund returned to original payment method.</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-800 block mb-1">24 - 48 Hours Notice</span>
                    <span className="text-amber-700">50% Refund (covers custom ingredient prep & labor).</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs">
                    <span className="font-bold text-red-800 block mb-1">Less than 24 Hours</span>
                    <span className="text-red-700">Non-refundable as baking and decorating is actively underway.</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">3. Damaged or Incorrect Orders</h3>
                <p className="mb-2">
                  We take intense pride in our craftsmanship. In the rare event that your cake arrives damaged during transport or differs significantly from your approved specifications (e.g., incorrect flavor or missing requested eggless option):
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Please notify our team within <strong>2 hours of receiving your order</strong>.</li>
                  <li>Provide clear photo or video evidence sent to <a href="mailto:support@mkbakery.com" className="text-strawberry font-semibold underline">support@mkbakery.com</a> or via WhatsApp at <a href="tel:+15551234567" className="text-strawberry font-semibold underline">(555) 123-4567</a>.</li>
                  <li>Upon inspection, we will immediately offer an emergency replacement, full store credit, or a complete refund.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">4. Refund Timeline</h3>
                <p>
                  Approved refunds will be processed back to your original source account (UPI, credit/debit card, or bank account) within <strong>3 to 7 business days</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRIVACY POLICY */}
          <section id="privacy" className="scroll-mt-36 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-black/5">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-bento-text">Privacy Policy</h2>
                <p className="text-xs text-bento-text/60">How we collect, protect, and handle your personal details and custom photo uploads</p>
              </div>
            </div>

            <div className="prose prose-sm text-bento-text/80 space-y-6 text-xs sm:text-sm leading-relaxed">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">1. Information We Collect</h3>
                <p className="mb-2">When you place an order or interact with our store platform, we collect:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Contact Details:</strong> Name, phone number, email address, and delivery physical address.</li>
                  <li><strong>Order Customizations:</strong> Custom cake text, flavor choices, eggless dietary preferences, and images uploaded for edible photo prints.</li>
                  <li><strong>Payment Transactions:</strong> Payment status processed via encrypted PCI-DSS compliant payment gateways (Cashfree / Razorpay). We never store raw card numbers or passwords.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">2. How We Use Your Data</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Fulfilling your cake orders, managing pickup schedules, and coordinating local delivery dispatch.</li>
                  <li>Sending automated order status updates, delivery tracking SMS/WhatsApp messages, and pickup reminders.</li>
                  <li>Customer service support and addressing specific dietary or design queries.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">3. Handling Custom Uploaded Photos</h3>
                <p>
                  Any photos uploaded for Photo/Edible Print Cakes are strictly used for print production. Custom images are automatically deleted from our production servers within <strong>30 days</strong> of completed order fulfillment.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">4. Third-Party Sharing</h3>
                <p>
                  We strictly <strong>do not sell, trade, or rent</strong> your personal information to third parties. Data is shared exclusively with necessary operational partners (such as delivery couriers and payment processors) solely to fulfill your order.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: TERMS & CONDITIONS */}
          <section id="terms" className="scroll-mt-36 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-black/5">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-bento-text">Terms & Conditions</h2>
                <p className="text-xs text-bento-text/60">Official store terms, allergen disclaimers, and legal agreements</p>
              </div>
            </div>

            <div className="prose prose-sm text-bento-text/80 space-y-6 text-xs sm:text-sm leading-relaxed">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing our website, customizing a cake, or submitting an order, you agree to comply with these Terms & Conditions. MK Bakery reserves the right to update these terms at any time.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">2. Artisanal Handcrafted Variations</h3>
                <p>
                  Each cake is an individually handcrafted piece of edible art. Minor color variations, piping details, or structural shading may occur compared to online reference samples or inspirational photos provided.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">3. Allergen & Food Safety Disclaimer</h3>
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs mb-3">
                  <strong>⚠️ Kitchen Allergen Notice:</strong> Although we offer dedicated <strong>Eggless</strong> options and adhere to strict sanitary segregation procedures, our bakery facility actively processes wheat, gluten, dairy, tree nuts, peanuts, and soy.
                </div>
                <p>
                  Customers are required to disclose severe life-threatening allergies at checkout. MK Bakery cannot guarantee 100% airborne allergen-free environments for airborne nut or gluten sensitivities.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">4. Image Rights & Social Media</h3>
                <p>
                  When uploading a photo for an edible print cake, you confirm that you possess all necessary copyright permissions. MK Bakery reserves the right to capture and publish photographs of finished bespoke cakes on our portfolio and social channels.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-bento-text mb-2">5. Limitation of Liability</h3>
                <p>
                  In no event shall MK Bakery be held liable for indirect, incidental, or consequential damages exceeding the actual invoice value paid for your order.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Contact Support Footer Card */}
        <div className="mt-12 bg-gradient-to-br from-strawberry to-[#C91E5D] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-serif font-bold flex items-center justify-center sm:justify-start gap-2">
              <HelpCircle className="w-5 h-5" /> Have Questions About Our Policies?
            </h3>
            <p className="text-xs text-white/90">
              Our customer care team is available daily from 9:00 AM to 8:00 PM to help you.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a 
              href="tel:+15551234567" 
              className="px-4 py-2.5 bg-white text-strawberry rounded-2xl font-bold text-xs hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> (555) 123-4567
            </a>
            <a 
              href="mailto:support@mkbakery.com" 
              className="px-4 py-2.5 bg-white/10 text-white border border-white/30 rounded-2xl font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Email Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
