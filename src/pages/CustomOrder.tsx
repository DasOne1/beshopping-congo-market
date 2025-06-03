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

const CustomOrder = () => {
  const { currentCustomer, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState(() => {
    // Récupérer les données sauvegardées du localStorage si elles existent
    const savedData = localStorage.getItem('customOrderFormData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      description: '',
      budget: '',
      contactInfo: '',
      address: '',
      images: [] as File[]
    };
  });

  // Sauvegarder les données du formulaire dans le localStorage à chaque modification
  useEffect(() => {
    const dataToSave = {
      ...formData,
      images: [] // On ne sauvegarde pas les images car ce sont des objets File
    };
    localStorage.setItem('customOrderFormData', JSON.stringify(dataToSave));
  }, [formData]);

  // Pré-remplir les informations du client connecté
  useEffect(() => {
    if (currentCustomer) {
      setFormData(prev => ({
        ...prev,
        contactInfo: currentCustomer.phone || currentCustomer.email || '',
        address: typeof currentCustomer.address === 'string' 
          ? currentCustomer.address 
          : currentCustomer.address?.address || ''
      }));
    }
  }, [currentCustomer]);

  // Effacer les informations du compte lors de la déconnexion
  useEffect(() => {
    if (!isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        contactInfo: '',
        address: ''
      }));
    }
  }, [isAuthenticated]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: '/custom-order' } });
      return;
    }
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    // Set order details for confirmation popup
    setOrderDetails({
      customerName: currentCustomer?.name || formData.contactInfo || 'Anonyme',
      customerPhone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
      customerAddress: currentCustomer?.address || formData.address || 'Non spécifiée',
      productName: formData.name,
      description: formData.description,
      budget: formData.budget,
      orderType: 'form'
    });
    
    setShowConfirmation(true);

    // For now, just show success message
    toast({
      title: "Commande personnalisée envoyée",
      description: "Nous vous contactons bientôt pour discuter de votre projet",
    });
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    
    // Ne réinitialiser que les champs de la commande, pas les informations du client
    setFormData(prev => ({
      ...prev,
      name: '',
      description: '',
      budget: '',
      images: []
    }));
    
    // Mettre à jour le localStorage en conservant les informations du client
    const dataToSave = {
      name: '',
      description: '',
      budget: '',
      contactInfo: formData.contactInfo,
      address: formData.address,
      images: []
    };
    localStorage.setItem('customOrderFormData', JSON.stringify(dataToSave));
  };

  const handleWhatsAppOrder = () => {
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: '/custom-order' } });
      return;
    }

    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez au moins remplir le nom du produit et la description",
        variant: "destructive",
      });
      return;
    }

    // Set order details for confirmation popup
    setOrderDetails({
      customerName: currentCustomer?.name || formData.contactInfo || 'Client WhatsApp',
      customerPhone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
      customerAddress: currentCustomer?.address || formData.address || 'Non spécifiée',
      productName: formData.name,
      description: formData.description,
      budget: formData.budget,
      orderType: 'whatsapp'
    });
    
    setShowConfirmation(true);

    // Ouvrir WhatsApp immédiatement après avoir affiché la confirmation
    const encodedMessage = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/243978100940?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateWhatsAppMessage = () => {
    const message = `🛍️ *Commande Personnalisée - BeShopping Congo*

👤 *Client:* ${currentCustomer?.name || formData.contactInfo || 'Anonyme'}
📱 *Contact:* ${currentCustomer?.phone || formData.contactInfo || 'Non spécifié'}
📍 *Adresse:* ${currentCustomer?.address || formData.address || 'Non spécifiée'}

🎯 *Produit souhaité:* ${formData.name}

📝 *Description détaillée:*
${formData.description}

💰 *Budget approximatif:* ${formData.budget ? formData.budget + ' FC' : 'À discuter'}

📅 *Date de demande:* ${new Date().toLocaleDateString('fr-FR')}

${formData.images.length > 0 ? `\n📸 *Images de référence:* ${formData.images.length} image(s) téléchargée(s)
*Note:* Veuillez envoyer les images séparément dans le chat WhatsApp après l'envoi de ce message.` : ''}

Merci de me contacter pour plus de détails sur cette commande personnalisée.`;
    
    return message;
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
                <form onSubmit={handleSubmit} className="space-y-8">
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
                        Vous pouvez envoyer votre commande via le formulaire ou directement par WhatsApp
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="h-14"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Passer la commande
                      </Button>
                      
                      <WhatsAppContact
                        phoneNumber="+243978100940"
                        message={generateWhatsAppMessage()}
                        className="h-14 bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                        onCustomClick={handleWhatsAppOrder}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Envoyer via WhatsApp
                      </WhatsAppContact>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      {/* Popup de confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Commande Envoyée !
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Votre commande personnalisée a été envoyée avec succès !
              </p>
            </div>
            
            {orderDetails && (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Client:</span> {orderDetails.customerName}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {orderDetails.customerPhone}
                </div>
                <div>
                  <span className="font-medium">Adresse:</span> {orderDetails.customerAddress}
                </div>
                <div>
                  <span className="font-medium">Produit:</span> {orderDetails.productName}
                </div>
                {orderDetails.budget && (
                  <div>
                    <span className="font-medium">Budget:</span> {orderDetails.budget} FC
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {orderDetails.orderType === 'whatsapp' 
                    ? "Envoyé via WhatsApp - Vous allez être redirigé(e)"
                    : "Nous vous contacterons bientôt pour discuter de votre projet"
                  }
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleConfirmationClose}
              className="w-full"
            >
              Parfait !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default CustomOrder;