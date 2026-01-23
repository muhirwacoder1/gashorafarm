import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});

export const getById = query({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("Pending"),
            v.literal("Confirmed"),
            v.literal("Packed"),
            v.literal("On the way"),
            v.literal("Delivered")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

export const create = mutation({
    args: {
        date: v.string(),
        items: v.array(
            v.object({
                productId: v.id("products"),
                name: v.string(),
                price: v.number(),
                quantity: v.number(),
                unit: v.string(),
                imageUrl: v.string(),
            })
        ),
        total: v.number(),
        status: v.union(
            v.literal("Pending"),
            v.literal("Confirmed"),
            v.literal("Packed"),
            v.literal("On the way"),
            v.literal("Delivered")
        ),
        deliveryAddress: v.string(),
        paymentMethod: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orders", args);
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.union(
            v.literal("Pending"),
            v.literal("Confirmed"),
            v.literal("Packed"),
            v.literal("On the way"),
            v.literal("Delivered")
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});
