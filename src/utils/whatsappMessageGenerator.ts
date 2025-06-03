
interface CartProduct {
  product?: {
    name: string;
    discounted_price?: number;
    original_price: number;
  };
  quantity: number;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

export const generateWhatsAppMessage = (
  formData: FormData,
  cartProducts?: CartProduct[],
  subtotal?: number,
  formatPrice?: (price: number) => string
): string => {
  let message = `Bonjour, je souhaite passer une commande avec les informations suivantes:\n\nNom: ${formData.customerName}\nTéléphone: ${formData.customerPhone}\nAdresse: ${formData.customerAddress}`;
  
  if (cartProducts && cartProducts.length > 0) {
    message += '\n\nProduits commandés:';
    cartProducts.forEach(item => {
      if (item.product) {
        const price = item.product.discounted_price || item.product.original_price;
        const itemTotal = formatPrice ? formatPrice(price * item.quantity) : (price * item.quantity);
        message += `\n- ${item.product.name} x${item.quantity} = ${itemTotal} FC`;
      }
    });
    
    if (subtotal && formatPrice) {
      message += `\n\nTotal: ${formatPrice(subtotal)} FC`;
    }
  }
  
  return message;
};
