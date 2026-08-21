import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    review:
      "The vanilla bean cloud cake was an absolute hit at our anniversary. Incredible texture and not overly sweet. Will definitely be ordering again!",
    rating: 5,
  },
  {
    name: "David L.",
    review:
      "Best croissants in the city, period. The pickup process is so smooth, and everything is always perfectly boxed and ready to go.",
    rating: 5,
  },
  {
    name: "Emily R.",
    review:
      "Ordered a custom cake for my daughter's 5th birthday. It was beautiful and tasted even better. Bento Cakery never disappoints.",
    rating: 5,
  },
  {
    name: "Michael T.",
    review:
      "Found this bakery online and tried their signature bento cakes. So delicious! The chocolate ganache is to die for.",
    rating: 5,
  },
  {
    name: "Jessica W.",
    review:
      "I love how easy it is to order ahead and just grab my box. The staff is always friendly and the quality is consistently top-notch.",
    rating: 5,
  },
];

export const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextReview();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const getOffset = (index: number) => {
    let diff = index - currentIndex;
    const half = Math.floor(reviews.length / 2);
    if (diff > half) {
      diff -= reviews.length;
    } else if (diff < -half) {
      diff += reviews.length;
    }
    return diff;
  };

  return (
    <section className="py-6 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Sweet Words
            </h2>
            <p className="text-base text-white/80 max-w-xl font-light">
              Don't just take our word for it. Here's what our community has to
              say.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 px-6 py-4 rounded-full shadow-lg backdrop-blur-sm bg-white/10">
            <div className="text-2xl font-serif font-bold text-white">4.9</div>
            <div className="flex flex-col">
              <div className="flex text-bento-yellow space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-white/60 font-medium mt-0.5">
                Based on 1,240 reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full width Carousel Container */}
      <div className="relative w-full overflow-hidden flex flex-col items-center">
        {/* Track */}
        <div className="relative w-full flex justify-center items-center h-[340px] md:h-[280px]">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-bento-yellow hover:text-black text-white rounded-full transition-colors focus:outline-none flex items-center justify-center backdrop-blur-md"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-bento-yellow hover:text-black text-white rounded-full transition-colors focus:outline-none flex items-center justify-center backdrop-blur-md"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {reviews.map((review, index) => {
            const offset = getOffset(index);
            const isActive = offset === 0;

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: `calc(${offset * 100}% + ${offset * 1.5}rem)`,
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.9,
                  zIndex: isActive ? 10 : 5 - Math.abs(offset),
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-[80vw] md:w-[45vw] lg:w-[40vw] h-full bg-white/5 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer"
                onClick={() => !isActive && setCurrentIndex(index)}
              >
                <div>
                  <div className="flex space-x-1 mb-6 text-bento-yellow">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-white text-lg md:text-xl font-light italic mb-8 leading-relaxed">
                    "{review.review}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-bento-yellow text-black flex items-center justify-center rounded-full font-serif font-bold text-base">
                      {review.name.charAt(0)}
                    </div>
                    <span className="font-medium text-white text-base">
                      {review.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls Container */}
        <div className="flex flex-col items-center mt-12 space-y-6">
          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  index === currentIndex
                    ? "bg-bento-yellow w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
