
import { lazy } from 'react';

// Lazy loading pour les pages admin (secondaires)
export const LazyAdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
export const LazyAdminCatalog = lazy(() => import('@/pages/admin/AdminCatalog'));
export const LazyAdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
export const LazyAdminReports = lazy(() => import('@/pages/admin/AdminReports'));
export const LazyAdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
export const LazyAdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
export const LazyAdminProfile = lazy(() => import('@/pages/admin/AdminProfile'));

// Lazy loading pour les pages utilisateur secondaires
export const LazyProducts = lazy(() => import('@/pages/Products'));
export const LazyCategories = lazy(() => import('@/pages/Categories'));
export const LazyProductDetails = lazy(() => import('@/pages/ProductDetails'));
export const LazyCart = lazy(() => import('@/pages/Cart'));
export const LazyFavorites = lazy(() => import('@/pages/Favorites'));
export const LazyContact = lazy(() => import('@/pages/Contact'));
export const LazyAboutUs = lazy(() => import('@/pages/AboutUs'));
export const LazyAccount = lazy(() => import('@/pages/Account'));
export const LazyCustomOrder = lazy(() => import('@/pages/CustomOrder'));

// Composant de fallback optimisé
export const LazyLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);
