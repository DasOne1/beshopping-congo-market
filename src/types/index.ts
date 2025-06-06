
export interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  stock: number;
  category_id: string;
  images: string[];
  tags: string[];
  featured: boolean;
  popular?: number;
  weight?: number;
  dimensions?: any;
  sku?: string;
  status: 'active' | 'inactive' | 'draft';
  discount?: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parent_id?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
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
