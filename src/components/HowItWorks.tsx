import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  ShoppingBag,
  CalendarClock,
  Sparkles,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TIMELINE_STEPS = [
  {
    number: '01',
    title: 'Choose & Personalize',
    tag: 'Step 01',
    description:
      'Select your cake, pick size & servings, flavor profile, and add an optional piped message.',
    icon: ShoppingBag,
  },
  {
    number: '02',
    title: 'Select Pickup Window',
    tag: 'Step 02',
    description:
      'Choose a convenient date and time slot. We enforce preparation lead time for peak freshness.',
    icon: CalendarClock,
  },
  {
    number: '03',
    title: 'Fresh Scratch Baking',
    tag: 'Step 03',
    description:
      'Our master pastry chefs handcraft your creation fresh in our Rayagada kitchen before you arrive.',
    icon: Sparkles,
  },
  {
    number: '04',
    title: 'Express In-Store Pickup',
    tag: 'Step 04',
    description:
      'Skip the regular line, park in our dedicated pickup spots, and collect your boxed celebration cake.',
    icon: PartyPopper,
  },
];

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 70%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  const lineWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 md:py-32 bg-cream relative overflow-hidden"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-gold/5 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-gold font-bold mb-3 block"
          >
            How Pickup Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-espresso mb-4"
          >
            Four Simple Steps to Sweet Moments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brown text-base md:text-lg font-light leading-relaxed"
          >
            A seamless, artisanal pickup experience crafted from kitchen oven to your celebration table.
          </motion.p>
        </div>

        {/* DESKTOP: Clean Cardless Horizontal Timeline */}
        <div className="hidden lg:block relative mb-20">
          {/* Horizontal Connecting Track */}
          <div className="absolute top-8 left-[6%] right-[6%] h-[2px] bg-espresso/10 -z-0">
            {/* Animated Gold Fill Line */}
            <motion.div
              style={{ width: lineWidth }}
              className="h-full bg-gradient-to-r from-gold via-gold to-espresso shadow-[0_0_10px_rgba(212,175,55,0.7)]"
            />
          </div>

          {/* 4 Steps Horizontal Row (Cardless) */}
          <div className="grid grid-cols-4 gap-8 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Node Circle on Track */}
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className="w-16 h-16 rounded-full bg-cream border-2 border-gold flex items-center justify-center text-espresso shadow-md mb-8 group-hover:border-espresso group-hover:bg-gold/10 transition-all cursor-pointer relative"
                  >
                    <Icon className="w-6 h-6 text-gold group-hover:text-espresso transition-colors" />
                    <span className="absolute -bottom-2.5 bg-espresso text-cream text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Text Details without Card */}
                  <div className="px-2 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                      {step.tag}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-espresso group-hover:text-gold transition-colors leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-brown text-xs md:text-sm font-light leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET: Clean Vertical Line (Cardless) */}
        <div className="lg:hidden relative pl-8 sm:pl-12 space-y-12 mb-16">
          {/* Vertical Connecting Line */}
          <div className="absolute left-3.5 sm:left-5 top-4 bottom-4 w-[2px] bg-espresso/10">
            <motion.div
              style={{ height: lineWidth }}
              className="w-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]"
            />
          </div>

          {TIMELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex items-start space-x-4 sm:space-x-6 group"
              >
                {/* Node Circle */}
                <div className="absolute -left-8 sm:-left-12 top-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-cream border-2 border-gold flex items-center justify-center text-espresso shadow-xs z-10">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                </div>

                {/* Content */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold bg-espresso text-cream px-2 py-0.5 rounded-full">
                      {step.number}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-gold font-bold">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-espresso group-hover:text-gold transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-brown text-xs sm:text-sm font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Minimal Bottom CTA Bar */}
        <div className="text-center pt-8 border-t border-beige">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-espresso text-cream rounded-full font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-espresso/90 transition-colors shadow-soft"
          >
            <span>Order for Pickup in Rayagada</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>
    </section>
  );
};
