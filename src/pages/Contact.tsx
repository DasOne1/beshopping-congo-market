import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useWhatsApp } from '@/hooks/useWhatsApp';

const Contact = () => {
  const { generateGeneralInquiryMessage } = useWhatsApp();
  
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      content: "Lubumbashi, République Démocratique du Congo"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      content: "+243 974 984 449"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "contact@beshoppingcongo.com"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      content: "Lun - Sam: 8h00 - 18h00"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions et vous aider dans vos achats
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos informations</h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">Contact rapide</h3>
              
              <WhatsAppContact
                message={generateGeneralInquiryMessage("J'aimerais avoir plus d'informations sur vos produits.")}
                className="w-full justify-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Discuter sur WhatsApp
              </WhatsAppContact>

              <WhatsAppContact
                message={generateGeneralInquiryMessage("J'aimerais passer une commande personnalisée.")}
                variant="outline"
                className="w-full justify-center"
              >
                Commande personnalisée
              </WhatsAppContact>
            </motion.div>
          </motion.div>

          {/* Map or Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Notre localisation</h2>
              <div className="bg-muted rounded-lg h-64 md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Carte de localisation
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lubumbasi, RDC
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-card rounded-lg border p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Pourquoi nous choisir ?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Livraison rapide à Lubumbasi
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Produits de qualité garantie
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Service client réactif
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Paiement sécurisé
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
