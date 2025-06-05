
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import SplashScreen from "@/components/SplashScreen";
import ScrollToTop from "@/components/ScrollToTop";
import { useDataPreloader } from "@/hooks/useDataPreloader";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import CustomOrder from "./pages/CustomOrder";
import Account from "./pages/Account";
import CustomerAuth from "./pages/CustomerAuth";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminAuth from "./pages/Admin/AdminAuth";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import ProductForm from "./pages/Admin/ProductForm";
import AdminCategories from "./pages/Admin/Categories";
import CategoryForm from "./pages/Admin/CategoryForm";
import Orders from "./pages/Admin/Orders";
import Customers from "./pages/Admin/Customers";
import CustomerDetails from "./pages/Admin/CustomerDetails";
import Analytics from "./pages/Admin/Analytics";
import Settings from "./pages/Admin/Settings";
import Reports from "./pages/Admin/Reports";
import AdminAccounts from "./pages/Admin/AdminAccounts";
import Catalog from "./pages/Admin/Catalog";

const queryClient = new QueryClient();

function AppContent() {
  const { isLoading } = useDataPreloader();

  // Initialize realtime sync
  useRealtimeSync();

  if (isLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/account" element={<Account />} />
        <Route path="/customer-auth" element={<CustomerAuth />} />
        
        {/* Admin Routes */}
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/:id/edit" element={<ProductForm />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<CategoryForm />} />
        <Route path="/admin/categories/:id/edit" element={<CategoryForm />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/accounts" element={<AdminAccounts />} />
        <Route path="/admin/catalog" element={<Catalog />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
