'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PayrollConfigForm, { PayrollConfig } from '../form';
import { API_BASE_URL } from '../../../config';

export default function PayrollConfigDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [config, setConfig] = useState<PayrollConfig | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/payroll-config/configs/${id}`)
      .then((r) => r.json())
      .then(setConfig);
  }, [id]);

  if (!config) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Payroll Config Detail</h1>
      <table className="table w-full mb-6">
        <tbody>
          <tr><td>ID</td><td>{config.id}</td></tr>
          <tr><td>Interval</td><td>{config.pay_interval}</td></tr>
          <tr><td>Cutoff</td><td>{config.cutoff_day}</td></tr>
          <tr><td>Payment</td><td>{config.payment_day}</td></tr>
          <tr><td>Penalty Type</td><td>{config.late_penalty_type}</td></tr>
          <tr><td>Penalty Amount</td><td>{config.late_penalty_amount}</td></tr>
          <tr><td>OT Multiplier</td><td>{config.ot_multiplier}</td></tr>
          <tr><td>Currency</td><td>{config.default_currency}</td></tr>
          <tr><td>Carry Forward</td><td>{config.auto_carry_forward ? 'Yes' : 'No'}</td></tr>
        </tbody>
      </table>
      <button className="btn btn-primary mr-2" onClick={() => setShowForm(true)}>
        Edit
      </button>
      <button className="btn btn-secondary" onClick={() => router.push('./')}>
        Back
      </button>
      {showForm && (
        <PayrollConfigForm
          mode="edit"
          initialData={config}
          onSave={() => { setShowForm(false); router.refresh(); }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
