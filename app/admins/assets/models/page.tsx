'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { useTheme } from '../../../components/ThemeProvider';

interface AssetModel {
  id: number;
  model_name: string;
  brand_id: number;
  brand_name: string;
  description?: string | null;
  is_active?: boolean | number | null;
  created_at?: string;
}

export default function ModelsList() {
  const { theme } = useTheme();
  const router = useRouter();
  const [models, setModels] = useState<AssetModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssetModel;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });

  // Fetch all models
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/inventory/models`;
      if (searchTerm.trim().length >= 2) {
        url += `?search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch models');

      const data = await res.json();

      // Map API to Model shape with defensive conversion
      const transformedModels: AssetModel[] = (Array.isArray(data) ? data : []).map((model: any) => ({
        id: model.id,
        model_name: model.model_name ?? '',
        brand_id: model.brand_id,
        brand_name: model.brand_name ?? '-',
        description: model.description ?? 'No description',
        is_active: model.is_active === 1 || model.is_active === true,
        created_at: model.created_at
      }));

      setModels(transformedModels);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchModels();
  };

  // Defensive optional chaining for filters
  const filteredModels = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return models.filter(model => {
      return (
        model.model_name?.toLowerCase().includes(term) ||
        model.brand_name?.toLowerCase().includes(term) ||
        (model.description?.toLowerCase().includes(term))
      );
    });
  }, [models, searchTerm]);

  const sortedModels = useMemo(() => {
    const sortableModels = [...filteredModels];
    if (sortConfig.key) {
      sortableModels.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableModels;
  }, [filteredModels, sortConfig]);

  const handleSort = (key: keyof AssetModel) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentModels = sortedModels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedModels.length / itemsPerPage);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/models/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');
      fetchModels();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete model');
    }
  };

  // Render
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={fetchModels}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Model Management
        </h1>
        <Link
          href="/admins/assets/models/add"
          className="btn btn-primary"
        >
          + Add New Model
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search models..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === 'id' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('model_name')}
                >
                  <div className="flex items-center">
                    Model Name
                    {sortConfig.key === 'model_name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('brand_name')}
                >
                  <div className="flex items-center">
                    Brand
                    {sortConfig.key === 'brand_name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentModels.length > 0 ? (
                currentModels.map((model) => (
                  <tr key={model.id}>
                    <td>{model.id}</td>
                    <td>{model.model_name}</td>
                    <td>{model.brand_name}</td>
                    <td>{model.description ?? 'No description'}</td>
                    <td>
                      <span className={`badge ${model.is_active ? 'badge-success' : 'badge-error'}`}>
                        {model.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/admins/assets/models/${model.id}`}
                        className="btn btn-sm btn-primary mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(model.id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    {searchTerm ? 'No matching models found' : 'No models available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
