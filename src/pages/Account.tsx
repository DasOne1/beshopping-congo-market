import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Package, Heart, ShoppingCart, Phone, Mail, MapPin, Calendar, Edit, LogOut, LogIn, X, Lock, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import ProductSkeleton from '@/components/ProductSkeleton';
import { motion } from 'framer-motion';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import SimpleAuthForm from '@/components/SimpleAuthForm';
import { useOrders } from '@/hooks/useOrders';
import OrderDashboard from '@/components/OrderDashboard';

const Account = () => {
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { products, isLoading } = useProducts();
  const { 
    currentCustomer, 
    isAuthenticated, 
    loading, 
    signOut, 
    updateProfile
  } = useCustomerAuth();
  const { orders: allOrders, isLoading: isLoadingOrders } = useOrders();

  // Filtrer les commandes pour n'afficher que celles du client connecté
  const orders = isAuthenticated && currentCustomer
    ? allOrders.filter(order => order.customer_id === currentCustomer.id)
    : [];

  const [isEditing, setIsEditing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  // Update profile form when customer data changes
  useEffect(() => {
    if (currentCustomer) {
      setProfileForm({
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || '',
        address: typeof currentCustomer.address === 'string' ? currentCustomer.address : currentCustomer.address?.address || '',
        password: ''
      });
    }
  }, [currentCustomer]);

  // Get favorite products
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  // Get cart products
  const cartProducts = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product
    };
  }).filter(item => item.product);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Forcer la mise à jour des informations du client
    if (currentCustomer) {
      setProfileForm({
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || '',
        address: typeof currentCustomer.address === 'string' ? currentCustomer.address : currentCustomer.address?.address || '',
        password: ''
      });
    }
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Effet pour gérer l'affichage initial
  useEffect(() => {
    if (isAuthenticated && currentCustomer) {
      // Scroll vers le haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, currentCustomer]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={`container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8 transition-all duration-300 ${showAuthModal ? 'blur-sm' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* En-tête avec titre et bouton de connexion */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" />
              Mon Compte
            </h1>
            {isAuthenticated ? (
              <Button variant="outline" onClick={signOut} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <Button onClick={handleSignInClick} className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            )}
          </div>

          {!isAuthenticated ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <p className="text-muted-foreground mb-6">
                Créez un compte ou connectez-vous pour accéder à votre espace personnel
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Tableau de bord des statistiques */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Tableau de Bord
                  </CardTitle>
                  <CardDescription>
                    Vue d'ensemble de votre activité
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderDashboard 
                    orders={orders} 
                    isLoading={isLoadingOrders}
                    cartCount={cart.length}
                    favoritesCount={favorites.length}
                  />
                </CardContent>
              </Card>

              {/* Informations personnelles */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Informations Personnelles
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-name">Nom complet</Label>
                          <Input
                            id="edit-name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-phone">Téléphone</Label>
                          <Input
                            id="edit-phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-email">Email (optionnel)</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-password">Nouveau mot de passe (optionnel)</Label>
                          <Input
                            id="edit-password"
                            type="password"
                            value={profileForm.password}
                            onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                            placeholder="Laissez vide pour garder le même"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit-address">Adresse</Label>
                        <Textarea
                          id="edit-address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          Sauvegarder
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Annuler
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nom complet</p>
                            <p className="font-medium">{currentCustomer?.name || 'Non renseigné'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{currentCustomer?.phone || 'Non renseigné'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{currentCustomer?.email || 'Non renseigné'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Adresse</p>
                            <p className="font-medium">
                              {typeof currentCustomer?.address === 'string' 
                                ? currentCustomer.address 
                                : currentCustomer?.address?.address || 'Non renseigné'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setShowAuthModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <SimpleAuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Account;
