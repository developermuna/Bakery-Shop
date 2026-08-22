import React from "react";
import { CelebrateCakeSection } from "./CelebrateCakeSection";

export const Categories: React.FC = () => {
  return (
    <section id="categories" className="pt-2 sm:pt-3 pb-2 sm:pb-4 bg-transparent relative z-20">
      <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
        {/* Sticky Celebrate with the Perfect Cake in top position */}
        <div className="sticky top-[52px] sm:top-[56px] z-30 py-1">
          <CelebrateCakeSection />
        </div>
      </div>
    </section>
  );
};

