import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { useForm } from '../hooks/useForm';
import { UploadCloud, AlertCircle, ChevronRight, Save } from 'lucide-react';

export const AddProductPage = () => {
  const { products, categories, addProduct, setCurrentView, showToast } = useInventory();
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const initialValues = {
    name: '',
    sku: 'FUR-CH-001',
    category: '',
    supplier: '',
    quantity: 0,
    buyingPrice: '0.00',
    sellingPrice: '0.00',
    description: '',
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.name || !values.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (!values.sku || !values.sku.trim()) {
      errors.sku = 'SKU is required';
    } else {
      const match = products.find(
        (p) => p.sku.toLowerCase() === values.sku.trim().toLowerCase()
      );
      if (match) {
        errors.sku = `SKU '${values.sku.trim()}' already exists in the system.`;
      }
    }
    if (!values.category) {
      errors.category = 'Please select a category';
    }
    if (values.buyingPrice !== '' && Number(values.buyingPrice) < 0) {
      errors.buyingPrice = 'Buying price cannot be negative';
    }
    if (values.sellingPrice !== '' && Number(values.sellingPrice) < 0) {
      errors.sellingPrice = 'Selling price cannot be negative';
    }
    if (values.quantity !== '' && Number(values.quantity) < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }
    return errors;
  };

  const handleFormSubmit = async (formValues) => {
    try {
      const newProductPayload = {
        name: formValues.name.trim(),
        sku: formValues.sku.trim().toUpperCase(),
        category: formValues.category || categories[0]?.name || 'General',
        supplier: formValues.supplier ? formValues.supplier.trim() : '',
        quantity: Number(formValues.quantity || 0),
        buyingPrice: Number(formValues.buyingPrice || 0),
        sellingPrice: Number(formValues.sellingPrice || 0),
        description: formValues.description ? formValues.description.trim() : '',
        image: imagePreview || 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=400&q=80',
      };

      addProduct(newProductPayload);
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
  } = useForm(initialValues, validateForm, handleFormSubmit);

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetAll = () => {
    resetForm(initialValues);
    setImagePreview(null);
  };

  const skuErrorMsg = errors.sku || (values.sku && products.some(p => p.sku.toLowerCase() === values.sku.trim().toLowerCase()) ? `SKU '${values.sku.trim()}' already exists in the system.` : null);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto pb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span
              onClick={() => setCurrentView('inventory')}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Inventory
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Add Product</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Product</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Enter the details below to add a new SKU to your inventory system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Product Image</h3>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImageUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/40'
                }`}
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm mb-3"
                    />
                    <label className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                      Click or drag to replace image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center w-full">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (MAX. 800×400px)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Ergonomic Office Chair"
                    className={`w-full px-4 py-2.5 bg-slate-50/50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.name && touched.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      SKU (Stock Keeping Unit) *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={values.sku}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="FUR-CH-001"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono font-semibold transition-all focus:outline-none ${
                        skuErrorMsg
                          ? 'bg-rose-50 border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                          : 'bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {skuErrorMsg && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{skuErrorMsg}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && touched.category && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={values.supplier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Search or enter supplier name"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Pricing & Inventory</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                  />
                  {errors.quantity && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Buying Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="buyingPrice"
                      value={values.buyingPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                    />
                  </div>
                  {errors.buyingPrice && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.buyingPrice}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Selling Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="sellingPrice"
                      value={values.sellingPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                    />
                  </div>
                  {errors.sellingPrice && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.sellingPrice}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Additional Details</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Brief description of the product..."
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCurrentView('inventory')}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors shadow-2xs"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting || Boolean(skuErrorMsg)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
