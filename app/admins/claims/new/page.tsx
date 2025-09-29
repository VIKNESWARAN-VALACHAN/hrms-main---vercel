'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios, { AxiosProgressEvent } from 'axios';
import { API_BASE_URL } from '../../../config';
import { Briefcase, Building, Users, User, DollarSign, CalendarDays, MessageSquare, UploadCloud, XCircle } from 'lucide-react';

/* ---------- TYPES ---------- */
interface Company   { id: number; name: string; }
interface Dept      { id: number; name: string; company_id: number; }
interface Employee  { id: number; name: string; department_id: number; company_id: number; }
interface Benefit   { id: number; benefit_type: string; description: string; frequency: string; entitled: string; claimed: string; balance: string; effective_from: string; effective_to: string; status: 'Active' | 'Upcoming' | 'Expired'; }

interface FormData {
  employee_id:       string;
  benefit_type_id:   string;
  amount:            string;
  claim_date:        string;
  employee_remark:   string;
}

/* ---------- HELPERS ---------- */
const formatCurrency = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `RM ${n.toFixed(2)}`;
};

/* ---------- PAGE ---------- */
export default function AdminNewClaimPage() {
  const router = useRouter();

  /* ---- DATA ---- */
  const [companies, setCompanies]   = useState<Company[]>([]);
  const [departments, setDepts]     = useState<Dept[]>([]);
  const [employees, setEmployees]   = useState<Employee[]>([]);
  const [benefits, setBenefits]     = useState<Benefit[]>([]);

  /* ---- FORM ---- */
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDept, setSelectedDept]       = useState<string>('');
  const [selectedEmployee, setSelectedEmployee]= useState<string>('');
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [amountError, setAmountError]         = useState('');
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [selectedFile, setSelectedFile]       = useState<File | null>(null);
  const [isDragActive, setIsDragActive]       = useState(false);

  const [formData, setFormData] = useState<FormData>({
    employee_id:      '',
    benefit_type_id:  '',
    amount:           '',
    claim_date:       new Date().toISOString().split('T')[0],
    employee_remark:  '',
  });

  /* ---- INITIAL LOAD ---- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/companies`)
      .then(r => r.json())
      .then(setCompanies)
      .catch(() => toast.error('Failed to load companies'));
  }, []);

  /* ---- CASCADING DROPDOWNS ---- */
  useEffect(() => {
    if (!selectedCompany) { setDepts([]); setEmployees([]); setBenefits([]); return; }
    fetch(`${API_BASE_URL}/api/departments?company_id=${selectedCompany}`)
      .then(r => r.json())
      .then(setDepts)
      .catch(() => toast.error('Failed to load departments'));
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedDept) { setEmployees([]); setBenefits([]); return; }
    fetch(`${API_BASE_URL}/api/employees?department_id=${selectedDept}`)
      .then(r => r.json())
      .then(setEmployees)
      .catch(() => toast.error('Failed to load employees'));
  }, [selectedDept]);

  useEffect(() => {
    if (!selectedEmployee) { setBenefits([]); return; }
    fetch(`${API_BASE_URL}/api/employee-benefits/summary/${selectedEmployee}`)
      .then(r => r.json())
      .then((data: Benefit[]) => setBenefits(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load benefits'));
  }, [selectedEmployee]);

  /* ---- HANDLERS (same as employee form) ---- */
  const handleBenefitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const b  = benefits.find(x => x.id.toString() === id) ?? null;
    setSelectedBenefit(b);
    setFormData(prev => ({ ...prev, benefit_type_id: id, amount: '' }));
    setAmountError('');
    if (b && parseFloat(b.balance) <= 0) toast.error('This benefit has no available balance', { style: { background: '#fee2e2', color: '#b91c1c' } });
  };

  const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, amount: val }));
    if (!selectedBenefit) return;
    const balance = parseFloat(selectedBenefit.balance);
    const amt     = parseFloat(val);
    if (val === '') setAmountError('');
    else if (isNaN(amt)) setAmountError('Invalid amount');
    else if (amt <= 0) setAmountError('Amount must be > 0');
    else if (amt > balance) setAmountError(`Exceeds balance (${formatCurrency(balance)})`);
    else setAmountError('');
  };

  /* ---- SUBMIT ---- */
  const handleSubmit = async () => {
    if (!formData.employee_id || !formData.benefit_type_id) { toast.error('Please complete all required fields'); return; }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0 || amountError) { toast.error('Please enter a valid amount'); return; }

    setIsSubmitting(true);
    try {
      /* 1. create claim */
      const claimRes = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id:      parseInt(formData.employee_id),
          benefit_type_id:  parseInt(formData.benefit_type_id),
          claim_date:       formData.claim_date,
          amount:           amt,
          employee_remark:  formData.employee_remark,
        }),
      });
      if (!claimRes.ok) throw new Error((await claimRes.json()).message || 'Claim failed');
      const { claim_id } = await claimRes.json();

      /* 2. upload file (if any) */
      if (selectedFile) {
        const fd = new FormData();
        fd.append('attachment', selectedFile);
        fd.append('claim_id', claim_id.toString());
        fd.append('uploaded_by', '0'); // 0 = admin
        await axios.post(`${API_BASE_URL}/api/claims/attachments`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) console.log(`Upload: ${Math.round((e.loaded * 100) / e.total)}%`);
          },
        });
      }

      toast.success('Claim created on behalf of employee!');
      setTimeout(() => router.push('/admin/claims'), 1200);
    } catch (e: any) {
      toast.error(e.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Add Claim on Behalf</h1>
          <p className="text-sm text-base-content/70 mt-1">Select company → department → employee → benefit</p>
        </div>
        <Link href="/admin/claims" className="btn btn-outline btn-sm gap-2">
          <XCircle className="w-4 h-4" /> Close
        </Link>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-200 space-y-6">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><Building className="inline w-4 h-4 mr-2" />Company <span className="text-error">*</span></label>
          <select className="select select-bordered w-full" value={selectedCompany} onChange={e => { setSelectedCompany(e.target.value); setSelectedDept(''); setSelectedEmployee(''); setSelectedBenefit(null); }} required>
            <option value="">-- choose company --</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><Briefcase className="inline w-4 h-4 mr-2" />Department <span className="text-error">*</span></label>
          <select className="select select-bordered w-full" value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedEmployee(''); setSelectedBenefit(null); }} disabled={!selectedCompany} required>
            <option value="">-- choose department --</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><Users className="inline w-4 h-4 mr-2" />Employee <span className="text-error">*</span></label>
          <select className="select select-bordered w-full" value={selectedEmployee} onChange={e => { setSelectedEmployee(e.target.value); setFormData(p => ({ ...p, employee_id: e.target.value })); setSelectedBenefit(null); }} disabled={!selectedDept} required>
            <option value="">-- choose employee --</option>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        </div>

        {/* Benefit */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><User className="inline w-4 h-4 mr-2" />Benefit <span className="text-error">*</span></label>
          <select className="select select-bordered w-full" value={formData.benefit_type_id} onChange={handleBenefitChange} disabled={!selectedEmployee} required>
            <option value="">-- choose benefit --</option>
            {benefits.map(b => {
              const disabled = b.status !== 'Active' || parseFloat(b.balance) <= 0;
              return <option key={b.id} value={disabled ? '' : b.id} disabled={disabled} className={disabled ? 'text-base-content/40' : ''}>
                {b.benefit_type} {disabled && `(No balance / ${b.status})`}
              </option>;
            })}
          </select>
          {selectedBenefit && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300 grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-base-content/70">Entitled</p><p className="font-bold text-primary">{formatCurrency(selectedBenefit.entitled)}</p></div>
              <div><p className="text-base-content/70">Claimed</p><p className="font-bold text-secondary">{formatCurrency(selectedBenefit.claimed)}</p></div>
              <div><p className="text-base-content/70">Balance</p><p className={`font-bold ${parseFloat(selectedBenefit.balance) > 0 ? 'text-success' : 'text-error'}`}>{formatCurrency(selectedBenefit.balance)}</p></div>
              {selectedBenefit.description && <div className="col-span-3 mt-2 text-xs italic text-base-content/80">{selectedBenefit.description}</div>}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><DollarSign className="inline w-4 h-4 mr-2" />Amount (RM) <span className="text-error">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-base-content/70">RM</span>
            <input type="number" step="0.01" min="0" className={`input input-bordered w-full pl-12 ${amountError ? 'input-error' : ''}`} value={formData.amount} onChange={handleAmountChange} placeholder="0.00" disabled={!selectedBenefit} required />
          </div>
          {amountError && <p className="mt-1 text-sm text-error">{amountError}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><CalendarDays className="inline w-4 h-4 mr-2" />Claim Date <span className="text-error">*</span></label>
          <input type="date" className="input input-bordered w-full" value={formData.claim_date} onChange={e => setFormData(p => ({ ...p, claim_date: e.target.value }))} max={new Date().toISOString().split('T')[0]} required />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><MessageSquare className="inline w-4 h-4 mr-2" />Remarks</label>
          <textarea className="textarea textarea-bordered w-full" rows={4} value={formData.employee_remark} onChange={e => setFormData(p => ({ ...p, employee_remark: e.target.value }))} placeholder="Optional internal note" />
        </div>

        {/* File */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2"><UploadCloud className="inline w-4 h-4 mr-2" />Attachment</label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-base-300'}`}
            onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={e => { e.preventDefault(); setIsDragActive(false); if (e.dataTransfer.files?.length) setSelectedFile(e.dataTransfer.files[0]); }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-base-content/70">{isDragActive ? 'Drop file here' : 'Upload MC / receipt / etc'}</p>
              {!selectedFile && <label className="btn btn-sm btn-outline btn-primary cursor-pointer">+ Add<input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => e.target.files?.length && setSelectedFile(e.target.files[0])} /></label>}
            </div>
            {selectedFile && <div className="mt-2 flex items-center gap-2"><span className="badge badge-primary">{selectedFile.name}</span><button type="button" className="btn btn-xs btn-ghost text-error" onClick={() => setSelectedFile(null)}>remove</button></div>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Claim'}</button>
        </div>
      </div>
    </main>
  );
}