import React from 'react';
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
      description: `"${product.name}" (${defaultSize.label}) was added for pickup.`,
      action: {
        label: 'View Cart',
        onClick: () => openDrawer(),
      },
    });
    openDrawer();
  };

  const carouselProducts = [...MOCK_PRODUCTS.slice(0, 8), ...MOCK_PRODUCTS.slice(0, 8)];

  return (
    <section className="py-16 bg-bento-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold mb-2 block">
              Handcrafted Daily
            </span>
            <h2 className="text-3xl font-serif md:text-4xl text-white mb-4">Our Favorites</h2>
            <p className="text-base text-white/80 font-light">
              Our most loved creations, perfected over time and baked with the finest ingredients.
            </p>
          </div>
          
          <Link
            to="/menu"
            className="mt-6 md:mt-0 px-8 py-3.5 text-bento-yellow shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] rounded-full hover:bg-yellow-400 hover:text-black transition-colors font-medium text-sm inline-flex items-center space-x-2"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative w-full overflow-hidden -mx-6 px-6 pb-8">
          <div className="flex animate-marquee hover:[animation-play-state:paused] space-x-6 w-max pr-6">
            {carouselProducts.map((product, index) => {
              const isVeg = product.dietaryTags.some(tag => tag.toLowerCase() === 'eggless' || tag.toLowerCase() === 'vegetarian' || tag.toLowerCase() === 'veg');
              const defaultSize = product.sizes[0] || { servings: '8-10', label: 'Standard' };
              
              return (
                <div
                  key={`${product.id}-${index}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer flex flex-col w-[280px] sm:w-[300px] bg-white/5 rounded-3xl p-4 shrink-0 transition-all shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-bento-yellow/10 hover:bg-white/10"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-bento-grey/10">
                    <img
                      src={product.imageUuids[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="bg-bento-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1.5">
                        <span>{formatCurrency(product.price)}</span>
                        <span className="text-[10px] text-white/60 font-medium bg-white/10 px-1.5 py-0.5 rounded-full">{defaultSize.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-9 h-9 rounded-full bg-bento-yellow text-black flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-md transform active:scale-95"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                    


                    {/* Veg Icon (Indian Standard) */}
                    {
                    /* Veg/Non-Veg Icon (Indian Standard) */
                    <div className="absolute top-3 right-3 bg-white p-1 rounded shadow-sm flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 border-2 ${isVeg ? 'border-green-600' : 'border-red-700'} flex items-center justify-center p-[1px]`}>
                        <div className={`w-1.5 h-1.5 ${isVeg ? 'bg-green-600' : 'bg-red-700'} rounded-full`}></div>
                      </div>
                    </div>
                  }
                  </div>

                  <div className="flex-1 flex flex-col justify-between px-1 pb-1">
                    <div className="mb-4">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-bento-yellow transition-colors truncate">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-1 mb-2">
                        {product.shortDescription}
                      </p>
                      
                    </div>
                    

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
