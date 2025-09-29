// 'use client';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { API_BASE_URL } from '../../../config';

// function formatDate(dt: string) {
//   if (!dt) return '';
//   const d = new Date(dt);
//   return d.toLocaleString('en-GB', {
//     year: 'numeric', month: '2-digit', day: '2-digit',
//     hour: '2-digit', minute: '2-digit'
//   }).replace(',', '');
// }

// interface AssetRequest {
//   id: number;
//   serial_no: string;
//   category: string;
//   asset_type_name: string;
//   brand_name: string;
//   model_name: string;
//   employee_name: string;
//   behalf_name: string;
//   purpose: string;
//   remarks: string | null;
//   quantity: number;
//   created_at: string;
//   status_name: string | null;
// }

// const STATUS_LIST = [
//   { value: '', label: 'All' },
//   { value: 'Pending', label: 'Pending' },
//   { value: 'Approved', label: 'Approved' },
//   { value: 'Rejected', label: 'Rejected' },
// ];

// const PAGE_SIZE = 10;

// export default function RequestsApprovalList() {
//   const [requests, setRequests] = useState<AssetRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [status, setStatus] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [searchValue, setSearchValue] = useState('');

//   useEffect(() => {
//     setLoading(true);
//     const url = new URL(`${API_BASE_URL}/api/inventory/asset-requests-paging`);
//     url.searchParams.append('page', page.toString());
//     url.searchParams.append('limit', PAGE_SIZE.toString());
//     if (status) url.searchParams.append('status', status);
//     if (keyword) url.searchParams.append('keyword', keyword);

//     fetch(url.toString())
//       .then(res => res.json())
//       .then(data => {
//         setRequests(data.data || []);
//         setPage(data.page || 1);
//         setTotalPages(data.totalPages || 1);
//         setTotal(data.total || 0);
//       })
//       .finally(() => setLoading(false));
//   }, [page, status, keyword]);

//   function onSearchSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setPage(1);
//     setKeyword(searchValue.trim());
//   }

//   function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
//     setStatus(e.target.value);
//     setPage(1);
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Asset Requests Approval</h1>
//       {/* Filters */}
//       <form className="flex gap-2 mb-4" onSubmit={onSearchSubmit}>
//         <input
//           type="text"
//           placeholder="Search serial, name, purpose..."
//           value={searchValue}
//           onChange={e => setSearchValue(e.target.value)}
//           className="input input-bordered input-sm w-48"
//         />
//         <button type="submit" className="btn btn-sm btn-primary">Search</button>
//         <select
//           value={status}
//           onChange={onStatusChange}
//           className="select select-bordered select-sm w-32"
//         >
//           {STATUS_LIST.map(s => (
//             <option key={s.value} value={s.value}>{s.label}</option>
//           ))}
//         </select>
//         <div className="ml-auto text-sm text-slate-500">{`Total: ${total}`}</div>
//       </form>
//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow">
//         <table className="table w-full border">
//           <thead>
//             <tr>
//               <th>Request No</th>
//               <th>Date</th>
//               <th>Requested By</th>
//               <th>On Behalf</th>
//               <th>Asset Type</th>
//               <th>Brand</th>
//               <th>Model</th>
//               <th>Qty</th>
//               <th>Purpose</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={11} className="text-center py-8">Loading...</td>
//               </tr>
//             ) : requests.length === 0 ? (
//               <tr>
//                 <td colSpan={11} className="text-center py-8">No asset requests.</td>
//               </tr>
//             ) : requests.map(r => (
//               <tr key={r.id}>
//                 <td>{r.serial_no}</td>
//                 <td>{formatDate(r.created_at)}</td>
//                 <td>{r.employee_name}</td>
//                 <td>{r.behalf_name || <span className="text-gray-400">-</span>}</td>
//                 <td>{r.asset_type_name}</td>
//                 <td>{r.brand_name}</td>
//                 <td>{r.model_name}</td>
//                 <td>{r.quantity}</td>
//                 <td>{r.purpose}</td>
//                 <td>
//                   <span className={`badge ${
//                     r.status_name === 'Approved' ? 'badge-success'
//                       : r.status_name === 'Rejected' ? 'badge-error'
//                       : 'badge-warning'
//                   }`}>
//                     {r.status_name || 'Pending'}
//                   </span>
//                 </td>
//                 <td>
//                   <Link href={`/admins/assets/approval/${r.id}`}>
//                     <span className="btn btn-xs btn-primary">View</span>
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <div className="text-sm">
//           Page {page} of {totalPages}
//         </div>
//         <div className="space-x-1">
//           <button
//             className="btn btn-xs"
//             disabled={page <= 1}
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//           >Prev</button>
//           <button
//             className="btn btn-xs"
//             disabled={page >= totalPages}
//             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//           >Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../../config';

function formatDate(dt: string) {
  if (!dt) return '';
  const d = new Date(dt);
  return d
    .toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '');
}

interface AssetRequest {
  id: number;
  serial_no: string;
  category: string;
  asset_type_name: string;
  brand_name: string;
  model_name: string;
  employee_name: string;
  behalf_name: string;
  purpose: string;
  remarks: string | null;
  quantity: number;
  created_at: string;
  status_name: string | null;
}

const STATUS_LIST = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const PAGE_SIZE = 10;

/** Responsive, non-wrapping badge renderer */
function StatusBadge({ status }: { status: string | null }) {
  const label = (status?.trim() || 'Pending') as string;
  const key = label.toLowerCase();

  // base badge style: small on mobile, slightly larger on md+
  const base =
    'badge whitespace-nowrap inline-flex items-center justify-center rounded-full ' +
    'text-[11px] sm:text-xs px-2 py-1 sm:px-3';

  let tone = 'badge-ghost';
  if (key === 'approved') tone = 'badge-success';
  else if (key === 'rejected') tone = 'badge-error';
  else if (key === 'pending' || key === 'in progress') tone = 'badge-warning';

  return <span className={`${base} ${tone}`}>{label}</span>;
}

export default function RequestsApprovalList() {
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = new URL(`${API_BASE_URL}/api/inventory/asset-requests-paging`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', PAGE_SIZE.toString());
    if (status) url.searchParams.append('status', status);
    if (keyword) url.searchParams.append('keyword', keyword);

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.data || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, status, keyword]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setKeyword(searchValue.trim());
  }

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Asset Requests Approval</h1>

      {/* Filters */}
      <form className="flex flex-wrap gap-2 mb-4 items-center" onSubmit={onSearchSubmit}>
        <input
          type="text"
          placeholder="Search serial, name, purpose..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="input input-bordered input-sm w-60"
        />
        <button type="submit" className="btn btn-sm btn-primary">
          Search
        </button>
        <select
          value={status}
          onChange={onStatusChange}
          className="select select-bordered select-sm w-36"
        >
          {STATUS_LIST.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="ml-auto text-sm text-slate-500">{`Total: ${total}`}</div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow">
        <table className="table w-full border">
          <thead>
            <tr>
              <th>Request No</th>
              <th>Date</th>
              <th>Requested By</th>
              <th>On Behalf</th>
              <th>Asset Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Qty</th>
              <th>Purpose</th>
              <th className="w-32 md:w-40">Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8">
                  No asset requests.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap">{r.serial_no}</td>
                  <td className="whitespace-nowrap">{formatDate(r.created_at)}</td>
                  <td className="whitespace-nowrap">{r.employee_name}</td>
                  <td className="whitespace-nowrap">
                    {r.behalf_name || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="whitespace-nowrap">{r.asset_type_name}</td>
                  <td className="whitespace-nowrap">{r.brand_name}</td>
                  <td className="whitespace-nowrap">{r.model_name}</td>
                  <td className="whitespace-nowrap">{r.quantity}</td>
                  <td>{r.purpose}</td>
                  <td className="whitespace-nowrap">
                    <StatusBadge status={r.status_name} />
                  </td>
                  <td className="whitespace-nowrap">
                    <Link href={`/admins/assets/approval/${r.id}`}>
                      <span className="btn btn-xs btn-primary">View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
        <div className="text-sm">Page {page} of {totalPages}</div>
        <div className="space-x-1">
          <button
            className="btn btn-xs"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn btn-xs"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
