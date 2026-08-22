import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ShoppingBag,
  CalendarClock,
  Sparkles,
  PartyPopper,
  
} from "lucide-react";

const TIMELINE_STEPS = [
  {
    number: "01",
    title: "Choose & Personalize",
    tag: "Step 01",
    description:
      "Select your cake, pick size & servings, flavor profile, and add an optional piped message.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "Select Pickup Window",
    tag: "Step 02",
    description:
      "Choose a convenient date and time slot. We enforce preparation lead time for peak freshness.",
    icon: CalendarClock,
  },
  {
    number: "03",
    title: "Fresh Scratch Baking",
    tag: "Step 03",
    description:
      "Our master pastry chefs handcraft your creation fresh in our Rayagada kitchen before you arrive.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Express In-Store Pickup",
    tag: "Step 04",
    description:
      "Skip the regular line, park in our dedicated pickup spots, and collect your boxed celebration cake.",
    icon: PartyPopper,
  },
];

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 70%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  const lineWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-10 md:py-12 bg-transparent relative overflow-hidden"
    >
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-white/90 font-bold mb-2 block"
          >
            How Pickup Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-serif font-bold text-white mb-3"
          >
            Four Simple Steps to Sweet Moments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-sm font-light leading-relaxed"
          >
            A seamless, artisanal pickup experience crafted from kitchen oven to
            your celebration table.
          </motion.p>
        </div>

        {/* DESKTOP: Clean Cardless Horizontal Timeline */}
        <div className="hidden md:block relative mb-8">
          {/* Horizontal Connecting Track */}
          <div className="absolute top-8 left-[6%] right-[6%] h-[2px] bg-white/20 -z-0">
            {/* Animated Gold Fill Line */}
            <motion.div
              style={{ width: lineWidth }}
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            />
          </div>

          {/* 4 Steps Horizontal Row (Cardless) */}
          <div className="grid grid-cols-4 gap-4 sm:gap-6 relative z-10">
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
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-strawberry shadow-xl mb-8 transition-all cursor-pointer relative border-2 border-white"
                  >
                    <Icon className="w-6 h-6 text-strawberry" />
                    <span className="absolute -bottom-2.5 bg-bento-yellow text-bento-text text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Text Details without Card */}
                  <div className="px-2 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-white block drop-shadow-sm">
                      {step.tag}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white leading-snug drop-shadow-sm">
                      {step.title}
                    </h3>
                    <p className="text-white/90 text-xs font-light leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET: Clean Vertical Line (Cardless) */}
        <div className="md:hidden relative pl-8 sm:pl-12 space-y-12 mb-8">
          {/* Vertical Connecting Line */}
          <div className="absolute left-3.5 sm:left-5 top-4 bottom-4 w-[2px] bg-white/20">
            <motion.div
              style={{ height: lineWidth }}
              className="w-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
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
                <div className="absolute -left-8 sm:-left-12 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-strawberry shadow-lg z-10 border border-white">
                  <Icon className="w-4 h-4 sm:w-4 sm:h-4 text-strawberry" />
                </div>
                {/* Content */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-extrabold bg-bento-yellow text-bento-text px-2 py-0.5 rounded-full shadow-xs">
                      {step.number}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white font-extrabold drop-shadow-sm">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-lg font-serif font-bold text-white drop-shadow-sm">
                    {step.title}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};
