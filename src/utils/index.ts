export function outputSuccess(data: any): void {
  console.log(JSON.stringify({ status: "success", data }, null, 2));
}

export function outputError(message: string, details?: any): void {
  const output: any = { status: "error", message };
  if (details !== undefined) {
    output.details = details;
  }
  console.log(JSON.stringify(output, null, 2));
  process.exitCode = 1;
}

export async function ensureOrganizer(client: any, endpoint: string, name: string, extraData: any = {}) {
  const res = await client.get(endpoint, { search: name });
  const items = res.items || res;
  let found = items.find((i: any) => i.name.toLowerCase() === name.toLowerCase());

  if (!found) {
    try {
      found = await client.post(endpoint, { name, ...extraData });
    } catch (e) {
      // If it fails (e.g., already exists but wasn't in list), try one more fetch
      const res2 = await client.get(endpoint, { search: name });
      const items2 = res2.items || res2;
      found = items2.find((i: any) => i.name.toLowerCase() === name.toLowerCase());
    }
  }
  return found;
}

export function handleAction<T>(action: () => Promise<T>): Promise<void> {
  return action()
    .then((data) => {
      outputSuccess(data);
    })
    .catch((error: any) => {
      if (error.name === "MealieApiError") {
        outputError(error.message, {
          statusCode: error.statusCode,
          responseData: error.responseData,
        });
      } else {
        outputError(error.message || "An unexpected error occurred", error.stack);
      }
    });
}
