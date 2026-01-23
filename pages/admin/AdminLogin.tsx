import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // Check if user is admin after login
            const storedUser = JSON.parse(localStorage.getItem('farmconnect_user') || '{}');
            if (storedUser.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                localStorage.removeItem('farmconnect_user');
                return;
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-stone-800 rounded-3xl shadow-2xl p-8 ring-1 ring-stone-700">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-red-900/50 rounded-2xl flex items-center justify-center mb-4">
                            <Shield className="h-8 w-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                        <p className="text-stone-400 mt-2">Restricted area. Authorized personnel only.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-600 bg-stone-700 text-white placeholder-stone-500 focus:border-red-500 focus:ring-2 focus:ring-red-900 transition-all"
                                    placeholder="admin@farmconnect.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-600 bg-stone-700 text-white placeholder-stone-500 focus:border-red-500 focus:ring-2 focus:ring-red-900 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" fullWidth size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Access Admin Panel'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-stone-500">
                        This is a restricted area. Unauthorized access attempts are logged.
                    </div>
                </div>
            </div>
        </div>
    );
};
