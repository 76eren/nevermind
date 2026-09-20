import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { post } from "./post-schema";
import { user } from "./user-schema";

export const reposts = pgTable(
  "reposts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.postId] }),
    index("reposts_post_id_idx").on(table.postId),
  ],
);
