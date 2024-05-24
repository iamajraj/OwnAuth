import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { cwd } from "process";

const sqlite = new Database(path.resolve(cwd(), "sqlite.db"), {
  fileMustExist: true,
});
export const db = drizzle(sqlite, {
  schema,
});
