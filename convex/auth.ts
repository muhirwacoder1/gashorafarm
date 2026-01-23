import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple hash function (in production, use bcrypt)
function simpleHash(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

export const register = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        name: v.string(),
        role: v.union(v.literal("user"), v.literal("farmer"), v.literal("admin")),
        farmerData: v.optional(v.object({
            location: v.string(),
            imageUrl: v.optional(v.string()),
            phone: v.optional(v.string()),
            idNumber: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        // Check if email already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            throw new Error("Email already registered");
        }

        let farmerId = undefined;

        // If registering as farmer, create farmer profile
        if (args.role === "farmer" && args.farmerData) {
            farmerId = await ctx.db.insert("farmers", {
                name: args.name,
                location: args.farmerData.location,
                phone: args.farmerData.phone,
                idNumber: args.farmerData.idNumber,
                rating: 0,
                verified: false,
                imageUrl: args.farmerData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(args.name)}&background=random`,
                joinedDate: new Date().toISOString().split('T')[0],
            });
        }

        // Create user
        const userId = await ctx.db.insert("users", {
            email: args.email,
            password: simpleHash(args.password),
            name: args.name,
            role: args.role,
            farmerId,
        });

        return { userId, farmerId };
    },
});

export const login = mutation({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (user.password !== simpleHash(args.password)) {
            throw new Error("Invalid email or password");
        }

        // Get farmer data if user is a farmer
        let farmer = null;
        if (user.farmerId) {
            farmer = await ctx.db.get(user.farmerId);
        }

        return {
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            farmerId: user.farmerId,
            farmer,
        };
    },
});

export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        let farmer = null;
        if (user.farmerId) {
            farmer = await ctx.db.get(user.farmerId);
        }

        return {
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            farmerId: user.farmerId,
            farmer,
        };
    },
});

// Create default admin (run once)
export const createDefaultAdmin = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", "admin@farmconnect.com"))
            .first();

        if (existing) {
            return { message: "Admin already exists" };
        }

        await ctx.db.insert("users", {
            email: "admin@farmconnect.com",
            password: simpleHash("admin123"),
            name: "Admin",
            role: "admin",
        });

        return { message: "Default admin created" };
    },
});
