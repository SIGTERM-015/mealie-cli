# Mealie CLI Skill for AI Agents

Welcome, Agent. This document provides instructions on how to use the `mealie-cli` to interact with a user's Mealie instance.

## 1. Environment Requirements
The CLI is pre-configured to use environment variables for authentication. You do not need to pass tokens manually.
Make sure the following environment variables are set before invoking the tool (or instruct the user to set them):
- `MEALIE_URL`: The Mealie instance URL (e.g. `http://localhost:9000`)
- `MEALIE_API_KEY`: The API Token for authentication.

## 2. General Principles
- **Output:** All commands output strict JSON. Always parse the `stdout` as JSON. 
  - Success: `{"status": "success", "data": { ... }}`
  - Error: `{"status": "error", "message": "...", "details": { ... }}`
- **Idempotency:** When dealing with tags, categories, or tools, use the `ensure` commands. They will safely create the item if it doesn't exist or return its existing ID.

## 3. Creating Recipes
The most powerful feature of this CLI is creating recipes from an unstructured source (like a web page or text) using a simplified Agent JSON Schema. 

When a user asks you to import or create a recipe, follow these steps:

### Step 1: Create the Recipe JSON file
Generate a JSON file (e.g., `recipe.json`) adhering to this schema. You do NOT need to generate complex database relations, UUIDs, or `food` objects. Just use simple arrays of strings!

```json
{
  "name": "Pizza Margarita Test",
  "description": "Una pizza clásica y deliciosa con tomate y mozzarella.",
  "orgURL": "https://es.wikipedia.org/wiki/Pizza_margarita",
  "prepTime": "15m",
  "cookTime": "10m",
  "recipeYield": "2 pizzas",
  "tags": ["pizza", "italiana"],
  "categories": ["Cena"],
  "tools": ["Horno", "Piedra de pizza"],
  "ingredients": [
    "500g de harina de fuerza",
    "300ml de agua",
    "10g de sal",
    "3g de levadura fresca",
    "Salsa de tomate casera",
    "Mozzarella fresca",
    "Hojas de albahaca"
  ],
  "instructions": [
    {
      "section": "PREPARAR LA MASA",
      "title": "Amasado inicial",
      "text": "Mezclar la harina, el agua, la sal y la levadura. Amasar hasta obtener una masa lisa. Dejar reposar 24 horas.",
      "ingredientIndices": [0, 1, 2, 3]
    },
    {
      "section": "MONTAR LA PIZZA",
      "title": "Añadir ingredientes",
      "text": "Estirar la masa y añadir la salsa de tomate y la mozzarella.",
      "ingredientIndices": [4, 5]
    },
    {
      "section": "HORNEAR",
      "title": "Horneado final",
      "text": "Hornear a máxima temperatura. Al salir del horno, decorar con hojas de albahaca.",
      "ingredientIndices": [6]
    }
  ]
}
```

*Note: All fields except `name`, `ingredients`, and `instructions` are optional. The `instructions` array can contain simple strings, or objects with `section` (for section headers), `title` (for the step name), `text` (for the actual instruction), and `ingredientIndices` (an array of numbers corresponding to the zero-based index of the items in your `ingredients` array, which automatically links the ingredients to the step!).*

### Step 2: Execute the Command
Run the CLI passing the path to the JSON file you just created:
```bash
mealie recipe create --data recipe.json
```
The CLI will handle creating the slug, updating all fields, and creating referenced tags/categories/tools automatically!

## 4. Other Available Commands

### Organizers
- `mealie tag ensure --name "Pasta"`
- `mealie category ensure --name "Cena"`
- `mealie tool ensure --name "Sartén"`

### Recipe Reading and Searching
- `mealie recipe get --slug "rigatoni-al-vodka"`
  *(Use `--concise` flag if you want a lighter JSON output without comments and extra metadata)*
- `mealie recipe search --query "pasta" --tags "italiana,rapida" --categories "Cena" --foods "tomate,queso" --tools "Horno"`
  *(Note: By default search uses an OR operator. Use `--require-all` if you want to strictly match ALL provided tags/categories/tools/foods)*

### Shopping Lists
- `mealie shopping-list ensure --name "Supermercado"` (Returns list ID)
- `mealie shopping-list add-item --list-id <id> --note "Leche" --label "Lácteos"` (The label will be created automatically if it doesn't exist)
- `mealie shopping-list add-recipe --list-id <id> --recipe-id <recipe_id>`

### Meal Plans
- `mealie meal-plan create --date "YYYY-MM-DD" --entry-type "dinner" --recipe-slug "rigatoni-al-vodka"` (Add a recipe to a meal plan)
- `mealie meal-plan create --date "YYYY-MM-DD" --entry-type "breakfast" --title "Huevos revueltos" --text "Con tostadas"` (Add a text note to a meal plan)
- `mealie meal-plan today` (Get today's meal plan entries)

## 5. Troubleshooting
- If a command fails with an authentication error, remind the user to set the `MEALIE_API_KEY` and `MEALIE_URL`.
- If `recipe create` fails validation, read the `details` field in the JSON error output to correct your `recipe.json` format.
