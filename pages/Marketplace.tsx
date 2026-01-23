import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { CATEGORIES } from '../constants';
import { useStore } from '../App';
import { Id } from '../convex/_generated/dataModel';

export const Marketplace: React.FC = () => {
  const { addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [showFilter, setShowFilter] = useState(true);
  const lastScrollY = useRef(0);

  // Fetch products and farmers from Convex
  const products = useQuery(api.products.list, {}) ?? [];
  const farmers = useQuery(api.farmers.list) ?? [];

  // Get selected farmer details
  const selectedFarmer = farmers.find(f => f._id === selectedFarmerId);

  // Sync with URL params (category and farmer)
  useEffect(() => {
    const cat = searchParams.get('category');
    const farmerId = searchParams.get('farmer');
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
    if (farmerId) {
      setSelectedFarmerId(farmerId);
    } else {
      setSelectedFarmerId(null);
    }
  }, [searchParams]);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowFilter(false); // Scrolling down
      } else {
        setShowFilter(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesFarmer = !selectedFarmerId || product.farmerId === selectedFarmerId;
      return matchesSearch && matchesCategory && matchesFarmer;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
    });
  }, [searchTerm, selectedCategory, selectedFarmerId, sortBy, products]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  // Loading state
  if (products === undefined) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-500">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-stone-500">The Collection</span>
          <h1 className="mt-2 text-5xl font-black tracking-tight text-stone-900 sm:text-6xl uppercase">Marketplace</h1>
        </div>

        {/* Farmer Filter Banner */}
        {selectedFarmer && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-lime-50 border-2 border-lime-200 p-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedFarmer.imageUrl}
                alt={selectedFarmer.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-lime-300"
              />
              <div>
                <p className="text-sm text-lime-700">Viewing products from</p>
                <p className="font-bold text-stone-900">{selectedFarmer.name}</p>
              </div>
            </div>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 border border-stone-200 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear Filter
            </Link>
          </div>
        )}

        {/* Controls Container - Sticky with hide on scroll */}
        <div className={`sticky top-24 z-40 mb-10 rounded-3xl bg-white/80 p-4 shadow-soft backdrop-blur-md ring-1 ring-stone-900/5 transition-all duration-300 ${showFilter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search fresh produce..."
                className="block w-full rounded-full border-0 bg-stone-100 py-3 pl-11 pr-4 text-stone-900 placeholder:text-stone-500 focus:ring-2 focus:ring-inset focus:ring-stone-900 sm:text-sm sm:leading-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none rounded-full bg-stone-100 py-3 pl-6 pr-10 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-stone-900 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Fresh Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all ${selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-lg'
                  : 'bg-white text-stone-500 hover:bg-stone-100 ring-1 ring-stone-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-stone-100">
                <Search className="h-10 w-10 text-stone-300" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900">No products found</h3>
              <p className="mt-2 text-stone-500">We couldn't find what you're looking for.</p>
              <Button variant="outline" className="mt-8" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};