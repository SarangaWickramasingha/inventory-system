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
    loadProducts,
    loadingProducts,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchTerm,
    setCurrentView,
    navigateToEdit
  } = useInventory();

  const [sortOption, setSortOption] = useState('name-asc');
  const [viewingProductId, setViewingProductId] = useState(null);

  // Trigger API fetch on component mount or search/category filter change
  React.useEffect(() => {
    if (loadProducts) {
      loadProducts({
        search: searchTerm,
        category_id: selectedCategoryFilter !== 'All Categories' ? selectedCategoryFilter : null,
      });
    }
  }, [searchTerm, selectedCategoryFilter]);

  // Filter products by search and category
  let filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    const prodName = p.name || '';
    const skuCode = p.sku || '';
    const categoryName = p.category || p.category_name || '';

    const matchesSearch =
      !searchTerm ||
      prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'All Categories' ||
      categoryName.toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    const aName = a.name || '';
    const bName = b.name || '';
    const aPrice = Number(a.sellingPrice ?? a.price ?? 0);
    const bPrice = Number(b.sellingPrice ?? b.price ?? 0);
    const aQty = Number(a.quantity ?? 0);
    const bQty = Number(b.quantity ?? 0);

    if (sortOption === 'name-asc') return aName.localeCompare(bName);
    if (sortOption === 'name-desc') return bName.localeCompare(aName);
    if (sortOption === 'stock-low') return aQty - bQty;
    if (sortOption === 'stock-high') return bQty - aQty;
    if (sortOption === 'price-high') return bPrice - aPrice;
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
