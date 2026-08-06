import React from 'react';
import { 
  Laptop, Server, Network, Monitor, Cpu, Zap, Folder, Box, Tag, 
  HardDrive, Smartphone, Shield, Headphones, Printer, Database, Cable 
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const ICON_MAP = {
  Laptop,
  Server,
  Network,
  Monitor,
  Cpu,
  Zap,
  Folder,
  Box,
  Tag,
  HardDrive,
  Smartphone,
  Shield,
  Headphones,
  Printer,
  Database,
  Cable
};

export const ICON_COLOR_MAP = {
  Laptop: '#3B82F6',     // Blue
  Server: '#8B5CF6',     // Purple
  Network: '#10B981',    // Emerald
  Monitor: '#EC4899',    // Pink
  Cpu: '#D97706',        // Amber
  Zap: '#6366F1',        // Indigo
  Folder: '#2563EB',     // Royal Blue
  Box: '#64748B',        // Slate
  Tag: '#0D9488',        // Teal
  HardDrive: '#06B6D4',  // Cyan
  Smartphone: '#7C3AED', // Violet
  Shield: '#059669',     // Green
  Headphones: '#4F46E5', // Deep Indigo
  Printer: '#F59E0B',    // Amber
  Database: '#0284C7',   // Sky Blue
  Cable: '#EA580C',      // Orange
};

export const CategoryCard = ({ category }) => {
  const { setSelectedCategoryFilter, setCurrentView } = useInventory();

  const IconComponent = ICON_MAP[category.icon] || Folder;
  const accentColor = category.color || ICON_COLOR_MAP[category.icon] || '#2563EB';

  const handleClick = () => {
    setSelectedCategoryFilter(category.name);
    setCurrentView('inventory');
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
            style={{ backgroundColor: accentColor }}
          >
            <IconComponent className="w-6 h-6" />
          </div>
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
