import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { Button } from '../components/Button';
import { useStore } from '../App';
import { useNavigate } from 'react-router-dom';

const SUPPLY_CATEGORIES = ['All', 'Tools', 'Seeds', 'Fertilizers', 'Equipment', 'Pesticides'];

export const Supplies: React.FC = () => {
    const supplies = useQuery(api.supplies.list) ?? [];
    const { addToCart } = useStore();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

    // Filter and sort supplies
    const filteredSupplies = supplies
        .filter(supply => {
            const matchesSearch = supply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supply.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || supply.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return a.name.localeCompare(b.name);
        });

    const handleAddToCart = (supply: any) => {
        addToCart({
            productId: supply._id,
            product: {
                _id: supply._id,
                name: supply.name,
                price: supply.price,
                unit: supply.unit,
                imageUrl: supply.imageUrl,
                farmerId: '' as any, // Supplies don't have farmers
                category: supply.category as any,
                description: supply.description,
                stock: supply.stock,
                isOrganic: false,
                harvestDate: '',
                rating: supply.rating,
                reviewsCount: supply.reviewsCount,
                _creationTime: 0,
            },
            quantity: 1,
        });
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-stone-900 uppercase mb-3">
                        Farm Supplies
                    </h1>
                    <p className="text-stone-500 text-lg">
                        Quality tools, seeds, and equipment for your farm
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search supplies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border-stone-200 bg-white pl-12 pr-4 py-4 font-medium shadow-sm focus:border-stone-900 focus:ring-stone-900"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2">
                            {SUPPLY_CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${selectedCategory === category
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-white text-stone-600 hover:bg-stone-100 ring-1 ring-stone-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="ml-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="rounded-full border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <p className="mb-6 text-sm font-medium text-stone-500">
                    {filteredSupplies.length} {filteredSupplies.length === 1 ? 'item' : 'items'} found
                </p>

                {/* Supplies Grid */}
                {filteredSupplies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Filter className="h-16 w-16 text-stone-300 mb-4" />
                        <h3 className="text-xl font-bold text-stone-900 mb-2">No supplies found</h3>
                        <p className="text-stone-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSupplies.map((supply) => (
                            <div
                                key={supply._id}
                                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100 transition-all hover:shadow-lg hover:ring-stone-200"
                            >
                                {/* Image */}
                                <div className="aspect-square overflow-hidden bg-stone-100">
                                    <img
                                        src={supply.imageUrl}
                                        alt={supply.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-3">
                                        <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                                            {supply.category}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 text-lg font-bold text-stone-900 line-clamp-1">
                                        {supply.name}
                                    </h3>

                                    <p className="mb-4 text-sm text-stone-500 line-clamp-2">
                                        {supply.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-black text-stone-900">
                                                RWF {(supply.price * 1300).toFixed(0)}
                                            </p>
                                            <p className="text-xs text-stone-400">per {supply.unit}</p>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => handleAddToCart(supply)}
                                            disabled={supply.stock === 0}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                            {supply.stock === 0 ? 'Out of Stock' : 'Add'}
                                        </Button>
                                    </div>

                                    {supply.stock > 0 && supply.stock < 10 && (
                                        <p className="mt-3 text-xs font-medium text-orange-600">
                                            Only {supply.stock} left in stock!
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
