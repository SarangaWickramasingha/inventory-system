import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Download, FileSpreadsheet, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const BulkImportModal = ({ isOpen, onClose }) => {
  const { bulkImportProducts } = useInventory();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const processFile = (fileObj) => {
    setError(null);
    if (!fileObj.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file (.csv extension required).');
      return;
    }
    setFile(fileObj);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setError('CSV file must contain a header row and at least 1 product row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const items = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const name = cols[headers.indexOf('name')] || cols[0] || 'Imported Product';
            const sku = cols[headers.indexOf('sku')] || cols[1] || `SKU-IMP-${Math.floor(Math.random() * 10000)}`;
            const category = cols[headers.indexOf('category')] || cols[2] || 'Computers & Laptops';
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
        setError('Error parsing CSV file format. Please check file structure.');
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
    const sampleCSV = `name,sku,category,quantity,buyingPrice,sellingPrice\nMacBook Pro 16",SKU-MBP-16M3,Computers & Laptops,45,2850.00,3499.00\nDell PowerEdge R760 Server,SKU-DEL-R760,Servers & Storage,8,4200.00,5890.00\nCisco Catalyst 9300 Switch,SKU-CSC-C9300,Networking & Telecom,20,2100.00,3200.00`;
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stockflow_sample_import.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden">
        
        {/* High-Contrast Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Bulk Product CSV Import</h3>
              <p className="text-xs text-slate-300 font-medium">Upload inventory batch via CSV file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Instructions Box */}
          <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs space-y-1.5">
            <div className="font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Required CSV Columns</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              Your CSV file should include headers: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">name</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">sku</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">category</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">quantity</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">buyingPrice</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-mono font-bold">sellingPrice</code>.
            </p>
          </div>

          {/* High-Contrast Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer shadow-sm group ${
              isDragOver
                ? 'border-blue-600 bg-blue-50/80 ring-4 ring-blue-100'
                : 'border-blue-400 hover:border-blue-600 bg-slate-50/80 hover:bg-blue-50/40'
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
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7 stroke-[2.5]" />
              </div>
              <p className="text-base font-extrabold text-slate-900">
                Click to upload or drag & drop CSV file
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Supports standard comma-separated .csv files (Max size 10MB)
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
                Browse Files
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed File Success Card */}
          {file && parsedData.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{file.name}</p>
                  <p className="text-xs text-emerald-800 font-bold mt-0.5">
                    Ready to import <span className="underline decoration-emerald-500">{parsedData.length} products</span>
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
              <span>Download Sample CSV</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={parsedData.length === 0}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Import {parsedData.length > 0 ? `${parsedData.length} Products` : 'Products'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
