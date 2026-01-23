import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Package, Edit, Trash2, X, Plus } from 'lucide-react';
import { Button } from '../../components/Button';

const SUPPLY_CATEGORIES = ['Tools', 'Seeds', 'Fertilizers', 'Equipment', 'Pesticides'] as const;

export const AdminProducts: React.FC = () => {
    const supplies = useQuery(api.supplies.list) ?? [];
    const addSupply = useMutation(api.supplies.add);
    const deleteSupply = useMutation(api.supplies.remove);

    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tools' as typeof SUPPLY_CATEGORIES[number],
        price: '',
        unit: '',
        stock: '',
        imageUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addSupply({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: parseFloat(formData.price),
                unit: formData.unit,
                stock: parseInt(formData.stock),
                imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
                rating: 0,
                reviewsCount: 0,
            });

            setShowAddModal(false);
            setFormData({
                name: '',
                description: '',
                category: 'Tools',
                price: '',
                unit: '',
                stock: '',
                imageUrl: '',
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteSupply({ id });
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-stone-900">Admin Products</h1>
                    <p className="text-stone-500 mt-1">Manage tools, seeds, and equipment you supply to farmers</p>
                </div>
                <Button
                    className="bg-lime-500 hover:bg-lime-600 rounded-xl"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {supplies.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-12 text-center">
                    <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No Products Yet</h3>
                    <p className="text-stone-500 mb-6">Add your first product for farmers to purchase</p>
                    <Button
                        className="bg-lime-500 hover:bg-lime-600 rounded-xl"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Product
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Stock</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplies.map((product) => (
                                <tr key={product._id} className="border-b border-stone-100 hover:bg-stone-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-semibold text-stone-900">{product.name}</p>
                                                <p className="text-xs text-stone-500 line-clamp-1">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-stone-900">
                                        RWF {(product.price * 1300).toFixed(0)}
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">{product.stock} {product.unit}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                                                <Edit className="h-4 w-4 text-stone-600" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-stone-900">Add New Product</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-stone-100 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                    placeholder="e.g., Premium Garden Hoe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                    rows={3}
                                    placeholder="Describe the product..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                >
                                    {SUPPLY_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Price (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Unit</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                        placeholder="e.g., piece, kg, bag"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                    placeholder="100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Image URL (optional)</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="bg-lime-500 hover:bg-lime-600 rounded-xl"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
