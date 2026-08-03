import React, { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { Trash2, Save, Plus, ChevronRight } from 'lucide-react';

export const EditProductPage = () => {
  const { products, categories, editingProductId, updateProduct, deleteProduct, setCurrentView } = useInventory();

  const product = products.find(p => p.id === editingProductId) || products[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [regularPrice, setRegularPrice] = useState('0.00');
  const [costPrice, setCostPrice] = useState('0.00');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setCategory(product.category || 'Electronics');
      setBrand(product.brand || 'LogiTech');
      setRegularPrice(product.sellingPrice ? product.sellingPrice.toFixed(2) : '59.99');
      setCostPrice(product.buyingPrice ? product.buyingPrice.toFixed(2) : '24.50');
      setSku(product.sku || 'SKU-WM902');
      setBarcode(product.barcode || '84392011234');
      setQuantity(product.quantity || 142);
      setImage(product.image || 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80');
      setAdditionalImages(product.additionalImages || []);
      setIsActive(product.isActive !== false);
      setTrackInventory(product.trackInventory !== false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="p-8 text-center">Product not found.</main>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    updateProduct(product.id, {
      name,
      description,
      category,
      brand,
      sellingPrice: Number(regularPrice),
      buyingPrice: Number(costPrice),
      sku,
      barcode,
      quantity: Number(quantity),
      image,
      additionalImages,
      isActive,
      trackInventory
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete SKU "${sku}"?`)) {
      deleteProduct(product.id);
      setCurrentView('inventory');
    }
  };

  const handleAddGalleryImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setAdditionalImages(prev => [...prev, url]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span onClick={() => setCurrentView('inventory')} className="hover:text-blue-600 cursor-pointer">
              Inventory
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="truncate max-w-xs">{name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Edit</span>
          </div>

          {/* Header Title & Top Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Product</h1>
              <p className="text-sm text-slate-500 font-medium">
                Update details, pricing, and stock levels for {sku}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Product
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Update Product
              </button>
            </div>
          </div>

          {/* 2-Column Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Information */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                  General Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Selling Price (LKR / Rs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Buying Price (LKR / Rs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Barcode / UPC
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Media */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Media
                </h3>

                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Primary Image
                  </span>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center bg-slate-50/50">
                    <img src={image} alt="Primary" className="w-full h-48 object-contain rounded-lg" />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Additional Gallery Images
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {additionalImages.map((imgUrl, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden relative group">
                        <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-slate-900/60 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddGalleryImage}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors"
                      title="Add Image"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Status
                </h3>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Product Status</p>
                    <p className="text-xs text-slate-500">Active products are visible to sales.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Track Inventory</p>
                    <p className="text-xs text-slate-500">Update stock levels automatically.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackInventory}
                      onChange={(e) => setTrackInventory(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
