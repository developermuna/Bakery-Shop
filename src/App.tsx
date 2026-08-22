import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Navigation } from './components/Navigation';
import { HeroSequence } from './components/HeroSequence';
import { Categories } from './components/Categories';
import { RecommendedSection } from './components/RecommendedSection';
import { HowItWorks } from './components/HowItWorks';
import { CustomCakes } from './components/CustomCakes';
import { Reviews } from './components/Reviews';
import { Location } from './components/Location';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastNotification } from './components/cart/ToastNotification';
import { BottomNavigation } from './components/BottomNavigation';

const MenuPage = lazy(() => import('./pages/MenuPage').then(module => ({ default: module.MenuPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage').then(module => ({ default: module.ConfirmationPage })));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage').then(module => ({ default: module.PoliciesPage })));
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

// Subtle and smooth page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    className="w-full flex-grow flex flex-col"
  >
    {children}
  </motion.div>
);

// Homepage Component
const HomePage = () => (
  <main>
    <HeroSequence />
    {/* Unified Single Gradient Background for Our Selection to Recommended Section */}
    <div className="bg-[linear-gradient(180deg,#FFF0F5_0%,#FDF0F5_12%,#FCE4EC_25%,#F8BBD0_40%,#F48FB1_55%,#EC407A_70%,rgb(201,30,93)_85%,rgb(201,30,93)_100%)] relative overflow-hidden">
      <Categories />
      <RecommendedSection />
    </div>
    {/* Unified Single Gradient Background for How Pickup Works to Sweet Words (Reversed: Solid pink at top to rgb(244,239,230) at bottom) */}
    <div className="bg-[linear-gradient(180deg,rgb(201,30,93)_0%,rgb(201,30,93)_15%,#EC407A_30%,#F48FB1_45%,#F8BBD0_60%,#FCE4EC_75%,#F6EDE0_88%,rgb(244,239,230)_100%)] relative overflow-hidden">
      <HowItWorks />
      <Reviews />
    </div>
    <HeroSequence 
      sequences={[{ path: '/cakevideo3/frame_', count: 210 }]}
      title={<>Behind the Scenes</>}
      subtitle="Watch our master bakers at work crafting daily delights."
      primaryButtonText="Artisanal Bakery"
      primaryButtonLink="/bakery"
      secondaryButtonText="Decoration Items"
      secondaryButtonLink="/decorations"
    />
    {/* Unified Single Gradient Background for FAQ and Visit Our Bakery */}
    <div className="bg-[linear-gradient(180deg,#FFF0F5_0%,#FDF0F5_12%,#FCE4EC_25%,#F8BBD0_40%,#F48FB1_55%,#EC407A_70%,rgb(201,30,93)_85%,rgb(201,30,93)_100%)] relative overflow-hidden">
      <FAQ />
      <Location />
    </div>
  </main>
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-3 border-[#D81B60]/20 border-t-[#D81B60] rounded-full animate-spin"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuPage catalog="Cakes" /></PageTransition>} />
        <Route path="/bakery" element={<PageTransition><MenuPage catalog="Bakery" /></PageTransition>} />
        <Route path="/decorations" element={<PageTransition><MenuPage catalog="Decorations" /></PageTransition>} />
        <Route path="/custom-cakes" element={<PageTransition><main className="min-h-screen"><CustomCakes /></main></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/cart" element={<Navigate to="/checkout" replace />} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/confirmation" element={<PageTransition><ConfirmationPage /></PageTransition>} />
        <Route path="/policies" element={<PageTransition><PoliciesPage /></PageTransition>} />
        <Route path="/privacy" element={<Navigate to="/policies?section=privacy" replace />} />
        <Route path="/terms" element={<Navigate to="/policies?section=terms" replace />} />
        <Route path="/shipping" element={<Navigate to="/policies?section=shipping" replace />} />
        <Route path="/returns" element={<Navigate to="/policies?section=returns" replace />} />
        <Route path="/return-policy" element={<Navigate to="/policies?section=returns" replace />} />
        <Route path="/admin/*" element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const ConditionalFooter = () => {
  const { pathname } = useLocation();
  const hideFooterRoutes = ['/confirmation', '/checkout', '/custom-cakes'];
  if (hideFooterRoutes.includes(pathname) || pathname.startsWith('/admin')) {
    return null;
  }
  const isHome = pathname === '/' || pathname === '';
  return (
    <div className={isHome ? 'block' : 'hidden lg:block'}>
      <Footer />
    </div>
  );
};

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
      <div className="font-sans antialiased text-bento-text bg-bento-bg flex flex-col min-h-screen">
        <Navigation />
        
        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </div>
        <ConditionalFooter />

        {/* Global Cart Drawer & Toast System */}
        <CartDrawer />
        <ToastNotification />

        {/* Mobile / Tablet Bottom Navigation */}
        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
