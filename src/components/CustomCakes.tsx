import React from 'react';
import { motion } from 'framer-motion';
import { CustomCakeForm } from './CustomCakeForm';

export const CustomCakes: React.FC = () => {
  return (
    <section id="custom" className="relative py-16 lg:py-24 min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
          alt="Bespoke custom cake"
          className="w-full h-full object-cover opacity-70 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-bento-yellow uppercase tracking-widest text-sm font-semibold mb-4 block shadow-black drop-shadow-md">Bespoke Creations</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight drop-shadow-xl">
            Design Your Dream Cake
          </h2>
          <p className="text-bento-grey mt-4 max-w-2xl mx-auto text-sm md:text-base drop-shadow-md">
            From elegant weddings to milestone birthdays, fill out the form below to help us bring your sweetest visions to life.
          </p>
        </motion.div>

        {/* Inline Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <CustomCakeForm />
        </motion.div>
      </div>
    </section>
  );
};
