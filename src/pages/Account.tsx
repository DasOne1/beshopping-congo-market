
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Edit, Save, X, LogOut, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEnhancedCustomerAuth } from '@/hooks/useEnhancedCustomerAuth';
import { useNavigate } from 'react-router-dom';
import SimpleAuthForm from '@/components/SimpleAuthForm';

const Account = () => {
  const navigate = useNavigate();
  const { 
    currentCustomer, 
    isAuthenticated, 
    loading, 
    sessionLoading,
    updateProfile, 
    signOut 
  } = useEnhancedCustomerAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  // Charger les données du client quand elles sont disponibles
  useEffect(() => {
    if (currentCustomer) {
      console.log('Chargement des données client:', currentCustomer);
      setFormData({
        name: currentCustomer.name || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        address: typeof currentCustomer.address === 'string' 
          ? currentCustomer.address 
          : currentCustomer.address?.street || '',
      });
    }
  }, [currentCustomer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleCancel = () => {
    if (currentCustomer) {
      setFormData({
        name: currentCustomer.name || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        address: typeof currentCustomer.address === 'string' 
          ? currentCustomer.address 
          : currentCustomer.address?.street || '',
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  // Affichage pendant le chargement de la session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 dark:text-gray-300">Chargement de votre session...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage si l'utilisateur n'est pas connecté
  if (!isAuthenticated || !currentCustomer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="h-5 w-5" />
                    Connexion requise
                  </CardTitle>
                  <CardDescription>
                    Connectez-vous pour accéder à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleAuthForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mon Compte</h1>
              <p className="text-muted-foreground">
                Gérez vos informations personnelles
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informations personnelles
                      </CardTitle>
                      <CardDescription>
                        Vos informations de contact et d'identification
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={loading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nom */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Votre nom complet"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.name || 'Non renseigné'}</span>
                        </div>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Votre numéro de téléphone"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.phone || 'Non renseigné'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre.email@exemple.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.email || 'Non renseigné'}</span>
                      </div>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Votre adresse complète"
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span>{formData.address || 'Non renseigné'}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec statistiques */}
            <div className="space-y-6">
              {/* Statistiques du compte */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Mon activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Commandes totales</span>
                    <span className="font-semibold">{currentCustomer.orders_count || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total dépensé</span>
                    <span className="font-semibold">
                      {currentCustomer.total_spent ? `${currentCustomer.total_spent.toLocaleString()} FC` : '0 FC'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentCustomer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentCustomer.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du compte */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Membre depuis</span>
                    <p className="font-medium">
                      {currentCustomer.created_at 
                        ? new Date(currentCustomer.created_at).toLocaleDateString('fr-FR')
                        : 'Date inconnue'
                      }
                    </p>
                  </div>
                  {currentCustomer.last_order_date && (
                    <div>
                      <span className="text-sm text-muted-foreground">Dernière commande</span>
                      <p className="font-medium">
                        {new Date(currentCustomer.last_order_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Account;
