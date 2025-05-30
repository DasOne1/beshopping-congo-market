
export interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number; // Added this required field
  originalPrice?: number; // Keep for compatibility
  discounted_price?: number;
  discountedPrice?: number;
  discount?: number;
  images: string[];
  stock: number;
  category?: string; // Made optional to fix TypeScript errors
  category_id?: string;
  tags: string[];
  variants?: ProductVariant[];
  featured: boolean;
  popular: number; // Number of orders, higher means more popular
  sku?: string;
  weight?: number;
  dimensions?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
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
