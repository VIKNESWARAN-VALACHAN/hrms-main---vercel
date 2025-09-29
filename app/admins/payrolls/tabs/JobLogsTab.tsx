'use client';

import React, { useEffect, useState,useCallback  } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

interface JobLog {
  id: number;
  trigger_type: string;
  status: string;
  message: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  created_by: number | null;
  extra_info: Record<string, any>;
}

export default function JobLogsPage() {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTrigger, setFilterTrigger] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;



  const fetchLogs = useCallback(async () => {//async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/payroll/joblogs`, {
        params: {
          status: filterStatus,
          trigger_type: filterTrigger,
          page,
          limit
        }
      });
      setLogs(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch job logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterTrigger, page]);//};

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs,filterStatus, filterTrigger, page]);

  const totalPages = Math.ceil(total / limit);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Payroll Job Logs</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="label-text mb-1">Status</label>
          <select
            className="select select-bordered w-full"
            value={filterStatus}
            onChange={(e) => {
              setPage(1);
              setFilterStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <div>
          <label className="label-text mb-1">Trigger Type</label>
          <select
            className="select select-bordered w-full"
            value={filterTrigger}
            onChange={(e) => {
              setPage(1);
              setFilterTrigger(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
            <option value="test">Test</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Trigger</th>
                <th>Status</th>
                <th>Message</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Initiated By</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.trigger_type}</td>
                  <td>
                    <span className={`badge text-xs px-2 py-1 ${
                      log.status === 'SUCCESS'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="max-w-xs truncate">{log.message}</td>
                  <td>{new Date(log.started_at).toLocaleString()}</td>
                  <td>{formatDuration(log.duration_seconds)}</td>
                  <td>{log.created_by ? `User ${log.created_by}` : 'System'}</td>
                  <td>
                    <div className="tooltip tooltip-left" data-tip={JSON.stringify(log.extra_info, null, 2)}>
                      <span className="text-blue-500 cursor-pointer">View</span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}