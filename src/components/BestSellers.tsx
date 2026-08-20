import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/cartUtils';

export const BestSellers: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const handleQuickAdd = (e: React.MouseEvent, product: typeof MOCK_PRODUCTS[0]) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || { label: 'Standard', price: product.price, servings: '8-10' };
    
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.imageUuids[0],
      selectedSize: defaultSize,
      selectedFlavor: product.flavors ? product.flavors[0] : undefined,
      selectedAddOns: [],
      quantity: 1,
      preparationLeadTimeHours: product.preparationLeadTimeHours,
      inStock: product.inStock,
      seasonal: product.seasonal,
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      description: `“${product.name}” (${defaultSize.label}) was added for pickup.`,
      action: {
        label: 'View Cart',
        onClick: () => openDrawer(),
      },
    });

    openDrawer();
  };

  return (
    <section className="py-24 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-gold font-bold mb-2 block">
              Handcrafted Daily
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-4">Our Favorites</h2>
            <p className="text-lg text-brown font-light">
              Our most loved creations, perfected over time and baked with the finest ingredients.
            </p>
          </div>
          <Link
            to="/menu"
            className="mt-6 md:mt-0 px-8 py-3.5 border border-espresso text-espresso rounded-full hover:bg-espresso hover:text-cream transition-colors font-medium text-sm inline-flex items-center space-x-2"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 shadow-soft border border-beige bg-cream">
                <img
                  src={product.imageUuids[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.featured && (
                    <span className="bg-cream/90 backdrop-blur-md text-espresso text-[11px] font-semibold uppercase tracking-wider py-1 px-3 rounded-full shadow-xs">
                      Best Seller
                    </span>
                  )}
                  {product.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gold/90 backdrop-blur-md text-espresso text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover Add to Cart Button */}
                <div className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="bg-cream text-espresso px-6 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-gold hover:text-espresso flex items-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-espresso mb-1 group-hover:text-gold transition-colors font-bold">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brown font-light line-clamp-2 mb-2">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-beige">
                  <span className="text-sm font-bold text-espresso font-serif">
                    From {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-gold font-medium">
                    {product.preparationLeadTimeHours}h notice
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
