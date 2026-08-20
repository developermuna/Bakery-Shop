const fs = require('fs');

const bento = ['Butterscotch Bento Cake', 'Vanilla Funfetti Bento Cake', 'Strawberry Bento Cake', 'Choco Vanilla Bento Cake', 'Chocolate Bento Cake', 'Chocolate Cherry Bento Cake', 'Blueberry Bento Cake'].map((n, i) => ({
    id: 'prod_bento_' + i,
    slug: n.toLowerCase().replace(/ /g, '-'),
    name: n,
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: n + ' in a compact bento size.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.8, reviewsCount: 40, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
}));

const favs_data = [
['Pineapple Cake', 400, 750],
['Butterscotch Cake', 400, 750],
['Strawberry Cake', 400, 750],
['Choco Vanilla', 400, 750],
['Blueberry Cake', 400, 750],
['Fresh Fruit Cake', 400, 750],
['Light Chocolate', 400, 750],
['Blackforest Cake', 400, 750],
['Marble Crunch', 450, 850],
['White Forest Cake', 450, 850],
['Oreo Fantasy Cake', 450, 850],
['Coffee Chocolate', 450, 850],
['Chocolate Truffle', 500, 950],
['Redvelvet Cake', 500, 950],
['Milk and Hazelnut', 500, 950],
['Gulab Jamun Treat', 600, 1100],
['Rasmalai Treat', 600, 1100]
];
const favs = favs_data.map((d, i) => ({
    id: 'prod_fav_' + i,
    slug: d[0].toLowerCase().replace(/ /g, '-'),
    name: d[0],
    shortDescription: 'All time favourite ' + d[0],
    description: 'Delicious ' + d[0] + ' made with love.',
    price: d[1],
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Flour', 'Sugar', 'Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: d[1], servings: '4-6' }, { label: '1 kg', price: d[2], servings: '8-10' }],
    rating: 4.8, reviewsCount: 50, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
}));

const prem_data = [
['French Vanilla Cake', 600, 1150],
['German Black Forest Cake', 599, 1099],
['Dutch Truffle', 599, 1099],
['Fresh Fruit Gateaux', 599, 1099],
['Blueberry N White Chocolate', 599, 1099],
['Sacher Torte', 649, 1199],
['Chocolate N Hazelnut', 649, 1199],
['Nutty Thandai Cake', 649, 1199]
];
const prem = prem_data.map((d, i) => ({
    id: 'prod_prem_' + i,
    slug: d[0].toLowerCase().replace(/ /g, '-'),
    name: d[0],
    shortDescription: 'Premium ' + d[0],
    description: 'Premium quality ' + d[0] + '.',
    price: d[1],
    categories: ['Premium Cakes'],
    ingredients: ['Flour', 'Sugar', 'Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: d[1], servings: '4-6' }, { label: '1 kg', price: d[2], servings: '8-10' }],
    rating: 4.9, reviewsCount: 70, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
}));

const cheese_data = [
['Hazelnut Cheese Cake Slice', 150],
['Strawberry Cheese Cake Slice', 150],
['Blueberry Cheese Cake Slice', 150],
['Lotus Biscoff Slice', 180]
];
const cheese = cheese_data.map((d, i) => ({
    id: 'prod_cheese_' + i,
    slug: d[0].toLowerCase().replace(/ /g, '-'),
    name: d[0],
    shortDescription: 'Delicious ' + d[0],
    description: 'Rich and creamy ' + d[0] + '.',
    price: d[1],
    categories: ['Cheese Cake Slice'],
    ingredients: ['Cream Cheese', 'Sugar'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '1 Slice', price: d[1], servings: '1' }],
    rating: 4.8, reviewsCount: 30, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
}));

const allProducts = [...bento, ...favs, ...prem, ...cheese];

const fileContent = `export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
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

export const CATEGORIES = [
  'Bento Cakes',
  'All Time Favourite Cakes',
  'Premium Cakes',
  'Cheese Cake Slice'
];

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;
fs.writeFileSync('src/data/products.ts', fileContent);
