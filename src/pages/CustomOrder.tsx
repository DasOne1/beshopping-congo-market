/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Send, User, MessageCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useNavigate } from 'react-router-dom';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useCustomOrderForm } from '@/hooks/useCustomOrderForm';
import WhatsAppConfirmationDialog from '@/components/WhatsAppConfirmationDialog';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentCustomer } = useEmailAuth();
  const { 
    showConfirmation: whatsappShowConfirmation, 
    orderDetails: whatsappOrderDetails, 
    sendWhatsAppMessage, 
    closeConfirmation,
    generateCustomOrderMessage 
  } = useWhatsApp();

  const {
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder,
    validateForm
  } = useCustomOrderForm({
    currentCustomer,
    onOrderComplete: () => {
      // Réinitialiser seulement les champs de la commande, préserver les infos du client
      setFormData(prev => ({
        ...prev,
        name: '',
        description: '',
        budget: '',
        images: []
        // contactInfo et address sont préservés
      }));
    }
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    contactInfo: '',
    address: '',
    images: [] as File[]
  });

  // Pré-remplir les informations si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && currentCustomer) {
      setFormData(prev => ({
        ...prev, // Préserver toutes les informations existantes (nom, description, budget, images)
        contactInfo: prev.contactInfo || currentCustomer.phone || currentCustomer.email || '',
        address: prev.address || currentCustomer.address?.address || ''
      }));
    }
  }, [isAuthenticated, currentCustomer]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5) // Limit to 5 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDirectOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: '/custom-order' } });
      return;
    }

    // Utiliser la validation du hook
    if (!validateForm(formData)) {
      return;
    }

    // Enregistrer la commande en base de données
    await handleSubmit(formData);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    closeConfirmation();
  };

  const handleWhatsAppOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: '/custom-order' } });
      return;
    }

    if (!validateForm(formData)) {
      return;
    }

    const message = generateCustomOrderMessage(
      formData.name,
      formData.description,
      formData.budget,
      formData.contactInfo,
      formData.address
    );
    
    // Envoyer le message WhatsApp et créer la commande en arrière-plan
    sendWhatsAppMessage(message, {
      customerName: currentCustomer?.name || formData.contactInfo || 'Client WhatsApp',
      customerPhone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
      customerAddress: currentCustomer?.address?.address || formData.address || 'Non spécifiée',
      productName: formData.name,
      description: formData.description,
      budget: formData.budget
    });

    // Créer la commande en arrière-plan
    handleWhatsAppOrder(formData).catch(error => {
      console.error('Erreur lors de la création de la commande WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande WhatsApp.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground">Commande Personnalisée</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vous ne trouvez pas ce que vous cherchez ? Décrivez-nous votre besoin et nous vous aiderons à le réaliser sur mesure.
              </p>
            </div>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardTitle className="text-2xl">Détails de votre commande</CardTitle>
                {isAuthenticated && (
                  <p className="text-sm text-muted-foreground">
                    Vos informations ont été pré-remplies depuis votre profil
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDirectOrder} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold">Nom du produit souhaité *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Robe de soirée sur mesure"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-base font-semibold">Budget approximatif (FC)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="Ex: 50000"
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-semibold">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez en détail ce que vous souhaitez: couleurs, tailles, matériaux, fonctionnalités, style, etc."
                      rows={6}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contact" className="text-base font-semibold">Informations de contact</Label>
                      <Input
                        id="contact"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                        placeholder="Téléphone ou email de contact"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-base font-semibold">Adresse de livraison</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Votre adresse de livraison"
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Images de référence (optionnel)</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ajoutez jusqu'à 5 images pour nous aider à mieux comprendre votre besoin
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Référence ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      {formData.images.length < 5 && (
                        <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            multiple
                          />
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">Choisissez votre méthode de validation</h3>
                      <p className="text-sm text-muted-foreground">
                        Vous pouvez enregistrer votre commande ou l'envoyer directement par WhatsApp
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="h-14"
                        disabled={isSubmitting}
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Enregistrement...' : 'Passer la commande'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-14 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        onClick={handleWhatsAppOrderClick}
                        disabled={isSubmitting}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Commander via WhatsApp
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Boîte de dialogue de confirmation centralisée */}
      <WhatsAppConfirmationDialog
        open={showConfirmation || whatsappShowConfirmation}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmation(false);
            closeConfirmation();
          }
        }}
        orderDetails={orderDetails || whatsappOrderDetails}
        message={orderDetails?.orderType === 'whatsapp' ? generateCustomOrderMessage(
          formData.name,
          formData.description,
          formData.budget,
          formData.contactInfo,
          formData.address
        ) : undefined}
        onClose={handleConfirmationClose}
      />
    </div>
  );
};

export default CustomOrder;