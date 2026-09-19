import {
  type AnyPgColumn,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user-schema";

export const post = pgTable(
  "post",
  {
    id: uuid("id").primaryKey(),
    content: text("content").notNull(),
    image: text("image"),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    replyToPostId: uuid("reply_to_post_id").references(
      (): AnyPgColumn => post.id,
    ),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    index("post_author_id_idx").on(table.authorId),
    index("post_reply_to_post_id_idx").on(table.replyToPostId),
    index("post_created_at_idx").on(table.createdAt),
  ],
);
