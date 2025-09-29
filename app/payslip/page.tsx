'use client';

import '../styles/globals.css'; 

import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  date: string;
  netPay: number;
  joinDate: string;
  bank: string;
  earnings: {
    basic: number;
    overtime: number;
    food: number;
    transport: number;
    referral: number;
  };
  deductions: {
    unpaidLeave: number;
    epf: number;
    socso: number;
    eis: number;
    pcb: number;
  };
  increments?: { date: string; salary: number }[];
}

export default function PayrollSummary() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'breakdown' | 'increments' | 'report' | 'payslip'>('breakdown');

  useEffect(() => {
    const dummyData: Employee[] = [
      {
        id: 1,
        name: 'Ali Ahmad',
        date: '2023-06-07',
        netPay: 3899.98,
        joinDate: '2023-06-07',
        bank: 'Maybank (ACC1000)',
        earnings: { basic: 3800, overtime: 72.98, food: 200, transport: 250, referral: 100 },
        deductions: { unpaidLeave: 0, epf: 418, socso: 20, eis: 5, pcb: 120.67 },
      },
      {
        id: 2,
        name: 'Brian Lee',
        date: '2022-11-15',
        netPay: 4814.04,
        joinDate: '2022-01-10',
        bank: 'CIMB (ACC1001)',
        earnings: { basic: 4200, overtime: 150, food: 180, transport: 300, referral: 100 },
        deductions: { unpaidLeave: 0, epf: 460, socso: 30, eis: 6, pcb: 130 },
      },
      {
        id: 3,
        name: 'Charlie Wang',
        date: '2023-01-10',
        netPay: 3689.16,
        joinDate: '2023-01-01',
        bank: 'RHB (ACC1002)',
        earnings: { basic: 3400, overtime: 89.16, food: 100, transport: 200, referral: 0 },
        deductions: { unpaidLeave: 0, epf: 380, socso: 18, eis: 4, pcb: 96 },
      },
      {
        id: 4,
        name: 'Dinesh Patel',
        date: '2024-02-05',
        netPay: 3644.32,
        joinDate: '2022-10-20',
        bank: 'Public Bank (ACC1003)',
        earnings: { basic: 3500, overtime: 44.32, food: 120, transport: 180, referral: 0 },
        deductions: { unpaidLeave: 0, epf: 400, socso: 25, eis: 5, pcb: 120 },
      },
      {
        id: 5,
        name: 'Elena Garcia',
        date: '2022-08-22',
        netPay: 4005.12,
        joinDate: '2021-12-01',
        bank: 'HSBC (ACC1004)',
        earnings: { basic: 3700, overtime: 105.12, food: 150, transport: 300, referral: 0 },
        deductions: { unpaidLeave: 0, epf: 420, socso: 28, eis: 4, pcb: 130 },
      },
      {
        id: 6,
        name: 'Fang Li',
        date: '2023-03-18',
        netPay: 3742.99,
        joinDate: '2022-03-01',
        bank: 'Ambank (ACC1005)',
        earnings: { basic: 3600, overtime: 42.99, food: 100, transport: 120, referral: 0 },
        deductions: { unpaidLeave: 0, epf: 380, socso: 24, eis: 4, pcb: 120 },
      },
      {
        id: 7,
        name: 'Gabriel Silva',
        date: '2021-12-01',
        netPay: 4070.81,
        joinDate: '2020-11-15',
        bank: 'Affin Bank (ACC1006)',
        earnings: { basic: 3900, overtime: 70.81, food: 100, transport: 100, referral: 100 },
        deductions: { unpaidLeave: 0, epf: 410, socso: 26, eis: 4, pcb: 120 },
      },
      {
        id: 8,
        name: 'Hannah Kim',
        date: '2023-07-12',
        netPay: 4274.40,
        joinDate: '2022-09-10',
        bank: 'UOB (ACC1007)',
        earnings: { basic: 4000, overtime: 124.40, food: 100, transport: 150, referral: 100 },
        deductions: { unpaidLeave: 0, epf: 420, socso: 28, eis: 4, pcb: 120 },
      },
      {
        id: 9,
        name: 'Ivan Petrov',
        date: '2022-04-30',
        netPay: 3656.97,
        joinDate: '2021-03-20',
        bank: 'Standard Chartered (ACC1008)',
        earnings: { basic: 3400, overtime: 56.97, food: 100, transport: 150, referral: 100 },
        deductions: { unpaidLeave: 0, epf: 400, socso: 25, eis: 5, pcb: 120 },
      },
      {
        id: 10,
        name: 'Julia Rossi',
        date: '2023-09-01',
        netPay: 3919.00,
        joinDate: '2022-01-10',
        bank: 'OCBC (ACC1009)',
        earnings: { basic: 3700, overtime: 69.00, food: 100, transport: 50, referral: 0 },
        deductions: { unpaidLeave: 0, epf: 410, socso: 25, eis: 4, pcb: 120 },
      }
    ];
    setEmployees(dummyData);
    setSelected(dummyData[0]);
  }, []);

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const totalEarnings = selected ? Object.values(selected.earnings).reduce((sum, val) => sum + val, 0) : 0;
  const totalDeductions = selected ? Object.values(selected.deductions).reduce((sum, val) => sum + val, 0) : 0;

  const parseBankInfo = (bank: string) => {
    const match = bank.match(/^(.*?) \((.*?)\)$/);
    return match ? { name: match[1], account: match[2] } : { name: bank, account: '-' };
  };


  return (
      <>
    <h1 className="text-2xl font-bold text-blue-400 bg-gray-900 px-4 py-2 border-b-4 border-green-500">
    Payroll Report
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        
      <div className="md:col-span-1 border rounded-lg p-4 overflow-y-auto max-h-[80vh]">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <div className="space-y-2">
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              onClick={() => setSelected(emp)}
              className={`p-3 rounded-lg cursor-pointer ${selected?.id === emp.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              <div>{emp.name}</div>
              <div className="text-sm">Net: {emp.netPay.toFixed(2)}</div>
              <div className="text-sm text-gray-400">{emp.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 border rounded-lg p-4">
        <div className="flex space-x-4 border-b mb-4">
          {['breakdown', 'increments', 'report', 'payslip'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 capitalize ${activeTab === tab ? 'border-b-2 font-semibold border-blue-500' : 'hover:text-blue-500'}`}
            >
              {tab === 'increments' ? 'Increment History' : tab === 'report' ? 'Report Details' : tab === 'payslip' ? 'Generate Payslip' : 'Breakdown'}
            </button>
          ))}
        </div>

        {selected && activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="font-bold">Employee Info</div>
                <div>Name: {selected.name}</div>
                <div>Join Date: {selected.joinDate}</div>
                <div>Bank: {selected.bank}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="font-bold">Earnings</div>
                {Object.entries(selected.earnings).map(([key, val]) => (
                  <div key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {val.toFixed(2)}</div>
                ))}
                <div className="mt-2 font-semibold">Total Earnings: {totalEarnings.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="border rounded-lg p-3">
                <div className="font-bold">Deductions</div>
                {Object.entries(selected.deductions).map(([key, val]) => (
                  <div key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {val.toFixed(2)}</div>
                ))}
                <div className="mt-2 font-semibold">Total Deductions: {totalDeductions.toFixed(2)}</div>
              </div>
              <div className="mt-4 p-3 bg-gray-700 text-white text-xl font-bold rounded-lg">
                Net Pay: {(totalEarnings - totalDeductions).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {selected && activeTab === 'increments' && (
          <div>
          <button
  className="btn btn-primary mb-4"
  onClick={() => {
    if (!selected) return;
    const newSalary = prompt("Enter new basic salary (MYR):");
    if (newSalary) {
      const updated = {
        ...selected,
        increments: [
          ...(selected.increments || []),
          { date: new Date().toISOString().slice(0, 10), salary: parseFloat(newSalary) }
        ]
      };
      setEmployees(prev =>
        prev.map(emp => (emp.id === selected.id ? updated : emp))
      );
      setSelected(updated);
    }
  }}
>
  + Add Increment
</button>

            <table className="table w-full">
              <thead><tr><th>Date</th><th>New Basic Salary (MYR)</th></tr></thead>
              <tbody>
                {selected.increments?.map((inc, i) => (
                  <tr key={i}><td>{inc.date}</td><td>{inc.salary.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && activeTab === 'report' && (
          <div className="border rounded-lg p-4">
            <h2 className="font-bold mb-2">Payroll Report - 2025-05</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Join Date:</strong> {selected.joinDate}</div>
              <div><strong>Bank:</strong> {parseBankInfo(selected.bank).name}</div>
              <div><strong>Account No:</strong> {parseBankInfo(selected.bank).account}</div>
              <div><strong>Currency:</strong> MYR</div>
              <div><strong>Transfer Rate:</strong> 4.39</div>
              <div><strong>Basic Reserved:</strong> RM {selected.earnings.basic.toFixed(2)}</div>
              <div><strong>Payout:</strong> RM {(totalEarnings - totalDeductions).toFixed(2)}</div>
            </div>
            <hr className="my-3" />
            <div className="text-sm">
              <p className="font-semibold">Earnings</p>
              {Object.entries(selected.earnings).map(([k, v]) => <div key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: RM {v.toFixed(2)}</div>)}
              <p className="mt-2 font-semibold">Total Earnings: RM {totalEarnings.toFixed(2)}</p>
              <p className="font-semibold mt-4">Deductions</p>
              {Object.entries(selected.deductions).map(([k, v]) => <div key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: RM {v.toFixed(2)}</div>)}
              <p className="mt-2 font-semibold">Net Pay: RM {(totalEarnings - totalDeductions).toFixed(2)}</p>
              <p className="font-semibold">Employer Contributions: RM 1209.00</p>
            </div>
          </div>
        )}

        {selected && activeTab === 'payslip' && (
          <div>
            <button className="btn btn-primary mb-4"  onClick={() => {
  if (typeof window !== 'undefined') {
    window.print();
  }
}}
>Print Payslip</button>
            <div className="border rounded-lg p-6">
                 <div className="printable-area border rounded-lg p-6">
                    
              <img src="/logo.png" alt="Company Logo" className="h-12 mb-4" />
              <h2 className="text-lg font-bold">Acme Logistics Sdn. Bhd.</h2>
              <p>123 Jalan Industri, Kuala Lumpur, Malaysia</p>
              <p>Payslip for 2025-05</p>
              <div className="grid grid-cols-2 text-sm mt-4">
                <div>
                  <p><strong>Employee Name:</strong> {selected.name}</p>
                  <p><strong>Account No:</strong> {parseBankInfo(selected.bank).account}</p>
                </div>
                <div>
                  <p><strong>Bank:</strong> {parseBankInfo(selected.bank).name}</p>
                  <p><strong>Join Date:</strong> {selected.joinDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 mt-4">
                <div>
                  <p><strong>Earnings (MYR)</strong></p>
                  {Object.entries(selected.earnings).map(([k, v]) => <p key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: {v.toFixed(2)}</p>)}
                  <p><strong>Total Earnings:</strong> {totalEarnings.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Deductions (MYR)</strong></p>
                  {Object.entries(selected.deductions).map(([k, v]) => <p key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: {v.toFixed(2)}</p>)}
                  <p><strong>Total Deductions:</strong> {totalDeductions.toFixed(2)}</p>
                </div>
              </div>
              <p className="mt-4 font-semibold">Net Pay: {totalEarnings - totalDeductions}</p>
              <div className="mt-4 bg-gray-800 text-white p-3 rounded">
                <p>Authorized Signatory</p>
                <p>Employee Signature</p>
              </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
     </>
  );
}
