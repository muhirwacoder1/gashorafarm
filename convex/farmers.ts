import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("farmers").collect();
    },
});

export const getById = query({
    args: { id: v.id("farmers") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get pending farmers (not verified)
export const getPending = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("farmers")
            .filter((q) => q.eq(q.field("verified"), false))
            .collect();
    },
});

// Verify farmer (admin only)
export const verifyFarmer = mutation({
    args: {
        farmerId: v.id("farmers"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.farmerId, { verified: true });
    },
});
