import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Package, LayoutDashboard, LogOut, ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../App';
import { useAuth } from '../contexts/AuthContext';

// Custom SVG Icons from assets
const HomeIcon = () => (
  <svg viewBox="0 0 512 512" className="h-5 w-5" fill="currentColor">
    <path d="M256,319.841c-35.346,0-64,28.654-64,64v128h128v-128C320,348.495,291.346,319.841,256,319.841z" />
    <path d="M362.667,383.841v128H448c35.346,0,64-28.654,64-64V253.26c0.005-11.083-4.302-21.733-12.011-29.696l-181.29-195.99c-31.988-34.61-85.976-36.735-120.586-4.747c-1.644,1.52-3.228,3.103-4.747,4.747L12.395,223.5C4.453,231.496-0.003,242.31,0,253.58v194.261c0,35.346,28.654,64,64,64h85.333v-128c0.399-58.172,47.366-105.676,104.073-107.044C312.01,275.383,362.22,323.696,362.667,383.841z" />
  </svg>
);

const MarketStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="m21.802,0l2.198,6.5v.5c0,2.206-1.794,4-4,4h-1c-1.193,0-2.267-.525-3-1.357-.733.832-1.807,1.357-3,1.357h-2c-1.2,0-2.266-.542-3-1.382-.734.84-1.8,1.382-3,1.382h-1c-2.206,0-4-1.794-4-4l.024-.717L2.198,0h4.802v5h2V0h6v5h2V0h4.802Zm-6.789,21h-6.023l-.846-1H0v1c0,1.657,1.343,3,3,3h18c1.657,0,3-1.343,3-3v-1h-8.14l-.846,1Zm-5.085-2h4.157l.846-1h7.068v-5.35c-.627.223-1.298.35-2,.35h-1c-1.063,0-2.097-.284-3-.806-.903.522-1.937.806-3,.806h-2c-1.062,0-2.095-.288-3-.818-.905.53-1.938.818-3,.818h-1c-.702,0-1.373-.128-2-.35v5.35h7.082l.846,1Z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const { cart } = useStore();
  const { user, isAuthenticated, isFarmer, logout } = useAuth();
  const location = useLocation();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isActivePath = (path: string) => location.pathname.startsWith(path);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center items-center gap-3 px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full bg-white/95 p-1.5 sm:p-2 shadow-lg backdrop-blur-md ring-1 ring-stone-900/5 max-w-full overflow-x-auto no-scrollbar">


        {/* Home Icon - ONLY for Regular Users (not farmers) */}
        {!isFarmer && (
          <>
            <Link
              to="/"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isActive('/') ? 'bg-lime-100 text-lime-700' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'}`}
              title="Home"
            >
              <HomeIcon />
            </Link>
            <div className="h-5 w-px bg-stone-200 mx-1"></div>
          </>
        )}

        {/* Main Navigation Links */}
        <div className="flex items-center gap-1">
          {/* Market Store - Available to ALL users */}
          <Link
            to="/marketplace"
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive('/marketplace') ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <MarketStoreIcon />
            <span className="hidden sm:inline">Market Store</span>
          </Link>

          {/* Supplier Products - ONLY for Farmers (replaces Supplies) */}
          {isFarmer && (
            <Link
              to="/supplies"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive('/supplies') ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Supplier Products</span>
            </Link>
          )}

          {/* My Orders - Available to ALL authenticated users */}
          <Link
            to="/orders"
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive('/orders') ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <Package className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">My Orders</span>
          </Link>

          {/* Dashboard Link - Only for Farmers */}
          {isFarmer && (
            <Link
              to="/farmer/dashboard"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActivePath('/farmer') ? 'bg-lime-500 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* Become a Farmer CTA - Only for non-authenticated regular users */}
          {!isFarmer && !isAuthenticated && (
            <Link
              to="/farmer/register"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-lime-500 text-white hover:bg-lime-600 shadow-md"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Sell as Farmer</span>
            </Link>
          )}
        </div>

        <div className="h-5 w-px bg-stone-200 mx-1"></div>

        {/* Right Side: Actions + User Menu */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link
            to="/marketplace"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-md"
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-[10px] font-bold text-stone-900 ring-2 ring-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-1 h-10 px-2 rounded-full transition-all duration-200 ${isAuthenticated
                ? 'bg-lime-50 text-lime-700 hover:bg-lime-100'
                : 'text-stone-500 hover:bg-stone-100'
                }`}
            >
              {isAuthenticated ? (
                <>
                  <div className="h-7 w-7 rounded-full bg-lime-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </>
              ) : (
                <svg viewBox="0 -960 960 960" className="h-6 w-6" fill="currentColor">
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-stone-900/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
                      <p className="text-xs text-stone-500">{user?.email}</p>
                      {isFarmer && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-medium rounded-full">
                          Farmer
                        </span>
                      )}
                    </div>

                    {/* Farmer Dashboard Link */}
                    {isFarmer && (
                      <Link
                        to="/farmer/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActivePath('/farmer')
                          ? 'bg-lime-50 text-lime-700'
                          : 'text-stone-700 hover:bg-stone-50'
                          }`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Farmer Dashboard
                      </Link>
                    )}

                    {/* My Profile Link */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900">Welcome!</p>
                      <p className="text-xs text-stone-500">Sign in or create account</p>
                    </div>

                    {/* Customer Options */}
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Customer</p>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-lime-700 hover:bg-lime-50 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </div>

                    {/* Farmer Options */}
                    <div className="px-3 py-2 border-t border-stone-100">
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Farmer</p>
                      <Link
                        to="/farmer/login"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Farmer Sign In
                      </Link>
                      <Link
                        to="/farmer/register"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Become a Farmer
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Account Button - Shows only when NOT logged in */}
      {!isAuthenticated && (
        <Link
          to="/register"
          className="pointer-events-auto hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500 text-white font-semibold text-sm shadow-lg hover:bg-lime-600 transition-all hover:scale-105"
        >
          Create Account
        </Link>
      )}
    </nav>
  );
};