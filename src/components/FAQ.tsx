import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What are your pickup times?",
    answer: "Our standard pickup window is from 8:00 AM to 10:00 PM, Monday through Sunday at our Rayagada bakery."
  },
  {
    question: "Do you use high-quality ingredients?",
    answer: "Absolutely. We pride ourselves on using 100% pure dairy butter, premium Belgian chocolate, and locally sourced organic eggs. We never use artificial preservatives."
  },
  {
    question: "What is the lead time for custom cakes?",
    answer: "We recommend placing custom cake orders at least 24-48 hours in advance for standard customizations, and 3-5 days for elaborate celebration designs."
  },
  {
    question: "Do you offer veg or dietary options?",
    answer: "Yes! We offer 100% veg options for almost all our cakes and pastries, clearly marked across our menu."
  },
  {
    question: "How should I store my cake after pickup?",
    answer: "Cream and mousse cakes should be refrigerated until 30 minutes before serving. Fondant and dry sponge cakes are best stored in a cool, air-conditioned room."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pt-6 pb-4 bg-transparent relative z-10">
      <div className="container mx-auto px-6 max-w-2xl">
        <h3 className="text-lg font-bold font-serif text-center mb-3.5 text-black">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-pink-100/80"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-2.5 px-4 sm:px-5 text-left focus:outline-none"
                >
                  <span className="font-semibold text-xs sm:text-sm text-bento-text">{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ml-2 ${isOpen ? 'bg-strawberry text-white' : 'bg-pink-50 text-strawberry'}`}>
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-4 sm:px-5 pb-3 text-xs text-bento-text/80 leading-relaxed border-t border-pink-50 pt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
