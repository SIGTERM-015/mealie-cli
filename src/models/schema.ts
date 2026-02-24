import { z } from "zod";

export const AgentIngredientSchema = z.union([
  z.string(),
  z.object({
    note: z.string()
  })
]);

export const AgentInstructionSchema = z.union([
  z.string(),
  z.object({
    section: z.string().optional(),
    title: z.string().optional(),
    text: z.string(),
    ingredientIndices: z.array(z.number()).optional()
  })
]);

export const AgentRecipeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  orgURL: z.string().optional(),
  image: z.string().optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  recipeYield: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  ingredients: z.array(AgentIngredientSchema).optional(),
  instructions: z.array(AgentInstructionSchema).optional(),
});

export type AgentRecipe = z.infer<typeof AgentRecipeSchema>;
