'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL, API_ROUTES } from '@/app/config';
import { toast } from 'react-hot-toast';

interface PayrollConfig {
  id?: number;
  pay_interval: string;
  cutoff_day: number;
  payment_day: number;
  late_penalty_type: string;
  late_penalty_amount: number;
  ot_multiplier: number;
  default_currency: string;
  auto_carry_forward: number;
}

export default function PayrollConfigPage() {
  const [configs, setConfigs] = useState<PayrollConfig[]>([]);
  const [form, setForm] = useState<PayrollConfig>({
    pay_interval: 'Monthly',
    cutoff_day: 25,
    payment_day: 28,
    late_penalty_type: 'Fixed',
    late_penalty_amount: 50,
    ot_multiplier: 1.5,
    default_currency: 'MYR',
    auto_carry_forward: 1,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.payrollConfig}`);
      const data = await res.json();
      setConfigs(data);
    } catch {
      toast.error('Failed to load configs');
    }
  };

  const fetchSingleConfig = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.payrollConfig}/${id}`);
      const data = await res.json();
      setForm(data);
      setEditId(id);
      setShowModal(true);
    } catch {
      toast.error('Failed to load config');
    }
  };

  const handleSubmit = async () => {
    const url = editId
      ? `${API_BASE_URL}${API_ROUTES.payrollConfig}/${editId}`
      : `${API_BASE_URL}${API_ROUTES.payrollConfig}`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed');
      toast.success(editId ? 'Config updated' : 'Config created');
      setShowModal(false);
      resetForm();
      fetchConfigs();
    } catch {
      toast.error('Submit failed');
    }
  };

  const resetForm = () => {
    setForm({
      pay_interval: 'Monthly',
      cutoff_day: 25,
      payment_day: 28,
      late_penalty_type: 'Fixed',
      late_penalty_amount: 50,
      ot_multiplier: 1.5,
      default_currency: 'MYR',
      auto_carry_forward: 1,
    });
    setEditId(null);
  };

  const deleteConfig = async (id: number) => {
    if (!confirm('Delete config?')) return;
    try {
      await fetch(`${API_BASE_URL}${API_ROUTES.payrollConfig}/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchConfigs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const exportConfig = (id: number) => {
    window.open(`${API_BASE_URL}${API_ROUTES.payrollConfig}/${id}/export`, '_blank');
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const paginatedData = configs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(configs.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payroll Configurations</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">+ Add Config</button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Interval</th><th>Cutoff</th><th>Pay Day</th><th>Late Type</th><th>Penalty</th><th>OT</th><th>Currency</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((cfg) => (
            <tr key={cfg.id}>
              <td>{cfg.pay_interval}</td>
              <td>{cfg.cutoff_day}</td>
              <td>{cfg.payment_day}</td>
              <td>{cfg.late_penalty_type}</td>
              <td>{cfg.late_penalty_amount}</td>
              <td>{cfg.ot_multiplier}</td>
              <td>{cfg.default_currency}</td>
              <td className="space-x-2">
                <button onClick={() => fetchSingleConfig(cfg.id!)} className="btn btn-sm btn-info">Edit</button>
                <button onClick={() => exportConfig(cfg.id!)} className="btn btn-sm btn-outline">Export</button>
                <button onClick={() => deleteConfig(cfg.id!)} className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-black">{editId ? 'Edit' : 'Create'} Payroll Config</h2>
            <div className="grid grid-cols-2 gap-4">
             <select
  value={form.pay_interval}
  onChange={(e) => setForm({ ...form, pay_interval: e.target.value })}
  className="input input-bordered"
>
  <option value="Monthly">Monthly</option>
  <option value="Bi-Weekly">Bi-Weekly</option>
</select>

             <input type="number" placeholder="Cutoff" value={form.cutoff_day} onChange={(e) => setForm({ ...form, cutoff_day: +e.target.value })} className="input input-bordered" />
              <input type="number" placeholder="Payment Day" value={form.payment_day} onChange={(e) => setForm({ ...form, payment_day: +e.target.value })} className="input input-bordered" />
              <input placeholder="Late Type" value={form.late_penalty_type} onChange={(e) => setForm({ ...form, late_penalty_type: e.target.value })} className="input input-bordered" />
              <input type="number" placeholder="Penalty" value={form.late_penalty_amount} onChange={(e) => setForm({ ...form, late_penalty_amount: +e.target.value })} className="input input-bordered" />
              <input type="number" placeholder="OT Multiplier" value={form.ot_multiplier} onChange={(e) => setForm({ ...form, ot_multiplier: +e.target.value })} className="input input-bordered" />
              <input placeholder="Currency" value={form.default_currency} onChange={(e) => setForm({ ...form, default_currency: e.target.value })} className="input input-bordered" />
              <select value={form.auto_carry_forward} onChange={(e) => setForm({ ...form, auto_carry_forward: +e.target.value })} className="input input-bordered">
                <option value={1}>Auto Carry Forward: Yes</option>
                <option value={0}>Auto Carry Forward: No</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="btn btn">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
