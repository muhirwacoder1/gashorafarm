import React from 'react';
import { Product, Farmer } from '../types';
import { Plus } from 'lucide-react';
import { FARMERS } from '../constants';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const farmer = FARMERS.find(f => f.id === product.farmerId);

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-300 group-hover:shadow-hover">
        {/* Padding for 'clean' look inside card like Image 2 */}
        <div className="absolute inset-4 overflow-hidden rounded-[1.5rem]">
            <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
        </div>
        
        {product.isOrganic && (
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center justify-center rounded-full bg-lime-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-900">
              Organic
            </span>
          </div>
        )}
        
        {/* Add Button - Expandable on Hover */}
        <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart && onAddToCart(product);
            }}
            className="absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg transition-all duration-300 hover:w-28 hover:bg-black active:scale-95 group/btn"
          >
            <Plus className="h-6 w-6 flex-shrink-0" />
            <span className="max-w-0 overflow-hidden font-poppins text-sm font-medium opacity-0 transition-all duration-300 group-hover/btn:max-w-[4rem] group-hover/btn:ml-2 group-hover/btn:opacity-100">
              Shop
            </span>
          </button>
      </Link>
      
      {/* Content */}
      <div className="mt-4 px-2">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-lg text-stone-900 group-hover:text-stone-600 transition-colors">
                {product.name}
                </h3>
            </Link>
            {farmer && (
                <p className="text-sm text-stone-500">{farmer.name}</p>
            )}
          </div>
          <div className="text-right">
             <p className="font-bold text-stone-900">${product.price.toFixed(2)}</p>
             <p className="text-xs text-stone-400">/{product.unit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};