import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    Store,
    ClipboardCheck,
    LogOut,
    Leaf
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/farmers', icon: Leaf, label: 'Farmer Management' },
    { path: '/admin/products', icon: Package, label: 'Admin Products' },
    { path: '/admin/marketplace', icon: Store, label: 'Marketplace Control' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Order Management' },
    { path: '/admin/approvals', icon: ClipboardCheck, label: 'Approvals' },
];

export const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-stone-800">
                    <h1 className="text-2xl font-bold text-lime-400">GashoraFarm</h1>
                    <p className="text-xs text-stone-400 mt-1">Admin Dashboard</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-lime-500 text-stone-900 font-semibold'
                                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-stone-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-red-900/20 hover:text-red-400 transition-all w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
