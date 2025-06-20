
import { useState } from 'react';
import { Product } from '@/types';

interface WhatsAppOrderDetails {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  productName?: string;
  description?: string;
  budget?: string;
  orderType: 'whatsapp';
}

export const useWhatsApp = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<WhatsAppOrderDetails | null>(null);

  // Numéro WhatsApp centralisé
  const WHATSAPP_NUMBER = '+243978100940';

  const sendWhatsAppMessage = (message: string, orderDetails?: Partial<WhatsAppOrderDetails>) => {
    // Ouvrir WhatsApp immédiatement
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, ''); // Supprimer tous les caractères non numériques
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}&app_absent=0`;
    window.open(whatsappUrl, '_blank');

    // Afficher la boîte de dialogue de confirmation après l'ouverture de WhatsApp
    if (orderDetails) {
      setOrderDetails({
        customerName: orderDetails.customerName || 'Utilisateur',
        customerPhone: orderDetails.customerPhone || 'Non spécifié',
        customerAddress: orderDetails.customerAddress,
        productName: orderDetails.productName,
        description: orderDetails.description,
        budget: orderDetails.budget,
        orderType: 'whatsapp'
      });
    }
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setOrderDetails(null);
  };

  const generateProductOrderMessage = (productName: string, price: number, quantity: number, selectedColor?: string, selectedSize?: string) => {
    return `Bonjour, je souhaite commander le produit suivant:

Produit: ${productName}
Prix: ${price.toLocaleString()} CDF
Quantité: ${quantity}
${selectedColor ? `Couleur: ${selectedColor}` : ''}
${selectedSize ? `Taille: ${selectedSize}` : ''}

Pouvez-vous me confirmer la disponibilité et les modalités de livraison ?`;
  };

  const generateCustomOrderMessage = (productName: string, description: string, budget?: string, contactInfo?: string, address?: string) => {
    return `🛍️ *Commande Personnalisée - BeShopping Congo*

👤 *Client:* ${contactInfo || 'Anonyme'}
📱 *Contact:* ${contactInfo || 'Non spécifié'}
📍 *Adresse:* ${address || 'Non spécifiée'}

🎯 *Produit souhaité:* ${productName}

📝 *Description détaillée:*
${description}

💰 *Budget approximatif:* ${budget ? budget + ' FC' : 'À discuter'}

📅 *Date de demande:* ${new Date().toLocaleDateString('fr-FR')}

Merci de me contacter pour plus de détails sur cette commande personnalisée.`;
  };

  const generateGeneralInquiryMessage = (inquiry: string) => {
    return `Bonjour! ${inquiry}`;
  };

  const generateCartOrderMessage = (cartProducts: Array<{product: Product, quantity: number}>, subtotal: number, customerData: {customerName?: string, customerPhone?: string, customerAddress?: string}) => {
    const formatPrice = (price: number) => `${price.toLocaleString()} CDF`;
    
    let message = `🛒 *Nouvelle Commande - BeShopping Congo*\n\n`;
    message += `👤 *Client:* ${customerData.customerName || 'Anonyme'}\n`;
    message += `📱 *Téléphone:* ${customerData.customerPhone || 'Non spécifié'}\n`;
    message += `📍 *Adresse:* ${customerData.customerAddress || 'Non spécifiée'}\n\n`;
    message += `🛍️ *Produits commandés:*\n`;
    
    cartProducts.forEach((item, index) => {
      const product = item.product;
      const price = product.discounted_price || product.original_price;
      const total = price * item.quantity;
      message += `${index + 1}. ${product.name}\n`;
      message += `   • Quantité: ${item.quantity}\n`;
      message += `   • Prix unitaire: ${formatPrice(price)}\n`;
      message += `   • Total: ${formatPrice(total)}\n\n`;
    });
    
    message += `💰 *Total général: ${formatPrice(subtotal)}*\n\n`;
    message += `📅 *Date: ${new Date().toLocaleDateString('fr-FR')}*`;
    
    return message;
  };

  return {
    WHATSAPP_NUMBER,
    showConfirmation,
    orderDetails,
    sendWhatsAppMessage,
    closeConfirmation,
    generateProductOrderMessage,
    generateCustomOrderMessage,
    generateGeneralInquiryMessage,
    generateCartOrderMessage
  };
}; 
