'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

export interface PayrollConfig {
  id?: number;
  pay_interval?: string;
  cutoff_day?: number;
  payment_day?: number;
  late_penalty_type?: string;
  late_penalty_amount?: number;
  ot_multiplier?: number;
  default_currency?: string;
  auto_carry_forward?: number;
}

interface PayrollConfigFormProps {
  initialData?: Partial<PayrollConfig>;
  mode?: 'add' | 'edit';
  onSave: () => void;
  onCancel: () => void;
}

const defaultData: Partial<PayrollConfig> = {
  pay_interval: '',
  cutoff_day: 1,
  payment_day: 1,
  late_penalty_type: '',
  late_penalty_amount: 0,
  ot_multiplier: 1,
  default_currency: 'MYR',
  auto_carry_forward: 0,
};

const PayrollConfigForm: React.FC<PayrollConfigFormProps> = ({
  initialData = {},
  mode = 'add',
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Partial<PayrollConfig>>({ ...defaultData, ...initialData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'cutoff_day' ||
        name === 'payment_day' ||
        name === 'auto_carry_forward'
          ? parseInt(value)
          : name === 'late_penalty_amount' || name === 'ot_multiplier'
          ? parseFloat(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = JSON.stringify(form);
      const url =
        (API_BASE_URL || '') +
        (mode === 'add'
          ? '/api/payroll-config/configs'
          : `/api/payroll-config/configs/${form.id}`);
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg?.error || 'Server error');
      }
      toast.success(mode === 'edit' ? 'Updated!' : 'Added!');
      onSave();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
        autoComplete="off"
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === 'edit' ? 'Edit' : 'Add'} Payroll Config
        </h2>
        <div className="mb-3">
          <label className="block mb-1">Interval</label>
          <input
            name="pay_interval"
            className="input input-bordered w-full"
            value={form.pay_interval ?? ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Cutoff Day</label>
          <input
            type="number"
            name="cutoff_day"
            className="input input-bordered w-full"
            value={form.cutoff_day ?? ''}
            onChange={handleChange}
            min={1}
            max={31}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Payment Day</label>
          <input
            type="number"
            name="payment_day"
            className="input input-bordered w-full"
            value={form.payment_day ?? ''}
            onChange={handleChange}
            min={1}
            max={31}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Penalty Type</label>
          <input
            name="late_penalty_type"
            className="input input-bordered w-full"
            value={form.late_penalty_type ?? ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Penalty Amount</label>
          <input
            type="number"
            step="0.01"
            name="late_penalty_amount"
            className="input input-bordered w-full"
            value={form.late_penalty_amount ?? ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">OT Multiplier</label>
          <input
            type="number"
            step="0.01"
            name="ot_multiplier"
            className="input input-bordered w-full"
            value={form.ot_multiplier ?? ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Currency</label>
          <input
            name="default_currency"
            className="input input-bordered w-full"
            value={form.default_currency ?? ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Auto Carry Forward</label>
          <select
            name="auto_carry_forward"
            className="input input-bordered w-full"
            value={form.auto_carry_forward ?? 0}
            onChange={handleChange}
            required
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">{error}</div>
        )}
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollConfigForm;
