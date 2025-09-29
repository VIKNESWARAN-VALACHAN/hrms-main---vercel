// app/payment-request/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Toaster, toast } from 'react-hot-toast';

// --- Mock Data Types ---
interface Employee { id: number; name: string; dept: string; }
interface CategoryGroup { label: string; options: string[]; }
interface Bank { id: number; name: string; }
type RequestStatus = 'Pending' | 'Approved' | 'Paid' | 'Completed';

interface RequestRecord {
  ticket: string;
  by: string;
  dept: string;
  date: string;
  category: string;
  amount: number;
  status: RequestStatus;
}

// --- Main Component ---
export default function PaymentRequestPage() {
  // --- Mock Data ---
  const EMPLOYEES: Employee[] = [
    { id: 1, name: 'Alice Tan', dept: 'HR' },
    { id: 2, name: 'Bob Lee', dept: 'Finance' },
    { id: 3, name: 'Cindy Ong', dept: 'IT' },
  ];
  const CATEGORY_GROUPS: CategoryGroup[] = [
    { label: 'Travel', options: ['Flight Ticket', 'Accommodation'] },
    { label: 'Office', options: ['Equipment', 'Decoration'] },
    { label: 'Special', options: ['Visa Renewal', 'Team Building', 'Others'] },
  ];
  const BANKS: Bank[] = [
    { id: 1, name: 'Maybank' },
    { id: 2, name: 'CIMB' },
    { id: 3, name: 'RHB' },
  ];

  // --- Dummy History ---
  const DUMMY_HISTORY: RequestRecord[] = [
    { ticket: 'PR-20250821-1023', by: 'Alice Tan', dept: 'HR',      date: '2025-08-21', category: 'Flight Ticket', amount: 1200, status: 'Completed' },
    { ticket: 'PR-20250820-4587', by: 'Bob Lee',   dept: 'Finance', date: '2025-08-20', category: 'Visa Renewal', amount: 300,  status: 'Paid'      },
    { ticket: 'PR-20250819-3301', by: 'Cindy Ong', dept: 'IT',      date: '2025-08-19', category: 'Equipment',      amount: 450,  status: 'Pending'   },
  ];

  // --- State ---
  const [history, setHistory] = useState<RequestRecord[]>(DUMMY_HISTORY);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');

  // Filtered list
  const filteredHistory = useMemo(() => {
    return history.filter(r => {
      const textMatch =
        r.ticket.includes(search) ||
        r.by.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === 'All' || r.status === statusFilter;
      return textMatch && statusMatch;
    });
  }, [history, search, statusFilter]);

  // --- Modal & Form State ---
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'self' | 'behalf'>('self');

  const [ticket, setTicket] = useState('');
  const [requestedBy] = useState({ name: 'Alice Tan', dept: 'HR' });
  const [date] = useState(dayjs().format('YYYY-MM-DD'));

  const [behalfEmp, setBehalfEmp] = useState<number | null>(null);
  const behalfDept = useMemo(
    () => EMPLOYEES.find(e => e.id === behalfEmp)?.dept || '',
    [behalfEmp]
  );

  const [reqType, setReqType] = useState<'Claim' | 'Top-Up'>('Claim');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [bank, setBank] = useState<number | ''>('');
  const [acctNo, setAcctNo] = useState('');
  const [acctName, setAcctName] = useState('');
  const [financeApprover, setFinanceApprover] = useState('Finance Head');

  // Generate ticket on open
  useEffect(() => {
    if (showModal) {
      const seq = Math.floor(1000 + Math.random() * 9000);
      setTicket(`PR-${dayjs().format('YYYYMMDD')}-${seq}`);
    }
  }, [mode, showModal]);

  // Reset form fields
  const resetForm = () => {
    setBehalfEmp(null);
    setReqType('Claim');
    setCategory('');
    setAmount('');
    setPurpose('');
    setRemarks('');
    setAttachment(null);
    setBank('');
    setAcctNo('');
    setAcctName('');
    setFinanceApprover('Finance Head');
  };

  // Handle submit
  const handleSubmit = () => {
    if (!category || amount === '' || !bank || !acctNo.trim() || !acctName.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const record: RequestRecord = {
      ticket,
      by: mode === 'self'
        ? requestedBy.name
        : EMPLOYEES.find(e => e.id === behalfEmp!)?.name || '',
      dept: mode === 'self' ? requestedBy.dept : behalfDept,
      date,
      category,
      amount: amount as number,
      status: 'Pending',
    };
    setHistory([record, ...history]);
    toast.success('Request submitted');
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-3xl font-semibold">Payment Request</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => { setMode('self'); setShowModal(true); }}
          >
            New for Self
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { setMode('behalf'); setShowModal(true); }}
          >
            New on Behalf
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by ticket, name, category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered flex-1"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="select select-bordered w-full sm:w-48"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Paid">Paid</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>By</th>
              <th>Dept</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map(r => (
                <tr key={r.ticket}>
                  <td>{r.ticket}</td>
                  <td>{r.by}</td>
                  <td>{r.dept}</td>
                  <td>{r.date}</td>
                  <td>{r.category}</td>
                  <td className="font-medium">MYR {r.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${
                      r.status === 'Pending' ? 'warning' :
                      r.status === 'Approved' ? 'info' :
                      r.status === 'Paid' ? 'success' : 'ghost'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => toast(`Viewing ${r.ticket}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">New Payment Request</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => { setShowModal(false); resetForm(); }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  className={`pb-2 border-b-2 ${
                    mode === 'self' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
                  }`}
                  onClick={() => setMode('self')}
                >
                  For Self
                </button>
                <button
                  className={`pb-2 border-b-2 ${
                    mode === 'behalf' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
                  }`}
                  onClick={() => setMode('behalf')}
                >
                  On Behalf
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-medium">Ticket No.</label>
                    <input readOnly value={ticket} className="input input-bordered w-full bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text font-medium">Date</label>
                      <input readOnly value={date} className="input input-bordered w-full bg-gray-100" />
                    </div>
                    <div>
                      <label className="label-text font-medium">Requested By</label>
                      <input readOnly value={requestedBy.name} className="input input-bordered w-full bg-gray-100" />
                    </div>
                  </div>

                  {mode === 'behalf' && (
                    <>
                      <div>
                        <label className="label-text font-medium">Employee</label>
                        <select
                          className="select select-bordered w-full"
                          value={behalfEmp ?? ''}
                          onChange={e => setBehalfEmp(+e.target.value)}
                        >
                          <option value="">Select employee</option>
                          {EMPLOYEES.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </div>
                      {behalfEmp && (
                        <div>
                          <label className="label-text font-medium">Department</label>
                          <input readOnly value={behalfDept} className="input input-bordered w-full bg-gray-100" />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="label-text font-medium">Request Type</label>
                    <select
                      className="select select-bordered w-full"
                      value={reqType}
                      onChange={e => setReqType(e.target.value as any)}
                    >
                      <option>Claim</option>
                      <option>Top-Up</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-text font-medium">Category</label>
                    <select
                      className="select select-bordered w-full"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="">Choose category</option>
                      {CATEGORY_GROUPS.map(g => (
                        <optgroup key={g.label} label={g.label}>
                          {g.options.map(o => (
                            <option key={o}>{o}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-text font-medium">Amount (MYR)</label>
                    <input
                      type="number"
                      min={0}
                      className="input input-bordered w-full"
                      value={amount}
                      onChange={e => setAmount(e.target.value === '' ? '' : +e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Purpose</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="e.g. Business trip to KL"
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Remarks</label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={2}
                      placeholder="Additional details..."
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Attachment</label>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      onChange={e => setAttachment(e.target.files![0] || null)}
                    />
                    {attachment && <p className="text-sm mt-1">{attachment.name}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-medium">Bank</label>
                    <select
                      className="select select-bordered w-full"
                      value={bank}
                      onChange={e => setBank(+e.target.value)}
                    >
                      <option value="">Select bank</option>
                      {BANKS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-text font-medium">Account No.</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="e.g. 1234 5678 9012"
                      value={acctNo}
                      onChange={e => setAcctNo(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Account Name</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="Account holder name"
                      value={acctName}
                      onChange={e => setAcctName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Dept Approver</label>
                    <input
                      readOnly
                      value={mode === 'self' ? `${requestedBy.dept} Head` : `${behalfDept} Head`}
                      className="input input-bordered w-full bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="label-text font-medium">Finance Approver</label>
                    <select
                      className="select select-bordered w-full"
                      value={financeApprover}
                      onChange={e => setFinanceApprover(e.target.value)}
                    >
                      <option>Finance Head</option>
                      <option>Finance Manager</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button
                className="btn btn-outline"
                onClick={() => { setShowModal(false); resetForm(); }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
