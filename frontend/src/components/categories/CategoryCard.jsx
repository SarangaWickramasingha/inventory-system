import React from 'react';
import { Laptop, Server, Network, Monitor, Cpu, Zap, Folder, Plus, Trash2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

const ICON_MAP = {
  Laptop: Laptop,
  Server: Server,
  Network: Network,
  Monitor: Monitor,
  Cpu: Cpu,
  Zap: Zap,
  Folder: Folder
};

export const CategoryCard = ({ category }) => {
  const { setSelectedCategoryFilter, setCurrentView, deleteCategory } = useInventory();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const IconComponent = ICON_MAP[category.icon] || Folder;

  const handleClick = () => {
    setSelectedCategoryFilter(category.name);
    setCurrentView('inventory');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      deleteCategory(category.id || category.name);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs card-hover cursor-pointer flex flex-col justify-between relative group"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: category.color || '#2563EB' }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          {/* Delete Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title={`Delete category "${category.name}"`}
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
            </button>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">{category.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{category.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Total Products</span>
        <span className="text-sm font-extrabold text-slate-900">
          {category.productCount ? category.productCount.toLocaleString() : 0}
        </span>
      </div>
    </div>
  );
};

export const CreateCategoryCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]"
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </div>
      <p className="text-sm font-bold text-slate-700">Create New Category</p>
    </div>
  );
};
