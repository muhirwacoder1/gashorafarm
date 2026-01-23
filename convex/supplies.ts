import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all supplies
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("supplies").collect();
    },
});

// Get supply by ID
export const getById = query({
    args: { id: v.id("supplies") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get supplies by category
export const getByCategory = query({
    args: {
        category: v.union(
            v.literal("Tools"),
            v.literal("Seeds"),
            v.literal("Fertilizers"),
            v.literal("Equipment"),
            v.literal("Pesticides")
        )
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("supplies")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();
    },
});

// Add new supply (Admin only)
export const add = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        category: v.union(
            v.literal("Tools"),
            v.literal("Seeds"),
            v.literal("Fertilizers"),
            v.literal("Equipment"),
            v.literal("Pesticides")
        ),
        price: v.number(),
        unit: v.string(),
        stock: v.number(),
        imageUrl: v.string(),
        rating: v.number(),
        reviewsCount: v.number(),
    },
    handler: async (ctx, args) => {
        const supplyId = await ctx.db.insert("supplies", {
            name: args.name,
            description: args.description,
            category: args.category,
            price: args.price,
            unit: args.unit,
            stock: args.stock,
            imageUrl: args.imageUrl,
            rating: args.rating,
            reviewsCount: args.reviewsCount,
        });
        return supplyId;
    },
});

// Update supply stock
export const updateStock = mutation({
    args: {
        id: v.id("supplies"),
        stock: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { stock: args.stock });
    },
});

// Delete supply (Admin only)
export const remove = mutation({
    args: {
        id: v.id("supplies"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
