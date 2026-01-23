import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Package, Filter } from 'lucide-react';

export const OrderManagement: React.FC = () => {
    const allOrders = useQuery(api.orders.list) ?? [];
    const updateStatus = useMutation(api.orders.updateStatus);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrders = statusFilter === 'all'
        ? allOrders
        : allOrders.filter(order => order.status === statusFilter);

    const handleStatusChange = async (orderId: any, newStatus: any) => {
        try {
            await updateStatus({ id: orderId, status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            'Pending': 'bg-amber-100 text-amber-700',
            'Confirmed': 'bg-blue-100 text-blue-700',
            'Packed': 'bg-purple-100 text-purple-700',
            'On the way': 'bg-orange-100 text-orange-700',
            'Delivered': 'bg-green-100 text-green-700',
        };
        return colors[status] || 'bg-stone-100 text-stone-700';
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900">Order Management</h1>
                <p className="text-stone-500 mt-1">View and manage all orders</p>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
                {['all', 'Pending', 'Confirmed', 'Packed', 'On the way', 'Delivered'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${statusFilter === status
                                ? 'bg-lime-500 text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900">Order #{order._id.slice(-6)}</h3>
                                <p className="text-sm text-stone-500">{order.date} • {order.items.length} items</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-lime-600">RWF {(order.total * 1300).toFixed(0)}</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Packed">Packed</option>
                                    <option value="On the way">On the way</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-stone-50 rounded-xl p-4 mb-4">
                            <p className="text-sm font-semibold text-stone-700 mb-1">Delivery Address</p>
                            <p className="text-sm text-stone-600">{order.deliveryAddress}</p>
                            <p className="text-xs text-stone-500 mt-2">Payment: {order.paymentMethod}</p>
                        </div>

                        <div className="space-y-2">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-stone-900">{item.name}</p>
                                        <p className="text-sm text-stone-500">{item.quantity}x {item.unit}</p>
                                    </div>
                                    <p className="font-bold text-stone-900">RWF {((item.price * item.quantity) * 1300).toFixed(0)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
