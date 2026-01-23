import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { User, Mail, Lock, Phone, Camera, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const UserRegister: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        profileImageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: 'user',
            });

            navigate('/profile');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-stone-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-500 rounded-2xl mb-4">
                        <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900">Create Account</h1>
                    <p className="text-stone-500 mt-2">Join GashoraFarm marketplace</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Profile Photo (Optional) */}
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                {formData.profileImageUrl ? (
                                    <img
                                        src={formData.profileImageUrl}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-lime-100"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center border-4 border-stone-50">
                                        <User className="h-10 w-10 text-stone-400" />
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-lime-600 transition-colors">
                                    <Camera className="h-4 w-4 text-white" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, profileImageUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-stone-400 mt-2">Profile photo (optional)</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Phone (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="tel"
                                    placeholder="07X XXX XXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="password"
                                    required
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            className="rounded-xl bg-lime-500 hover:bg-lime-600"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-lime-600 font-semibold hover:text-lime-700">
                            Sign In
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/farmer/register" className="text-sm text-stone-500 hover:text-stone-700">
                            Want to sell products? Register as a Farmer →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
