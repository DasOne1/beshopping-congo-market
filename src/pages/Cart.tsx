import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@/contexts/CartContext';
import { UserLayout } from '@/layouts/UserLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import OrderSummary from '@/components/OrderSummary';

const Cart = () => {
  const { cartProducts, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartProducts.reduce((acc, item) => {
    return acc + (item.product.discounted_price || item.product.original_price) * item.quantity;
  }, 0);

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
        
        {cartProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link to="/products">
              <Button>Voir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((item) => (
                <Card key={item.productId}>
                  <CardHeader>
                    <CardTitle>{item.product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 space-y-2">
                      <p className="text-sm text-muted-foreground">{item.product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.productId)}>
                          Supprimer
                        </Button>
                      </div>
                      <p className="font-semibold">
                        {formatPrice((item.product.discounted_price || item.product.original_price) * item.quantity)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <OrderSummary
                cartProducts={cartProducts}
                subtotal={subtotal}
                formatPrice={formatPrice}
              />
              
              <div className="space-y-4">
                <Link to="/custom-order" className="block">
                  <Button className="w-full" size="lg">
                    Passer la commande
                  </Button>
                </Link>
                
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Cart;
