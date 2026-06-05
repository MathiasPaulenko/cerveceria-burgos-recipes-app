import { Link } from 'react-router-dom'
import { Wine, UtensilsCrossed } from 'lucide-react'
import type { Recipe } from '../types'

interface RecipeCardProps {
  recipe: Recipe
  style?: React.CSSProperties
  className?: string
}

export default function RecipeCard({ recipe, style, className = '' }: RecipeCardProps) {
  const Icon = recipe.type === 'cocktail' ? Wine : UtensilsCrossed
  const iconColor = recipe.type === 'cocktail'
    ? 'text-[#99120f] dark:text-indigo-400'
    : 'text-[#99120f]/70 dark:text-emerald-400'

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className={`group flex min-h-[6.5rem] overflow-hidden rounded-2xl border border-[#99120f]/10 bg-white/80 shadow-sm backdrop-blur transition hover:border-[#99120f]/20 hover:bg-white active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-900/80 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 ${className}`}
      aria-label={`Ver receta ${recipe.name}`}
      style={style}
    >
      {/* Left: full-height image or icon fallback */}
      <div className="relative w-28 shrink-0">
        {recipe.image ? (
          <img
            src={`${import.meta.env.BASE_URL}${recipe.image.replace(/^\//, '')}`}
            alt={recipe.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className={`flex h-full items-center justify-center bg-[#FBF5DD] dark:bg-neutral-800/60 ${iconColor}`}>
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-[#99120f]/10 px-2.5 py-0.5 text-xs font-medium text-[#99120f] dark:bg-amber-500/10 dark:text-amber-400">
            {recipe.category}
          </span>
          <h3 className="mt-1.5 truncate text-base font-semibold text-[#151418] group-hover:text-[#99120f] transition-colors dark:text-white dark:group-hover:text-amber-400">
            {recipe.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {recipe.description}
          </p>
        </div>
        {recipe.price !== undefined && (
          <div className="mt-1 flex justify-end">
            <span className="text-base font-bold text-[#99120f] dark:text-amber-400">
              {recipe.price.toFixed(2).replace('.', ',')} €
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
