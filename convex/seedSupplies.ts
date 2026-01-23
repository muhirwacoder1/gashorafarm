import { mutation } from "./_generated/server";

export const seedSupplies = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if supplies already exist
        const existing = await ctx.db.query("supplies").first();
        if (existing) {
            return { message: "Supplies already seeded" };
        }

        const supplies = [
            {
                name: "Professional Gardening Trowel",
                description: "Durable stainless steel trowel with comfortable ergonomic grip. Perfect for planting, transplanting, and digging.",
                category: "Tools" as const,
                price: 24.99,
                unit: "piece",
                stock: 150,
                imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80",
                rating: 4.7,
                reviewsCount: 89,
            },
            {
                name: "Organic Tomato Seeds - Heirloom",
                description: "Premium heirloom tomato seeds, non-GMO and organic certified. High germination rate. 50 seeds per pack.",
                category: "Seeds" as const,
                price: 8.99,
                unit: "pack",
                stock: 200,
                imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80",
                rating: 4.9,
                reviewsCount: 156,
            },
            {
                name: "Organic Compost Fertilizer",
                description: "Nutrient-rich organic compost blend for all plant types. Improves soil structure and plant health.",
                category: "Fertilizers" as const,
                price: 19.99,
                unit: "25kg bag",
                stock: 75,
                imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80",
                rating: 4.6,
                reviewsCount: 72,
            },
            {
                name: "Drip Irrigation Kit",
                description: "Complete drip irrigation system for efficient water management. Covers up to 100 sq ft.",
                category: "Equipment" as const,
                price: 89.99,
                unit: "kit",
                stock: 45,
                imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80",
                rating: 4.8,
                reviewsCount: 134,
            },
            {
                name: "Pruning Shears - Professional Grade",
                description: "Sharp, corrosion-resistant pruning shears with precision cutting for trees and shrubs.",
                category: "Tools" as const,
                price: 34.99,
                unit: "piece",
                stock: 120,
                imageUrl: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80",
                rating: 4.5,
                reviewsCount: 98,
            },
            {
                name: "Organic Carrot Seeds",
                description: "Sweet and crunchy organic carrot seeds. Ideal for home gardens. 200 seeds per pack.",
                category: "Seeds" as const,
                price: 6.99,
                unit: "pack",
                stock: 180,
                imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80",
                rating: 4.7,
                reviewsCount: 67,
            },
            {
                name: "Liquid Seaweed Fertilizer",
                description: "Premium organic liquid fertilizer rich in trace minerals and growth hormones.",
                category: "Fertilizers" as const,
                price: 29.99,
                unit: "1L bottle",
                stock: 60,
                imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80",
                rating: 4.8,
                reviewsCount: 91,
            },
            {
                name: "Garden Rake - Heavy Duty",
                description: "Strong steel rake with 14 tines. Perfect for leveling soil and removing debris.",
                category: "Tools" as const,
                price: 42.99,
                unit: "piece",
                stock: 90,
                imageUrl: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80",
                rating: 4.6,
                reviewsCount: 54,
            },
            {
                name: "Neem Oil Organic Pesticide",
                description: "100% organic neem oil for natural pest control. Safe for plants, pets, and beneficial insects.",
                category: "Pesticides" as const,
                price: 18.99,
                unit: "500ml",
                stock: 110,
                imageUrl: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?auto=format&fit=crop&q=80",
                rating: 4.7,
                reviewsCount: 103,
            },
            {
                name: "Greenhouse Starter Kit",
                description: "Compact greenhouse kit perfect for seedlings and small plants. UV-resistant cover included.",
                category: "Equipment" as const,
                price: 129.99,
                unit: "kit",
                stock: 30,
                imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
                rating: 4.9,
                reviewsCount: 145,
            },
        ];

        for (const supply of supplies) {
            await ctx.db.insert("supplies", supply);
        }

        return { message: `Successfully seeded ${supplies.length} supplies` };
    },
});
