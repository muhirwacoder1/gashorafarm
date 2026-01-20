import React from 'react';
import { useStore } from '../App';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export const Orders: React.FC = () => {
  const { state } = useStore();
  const orders = state.orders.length > 0 ? state.orders : [];

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center pt-24">
        <Package className="mb-4 h-12 w-12 text-stone-300" />
        <h2 className="text-xl font-bold text-stone-900">No orders found</h2>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'On the way': return 'text-blue-600 bg-blue-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-stone-900">Order History</h1>
      
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Header - Stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 bg-stone-50/50 px-6 py-4">
               <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">#{order.id}</span>
                  <span className="text-stone-300">|</span>
                  <span className="text-sm text-stone-500">{order.date}</span>
               </div>
               <div className="self-start sm:self-auto">
                 <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
               </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-bold text-stone-400 shrink-0">{item.quantity}x</span>
                       <span className="font-medium text-stone-900 line-clamp-1">{item.name}</span>
                    </div>
                    <span className="text-stone-600 shrink-0 ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end border-t border-stone-50 pt-6">
                 <div className="text-right">
                    <span className="block text-xs text-stone-400 uppercase tracking-wide">Total</span>
                    <span className="text-xl font-bold text-stone-900">${order.total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};