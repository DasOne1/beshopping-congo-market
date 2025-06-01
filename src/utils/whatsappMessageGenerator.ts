
export const generateWhatsAppMessage = (
  customerData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
  },
  cartProducts?: any[],
  subtotal?: number,
  formatPrice?: (price: number) => string
): string => {
  const formatPriceLocal = formatPrice || ((price: number) => `${price} FC`);
  
  let message = `🛒 *Nouvelle Commande - BeShopping Congo*\n\n`;
  message += `👤 *Client:* ${customerData.customerName}\n`;
  message += `📱 *Téléphone:* ${customerData.customerPhone}\n`;
  message += `📍 *Adresse:* ${customerData.customerAddress}\n\n`;
  message += `🛍️ *Produits commandés:*\n`;
  
  if (cartProducts && cartProducts.length > 0) {
    cartProducts.forEach((item, index) => {
      const product = item.product || item;
      const price = product.discounted_price || product.original_price;
      const total = price * item.quantity;
      const status = product.status || 'active';
      message += `${index + 1}. ${product.name}\n`;
      message += `   • Quantité: ${item.quantity}\n`;
      message += `   • Prix unitaire: ${formatPriceLocal(price)}\n`;
      message += `   • Statut: ${status}\n`;
      message += `   • Total: ${formatPriceLocal(total)}\n\n`;
    });
  }
  
  message += `💰 *Total général: ${formatPriceLocal(subtotal || 0)}*\n\n`;
  message += `📅 *Date: ${new Date().toLocaleDateString('fr-FR')}*`;
  
  return message;
};
