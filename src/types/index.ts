
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
  email?: string;
  phone?: string;
  address?: any;
  orders_count?: number;
  total_spent?: number;
  last_order_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  whatsapp_number?: string;
  total_amount: number;
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_status?: string;
  shipping_address?: any;
  notes?: string;
  tracking_number?: string;
  order_items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}
