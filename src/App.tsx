import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navigation } from './components/Navigation';
import { HeroSequence } from './components/HeroSequence';
import { Categories } from './components/Categories';
import { BestSellers } from './components/BestSellers';
import { HowItWorks } from './components/HowItWorks';
import { CustomCakes } from './components/CustomCakes';
import { Reviews } from './components/Reviews';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastNotification } from './components/cart/ToastNotification';


const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const MenuPage = lazy(() => import('./pages/MenuPage').then(module => ({ default: module.MenuPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage').then(module => ({ default: module.ConfirmationPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Homepage Component
const HomePage = () => (
  <main>
    <HeroSequence />
    <Categories />
    <BestSellers />
    <HowItWorks />
    <Reviews />
    <HeroSequence 
      sequences={[{ path: '/cakevideo3/frame_', count: 210 }]}
      title={<>Behind the Scenes</>}
      subtitle="Watch our master bakers at work."
    />
    <Location />
  </main>
);


const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-bento-yellow/30 border-t-bento-yellow rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="font-sans antialiased text-bento-black bg-cream flex flex-col min-h-screen">
        <Navigation />
        
        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/bento-cakes" element={<MenuPage category="Bento Cakes" />} />
            <Route path="/custom-cakes" element={<main className="pt-24 min-h-screen"><CustomCakes /></main>} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
          </Suspense>
        </div>
        <Footer />

        {/* Global Cart Drawer & Toast System */}
        <CartDrawer />
        <ToastNotification />
      </div>
    </BrowserRouter>
  );
}

export default App;
