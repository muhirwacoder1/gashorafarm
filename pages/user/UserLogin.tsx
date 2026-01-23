import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Mail, Lock, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);

            // Get user from context after login - redirect based on role
            // Need to navigate after context updates
            setTimeout(() => {
                navigate('/profile');
            }, 100);
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
                    <h1 className="text-3xl font-bold text-stone-900">Welcome Back</h1>
                    <p className="text-stone-500 mt-2">Sign in to your account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-lime-600 font-semibold hover:text-lime-700">
                            Create Account
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-stone-100 pt-6">
                        <p className="text-center text-sm text-stone-500 mb-3">Other options</p>
                        <div className="space-y-2">
                            <Link to="/farmer/login" className="block text-center text-sm text-stone-600 hover:text-lime-600">
                                Sign in as Farmer →
                            </Link>
                            <Link to="/admin/login" className="block text-center text-sm text-stone-600 hover:text-lime-600">
                                Admin Login →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
