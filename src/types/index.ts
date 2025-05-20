
export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  images: string[];
  stock: number;
  category: string;
  tags: string[];
  variants?: ProductVariant[];
  featured: boolean;
  popular: number; // Number of orders, higher means more popular
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Size", "Color"
  options: string[]; // e.g., ["S", "M", "L"] or ["Red", "Blue", "Green"]
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariants?: {
    [key: string]: string; // e.g., { "Size": "M", "Color": "Red" }
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'support' | 'customer';
  phone?: string;
  email?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerId?: string;
  whatsappNumber: string;
  createdAt: Date;
}
