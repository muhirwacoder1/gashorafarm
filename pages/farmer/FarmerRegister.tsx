import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, MapPin, ArrowLeft, Phone, CreditCard } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../../components/Button';
import { ImageUpload } from '../../components/ImageUpload';
import { useAuth } from '../../contexts/AuthContext';

export const FarmerRegister: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        phone: '',
        idNumber: '',
        imageUrl: '',
    });
    const [imageStorageId, setImageStorageId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUploaded = (storageId: string, url: string) => {
        setImageStorageId(storageId);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
    };

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
        setError(''); // Clear previous errors

        try {
            await register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: 'farmer',
                farmerData: {
                    location: formData.location,
                    phone: formData.phone || undefined,
                    idNumber: formData.idNumber || undefined,
                    imageUrl: formData.imageUrl || undefined,
                },
            });
            navigate('/farmer/dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMessage = err.message || err.toString() || 'Registration failed';

            // Check if it's a duplicate email error
            if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
                setError('This email is already registered. Please use a different email or sign in instead.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Section with Gradient */}
                    <div className="bg-gradient-to-r from-lime-500 to-green-500 px-8 py-10 text-white">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                                <Leaf className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center">Become a Farmer</h1>
                        <p className="text-lime-50 text-center mt-2">Join our community and sell your produce directly to customers</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex justify-center pb-6 border-b border-stone-100">
                                <div className="text-center">
                                    <ImageUpload
                                        onImageUploaded={handleImageUploaded}
                                        aspectRatio="square"
                                        placeholder="Upload farm photo"
                                        className="w-32 mx-auto"
                                    />
                                    <p className="text-xs text-stone-400 mt-3">Optional - Add a photo of your farm</p>
                                </div>
                            </div>

                            {/* Two Column Layout for Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Farm Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Farm Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="Green Valley Farm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="City, District"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="+250 XXX XXX XXX"
                                        />
                                    </div>
                                </div>

                                {/* ID Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        ID Number
                                    </label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="text"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="National ID Number"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="farmer@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Empty div for spacing */}
                                <div className="hidden md:block"></div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="text-xs text-stone-400 mt-1">At least 6 characters</p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all font-medium"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-stone-100">
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    className="rounded-xl bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 shadow-lg font-semibold text-lg py-4"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Account...
                                        </span>
                                    ) : 'Create Farmer Account'}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-stone-500 border-t border-stone-100 pt-6">
                            Already have an account?{' '}
                            <Link to="/farmer/login" className="font-semibold text-lime-600 hover:text-lime-700 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
