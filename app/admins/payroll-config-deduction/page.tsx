// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import PayrollConfigDeductionForm, {
//   PayrollConfigDeductionRow,
// } from '../../components/payroll/PayrollConfigDeductionForm';
// import PayrollConfigDeductionTable from '../../components/payroll/PayrollConfigDeductionTable';
// import { API_BASE_URL } from '../../config';
// import { api } from '../../utils/api';

// export default function PayrollConfigDeductionPage() {
//   const [rows, setRows] = useState<PayrollConfigDeductionRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState<PayrollConfigDeductionRow | null>(null);

//   const [configs, setConfigs] = useState<any[]>([]);
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);

//   const fetchRows = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`${API_BASE_URL}/api/payroll-config-deduction`);
//       setRows(res);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to fetch rows');
//     }
//     setLoading(false);
//   };

//   const fetchOptions = async () => {
//     try {
//       const [cfg, co, dept] = await Promise.all([
//         api.get(`${API_BASE_URL}/api/payroll-config/configs`),
//         api.get(`${API_BASE_URL}/api/admin/companies`),
//         api.get(`${API_BASE_URL}/api/admin/departments`),
//       ]);
//       setConfigs(cfg);
//       setCompanies(co);
//       setDepartments(dept);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to fetch options');
//     }
//   };

//   useEffect(() => {
//     fetchRows();
//     fetchOptions();
//   }, []);

//   const handleAdd = () => {
//     setEditData(null);
//     setShowModal(true);
//   };

//   const handleEdit = (row: PayrollConfigDeductionRow) => {
//     setEditData(row);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     const confirmDelete = confirm('Are you sure you want to delete this deduction mapping?');
//     if (!confirmDelete) return;

//     try {
//       const res = await api.delete(`${API_BASE_URL}/api/payroll-config-deduction/${id}`);
//       if (res.success) {
//         toast.success('Deleted successfully');
//         fetchRows();
//       } else {
//         toast.error('Delete failed');
//       }
//     } catch (err: any) {
//       console.error('Delete error:', err);
//       toast.error(err.message || 'Error occurred during deletion');
//     }
//   };

//   const handleSave = async (data: Partial<PayrollConfigDeductionRow>) => {
//     try {
//       if (data.id) {
//         await api.put(`${API_BASE_URL}/api/payroll-config-deduction/${data.id}`, data);
//         toast.success('Updated successfully');
//       } else {
//         await api.post(`${API_BASE_URL}/api/payroll-config-deduction`, data);
//         toast.success('Added successfully');
//       }
//       setShowModal(false);
//       setEditData(null);
//       fetchRows();
//     } catch (err: any) {
//       console.error('Save error:', err);
//       toast.error(err.message || 'Failed to save');
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Payroll Config Deduction Mapping</h1>
//         <button className="btn btn-primary" onClick={handleAdd}>
//           + Add Mapping
//         </button>
//       </div>

//       <PayrollConfigDeductionTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />

//       {showModal && (
//         <PayrollConfigDeductionForm
//           initialData={editData || undefined}
//           mode={editData ? 'edit' : 'add'}
//           onSave={handleSave}
//           onCancel={() => {
//             setShowModal(false);
//             setEditData(null);
//           }}
//           configs={configs}
//           companies={companies}
//           departments={departments}
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import PayrollConfigDeductionForm, {
  PayrollConfigDeductionRow,
} from '../../components/payroll/PayrollConfigDeductionForm';
import { API_BASE_URL } from '../../config';
import { api } from '../../utils/api';

type Company = { id: number; name: string };
type Department = { id: number; department_name: string; company_id: number; company_name: string };

const ITEMS_PER_PAGE = 10;

/* ---------- Helpers ---------- */
const formatMonth = (dateString?: string | null) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(d);
  } catch {
    return dateString || '-';
  }
};
const formatRM = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? `RM ${n.toFixed(2)}` : 'RM 0.00';
};

/* ---------- Local Table Component ---------- */
function DeductionTable({
  rows,
  onEdit,
  onDeleted,
}: {
  rows: PayrollConfigDeductionRow[];
  onEdit: (row: PayrollConfigDeductionRow) => void;
  onDeleted: () => Promise<void> | void;
}) {
  const [deleteTarget, setDeleteTarget] = useState<PayrollConfigDeductionRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const askDelete = (row: PayrollConfigDeductionRow) => {
    setDeleteTarget(row);
    setError(null);
    setSuccessMessage(null);
  };

  const doDelete = async () => {
    if (!deleteTarget?.id) {
      setError('No record selected for deletion');
      return;
    }
    try {
      setIsDeleting(true);
      setError(null);
      setSuccessMessage(null);

      const res = await fetch(`${API_BASE_URL}/api/payroll-config-deduction/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete record');
      }

      setSuccessMessage('Record deleted successfully!');
      setDeleteTarget(null);

      await onDeleted?.();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'An unexpected error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-base-100 rounded">
      {successMessage && (
        <div className="toast toast-top toast-end z-[60]">
          <div className="alert alert-success">
            <FiCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <table className="table w-full">
        <thead>
          <tr>
            <th>Payroll Config</th>
            <th>Deduction</th>
            <th>Amount</th>
            <th>Company</th>
            <th>Department</th>
            <th>Start Month</th>
            <th>End Month</th>
            <th>Remark</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6">No data</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="align-top">{row.payroll_config_name || row.payroll_config_id}</td>
                <td className="align-top">{row.deduction_name || row.deduction_id}</td>
                <td className="align-top whitespace-nowrap">{formatRM(row.amount)}</td>
                <td className="align-top">{row.company_name || row.company_id || '-'}</td>
                <td className="align-top">{row.department_name || row.department_id || '-'}</td>
                <td className="align-top">{formatMonth(row.cycle_start_month)}</td>
                <td className="align-top">{formatMonth(row.cycle_end_month)}</td>
                <td className="align-top max-w-[22ch] truncate" title={row.remark || ''}>{row.remark || '-'}</td>
                <td className="align-top text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => askDelete(row)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete:
              <br />
              <strong>{deleteTarget.deduction_name || `ID ${deleteTarget.id}`}</strong>?
            </p>
            {error && <div className="alert alert-error mb-4 p-2 text-sm"><span>{error}</span></div>}
            <div className="flex justify-end gap-3">
              <button className="btn" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</button>
              <button className="btn btn-error text-white" onClick={doDelete} disabled={isDeleting}>
                {isDeleting ? (<><span className="loading loading-spinner loading-xs"></span> Deleting…</>) : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function PayrollConfigDeductionPage() {
  const [rows, setRows] = useState<PayrollConfigDeductionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<PayrollConfigDeductionRow | null>(null);

  // options
  const [configs, setConfigs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // filters/search/paging
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState<'all' | number>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const page = currentPage;
  const setPage = setCurrentPage;

  // Fetchers
  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${API_BASE_URL}/api/payroll-config-deduction`);
      setRows(res || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch deduction mappings');
    } finally {
      setLoading(false);
    }
  };

  // IMPORTANT: only departments API; derive companies from it
  const fetchOptions1 = async () => {
    try {
      const [cfg, dept] = await Promise.all([
        api.get(`${API_BASE_URL}/api/payroll-config/configs`),
        api.get(`${API_BASE_URL}/api/admin/departments`), // -> id, department_name, company_id, company_name
      ]);

      const deptRows: Department[] = (dept || []).map((d: any) => ({
        id: Number(d.id),
        department_name: d.department_name,
        company_id: Number(d.company_id),
        company_name: d.company_name,
      }));

      // build unique companies from departments
      const map = new Map<number, Company>();
      for (const d of deptRows) {
        if (!map.has(d.company_id)) {
          map.set(d.company_id, { id: d.company_id, name: d.company_name });
        }
      }

      setConfigs(cfg || []);
      setDepartments(deptRows);
      setCompanies(Array.from(map.values()));
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch dropdown options');
    }
  };

  // In the main page component, update the fetchOptions function:
const fetchOptions = async () => {
  try {
    const [cfg, dept] = await Promise.all([
      api.get(`${API_BASE_URL}/api/payroll-config/configs`),
      api.get(`${API_BASE_URL}/api/admin/departments`),
    ]);

    // Process departments to ensure they have the correct structure
    const deptRows = (dept || []).map((d: any) => ({
      id: Number(d.id),
      department_name: d.department_name,
      company_id: Number(d.company_id),
      company_name: d.company_name,
    }));

    // Build unique companies from departments
    const map = new Map<number, Company>();
    for (const d of deptRows) {
      if (!map.has(d.company_id)) {
        map.set(d.company_id, { id: d.company_id, name: d.company_name });
      }
    }

    setConfigs(cfg || []);
    setDepartments(deptRows);
    setCompanies(Array.from(map.values()));
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch dropdown options');
  }
};

  useEffect(() => {
    fetchRows();
    fetchOptions();
  }, []);

  // Filter & search
  const filtered = useMemo(() => {
    let list = rows.slice();

    if (companyFilter !== 'all') {
      list = list.filter(r => Number(r.company_id) === Number(companyFilter));
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        String(r.payroll_config_name || r.payroll_config_id || '').toLowerCase().includes(s) ||
        String(r.deduction_name || r.deduction_id || '').toLowerCase().includes(s) ||
        String(r.company_name || r.company_id || '').toLowerCase().includes(s) ||
        String(r.department_name || r.department_id || '').toLowerCase().includes(s) ||
        String(r.remark || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [rows, companyFilter, search]);

  // Paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const clampedPage = Math.min(page, totalPages);
  const paged = filtered.slice((clampedPage - 1) * ITEMS_PER_PAGE, clampedPage * ITEMS_PER_PAGE);

  // Summary cards
  const total = rows.length;
  const companiesCovered = new Set(rows.map(r => r.company_id || r.company_name).filter(Boolean)).size;
  const departmentsCovered = new Set(rows.map(r => r.department_id || r.department_name).filter(Boolean)).size;

  // Actions
  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };
  const handleEdit = (row: PayrollConfigDeductionRow) => {
    setEditData(row);
    setShowModal(true);
  };

  const handleSave = async (data: Partial<PayrollConfigDeductionRow>) => {
    try {
      if (data.id) {
        await api.put(`${API_BASE_URL}/api/payroll-config-deduction/${data.id}`, data);
        toast.success('Updated!');
      } else {
        await api.post(`${API_BASE_URL}/api/payroll-config-deduction`, data);
        toast.success('Added!');
      }
      setShowModal(false);
      setEditData(null);
      fetchRows();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save mapping');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Payroll Deduction Mapping</h1>
        <button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={handleAdd}>
          Add Mapping
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search by config, deduction, company, department or remark…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="select select-bordered"
          value={companyFilter}
          onChange={(e) => {
            setCompanyFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="all">All Companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Mappings</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Companies Covered</div>
          <div className="stat-value text-sm">{companiesCovered}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Departments Covered</div>
          <div className="stat-value text-sm">{departmentsCovered}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded shadow overflow-x-auto">
        {loading ? (
          <div className="py-10 text-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <DeductionTable
            rows={paged}
            onEdit={handleEdit}
            onDeleted={fetchRows}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button className="join-item btn btn-sm" disabled={clampedPage === 1} onClick={() => setPage(1)}>First</button>
            <button className="join-item btn btn-sm" disabled={clampedPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
            {(() => {
              const MAX_VISIBLE = 5;
              let start = 1;
              let end = totalPages;
              if (totalPages > 7) {
                start = Math.max(1, clampedPage - 2);
                end = Math.min(totalPages, start + (MAX_VISIBLE - 1));
                start = Math.max(1, end - (MAX_VISIBLE - 1));
              }
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
                <button
                  key={p}
                  className={`join-item btn btn-sm ${p === clampedPage ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ));
            })()}
            <button className="join-item btn btn-sm" disabled={clampedPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>»</button>
            <button className="join-item btn btn-sm" disabled={clampedPage === totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        </div>
      )}

      {/* Wide modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editData ? 'Edit' : 'Add'} Deduction Mapping
            </h2>

            <PayrollConfigDeductionForm
              initialData={editData || undefined}
              mode={editData ? 'edit' : 'add'}
              onSave={handleSave}
              onCancel={() => { setShowModal(false); setEditData(null); }}
              configs={configs}
              companies={companies}
              departments={departments}
            />
          </div>
        </div>
      )}
    </div>
  );
}