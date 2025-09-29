'use client';

import React, { useState } from 'react';
import type { PayrollConfig } from './PayrollConfigTable';

interface Props {
  initial?: Partial<PayrollConfig>;
  onSave: (form: Partial<PayrollConfig>) => void;
  onCancel: () => void;
  saving?: boolean;
}

const payIntervals = ['Monthly', 'Bi-Weekly', 'Weekly'];

export default function PayrollConfigForm({ initial = {}, onSave, onCancel, saving }: Props) {
const [form, setForm] = useState<Partial<PayrollConfig>>({
  pay_interval: initial.pay_interval || '',
  cutoff_day: typeof initial.cutoff_day === 'number' ? initial.cutoff_day : undefined,
  payment_day: typeof initial.payment_day === 'number' ? initial.payment_day : undefined,
  late_penalty_type: initial.late_penalty_type || '',
  late_penalty_amount: typeof initial.late_penalty_amount === 'number' ? initial.late_penalty_amount : undefined,
  ot_multiplier: typeof initial.ot_multiplier === 'number' ? initial.ot_multiplier : undefined,
  default_currency: initial.default_currency || 'MYR',
  auto_carry_forward: typeof initial.auto_carry_forward === 'number' ? initial.auto_carry_forward : 0,
});


  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-2"
    >
      <select
        className="input input-bordered w-full"
        value={form.pay_interval}
        onChange={e => setForm(f => ({ ...f, pay_interval: e.target.value }))}
        required
      >
        <option value="">Select Pay Interval</option>
        {payIntervals.map(interval => (
          <option key={interval} value={interval}>{interval}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Cutoff Day"
        className="input input-bordered w-full"
        value={form.cutoff_day}
        onChange={e => setForm(f => ({ ...f, cutoff_day: Number(e.target.value) }))}
        required
      />
      <input
        type="number"
        placeholder="Payment Day"
        className="input input-bordered w-full"
        value={form.payment_day}
        onChange={e => setForm(f => ({ ...f, payment_day: Number(e.target.value) }))}
        required
      />
      <input
        type="text"
        placeholder="Late Penalty Type (Percentage/Flat)"
        className="input input-bordered w-full"
        value={form.late_penalty_type}
        onChange={e => setForm(f => ({ ...f, late_penalty_type: e.target.value }))}
        required
      />
      <input
        type="number"
        placeholder="Late Penalty Amount"
        className="input input-bordered w-full"
        value={form.late_penalty_amount}
        onChange={e => setForm(f => ({ ...f, late_penalty_amount: Number(e.target.value) }))}
        required
      />
      <input
        type="number"
        placeholder="OT Multiplier"
        className="input input-bordered w-full"
        value={form.ot_multiplier}
        onChange={e => setForm(f => ({ ...f, ot_multiplier: Number(e.target.value) }))}
        required
      />
      <input
        type="text"
        placeholder="Default Currency"
        className="input input-bordered w-full"
        value={form.default_currency}
        onChange={e => setForm(f => ({ ...f, default_currency: e.target.value }))}
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!form.auto_carry_forward}
          onChange={e => setForm(f => ({ ...f, auto_carry_forward: e.target.checked ? 1 : 0 }))}
        />
        <span>Enable Auto Carry Forward</span>
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}
