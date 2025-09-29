'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import PayrollConfigForm, { PayrollConfig } from './form';
import { API_BASE_URL } from '../../config';

export default function PayrollConfigPage() {
  const [configs, setConfigs] = useState<PayrollConfig[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PayrollConfig> | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    //(`${API_BASE_URL}/api/payroll-config/configs`);
    const res = await fetch(`${API_BASE_URL}/api/payroll-config/configs`);
    setConfigs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchConfigs(); }, []);

  const handleSave = () => {
    setShowModal(false);
    setFormData(null);
    setEditId(null);
    fetchConfigs();
  };

  const handleEdit = (cfg: PayrollConfig) => {
    setFormData(cfg);
    setEditId(cfg.id!);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this config?')) return;
    await fetch(`/api/payroll-config/configs/${id}`, { method: 'DELETE' });
    toast.success('Deleted!');
    fetchConfigs();
  };

  const filtered = configs.filter(cfg =>
    (cfg.pay_interval || '').toLowerCase().includes(search.toLowerCase()) ||
    (cfg.default_currency || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Configurations</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormData(null); setEditId(null); }}>
          + Add Payroll Config
        </button>
      </div>
      <input
        className="input input-bordered w-full mb-4"
        placeholder="Search interval/currency"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Interval</th>
              <th>Cutoff</th>
              <th>Payment</th>
              <th>Penalty Type</th>
              <th>Penalty Amt</th>
              <th>OT Multiplier</th>
              <th>Currency</th>
              <th>Carry Forward</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cfg => (
              <tr key={cfg.id}>
                <td>{cfg.id}</td>
                <td>{cfg.pay_interval}</td>
                <td>{cfg.cutoff_day}</td>
                <td>{cfg.payment_day}</td>
                <td>{cfg.late_penalty_type}</td>
                <td>{cfg.late_penalty_amount}</td>
                <td>{cfg.ot_multiplier}</td>
                <td>{cfg.default_currency}</td>
                <td>{cfg.auto_carry_forward ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-xs btn-warning mr-2" onClick={() => handleEdit(cfg)}>Edit</button>
                  <a className="btn btn-xs btn-info mr-2" href={`payroll-config/${cfg.id}`}>View</a>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(cfg.id!)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="text-center">No data</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <PayrollConfigForm
          mode={editId ? 'edit' : 'add'}
          initialData={formData || undefined}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditId(null); setFormData(null); }}
        />
      )}
    </div>
  );
}
