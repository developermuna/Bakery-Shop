import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah M.',
    review: 'The vanilla bean cloud cake was an absolute hit at our anniversary. Incredible texture and not overly sweet. Will definitely be ordering again!',
    rating: 5,
  },
  {
    name: 'David L.',
    review: 'Best croissants in the city, period. The pickup process is so smooth, and everything is always perfectly boxed and ready to go.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    review: 'Ordered a custom cake for my daughter\'s 5th birthday. It was beautiful and tasted even better. MK Bakery never disappoints.',
    rating: 5,
  },
];

export const Reviews: React.FC = () => {
  return (
    <section className="py-24 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-4">Sweet Words</h2>
          <p className="text-lg text-brown max-w-2xl mx-auto font-light">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-cream p-8 rounded-2xl shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex space-x-1 mb-6 text-gold">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-espresso text-lg font-serif italic mb-6 leading-relaxed">
                  "{review.review}"
                </p>
              </div>
              <div className="flex items-center space-x-4 border-t border-beige pt-6 mt-auto">
                <div className="w-10 h-10 bg-espresso text-cream flex items-center justify-center rounded-full font-serif font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <span className="font-medium text-espresso">{review.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
