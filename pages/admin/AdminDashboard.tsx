import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Users, Leaf, Package, ShoppingBag, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const stats = useQuery(api.admin.getDashboardStats);

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-lime-500 mx-auto"></div>
                    <p className="mt-4 text-stone-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            subtitle: `${stats.regularUsers} regular users`,
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Farmers',
            value: stats.totalFarmers,
            subtitle: `${stats.verifiedFarmers} verified`,
            icon: Leaf,
            color: 'bg-lime-500',
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            subtitle: 'Listed in marketplace',
            icon: Package,
            color: 'bg-purple-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            icon: ShoppingBag,
            color: 'bg-orange-500',
        },
        {
            title: 'Total Revenue',
            value: `RWF ${(stats.revenue * 1300).toFixed(0)}`,
            subtitle: 'From delivered orders',
            icon: DollarSign,
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900">Dashboard Overview</h1>
                <p className="text-stone-500 mt-1">System health and recent activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} rounded-2xl p-3`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-stone-500 mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</p>
                            <p className="text-xs text-stone-400">{stat.subtitle}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Farmers */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Leaf className="h-5 w-5 text-lime-600" />
                        <h2 className="text-xl font-bold text-stone-900">Recent Farmers</h2>
                    </div>
                    <div className="space-y-4">
                        {stats.recentFarmers.length === 0 ? (
                            <p className="text-center text-stone-400 py-8">No farmers registered yet</p>
                        ) : (
                            stats.recentFarmers.map((farmer: any) => (
                                <div key={farmer._id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                                    <img src={farmer.imageUrl} alt={farmer.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-stone-900">{farmer.name}</p>
                                        <p className="text-sm text-stone-500">{farmer.location}</p>
                                    </div>
                                    {farmer.verified ? (
                                        <CheckCircle className="h-5 w-5 text-lime-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-amber-500" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingBag className="h-5 w-5 text-orange-600" />
                        <h2 className="text-xl font-bold text-stone-900">Recent Orders</h2>
                    </div>
                    <div className="space-y-4">
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-center text-stone-400 py-8">No orders placed yet</p>
                        ) : (
                            stats.recentOrders.map((order: any) => (
                                <div key={order._id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-stone-900">Order #{order._id.slice(-6)}</p>
                                        <p className="text-sm text-stone-500">{order.date} • {order.items.length} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-stone-900">RWF {(order.total * 1300).toFixed(0)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-r from-lime-500 to-green-500 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="#/admin/approvals" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-center transition-all">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Approvals</p>
                        {stats.pendingOrders > 0 && (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {stats.pendingOrders}
                            </span>
                        )}
                    </a>
                    <a href="#/admin/farmers" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-center transition-all">
                        <Leaf className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Farmers</p>
                    </a>
                    <a href="#/admin/products" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-center transition-all">
                        <Package className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Products</p>
                    </a>
                    <a href="#/admin/orders" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-center transition-all">
                        <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Orders</p>
                    </a>
                </div>
            </div>
        </div>
    );
};
