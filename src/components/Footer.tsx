
import React from 'react';
import { Separator } from '@/components/ui/separator';
import WhatsAppContact from '@/components/WhatsAppContact';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+243 970 284 772</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@ecommerce.cd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Kinshasa, RD Congo</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm hover:underline">
                  À propos
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/products" className="text-sm hover:underline">
                  Produits
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
            <div className="flex gap-4 mb-4">
              <Facebook className="h-5 w-5" />
              <Instagram className="h-5 w-5" />
              <Twitter className="h-5 w-5" />
            </div>
            <WhatsAppContact
              phoneNumber="243970284772"
              message="Bonjour, j'aimerais avoir plus d'informations."
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Contactez-nous
            </WhatsAppContact>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2024 E-Commerce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
