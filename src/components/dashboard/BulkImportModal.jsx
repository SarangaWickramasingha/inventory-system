import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useInventory } from '../../context/InventoryContext';

export const BulkImportModal = ({ isOpen, onClose }) => {
  const { bulkImportProducts } = useInventory();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (fileObj) => {
    setError(null);
    if (!fileObj.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setFile(fileObj);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setError('CSV file must contain a header and at least 1 product row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const items = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const name = cols[headers.indexOf('name')] || cols[0] || 'Imported Product';
            const sku = cols[headers.indexOf('sku')] || cols[1] || `SKU-IMP-${Math.floor(Math.random() * 10000)}`;
            const category = cols[headers.indexOf('category')] || cols[2] || 'Electronics';
            const quantity = Number(cols[headers.indexOf('quantity')] || cols[3] || 50);
            const buyingPrice = Number(cols[headers.indexOf('buyingprice')] || cols[4] || 20);
            const sellingPrice = Number(cols[headers.indexOf('sellingprice')] || cols[5] || 49.99);

            let status = 'In Stock';
            if (quantity === 0) status = 'Out of Stock';
            else if (quantity <= 20) status = 'Low Stock';

            items.push({
              id: `prod-imp-${Date.now()}-${i}`,
              name,
              sku,
              category,
              quantity,
              buyingPrice,
              sellingPrice,
              status,
              isActive: true,
              trackInventory: true,
              description: 'Bulk imported item via CSV upload.',
              image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'
            });
          }
        }
        setParsedData(items);
      } catch (err) {
        setError('Error parsing CSV file format.');
      }
    };
    reader.readAsText(fileObj);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      bulkImportProducts(parsedData);
      setFile(null);
      setParsedData([]);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    const sampleCSV = `name,sku,category,quantity,buyingPrice,sellingPrice\nWireless Ergonomic Keyboard,SKU-WEK-900,Electronics,120,35.00,89.99\nExecutive Desk Mug,SKU-EDM-404,Home & Garden,45,8.50,19.99`;
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stockflow_sample_import.csv';
    a.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Product CSV Import" maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
            className="hidden"
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-12 h-12 text-blue-600 mb-3 stroke-[1.5]" />
            <p className="text-sm font-bold text-slate-800">
              Click to upload or drag and drop CSV file
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard CSV format (Max size 10MB)
            </p>
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {file && parsedData.length > 0 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">{file.name}</p>
                <p className="text-xs text-emerald-700 font-medium">
                  Ready to import <span className="font-bold">{parsedData.length}</span> products
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handleDownloadSample}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Download Sample CSV Template
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedData.length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors"
            >
              Import Products
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
