import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const InventoryFilters = ({
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption
}) => {
  const { categories } = useInventory();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Dropdown */}
      <div className="relative">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
        >
          <option value="All Categories">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
        >
          <option value="name-asc">Sort by: Name (A-Z)</option>
          <option value="name-desc">Sort by: Name (Z-A)</option>
          <option value="stock-low">Sort by: Stock (Low to High)</option>
          <option value="stock-high">Sort by: Stock (High to Low)</option>
          <option value="price-high">Sort by: Price (High to Low)</option>
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};
