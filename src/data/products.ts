import { BAKERY_PRODUCTS_DATA } from './bakeryProducts';
import { CAKE_PRODUCTS_DATA } from './cakeProducts';
import { DECORATION_PRODUCTS_DATA } from './decorationProducts';
import { RECOMMENDED_CAKES } from './recommendedProducts';

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  catalog: string;
  categories: string[];
  ingredients: string[];
  allergens: string[];
  dietaryTags: string[];
  sizes: { label: string; price: number; servings: string }[];
  flavors?: string[];
  rating: number;
  reviewsCount: number;
  preparationLeadTimeHours: number;
  imageUuids: string[];
  featured: boolean;
  seasonal: boolean;
  active: boolean;
  inStock: boolean;
  storageGuidance: string;
}

export const MOCK_PRODUCTS: Product[] = [
  ...RECOMMENDED_CAKES,
  ...BAKERY_PRODUCTS_DATA,
  ...CAKE_PRODUCTS_DATA,
  ...DECORATION_PRODUCTS_DATA
];

export const CATEGORIES = Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.categories)));
