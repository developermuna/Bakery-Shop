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
    review: 'Ordered a custom cake for my daughter\'s 5th birthday. It was beautiful and tasted even better. Bento Cakery never disappoints.',
    rating: 5,
  },
];

export const Reviews: React.FC = () => {
  return (
    <section className="py-16 bg-bento-grey">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-cream mb-3">Sweet Words</h2>
            <p className="text-base text-cream/80 max-w-xl font-light">
              Don't just take our word for it. Here's what our community has to say.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-bento-black px-5 py-3 rounded-2xl shadow-sm border border-bento-grey">
            <div className="text-3xl font-serif font-bold text-cream">4.9</div>
            <div className="flex flex-col">
              <div className="flex text-bento-yellow space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-bento-grey font-medium mt-0.5">Based on 1,240 reviews</span>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory space-x-6 pb-8 -mx-6 px-6 hide-scrollbar">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-bento-black p-6 rounded-2xl shadow-sm border border-bento-grey flex flex-col justify-between flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-center"
            >
              <div>
                <div className="flex space-x-1 mb-4 text-bento-yellow">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-cream text-base font-light italic mb-6 leading-relaxed">
                  "{review.review}"
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-auto">
                <div className="w-8 h-8 bg-bento-grey text-cream flex items-center justify-center rounded-full font-serif font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <span className="font-medium text-cream text-sm">{review.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
