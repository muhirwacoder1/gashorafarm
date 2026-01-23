import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';

export const MarketplaceControl: React.FC = () => {
    const products = useQuery(api.products.list, {}) ?? [];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900">Marketplace Control</h1>
                <p className="text-stone-500 mt-1">Oversee all farmer-listed products</p>
            </div>

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
                        {products.map((product) => (
                            <tr key={product._id} className="border-b border-stone-100">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-semibold text-stone-900">{product.name}</p>
                                            {product.isOrganic && (
                                                <span className="text-xs text-lime-600">Organic</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-stone-900">
                                    RWF {(product.price * 1300).toFixed(0)}
                                </td>
                                <td className="px-6 py-4 text-stone-600">{product.stock} {product.unit}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-lime-50 rounded-lg transition-colors" title="Feature">
                                            <Star className="h-4 w-4 text-lime-600" />
                                        </button>
                                        <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors" title="Hide">
                                            <EyeOff className="h-4 w-4 text-stone-600" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
