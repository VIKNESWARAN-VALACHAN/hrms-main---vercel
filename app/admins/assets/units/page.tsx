'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../components/ThemeProvider';
import { API_BASE_URL } from '../../../config';
import { useRouter } from 'next/navigation';

interface AssetUnit {
  id: number;
  name: string;
}

export default function UnitsList() {
  const { theme } = useTheme();
  const router = useRouter();
  const [units, setUnits] = useState<AssetUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssetUnit;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });

  // Fetch all units
  const fetchUnits = useCallback(async () => { //async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/inventory/units`;
      if (searchTerm.trim().length >= 2) {
        url += `?search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch units');
      const data = await res.json();
      const transformedUnits: AssetUnit[] = (Array.isArray(data) ? data : []).map((u: any) => ({
        id: u.id,
        name: u.name ?? '',
      }));
      setUnits(transformedUnits);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);
    //};

  useEffect(() => { fetchUnits(); }, [fetchUnits]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUnits();
  };

  const filteredUnits = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return units.filter(u =>
      u.name?.toLowerCase().includes(term)
    );
  }, [units, searchTerm]);

  const sortedUnits = useMemo(() => {
    const sortableUnits = [...filteredUnits];
    if (sortConfig.key) {
      sortableUnits.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableUnits;
  }, [filteredUnits, sortConfig]);

  const handleSort = (key: keyof AssetUnit) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUnits = sortedUnits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUnits.length / itemsPerPage);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/units/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUnits();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete unit');
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
        <div className="alert alert-error shadow-lg"><span>{error}</span></div>
        <button onClick={fetchUnits} className="btn btn-primary mt-4">Retry</button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Unit Management
        </h1>
        <Link href="/admins/assets/units/add" className="btn btn-primary">+ Add New Unit</Link>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search units..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center">ID
                  {sortConfig.key === 'id' && (
                    <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">Name
                  {sortConfig.key === 'name' && (
                    <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUnits.length > 0 ? (
              currentUnits.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td className="text-right">
                    <Link href={`/admins/assets/units/${u.id}`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                    <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  {searchTerm ? 'No matching units found' : 'No units available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button className="join-item btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button className="join-item btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
