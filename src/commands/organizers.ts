import { Command } from "commander";
import { getClient } from "../api";
import { handleAction } from "../utils";

export function setupOrganizerCommands(program: Command) {
  const tagCmd = program.command("tag").description("Manage tags");
  
  tagCmd
    .command("ensure")
    .description("Ensure a tag exists, creates it if it does not")
    .requiredOption("--name <name>", "Name of the tag")
    .action((options) => {
      handleAction(async () => {
        const client = getClient();
        const tagsRes = await client.get<any>("/api/organizers/tags");
        const tags = tagsRes.items || tagsRes;
        const existing = tags.find((t: any) => t.name.toLowerCase() === options.name.toLowerCase());
        if (existing) {
          return existing;
        }
        const created = await client.post<any>("/api/organizers/tags", { name: options.name });
        return created;
      });
    });

  const categoryCmd = program.command("category").description("Manage categories");

  categoryCmd
    .command("ensure")
    .description("Ensure a category exists, creates it if it does not")
    .requiredOption("--name <name>", "Name of the category")
    .action((options) => {
      handleAction(async () => {
        const client = getClient();
        const catRes = await client.get<any>("/api/organizers/categories");
        const categories = catRes.items || catRes;
        const existing = categories.find((c: any) => c.name.toLowerCase() === options.name.toLowerCase());
        if (existing) {
          return existing;
        }
        const created = await client.post<any>("/api/organizers/categories", { name: options.name });
        return created;
      });
    });

  const toolCmd = program.command("tool").description("Manage tools");

  toolCmd
    .command("ensure")
    .description("Ensure a tool exists, creates it if it does not")
    .requiredOption("--name <name>", "Name of the tool")
    .action((options) => {
      handleAction(async () => {
        const client = getClient();
        const toolRes = await client.get<any>("/api/organizers/tools");
        const tools = toolRes.items || toolRes;
        const existing = tools.find((t: any) => t.name.toLowerCase() === options.name.toLowerCase());
        if (existing) {
          return existing;
        }
        const created = await client.post<any>("/api/organizers/tools", { name: options.name });
        return created;
      });
    });
}
