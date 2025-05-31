
export interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  discount?: number;
  images: string[];
  stock: number;
  category_id?: string;
  tags: string[];
  featured?: boolean;
  popular?: number;
  sku?: string;
  weight?: number;
  dimensions?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orders_count?: number;
  total_spent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at?: string;
}
