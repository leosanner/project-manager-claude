import { waitForDb } from "./src/lib/db/wait-for-db";

export default async function globalSetup() {
  await waitForDb();
}
