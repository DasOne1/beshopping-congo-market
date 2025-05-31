
import React, { useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import WhatsAppContact from '@/components/WhatsAppContact';

const CustomOrder = () => {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    contactInfo: '',
    images: [] as File[]
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      customerName: user?.user_metadata?.full_name || formData.contactInfo || 'Anonyme',
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

    // Reset form
    setFormData({
      name: '',
      description: '',
      budget: '',
      contactInfo: '',
      images: []
    });
  };

  const handleWhatsAppOrder = () => {
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
      customerName: user?.user_metadata?.full_name || formData.contactInfo || 'Client WhatsApp',
      productName: formData.name,
      description: formData.description,
      budget: formData.budget,
      orderType: 'whatsapp'
    });
    
    setShowConfirmation(true);
  };

  const generateWhatsAppMessage = () => {
    const message = `🛍️ *Commande Personnalisée - BeShopping Congo*

👤 *Client:* ${user?.user_metadata?.full_name || formData.contactInfo || 'Anonyme'}
📱 *Contact:* ${formData.contactInfo || 'Non spécifié'}

🎯 *Produit souhaité:* ${formData.name}

📝 *Description détaillée:*
${formData.description}

💰 *Budget approximatif:* ${formData.budget ? formData.budget + ' FC' : 'À discuter'}

📅 *Date de demande:* ${new Date().toLocaleDateString('fr-FR')}

Merci de me contacter pour plus de détails sur cette commande personnalisée.`;
    
    return message;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
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
              <CardContent className="p-8">
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
                    <Label className="text-base font-semibold">Images de référence (optionnel)</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ajoutez jusqu'à 5 images pour nous aider à mieux comprendre votre besoin
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button type="button" variant="outline" size="lg" asChild>
                            <span className="cursor-pointer">
                              <Upload className="h-5 w-5 mr-2" />
                              Ajouter des images
                            </span>
                          </Button>
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {formData.images.length}/5 images
                        </span>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
                      {user ? (
                        <Button type="submit" size="lg" className="h-14">
                          <Send className="h-5 w-5 mr-2" />
                          Envoyer ma commande
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          variant="outline"
                          size="lg"
                          className="h-14"
                          onClick={() => window.location.href = '/auth'}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Se connecter pour valider
                        </Button>
                      )}
                      
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
              onClick={() => setShowConfirmation(false)}
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
