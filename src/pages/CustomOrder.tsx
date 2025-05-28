
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Send, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import WhatsAppContact from '@/components/WhatsAppContact';

const CustomOrder = () => {
  const { user } = useAuth();
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

  const generateWhatsAppMessage = () => {
    const message = `Bonjour! Je souhaite passer une commande personnalisée:
    
Produit: ${formData.name}
Description: ${formData.description}
Budget approximatif: ${formData.budget ? formData.budget + ' FC' : 'À discuter'}
Contact: ${formData.contactInfo}

Merci de me contacter pour plus de détails.`;
    
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
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Commande Personnalisée</h1>
              <p className="text-muted-foreground">
                Vous ne trouvez pas ce que vous cherchez ? Décrivez-nous votre besoin et nous vous aiderons à le réaliser.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détails de votre commande</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nom du produit souhaité *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Robe de soirée sur mesure"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez en détail ce que vous souhaitez: couleurs, tailles, matériaux, fonctionnalités..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget approximatif (FC)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: 50000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Informations de contact</Label>
                    <Input
                      id="contact"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                      placeholder="Téléphone ou email de contact"
                    />
                  </div>

                  <div>
                    <Label>Images de référence (optionnel)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ajoutez jusqu'à 5 images pour nous aider à mieux comprendre votre besoin
                    </p>
                    
                    <div className="space-y-4">
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
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Ajouter des images
                            </span>
                          </Button>
                        </label>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Choisissez votre méthode de validation:
                      </p>
                    </div>

                    {user ? (
                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer ma commande personnalisée
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.location.href = '/auth'}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Se connecter pour valider
                        </Button>
                        
                        <div className="text-center text-sm text-muted-foreground">ou</div>
                        
                        <WhatsAppContact
                          phoneNumber="+243978100940"
                          message={generateWhatsAppMessage()}
                          className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white"
                        >
                          Envoyer via WhatsApp
                        </WhatsAppContact>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomOrder;
