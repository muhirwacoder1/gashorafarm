import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CheckCircle, XCircle, User, Package, Phone, CreditCard, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../components/Button';

export const AdminApprovals: React.FC = () => {
    const pendingOrders = useQuery(api.orders.getByStatus, { status: 'Pending' }) ?? [];
    const pendingFarmers = useQuery(api.farmers.getPending) ?? [];
    const updateOrderStatus = useMutation(api.orders.updateStatus);
    const verifyFarmer = useMutation(api.farmers.verifyFarmer);

    const [activeTab, setActiveTab] = useState<'orders' | 'farmers'>('orders');
    const [processing, setProcessing] = useState<string | null>(null);

    const handleApproveOrder = async (orderId: any) => {
        setProcessing(orderId);
        try {
            await updateOrderStatus({ id: orderId, status: 'Confirmed' });
        } catch (error) {
            console.error('Error approving order:', error);
        } finally {
            setProcessing(null);
        }
    };

    const handleApproveFarmer = async (farmerId: any) => {
        setProcessing(farmerId);
        try {
            await verifyFarmer({ farmerId });
        } catch (error) {
            console.error('Error approving farmer:', error);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-stone-900">Approvals</h1>
                    <p className="text-stone-500 mt-2">Review and approve pending orders and farmer registrations</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-stone-200">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'orders'
                                ? 'text-lime-600 border-b-2 border-lime-600'
                                : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Pending Orders
                        {pendingOrders.length > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                                {pendingOrders.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('farmers')}
                        className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'farmers'
                                ? 'text-lime-600 border-b-2 border-lime-600'
                                : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Pending Farmers
                        {pendingFarmers.length > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                                {pendingFarmers.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Pending Orders */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {pendingOrders.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center">
                                <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-stone-900 mb-2">No Pending Orders</h3>
                                <p className="text-stone-500">All orders have been reviewed</p>
                            </div>
                        ) : (
                            pendingOrders.map((order) => (
                                <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-stone-900">Order #{order._id.slice(-6)}</h3>
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                    Pending Approval
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-stone-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {order.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="h-4 w-4" />
                                                    {order.items.length} items
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-stone-500">Total</p>
                                            <p className="text-2xl font-bold text-lime-600">
                                                RWF {(order.total * 1300).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="bg-stone-50 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-lime-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-stone-700">Delivery Address</p>
                                                <p className="text-sm text-stone-600 mt-1">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Package className="h-5 w-5 text-lime-600" />
                                            <p className="text-sm text-stone-600">
                                                Payment: <span className="font-semibold">{order.paymentMethod}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-stone-900">{item.name}</p>
                                                    <p className="text-sm text-stone-500">{item.quantity}x {item.unit}</p>
                                                </div>
                                                <p className="font-bold text-stone-900">
                                                    RWF {((item.price * item.quantity) * 1300).toFixed(0)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Approve Button */}
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleApproveOrder(order._id)}
                                            disabled={processing === order._id}
                                            className="flex-1 bg-lime-500 hover:bg-lime-600 rounded-xl"
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            {processing === order._id ? 'Approving...' : 'Approve Order'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pending Farmers */}
                {activeTab === 'farmers' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingFarmers.length === 0 ? (
                            <div className="col-span-2 bg-white rounded-3xl p-12 text-center">
                                <User className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-stone-900 mb-2">No Pending Farmers</h3>
                                <p className="text-stone-500">All farmer registrations have been reviewed</p>
                            </div>
                        ) : (
                            pendingFarmers.map((farmer) => (
                                <div key={farmer._id} className="bg-white rounded-3xl p-6 shadow-sm">
                                    {/* Farmer Image */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={farmer.imageUrl}
                                            alt={farmer.name}
                                            className="w-20 h-20 rounded-2xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-stone-900 mb-1">{farmer.name}</h3>
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                Pending Verification
                                            </span>
                                        </div>
                                    </div>

                                    {/* Farmer Details */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPin className="h-4 w-4 text-lime-600" />
                                            <span className="text-stone-600">{farmer.location}</span>
                                        </div>
                                        {farmer.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-lime-600" />
                                                <span className="text-stone-600">{farmer.phone}</span>
                                            </div>
                                        )}
                                        {farmer.idNumber && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <CreditCard className="h-4 w-4 text-lime-600" />
                                                <span className="text-stone-600">ID: {farmer.idNumber}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="h-4 w-4 text-lime-600" />
                                            <span className="text-stone-600">Joined: {farmer.joinedDate}</span>
                                        </div>
                                    </div>

                                    {/* Approve Button */}
                                    <Button
                                        onClick={() => handleApproveFarmer(farmer._id)}
                                        disabled={processing === farmer._id}
                                        fullWidth
                                        className="bg-lime-500 hover:bg-lime-600 rounded-xl"
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        {processing === farmer._id ? 'Verifying...' : 'Verify Farmer'}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
