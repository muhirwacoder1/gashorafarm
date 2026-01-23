import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.category && args.category !== "All") {
            return await ctx.db
                .query("products")
                .withIndex("by_category", (q) => q.eq("category", args.category as any))
                .collect();
        }
        return await ctx.db.query("products").collect();
    },
});

export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getByFarmer = query({
    args: { farmerId: v.id("farmers") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .collect();
    },
});

export const add = mutation({
    args: {
        farmerId: v.id("farmers"),
        name: v.string(),
        description: v.string(),
        category: v.union(
            v.literal("Vegetables"),
            v.literal("Fruits"),
            v.literal("Dairy"),
            v.literal("Honey"),
            v.literal("Herbs"),
            v.literal("Grains")
        ),
        price: v.number(),
        unit: v.string(),
        stock: v.number(),
        isOrganic: v.boolean(),
        harvestDate: v.string(),
        imageUrl: v.string(),
        rating: v.number(),
        reviewsCount: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args);
    },
});

export const updateStock = mutation({
    args: {
        id: v.id("products"),
        stock: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { stock: args.stock });
    },
});
