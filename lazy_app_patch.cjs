const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  "import { useEffect } from 'react';",
  "import { useEffect, Suspense, lazy } from 'react';"
);

// Remove static page imports
const importsToRemove = [
  "import { CartPage } from './pages/CartPage';",
  "import { MenuPage } from './pages/MenuPage';",
  "import { ProductDetailPage } from './pages/ProductDetailPage';",
  "import { CheckoutPage } from './pages/CheckoutPage';",
  "import { ConfirmationPage } from './pages/ConfirmationPage';",
  "import { AdminDashboard } from './pages/admin/AdminDashboard';"
];

importsToRemove.forEach(imp => {
  appContent = appContent.replace(imp + '\n', '');
  appContent = appContent.replace(imp, '');
});

// Add dynamic imports
const dynamicImports = `
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const MenuPage = lazy(() => import('./pages/MenuPage').then(module => ({ default: module.MenuPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage').then(module => ({ default: module.ConfirmationPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
`;

appContent = appContent.replace('const ScrollToHash =', dynamicImports + '\nconst ScrollToHash =');

// Wrap Routes in Suspense
const suspenseFallback = `
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-bento-yellow/30 border-t-bento-yellow rounded-full animate-spin"></div>
  </div>
);
`;
appContent = appContent.replace('function App() {', suspenseFallback + '\nfunction App() {');

appContent = appContent.replace(
  '<Routes>',
  '<Suspense fallback={<PageLoader />}>\n          <Routes>'
);

appContent = appContent.replace(
  '</Routes>',
  '</Routes>\n          </Suspense>'
);

fs.writeFileSync('src/App.tsx', appContent);
