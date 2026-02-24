#!/usr/bin/env node

import { Command } from "commander";
import { setupOrganizerCommands } from "./commands/organizers";
import { setupRecipeCommands } from "./commands/recipes";
import { setupShoppingListCommands } from "./commands/shopping-lists";
import { setupMealPlanCommands } from "./commands/meal-plans";

const program = new Command();

program
  .name("mealie")
  .description("CLI for Mealie API designed for AI Agents")
  .version("1.0.0");

setupOrganizerCommands(program);
setupRecipeCommands(program);
setupShoppingListCommands(program);
setupMealPlanCommands(program);

program.parse(process.argv);
