export interface Product {
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

export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "prod_bento_0",
    "slug": "butterscotch-bento-cake",
    "name": "Butterscotch Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Butterscotch Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_1",
    "slug": "vanilla-funfetti-bento-cake",
    "name": "Vanilla Funfetti Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Vanilla Funfetti Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_2",
    "slug": "strawberry-bento-cake",
    "name": "Strawberry Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Strawberry Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_3",
    "slug": "choco-vanilla-bento-cake",
    "name": "Choco Vanilla Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Choco Vanilla Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_4",
    "slug": "chocolate-bento-cake",
    "name": "Chocolate Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Chocolate Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_5",
    "slug": "chocolate-cherry-bento-cake",
    "name": "Chocolate Cherry Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Chocolate Cherry Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_bento_6",
    "slug": "blueberry-bento-cake",
    "name": "Blueberry Bento Cake",
    "shortDescription": "Delightful 200gm lunchbox cake.",
    "description": "Blueberry Bento Cake in a compact bento size.",
    "price": 199,
    "categories": [
      "Bento Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "200gm",
        "price": 199,
        "servings": "1-2"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 40,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_0",
    "slug": "pineapple-cake",
    "name": "Pineapple Cake",
    "shortDescription": "All time favourite Pineapple Cake",
    "description": "Delicious Pineapple Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_1",
    "slug": "butterscotch-cake",
    "name": "Butterscotch Cake",
    "shortDescription": "All time favourite Butterscotch Cake",
    "description": "Delicious Butterscotch Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_2",
    "slug": "strawberry-cake",
    "name": "Strawberry Cake",
    "shortDescription": "All time favourite Strawberry Cake",
    "description": "Delicious Strawberry Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_3",
    "slug": "choco-vanilla",
    "name": "Choco Vanilla",
    "shortDescription": "All time favourite Choco Vanilla",
    "description": "Delicious Choco Vanilla made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_4",
    "slug": "blueberry-cake",
    "name": "Blueberry Cake",
    "shortDescription": "All time favourite Blueberry Cake",
    "description": "Delicious Blueberry Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_5",
    "slug": "fresh-fruit-cake",
    "name": "Fresh Fruit Cake",
    "shortDescription": "All time favourite Fresh Fruit Cake",
    "description": "Delicious Fresh Fruit Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_6",
    "slug": "light-chocolate",
    "name": "Light Chocolate",
    "shortDescription": "All time favourite Light Chocolate",
    "description": "Delicious Light Chocolate made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_7",
    "slug": "blackforest-cake",
    "name": "Blackforest Cake",
    "shortDescription": "All time favourite Blackforest Cake",
    "description": "Delicious Blackforest Cake made with love.",
    "price": 400,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 400,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 750,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_8",
    "slug": "marble-crunch",
    "name": "Marble Crunch",
    "shortDescription": "All time favourite Marble Crunch",
    "description": "Delicious Marble Crunch made with love.",
    "price": 450,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 450,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 850,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_9",
    "slug": "white-forest-cake",
    "name": "White Forest Cake",
    "shortDescription": "All time favourite White Forest Cake",
    "description": "Delicious White Forest Cake made with love.",
    "price": 450,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 450,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 850,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_10",
    "slug": "oreo-fantasy-cake",
    "name": "Oreo Fantasy Cake",
    "shortDescription": "All time favourite Oreo Fantasy Cake",
    "description": "Delicious Oreo Fantasy Cake made with love.",
    "price": 450,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 450,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 850,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_11",
    "slug": "coffee-chocolate",
    "name": "Coffee Chocolate",
    "shortDescription": "All time favourite Coffee Chocolate",
    "description": "Delicious Coffee Chocolate made with love.",
    "price": 450,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 450,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 850,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_12",
    "slug": "chocolate-truffle",
    "name": "Chocolate Truffle",
    "shortDescription": "All time favourite Chocolate Truffle",
    "description": "Delicious Chocolate Truffle made with love.",
    "price": 500,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 500,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 950,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_13",
    "slug": "redvelvet-cake",
    "name": "Redvelvet Cake",
    "shortDescription": "All time favourite Redvelvet Cake",
    "description": "Delicious Redvelvet Cake made with love.",
    "price": 500,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 500,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 950,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_14",
    "slug": "milk-and-hazelnut",
    "name": "Milk and Hazelnut",
    "shortDescription": "All time favourite Milk and Hazelnut",
    "description": "Delicious Milk and Hazelnut made with love.",
    "price": 500,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 500,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 950,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_15",
    "slug": "gulab-jamun-treat",
    "name": "Gulab Jamun Treat",
    "shortDescription": "All time favourite Gulab Jamun Treat",
    "description": "Delicious Gulab Jamun Treat made with love.",
    "price": 600,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 600,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1100,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_fav_16",
    "slug": "rasmalai-treat",
    "name": "Rasmalai Treat",
    "shortDescription": "All time favourite Rasmalai Treat",
    "description": "Delicious Rasmalai Treat made with love.",
    "price": 600,
    "categories": [
      "All Time Favourite Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 600,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1100,
        "servings": "8-10"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 50,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80"
    ],
    "featured": true,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_0",
    "slug": "french-vanilla-cake",
    "name": "French Vanilla Cake",
    "shortDescription": "Premium French Vanilla Cake",
    "description": "Premium quality French Vanilla Cake.",
    "price": 600,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 600,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1150,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_1",
    "slug": "german-black-forest-cake",
    "name": "German Black Forest Cake",
    "shortDescription": "Premium German Black Forest Cake",
    "description": "Premium quality German Black Forest Cake.",
    "price": 599,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 599,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1099,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_2",
    "slug": "dutch-truffle",
    "name": "Dutch Truffle",
    "shortDescription": "Premium Dutch Truffle",
    "description": "Premium quality Dutch Truffle.",
    "price": 599,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 599,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1099,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_3",
    "slug": "fresh-fruit-gateaux",
    "name": "Fresh Fruit Gateaux",
    "shortDescription": "Premium Fresh Fruit Gateaux",
    "description": "Premium quality Fresh Fruit Gateaux.",
    "price": 599,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 599,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1099,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_4",
    "slug": "blueberry-n-white-chocolate",
    "name": "Blueberry N White Chocolate",
    "shortDescription": "Premium Blueberry N White Chocolate",
    "description": "Premium quality Blueberry N White Chocolate.",
    "price": 599,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 599,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1099,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_5",
    "slug": "sacher-torte",
    "name": "Sacher Torte",
    "shortDescription": "Premium Sacher Torte",
    "description": "Premium quality Sacher Torte.",
    "price": 649,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 649,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1199,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_6",
    "slug": "chocolate-n-hazelnut",
    "name": "Chocolate N Hazelnut",
    "shortDescription": "Premium Chocolate N Hazelnut",
    "description": "Premium quality Chocolate N Hazelnut.",
    "price": 649,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 649,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1199,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_prem_7",
    "slug": "nutty-thandai-cake",
    "name": "Nutty Thandai Cake",
    "shortDescription": "Premium Nutty Thandai Cake",
    "description": "Premium quality Nutty Thandai Cake.",
    "price": 649,
    "categories": [
      "Premium Cakes"
    ],
    "ingredients": [
      "Flour",
      "Sugar",
      "Cream"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "500gm",
        "price": 649,
        "servings": "4-6"
      },
      {
        "label": "1 kg",
        "price": 1199,
        "servings": "8-10"
      }
    ],
    "rating": 4.9,
    "reviewsCount": 70,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_cheese_0",
    "slug": "hazelnut-cheese-cake-slice",
    "name": "Hazelnut Cheese Cake Slice",
    "shortDescription": "Delicious Hazelnut Cheese Cake Slice",
    "description": "Rich and creamy Hazelnut Cheese Cake Slice.",
    "price": 150,
    "categories": [
      "Cheese Cake Slice"
    ],
    "ingredients": [
      "Cream Cheese",
      "Sugar"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "1 Slice",
        "price": 150,
        "servings": "1"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 30,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_cheese_1",
    "slug": "strawberry-cheese-cake-slice",
    "name": "Strawberry Cheese Cake Slice",
    "shortDescription": "Delicious Strawberry Cheese Cake Slice",
    "description": "Rich and creamy Strawberry Cheese Cake Slice.",
    "price": 150,
    "categories": [
      "Cheese Cake Slice"
    ],
    "ingredients": [
      "Cream Cheese",
      "Sugar"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "1 Slice",
        "price": 150,
        "servings": "1"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 30,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_cheese_2",
    "slug": "blueberry-cheese-cake-slice",
    "name": "Blueberry Cheese Cake Slice",
    "shortDescription": "Delicious Blueberry Cheese Cake Slice",
    "description": "Rich and creamy Blueberry Cheese Cake Slice.",
    "price": 150,
    "categories": [
      "Cheese Cake Slice"
    ],
    "ingredients": [
      "Cream Cheese",
      "Sugar"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Eggless"
    ],
    "sizes": [
      {
        "label": "1 Slice",
        "price": 150,
        "servings": "1"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 30,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  },
  {
    "id": "prod_cheese_3",
    "slug": "lotus-biscoff-slice",
    "name": "Lotus Biscoff Slice",
    "shortDescription": "Delicious Lotus Biscoff Slice",
    "description": "Rich and creamy Lotus Biscoff Slice.",
    "price": 180,
    "categories": [
      "Cheese Cake Slice"
    ],
    "ingredients": [
      "Cream Cheese",
      "Sugar"
    ],
    "allergens": [
      "Dairy",
      "Wheat/Gluten"
    ],
    "dietaryTags": [
      "Contains Egg"
    ],
    "sizes": [
      {
        "label": "1 Slice",
        "price": 180,
        "servings": "1"
      }
    ],
    "rating": 4.8,
    "reviewsCount": 30,
    "preparationLeadTimeHours": 24,
    "imageUuids": [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80"
    ],
    "featured": false,
    "seasonal": false,
    "active": true,
    "inStock": true,
    "storageGuidance": "Keep refrigerated."
  }
];
