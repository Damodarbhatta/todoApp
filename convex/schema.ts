import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const TodoFields = {
  text: v.string(),
  title: v.string(),
  userId: v.string(),
};

export default defineSchema({
  messages: defineTable(TodoFields).index("by_user", ["userId"]),
});
