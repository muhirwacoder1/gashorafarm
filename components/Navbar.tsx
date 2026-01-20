import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, Home, Store, Package, LayoutDashboard } from 'lucide-react';
import { useStore } from '../App';

export const Navbar: React.FC = () => {
  const { state } = useStore();
  const location = useLocation();
  const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full bg-white/90 p-1.5 sm:p-2 shadow-soft backdrop-blur-md ring-1 ring-stone-900/5 max-w-full overflow-x-auto no-scrollbar">
        
        {/* Logo/Home Icon Group */}
        <Link 
          to="/" 
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${isActive('/') ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-50'}`}
        >
          <Home className="h-5 w-5" />
        </Link>

        <div className="h-4 w-px bg-stone-200 mx-1"></div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link 
            to="/marketplace" 
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive('/marketplace') ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
          >
            <Store className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Market</span>
          </Link>

          <Link 
            to="/orders" 
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive('/orders') ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
          >
            <Package className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Orders</span>
          </Link>

           <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isDashboard ? 'bg-lime-400 text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>

        <div className="h-4 w-px bg-stone-200 mx-1"></div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/marketplace" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-50 transition-colors">
             <Search className="h-5 w-5" />
          </Link>
          
          <Link to="/cart" className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors">
             <ShoppingBag className="h-5 w-5" />
             {totalItems > 0 && (
               <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500 text-[9px] font-bold text-stone-900 ring-2 ring-white">
                 {totalItems}
               </span>
             )}
          </Link>
        </div>
      </div>
    </nav>
  );
};