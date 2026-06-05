import CategoryFilter from '../components/CategoryFilter'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { useRecipes } from '../hooks/useRecipes'

export default function Cocktails() {
  const { recipes, categories, search, setSearch, selectedCategory, setSelectedCategory } =
    useRecipes('cocktail')

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#151418] dark:text-white">Cócteles</h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar cóctel..."
      />

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {recipes.length === 0 ? (
        <p className="py-8 text-center text-neutral-400 dark:text-neutral-500">
          No se encontraron cócteles.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {recipes.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-in-up"
            />
          ))}
        </div>
      )}
    </div>
  )
}
