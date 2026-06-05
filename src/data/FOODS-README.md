# Como editar la carta de comida y tapas

El cliente puede modificar, añadir o eliminar platos editando el archivo `foods.json`.

## Formato completo de cada plato

```json
{
  "id": "nombre_unico",
  "type": "food",
  "name": "Nombre del plato",
  "description": "Breve descripción atractiva del plato.",
  "category": "Categoría",
  "image": "/images/foods/nombre_imagen.webp",
  "price": 8.5,
  "ingredients": [
    { "name": "Ingrediente principal", "quantity": "200 g" },
    { "name": "Aceite de oliva", "quantity": "Al gusto" }
  ],
  "steps": [
    "Primer paso de preparación.",
    "Segundo paso de preparación."
  ]
}
```

## Campos obligatorios

| Campo        | Descripción                                                   | Ejemplo                      |
|--------------|---------------------------------------------------------------|------------------------------|
| `id`         | Identificador único, sin espacios ni tildes.                  | `tortilla-espanola`          |
| `type`       | Siempre `food`.                                               | `food`                       |
| `name`       | Nombre visible en la app.                                     | `Tortilla Española`          |
| `description`| Descripción atractiva del plato.                              | `La reina de las tapas...`   |
| `category`   | Categoría para los filtros.                                   | `Tapas Calientes`            |
| `image`      | Ruta de la foto. Debe coincidir con el archivo.               | `/images/foods/tortilla.webp`|
| `price`      | Precio en euros.                                              | `8.5`                        |

## Campos opcionales

| Campo         | Descripción                                                              |
|---------------|--------------------------------------------------------------------------|
| `ingredients` | Lista de ingredientes con cantidad. Se muestra en la pantalla de detalle. |
| `steps`       | Pasos de preparación uno por uno.                                        |

### Formato de `ingredients`

```json
"ingredients": [
  { "name": "Huevos camperos", "quantity": "3 unidades" },
  { "name": "Patatas", "quantity": "300 g" },
  { "name": "Cebolla", "quantity": "1 unidad" }
]
```

### Formato de `steps`

```json
"steps": [
  "Pelar y cortar las patatas en láminas finas.",
  "Freír las patatas y cebolla en aceite de oliva hasta que estén tiernas.",
  "Escurrir el exceso de aceite y mezclar con los huevos batidos.",
  "Cuajar la tortilla a fuego medio, volteándola para cocinar por ambos lados."
]
```

## Añadir un plato nuevo

1. Copiar un bloque del `foods.json` o del ejemplo de arriba.
2. Cambiar todos los campos (`id`, `name`, `description`, `category`, `image`, `price`).
3. Añadir `ingredients` y `steps` para que aparezcan en la pantalla de detalle.
4. Guardar el archivo.
5. Si hay foto nueva, colocarla en `public/images/foods/` con el mismo nombre que `image`.

## Precauciones

- No eliminar los corchetes `[` y `]` del principio y final.
- Cada bloque debe terminar con una coma `,` excepto el último.
- El `id` no puede repetirse y no debe tener espacios ni tildes.
- Cuidado con las comillas: siempre comillas dobles `"` en JSON.
