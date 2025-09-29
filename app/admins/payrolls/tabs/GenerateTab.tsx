// "use client";

// import { useEffect, useState } from "react";
// import { API_BASE_URL } from '../../../config';
// import { toast } from 'react-hot-toast';
// import { useTheme } from '../../../components/ThemeProvider';
// import React from "react";

// interface PolicyAssignment {
//   id: number;
//   company_name: string;
//   pay_interval: string;
// }

// interface PayslipItem {
//   label: string;
//   amount: string;
//   type: string;
// }

// interface EmployerContribution {
//   label: string;
//   amount: string;
//   type: string;
// }

// interface PayrollPreview {
//   error: string;
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   period_from: string;
//   period_to: string;
//   gross_salary: number;
//   net_salary: number;
//   payslip_items: PayslipItem[];
//   employer_contributions: EmployerContribution[];
// }

// interface FinalizedPayroll {
//   id: number;
//   period_year: number;
//   period_month: number;
//   employee_id: number;
//   employee_name: string;
//   gross_salary: string;
//   net_salary: string;
//   basic_salary: string;
//   total_allowance: string;
//   total_deduction: string;
//   epf_employee: string;
//   epf_employer: string;
//   socso_employee: string;
//   socso_employer: string;
//   eis_employee: string;
//   eis_employer: string;
//   pcb: string;
//   status_code: string;
//   generated_by: number | null;
//   generated_at: string;
//   paid_at: string | null;
//   created_at: string;
//   updated_at: string;
//   remarks: string | null;
//   payslip_items: PayslipItem[];
//   employer_contributions: EmployerContribution[];
// }

// export default function GenerateTab() {
//   const { theme } = useTheme();
//   const [assignments, setAssignments] = useState<PolicyAssignment[]>([]);
//   const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
//   const [periodFrom, setPeriodFrom] = useState('');
//   const [periodTo, setPeriodTo] = useState('');
//   const [previewResult, setPreviewResult] = useState<PayrollPreview[]>([]);
//   const [viewDetailsId, setViewDetailsId] = useState<number | null>(null);
//   const [payrollDetails, setPayrollDetails] = useState<FinalizedPayroll | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [modalLoading, setModalLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/payroll-policy-assignments`);
//         if (!res.ok) {
//           throw new Error('Failed to fetch assignments');
//         }
//         const data = await res.json();
//         setAssignments(data);
//       } catch (error) {
//         console.error("Error fetching policy assignments:", error);
//         toast.error('Failed to fetch assignments');
//       }
//     };
//     fetchAssignments();
//   }, []);

//   const handlePreview = async () => {
//     if (!selectedPolicyId || !periodFrom || !periodTo) {
//       toast.error('Please select a policy and both period dates.');
//       return;
//     }
//     setLoading(true);
//     setPreviewResult([]);
//     setPayrollDetails(null);
//     setViewDetailsId(null);

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/payroll/preview`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           policy_assignment_id: selectedPolicyId,
//           period_from: periodFrom,
//           period_to: periodTo,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         // Ensure each preview item has an id
//         const previewWithIds = data.preview.map((item: any, index: number) => ({
//           ...item,
//           id: item.payroll_id || index // Fallback to index if id is missing
//         }));
//         setPreviewResult(previewWithIds);
//         toast.success('Payroll preview generated successfully!');
//       } else {
//         toast.error(data.message || 'Preview failed.');
//       }
//     } catch (error) {
//       console.error("Payroll preview failed:", error);
//       toast.error('Payroll preview failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!selectedPolicyId || !periodFrom || !periodTo) {
//       toast.error('Please select a policy and both period dates.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/payroll/generate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           policy_assignment_id: selectedPolicyId,
//           period_from: periodFrom,
//           period_to: periodTo,
//           commit: true
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success('Payroll generated successfully!');
//         setPreviewResult([]);
//         setPayrollDetails(null);
//         setViewDetailsId(null);
//         setSelectedPolicyId(null);
//         setPeriodFrom('');
//         setPeriodTo('');
//       } else {
//         toast.error(data.message || 'Payroll generation failed.');
//       }
//     } catch (error) {
//       console.error("Payroll generation failed:", error);
//       toast.error('Payroll generation failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     if (previewResult.length === 0) {
//       toast.error('No preview data to export.');
//       return;
//     }
//     const rows = previewResult.map(emp => [
//       emp.employee_name,
//       emp.gross_salary.toFixed(2),
//       emp.net_salary.toFixed(2)
//     ]);
//     const header = ['Employee Name', 'Gross Salary', 'Net Salary'];
//     const csvContent = [header, ...rows]
//       .map(e => e.join(','))
//       .join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = 'payroll_preview.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success('Payroll preview exported to CSV!');
//   };

//   // const handleViewDetails = async (employeeId: number) => {
//   //   if (viewDetailsId === employeeId) {
//   //     setViewDetailsId(null);
//   //     setPayrollDetails(null);
//   //     return;
//   //   }

//   //   setModalLoading(true);
//   //   try {
//   //      const res = await fetch(`${API_BASE_URL}/api/payroll/employee/${employeeId}`);
//   //     //const res = await fetch(`${API_BASE_URL}/api/payroll/${payrollId}`);
//   //     if (!res.ok) {
//   //       throw new Error('Failed to fetch details');
//   //     }
//   //     const data: FinalizedPayroll = await res.json();
//   //     setPayrollDetails(data);
//   //     setViewDetailsId(employeeId);
//   //     toast.success('Payroll details fetched!');
//   //   } catch (error) {
//   //     console.error("Error fetching payroll details:", error);
//   //     toast.error('Failed to fetch details');
//   //   } finally {
//   //     setModalLoading(false);
//   //   }
//   // };

// const handleViewDetails = async (employeeId: number) => {
//   if (viewDetailsId === employeeId) {
//     setViewDetailsId(null);
//     setPayrollDetails(null);
//     return;
//   }

//   setModalLoading(true);
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/payroll/employee/${employeeId}`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch details');
//     }
//     const data: FinalizedPayroll[] = await res.json();

//     if (!data.length) {
//       toast.error('No payroll data found.');
//       setPayrollDetails(null);
//       setViewDetailsId(null);
//     } else {
//       const latestPayroll = data.sort((a, b) =>
//   new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
// )[0];
//       //const latestPayroll = data[0]; // or sort by `generated_at` or `period_month/year` if needed
//       setPayrollDetails(latestPayroll);
//       setViewDetailsId(employeeId);
//       toast.success('Payroll details fetched!');
//     }
//   } catch (error) {
//     console.error("Error fetching payroll details:", error);
//     toast.error('Failed to fetch details');
//   } finally {
//     setModalLoading(false);
//   }
// };


//   const getStatusBadgeColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'approved':
//         return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200';
//       case 'pending':
//         return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200';
//       case 'rejected':
//         return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200';
//       case 'draft':
//         return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200';
//       default:
//         return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200';
//     }
//   };

//   return (
//     <div className={`card shadow p-6 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//       <h2 className={`text-2xl font-semibold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//         Manual Payroll Preview / Generation
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label htmlFor="policy-select" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//             Policy Assignment
//           </label>
//           <select
//             id="policy-select"
//             className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
//             value={selectedPolicyId ?? ''}
//             onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
//             disabled={loading}
//           >
//             <option value="">-- Select Policy Assignment --</option>
//             {assignments.map((a) => (
//               <option key={a.id} value={a.id}>
//                 {a.company_name} - {a.pay_interval} (ID {a.id})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="period-from" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//             Period From
//           </label>
//           <input
//             id="period-from"
//             type="date"
//             className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
//             value={periodFrom}
//             onChange={(e) => setPeriodFrom(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div>
//           <label htmlFor="period-to" className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//             Period To
//           </label>
//           <input
//             id="period-to"
//             type="date"
//             className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
//             value={periodTo}
//             onChange={(e) => setPeriodTo(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//       </div>

//       <div className="flex gap-4 mb-6">
//         <button
//           className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//             ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}
//             ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//           `}
//           onClick={handlePreview}
//           disabled={loading}
//         >
//           {loading && previewResult.length === 0 ? (
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           ) : null}
//           Preview Payroll
//         </button>

//         {previewResult.length > 0 && (
//           <button
//             className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
//               ${theme === 'light' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}
//               ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//             `}
//             onClick={handleGenerate}
//             disabled={loading}
//           >
//             {loading && previewResult.length > 0 ? (
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             ) : null}
//             Generate Payroll
//           </button>
//         )}

//         {previewResult.length > 0 && (
//           <button
//             className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
//               ${theme === 'light' ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
//               ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//             `}
//             onClick={handleExport}
//             disabled={loading}
//           >
//             Export to Excel
//           </button>
//         )}
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           <span className={`ml-3 text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Loading payroll data...</span>
//         </div>
//       )}

//       {previewResult.length > 0 && !loading && (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//             Payroll Preview Results
//           </h3>
//           <table className={`min-w-full divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'} border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
//             <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
//               <tr>
//                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Payroll ID
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Employee Name
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Period
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Gross Salary (RM)
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Net Salary (RM)
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             {/* <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'} ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//               {previewResult.map((emp) => (
//                 <React.Fragment key={emp.id}>
//                   <tr className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {emp.id}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                       {emp.employee_name}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                       {emp.period_from} to {emp.period_to}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                       {emp.gross_salary.toFixed(2)}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                       {emp.net_salary.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
//                           ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
//                           ${modalLoading && viewDetailsId === emp.employee_id ? 'opacity-50 cursor-not-allowed' : ''}
//                         `}
//                         onClick={() => handleViewDetails(emp.employee_id)}
//                         disabled={modalLoading && viewDetailsId === emp.employee_id }
//                       >
//                         {viewDetailsId === emp.employee_id  && modalLoading ? (
//                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                         ) : viewDetailsId === emp.employee_id  ? 'Hide Details' : 'View Details'}
//                       </button>
//                     </td>
//                   </tr>
//                   {viewDetailsId === emp.employee_id && payrollDetails && (
//                     <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                       <td colSpan={5} className="px-6 py-4">
//                         <div className={`p-4 rounded-lg text-sm border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-600 border-gray-500'}`}>
//                           <div className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Payroll ID: {payrollDetails.id}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Status: {payrollDetails.status_code}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Basic Salary: RM {parseFloat(payrollDetails.basic_salary).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Allowance: RM {parseFloat(payrollDetails.total_allowance).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Deduction: RM {parseFloat(payrollDetails.total_deduction).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Net Salary: RM {parseFloat(payrollDetails.net_salary).toFixed(2)}</div>
//                           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} col-span-full`}>Statutory:</strong>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EPF: RM {parseFloat(payrollDetails.epf_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.epf_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>SOCSO: RM {parseFloat(payrollDetails.socso_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.socso_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EIS: RM {parseFloat(payrollDetails.eis_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.eis_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>PCB: RM {parseFloat(payrollDetails.pcb).toFixed(2)}</span>
//                           </div>
//                           <div className="mt-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Payslip Items:</strong>
//                             <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                               {payrollDetails.payslip_items.map((item, idx) => (
//                                 <li key={idx}>{item.label} ({item.type}): RM {parseFloat(item.amount).toFixed(2)}</li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div className="mt-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Employer Contributions (Detailed):</strong>
//                             <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                               {payrollDetails.employer_contributions.map((item, idx) => (
//                                 <li key={idx}>{item.label}: RM {parseFloat(item.amount).toFixed(2)}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody> */}

//             <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'} ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//   {previewResult.map((emp) => {
//     if (typeof emp.gross_salary !== 'number' || typeof emp.net_salary !== 'number') {
//       return (
//         <tr key={`error-${emp.employee_id}`} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
//           <td colSpan={6} className="px-6 py-4">
//             <strong>{emp.employee_name}</strong> — Error: {emp.error || 'Unknown error occurred during payroll preview.'}
//           </td>
//         </tr>
//       );
//     }

//     return (
//       <React.Fragment key={emp.employee_id}>
//         <tr className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}>
//           <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.id || emp.employee_id}</td>
//           <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{emp.employee_name}</td>
//           <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{emp.period_from} to {emp.period_to}</td>
//           <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{emp.gross_salary.toFixed(2)}</td>
//           <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{emp.net_salary.toFixed(2)}</td>
//           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//             <button
//               className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
//                 ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
//                 ${modalLoading && viewDetailsId === emp.employee_id ? 'opacity-50 cursor-not-allowed' : ''}
//               `}
//               onClick={() => handleViewDetails(emp.employee_id)}
//               disabled={modalLoading && viewDetailsId === emp.employee_id}
//             >
//               {viewDetailsId === emp.employee_id && modalLoading ? (
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//               ) : viewDetailsId === emp.employee_id ? 'Hide Details' : 'View Details'}
//             </button>
//           </td>
//         </tr>

//           {viewDetailsId === emp.employee_id && payrollDetails && (
//                     <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                       <td colSpan={5} className="px-6 py-4">
//                         <div className={`p-4 rounded-lg text-sm border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-600 border-gray-500'}`}>
//                           <div className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Payroll ID: {payrollDetails.id}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Status: {payrollDetails.status_code}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Basic Salary: RM {parseFloat(payrollDetails.basic_salary).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Allowance: RM {parseFloat(payrollDetails.total_allowance).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Deduction: RM {parseFloat(payrollDetails.total_deduction).toFixed(2)}</div>
//                           <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Net Salary: RM {parseFloat(payrollDetails.net_salary).toFixed(2)}</div>
//                           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} col-span-full`}>Statutory:</strong>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EPF: RM {parseFloat(payrollDetails.epf_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.epf_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>SOCSO: RM {parseFloat(payrollDetails.socso_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.socso_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>EIS: RM {parseFloat(payrollDetails.eis_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.eis_employer).toFixed(2)})</span>
//                             <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>PCB: RM {parseFloat(payrollDetails.pcb).toFixed(2)}</span>
//                           </div>
//                           <div className="mt-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Payslip Items:</strong>
//                             <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                               {payrollDetails.payslip_items.map((item, idx) => (
//                                 <li key={idx}>{item.label} ({item.type}): RM {parseFloat(item.amount).toFixed(2)}</li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div className="mt-2">
//                             <strong className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Employer Contributions (Detailed):</strong>
//                             <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                               {payrollDetails.employer_contributions.map((item, idx) => (
//                                 <li key={idx}>{item.label}: RM {parseFloat(item.amount).toFixed(2)}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//       </React.Fragment>
//     );
//   })}
// </tbody>

//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../../components/ThemeProvider';
import React from "react";

interface PolicyAssignment {
  id: number;
  company_name: string;
  pay_interval: string;
}

interface PayslipItem {
  label: string;
  amount: string;
  type: string;
}

interface EmployerContribution {
  label: string;
  amount: string;
  type: string;
}

interface PayrollPreview {
  error: string;
  id: number;
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
  period_year: number;
  period_month: number;
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
  status_code: string;
  generated_by: number | null;
  generated_at: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  remarks: string | null;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
}

export default function GenerateTab() {
  const { theme } = useTheme();
  const [assignments, setAssignments] = useState<PolicyAssignment[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [previewResult, setPreviewResult] = useState<PayrollPreview[]>([]);
  const [viewDetailsId, setViewDetailsId] = useState<number | null>(null);
  const [payrollDetails, setPayrollDetails] = useState<FinalizedPayroll | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payroll-policy-assignments`);
        if (!res.ok) throw new Error('Failed to fetch assignments');
        const data = await res.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching policy assignments:", error);
        toast.error('Failed to fetch assignments');
      }
    };
    fetchAssignments();
  }, []);

  const handlePreview = async () => {
    if (!selectedPolicyId || !periodFrom || !periodTo) {
      toast.error('Please select a policy and both period dates.');
      return;
    }
    setLoading(true);
    setPreviewResult([]);
    setPayrollDetails(null);
    setViewDetailsId(null);

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
      if (data.success) {
        const previewWithIds = data.preview.map((item: any, index: number) => ({
          ...item,
          id: item.payroll_id || index
        }));
        setPreviewResult(previewWithIds);
        toast.success('Payroll preview generated successfully!');
      } else {
        toast.error(data.message || 'Preview failed.');
      }
    } catch (error) {
      console.error("Payroll preview failed:", error);
      toast.error('Payroll preview failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPolicyId || !periodFrom || !periodTo) {
      toast.error('Please select a policy and both period dates.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payroll/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_assignment_id: selectedPolicyId,
          period_from: periodFrom,
          period_to: periodTo,
          commit: true
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payroll generated successfully!');
        setPreviewResult([]);
        setPayrollDetails(null);
        setViewDetailsId(null);
        setSelectedPolicyId(null);
        setPeriodFrom('');
        setPeriodTo('');
      } else {
        toast.error(data.message || 'Payroll generation failed.');
      }
    } catch (error) {
      console.error("Payroll generation failed:", error);
      toast.error('Payroll generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (previewResult.length === 0) {
      toast.error('No preview data to export.');
      return;
    }
    const rows = previewResult.map(emp => [
      emp.employee_name,
      emp.gross_salary.toFixed(2),
      emp.net_salary.toFixed(2)
    ]);
    const header = ['Employee Name', 'Gross Salary', 'Net Salary'];
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'payroll_preview.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payroll preview exported to CSV!');
  };

  const handleViewDetails = async (employeeId: number) => {
    if (viewDetailsId === employeeId) {
      setViewDetailsId(null);
      setPayrollDetails(null);
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payroll/employee/${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch details');
      const data: FinalizedPayroll[] = await res.json();

      if (!data.length) {
        toast.error('No payroll data found.');
        setPayrollDetails(null);
        setViewDetailsId(null);
      } else {
        const latestPayroll = data.sort(
          (a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
        )[0];
        setPayrollDetails(latestPayroll);
        setViewDetailsId(employeeId);
        toast.success('Payroll details fetched!');
      }
    } catch (error) {
      console.error("Error fetching payroll details:", error);
      toast.error('Failed to fetch details');
    } finally {
      setModalLoading(false);
    }
  };

  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textMain = theme === 'light' ? 'text-gray-800' : 'text-white';
  const textSub = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const borderCol = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const headBg = theme === 'light' ? 'bg-gray-50' : 'bg-gray-700';

  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8`}>
      <div className={`card shadow rounded-xl ${containerBg}`}>
        <div className="p-4 sm:p-6">
          <h2 className={`text-2xl font-semibold mb-6 ${textMain}`}>
            Manual Payroll Preview / Generation
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="policy-select" className={`mb-1 text-sm font-medium ${textSub}`}>Policy Assignment</label>
              <select
                id="policy-select"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                value={selectedPolicyId ?? ''}
                onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">-- Select Policy Assignment --</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.company_name} - {a.pay_interval} (ID {a.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="period-from" className={`mb-1 text-sm font-medium ${textSub}`}>Period From</label>
              <input
                id="period-from"
                type="date"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="period-to" className={`mb-1 text-sm font-medium ${textSub}`}>Period To</label>
              <input
                id="period-to"
                type="date"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <button
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePreview}
              disabled={loading}
            >
              {loading && previewResult.length === 0 ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z" />
                </svg>
              ) : null}
              Preview Payroll
            </button>

            {previewResult.length > 0 && (
              <>
                <button
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
                    ${theme === 'light' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading && previewResult.length > 0 ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z" />
                    </svg>
                  ) : null}
                  Generate Payroll
                </button>

                <button
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                    ${theme === 'light' ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleExport}
                  disabled={loading}
                >
                  Export to Excel
                </button>
              </>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-8" role="status" aria-live="polite" aria-busy="true">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z" />
              </svg>
              <span className={`ml-3 text-lg ${textSub}`}>Loading payroll data...</span>
            </div>
          )}

          {/* Results */}
          {previewResult.length > 0 && !loading && (
            <>
              <h3 className={`text-xl font-semibold mb-3 ${textMain}`}>Payroll Preview Results</h3>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {previewResult.map((emp) => {
                  if (typeof emp.gross_salary !== 'number' || typeof emp.net_salary !== 'number') {
                    return (
                      <div key={`err-card-${emp.employee_id}`} className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
                        <div className="font-semibold">{emp.employee_name}</div>
                        <div className="text-sm mt-1">Error: {emp.error || 'Unknown error occurred during payroll preview.'}</div>
                      </div>
                    );
                  }
                  const active = viewDetailsId === emp.employee_id && payrollDetails;
                  return (
                    <div key={`card-${emp.employee_id}`} className={`rounded-lg border ${borderCol} ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 shadow-sm`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-sm ${textSub}`}>Payroll ID</div>
                          <div className={`font-semibold ${textMain}`}>{emp.id || emp.employee_id}</div>
                          <div className={`mt-2 font-medium ${textMain}`}>{emp.employee_name}</div>
                          <div className={`text-sm ${textSub}`}>{emp.period_from} to {emp.period_to}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs ${textSub}`}>Gross (RM)</div>
                          <div className={`font-semibold ${textMain}`}>{emp.gross_salary.toFixed(2)}</div>
                          <div className={`mt-1 text-xs ${textSub}`}>Net (RM)</div>
                          <div className={`font-semibold ${textMain}`}>{emp.net_salary.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button
                          className={`w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                            ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
                            ${modalLoading && viewDetailsId === emp.employee_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleViewDetails(emp.employee_id)}
                          disabled={modalLoading && viewDetailsId === emp.employee_id}
                        >
                          {viewDetailsId === emp.employee_id && modalLoading ? 'Loading…' : active ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>

                      {active && (
                        <div className={`mt-3 rounded-lg border ${borderCol} ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} p-3 text-sm`}>
                          <div className={`font-semibold mb-1 ${textMain}`}>Payroll ID: {payrollDetails!.id}</div>
                          <div className={`${textSub}`}>Status: {payrollDetails!.status_code}</div>
                          <div className={`${textSub}`}>Basic Salary: RM {parseFloat(payrollDetails!.basic_salary).toFixed(2)}</div>
                          <div className={`${textSub}`}>Total Allowance: RM {parseFloat(payrollDetails!.total_allowance).toFixed(2)}</div>
                          <div className={`${textSub}`}>Total Deduction: RM {parseFloat(payrollDetails!.total_deduction).toFixed(2)}</div>
                          <div className={`${textSub}`}>Net Salary: RM {parseFloat(payrollDetails!.net_salary).toFixed(2)}</div>

                          <div className="mt-2 grid grid-cols-1 gap-1">
                            <strong className={`${textMain}`}>Statutory</strong>
                            <span className={`${textSub}`}>EPF: RM {parseFloat(payrollDetails!.epf_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails!.epf_employer).toFixed(2)})</span>
                            <span className={`${textSub}`}>SOCSO: RM {parseFloat(payrollDetails!.socso_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails!.socso_employer).toFixed(2)})</span>
                            <span className={`${textSub}`}>EIS: RM {parseFloat(payrollDetails!.eis_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails!.eis_employer).toFixed(2)})</span>
                            <span className={`${textSub}`}>PCB: RM {parseFloat(payrollDetails!.pcb).toFixed(2)}</span>
                          </div>

                          <div className="mt-2">
                            <strong className={`${textMain}`}>Payslip Items</strong>
                            <ul className={`mt-1 grid grid-cols-1 gap-1 ${textSub}`}>
                              {payrollDetails!.payslip_items.map((item, idx) => (
                                <li key={idx}>{item.label} ({item.type}): RM {parseFloat(item.amount).toFixed(2)}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-2">
                            <strong className={`${textMain}`}>Employer Contributions</strong>
                            <ul className={`mt-1 grid grid-cols-1 gap-1 ${textSub}`}>
                              {payrollDetails!.employer_contributions.map((item, idx) => (
                                <li key={idx}>{item.label}: RM {parseFloat(item.amount).toFixed(2)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop/tablet table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-transparent">
                  <div className="min-w-full inline-block align-middle">
                    <div className={`overflow-x-auto rounded-lg border ${borderCol}`}>
                      <table className={`min-w-[900px] table-auto`}>
                        <thead className={`${headBg} sticky top-0 z-10`}>
                          <tr>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Payroll ID</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Employee Name</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Period</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Gross Salary (RM)</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Net Salary (RM)</th>
                            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>Actions</th>
                          </tr>
                        </thead>

                        <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200 bg-white' : 'divide-gray-700 bg-gray-800'}`}>
                          {previewResult.map((emp) => {
                            if (typeof emp.gross_salary !== 'number' || typeof emp.net_salary !== 'number') {
                              return (
                                <tr key={`error-${emp.employee_id}`} className="bg-red-50">
                                  <td colSpan={6} className="px-6 py-4 text-sm text-red-700">
                                    <strong>{emp.employee_name}</strong> — Error: {emp.error || 'Unknown error occurred during payroll preview.'}
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <React.Fragment key={emp.employee_id}>
                                <tr className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.id || emp.employee_id}</td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{emp.employee_name}</td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSub}`}>{emp.period_from} to {emp.period_to}</td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSub}`}>{emp.gross_salary.toFixed(2)}</td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSub}`}>{emp.net_salary.toFixed(2)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                                        ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
                                        ${modalLoading && viewDetailsId === emp.employee_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      onClick={() => handleViewDetails(emp.employee_id)}
                                      disabled={modalLoading && viewDetailsId === emp.employee_id}
                                    >
                                      {viewDetailsId === emp.employee_id && modalLoading ? 'Loading…' : (viewDetailsId === emp.employee_id ? 'Hide Details' : 'View Details')}
                                    </button>
                                  </td>
                                </tr>

                                {viewDetailsId === emp.employee_id && payrollDetails && (
                                  <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                                    <td colSpan={6} className="px-6 py-4">
                                      <div className={`p-4 rounded-lg text-sm border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-600 border-gray-500'}`}>
                                        <div className={`font-bold mb-2 ${textMain}`}>Payroll ID: {payrollDetails.id}</div>
                                        <div className={`${textSub}`}>Status: {payrollDetails.status_code}</div>
                                        <div className={`${textSub}`}>Basic Salary: RM {parseFloat(payrollDetails.basic_salary).toFixed(2)}</div>
                                        <div className={`${textSub}`}>Total Allowance: RM {parseFloat(payrollDetails.total_allowance).toFixed(2)}</div>
                                        <div className={`${textSub}`}>Total Deduction: RM {parseFloat(payrollDetails.total_deduction).toFixed(2)}</div>
                                        <div className={`${textSub}`}>Net Salary: RM {parseFloat(payrollDetails.net_salary).toFixed(2)}</div>

                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                          <strong className={`${textMain} col-span-full`}>Statutory:</strong>
                                          <span className={`${textSub}`}>EPF: RM {parseFloat(payrollDetails.epf_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.epf_employer).toFixed(2)})</span>
                                          <span className={`${textSub}`}>SOCSO: RM {parseFloat(payrollDetails.socso_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.socso_employer).toFixed(2)})</span>
                                          <span className={`${textSub}`}>EIS: RM {parseFloat(payrollDetails.eis_employee).toFixed(2)} (Employer: {parseFloat(payrollDetails.eis_employer).toFixed(2)})</span>
                                          <span className={`${textSub}`}>PCB: RM {parseFloat(payrollDetails.pcb).toFixed(2)}</span>
                                        </div>

                                        <div className="mt-2">
                                          <strong className={`${textMain}`}>Payslip Items:</strong>
                                          <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${textSub}`}>
                                            {payrollDetails.payslip_items.map((item, idx) => (
                                              <li key={idx}>{item.label} ({item.type}): RM {parseFloat(item.amount).toFixed(2)}</li>
                                            ))}
                                          </ul>
                                        </div>

                                        <div className="mt-2">
                                          <strong className={`${textMain}`}>Employer Contributions (Detailed):</strong>
                                          <ul className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${textSub}`}>
                                            {payrollDetails.employer_contributions.map((item, idx) => (
                                              <li key={idx}>{item.label}: RM {parseFloat(item.amount).toFixed(2)}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
