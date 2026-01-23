import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ArrowRight, Leaf, MapPin, Plus, CheckCircle2, Wheat, Apple, Milk, Sprout, Star } from 'lucide-react';
import { useStore } from '../App';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { addToCart } = useStore();
  const { isFarmer } = useAuth();
  const navigate = useNavigate();

  // Redirect farmers to their dashboard - they shouldn't see the Home page
  useEffect(() => {
    if (isFarmer) {
      navigate('/farmer/dashboard');
    }
  }, [isFarmer, navigate]);

  // Fetch data from Convex
  const products = useQuery(api.products.list, {}) ?? [];
  const farmers = useQuery(api.farmers.list) ?? [];

  // Select specific products to showcase
  const displayProducts = products.slice(0, 6);
  const featuredFarmers = farmers.slice(0, 3);

  const categories = [
    { name: 'Vegetables', icon: Leaf },
    { name: 'Fruits', icon: Apple },
    { name: 'Herbs', icon: Sprout },
    { name: 'Grains', icon: Wheat },
    { name: 'Dairy', icon: Milk },
  ];

  // Loading state
  if (products === undefined || farmers === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-500">Loading fresh produce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Farm landscape"
            className="h-full w-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-stone-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-tight text-white shadow-sm sm:text-7xl">
            Fresh food, directly <br /> from farmers you trust
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/90 drop-shadow-md">
            Discover locally grown vegetables, fruits, and more sourced straight from nearby farms to your table.
          </p>
          <div className="mt-10">
            <Link to="/marketplace">
              <button className="group flex items-center gap-2 rounded-full bg-[#3f4d27] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2f3a1d] shadow-xl">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* --- CATEGORY PILLS --- */}
      <section className="relative -mt-8 z-20 px-4">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${cat.name}`}
              className="flex items-center gap-2 rounded-full bg-[#f4f1ea] px-6 py-3 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl border border-[#eaddcf]"
            >
              <cat.icon className="h-4 w-4 text-[#5c703a]" />
              <span className="text-sm font-medium text-stone-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>


      {/* --- DISCOVER FRESH PRODUCE --- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl text-stone-900 sm:text-5xl">Discover Fresh Produce</h2>
          <p className="mt-4 text-stone-500">Get to know the faces behind your food and see what makes their produce special.</p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {displayProducts.map((product) => {
            const farmer = farmers.find(f => f._id === product.farmerId);

            return (
              <div key={product._id} className="group relative flex flex-col rounded-3xl bg-white p-3 shadow-sm transition-all hover:shadow-lg">
                {/* Image Area */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Plus Button on Image */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ productId: product._id, product, quantity: 1 });
                    }}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#658530] text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col pt-4 px-2 pb-2">
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    <Link to={`/product/${product._id}`}>
                      {product.name}
                    </Link>
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-stone-400" />
                    <span>{farmer?.name || 'Local Farm'}</span>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-stone-900">RWF {(product.price * 1300).toFixed(0)}</p>
                      <p className="text-xs text-stone-400">/ {product.unit}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3 w-3" />
                        <span>{farmer?.location.split(',')[0]} Farm</span>
                      </div>
                      <button
                        onClick={() => addToCart({ productId: product._id, product, quantity: 1 })}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3f4d27] text-white transition-colors hover:bg-[#2f3a1d]"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Link to="/marketplace">
            <button className="flex items-center gap-2 rounded-full border border-stone-300 bg-[#efece6] px-8 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-white hover:shadow-sm">
              Explore More Fresh Picks
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>


      {/* --- ARE YOU A FARMER? CTA --- */}
      <section className="py-20 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-4 py-2 text-lime-700 font-medium text-sm mb-6">
            <Leaf className="h-4 w-4" />
            Join Our Growing Community
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-6">
            Are you a Farmer?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10">
            Join FarmConnect and sell your fresh produce directly to local customers.
            No middlemen, fair prices, and a community that values quality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/farmer/register">
              <button className="group flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-lime-600 shadow-lg hover:shadow-xl">
                Start Selling Today
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/farmer/login">
              <button className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-stone-700 transition-all hover:bg-stone-50 shadow-md ring-1 ring-stone-200">
                Already a farmer? Sign in
              </button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-lime-500" />
              Free to join
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-lime-500" />
              Direct sales to customers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-lime-500" />
              Manage orders easily
            </div>
          </div>
        </div>
      </section>


      {/* --- MEET OUR FARMERS --- */}
      <section className="bg-[#f0ece5] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl text-stone-900">Meet Our Trusted Farmers</h2>
            <p className="mt-4 text-stone-600">Get to know the faces behind your food and see what makes their produce special.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredFarmers.map((farmer) => (
              <div key={farmer._id} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={farmer.imageUrl}
                    alt={farmer.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-stone-900">{farmer.name}</h3>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                      <Star className="h-3 w-3 fill-amber-700" />
                      {farmer.rating}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{farmer.location}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="text-xs font-semibold text-stone-400">Joined {new Date(farmer.joinedDate).getFullYear()}</span>
                    <Link to={`/marketplace?farmer=${farmer._id}`} className="text-xs font-bold text-[#5c703a] hover:underline">
                      View Produce
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};