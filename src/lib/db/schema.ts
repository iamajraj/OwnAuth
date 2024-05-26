import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const user = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export type USER_INSERT = InferInsertModel<typeof user>;
export type USER = InferSelectModel<typeof user>;

export const session = sqliteTable("sessions", {
  sessionId: text("session_id").primaryKey(),
  userId: integer("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  expiresAt: integer("expires_at").notNull().default(0),
});

export type SESSION_INSERT = InferInsertModel<typeof user>;
export type SESSION = InferSelectModel<typeof session>;
