import { Command } from "commander";
import { getClient } from "../api";
import { handleAction } from "../utils";

export function setupMealPlanCommands(program: Command) {
  const planCmd = program.command("meal-plan").description("Manage meal plans");

  planCmd
    .command("create")
    .description("Create a meal plan entry")
    .requiredOption("--date <date>", "Date in YYYY-MM-DD format")
    .option("--entry-type <type>", "Type of meal (breakfast, lunch, dinner, side, snack, drink, dessert)", "dinner")
    .option("--recipe-slug <slug>", "Slug of the recipe to add to the meal plan")
    .option("--title <title>", "Title of the entry (if no recipe)")
    .option("--text <text>", "Text description of the entry (if no recipe)")
    .action((options) => {
      handleAction(async () => {
        const client = getClient();
        let recipeId: string | null = null;

        if (options.recipeSlug) {
          const recipe = await client.get<any>(`/api/recipes/${options.recipeSlug}`);
          recipeId = recipe.id;
        }

        const payload: any = {
          date: options.date,
          entryType: options.entryType,
        };

        if (recipeId) {
          payload.recipeId = recipeId;
        } else {
          payload.title = options.title || "";
          payload.text = options.text || "";
        }

        const created = await client.post<any>("/api/households/mealplans", payload);
        return created;
      });
    });

  planCmd
    .command("today")
    .description("Get today's meal plan")
    .action(() => {
      handleAction(async () => {
        const client = getClient();
        const plan = await client.get<any>("/api/households/mealplans/today");
        return plan;
      });
    });
}
