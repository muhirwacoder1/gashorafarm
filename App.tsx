import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Id } from './convex/_generated/dataModel';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { Supplies } from './pages/Supplies';
// Farmer routes
import { FarmerLogin } from './pages/farmer/FarmerLogin';
import { FarmerRegister } from './pages/farmer/FarmerRegister';
import { FarmerDashboard } from './pages/admin/FarmerDashboard';
import { AddProduct } from './pages/admin/AddProduct';
import { ManageOrders } from './pages/admin/ManageOrders';
import { Analytics } from './pages/admin/Analytics';
// Admin routes
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminApprovals } from './pages/admin/AdminApprovals';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLayout } from './components/AdminLayout';
import { UserManagement } from './pages/admin/UserManagement';
import { FarmerManagement } from './pages/admin/FarmerManagement';
import { AdminProducts } from './pages/admin/AdminProducts';
import { MarketplaceControl } from './pages/admin/MarketplaceControl';
import { OrderManagement } from './pages/admin/OrderManagement';
// User routes
import { UserLogin } from './pages/user/UserLogin';
import { UserRegister } from './pages/user/UserRegister';
import { UserProfile } from './pages/user/UserProfile';

// --- Cart Item with Convex ID ---
export interface ConvexCartItem {
  _id: Id<"products">;
  farmerId: Id<"farmers">;
  name: string;
  description: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Honey' | 'Herbs' | 'Grains';
  price: number;
  unit: string;
  stock: number;
  isOrganic: boolean;
  harvestDate: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  quantity: number;
}

// --- Global State Management ---
interface AppContextType {
  cart: ConvexCartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: Id<"products">) => void;
  updateQuantity: (productId: Id<"products">, qty: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<AppContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

// --- Main Layout with Navbar ---
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') ||
    location.pathname === '/farmer/login' ||
    location.pathname === '/farmer/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

// --- Scroll to Top on Route Change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

// --- Main App Component ---
export const App: React.FC = () => {
  const [cart, setCart] = useState<ConvexCartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ productId, product, quantity }: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === productId);
      if (existing) {
        return prev.map(item =>
          item._id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: Id<"products">) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: Id<"products">, qty: number) => {
    setCart(prev => prev.map(item =>
      item._id === productId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <AuthProvider>
      <StoreContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes - Completely Separate */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="farmers" element={<FarmerManagement />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="marketplace" element={<MarketplaceControl />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="approvals" element={<AdminApprovals />} />
            </Route>

            {/* Main App Routes with Navbar */}
            <Route path="*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/supplies" element={<Supplies />} />

                  {/* User Auth Routes */}
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/register" element={<UserRegister />} />
                  <Route path="/profile" element={<UserProfile />} />

                  {/* Farmer Routes */}
                  <Route path="/farmer/login" element={<FarmerLogin />} />
                  <Route path="/farmer/register" element={<FarmerRegister />} />
                  <Route path="/farmer/dashboard" element={
                    <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/farmer/add" element={
                    <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                      <AddProduct />
                    </ProtectedRoute>
                  } />
                  <Route path="/farmer/orders" element={
                    <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                      <ManageOrders />
                    </ProtectedRoute>
                  } />
                  <Route path="/farmer/analytics" element={
                    <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </HashRouter>
      </StoreContext.Provider>
    </AuthProvider>
  );
};

export default App;