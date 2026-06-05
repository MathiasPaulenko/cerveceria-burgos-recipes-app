export type RecipeType = 'cocktail' | 'food';

export type IngredientItem = {
  name: string;
  quantity: string;
};

export type Recipe = {
  id: string;
  type: RecipeType;
  name: string;
  description: string;
  category: string;
  image?: string;
  price?: number;
  ingredients?: IngredientItem[];
  steps?: string[];
  notes?: string;
};
