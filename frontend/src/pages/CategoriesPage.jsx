import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { CategoryCard, CreateCategoryCard } from '../components/categories/CategoryCard';
import { AddCategoryModal } from '../components/categories/AddCategoryModal';
import { useInventory } from '../context/InventoryContext';
import { Plus } from 'lucide-react';

export const CategoriesPage = () => {
  const { categories } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);

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
                Manage and organize your product hierarchy.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Category
            </button>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
            <CreateCategoryCard onClick={() => setShowAddModal(true)} />
          </div>
        </main>
      </div>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};
