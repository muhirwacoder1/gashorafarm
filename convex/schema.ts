import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  farmers: defineTable({
    name: v.string(),
    location: v.string(),
    phone: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    rating: v.number(),
    verified: v.boolean(),
    imageUrl: v.string(),
    joinedDate: v.string(),
  }),

  products: defineTable({
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
  }).index("by_category", ["category"])
    .index("by_farmer", ["farmerId"]),

  orders: defineTable({
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
  }).index("by_status", ["status"]),

  supplies: defineTable({
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
  }).index("by_category", ["category"]),

  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    role: v.union(
      v.literal("user"),
      v.literal("farmer"),
      v.literal("admin")
    ),
    farmerId: v.optional(v.id("farmers")),
  }).index("by_email", ["email"]),
});
