import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartProduct {
  product: Product;
  productId: string;
  quantity: number;
}

interface OrderSummaryProps {
  cartProducts: CartProduct[];
  subtotal: number;
  formatPrice: (price: number) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartProducts,
  subtotal,
  formatPrice
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartProducts.map((item) => (
          <div key={item.productId} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
            </div>
            <p className="font-semibold">
              {formatCurrency((item.product.discounted_price || item.product.original_price) * item.quantity, item.product.currency || 'CDF')}
            </p>
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(subtotal, cartProducts[0]?.product.currency || 'CDF')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
