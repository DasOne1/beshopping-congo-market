
import { Product, Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Électronique',
    slug: 'electronique',
    description: 'Découvrez nos produits électroniques',
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mode & Vêtements',
    slug: 'mode-vetements',
    description: 'Tendances mode pour tous',
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Maison & Jardin',
    slug: 'maison-jardin',
    description: 'Tout pour votre maison',
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Sport & Loisirs',
    slug: 'sport-loisirs',
    description: 'Équipements sportifs et loisirs',
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Beauté & Santé',
    slug: 'beaute-sante',
    description: 'Produits de beauté et santé',
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy',
    description: 'Dernier modèle Samsung avec écran AMOLED',
    original_price: 450000,
    discounted_price: 380000,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    stock: 25,
    category_id: '1',
    tags: ['smartphone', 'samsung', 'android'],
    featured: true,
    popular: 95,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'T-shirt Coton Bio',
    description: 'T-shirt en coton biologique, doux et confortable',
    original_price: 15000,
    discounted_price: 12000,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
    stock: 50,
    category_id: '2',
    tags: ['t-shirt', 'coton', 'bio'],
    featured: false,
    popular: 78,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Casque Audio Bluetooth',
    description: 'Casque sans fil avec réduction de bruit',
    original_price: 120000,
    discounted_price: 95000,
    discount: 21,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
    stock: 30,
    category_id: '1',
    tags: ['casque', 'audio', 'bluetooth'],
    featured: true,
    popular: 88,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Canapé 3 Places',
    description: 'Canapé confortable en tissu pour salon',
    original_price: 350000,
    discounted_price: 280000,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
    stock: 8,
    category_id: '3',
    tags: ['canapé', 'salon', 'mobilier'],
    featured: true,
    popular: 72,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Ballon de Football',
    description: 'Ballon officiel pour matchs et entraînements',
    original_price: 8000,
    discounted_price: 6500,
    discount: 19,
    images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68'],
    stock: 100,
    category_id: '4',
    tags: ['football', 'sport', 'ballon'],
    featured: false,
    popular: 65,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Crème Hydratante Visage',
    description: 'Crème anti-âge pour tous types de peau',
    original_price: 25000,
    discounted_price: 20000,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03'],
    stock: 75,
    category_id: '5',
    tags: ['crème', 'beauté', 'hydratante'],
    featured: true,
    popular: 82,
    is_visible: true,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
