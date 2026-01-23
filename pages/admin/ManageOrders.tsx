import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Check, Truck, Package } from 'lucide-react';
import { Button } from '../../components/Button';

export const ManageOrders: React.FC = () => {
    const orders = useQuery(api.orders.list) ?? [];
    const updateOrderStatus = useMutation(api.orders.updateStatus);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'On the way': return 'bg-blue-100 text-blue-800';
            case 'Packed': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-stone-200 text-stone-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = async (orderId: any, newStatus: 'Confirmed' | 'Packed' | 'On the way' | 'Delivered') => {
        try {
            await updateOrderStatus({ id: orderId, status: newStatus });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Loading state
    if (orders === undefined) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900 mx-auto"></div>
                    <p className="mt-4 text-stone-500">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link to="/farmer/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-black text-stone-900 uppercase mb-8">Order Management</h1>

                {orders.length === 0 ? (
                    <div className="rounded-3xl bg-white p-20 text-center shadow-sm">
                        <Package className="mx-auto h-16 w-16 text-stone-300" />
                        <h3 className="mt-4 text-xl font-bold text-stone-900">No active orders</h3>
                        <p className="text-stone-500">New orders will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100 transition-all hover:shadow-md">
                                {/* Header - Stack on mobile */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 bg-stone-50/50 px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-sm font-bold text-stone-500">#{order._id.slice(-8)}</span>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-stone-500">{order.date}</span>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3">Items</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="font-medium text-stone-900 line-clamp-1">{item.quantity}x {item.name}</span>
                                                    <span className="text-stone-500 shrink-0 ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 border-t border-stone-100 pt-4 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">Delivery To</h4>
                                        <p className="text-stone-900 font-medium">{order.deliveryAddress}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {order.status === 'Confirmed' && (
                                            <>
                                                <Button size="sm" onClick={() => handleStatusUpdate(order._id, 'Packed')} className="rounded-full bg-stone-900 text-white">
                                                    Mark as Packed
                                                </Button>
                                                <Button size="sm" variant="outline" className="rounded-full text-red-500 border-red-200 hover:bg-red-50">
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'Packed' && (
                                            <Button size="sm" onClick={() => handleStatusUpdate(order._id, 'On the way')} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
                                                <Truck className="mr-2 h-4 w-4" /> Ship Order
                                            </Button>
                                        )}
                                        {order.status === 'On the way' && (
                                            <Button size="sm" onClick={() => handleStatusUpdate(order._id, 'Delivered')} className="rounded-full bg-green-600 text-white hover:bg-green-700">
                                                <Check className="mr-2 h-4 w-4" /> Confirm Delivery
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};