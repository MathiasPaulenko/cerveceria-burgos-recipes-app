import cocktails from '../data/cocktails.json'
import foods from '../data/foods.json'
import type { Recipe } from '../types'

const allRecipes: Recipe[] = [...(cocktails as Recipe[]), ...(foods as Recipe[])]

export function getAllRecipes(): Recipe[] {
  return allRecipes
}

export function getRecipesByType(type: Recipe['type']): Recipe[] {
  return allRecipes.filter((r) => r.type === type)
}

export function getRecipeById(id: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === id)
}

export function getCategories(type: Recipe['type']): string[] {
  const set = new Set<string>()
  allRecipes.filter((r) => r.type === type).forEach((r) => set.add(r.category))
  return Array.from(set)
}
