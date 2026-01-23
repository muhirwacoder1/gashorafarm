import { query } from "./_generated/server";

// Get dashboard statistics
export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const [users, farmers, products, orders] = await Promise.all([
            ctx.db.query("users").collect(),
            ctx.db.query("farmers").collect(),
            ctx.db.query("products").collect(),
            ctx.db.query("orders").collect(),
        ]);

        // Calculate revenue (sum of all delivered orders)
        const revenue = orders
            .filter(order => order.status === "Delivered")
            .reduce((sum, order) => sum + order.total, 0);

        // Recent activity (last 10 farmers and orders)
        const recentFarmers = farmers
            .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
            .slice(0, 5);

        const recentOrders = orders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        return {
            totalUsers: users.length,
            regularUsers: users.filter(u => u.role === "user").length,
            totalFarmers: farmers.length,
            verifiedFarmers: farmers.filter(f => f.verified).length,
            totalProducts: products.length,
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === "Pending").length,
            revenue: revenue,
            recentFarmers,
            recentOrders,
        };
    },
});
