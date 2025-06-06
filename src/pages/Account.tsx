import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Package, Heart, ShoppingCart, Phone, Mail, MapPin, Calendar, Edit, LogOut, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import ProductSkeleton from '@/components/ProductSkeleton';
import { motion } from 'framer-motion';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useOrders } from '@/hooks/useOrders';
import OrderDashboard from '@/components/OrderDashboard';
import { toast } from '@/components/ui/use-toast';

const Account = () => {
  const navigate = useNavigate();
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
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    currentPassword: ''
  });

  // Update profile form when customer data changes
  useEffect(() => {
    if (currentCustomer) {
      setProfileForm({
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || '',
        address: typeof currentCustomer.address === 'string' 
          ? currentCustomer.address 
          : currentCustomer.address?.address || '',
        password: '',
        currentPassword: ''
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
      const hasChanges = 
        profileForm.name !== currentCustomer.name ||
        profileForm.email !== currentCustomer.email ||
        profileForm.phone !== currentCustomer.phone ||
        profileForm.address !== (typeof currentCustomer.address === 'string' 
          ? currentCustomer.address 
          : currentCustomer.address?.address || '');

      if (!hasChanges && !profileForm.password) {
        toast({
          title: "Aucune modification",
          description: "Vous n'avez effectué aucune modification",
          variant: "destructive",
        });
        return;
      }

      // Ne pas envoyer les champs password et currentPassword à updateProfile
      const { password, currentPassword, ...profileData } = profileForm;
      await updateProfile(profileData);
      
      setIsEditing(false);
      setProfileForm({
        ...profileForm,
        password: '',
        currentPassword: ''
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleSignInClick = () => {
    navigate('/customer-auth', { state: { from: '/account' } });
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Accès à votre compte</h1>
            <p className="text-muted-foreground mb-8">
              Connectez-vous pour accéder à votre espace personnel
            </p>
            <Button onClick={handleSignInClick} size="lg" className="flex items-center mx-auto">
              <LogIn className="mr-2 h-5 w-5" />
              Se connecter
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentCustomer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
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
            <Button variant="outline" onClick={handleSignOut} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>

          {/* Tableau de bord des statistiques */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
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
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Nom complet</Label>
                      <Input
                        id="edit-name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        placeholder="Votre email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Téléphone</Label>
                      <Input
                        id="edit-phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        required
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-current-password">Mot de passe actuel</Label>
                      <Input
                        id="edit-current-password"
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                        placeholder="Entrez votre mot de passe actuel pour confirmer les modifications"
                        required
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
                        minLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-address">Adresse</Label>
                    <Textarea
                      id="edit-address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="relative">
                      {loading ? (
                        <>
                          <span className="opacity-0">Sauvegarder</span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="animate-spin mr-2">⟳</span>
                            Mise à jour...
                          </span>
                        </>
                      ) : (
                        "Sauvegarder"
                      )}
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
      </main>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Account;
