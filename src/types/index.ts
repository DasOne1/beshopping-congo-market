
export interface Product {
  id: string;
  name: string;
  description?: string;
  original_price: number;
  discounted_price?: number;
  discount?: number;
  images?: string[];
  category_id?: string;
  stock: number;
  featured?: boolean;
  popular?: number;
  tags?: string[];
  is_visible: boolean;
  status?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
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
  address?: Address | string;
  status?: string;
  total_spent?: number;
  orders_count?: number;
  last_order_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  address?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  whatsapp_number?: string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  total_amount: number;
  shipping_address?: Address;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
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
  created_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}
