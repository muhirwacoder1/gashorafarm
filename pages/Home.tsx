import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Plus, CheckCircle2, Wheat, Apple, Milk, Sprout, Star } from 'lucide-react';
import { useStore } from '../App';
import { FARMERS, PRODUCTS } from '../constants';

export const Home: React.FC = () => {
  const { addToCart, state } = useStore();
  
  // Select specific products to match the feel of the image
  // We want: Carrots (p1), Strawberries/Fruits (p5), Eggs (p9), Spinach/Greens (p2), Peaches (p17), Blueberries (p16)
  const showcaseProductIds = ['p1', 'p5', 'p9', 'p2', 'p17', 'p16'];
  const showcaseProducts = state.products.filter(p => showcaseProductIds.includes(p.id));
  
  // If we don't have enough matches from the filter, just fill with others
  const displayProducts = showcaseProducts.length >= 6 
    ? showcaseProducts 
    : [...showcaseProducts, ...state.products.filter(p => !showcaseProductIds.includes(p.id))].slice(0, 6);

  const categories = [
    { name: 'Vegetables', icon: Leaf },
    { name: 'Fruits', icon: Apple },
    { name: 'Herbs', icon: Sprout },
    { name: 'Grains', icon: Wheat },
    { name: 'Dairy', icon: Milk },
  ];

  const featuredFarmers = FARMERS.slice(0, 3); // Take first 3 farmers

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
            Fresh food, directly <br/> from farmers you trust
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
             const farmer = FARMERS.find(f => f.id === product.farmerId);
             
             return (
              <div key={product.id} className="group relative flex flex-col rounded-3xl bg-white p-3 shadow-sm transition-all hover:shadow-lg">
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
                      addToCart(product);
                    }}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#658530] text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col pt-4 px-2 pb-2">
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    <Link to={`/product/${product.id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  
                  <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-stone-400" />
                    <span>{farmer?.name || 'Local Farm'}</span>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="font-serif text-2xl text-stone-900">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-stone-400">/ {product.unit}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3 w-3" />
                        <span>{farmer?.location.split(',')[0]} Farm</span>
                      </div>
                      <button 
                         onClick={() => addToCart(product)}
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


      {/* --- MEET OUR FARMERS --- */}
      <section className="bg-[#f0ece5] py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
               <h2 className="font-serif text-4xl text-stone-900">Meet Our Trusted Farmers</h2>
               <p className="mt-4 text-stone-600">Get to know the faces behind your food and see what makes their produce special.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
               {featuredFarmers.map((farmer, index) => (
                 <div key={farmer.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                       <img 
                        src={`https://images.unsplash.com/photo-${index === 0 ? '1507003211169-0a1dd7228f2d' : index === 1 ? '1605000797499-95a51c5269ae' : '1595273384588-439f03086412'}?q=80&w=800&auto=format&fit=crop`} 
                        alt={farmer.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                       />
                    </div>
                    <div className="p-6">
                       <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl text-stone-900">{farmer.name.split(' ')[0]} {farmer.name.split(' ')[1]}</h3>
                          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                             <Star className="h-3 w-3 fill-amber-700" />
                             {farmer.rating}
                          </div>
                       </div>
                       <p className="mt-1 text-sm text-stone-500">{farmer.location}</p>
                       
                       <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                          <span className="text-xs font-semibold text-stone-400">Joined {new Date(farmer.joinedDate).getFullYear()}</span>
                          <Link to={`/marketplace`} className="text-xs font-bold text-[#5c703a] hover:underline">
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