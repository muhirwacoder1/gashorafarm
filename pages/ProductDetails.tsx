import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { MapPin, Star, Calendar, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useStore } from '../App';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);

  // Fetch product and farmers from Convex
  const products = useQuery(api.products.list, {}) ?? [];
  const farmers = useQuery(api.farmers.list) ?? [];

  // Find product by _id
  const product = products.find(p => p._id === id);
  const farmer = product ? farmers.find(f => f._id === product.farmerId) : null;

  // Loading state
  if (products === undefined || farmers === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center pt-24">Product not found</div>;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/marketplace" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Market
        </Link>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Image - Takes up more space */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-stone-100">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Info - Sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-700">{product.category}</span>
                  {product.isOrganic && <Badge variant="success">Organic</Badge>}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-stone-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-stone-900">{product.rating}</span>
                  <span className="text-stone-400">• {product.reviewsCount} reviews</span>
                </div>
              </div>

              <div className="mb-8 border-y border-stone-100 py-6">
                <p className="text-lg leading-relaxed text-stone-600">{product.description}</p>
              </div>

              <div className="mb-8 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-stone-900">RWF {(product.price * 1300).toFixed(0)}</span>
                  <span className="text-lg text-stone-500">/ {product.unit}</span>
                </div>
                <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-700' : 'text-amber-600'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-8 flex gap-4">
                <div className="flex items-center rounded-full border border-stone-200 bg-white px-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-12 w-10 items-center justify-center text-stone-500 hover:text-stone-900"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-12 w-8 items-center justify-center font-bold text-stone-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="flex h-12 w-10 items-center justify-center text-stone-500 hover:text-stone-900"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button size="lg" className="flex-1 rounded-full text-lg" onClick={handleAddToCart}>
                  Add to Basket
                </Button>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  {farmer && <img src={farmer.imageUrl} alt={farmer.name} className="h-12 w-12 rounded-full object-cover" />}
                  <div>
                    <p className="text-sm font-medium text-stone-500">Grown by</p>
                    <p className="font-bold text-stone-900">{farmer?.name}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <MapPin className="h-4 w-4 text-stone-400" />
                    <span>{farmer?.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <Calendar className="h-4 w-4 text-stone-400" />
                    <span>Harvested {product.harvestDate}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};