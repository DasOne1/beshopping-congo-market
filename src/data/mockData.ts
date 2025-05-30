
import { Product, Category } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech products' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', description: 'Trendy clothes and accessories' },
  { id: 'cat3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Everything for your home' },
  { id: 'cat4', name: 'Beauty & Health', slug: 'beauty-health', description: 'Beauty and personal care products' },
  { id: 'cat5', name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear' }
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Smartphone Pro X',
    description: 'Latest smartphone with high-resolution camera and long battery life.',
    original_price: 180000,
    discounted_price: 150000,
    discount: 17,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&h=400'],
    stock: 25,
    category_id: 'cat1',
    tags: ['smartphone', 'tech', 'camera'],
    featured: true,
    popular: 85
  },
  {
    id: 'prod2',
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation.',
    original_price: 45000,
    discounted_price: 35000,
    discount: 22,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&h=400'],
    stock: 50,
    category_id: 'cat1',
    tags: ['audio', 'wireless', 'tech'],
    featured: false,
    popular: 63
  },
  {
    id: 'prod3',
    name: 'Designer T-Shirt',
    description: 'Premium quality cotton t-shirt with trendy design.',
    original_price: 25000,
    discounted_price: 20000,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=400&h=400'],
    stock: 100,
    category_id: 'cat2',
    tags: ['fashion', 'clothing', 'casual'],
    featured: true,
    popular: 92
  },
  {
    id: 'prod4',
    name: 'Kitchen Blender Pro',
    description: 'Powerful blender for all your kitchen needs.',
    original_price: 65000,
    discounted_price: 50000,
    discount: 23,
    images: ['https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&h=400'],
    stock: 30,
    category_id: 'cat3',
    tags: ['kitchen', 'appliance', 'blender'],
    featured: true,
    popular: 45
  },
  {
    id: 'prod5',
    name: 'Organic Face Cream',
    description: 'Rejuvenating face cream made with natural ingredients.',
    original_price: 35000,
    discounted_price: 30000,
    discount: 14,
    images: ['https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=400&h=400'],
    stock: 75,
    category_id: 'cat4',
    tags: ['skincare', 'beauty', 'organic'],
    featured: false,
    popular: 78
  },
  {
    id: 'prod6',
    name: 'Running Shoes',
    description: 'Comfortable and durable running shoes for all terrains.',
    original_price: 90000,
    discounted_price: 75000,
    discount: 17,
    images: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&h=400'],
    stock: 40,
    category_id: 'cat5',
    tags: ['shoes', 'sports', 'running'],
    featured: true,
    popular: 58
  }
];
