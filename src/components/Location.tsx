import React from "react";
import { MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";

interface LocationProps {
  mapUrl?: string;
  directionsUrl?: string;
}

export const Location: React.FC<LocationProps> = ({
  mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60064.65451996538!2d83.3768846397262!3d19.167878342410313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c9b741fa21bc9%3A0x7d39ef1a690e54d3!2sRayagada%2C%20Odisha!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
  directionsUrl = "https://maps.google.com/?q=Rayagada,+Odisha",
}) => {
  return (
    <section
      id="location"
      className="pt-4 pb-12 bg-transparent relative overflow-hidden flex flex-col justify-center"
    >
      {/* Decorative background element */}
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-pink-400/20 rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-white mb-3 drop-shadow-xl tracking-tight leading-tight">
            Visit Our Bakery
          </h2>
          <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto font-medium drop-shadow-md">
            Your sweet moments are waiting for you in Rayagada. Find us here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto border border-white/40">
          {/* Details Column (40% width) */}
          <div className="w-full lg:w-[40%] py-6 px-6 md:py-8 md:px-8 bg-white">
            <div className="space-y-6 md:space-y-7">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-strawberry flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif text-bento-text mb-1.5 font-bold">
                    Location
                  </h3>
                  <p className="text-bento-text font-light mb-3 text-sm">
                    Main Road, Near New Bus Stand
                    <br />
                    Rayagada, Odisha 765001
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-strawberry px-4 py-2.5 rounded-full hover:bg-strawberry/90 hover:shadow-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-strawberry/50 hover:-translate-y-0.5"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-strawberry flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif text-bento-text mb-1.5 font-bold">Hours</h3>
                  <ul className="text-bento-text font-light space-y-1 text-sm">
                    <li className="flex justify-between w-56">
                      <span>Mon - Sun</span>
                      <span className="font-bold text-bento-text">8:00 AM - 10:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Information - Row by Row */}
              <div className="space-y-4 pt-2 border-t border-black/5">
                {/* Call Us Row */}
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-strawberry flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-serif text-bento-text font-bold mb-0.5">
                      Call Us
                    </h3>
                    <a
                      href="tel:+15551234567"
                      className="text-bento-text font-medium text-sm hover:text-strawberry transition-colors block"
                    >
                      (555) 123-4567
                    </a>
                  </div>
                </div>

                {/* Email Us Row */}
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-strawberry flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-serif text-bento-text font-bold mb-0.5">
                      Email Us
                    </h3>
                    <a
                      href="mailto:hello@bentocakery.com"
                      className="text-bento-text font-medium text-sm hover:text-strawberry transition-colors block"
                    >
                      hello@bentocakery.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp Chat Row */}
                <div className="flex items-start space-x-4">
                  <div className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-bento-text font-bold mb-0.5">
                      WhatsApp Us
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <a
                        href="https://wa.me/15551234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bento-text font-medium text-sm hover:text-emerald-600 transition-colors"
                      >
                        +1 (555) 123-4567
                      </a>
                      <a
                        href="https://wa.me/15551234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
                      >
                        <span>Chat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Visuals Column (60% width) */}
          <div className="w-full lg:w-[60%] flex flex-col">
            {/* Embedded Map */}
            <div className="h-[350px] lg:h-full w-full min-h-[320px] bg-[#f5f5f5]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bakery Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
