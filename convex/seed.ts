import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Farmer data with real African farmer images
const FARMERS_DATA = [
    { name: 'Kinyarwanda Iki', location: 'Gashora, Bugesera', rating: 4.8, verified: true, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', joinedDate: '2021-03-15' },
    { name: 'Happy Hens Farm', location: 'Nyamata, Bugesera', rating: 4.6, verified: true, imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=200&fit=crop&crop=face', joinedDate: '2022-01-10' },
    { name: 'Urban Greens', location: 'Kigali, Gasabo', rating: 4.9, verified: true, imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face', joinedDate: '2020-11-05' },
    { name: 'Hilltop Harvest', location: 'Huye, Tumba', rating: 4.7, verified: false, imageUrl: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=200&h=200&fit=crop&crop=face', joinedDate: '2023-05-20' },
    { name: 'Ishema Farms', location: 'Rubavu, Gisenyi', rating: 4.5, verified: true, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face', joinedDate: '2022-08-14' },
    { name: 'Ubumwe Dairy', location: 'Musanze, Ruhengeri', rating: 4.9, verified: true, imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', joinedDate: '2019-04-01' },
    { name: 'Imbere Grains', location: 'Muhanga, Gitarama', rating: 4.4, verified: false, imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', joinedDate: '2023-02-28' },
    { name: 'Urugori Herbs', location: 'Karongi, Kibuye', rating: 4.8, verified: true, imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', joinedDate: '2021-09-12' },
    { name: 'Amahoro Poultry', location: 'Nyagatare, Gatsibo', rating: 5.0, verified: true, imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face', joinedDate: '2020-06-30' },
    { name: 'Ikizere Orchards', location: 'Rusizi, Kamembe', rating: 4.7, verified: true, imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', joinedDate: '2022-11-22' },
];

// Products data with farmer index reference (0-based)
const PRODUCTS_DATA = [
    { farmerIdx: 0, name: 'Heirloom Carrots', description: 'Crunchy, sweet, and colorful heirloom carrots harvested this morning.', category: 'Vegetables' as const, price: 3.50, unit: 'bunch', stock: 50, isOrganic: true, harvestDate: '2023-10-25', imageUrl: 'https://picsum.photos/seed/carrots/400/400', rating: 4.8, reviewsCount: 124 },
    { farmerIdx: 0, name: 'Red Kale', description: 'Fresh, nutrient-packed red kale. Perfect for salads or chips.', category: 'Vegetables' as const, price: 2.75, unit: 'bunch', stock: 30, isOrganic: true, harvestDate: '2023-10-26', imageUrl: 'https://picsum.photos/seed/kale/400/400', rating: 4.5, reviewsCount: 45 },
    { farmerIdx: 1, name: 'Roma Tomatoes', description: 'Vine-ripened Roma tomatoes, bursting with flavor.', category: 'Vegetables' as const, price: 4.00, unit: 'kg', stock: 100, isOrganic: true, harvestDate: '2023-10-24', imageUrl: 'https://picsum.photos/seed/tomatoes/400/400', rating: 4.7, reviewsCount: 89 },
    { farmerIdx: 1, name: 'Sweet Corn', description: 'Golden sweet corn, picked at the peak of sweetness.', category: 'Vegetables' as const, price: 1.00, unit: 'ear', stock: 200, isOrganic: false, harvestDate: '2023-10-25', imageUrl: 'https://picsum.photos/seed/corn/400/400', rating: 4.6, reviewsCount: 32 },
    { farmerIdx: 2, name: 'Fuji Apples', description: 'Crisp and sweet Fuji apples from the orchard.', category: 'Fruits' as const, price: 5.50, unit: 'kg', stock: 150, isOrganic: true, harvestDate: '2023-10-20', imageUrl: 'https://picsum.photos/seed/apples/400/400', rating: 4.9, reviewsCount: 210 },
    { farmerIdx: 2, name: 'Bartlett Pears', description: 'Juicy Bartlett pears, great for snacking or baking.', category: 'Fruits' as const, price: 4.80, unit: 'kg', stock: 80, isOrganic: true, harvestDate: '2023-10-22', imageUrl: 'https://picsum.photos/seed/pears/400/400', rating: 4.8, reviewsCount: 56 },
    { farmerIdx: 5, name: 'Raw Milk Cheese', description: 'Aged artisanal raw milk cheese with a sharp flavor.', category: 'Dairy' as const, price: 12.00, unit: 'block', stock: 20, isOrganic: true, harvestDate: '2023-09-15', imageUrl: 'https://picsum.photos/seed/cheese/400/400', rating: 4.9, reviewsCount: 312 },
    { farmerIdx: 5, name: 'Fresh Cream', description: 'Rich, thick cream from grass-fed cows.', category: 'Dairy' as const, price: 6.00, unit: 'bottle', stock: 15, isOrganic: true, harvestDate: '2023-10-26', imageUrl: 'https://picsum.photos/seed/cream/400/400', rating: 5.0, reviewsCount: 88 },
    { farmerIdx: 8, name: 'Free Range Eggs', description: 'Large brown eggs from happy, pasture-raised hens.', category: 'Dairy' as const, price: 7.00, unit: 'dozen', stock: 40, isOrganic: true, harvestDate: '2023-10-27', imageUrl: 'https://picsum.photos/seed/eggs/400/400', rating: 4.8, reviewsCount: 450 },
    { farmerIdx: 4, name: 'Wildflower Honey', description: 'Raw, unfiltered honey with floral notes.', category: 'Honey' as const, price: 15.00, unit: 'jar', stock: 25, isOrganic: true, harvestDate: '2023-08-10', imageUrl: 'https://picsum.photos/seed/honey/400/400', rating: 5.0, reviewsCount: 120 },
    { farmerIdx: 7, name: 'Fresh Basil', description: 'Aromatic basil bunch, essential for pesto.', category: 'Herbs' as const, price: 3.00, unit: 'bunch', stock: 20, isOrganic: true, harvestDate: '2023-10-27', imageUrl: 'https://picsum.photos/seed/basil/400/400', rating: 4.7, reviewsCount: 30 },
    { farmerIdx: 7, name: 'Rosemary', description: 'Woody rosemary sprigs.', category: 'Herbs' as const, price: 2.50, unit: 'bunch', stock: 15, isOrganic: true, harvestDate: '2023-10-25', imageUrl: 'https://picsum.photos/seed/rosemary/400/400', rating: 4.6, reviewsCount: 15 },
    { farmerIdx: 6, name: 'Rolled Oats', description: 'Classic rolled oats, perfect for breakfast.', category: 'Grains' as const, price: 4.00, unit: 'bag', stock: 60, isOrganic: false, harvestDate: '2023-09-01', imageUrl: 'https://picsum.photos/seed/oats/400/400', rating: 4.5, reviewsCount: 67 },
    { farmerIdx: 6, name: 'Whole Wheat Flour', description: 'Stone-ground whole wheat flour.', category: 'Grains' as const, price: 5.00, unit: 'bag', stock: 45, isOrganic: false, harvestDate: '2023-09-10', imageUrl: 'https://picsum.photos/seed/flour/400/400', rating: 4.4, reviewsCount: 22 },
    { farmerIdx: 3, name: 'Potatoes (Russet)', description: 'Versatile Russet potatoes, great for baking.', category: 'Vegetables' as const, price: 3.00, unit: 'kg', stock: 300, isOrganic: false, harvestDate: '2023-10-15', imageUrl: 'https://picsum.photos/seed/potatoes/400/400', rating: 4.3, reviewsCount: 90 },
    { farmerIdx: 9, name: 'Blueberries', description: 'Plump and sweet late-season blueberries.', category: 'Fruits' as const, price: 6.00, unit: 'pint', stock: 40, isOrganic: true, harvestDate: '2023-10-24', imageUrl: 'https://picsum.photos/seed/blueberries/400/400', rating: 4.9, reviewsCount: 110 },
    { farmerIdx: 9, name: 'Peaches', description: 'Juicy peaches with a soft fuzz.', category: 'Fruits' as const, price: 5.00, unit: 'kg', stock: 25, isOrganic: true, harvestDate: '2023-10-23', imageUrl: 'https://picsum.photos/seed/peaches/400/400', rating: 4.8, reviewsCount: 75 },
    { farmerIdx: 0, name: 'Beets', description: 'Earthy red beets, greens attached.', category: 'Vegetables' as const, price: 3.25, unit: 'bunch', stock: 35, isOrganic: true, harvestDate: '2023-10-26', imageUrl: 'https://picsum.photos/seed/beets/400/400', rating: 4.6, reviewsCount: 28 },
    { farmerIdx: 1, name: 'Cucumber', description: 'Crunchy slicing cucumbers.', category: 'Vegetables' as const, price: 1.50, unit: 'each', stock: 60, isOrganic: true, harvestDate: '2023-10-27', imageUrl: 'https://picsum.photos/seed/cucumber/400/400', rating: 4.5, reviewsCount: 54 },
    { farmerIdx: 4, name: 'Honeycomb', description: 'Pure honeycomb straight from the hive.', category: 'Honey' as const, price: 20.00, unit: 'box', stock: 10, isOrganic: true, harvestDate: '2023-08-15', imageUrl: 'https://picsum.photos/seed/honeycomb/400/400', rating: 5.0, reviewsCount: 40 },
];

// Check if database is already seeded
export const isSeeded = query({
    args: {},
    handler: async (ctx) => {
        const farmers = await ctx.db.query("farmers").first();
        return farmers !== null;
    },
});

// Seed all data
export const seedAll = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if already seeded
        const existingFarmer = await ctx.db.query("farmers").first();
        if (existingFarmer) {
            return { success: false, message: "Database already seeded" };
        }

        // Insert farmers and track their IDs
        const farmerIds: Id<"farmers">[] = [];
        for (const farmer of FARMERS_DATA) {
            const id = await ctx.db.insert("farmers", farmer);
            farmerIds.push(id);
        }

        // Insert products with correct farmer IDs
        for (const product of PRODUCTS_DATA) {
            const { farmerIdx, ...productData } = product;
            await ctx.db.insert("products", {
                ...productData,
                farmerId: farmerIds[farmerIdx],
            });
        }

        return {
            success: true,
            message: `Seeded ${FARMERS_DATA.length} farmers and ${PRODUCTS_DATA.length} products`
        };
    },
});

// Clear all data (for testing)
export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").collect();
        for (const order of orders) {
            await ctx.db.delete(order._id);
        }

        const products = await ctx.db.query("products").collect();
        for (const product of products) {
            await ctx.db.delete(product._id);
        }

        const farmers = await ctx.db.query("farmers").collect();
        for (const farmer of farmers) {
            await ctx.db.delete(farmer._id);
        }

        return { success: true, message: "Cleared all data" };
    },
});
