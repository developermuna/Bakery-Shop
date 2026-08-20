import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: 'Signature Cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80',
  },
  {
    name: 'Pastries & Tarts',
    image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80',
  },
  {
    name: 'Breads & Viennoiserie',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80',
  },
];

export const Categories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-4">Our Selection</h2>
          <p className="text-lg text-brown max-w-2xl mx-auto font-light">
            Crafted with passion, baked fresh daily. Explore our range of artisanal delights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => navigate('/menu')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-soft"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent flex items-end p-8">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-serif text-cream mb-2">{category.name}</h3>
                  <span className="text-gold uppercase tracking-wider text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
