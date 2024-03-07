"use client"

import { HtmlContext } from "next/dist/shared/lib/html-context.shared-runtime";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addNewTask = mutation({
  args: {
    text: v.string(),
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { text, title, userId }) => {
    // Assuming 'id' is auto-generated, and not needed in the insert call.
    const newTask = {
      text,
      title,
      userId,
    };
    const taskId = await ctx.db.insert("messages", newTask);
    return taskId; // Returning the ID of the newly created task.
  },
});

export const getTaskList = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity;
    if (!identity) {
      throw new Error("NOt authenticated");
    }

    const tasks = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    return tasks;
  },
});


export const deleteTaskList = mutation({
  args: {id: v.id('messages')},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
        throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if(!existingDocument){
        throw new Error('Not found');
    }

    if(existingDocument.userId !== userId){
        throw new Error('Unauthorized');
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const updateTask = mutation({
  args: {
    id: v.id('messages'), 
    text: v.string()
  },
  handler: async (ctx, args) => {
   const updateTodo = await ctx.db.patch(args.id, {
    text: args.text
   })
   return updateTodo
  }
});