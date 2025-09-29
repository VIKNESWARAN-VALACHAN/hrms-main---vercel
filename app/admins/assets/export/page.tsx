'use client';

import { useState } from 'react';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

export default function AssetExportPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/stock/export`, {
        method: 'GET',
        headers: {
          // If you use JWT or any auth:
          // 'Authorization': `Bearer ${token}`,
        }
      });

      if (!res.ok) throw new Error('Failed to export inventory');

      // Read as Blob
      const blob = await res.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_inventory.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Exported inventory to Excel!');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Export Asset Inventory</h1>
      <p className="mb-8 text-gray-600">
        Download the full inventory/products list as an Excel file. You can open this in Microsoft Excel, Google Sheets, or similar spreadsheet tools.
      </p>
      <button
        className="btn btn-primary"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? 'Exporting...' : 'Export as Excel (.xlsx)'}
      </button>
    </div>
  );
}
