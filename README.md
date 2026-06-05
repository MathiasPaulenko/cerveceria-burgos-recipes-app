# Cervecería Burgos Recipes

Internal recipe catalog and reference guide for cocktails, food and tapas at Cervecería Burgos.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- TailwindCSS 3
- React Router 6
- vite-plugin-pwa

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run deploy   # Deploy to GitHub Pages
```

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Route-level pages
  hooks/          # Custom React hooks
  services/       # Data access layer
  data/           # Local JSON data files
  types/          # TypeScript models
public/
  icons/          # PWA icons
```

## Features

- Mobile-first PWA with offline support
- Dark mode by default
- Search and category filtering
- Recipe detail with ingredients and steps
- Prepared for future inventory integration

## Deploy

Configured for GitHub Pages with base path `/cerveceria-burgos-recipes/`.
