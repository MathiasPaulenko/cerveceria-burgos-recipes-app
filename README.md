# CerveceriaBurgos Recetas

[![Deploy](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> Internal recipe catalog for the **Cerveceria Burgos** team. Built for mobile-first use by bartenders and kitchen staff: fast search, ingredient checklists with touch-friendly checkboxes, and clear preparation steps — even without an internet connection.

**[View live](https://mathiaspaulenko.github.io/cerveceria-burgos-recipes-app/)**

---

## Features

- **Installable PWA** — Works offline via Service Worker. Install from Chrome/Safari "Add to Home Screen".
- **Android APK** — Built as a Trusted Web Activity (TWA) via Bubblewrap and distributed as a signed APK attached to each release.
- **Light & Dark Mode** — Theme toggle in the header with `localStorage` persistence.
- **Full Catalog** — 70+ cocktails and 100+ food & tapas recipes, organized by category.
- **Search & Filters** — Real-time search + category dropdown filter.
- **Recipe Detail** — Photo, description, ingredient list with quantities and interactive checkboxes, and numbered preparation steps.
- **Smart Navigation** — The back button returns to the previous page (not always home).
- **Touch-First** — Large touch targets, smooth animations, and `prefers-reduced-motion` support.
- **Image Optimization** — Auto-generated 128x128 thumbnails with skeleton placeholders for fast loading.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | Declarative UI with hooks |
| TypeScript | 5.5 | Strict typing |
| Vite | 5.4 | Build tool & dev server |
| TailwindCSS | 3.4 | Utility-first styling |
| React Router | 6.26 | SPA navigation |
| vite-plugin-pwa | 0.20 | Service worker & PWA manifest |
| Lucide React | 1.17 | Consistent iconography |
| Bubblewrap | latest | TWA APK generation |
| Sharp | latest | Image thumbnail generation |

---

## Project Structure

```
cerveceria-burgos-recipes-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build + deploy to GitHub Pages + auto-release
├── public/
│   ├── icons/                  # PWA icons (SVG & PNG 192x192, 512x512)
│   ├── images/
│   │   └── cocktails/          # Cocktail photos in WebP + auto-generated thumbnails
│   └── .well-known/
│       └── assetlinks.json     # Digital Asset Links for TWA verification
├── scripts/
│   ├── build-apk.cjs           # Bubblewrap TWA project generation & APK build
│   ├── bump-version.cjs        # Semantic version bump based on conventional commits
│   ├── gen-keystore.cjs        # Keystore & assetlinks.json generator
│   └── optimize-images.cjs     # Thumbnail generator for cocktail photos
├── src/
│   ├── components/
│   │   ├── CategoryFilter.tsx  # Category dropdown filter
│   │   ├── Layout.tsx          # Shell with header, nav, theme toggle, version footer
│   │   ├── RecipeCard.tsx      # Recipe card (photo + info + price)
│   │   ├── SearchBar.tsx       # Search input with icon and clear button
│   │   └── ThemeToggle.tsx     # Sun/moon theme toggle
│   ├── data/
│   │   ├── cocktails.json      # 70+ cocktail recipes with ingredients & steps
│   │   ├── foods.json          # 100+ food recipes with ingredients & steps
│   │   ├── COCKTAILS-README.md # Guide: how to edit cocktails
│   │   └── FOODS-README.md     # Guide: how to edit food
│   ├── hooks/
│   │   ├── useRecipes.ts       # Filtering hook (search + category)
│   │   └── useTheme.ts         # Dark/light theme hook
│   ├── pages/
│   │   ├── Home.tsx            # Home screen with 2 large cards
│   │   ├── Cocktails.tsx       # Cocktail listing
│   │   ├── Foods.tsx           # Food & tapas listing
│   │   └── RecipeDetail.tsx    # Full recipe detail view
│   ├── services/
│   │   └── recipeService.ts    # JSON data access (filters, ID lookup)
│   ├── types/
│   │   └── index.ts            # TypeScript models (Recipe, IngredientItem)
│   ├── App.tsx                 # Main routing
│   └── main.tsx                # Entry point with BrowserRouter
├── index.html                  # Base HTML with PWA meta tags
├── tailwind.config.js          # Tailwind config + dark mode
├── twa-manifest.json           # Bubblewrap TWA manifest
├── vite.config.ts              # Vite config + PWA manifest
└── package.json
```

---

## Scripts

```bash
npm install           # Install dependencies
npm run dev           # Dev server (localhost:5173)
npm run build         # Production build (dist/)
npm run preview       # Preview production build
npm run optimize-images  # Regenerate cocktail photo thumbnails
```

> Deployment to GitHub Pages and automatic release creation are handled via GitHub Actions on every push to `main`.

---

## Semantic Versioning (Auto)

The project uses automated semantic versioning based on conventional commit prefixes:

| Commit Prefix | Version Bump | Example |
|---|---|---|
| `feat:` or `feature:` | **Minor** (x.Y+1.0) | New functionality |
| `fix:`, `ui:`, `chore:` | **Patch** (x.y.Z+1) | Bug fixes, small changes |
| `BREAKING CHANGE`, `major:`, `breaking:` | **Major** (X+1.0.0) | Architecture changes |

On every push to `main`, the CI workflow reads the last commit message, bumps `package.json` version accordingly, commits the change with `[skip ci]`, creates a git tag, and publishes a GitHub Release.

---

## How to Edit Recipes (for Staff)

No code changes needed. Recipes are edited directly in JSON files:

- **Cocktails**: see guide at [`src/data/COCKTAILS-README.md`](./src/data/COCKTAILS-README.md)
- **Food & Tapas**: see guide at [`src/data/FOODS-README.md`](./src/data/FOODS-README.md)

Each recipe includes:
- `name`, `description`, `category`, `price`
- `ingredients`: array of `{ name, quantity }` (displayed with checkboxes in the app)
- `steps`: array of strings (numbered preparation steps)
- `image`: path to image in `public/images/...` (leave empty to show default icon)

After editing the JSON, push to `main` and the app updates automatically.

---

## Automatic Deployment

Every push to `main` triggers `.github/workflows/deploy.yml` which:

1. Bumps semantic version based on the last commit message
2. Installs dependencies and runs `npm run build`
3. Deploys to GitHub Pages at `https://mathiaspaulenko.github.io/cerveceria-burgos-recipes-app/`
4. Creates a git tag (e.g. `v1.2.3`)
5. Publishes a [GitHub Release](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/releases) with auto-generated notes
6. Builds a signed Android APK via Bubblewrap and attaches it to the release

---

## Notes

- Cocktail photos are in `public/images/cocktails/` as WebP. Thumbnails (128x128) are auto-generated in `thumbs/`.
- Food items currently have no photos (`image: ""`) and render a utensils icon as fallback.
- The app is optimized for mobile but works perfectly on desktop.
- TWA fullscreen mode hides system bars for an immersive experience.
- Digital Asset Links (`assetlinks.json`) ensure the TWA loads the PWA correctly without a black screen.

---

## License

MIT
