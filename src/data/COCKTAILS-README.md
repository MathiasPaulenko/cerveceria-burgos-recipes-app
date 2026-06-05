# Como editar los cocktales

El cliente puede modificar, añadir o eliminar cocktails editando el archivo `cocktails.json`.

## Formato completo de cada cocktail

```json
{
  "id": "mojito_tradicional",
  "type": "cocktail",
  "name": "Mojito tradicional",
  "description": "Menta, lima, ron y gaseosa",
  "category": "Mojitos",
  "image": "/images/cocktails/mojito_tradicional.webp",
  "price": 9,
  "ingredients": [
    { "name": "Ron blanco", "quantity": "5 cl" },
    { "name": "Menta fresca", "quantity": "10 hojas" },
    { "name": "Lima", "quantity": "1/2 unidad" },
    { "name": "Azúcar moreno", "quantity": "2 cucharadas" },
    { "name": "Soda", "quantity": "Completar" }
  ],
  "steps": [
    "Machacar la menta, el azúcar y la lima en un vaso alto.",
    "Añadir hielo picado hasta arriba.",
    "Verter el ron y completar con soda.",
    "Remover suavemente y decorar con una ramita de menta."
  ]
}
```

## Campos obligatorios

| Campo        | Descripción                                                            | Ejemplo                          |
|--------------|------------------------------------------------------------------------|----------------------------------|
| `id`         | Identificador único, solo letras, números y guiones bajos.             | `mojito_tradicional`             |
| `type`       | Siempre `cocktail`.                                                    | `cocktail`                       |
| `name`       | Nombre visible en la app.                                              | `Mojito tradicional`             |
| `description`| Breve descripción (se muestra en la tarjeta).                          | `Menta, lima, ron y gaseosa`     |
| `category`   | Categoría para los filtros.                                            | `Mojitos`                        |
| `image`      | Ruta de la foto. Debe coincidir con el archivo `.webp`.                | `/images/cocktails/mojito.webp`  |
| `price`      | Precio en euros.                                                       | `9` o `8.5`                      |

## Campos opcionales (para la pantalla de detalle)

| Campo         | Descripción                                                            |
|---------------|------------------------------------------------------------------------|
| `ingredients` | Lista de ingredientes con cantidad exacta. Si no se pone, se usa `description`. |
| `steps`       | Pasos de preparación uno por uno. Si no se pone, solo se muestra la descripción. |

### Formato de `ingredients`

```json
"ingredients": [
  { "name": "Nombre del ingrediente", "quantity": "Cantidad" },
  { "name": "Tequila", "quantity": "5 cl" }
]
```

### Formato de `steps`

```json
"steps": [
  "Primer paso de preparación.",
  "Segundo paso de preparación.",
  "Último paso."
]
```

## Añadir un cocktail nuevo

1. Copiar un bloque existente del `cocktails.json`.
2. Cambiar todos los campos (`id`, `name`, `description`, `category`, `image`, `price`).
3. Añadir `ingredients` y `steps` para que aparezcan en la pantalla de detalle.
4. Guardar el archivo.
5. Si hay foto nueva, colocarla en `public/images/cocktails/` con el mismo nombre que `image`.

## Eliminar un cocktail

Borrar todo el bloque entre `{` y `}` correspondiente (incluyendo la coma final si la hay).

## Precauciones

- No eliminar los corchetes `[` y `]` del principio y final.
- Cada bloque debe terminar con una coma `,` excepto el último.
- El `id` no puede repetirse y no debe tener espacios ni tildes.
- Cuidado con las comillas: siempre comillas dobles `"` en JSON.
