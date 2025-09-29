'use client';

import { useState, useEffect, useMemo, useCallback  } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { useTheme } from '../../../components/ThemeProvider';

interface Brand {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export default function BrandsList() {
  const { theme } = useTheme();
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Brand;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });

  const fetchBrands = useCallback(async () => {//async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/inventory/brands`;
      if (searchTerm.length >= 2) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch brands');
      
      const data = await res.json();
      
      // Transform API data to match frontend expectations
      const transformedBrands = data.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        description: brand.description || 'No description',
        is_active: brand.is_active === 1 || brand.is_active === true, // Default all to active since API doesn't provide this
        created_at: brand.created_at
      }));
      
      setBrands(transformedBrands);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
    }, [searchTerm]); 
  //};

  useEffect(() => { 
    fetchBrands(); 
  }, [fetchBrands]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBrands();
  };

  const filteredBrands = useMemo(() => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [brands, searchTerm]);
  const sortedBrands = useMemo(() => {
    const sortableBrands = [...filteredBrands];
    if (sortConfig.key) {
      sortableBrands.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBrands;
  }, [filteredBrands, sortConfig]);

  const handleSort = (key: keyof Brand) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = sortedBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBrands.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/brands/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      // Refresh the brands list after successful deletion
      fetchBrands();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete brand');
    }
  };

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
          onClick={fetchBrands}
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
          Brand Management
        </h1>
        <Link 
          href="/admins/assets/brands/add" 
          className="btn btn-primary"
        >
          + Add New Brand
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search brands..."
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
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig.key === 'name' && (
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
              {currentBrands.length > 0 ? (
                currentBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.id}</td>
                    <td>{brand.name}</td>
                    <td>{brand.description}</td>
                    <td>
                      <span className={`badge ${brand.is_active ? 'badge-success' : 'badge-error'}`}>
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link 
                        href={`/admins/assets/brands/${brand.id}`}
                        className="btn btn-sm btn-primary mr-2"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(brand.id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    {searchTerm ? 'No matching brands found' : 'No brands available'}
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