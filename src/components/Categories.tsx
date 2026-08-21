import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const categories = [
  {
    name: "Bento Cakes",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80",
    category: "Bento Cakes",
  },
  {
    name: "All Time Favourite",
    image:
      "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80",
    category: "All Time Favourite Cakes",
  },
  {
    name: "Premium Cakes",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80",
    category: "Premium Cakes",
  },
  {
    name: "Celebration Cakes",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80",
    category: "Celebration Cakes",
  },
    {
    name: "Custom Cakes",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80",
    category: "Custom Cakes",
  },
];

export const Categories: React.FC = () => {
  const navigate = useNavigate();


  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Custom Cakes') {
      navigate('/custom-cakes');
      return;
    }
    // Navigate to menu with category as a query parameter or state
    navigate("/menu", { state: { category: categoryName } });
  };

  return (
    <section id="categories" className="py-16 bg-bento-yellow">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            Our Selection
          </h2>
          <p className="text-base text-black/80 max-w-2xl mx-auto font-light">
            Crafted with passion, baked fresh daily. Explore our range of
            artisanal delights.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => handleCategoryClick(category.category)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-soft"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-bento-black/90 via-bento-black/20 to-transparent flex items-end p-4">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight">
                    {category.name}
                  </h3>
                  <span className="text-bento-yellow uppercase tracking-wider text-[10px] md:text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
