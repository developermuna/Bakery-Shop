export interface Product {
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
  'Celebration Cakes',
  'Chocolate Cakes',
  'Fruit Cakes',
  'Cheesecakes',
  'Cupcakes',
  'Slices',
  'Seasonal'
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'vanilla-bean-cloud-cake',
    name: 'Vanilla Bean Cloud Cake',
    shortDescription: 'Light, airy sponge layered with Madagascar vanilla bean mascarpone.',
    description: 'Our signature Vanilla Bean Cloud Cake is an ethereal experience. Three layers of incredibly light, moist vanilla sponge are interspersed with a rich, yet airy, mascarpone cream infused with authentic Madagascar vanilla beans. Finished with a rustic buttercream frost and optional fresh floral accents.',
    price: 65,
    categories: ['Celebration Cakes', 'Featured'],
    ingredients: ['Cake Flour', 'Sugar', 'Butter', 'Eggs', 'Mascarpone Cheese', 'Heavy Cream', 'Madagascar Vanilla Beans', 'Baking Powder', 'Salt'],
    allergens: ['Dairy', 'Eggs', 'Wheat/Gluten'],
    dietaryTags: ['Vegetarian'],
    sizes: [
      { label: '6 inch', price: 65, servings: '8-10' },
      { label: '8 inch', price: 85, servings: '12-16' },
      { label: '10 inch', price: 110, servings: '20-25' }
    ],
    flavors: ['Classic Vanilla', 'Vanilla Raspberry', 'Vanilla Lemon'],
    rating: 4.9,
    reviewsCount: 124,
    preparationLeadTimeHours: 48,
    imageUuids: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'
    ],
    featured: true,
    seasonal: false,
    active: true,
    inStock: true,
    storageGuidance: 'Keep refrigerated until 1-2 hours before serving. Best consumed within 3 days.'
  },
  {
    id: 'prod_2',
    slug: 'dark-chocolate-truffle',
    name: 'Dark Chocolate Truffle Cake',
    shortDescription: 'Decadent, gluten-free dark chocolate cake with a velvety ganache glaze.',
    description: 'For the true chocolate aficionado. This flourless dark chocolate cake is dense, fudgy, and intensely flavorful. Enrobed in a smooth 70% dark chocolate ganache and dusted with premium Dutch cocoa powder.',
    price: 75,
    categories: ['Chocolate Cakes', 'Featured'],
    ingredients: ['70% Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Dutch Cocoa Powder', 'Vanilla Extract', 'Sea Salt'],
    allergens: ['Dairy', 'Eggs'],
    dietaryTags: ['Gluten-Free', 'Vegetarian'],
    sizes: [
      { label: '6 inch', price: 75, servings: '8-10' },
      { label: '8 inch', price: 95, servings: '12-16' }
    ],
    rating: 4.8,
    reviewsCount: 89,
    preparationLeadTimeHours: 48,
    imageUuids: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80'
    ],
    featured: true,
    seasonal: false,
    active: true,
    inStock: true,
    storageGuidance: 'Store at room temperature in an airtight container for up to 3 days, or refrigerate for up to 1 week. Serve at room temperature.'
  },
  {
    id: 'prod_3',
    slug: 'pistachio-rose-tart',
    name: 'Pistachio Rose Tart',
    shortDescription: 'Delicate buttery crust filled with pistachio frangipane and rosewater cream.',
    description: 'A beautiful fusion of Middle Eastern flavors and French pastry technique. A crisp, buttery pâte sucrée crust holds a moist pistachio frangipane, topped with a delicate rosewater-infused white chocolate whip and crushed roasted pistachios.',
    price: 45,
    categories: ['Slices', 'Seasonal'],
    ingredients: ['Flour', 'Butter', 'Sugar', 'Eggs', 'Pistachios', 'White Chocolate', 'Heavy Cream', 'Rosewater', 'Almond Flour'],
    allergens: ['Dairy', 'Eggs', 'Wheat/Gluten', 'Tree Nuts (Pistachios, Almonds)'],
    dietaryTags: ['Vegetarian'],
    sizes: [
      { label: '8 inch Tart', price: 45, servings: '8' },
      { label: '10 inch Tart', price: 60, servings: '12' }
    ],
    rating: 4.7,
    reviewsCount: 42,
    preparationLeadTimeHours: 24,
    imageUuids: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80'
    ],
    featured: false,
    seasonal: true,
    active: true,
    inStock: true,
    storageGuidance: 'Keep refrigerated. Best consumed within 2 days of pickup.'
  },
  {
    id: 'prod_4',
    slug: 'classic-berry-pavlova',
    name: 'Classic Berry Pavlova',
    shortDescription: 'Crisp meringue with a marshmallow center, piled high with fresh seasonal berries.',
    description: 'A show-stopping dessert perfect for any occasion. Our pavlova features a beautifully baked meringue crust that gives way to a soft, marshmallow-like interior. Generously topped with softly whipped cream and a mountain of fresh, seasonal berries.',
    price: 55,
    categories: ['Fruit Cakes'],
    ingredients: ['Egg Whites', 'Caster Sugar', 'Cornstarch', 'White Vinegar', 'Heavy Cream', 'Vanilla Extract', 'Mixed Fresh Berries'],
    allergens: ['Dairy', 'Eggs'],
    dietaryTags: ['Gluten-Free', 'Vegetarian'],
    sizes: [
      { label: 'Standard (8 inch)', price: 55, servings: '8-10' }
    ],
    rating: 4.9,
    reviewsCount: 67,
    preparationLeadTimeHours: 24,
    imageUuids: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80'
    ],
    featured: true,
    seasonal: true,
    active: true,
    inStock: true,
    storageGuidance: 'Must be consumed on the day of pickup. Do not refrigerate assembled pavlova; store in a cool, dry place.'
  }
];
