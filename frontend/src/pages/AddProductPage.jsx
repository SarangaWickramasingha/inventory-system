import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { UploadCloud, AlertCircle, ChevronRight } from 'lucide-react';

export const AddProductPage = () => {
  const { products, categories, addProduct, setCurrentView } = useInventory();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('FUR-CH-001'); // Default prepopulated matching Screenshot 2 for demonstrative error callout
  const [category, setCategory] = useState('Furniture');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [buyingPrice, setBuyingPrice] = useState('0.00');
  const [sellingPrice, setSellingPrice] = useState('0.00');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=400&q=80');
  const [isDragOver, setIsDragOver] = useState(false);

  // Live SKU validation check
  const existingSkuMatch = sku.trim() ? products.find(p => p.sku.toLowerCase() === sku.trim().toLowerCase()) : null;

  const handleReset = () => {
    setName('');
    setSku('');
    setCategory(categories[0]?.name || 'Electronics');
    setSupplier('');
    setQuantity(0);
    setBuyingPrice('0.00');
    setSellingPrice('0.00');
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;
    if (existingSkuMatch) return; // Prevent duplicate submit

    addProduct({
      name: name.trim(),
      sku: sku.trim(),
      category,
      supplier: supplier.trim(),
      quantity: Number(quantity),
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      description: description.trim(),
      image: imageUrl
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-6 max-w-5xl w-full mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span
              onClick={() => setCurrentView('inventory')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Inventory
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Add Product</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Product</h1>
            <p className="text-sm text-slate-500 font-medium">
              Enter the details below to add a new SKU to your inventory system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Image Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800">Product Image</h3>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImageUrl(ev.target.result);
                    reader.readAsDataURL(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer shadow-2xs ${
                  isDragOver ? 'border-blue-600 bg-blue-50/80 ring-4 ring-blue-100' : 'border-blue-400 hover:border-blue-600 bg-slate-50/80 hover:bg-blue-50/30'
                }`}
              >
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border-2 border-slate-200 shadow-md" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl('');
                        }}
                        className="absolute -top-2.5 -right-2.5 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="product-image-file"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Replace Image
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl('');
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
                      <UploadCloud className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">Click to upload or drag and drop image</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">SVG, PNG, JPG or GIF (MAX. 800×400px)</p>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setImageUrl(ev.target.result);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="product-image-file"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ergonomic Office Chair"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      SKU (Stock Keeping Unit) *
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. FUR-CH-001"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono font-semibold ${
                        existingSkuMatch
                          ? 'bg-rose-50 border-rose-300 text-rose-900 focus:border-rose-500'
                          : 'bg-slate-50/50 border-slate-200 focus:bg-white'
                      }`}
                    />
                    {/* Duplicate SKU Warning Callout matching Screenshot 2 */}
                    {existingSkuMatch && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>SKU '{sku}' already exists in the system.</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Category *
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Search or enter supplier name"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800">Pricing & Inventory</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, Number(e.target.value) || 0))}
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
                    min="0"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Selling Price (LKR / Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800">Additional Details</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the product..."
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                ></textarea>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('inventory')}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors shadow-2xs"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={Boolean(existingSkuMatch) || !name.trim() || !sku.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Save Product
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
