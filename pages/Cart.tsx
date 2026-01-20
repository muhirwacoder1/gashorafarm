import React, { useState } from 'react';
import { useStore } from '../App';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cod'>('momo');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.00;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setLoading(true);
    // Simulate delay for animation
    setTimeout(() => {
      addOrder({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        items: [...state.cart],
        total,
        status: 'Confirmed',
        deliveryAddress: '123 Main St, Portland, OR',
        paymentMethod: paymentMethod === 'momo' ? 'Mobile Money' : 'Cash on Delivery'
      });
      clearCart();
      setLoading(false);
      navigate('/orders');
    }, 4000); // Increased time to 4s to enjoy the animation
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center">
         <div className="w-64 h-64 sm:w-96 sm:h-96">
            <DotLottieReact
              src="https://lottie.host/6c0addec-9dc6-4751-870c-25e695f4ef83/9ukJEZdYMW.lottie"
              loop
              autoplay
            />
         </div>
         <h2 className="mt-8 text-3xl font-black tracking-tight text-stone-900">Processing Order</h2>
         <p className="mt-2 text-stone-500">Contacting {paymentMethod === 'momo' ? 'Mobile Money service' : 'farmer'}...</p>
      </div>
    );
  }

  if (state.cart.length === 0 && step === 'cart') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center pt-24">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-stone-900">Your basket is empty</h2>
        <p className="mb-8 text-stone-500">Fill it with fresh, seasonal produce.</p>
        <Link to="/marketplace">
          <Button className="rounded-full px-8">Browse Market</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-bold tracking-tight text-stone-900">{step === 'cart' ? 'Your Basket' : 'Checkout'}</h1>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {step === 'cart' ? (
            <div className="space-y-6">
              {state.cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-stone-100 pb-6">
                  {/* Image */}
                  <div className="shrink-0">
                     <img src={item.imageUrl} alt={item.name} className="h-24 w-24 sm:h-24 sm:w-24 rounded-2xl object-cover bg-stone-100" />
                  </div>

                  {/* Details Container */}
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4">
                     {/* Text Info */}
                     <div className="flex-1">
                        <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
                        <p className="text-stone-500">${item.price}/{item.unit}</p>
                     </div>

                     {/* Controls Row - Flex between on mobile, end on desktop */}
                     <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                        
                        {/* Quantity */}
                        <div className="flex items-center rounded-full border border-stone-200 px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 text-stone-500 hover:text-stone-900"><Minus className="h-3 w-3" /></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-stone-500 hover:text-stone-900"><Plus className="h-3 w-3" /></button>
                        </div>
                        
                        {/* Total Price */}
                        <span className="text-lg font-bold text-stone-900 min-w-[3rem] text-right">${(item.price * item.quantity).toFixed(2)}</span>
                        
                        {/* Remove */}
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-stone-900">Delivery Details</h3>
                 <div className="grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Full Name" className="w-full rounded-xl border-stone-200 bg-white p-3 text-sm focus:border-stone-900 focus:ring-stone-900" />
                    <input type="text" placeholder="Phone Number" className="w-full rounded-xl border-stone-200 bg-white p-3 text-sm focus:border-stone-900 focus:ring-stone-900" />
                    <input type="text" placeholder="Address" className="w-full rounded-xl border-stone-200 bg-white p-3 text-sm focus:border-stone-900 focus:ring-stone-900 sm:col-span-2" />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <h3 className="text-xl font-bold text-stone-900">Payment Method</h3>
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                        onClick={() => setPaymentMethod('momo')}
                        className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${paymentMethod === 'momo' ? 'border-lime-500 bg-lime-50 ring-1 ring-lime-500 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                    >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${paymentMethod === 'momo' ? 'bg-lime-200 text-lime-800' : 'bg-stone-100 text-stone-500'}`}>
                             <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-stone-900">Mobile Money</span>
                            <span className="text-xs text-stone-500">MTN / Airtel</span>
                        </div>
                        <div className={`ml-auto h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'momo' ? 'border-lime-500' : 'border-stone-300'}`}>
                            {paymentMethod === 'momo' && <div className="h-3 w-3 rounded-full bg-lime-500" />}
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${paymentMethod === 'cod' ? 'border-lime-500 bg-lime-50 ring-1 ring-lime-500 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                    >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${paymentMethod === 'cod' ? 'bg-lime-200 text-lime-800' : 'bg-stone-100 text-stone-500'}`}>
                             <Banknote className="h-5 w-5" />
                        </div>
                         <div className="text-left">
                            <span className="block font-bold text-stone-900">Pay on Delivery</span>
                            <span className="text-xs text-stone-500">Cash / Card</span>
                        </div>
                        <div className={`ml-auto h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-lime-500' : 'border-stone-300'}`}>
                            {paymentMethod === 'cod' && <div className="h-3 w-3 rounded-full bg-lime-500" />}
                        </div>
                    </button>
                 </div>

                 {paymentMethod === 'momo' && (
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 animate-[fadeIn_0.3s_ease-out]">
                         <label className="block text-sm font-bold text-stone-700 mb-2">Mobile Number</label>
                         <div className="flex gap-2">
                             <select className="rounded-xl border-stone-200 bg-white p-3 text-sm font-bold text-stone-900 focus:border-stone-900 focus:ring-stone-900">
                                <option>+256</option>
                                <option>+250</option>
                                <option>+254</option>
                             </select>
                             <input type="tel" placeholder="7XX XXX XXX" className="w-full rounded-xl border-stone-200 bg-white p-3 text-sm focus:border-stone-900 focus:ring-stone-900" />
                         </div>
                         <p className="mt-2 text-xs text-stone-500">You will receive a prompt on your phone to complete payment.</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-stone-900">Summary</h3>
            <div className="space-y-4 border-b border-stone-100 pb-6">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-between text-xl font-bold text-stone-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-8">
              {step === 'cart' ? (
                <Button fullWidth size="lg" className="rounded-full" onClick={() => setStep('checkout')}>Proceed to Checkout</Button>
              ) : (
                <Button fullWidth size="lg" className="rounded-full" onClick={handleCheckout} disabled={loading}>
                  {paymentMethod === 'momo' ? 'Pay Now' : 'Place Order'}
                </Button>
              )}
              {step === 'checkout' && (
                <button onClick={() => setStep('cart')} className="mt-4 w-full text-center text-sm font-medium text-stone-500 hover:text-stone-900">
                  Back to Basket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};