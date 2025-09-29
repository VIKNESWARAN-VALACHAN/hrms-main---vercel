'use client';

import { useEffect, useState, useCallback } from 'react';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';

interface ApprovalConfig {
  id: number;
  module: string;
  company_id: number;
  final_level: number;
}

interface Company {
  id: number;
  name: string;
}

export default function ApprovalFlowConfigPage() {
  const [module, setModule] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [finalLevel, setFinalLevel] = useState(1);
  const [existingConfig, setExistingConfig] = useState<ApprovalConfig | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [filterModule, setFilterModule] = useState('');
  const [filterCompanyId, setFilterCompanyId] = useState('');
  const [configList, setConfigList] = useState<ApprovalConfig[]>([]);

  const approvalLevelDescription = (level: number) => {
    const map: Record<number, string> = {
      1: 'Level 1 → HR',
      2: 'Level 1 → Manager → Level 2 → HR',
      3: 'Level 1 → Superior → Level 2 → HR',
      4: 'Level 1 → Manager → Level 2 → Superior → Level 3 → HR',
    };
    return map[level] || 'Unknown';
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.data ?? [];

      const formatted = result.map((c: any) => ({
        id: c.id ?? c.company_id,
        name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
      }));

      setCompanies(formatted);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Unable to load companies');
    }
  };

  const fetchConfigList1 = async () => {
    try {
      let url = `${API_BASE_URL}/api/approval-config`;
      const params = [];
      if (filterModule) params.push(`module=${filterModule}`);
      if (filterCompanyId) params.push(`company_id=${filterCompanyId}`);
      if (params.length) url += `?${params.join('&')}`;

      const res = await fetch(url);
      const data = await res.json();
      setConfigList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch config list', err);
      toast.error('Error fetching config list');
      setConfigList([]);
    }
  };

  const fetchConfigList = useCallback(async () => {
  try {
    let url = `${API_BASE_URL}/api/approval-config`;
    const params = [];
    if (filterModule) params.push(`module=${filterModule}`);
    if (filterCompanyId) params.push(`company_id=${filterCompanyId}`);
    if (params.length) url += `?${params.join('&')}`;

    const res = await fetch(url);
    const data = await res.json();
    setConfigList(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to fetch config list', err);
    toast.error('Error fetching config list');
    setConfigList([]);
  }
}, [filterModule, filterCompanyId]);   // 👈 add dependencies


  useEffect(() => {
    fetchCompanies();
  }, []);

  // useEffect(() => {
  //   fetchConfigList();
  // }, [filterModule, filterCompanyId]);

  useEffect(() => {
  fetchConfigList();
}, [fetchConfigList]);   // 👈 safe now


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!module || !companyId) {
      toast.error('Module and company are required');
      return;
    }

    try {
      const method = existingConfig ? 'PUT' : 'POST';
      const url = existingConfig
        ? `${API_BASE_URL}/api/approval-config/${existingConfig.id}`
        : `${API_BASE_URL}/api/approval-config`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, company_id: companyId, final_level: finalLevel }),
      });

      if (!res.ok) throw new Error('Failed to save config');
      toast.success(`${existingConfig ? 'Updated' : 'Created'} successfully`);
      setExistingConfig(null);
      setModule('');
      setCompanyId('');
      setFinalLevel(1);
      fetchConfigList();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save config');
    }
  };

  const handleDelete = async () => {
    if (!existingConfig) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/approval-config/${existingConfig.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Deleted config');
      setExistingConfig(null);
      setModule('');
      setCompanyId('');
      setFinalLevel(1);
      fetchConfigList();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Approval Flow Configuration</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-base-100 rounded-lg p-4 shadow space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label font-semibold">Module Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label font-semibold">Select Company</label>
            <select
              className="select select-bordered w-full"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label font-semibold">Approval Level</label>
            <select
              className="select select-bordered w-full"
              value={finalLevel}
              onChange={(e) => setFinalLevel(parseInt(e.target.value))}
            >
              <option value={1}>1 - Level 1 → HR</option>
              <option value={2}>2 - Level 1 → Manager → HR</option>
              <option value={3}>3 - Level 1 → Superior → HR</option>
              <option value={4}>4 - Level 1 → Superior → Manager → HR</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          <strong>Configured Flow:</strong> {approvalLevelDescription(finalLevel)}
        </p>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {existingConfig ? 'Update' : 'Create'} Config
          </button>
          {existingConfig && (
            <button type="button" onClick={handleDelete} className="btn btn-error">
              Delete
            </button>
          )}
        </div>
      </form>

      {/* Search & List */}
      <div className="mb-6 bg-base-100 rounded-lg p-4 shadow">
        <h2 className="text-lg font-bold mb-4">Search Approval Configs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label font-semibold">Filter by Module</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g., claim"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
            />
          </div>
          <div>
            <label className="label font-semibold">Filter by Company</label>
            <select
              className="select select-bordered w-full"
              value={filterCompanyId}
              onChange={(e) => setFilterCompanyId(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {configList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Module</th>
                  <th>Company</th>
                  <th>Final Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {configList.map((config) => (
                  <tr key={config.id}>
                    <td>{config.id}</td>
                    <td>{config.module}</td>
                    <td>
                      {
                        companies.find((c) => c.id === config.company_id)?.name ??
                        `Company ${config.company_id}`
                      }
                    </td>
                    <td>{config.final_level}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-outline btn-info"
                        onClick={() => {
                          setModule(config.module);
                          setCompanyId(String(config.company_id));
                          setFinalLevel(config.final_level);
                          setExistingConfig(config);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm mt-4 text-gray-500">No configs found.</p>
        )}
      </div>
    </div>
  );

  
}
