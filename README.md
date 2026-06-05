# Cervecería Burgos — Recetas

[![Deploy](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> Catálogo interno de recetas para el equipo de **Cervecería Burgos**. Diseñado para usarse desde el móvil del barman o cocinero: búsqueda rápida, ingredientes con checkboxes táctiles y pasos de preparación claros — incluso sin conexión a internet.

**[Ver en producción](https://mathiaspaulenko.github.io/cerveceria-burgos-recipes-app/)**

---

## Características

- **PWA instalable** — Funciona offline gracias al Service Worker. Instálala desde Chrome/Safari "Agregar a pantalla de inicio".
- **Modo claro y oscuro** — Toggle en el header con persistencia en `localStorage`.
- **Catálogo completo** — 70+ cócteles y 100+ platos de comida y tapas, organizados por categoría.
- **Búsqueda y filtros** — Buscador en tiempo real + filtro desplegable por categoría.
- **Detalle de receta** — Foto, descripción, lista de ingredientes con cantidades y checkboxes interactivos, y pasos de preparación numerados.
- **Navegación inteligente** — El botón "volver" regresa a la página anterior (no siempre al inicio).
- **Touch-first** — Targets táctiles grandes, animaciones suaves y soporte para `prefers-reduced-motion`.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3 | UI declarativa con hooks |
| TypeScript | 5.5 | Tipado estricto |
| Vite | 5.4 | Bundler y dev server |
| TailwindCSS | 3.4 | Estilos utilitarios |
| React Router | 6.26 | Navegación SPA |
| vite-plugin-pwa | 0.20 | Service worker y manifest PWA |
| Lucide React | 1.17 | Iconografía consistente |

---

## Estructura del Proyecto

```
cerveceria-burgos-recipes-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build + deploy a GitHub Pages + release automática
├── public/
│   ├── icons/                  # Iconos PWA (SVG 192x192 y 512x512)
│   └── images/
│       └── cocktails/          # 49 fotos de cócteles en WebP
├── src/
│   ├── components/
│   │   ├── CategoryFilter.tsx  # Dropdown de filtro por categoría
│   │   ├── Layout.tsx          # Shell con header, navegación y toggle de tema
│   │   ├── RecipeCard.tsx      # Tarjeta de receta (foto + info + precio)
│   │   ├── SearchBar.tsx       # Input de búsqueda con icono y clear
│   │   └── ThemeToggle.tsx     # Botón sol/luna
│   ├── data/
│   │   ├── cocktails.json      # 70+ recetas de cócteles con ingredientes y pasos
│   │   ├── foods.json          # 100+ platos de comida con ingredientes y pasos
│   │   ├── COCKTAILS-README.md # Guía para el cliente: cómo editar cócteles
│   │   └── FOODS-README.md     # Guía para el cliente: cómo editar comida
│   ├── hooks/
│   │   ├── useRecipes.ts       # Hook de filtrado (búsqueda + categoría)
│   │   └── useTheme.ts         # Hook de tema oscuro/claro
│   ├── pages/
│   │   ├── Home.tsx            # Pantalla inicial con 2 cards grandes
│   │   ├── Cocktails.tsx       # Listado de cócteles
│   │   ├── Foods.tsx           # Listado de comida y tapas
│   │   └── RecipeDetail.tsx    # Detalle completo de una receta
│   ├── services/
│   │   └── recipeService.ts    # Acceso a datos JSON (filtros, búsqueda por ID)
│   ├── types/
│   │   └── index.ts            # Modelos TypeScript (Recipe, IngredientItem)
│   ├── App.tsx                 # Routing principal
│   └── main.tsx                # Entry point con BrowserRouter
├── index.html                  # HTML base con meta tags PWA
├── tailwind.config.js          # Configuración de Tailwind + dark mode
├── vite.config.ts              # Configuración de Vite + PWA manifest
└── package.json
```

---

## Scripts

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo (localhost:5173)
npm run build    # Build de producción (dist/)
npm run preview  # Previsualizar build de producción
```

> El deploy a GitHub Pages y la creación de releases se manejan automáticamente vía GitHub Actions en cada push a `main`.

---

## Cómo Editar las Recetas (para el cliente)

No hace falta tocar código. Las recetas se editan directamente en los archivos JSON:

- **Cócteles**: ver guía en [`src/data/COCKTAILS-README.md`](./src/data/COCKTAILS-README.md)
- **Comida y tapas**: ver guía en [`src/data/FOODS-README.md`](./src/data/FOODS-README.md)

Cada receta incluye:
- `name`, `description`, `category`, `price`
- `ingredients`: array de `{ name, quantity }` (se muestran con checkboxes en la app)
- `steps`: array de strings (pasos de preparación numerados)
- `image`: ruta a la imagen en `public/images/...` (puede dejarse vacío para mostrar icono por defecto)

Tras editar los JSON, un push a `main` actualiza automáticamente la app en producción.

---

## Deploy Automático

Cada push a la rama `main` dispara el workflow `.github/workflows/deploy.yml` que:

1. Instala dependencias y hace `npm run build`
2. Sube el build como artifact de GitHub Pages
3. Deploya a `https://mathiaspaulenko.github.io/cerveceria-burgos-recipes-app/`
4. Genera un tag semántico con fecha (`v2025.06.05.1`)
5. Crea una [Release](https://github.com/MathiasPaulenko/cerveceria-burgos-recipes-app/releases) con changelog automático

---

## Notas

- Las fotos de cócteles están en `public/images/cocktails/` en formato WebP para optimizar peso.
- Los platos de comida actualmente no tienen fotos (`image: ""`) y se renderizan con un icono de cubiertos como fallback.
- La app está optimizada para móviles pero funciona perfectamente en desktop.

---

## Licencia

MIT
