import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

export const FarmerLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/farmer/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="bg-white rounded-3xl shadow-xl p-8 ring-1 ring-stone-100">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-lime-100 rounded-2xl flex items-center justify-center mb-4">
                            <Leaf className="h-8 w-8 text-lime-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900">Farmer Login</h1>
                        <p className="text-stone-500 mt-2">Welcome back! Sign in to manage your farm.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100 transition-all"
                                    placeholder="farmer@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" fullWidth size="lg" className="rounded-xl bg-lime-500 hover:bg-lime-600" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-500">
                        Don't have an account?{' '}
                        <Link to="/farmer/register" className="font-semibold text-lime-600 hover:text-lime-700">
                            Register as Farmer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
