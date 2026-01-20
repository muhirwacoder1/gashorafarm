import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBasket, Calendar, Check, Leaf } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, FARMERS } from '../constants'; // Still need FARMERS, but products come from store now to reflect additions
import { useStore } from '../App';

export const Home: React.FC = () => {
  const { addToCart, state } = useStore();
  const featuredProducts = state.products.slice(0, 4);

  return (
    <div className="pb-20 pt-32">
      {/* Massive Typographic Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        
        {/* Header Controls (Mocking the top bar from image 1) */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             Harvest Season 2025
          </div>
          <Link to="/marketplace" className="group flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-stone-800">
            <Calendar className="h-4 w-4" />
            Seasonal Fruit
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* MASSIVE HEADLINE */}
        <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-stone-900 text-center uppercase mb-6 select-none">
          Local Farms
        </h1>

        {/* Hero Image Container */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2787&auto=format&fit=crop" 
            alt="Fresh green lettuce textures" 
            className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
          />
          
          {/* Dark Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Floating Product Cards (Simulating Image 1) */}
          <div className="absolute bottom-8 left-8 hidden md:flex gap-4">
             <div className="h-32 w-32 rounded-2xl bg-white p-2 shadow-xl transition-transform hover:-translate-y-2 duration-300">
                <div className="h-full w-full overflow-hidden rounded-xl bg-stone-100">
                   <img src={PRODUCTS[1].imageUrl} className="h-full w-full object-cover" alt="" />
                </div>
             </div>
             <div className="h-32 w-32 rounded-2xl bg-white p-2 shadow-xl transition-transform hover:-translate-y-2 duration-300 delay-75">
                <div className="h-full w-full overflow-hidden rounded-xl bg-stone-100">
                   <img src={PRODUCTS[0].imageUrl} className="h-full w-full object-cover" alt="" />
                </div>
             </div>
          </div>

          {/* Editorial Text Overlay */}
          <div className="absolute bottom-8 right-8 max-w-md text-right text-white hidden md:block">
            <p className="text-lg font-medium leading-relaxed drop-shadow-md">
              Picked this morning, brought straight to your table for maximum freshness. Contribute directly to the livelihood of nearby farming communities.
            </p>
          </div>
        </div>

        {/* Bottom Bar / Sticky CTA */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-stone-200 pt-6">
           <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-500">
              <span>2025</span>
              <span className="h-1 w-1 rounded-full bg-stone-300"></span>
              <span className="text-stone-900">Awarded Fruit & Veg Brand</span>
              <ArrowUpRight className="h-4 w-4" />
           </div>

           <div className="flex items-center gap-4">
             <Link to="/marketplace">
                <Button variant="lime" size="xl" className="group gap-3">
                   <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-lime-400">
                     <ShoppingBasket className="h-4 w-4" />
                   </span>
                   Order Now
                   <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Button>
             </Link>
             <Button variant="outline" size="xl" className="rounded-full px-8">
               What's New This Week
             </Button>
           </div>
        </div>
      </section>

      {/* Editorial Mission Section (Refined) */}
      <section className="bg-white py-24 sm:py-32 mt-20 rounded-t-[3rem]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-600 mb-6">
                   <Leaf className="h-3 w-3" /> Sustainable Farming
                </span>
                <h2 className="text-5xl font-bold tracking-tight text-stone-900 sm:text-7xl font-serif leading-tight">
                   Cultivating with Care <br/>
                   <span className="italic text-stone-500 font-normal">on Regenerative Land</span>
                </h2>
                <p className="mt-8 text-xl leading-8 text-stone-600">
                   We partner exclusively with farmers who prioritize soil health, biodiversity, and ethical labor practices. Every purchase supports a system that gives back to the earth.
                </p>
            </div>
            
            {/* Image Aspect ratio adjusted for Mobile (4/3) vs Desktop (2.35/1) */}
            <div className="relative mx-auto max-w-6xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.35/1] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-default">
               <img 
                 src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2672&auto=format&fit=crop" 
                 alt="Farmer in wheat field" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5"></div>
               
               {/* Interactive Hotspot 1 */}
               <div className="absolute top-1/3 left-[25%] group/spot z-10">
                  <div className="relative flex items-center justify-center h-8 w-8 cursor-pointer">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-white ring-4 ring-black/10 transition-transform group-hover/spot:scale-125"></span>
                  </div>
                  {/* Tooltip Card */}
                  <div className="absolute left-1/2 -translate-x-1/2 mt-4 opacity-0 translate-y-2 pointer-events-none group-hover/spot:opacity-100 group-hover/spot:translate-y-0 group-hover/spot:pointer-events-auto transition-all duration-300">
                     <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl w-40 text-center ring-1 ring-stone-900/5">
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-stone-100 mb-2">
                           <img src={PRODUCTS[2].imageUrl} className="h-full w-full object-cover" alt="" />
                        </div>
                        <p className="font-bold text-xs text-stone-900 truncate">{PRODUCTS[2].name}</p>
                        <p className="text-[10px] font-bold text-green-600">Verified Organic</p>
                     </div>
                  </div>
               </div>

               {/* Interactive Hotspot 2 */}
               <div className="absolute bottom-1/3 right-[30%] group/spot z-10">
                  <div className="relative flex items-center justify-center h-8 w-8 cursor-pointer">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-white ring-4 ring-black/10 transition-transform group-hover/spot:scale-125"></span>
                  </div>
                  {/* Tooltip Card */}
                  <div className="absolute left-1/2 -translate-x-1/2 mb-12 bottom-0 w-40 opacity-0 translate-y-2 pointer-events-none group-hover/spot:opacity-100 group-hover/spot:translate-y-0 group-hover/spot:pointer-events-auto transition-all duration-300">
                     <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl text-center ring-1 ring-stone-900/5">
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-stone-100 mb-2">
                           <img src={PRODUCTS[12].imageUrl} className="h-full w-full object-cover" alt="" />
                        </div>
                        <p className="font-bold text-xs text-stone-900 truncate">{PRODUCTS[12].name}</p>
                        <p className="text-[10px] font-bold text-amber-600">Fresh Harvest</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* Fresh Picks Grid */}
      <section className="bg-stone-50 py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
               <div>
                  <h3 className="text-4xl font-bold text-stone-900">This Week's Fresh Picks</h3>
                  <p className="mt-2 text-stone-500">Harvested within the last 24 hours.</p>
               </div>
               <Link to="/marketplace" className="hidden sm:block">
                  <Button variant="outline">View All Products</Button>
               </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
               {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
               ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
                <Button variant="outline" fullWidth>View All Products</Button>
            </div>
         </div>
      </section>

      {/* Yellow/Lime Feature Section (Image 2) */}
      <section className="bg-lime-400 py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
               <span className="font-bold tracking-widest text-stone-900 uppercase text-xs">Call to Action</span>
               <h2 className="mt-4 text-4xl font-bold text-stone-900 sm:text-5xl">Your trusted partner in fresh produce.</h2>
               <p className="mt-6 text-lg text-stone-800 font-medium">
                  Experience the freshness firsthand—pick your own fruits and vegetables directly from our fields, with flexible options to suit your needs.
               </p>
               <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/40 p-6 backdrop-blur-sm text-left">
                     <div className="h-10 w-10 rounded-full bg-stone-900 flex items-center justify-center text-white mb-4">
                        <Check className="h-5 w-5" />
                     </div>
                     <h4 className="font-bold text-stone-900">Verified Quality</h4>
                     <p className="text-sm text-stone-800 mt-1">Every item checked.</p>
                  </div>
                  <div className="rounded-2xl bg-white/40 p-6 backdrop-blur-sm text-left">
                     <div className="h-10 w-10 rounded-full bg-stone-900 flex items-center justify-center text-white mb-4">
                        <Check className="h-5 w-5" />
                     </div>
                     <h4 className="font-bold text-stone-900">Local Support</h4>
                     <p className="text-sm text-stone-800 mt-1">Direct to farmers.</p>
                  </div>
                  <div className="rounded-2xl bg-white/40 p-6 backdrop-blur-sm text-left">
                     <div className="h-10 w-10 rounded-full bg-stone-900 flex items-center justify-center text-white mb-4">
                        <Check className="h-5 w-5" />
                     </div>
                     <h4 className="font-bold text-stone-900">Eco Friendly</h4>
                     <p className="text-sm text-stone-800 mt-1">Sustainable boxes.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};