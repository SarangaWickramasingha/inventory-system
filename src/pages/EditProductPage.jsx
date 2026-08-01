import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useInventory } from '../context/InventoryContext';
import { useForm } from '../hooks/useForm';
import { Trash2, Save, Plus, ChevronRight, Home, UploadCloud, AlertCircle } from 'lucide-react';

export const EditProductPage = () => {
  const {
    products,
    categories,
    editingProductId,
    updateProduct,
    deleteProduct,
    setCurrentView,
    showToast
  } = useInventory();

  const product = products.find((p) => p.id === editingProductId) || products[0] || {
    id: 'prod-demo',
    name: 'Ergonomic Wireless Mouse Pro',
    description: 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use. Includes USB-C receiver and Bluetooth connectivity.',
    category: 'Electronics',
    brand: 'LogiTech',
    sellingPrice: 59.99,
    buyingPrice: 24.50,
    sku: 'SKU-WM902',
    barcode: '84392011234',
    quantity: 142,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&q=80'
    ],
    isActive: true,
    trackInventory: true
  };

  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Electronics',
    brand: product?.brand || 'LogiTech',
    sellingPrice: product?.sellingPrice !== undefined ? String(product.sellingPrice) : '59.99',
    buyingPrice: product?.buyingPrice !== undefined ? String(product.buyingPrice) : '24.50',
    sku: product?.sku || 'SKU-WM902',
    barcode: product?.barcode || '84392011234',
    quantity: product?.quantity !== undefined ? String(product.quantity) : '142',
    image: product?.image || '',
    additionalImages: product?.additionalImages || [],
    isActive: product?.isActive !== false,
    trackInventory: product?.trackInventory !== false
  };

  const validateEditForm = (values) => {
    const errors = {};
    if (!values.name || !values.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (!values.sku || !values.sku.trim()) {
      errors.sku = 'SKU is required';
    } else {
      const match = products.find(
        (p) => p.id !== product?.id && p.sku.toLowerCase() === values.sku.trim().toLowerCase()
      );
      if (match) {
        errors.sku = `SKU '${values.sku.trim()}' is already used by another product.`;
      }
    }
    if (values.sellingPrice !== '' && Number(values.sellingPrice) < 0) {
      errors.sellingPrice = 'Regular price cannot be negative';
    }
    if (values.buyingPrice !== '' && Number(values.buyingPrice) < 0) {
      errors.buyingPrice = 'Cost price cannot be negative';
    }
    if (values.quantity !== '' && Number(values.quantity) < 0) {
      errors.quantity = 'Stock quantity cannot be negative';
    }
    return errors;
  };

  const handleUpdateProductSubmit = async (formValues) => {
    try {
      updateProduct(product.id, {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        category: formValues.category,
        brand: formValues.brand.trim(),
        sellingPrice: Number(formValues.sellingPrice || 0),
        buyingPrice: Number(formValues.buyingPrice || 0),
        sku: formValues.sku.trim().toUpperCase(),
        barcode: formValues.barcode.trim(),
        quantity: Number(formValues.quantity || 0),
        image: formValues.image,
        additionalImages: formValues.additionalImages,
        isActive: Boolean(formValues.isActive),
        trackInventory: Boolean(formValues.trackInventory)
      });
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit
  } = useForm(initialValues, validateEditForm, handleUpdateProductSubmit);

  useEffect(() => {
    if (product) {
      resetForm({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Electronics',
        brand: product.brand || 'LogiTech',
        sellingPrice: product.sellingPrice !== undefined ? String(product.sellingPrice) : '59.99',
        buyingPrice: product.buyingPrice !== undefined ? String(product.buyingPrice) : '24.50',
        sku: product.sku || 'SKU-WM902',
        barcode: product.barcode || '84392011234',
        quantity: product.quantity !== undefined ? String(product.quantity) : '142',
        image: product.image || 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
        additionalImages: product.additionalImages || [],
        isActive: product.isActive !== false,
        trackInventory: product.trackInventory !== false
      });
    }
  }, [product, resetForm]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete product "${values.name}" (${values.sku})?`)) {
      deleteProduct(product.id);
      setCurrentView('inventory');
    }
  };

  const handleAddGalleryImage = () => {
    const url = prompt('Enter additional gallery image URL:');
    if (url && url.trim()) {
      setFieldValue('additionalImages', [...values.additionalImages, url.trim()]);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFieldValue(
      'additionalImages',
      values.additionalImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span
              onClick={() => setCurrentView('inventory')}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Inventory
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[150px] sm:max-w-xs">{values.name || 'Wireless Mouse'}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Edit</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Product</h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Update details, pricing, and stock levels for {values.sku || 'SKU-WM902'}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-sm rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 stroke-[2]" />
                <span>Delete Product</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Update Product'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  General Information
                </h3>

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
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {errors.name && touched.name && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        {categories.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={values.brand}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={values.sku}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      {errors.sku && touched.sku && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{errors.sku}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Barcode
                      </label>
                      <input
                        type="text"
                        name="barcode"
                        value={values.barcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Pricing & Stock</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Buying Price
                    </label>
                    <input
                      type="number"
                      name="buyingPrice"
                      min="0"
                      step="0.01"
                      value={values.buyingPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {errors.buyingPrice && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.buyingPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      min="0"
                      step="0.01"
                      value={values.sellingPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {errors.sellingPrice && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.sellingPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={values.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    {errors.quantity && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.quantity}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Images</h3>

                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <img src={values.image} alt="Current product" className="h-24 w-full rounded-lg object-cover" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {values.additionalImages.map((img, index) => (
                      <div key={`${img}-${index}`} className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                        <img src={img} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add gallery image
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
