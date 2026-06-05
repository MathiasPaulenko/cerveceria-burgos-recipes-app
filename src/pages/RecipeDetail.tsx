import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Wine, UtensilsCrossed } from 'lucide-react'
import { getRecipeById } from '../services/recipeService'
import type { IngredientItem } from '../types'

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const recipe = id ? getRecipeById(id) : undefined

  if (!recipe) {
    return <Navigate to="/" replace />
  }

  const Icon = recipe.type === 'cocktail' ? Wine : UtensilsCrossed

  // Build ingredient list from new `ingredients` field or fallback to description
  const ingredientList: IngredientItem[] =
    recipe.ingredients && recipe.ingredients.length > 0
      ? recipe.ingredients
      : recipe.description.split(',').map((s) => ({
          name: s.trim(),
          quantity: '',
        })).filter((i) => i.name.length > 0)

  const steps = recipe.steps && recipe.steps.length > 0 ? recipe.steps : []

  // Local checkbox state for barman to tick off while preparing
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggleCheck = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <article className="flex flex-col gap-5 animate-fade-in">
      {/* Top row: image left, category + name right */}
      <div className="flex items-center gap-5">
        {recipe.image ? (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm">
            <img
              src={`${import.meta.env.BASE_URL}${recipe.image.replace(/^\//, '')}`}
              alt={recipe.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white text-[#99120f] shadow-sm dark:bg-neutral-800 dark:text-amber-400">
            <Icon className="h-14 w-14" aria-hidden="true" strokeWidth={1.5} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-[#99120f]/10 px-3 py-1 text-sm font-medium text-[#99120f] dark:bg-amber-500/10 dark:text-amber-400">
            {recipe.category}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[#151418] dark:text-white">{recipe.name}</h2>
        </div>
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">{recipe.description}</p>

      {/* Ingredients list with quantity and checkbox — flush with text */}
      {ingredientList.length > 0 && (
        <section>
          <h3 className="mb-3 text-base font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Ingredientes
          </h3>
          <ul className="flex flex-col gap-2">
            {ingredientList.map((item, idx) => {
              const isChecked = checked.has(idx)
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 transition ${
                    isChecked
                      ? 'bg-[#99120f]/5 dark:bg-amber-500/5'
                      : 'bg-white shadow-sm dark:bg-neutral-900'
                  }`}
                  role="button"
                  aria-pressed={isChecked}
                >
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                        isChecked
                          ? 'border-[#99120f] bg-[#99120f] dark:border-amber-500 dark:bg-amber-500'
                          : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked && (
                        <svg className="h-3.5 w-3.5 text-[#FBF5DD] dark:text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`truncate text-sm font-medium transition ${isChecked ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-[#151418] dark:text-neutral-200'}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.quantity && (
                    <span className={`shrink-0 text-sm font-semibold ${isChecked ? 'text-neutral-400 dark:text-neutral-500' : 'text-[#99120f] dark:text-amber-400'}`}>
                      {item.quantity}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Preparation steps */}
      {steps.length > 0 && (
        <section>
          <h3 className="mb-4 text-base font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Preparación
          </h3>
          <ol className="flex flex-col gap-5">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#99120f] text-xs font-bold text-[#FBF5DD] dark:bg-amber-500 dark:text-neutral-900">
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
