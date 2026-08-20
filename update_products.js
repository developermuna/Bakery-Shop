const fs = require('fs');

const fileContent = `export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number; // Base price
  categories: string[];
  ingredients: string[];
  allergens: string[];
  dietaryTags: string[];
  sizes: { label: string; price: number; servings: string }[];
  flavors?: string[];
  rating: number;
  reviewsCount: number;
  preparationLeadTimeHours: number;
  imageUuids: string[]; // For gallery
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

export const MOCK_PRODUCTS: Product[] = [
  // Bento Cakes (200gm - 199/-)
  {
    id: 'prod_bento_1',
    slug: 'butterscotch-bento-cake',
    name: 'Butterscotch Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'A delightful combination of caramel and whip cream with crunchy butterscotch layered inside vanilla sponge.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Whip Cream', 'Caramel', 'Butterscotch Crunch'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.8, reviewsCount: 42, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_bento_2',
    slug: 'vanilla-funfetti-bento-cake',
    name: 'Vanilla Funfetti Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'Moist vanilla sponge with colorful funfetti sprinkles baked in, topped with sweet frosting.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Whip Cream', 'Vanilla Extract', 'Sprinkles'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.7, reviewsCount: 35, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_bento_3',
    slug: 'strawberry-bento-cake',
    name: 'Strawberry Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'Strawberry flavored bento cake for a sweet, fruity treat.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Whip Cream', 'Strawberry Flavor'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.6, reviewsCount: 28, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_bento_4',
    slug: 'chocolate-bento-cake',
    name: 'Chocolate Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'Rich chocolate sponge and cream in a compact bento size.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Cocoa Powder', 'Whip Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.9, reviewsCount: 56, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_bento_5',
    slug: 'chocolate-cherry-bento-cake',
    name: 'Chocolate Cherry Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'Chocolate sponge with cherry filling and cream.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Cocoa Powder', 'Cherry Compote'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.7, reviewsCount: 31, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_bento_6',
    slug: 'blueberry-bento-cake',
    name: 'Blueberry Bento Cake',
    shortDescription: 'Delightful 200gm lunchbox cake.',
    description: 'Blueberry flavored bento cake with fresh blueberry compote.',
    price: 199,
    categories: ['Bento Cakes'],
    ingredients: ['Flour', 'Sugar', 'Blueberry Compote', 'Whip Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '200gm', price: 199, servings: '1-2' }],
    rating: 4.8, reviewsCount: 44, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true,
    storageGuidance: 'Keep refrigerated.'
  },

  // All Time Favourite Cakes
  {
    id: 'prod_fav_1',
    slug: 'pineapple-cake',
    name: 'Pineapple Cake',
    shortDescription: 'Moist vanilla sponge with fresh pineapple.',
    description: 'Layered of whip cream with soft & moist vanilla sponge, add fresh pineapple chunks and glaze.',
    price: 400,
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Vanilla Sponge', 'Whip Cream', 'Pineapple Chunks'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 400, servings: '4-6' }, { label: '1 kg', price: 750, servings: '8-10' }],
    rating: 4.8, reviewsCount: 88, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_fav_2',
    slug: 'butterscotch-cake',
    name: 'Butterscotch Cake',
    shortDescription: 'Caramel and whip cream with crunchy butterscotch.',
    description: 'A delightful combination of caramel and whip cream with crunchy butterscotch layered inside vanilla sponge.',
    price: 400,
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Vanilla Sponge', 'Whip Cream', 'Butterscotch Crunch'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 400, servings: '4-6' }, { label: '1 kg', price: 750, servings: '8-10' }],
    rating: 4.7, reviewsCount: 65, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_fav_3',
    slug: 'strawberry-cake',
    name: 'Strawberry Cake',
    shortDescription: 'Lovely strawberry and quirky chocolate.',
    description: 'This savoring combination of lovely strawberry and quirky chocolate will give you the feeling of being in the paradise of taste. A perfect treat for people who don',
    price: 400,
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Vanilla Sponge', 'Whip Cream', 'Strawberry', 'Chocolate'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 400, servings: '4-6' }, { label: '1 kg', price: 750, servings: '8-10' }],
    rating: 4.6, reviewsCount: 52, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_fav_13',
    slug: 'chocolate-truffle',
    name: 'Chocolate Truffle',
    shortDescription: 'Moist chocolate cake, silky truffle frosting.',
    description: 'Moist chocolate cake, silky Chocolate truffle frosting.',
    price: 500,
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Chocolate Sponge', 'Chocolate Truffle Frosting'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 500, servings: '4-6' }, { label: '1 kg', price: 950, servings: '8-10' }],
    rating: 4.9, reviewsCount: 112, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_fav_14',
    slug: 'redvelvet-cake',
    name: 'Redvelvet Cake',
    shortDescription: 'Soft and moist velvet shade with cream cheese.',
    description: 'A cake is incredible soft, moist and buttery with red velvet shade, frosting with cream cheese.',
    price: 500,
    categories: ['All Time Favourite Cakes'],
    ingredients: ['Red Velvet Sponge', 'Cream Cheese Frosting'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 500, servings: '4-6' }, { label: '1 kg', price: 950, servings: '8-10' }],
    rating: 4.8, reviewsCount: 95, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  
  // Premium Cakes
  {
    id: 'prod_prem_1',
    slug: 'french-vanilla-cake',
    name: 'French Vanilla Cake',
    shortDescription: 'Premium French Vanilla Cake.',
    description: 'A premium quality French Vanilla cake that melts in your mouth.',
    price: 600,
    categories: ['Premium Cakes'],
    ingredients: ['Premium Vanilla Sponge', 'French Vanilla Cream'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 600, servings: '4-6' }, { label: '1 kg', price: 1150, servings: '8-10' }],
    rating: 4.9, reviewsCount: 77, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_prem_2',
    slug: 'german-black-forest',
    name: 'German Black Forest Cake',
    shortDescription: 'Premium Black Forest Cake.',
    description: 'Authentic German Black Forest cake with premium cherries and chocolate.',
    price: 599,
    categories: ['Premium Cakes'],
    ingredients: ['Chocolate Sponge', 'Whip Cream', 'Cherries', 'Chocolate Flakes'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '500gm', price: 599, servings: '4-6' }, { label: '1 kg', price: 1099, servings: '8-10' }],
    rating: 4.8, reviewsCount: 63, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },

  // Cheese Cake Slice
  {
    id: 'prod_cheese_1',
    slug: 'hazelnut-cheese-cake-slice',
    name: 'Hazelnut Cheese Cake Slice',
    shortDescription: 'Rich hazelnut cheesecake slice.',
    description: 'A decadent slice of rich cheesecake infused with roasted hazelnuts.',
    price: 150,
    categories: ['Cheese Cake Slice'],
    ingredients: ['Cream Cheese', 'Hazelnut', 'Graham Cracker Crust'],
    allergens: ['Dairy', 'Wheat/Gluten', 'Nuts'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '1 Slice', price: 150, servings: '1' }],
    rating: 4.9, reviewsCount: 120, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80'],
    featured: true, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  },
  {
    id: 'prod_cheese_2',
    slug: 'strawberry-cheese-cake-slice',
    name: 'Strawberry Cheese Cake Slice',
    shortDescription: 'Classic strawberry cheesecake slice.',
    description: 'Creamy cheesecake topped with a sweet strawberry compote.',
    price: 150,
    categories: ['Cheese Cake Slice'],
    ingredients: ['Cream Cheese', 'Strawberry', 'Graham Cracker Crust'],
    allergens: ['Dairy', 'Wheat/Gluten'],
    dietaryTags: ['Eggless'],
    sizes: [{ label: '1 Slice', price: 150, servings: '1' }],
    rating: 4.8, reviewsCount: 94, preparationLeadTimeHours: 24,
    imageUuids: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80'],
    featured: false, seasonal: false, active: true, inStock: true, storageGuidance: 'Keep refrigerated.'
  }
];
`;

fs.writeFileSync('src/data/products.ts', fileContent);
