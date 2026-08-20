import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CustomCakeForm } from './CustomCakeForm';

export const CustomCakes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section id="custom" className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80"
                alt="Custom wedding cake"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-bento-black/10"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <span className="text-bento-yellow uppercase tracking-widest text-sm font-semibold mb-4 block">Bespoke Creations</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-bento-black mb-6 leading-tight">
              Bring Your Sweetest Visions to Life.
            </h2>
            <p className="text-lg text-bento-grey font-light mb-8 leading-relaxed">
              From elegant weddings to milestone birthdays, our custom cakes are designed exclusively for you. We work closely with our clients to create edible masterpieces that taste as spectacular as they look.
            </p>
            <ul className="space-y-4 mb-10 text-bento-black font-medium">
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-bento-yellow rounded-full"></span>
                <span>Personalized flavor profiles</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-bento-yellow rounded-full"></span>
                <span>Hand-sculpted sugar floristry</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-bento-yellow rounded-full"></span>
                <span>Dietary accommodations (Vegan, GF)</span>
              </li>
            </ul>
            <div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-bento-black text-cream rounded-full font-medium hover:bg-bento-grey transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-bento-yellow"
              >
                Inquire About Custom Cakes
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pt-24 pb-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bento-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full overflow-y-auto rounded-3xl z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-cream/80 backdrop-blur-md rounded-full text-bento-black hover:text-bento-yellow transition-colors z-20"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
              <CustomCakeForm />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
