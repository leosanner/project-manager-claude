import { waitForDb } from "../src/lib/db/wait-for-db";

waitForDb().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
