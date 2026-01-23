import React, { useState } from 'react';
import { useStore, ConvexCartItem } from '../App';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, Smartphone, Banknote, ShoppingBag, Truck, MapPin, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const createOrder = useMutation(api.orders.create);
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cod'>('momo');
  const [deliveryMethod, setDeliveryMethod] = useState<'farmer' | 'stock'>('stock');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate prices in RWF
  const subtotalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalRWF = subtotalUSD * 1300;

  // VAT 18%
  const vatRWF = subtotalRWF * 0.18;

  // Delivery fee based on selection
  const deliveryFeeRWF = deliveryMethod === 'stock' ? 1000 : 3000;

  // Total in RWF
  const totalRWF = subtotalRWF + vatRWF + deliveryFeeRWF;

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    setLoading(true);
    try {
      // Create order in Convex with Pending status
      await createOrder({
        date: new Date().toISOString().split('T')[0],
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          imageUrl: item.imageUrl,
        })),
        total: totalRWF / 1300, // Store in USD for consistency
        status: 'Pending', // Changed from Confirmed to Pending
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod === 'momo' ? 'Mobile Money' : 'Cash on Delivery'
      });

      setLoading(false);
      setShowSuccessModal(true);
      // Don't clear cart here - wait for modal dismissal
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-64 h-64">
              <DotLottieReact
                src="https://lottie.host/4cb1b89c-5b6d-4c1f-8c3e-3c3e3f3c3c3c/Z0pQz0pQz0.json"
                loop
                autoplay
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-stone-900">Your cart is empty</h2>
            <p className="mt-2 text-stone-500">Add some fresh produce to get started!</p>
            <Link to="/marketplace">
              <Button size="lg" className="mt-6 rounded-full">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-stone-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-stone-900">{item.name}</h3>
                        <p className="text-sm text-stone-500">{item.unit}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors h-fit">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-stone-900 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <span className="text-lg font-bold text-stone-900 min-w-[3rem] text-right">RWF {((item.price * item.quantity) * 1300).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-8 shadow-sm sticky top-32">
              <h3 className="mb-6 text-lg font-bold text-stone-900">Order Summary</h3>

              {/* Delivery Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address (District, Sector, Cell, Village)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium resize-none"
                    rows={3}
                    required
                  />
                </div>
                <p className="text-xs text-stone-400 mt-1">Include landmarks for easier delivery</p>
              </div>

              {/* Delivery Method Selection */}
              <div className="mb-6 space-y-3">
                <p className="text-sm font-semibold text-stone-700 mb-3">Delivery Method</p>

                {/* Pickup from Stock */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'stock' ? 'border-lime-500 bg-lime-50' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="stock"
                    checked={deliveryMethod === 'stock'}
                    onChange={(e) => setDeliveryMethod('stock')}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="h-4 w-4 text-lime-600" />
                      <p className="font-semibold text-stone-900">Pickup from Stock</p>
                    </div>
                    <p className="text-xs text-stone-500">Collect from our warehouse</p>
                    <p className="text-sm font-bold text-lime-600 mt-1">RWF 1,000</p>
                  </div>
                </label>

                {/* Pickup from Farmer */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'farmer' ? 'border-lime-500 bg-lime-50' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="farmer"
                    checked={deliveryMethod === 'farmer'}
                    onChange={(e) => setDeliveryMethod('farmer')}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-lime-600" />
                      <p className="font-semibold text-stone-900">Pickup from Farmer</p>
                    </div>
                    <p className="text-xs text-stone-500">Direct from the farm (includes transport)</p>
                    <p className="text-sm font-bold text-lime-600 mt-1">RWF 3,000</p>
                  </div>
                </label>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-b border-stone-100 pb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium">RWF {subtotalRWF.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>VAT (18%)</span>
                  <span className="font-medium">RWF {vatRWF.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-medium">RWF {deliveryFeeRWF.toFixed(0)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-6 border-b border-stone-100">
                <span className="text-lg font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold text-lime-600">RWF {totalRWF.toFixed(0)}</span>
              </div>

              {/* Payment Method */}
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-stone-700">Payment Method</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-stone-200 hover:border-stone-300 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod('momo')}
                    />
                    <Smartphone className="h-5 w-5 text-stone-600" />
                    <span className="font-medium text-stone-900">Mobile Money</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-stone-200 hover:border-stone-300 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod('cod')}
                    />
                    <Banknote className="h-5 w-5 text-stone-600" />
                    <span className="font-medium text-stone-900">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Pending Notice */}
              <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Your order will be pending until approved by admin
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                fullWidth
                size="lg"
                className="mt-6 rounded-xl bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600"
                disabled={loading || !deliveryAddress.trim()}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-lime-600" />
              </div>

              <h2 className="text-3xl font-bold text-stone-900 mb-4">Order Placed!</h2>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                  <p className="font-semibold text-amber-800">Pending Admin Approval</p>
                </div>
                <p className="text-sm text-amber-700">
                  Your order is being reviewed. You'll be notified once it's confirmed.
                </p>
              </div>

              <div className="space-y-2 mb-6 text-left bg-stone-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Total:</span>
                  <span className="font-bold">RWF {totalRWF.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Delivery:</span>
                  <span>{deliveryMethod === 'stock' ? 'From Stock' : 'From Farmer'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => { setShowSuccessModal(false); clearCart(); navigate('/'); }} variant="outline" fullWidth className="rounded-xl">
                  Home
                </Button>
                <Button onClick={() => { setShowSuccessModal(false); clearCart(); navigate('/orders'); }} fullWidth className="rounded-xl bg-lime-500 hover:bg-lime-600">
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};