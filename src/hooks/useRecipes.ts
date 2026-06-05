import { useMemo, useState } from 'react'
import type { Recipe } from '../types'
import { getCategories, getRecipesByType } from '../services/recipeService'

export function useRecipes(type: Recipe['type']) {
  const recipes = useMemo(() => getRecipesByType(type), [type])
  const categories = useMemo(() => getCategories(type), [type])

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase().trim())
      const matchesCategory = selectedCategory ? r.category === selectedCategory : true
      return matchesSearch && matchesCategory
    })
  }, [recipes, search, selectedCategory])

  return {
    recipes: filtered,
    categories,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
  }
}
