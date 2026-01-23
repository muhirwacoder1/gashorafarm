import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users with details
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

// Update user role
export const updateRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("user"), v.literal("farmer"), v.literal("admin")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { role: args.role });
    },
});

// Delete user
export const deleteUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.userId);
    },
});
