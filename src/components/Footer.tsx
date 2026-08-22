import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Truck, RotateCcw, X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstallPWA } from './InstallPWA';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [activePolicyModal, setActivePolicyModal] = useState<'shipping' | 'return' | 'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#1A1110] text-white pt-8 pb-6 relative">
      <div className="container mx-auto px-6">
        {/* 2 columns on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-3.5 col-span-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-lg shrink-0">
                <img src="https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp" alt="MK Bakery Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-base font-serif font-bold tracking-tight leading-none">
                  <span className="text-strawberry">MK</span>
                  <span className="text-white font-bold tracking-wider">BAKERY</span>
                </div>
                <span className="text-[8px] font-sans tracking-widest uppercase mt-0.5 text-white/80">Baked with Love</span>
              </div>
            </div>
            <p className="text-xs text-white/80 font-light leading-relaxed">
              Crafting sweet moments fresh daily with love in Rayagada.
            </p>

            {/* Direct Contact Phone, Email & WhatsApp */}
            <div className="flex flex-col gap-2 pt-1">
              <a 
                href="tel:+15551234567" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-strawberry transition-colors w-fit"
              >
                <Phone className="w-3.5 h-3.5 text-strawberry flex-shrink-0" />
                <span className="truncate">+1 (555) 123-4567</span>
              </a>

              <a 
                href="mailto:hello@bentocakery.com" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-strawberry transition-colors w-fit"
              >
                <Mail className="w-3.5 h-3.5 text-strawberry flex-shrink-0" />
                <span className="truncate">hello@bentocakery.com</span>
              </a>

              <a 
                href="https://wa.me/15551234567" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-emerald-400 transition-colors w-fit"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">WhatsApp Chat</span>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="col-span-1 pl-2 sm:pl-0">
            <h4 className="font-serif text-base sm:text-lg font-bold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 font-light text-xs text-white/80">
              <li><Link to="/menu" className="hover:text-strawberry transition-colors block">Our Menu</Link></li>
              <li><Link to="/bakery" className="hover:text-strawberry transition-colors block">Bakery Collection</Link></li>
              <li><Link to="/decorations" className="hover:text-strawberry transition-colors block">Party Decorations</Link></li>
              <li><a href="/#custom" className="hover:text-strawberry transition-colors block">Custom Cakes</a></li>
              <li><a href="/#how-it-works" className="hover:text-strawberry transition-colors block">How Pickup Works</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Policies */}
          <div className="col-span-1">
            <h4 className="font-serif text-base sm:text-lg font-bold mb-3 text-white">Policies</h4>
            <ul className="space-y-2 font-light text-xs text-white/80">
              <li><Link to="/policies?section=privacy" className="hover:text-strawberry transition-colors block">Privacy Policy</Link></li>
              <li><Link to="/policies?section=terms" className="hover:text-strawberry transition-colors block">Terms of Service</Link></li>
              <li><Link to="/policies?section=shipping" className="hover:text-strawberry transition-colors block">Shipping & Pickup</Link></li>
              <li><Link to="/policies?section=returns" className="hover:text-strawberry transition-colors block">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Store Hours */}
          <div className="col-span-1 pl-2 sm:pl-0">
            <h4 className="font-serif text-base sm:text-lg font-bold mb-3 text-white">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5 mb-4">
              <a 
                href="https://wa.me/15551234567" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white text-emerald-400 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 hover:text-white text-white/90 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white text-white/90 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 hover:text-white text-white/90 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
            <div className="text-[11px] text-white/60 font-light">
              <span className="block font-semibold text-white/80 mb-0.5">Pickup Hours:</span>
              <span>Mon - Sun: 8 AM - 10 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-light text-white/60 gap-4 md:gap-3">
          <div className="flex items-center gap-2">
            &copy; {new Date().getFullYear()} MK Bakery. All rights reserved.
            <InstallPWA />
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
            <Link to="/policies?section=privacy" className="hover:text-strawberry transition-colors">Privacy Policy</Link>
            <Link to="/policies?section=terms" className="hover:text-strawberry transition-colors">Terms of Service</Link>
            <Link to="/policies?section=returns" className="hover:text-strawberry transition-colors">Return Policy</Link>
            <Link to="/policies?section=shipping" className="hover:text-strawberry transition-colors">Shipping & Pickup</Link>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a href="https://www.munakousalya.online" target="_blank" rel="noopener noreferrer" className="hover:text-strawberry transition-colors font-medium">Developed by MK Group</a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <Link to="/admin" className="hover:text-strawberry transition-colors font-medium">Admin Panel</Link>
          </div>
        </div>
      </div>

      {/* Policy Details Modal */}
      <AnimatePresence>
        {activePolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePolicyModal(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-white text-bento-text rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="absolute top-5 right-5 p-2 text-bento-text/50 hover:text-bento-text hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {activePolicyModal === 'shipping' && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-strawberry/10 text-strawberry flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-strawberry font-bold block">
                        MK Bakery Guidelines
                      </span>
                      <h3 className="text-xl font-serif font-bold text-bento-text">
                        Pickup & Shipping Policy
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-bento-text/80 leading-relaxed font-light">
                    <div className="bg-pink-50/70 p-3.5 rounded-xl border border-pink-100/80">
                      <h6 className="font-bold text-bento-text mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-strawberry" />
                        In-Store Pickup (Fresh Cakes & Pastries)
                      </h6>
                      <p>
                        All artisan bento cakes, birthday cakes, and daily baked bakery items are handcrafted fresh for your scheduled pickup slot at our Rayagada location (Main Road, Near New Bus Stand). We hold your order in refrigerated display units until you arrive.
                      </p>
                    </div>

                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Pickup Time Slots:</h6>
                      <p>
                        Please choose your preferred pickup date and time window at checkout. If you need to modify your pickup time, contact us at least 2 hours in advance at <a href="tel:+15551234567" className="font-semibold text-strawberry">(555) 123-4567</a>.
                      </p>
                    </div>

                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Party Decorations Dispatch:</h6>
                      <p>
                        Non-perishable party decorations (balloons, candle sets, sparklers, party hats) can either be bundled with your cake pickup or shipped via regional express courier within 2–4 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'return' && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-bento-yellow/20 text-bento-text flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-bento-yellow" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-strawberry font-bold block">
                        MK Bakery Guidelines
                      </span>
                      <h3 className="text-xl font-serif font-bold text-bento-text">
                        Cancellation & Return Policy
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-bento-text/80 leading-relaxed font-light">
                    <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
                      <h6 className="font-bold text-bento-text mb-1">Fresh & Custom Baked Goods:</h6>
                      <p>
                        Due to food safety standards and the custom perishability of artisanal bakery products, baked goods cannot be returned or refunded once inspected and accepted at pickup.
                      </p>
                    </div>

                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Order Cancellations:</h6>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Standard Menu Items:</strong> Free cancellation up to 4 hours before your pickup slot.</li>
                        <li><strong>Custom & Image Cakes:</strong> 50% refund for cancellations made at least 24 hours prior to pickup, as custom ingredients and preparation begin early.</li>
                      </ul>
                    </div>

                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Party Decoration Returns:</h6>
                      <p>
                        Unopened party supplies in original packaging can be returned or exchanged in-store within 7 days of purchase with your digital receipt.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'privacy' && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-strawberry font-bold block">
                        MK Bakery Guidelines
                      </span>
                      <h3 className="text-xl font-serif font-bold text-bento-text">
                        Privacy Policy
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-bento-text/80 leading-relaxed font-light">
                    <p>
                      At MK Bakery, we respect your privacy and are committed to protecting the personal information you share with us when ordering online or creating custom celebration cakes.
                    </p>
                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Information We Collect:</h6>
                      <p>
                        We collect your name, phone number, email address, and order customizations solely for preparing your bakery order and coordinating store pickup.
                      </p>
                    </div>
                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Payment Security:</h6>
                      <p>
                        All payments (UPI, Credit/Debit Cards, Net Banking) are securely processed through end-to-end encrypted gateways. We never store your full payment card credentials on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'terms' && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-strawberry font-bold block">
                        MK Bakery Guidelines
                      </span>
                      <h3 className="text-xl font-serif font-bold text-bento-text">
                        Terms of Service
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-bento-text/80 leading-relaxed font-light">
                    <p>
                      By placing an order on our platform, you agree to adhere to MK Bakery's pickup schedule, dietary notification requirements, and customization specifications.
                    </p>
                    <div>
                      <h6 className="font-bold text-bento-text mb-1">Pickup Timelines:</h6>
                      <p>
                        Fresh cakes are scheduled for specific pickup windows. Uncollected orders will be preserved in refrigeration for up to 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-black/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(null)}
                  className="px-6 py-2.5 bg-bento-text text-white text-xs font-bold rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

