import React from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { CategoryCard } from '../components/categories/CategoryCard';
import { useInventory } from '../context/InventoryContext';

export const CategoriesPage = () => {
  const { categories, products } = useInventory();

  const displayCategories = (categories || []).map(cat => {
    const count = (products || []).filter(p => {
      const pCat = (p?.category || p?.category_name || '').toLowerCase();
      return pCat === (cat.name || '').toLowerCase();
    }).length;
    return {
      ...cat,
      productCount: cat.productCount ?? count
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Title & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
              <p className="text-sm text-slate-500 font-medium">
                Standard predefined hardware & asset categories.
              </p>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((cat) => (
              <CategoryCard key={cat.id || cat.name} category={cat} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
