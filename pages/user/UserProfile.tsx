import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { User, Mail, Phone, Camera, LogOut, ShoppingBag, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-stone-50">
                <div className="mx-auto max-w-2xl px-4 text-center">
                    <h1 className="text-3xl font-bold text-stone-900 mb-4">Please Sign In</h1>
                    <p className="text-stone-500 mb-6">You need to sign in to view your profile</p>
                    <Link to="/login">
                        <Button className="bg-lime-500 hover:bg-lime-600 rounded-xl">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="mx-auto max-w-2xl px-4">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            {user.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt={user.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-lime-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-lime-100 flex items-center justify-center border-4 border-lime-50">
                                    <User className="h-12 w-12 text-lime-600" />
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center hover:bg-lime-600 transition-colors">
                                <Camera className="h-4 w-4 text-white" />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900">{user.name}</h1>
                            <p className="text-stone-500">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                            <Mail className="h-5 w-5 text-lime-600" />
                            <div>
                                <p className="text-sm text-stone-500">Email</p>
                                <p className="font-medium text-stone-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                            <Phone className="h-5 w-5 text-lime-600" />
                            <div>
                                <p className="text-sm text-stone-500">Phone</p>
                                <p className="font-medium text-stone-900">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <Link to="/orders" className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                            <ShoppingBag className="h-5 w-5 text-lime-600" />
                            <span className="font-medium text-stone-900">My Orders</span>
                        </Link>
                        <button className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                            <Settings className="h-5 w-5 text-lime-600" />
                            <span className="font-medium text-stone-900">Settings</span>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        fullWidth
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Become a Farmer */}
                {user.role === 'user' && (
                    <div className="bg-gradient-to-r from-lime-500 to-green-500 rounded-3xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Want to sell your products?</h3>
                        <p className="text-lime-100 mb-4">Register as a farmer and start selling your fresh produce!</p>
                        <Link to="/farmer/register">
                            <Button className="bg-white text-lime-600 hover:bg-lime-50 rounded-xl">
                                Become a Farmer
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
