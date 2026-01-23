import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowUpRight, DollarSign, Package, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { Button } from '../../components/Button';

export const FarmerDashboard: React.FC = () => {
  // Fetch data from Convex
  const products = useQuery(api.products.list, {}) ?? [];
  const orders = useQuery(api.orders.list) ?? [];

  // Calculate stats from Convex data - Revenue in RWF
  const totalRevenueRWF = orders.reduce((acc, order) => acc + (order.total * 1300), 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const lowStockItems = products.filter(p => p.stock < 20).length;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  // Loading state
  if (products === undefined || orders === undefined) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Farmer Dashboard</span>
            <h1 className="mt-1 text-4xl font-black text-stone-900 uppercase">Dashboard</h1>
            <p className="mt-2 text-stone-500">Welcome back, Green Valley Organics.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/farmer/add">
              <Button variant="lime" className="gap-2">
                <Plus className="h-5 w-5" /> Add Produce
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12.5% <TrendingUp className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500">Total Revenue</p>
              <h3 className="text-3xl font-bold text-stone-900">RWF {totalRevenueRWF.toLocaleString()}</h3>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <Link to="/farmer/orders" className="text-sm font-bold text-stone-400 hover:text-stone-900">View All</Link>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500">Active Orders</p>
              <h3 className="text-3xl font-bold text-stone-900">{activeOrders}</h3>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Attention Needed</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-stone-900">{lowStockItems}</h3>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/farmer/analytics" className="group relative overflow-hidden rounded-3xl bg-stone-900 p-8 text-white transition-all hover:bg-stone-800">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">Analytics & Reports</h3>
              <p className="mt-2 text-stone-400 max-w-xs">Deep dive into your weekly performance and customer trends.</p>
              <div className="mt-8 flex items-center gap-2 font-bold text-lime-400">
                View Reports <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
            {/* Decorative blob */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-stone-800/50 blur-3xl group-hover:bg-lime-900/20 transition-colors"></div>
          </Link>

          <Link to="/farmer/orders" className="group relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-stone-200 transition-all hover:ring-stone-300">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-stone-900">Manage Orders</h3>
              <p className="mt-2 text-stone-500 max-w-xs">Track, ship, and update status for your {activeOrders} pending deliveries.</p>
              <div className="mt-8 flex items-center gap-2 font-bold text-stone-900">
                Go to Orders <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};