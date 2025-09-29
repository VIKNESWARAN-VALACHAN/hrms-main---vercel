'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface VersionLog {
  id: number;
  table_name: string;
  action: string;
  record_id: number;
  changed_by: string;
  changes: string;
  created_at: string;
}

export default function VersionLogsPage() {
  const [logs, setLogs] = useState<VersionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/version-logs`);
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      toast.error('Failed to fetch version logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    `${log.table_name} ${log.action} ${log.changed_by}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Version Logs</h1>
      </div>

      <input
        className="input input-bordered w-full mb-4"
        placeholder="Search by table name, action, user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg bg-base-100">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Table</th>
                <th>Action</th>
                <th>Record ID</th>
                <th>Changed By</th>
                <th>Changes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">No logs found.</td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.table_name}</td>
                    <td>{log.action}</td>
                    <td>{log.record_id}</td>
                    <td>{log.changed_by}</td>
                    <td>
                      <pre className="whitespace-pre-wrap break-words text-xs bg-gray-100 p-2 rounded">
                        {log.changes}
                      </pre>
                    </td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredLogs.length > itemsPerPage && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(filteredLogs.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
