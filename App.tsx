import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { FarmerDashboard } from './pages/admin/FarmerDashboard';
import { AddProduct } from './pages/admin/AddProduct';
import { ManageOrders } from './pages/admin/ManageOrders';
import { Analytics } from './pages/admin/Analytics';
import { Product, CartItem, Order } from './types';
import { PRODUCTS } from './constants';

// --- Global State Management (Mini Context) ---
interface AppState {
  cart: CartItem[];
  orders: Order[];
  products: Product[];
}

interface AppContextType {
  state: AppState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  addProduct: (product: Product) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<AppContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    cart: [],
    orders: [],
    products: PRODUCTS // Initialize with mock data
  });

  const addToCart = (product: Product) => {
    setState(prev => {
      const existing = prev.cart.find(item => item.id === product.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { ...prev, cart: [...prev.cart, { ...product, quantity: 1 }] };
    });
  };

  const removeFromCart = (productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== productId)
    }));
  };

  const updateQuantity = (productId: string, qty: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item => item.id === productId ? { ...item, quantity: qty } : item)
    }));
  };

  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));

  const addOrder = (order: Order) => {
    setState(prev => ({
      ...prev,
      orders: [order, ...prev.orders]
    }));
  };

  const addProduct = (product: Product) => {
    setState(prev => ({
      ...prev,
      products: [product, ...prev.products]
    }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, status } : o)
    }));
  };

  return (
    <StoreContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart, addOrder, addProduct, updateOrderStatus }}>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 selection:bg-primary-100 selection:text-primary-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              
              {/* Admin / Farmer Routes */}
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route path="/dashboard/add" element={<AddProduct />} />
              <Route path="/dashboard/orders" element={<ManageOrders />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
            </Routes>
          </main>
          
          <footer className="bg-white py-16 text-center text-sm text-stone-400 border-t border-stone-100 mt-auto">
            <p className="font-medium tracking-wide">&copy; {new Date().getFullYear()} FarmConnect</p>
            <p className="mt-2 text-stone-300">Cultivating community.</p>
          </footer>
        </div>
      </HashRouter>
    </StoreContext.Provider>
  );
};

export default App;