
export interface Product {
  id: string;
  name: string;
  images: string[];
  original_price: number;
  discounted_price?: number;
  category_id: string;
  description: string;
  stock: number;
  status: string;
  featured?: boolean;
  tags?: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  status: string;
  created_at?: string;
  order_items?: any[];
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  total_spent?: number;
  orders_count?: number;
  created_at: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}
