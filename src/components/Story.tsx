import React from 'react';
import { motion } from 'framer-motion';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 order-2 md:order-1 relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1556217646-d567c94fa221?auto=format&fit=crop&q=80"
                alt="Baker working with dough"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative blob behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-beige rounded-full blur-3xl z-0 opacity-70"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 order-1 md:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-6">Our Story</h2>
            <p className="text-lg text-brown font-light mb-6 leading-relaxed">
              Founded on a love for traditional techniques and premium ingredients, MK Bakery & Sweets started as a small dream to bring exceptional baked goods to our community.
            </p>
            <p className="text-lg text-brown font-light mb-8 leading-relaxed">
              Every morning, long before the sun rises, our bakers are at work. We believe in the slow process of artisanal baking, where patience and precision yield the most remarkable flavors and textures.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-beige pt-8">
              <div>
                <span className="block text-3xl font-serif text-espresso font-bold mb-1">10+</span>
                <span className="text-sm uppercase tracking-wider text-brown font-medium">Years of Baking</span>
              </div>
              <div>
                <span className="block text-3xl font-serif text-espresso font-bold mb-1">100%</span>
                <span className="text-sm uppercase tracking-wider text-brown font-medium">Handcrafted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
