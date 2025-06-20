
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CustomerInfoModal from '@/components/CustomerInfoModal';
import { useOrders } from '@/hooks/useOrders';
import { useWhatsApp } from '@/hooks/useWhatsApp';

const CustomOrder = () => {
  const { generateCustomOrderMessage } = useWhatsApp();
  const { createOrder } = useOrders();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    images: [] as File[]
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [orderType, setOrderType] = useState<'direct' | 'whatsapp'>('direct');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return false;
    }

    const budget = parseFloat(formData.budget);
    if (formData.budget && (isNaN(budget) || budget < 0)) {
      toast({
        title: "Erreur",
        description: "Le budget doit être un nombre positif valide.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDirectOrder = () => {
    if (!validateForm()) return;
    setOrderType('direct');
    setShowCustomerModal(true);
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;
    setOrderType('whatsapp');
    setShowCustomerModal(true);
  };

  const handleCustomerInfoSubmit = async (customerInfo: any) => {
    setIsSubmitting(true);
    
    try {
      const budget = parseFloat(formData.budget) || 0;
      
      if (orderType === 'whatsapp') {
        // Commander via WhatsApp
        const message = generateCustomOrderMessage(
          formData.name,
          formData.description,
          formData.budget,
          customerInfo.phone,
          customerInfo.address
        );
        
        const phoneNumber = "+243970284639";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Redirection vers WhatsApp",
          description: "Vous allez être redirigé vers WhatsApp pour finaliser votre commande.",
        });
      } else {
        // Commande directe
        const orderData = {
          customer_id: null,
          customer_name: customerInfo.name || 'Client',
          customer_phone: customerInfo.phone,
          customer_email: null,
          shipping_address: { address: customerInfo.address },
          total_amount: budget,
          subtotal: budget,
          status: 'pending' as const,
        };

        const orderItems = [{
          product_id: null,
          product_name: formData.name,
          product_image: '',
          quantity: 1,
          unit_price: budget,
          total_price: budget,
        }];

        await createOrder.mutateAsync({ order: orderData, items: orderItems });

        toast({
          title: "Commande enregistrée",
          description: "Votre commande personnalisée a été enregistrée avec succès.",
        });
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        description: '',
        budget: '',
        images: []
      });
      
      setShowCustomerModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
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
                        onClick={handleDirectOrder}
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
                        onClick={handleWhatsAppOrder}
                        disabled={isSubmitting}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Commander via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      
      <Footer />

      <CustomerInfoModal
        open={showCustomerModal}
        onOpenChange={setShowCustomerModal}
        onSubmit={handleCustomerInfoSubmit}
        title={orderType === 'whatsapp' ? "Commander via WhatsApp" : "Finaliser la commande"}
        description="Veuillez remplir vos informations pour finaliser votre commande"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CustomOrder;
