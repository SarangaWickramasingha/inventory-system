import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { ProductTable } from '../components/inventory/ProductTable';
import { InventoryFilters } from '../components/inventory/InventoryFilters';
import { ProductViewModal } from '../components/inventory/ProductViewModal';
import { useInventory } from '../context/InventoryContext';
import { Plus } from 'lucide-react';

export const InventoryPage = () => {
  const {
    products,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchTerm,
    setCurrentView,
    navigateToEdit
  } = useInventory();

  const [sortOption, setSortOption] = useState('name-asc');
  const [viewingProductId, setViewingProductId] = useState(null);

  // Filter products by search and category
  let filteredProducts = products.filter(p => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'All Categories' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOption === 'stock-low') return a.quantity - b.quantity;
    if (sortOption === 'stock-high') return b.quantity - a.quantity;
    if (sortOption === 'price-high') return b.sellingPrice - a.sellingPrice;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-6 max-w-7xl w-full mx-auto relative min-h-[calc(100vh-80px)]">
          {/* Top Title & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Inventory Management
              </h1>
            </div>

            <InventoryFilters
              categoryFilter={selectedCategoryFilter}
              setCategoryFilter={setSelectedCategoryFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>

          {/* Product Table */}
          <ProductTable
            products={filteredProducts}
            onSelectView={(id) => setViewingProductId(id)}
            onSelectEdit={(id) => navigateToEdit(id)}
          />

          {/* Floating Action Button */}
          <button
            onClick={() => setCurrentView('add-product')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
            title="Add New Product"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </main>
      </div>

      <ProductViewModal
        productId={viewingProductId}
        isOpen={Boolean(viewingProductId)}
        onClose={() => setViewingProductId(null)}
      />
    </div>
  );
};
