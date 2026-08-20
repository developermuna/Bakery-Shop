import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { Navigation } from './components/Navigation';
import { HeroSequence } from './components/HeroSequence';
import { Categories } from './components/Categories';
import { BestSellers } from './components/BestSellers';
import { HowItWorks } from './components/HowItWorks';
import { CustomCakes } from './components/CustomCakes';
import { Reviews } from './components/Reviews';
import { Story } from './components/Story';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastNotification } from './components/cart/ToastNotification';
import { CartPage } from './pages/CartPage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Homepage Component
const HomePage = () => (
  <main>
    <HeroSequence />
    <Categories />
    <BestSellers />
    <HowItWorks />
    <CustomCakes />
    <Reviews />
    <Story />
    <HeroSequence 
      sequences={[{ path: '/cakevideo3/frame_', count: 210 }]}
      title={<>Behind the Scenes</>}
      subtitle="Watch our master bakers at work."
    />
    <Location />
  </main>
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
      <div className="font-sans antialiased text-espresso bg-cream flex flex-col min-h-screen">
        <Navigation />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
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
