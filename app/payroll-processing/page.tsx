'use client';

import { useState } from 'react';
import { API_BASE_URL, API_ROUTES } from '@/app/config';
import { toast } from 'react-hot-toast';

export default function PayrollProcessingPage() {
  const [month, setMonth] = useState('2025-06');
  const [status, setStatus] = useState('');

  const process = async () => {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.payrollProcess.base}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    if (res.ok) {
      toast.success('Payroll processed');
    } else toast.error('Error processing payroll');
  };

  const checkStatus = async () => {
    const [y, m] = month.split('-');
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.payrollProcess.status(m, y)}`);
    const data = await res.json();
    setStatus(JSON.stringify(data));
  };

  const lock = async () => {
    await fetch(`${API_BASE_URL}${API_ROUTES.payrollProcess.lock}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period: month })
    });
    toast.success('Payroll locked');
  };

  const unlock = async () => {
    await fetch(`${API_BASE_URL}${API_ROUTES.payrollProcess.unlock}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period: month })
    });
    toast.success('Payroll unlocked');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payroll Processing</h1>
      <div className="mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input input-bordered"
        />
      </div>
      <div className="space-x-2 mb-4">
        <button className="btn btn-primary" onClick={process}>Process</button>
        <button className="btn btn-info" onClick={checkStatus}>Check Status</button>
        <button className="btn btn-warning" onClick={lock}>Lock</button>
        <button className="btn btn-outline" onClick={unlock}>Unlock</button>
      </div>
      {status && <div className="bg-base-200 p-4 rounded">{status}</div>}
    </div>
  );
}
