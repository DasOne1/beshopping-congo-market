import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import SplashScreen from "@/components/SplashScreen";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import CustomOrder from "./pages/CustomOrder";
import NotFound from "./pages/NotFound";
import EmailCustomerAuth from "./pages/EmailCustomerAuth";

// Admin pages
import AdminAuth from "./pages/Admin/AdminAuth";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import AdminCategories from "./pages/Admin/Categories";
import Customers from "./pages/Admin/Customers";
import Orders from "./pages/Admin/Orders";
import Analytics from "./pages/Admin/Analytics";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";
import AdminAccounts from "./pages/Admin/AdminAccounts";
import ProductForm from "./pages/Admin/ProductForm";
import CategoryForm from "./pages/Admin/CategoryForm";
import CustomerForm from "./pages/Admin/CustomerForm";
import Catalog from "./pages/Admin/Catalog";
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <FavoritesProvider>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
              <ThemeProvider>
                {!splashComplete && (
                  <SplashScreen onComplete={() => setSplashComplete(true)} />
                )}
                {splashComplete && (
                  <>
                    <ScrollToTop />
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/custom-order" element={<CustomOrder />} />
                      <Route path="/email-auth" element={<EmailCustomerAuth />} />

                      {/* Admin routes */}
                      <Route path="/dasgabriel@adminaccess" element={<AdminAuth />} />
                      <Route path="/dasgabriel@adminaccess/dashboard" element={<Dashboard />} />
                      <Route path="/dasgabriel@adminaccess/products" element={<AdminProducts />} />
                      <Route path="/dasgabriel@adminaccess/categories" element={<AdminCategories />} />
                      <Route path="/dasgabriel@adminaccess/customers" element={<Customers />} />
                      <Route path="/dasgabriel@adminaccess/customers/new" element={<CustomerForm />} />
                      <Route path="/dasgabriel@adminaccess/customers/edit/:id" element={<CustomerForm />} />
                      <Route path="/dasgabriel@adminaccess/orders" element={<Orders />} />
                      <Route path="/dasgabriel@adminaccess/analytics" element={<Analytics />} />
                      <Route path="/dasgabriel@adminaccess/reports" element={<Reports />} />
                      <Route path="/dasgabriel@adminaccess/settings" element={<Settings />} />
                      <Route path="/dasgabriel@adminaccess/accounts" element={<AdminAccounts />} />
                      <Route path="/dasgabriel@adminaccess/catalog" element={<Catalog />} />

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                )}
              </ThemeProvider>
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
