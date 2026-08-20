import React from 'react';
import { MapPin, Clock, Phone, Mail, Car, Info, ExternalLink } from 'lucide-react';

interface LocationProps {
  mapUrl?: string;
  directionsUrl?: string;
}

export const Location: React.FC<LocationProps> = ({ 
  mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60064.65451996538!2d83.3768846397262!3d19.167878342410313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c9b741fa21bc9%3A0x7d39ef1a690e54d3!2sRayagada%2C%20Odisha!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
  directionsUrl = "https://maps.google.com/?q=Rayagada,+Odisha"
}) => {
  return (
    <section id="location" className="py-24 bg-beige relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-cream rounded-full mix-blend-overlay filter blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-4">Visit Our Bakery</h2>
          <p className="text-lg text-brown max-w-2xl mx-auto font-light">
            Your sweet moments are waiting for you in Rayagada. Find us here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-cream rounded-3xl overflow-hidden shadow-soft max-w-6xl mx-auto">
          {/* Details Column */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
            <div className="space-y-8">
              
              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif text-espresso mb-2">Location</h3>
                  <p className="text-brown font-light mb-3">
                    Main Road, Near New Bus Stand<br />
                    Rayagada, Odisha 765001
                  </p>
                  <a 
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-espresso bg-beige px-4 py-2 rounded-full hover:bg-gold hover:text-espresso transition-colors focus:outline-none focus:ring-2 focus:ring-espresso"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif text-espresso mb-2">Hours</h3>
                  <ul className="text-brown font-light space-y-1">
                    <li className="flex justify-between w-48">
                      <span>Mon - Fri</span>
                      <span className="font-medium text-espresso">7am - 6pm</span>
                    </li>
                    <li className="flex justify-between w-48">
                      <span>Saturday</span>
                      <span className="font-medium text-espresso">8am - 5pm</span>
                    </li>
                    <li className="flex justify-between w-48">
                      <span>Sunday</span>
                      <span className="font-medium text-espresso">8am - 2pm</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-4 border-t border-beige pt-8">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-sm font-serif text-espresso font-bold mb-1">Call Us</h3>
                    <a href="tel:+15551234567" className="text-brown font-light hover:text-gold transition-colors block">
                      (555) 123-4567
                    </a>
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-espresso font-bold mb-1 flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gold inline mr-1" /> Email Us
                    </h3>
                    <a href="mailto:hello@mkbakery.com" className="text-brown font-light hover:text-gold transition-colors block">
                      hello@mkbakery.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Pickup & Parking Instructions */}
              <div className="bg-beige/50 p-6 rounded-2xl space-y-4 border border-beige">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-espresso flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brown font-light leading-relaxed">
                    <strong className="font-medium text-espresso block mb-1">Pickup Instructions</strong>
                    Please have your order number ready. Skip the main line and head directly to the "Order Pickup" counter on the right.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Car className="w-5 h-5 text-espresso flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brown font-light leading-relaxed">
                    <strong className="font-medium text-espresso block mb-1">Parking</strong>
                    Dedicated 15-minute pickup parking is available directly behind the bakery (entrance via Maple Alley).
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Map and Visuals Column */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Embedded Map */}
            <div className="h-64 lg:h-1/2 w-full bg-off-white">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bakery Location Map"
                className="grayscale contrast-75 brightness-110"
              />
            </div>
            
            {/* Bakery Photo */}
            <div className="h-64 lg:h-1/2 w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80" 
                alt="Bakery storefront" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-espresso/20 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
