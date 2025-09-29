'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Papa from 'papaparse';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

type ParsedRow = Record<string, string>;

export default function ImportAssetsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // CSV template columns for user reference
  const exampleHeaders = [
    'serial_number', 'product_id', 'brand_id', 'model_id', 'asset_type_id',
    'status_id', 'location', 'category_id', 'unit_id', 'purchase_date',
    'warranty_expiry', 'description', 'supplier', 'color', 'invoice_ref',
    'assigned_to', 'assigned_department', 'assignment_start_date'
  ];

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setImportResult(null);
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setParsedData([]);
    if (selected) {
      setParsing(true);
      Papa.parse(selected, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsing(false);
          if (results.errors.length > 0) {
            setError(`CSV Parse error: ${results.errors[0].message}`);
            setParsedData([]);
          } else {
            setParsedData(results.data as ParsedRow[]);
          }
        },
        error: (err) => {
          setParsing(false);
          setError('Failed to parse file: ' + err.message);
        },
      });
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csv =
      exampleHeaders.join(',') +
      '\nSN-123,1,2,4,3,1,2,2,1,2023-06-01,2025-06-01,Dell XPS,Dell Malaysia,Silver,INV-789,103,4,2023-06-10';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asset_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Submit import to backend
  const handleImport = async (e: FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/stock/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: parsedData }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Import failed');
      setImportResult(result);
      toast.success('Assets imported successfully');
    } catch (e: any) {
      setError(e.message || 'Failed to import');
      toast.error(e.message || 'Failed to import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Bulk Import Assets</h1>
      <p className="mb-4">
        Upload a <span className="font-mono">.csv</span> file. Download the template for correct columns.
      </p>
      <button className="btn btn-secondary mb-4" onClick={handleDownloadTemplate}>
        Download CSV Template
      </button>

      <form className="space-y-4" onSubmit={handleImport}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />

        {parsing && <div className="text-info">Parsing file...</div>}

        {error && (
          <div className="alert alert-error">
            <div>{error}</div>
          </div>
        )}

        {parsedData.length > 0 && (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="table table-xs table-zebra">
                <thead>
                  <tr>
                    {Object.keys(parsedData[0]).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 10 && (
                <div className="text-xs mt-2">
                  Showing first 10 of {parsedData.length} rows.
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={importing}
            >
              {importing ? 'Importing...' : `Import ${parsedData.length} Assets`}
            </button>
          </>
        )}

        {importResult && (
          <div className="alert alert-success mt-4">
            <div>
              {importResult.success
                ? `Import complete! ${importResult.successCount || 0} imported.`
                : 'Import finished.'}
            </div>
            {importResult.failed?.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">Show Import Errors ({importResult.failed.length})</summary>
                <ul className="text-error text-xs">
                  {importResult.failed.map((row: any, idx: number) => (
                    <li key={idx}>{row.error || JSON.stringify(row)}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
