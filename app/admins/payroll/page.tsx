'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';

interface PolicyAssignment {
  id: number;
  company_name: string;
  pay_interval: string;
}

interface PayslipItem {
  label: string;
  amount: number;
  type: string;
}

interface EmployerContribution {
  label: string;
  amount: number;
}

interface PayrollPreview {
  employee_id: number;
  employee_name: string;
  period_from: string;
  period_to: string;
  gross_salary: number;
  net_salary: number;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
}

interface FinalizedPayroll {
  id: number;
  employee_id: number;
  employee_name: string;
  gross_salary: string;
  net_salary: string;
  basic_salary: string;
  total_allowance: string;
  total_deduction: string;
  epf_employee: string;
  epf_employer: string;
  socso_employee: string;
  socso_employer: string;
  eis_employee: string;
  eis_employer: string;
  pcb: string;
  status: string;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
}

export default function PayrollPage() {
  const [assignments, setAssignments] = useState<PolicyAssignment[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [previewResult, setPreviewResult] = useState<PayrollPreview[]>([]);
  const [viewDetailsId, setViewDetailsId] = useState<number | null>(null);
  const [payrollDetails, setPayrollDetails] = useState<FinalizedPayroll | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/payroll-policy-assignments`)
      .then((res) => res.json())
      .then(setAssignments)
      .catch(() => toast.error('Failed to fetch assignments'));
  }, []);

  const handlePreview = async () => {
    if (!selectedPolicyId || !periodFrom || !periodTo) {
      toast.error('Please select policy and dates');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/payroll/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_assignment_id: selectedPolicyId,
          period_from: periodFrom,
          period_to: periodTo,
        }),
      });
      const data = await res.json();
      if (data.success) setPreviewResult(data.preview);
      else toast.error('Preview failed');
    } catch {
      toast.error('Preview failed');
    }
  };

  const handleExport = () => {
    // Use simple CSV export
    const rows = previewResult.map(emp => [
      emp.employee_name,
      emp.gross_salary.toFixed(2),
      emp.net_salary.toFixed(2)
    ]);
    const header = ['Employee Name', 'Gross Salary', 'Net Salary'];
    const csvContent = [header, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'payroll_preview.csv';
    link.click();
  };

  const handleViewDetails = async (employeeId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payroll/${employeeId}`);
      const data = await res.json();
      setPayrollDetails(data);
      setViewDetailsId(employeeId);
    } catch {
      toast.error('Failed to fetch details');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payroll Preview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select className="input input-bordered" value={selectedPolicyId ?? ''} onChange={(e) => setSelectedPolicyId(Number(e.target.value))}>
          <option value="">-- Select Policy Assignment --</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.company_name} - {a.pay_interval} (ID {a.id})
            </option>
          ))}
        </select>
        <input type="date" className="input input-bordered" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} />
        <input type="date" className="input input-bordered" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} />
      </div>

      <div className="mb-4 flex gap-2">
        <button className="btn btn-primary" onClick={handlePreview}>
          Preview
        </button>
        {previewResult.length > 0 && (
          <button className="btn btn-secondary" onClick={handleExport}>
            Export to Excel
          </button>
        )}
      </div>

      {previewResult.length > 0 && (
        <div className="space-y-6">
          {previewResult.map((emp) => (
            <div key={emp.employee_id} className="bg-white shadow p-4 rounded border">
              <div className="font-semibold text-lg mb-2">
                {emp.employee_name} — Gross: RM {emp.gross_salary.toFixed(2)} | Net: RM {emp.net_salary.toFixed(2)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Earnings</h4>
                  <ul className="text-sm">
                    {emp.payslip_items.filter(i => i.type === 'Earning').map((item, idx) => (
                      <li key={idx}>{item.label}: RM {item.amount.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deductions</h4>
                  <ul className="text-sm">
                    {emp.payslip_items.filter(i => i.type === 'Deduction').map((item, idx) => (
                      <li key={idx}>{item.label}: RM {item.amount.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Statutory</h4>
                  <ul className="text-sm">
                    {emp.payslip_items.filter(i => i.type === 'Statutory').map((item, idx) => (
                      <li key={idx}>{item.label}: RM {item.amount.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Employer Contributions</h4>
                <ul className="text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
                  {emp.employer_contributions.map((item, idx) => (
                    <li key={idx}>{item.label}: RM {item.amount.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleViewDetails(emp.employee_id)}
                >
                  View Details
                </button>
              </div>

              {viewDetailsId === emp.employee_id && payrollDetails && (
                <div className="mt-4 bg-gray-50 p-4 rounded text-sm border">
                  <div className="font-bold mb-2">Payroll ID: {payrollDetails.id}</div>
                  <div>Status: {payrollDetails.status}</div>
                  <div>Basic Salary: RM {payrollDetails.basic_salary}</div>
                  <div>Total Allowance: RM {payrollDetails.total_allowance}</div>
                  <div>Total Deduction: RM {payrollDetails.total_deduction}</div>
                  <div>Net Salary: RM {payrollDetails.net_salary}</div>
                  <div className="mt-2">
                    <strong>Statutory:</strong><br />
                    EPF: RM {payrollDetails.epf_employee} (Employer: {payrollDetails.epf_employer})<br />
                    SOCSO: RM {payrollDetails.socso_employee} (Employer: {payrollDetails.socso_employer})<br />
                    EIS: RM {payrollDetails.eis_employee} (Employer: {payrollDetails.eis_employer})<br />
                    PCB: RM {payrollDetails.pcb}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
