import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useInventory } from '../../context/InventoryContext';
import { ICON_MAP, ICON_COLOR_MAP } from './CategoryCard';
import { Folder } from 'lucide-react';

const CATEGORY_ICON_OPTIONS = [
  { value: 'Laptop', label: 'Computers & Workstations (Laptop / PC)' },
  { value: 'Server', label: 'Servers & Data Infrastructure (Server / Rack)' },
  { value: 'Network', label: 'Networking & Telecommunications (Router / Switch)' },
  { value: 'Monitor', label: 'Monitors & Displays (Screen / Display)' },
  { value: 'Cpu', label: 'Peripherals & Components (CPU / GPU / Hardware)' },
  { value: 'Zap', label: 'Power & Rack Infrastructure (UPS / Power)' },
  { value: 'Smartphone', label: 'Mobile & Handheld Devices (Smartphone / Tablet)' },
  { value: 'Shield', label: 'Security & Surveillance (Shield / Security)' },
  { value: 'Headphones', label: 'Audio & Communications (Headphones / AV)' },
  { value: 'Printer', label: 'Printers & Office Automation (Printer / Scanner)' },
  { value: 'Database', label: 'Database & Cloud Systems (Database / Data)' },
  { value: 'Cable', label: 'Cables & Connectivity (Adapters / Wiring)' },
  { value: 'HardDrive', label: 'Storage & Memory Drives (SSD / NVMe / HDD)' },
  { value: 'Tag', label: 'Software & Asset Licensing (License Tag)' },
  { value: 'Box', label: 'Packaging & Logistics (Cargo Box)' },
  { value: 'Folder', label: 'General / Miscellaneous (Folder)' },
];

export const AddCategoryModal = ({ isOpen, onClose }) => {
  const { addCategory } = useInventory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');

  const color = ICON_COLOR_MAP[icon] || '#2563EB';
  const SelectedIconComponent = ICON_MAP[icon] || Folder;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({ name: name.trim(), description: description.trim(), icon, color });
    setName('');
    setDescription('');
    setIcon('Folder');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smart Electronics"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of product category..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Category Icon
          </label>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs transition-all duration-200"
              style={{ backgroundColor: color }}
            >
              <SelectedIconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORY_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors"
          >
            Save Category
          </button>
        </div>
      </form>
    </Modal>
  );
};
