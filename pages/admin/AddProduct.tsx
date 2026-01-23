import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '../../components/Button';
import { ImageUpload } from '../../components/ImageUpload';
import { CATEGORIES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addProduct = useMutation(api.products.add);
  const farmers = useQuery(api.farmers.list) ?? [];
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock: '',
    harvestDate: '',
    imageUrl: '',
    isOrganic: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isOrganic: !prev.isOrganic }));
  };

  const handleImageUploaded = (storageId: string, url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the logged-in farmer's ID or default to first farmer
      const farmerId = user?.farmerId || farmers[0]?._id;
      if (!farmerId) {
        alert('No farmer account found. Please log in as a farmer.');
        setLoading(false);
        return;
      }

      // Use a default image if none uploaded
      const imageUrl = formData.imageUrl || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80';

      await addProduct({
        farmerId,
        name: formData.name,
        description: formData.description,
        category: formData.category as any,
        price: parseFloat(formData.price),
        unit: formData.unit,
        stock: parseInt(formData.stock),
        isOrganic: formData.isOrganic,
        harvestDate: formData.harvestDate || new Date().toISOString().split('T')[0],
        imageUrl,
        rating: 0,
        reviewsCount: 0
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link to="/farmer/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-black text-stone-900 uppercase mb-8">Add New Harvest</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <h3 className="mb-6 text-xl font-bold text-stone-900">Product Photo</h3>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImageUrl={formData.imageUrl}
              aspectRatio="landscape"
              placeholder="Upload product image"
              className="w-full max-w-md mx-auto"
            />
            <p className="text-xs text-stone-400 text-center mt-3">Add a beautiful photo of your produce to attract buyers</p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <h3 className="mb-6 text-xl font-bold text-stone-900">Basic Information</h3>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  placeholder="e.g. Heritage Carrots"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  placeholder="Describe the taste, texture, and best use..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Harvest Date</label>
                  <input
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <h3 className="mb-6 text-xl font-bold text-stone-900">Inventory & Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Price ($)</label>
                <input
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Unit</label>
                <input
                  required
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  placeholder="kg, bunch, box"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Stock Qty</label>
                <input
                  required
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  type="number"
                  className="w-full rounded-xl border-stone-200 bg-stone-50 p-3 font-medium focus:border-stone-900 focus:ring-stone-900"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={handleToggle}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isOrganic ? 'bg-lime-500' : 'bg-stone-200'}`}
              >
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isOrganic ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Leaf className="h-4 w-4" /> This produce is Organic
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link to="/farmer/dashboard">
              <Button type="button" variant="outline" size="lg" className="rounded-full">Cancel</Button>
            </Link>
            <Button type="submit" size="lg" disabled={loading} className="rounded-full w-40">
              {loading ? 'Publishing...' : 'Publish Item'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};