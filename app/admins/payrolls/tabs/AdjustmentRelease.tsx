// // // // // 'use client';

// // // // // import { useEffect, useState } from 'react';
// // // // // import { toast, Toaster } from 'react-hot-toast';
// // // // // import { API_BASE_URL } from '../../../config';

// // // // // interface PayrollRecord {
// // // // //   id: number;
// // // // //   employee_name: string;
// // // // //   amount: number;
// // // // //   status_code: string;
// // // // //   bank_account: string;
// // // // //   bank_code: string;
// // // // // }

// // // // // interface BankTemplateModalProps {
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // //   selectedIds: number[];
// // // // //   onGenerate: (bankName: string, employerCode: string) => void;
// // // // // }

// // // // // function BankTemplateModal({ isOpen, onClose, selectedIds, onGenerate }: BankTemplateModalProps) {
// // // // //   const [bankName, setBankName] = useState('ALLIANCE');
// // // // //   const [employerCode, setEmployerCode] = useState('');
// // // // //   const [generatedContent, setGeneratedContent] = useState('');
// // // // //   const [fileName, setFileName] = useState('');

// // // // //   const handleGenerate = async () => {
// // // // //     if (!employerCode.trim()) {
// // // // //       toast.error('Please enter the Employer/Company Code');
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const response = await fetch('/api/bank-template/generate', {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({
// // // // //           payroll_ids: selectedIds,
// // // // //           bank_name: bankName,
// // // // //           employer_code: employerCode
// // // // //         })
// // // // //       });

// // // // //       const data = await response.json();

// // // // //       if (data.success) {
// // // // //         setGeneratedContent(data.file_content);
// // // // //         setFileName(data.file_name);
// // // // //         toast.success('Bank template generated successfully!');
// // // // //         onGenerate(bankName, employerCode);
// // // // //       } else {
// // // // //         toast.error(data.error || 'Failed to generate template');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       toast.error('Failed to generate bank template');
// // // // //     }
// // // // //   };

// // // // //   const handleDownload = () => {
// // // // //     if (generatedContent && fileName) {
// // // // //       const blob = new Blob([generatedContent], { type: 'text/plain' });
// // // // //       const url = URL.createObjectURL(blob);
// // // // //       const a = document.createElement('a');
// // // // //       a.href = url;
// // // // //       a.download = fileName;
// // // // //       document.body.appendChild(a);
// // // // //       a.click();
// // // // //       document.body.removeChild(a);
// // // // //       URL.revokeObjectURL(url);
// // // // //       toast.success('Template downloaded successfully!');
// // // // //     }
// // // // //   };

// // // // //   if (!isOpen) return null;

// // // // //   return (
// // // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // // //       <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
// // // // //         <div className="flex justify-between items-center mb-4">
// // // // //           <h2 className="text-xl font-semibold">Generate Bank Template</h2>
// // // // //           <button
// // // // //             onClick={onClose}
// // // // //             className="text-gray-500 hover:text-gray-700 text-2xl"
// // // // //           >
// // // // //             ×
// // // // //           </button>
// // // // //         </div>

// // // // //         <div className="space-y-4">
// // // // //           <div>
// // // // //             <label className="block text-sm font-medium mb-2">Select Bank:</label>
// // // // //             <select
// // // // //               value={bankName}
// // // // //               onChange={(e) => setBankName(e.target.value)}
// // // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // // //             >
// // // // //               <option value="ALLIANCE">Alliance Bank</option>
// // // // //               <option value="AMBBANK">AMBBANK</option>
// // // // //               <option value="PBE">PBE (Public Bank Berhad)</option>
// // // // //             </select>
// // // // //           </div>

// // // // //           <div>
// // // // //             <label className="block text-sm font-medium mb-2">Employer/Company Code:</label>
// // // // //             <input
// // // // //               type="text"
// // // // //               value={employerCode}
// // // // //               onChange={(e) => setEmployerCode(e.target.value)}
// // // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // // //               placeholder="Enter employer code"
// // // // //             />
// // // // //           </div>

// // // // //           <button
// // // // //             onClick={handleGenerate}
// // // // //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
// // // // //           >
// // // // //             Generate Template
// // // // //           </button>

// // // // //           {generatedContent && (
// // // // //             <div className="space-y-2">
// // // // //               <label className="block text-sm font-medium">Generated Template:</label>
// // // // //               <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40 overflow-y-auto border">
// // // // //                 {generatedContent}
// // // // //               </pre>
// // // // //               <button
// // // // //                 onClick={handleDownload}
// // // // //                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
// // // // //               >
// // // // //                 Download Template
// // // // //               </button>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default function PayrollAdjustmentRelease() {
// // // // //   const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [selectedIds, setSelectedIds] = useState<number[]>([]);
// // // // //   const [employeeNameFilter, setEmployeeNameFilter] = useState('');
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // // //   const fetchPayrollRecords = async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //         // `${API_BASE_URL}/api/payroll/adjustments/?period_month=${month}&period_year=${year}&all_data=true&status=DRAFT`
// // // // //       const response = await fetch(`${API_BASE_URL}/api/payroll/adjustments/?period_month=${11}&period_year=${2025}&all_data=true&status=DRAFT`);//`${API_BASE_URL}/api/adjustments/final?employee_name=${employeeNameFilter}`);
// // // // //       const data = await response.json();
// // // // //       setPayrollRecords(data.data || []);
// // // // //     } catch (error) {
// // // // //       toast.error('Failed to fetch payroll records');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchPayrollRecords();
// // // // //   }, []);

// // // // //   const handleFilterApply = () => {
// // // // //     fetchPayrollRecords();
// // // // //   };

// // // // //   const handleSelectRecord = (id: number, checked: boolean) => {
// // // // //     if (checked) {
// // // // //       setSelectedIds(prev => [...prev, id]);
// // // // //     } else {
// // // // //       setSelectedIds(prev => prev.filter(item => item !== id));
// // // // //     }
// // // // //   };

// // // // //   const handleSelectAll = (checked: boolean) => {
// // // // //     if (checked) {
// // // // //       setSelectedIds(payrollRecords.map(record => record.id));
// // // // //     } else {
// // // // //       setSelectedIds([]);
// // // // //     }
// // // // //   };

// // // // //   const handleReleaseSelected = () => {
// // // // //     if (selectedIds.length === 0) {
// // // // //       toast.error('Please select at least one payroll record to release');
// // // // //       return;
// // // // //     }
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
// // // // //     try {
// // // // //       // Update status to released
// // // // //       const response = await fetch(`${API_BASE_URL}/api/adjustments/release`, {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({ payroll_ids: selectedIds })
// // // // //       });

// // // // //       if (response.ok) {
// // // // //         toast.success('Payroll records released successfully!');
// // // // //         setSelectedIds([]);
// // // // //         fetchPayrollRecords(); // Refresh the list
// // // // //       }
// // // // //     } catch (error) {
// // // // //       toast.error('Failed to release payroll records');
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gray-50">
// // // // //       <Toaster position="top-right" />
      
// // // // //       <div className="container mx-auto px-4 py-8">
// // // // //         <div className="bg-white rounded-lg shadow-sm border">
// // // // //           <div className="p-6 border-b">
// // // // //             <h1 className="text-2xl font-bold text-gray-900">Payroll Adjustment Release</h1>
// // // // //             <p className="text-gray-600 mt-1">Manage and release final payroll adjustments</p>
// // // // //           </div>

// // // // //           {/* Filter Section */}
// // // // //           <div className="p-6 border-b bg-gray-50">
// // // // //             <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
// // // // //             <div className="flex gap-4 items-end">
// // // // //               <div className="flex-1">
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Employee Name
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={employeeNameFilter}
// // // // //                   onChange={(e) => setEmployeeNameFilter(e.target.value)}
// // // // //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // // //                   placeholder="Search by employee name"
// // // // //                 />
// // // // //               </div>
// // // // //               <button
// // // // //                 onClick={handleFilterApply}
// // // // //                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
// // // // //               >
// // // // //                 Apply Filter
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Records Section */}
// // // // //           <div className="p-6">
// // // // //             <div className="flex justify-between items-center mb-4">
// // // // //               <h2 className="text-lg font-semibold">Final Payroll Records</h2>
// // // // //               <div className="flex gap-2 items-center">
// // // // //                 <span className="text-sm text-gray-500">
// // // // //                   {selectedIds.length} of {payrollRecords.length} selected
// // // // //                 </span>
// // // // //                 <button
// // // // //                   onClick={handleReleaseSelected}
// // // // //                   disabled={selectedIds.length === 0}
// // // // //                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
// // // // //                 >
// // // // //                   Release Selected ({selectedIds.length})
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>

// // // // //             {loading ? (
// // // // //               <div className="flex justify-center items-center h-32">
// // // // //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// // // // //               </div>
// // // // //             ) : (
// // // // //               <div className="overflow-x-auto">
// // // // //                 <table className="w-full border-collapse border border-gray-200">
// // // // //                   <thead>
// // // // //                     <tr className="bg-gray-50">
// // // // //                       <th className="border border-gray-200 p-3 text-left">
// // // // //                         <input
// // // // //                           type="checkbox"
// // // // //                           checked={payrollRecords.length > 0 && selectedIds.length === payrollRecords.length}
// // // // //                           onChange={(e) => handleSelectAll(e.target.checked)}
// // // // //                           className="rounded"
// // // // //                         />
// // // // //                       </th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Amount</th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Code</th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
// // // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
// // // // //                     </tr>
// // // // //                   </thead>
// // // // //                   <tbody>
// // // // //                     {payrollRecords.length === 0 ? (
// // // // //                       <tr>
// // // // //                         <td colSpan={7} className="border border-gray-200 p-8 text-center text-gray-500">
// // // // //                           No final payroll records found
// // // // //                         </td>
// // // // //                       </tr>
// // // // //                     ) : (
// // // // //                       payrollRecords.map((record) => (
// // // // //                         <tr key={record.id} className="hover:bg-gray-50">
// // // // //                           <td className="border border-gray-200 p-3">
// // // // //                             <input
// // // // //                               type="checkbox"
// // // // //                               checked={selectedIds.includes(record.id)}
// // // // //                               onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
// // // // //                               className="rounded"
// // // // //                             />
// // // // //                           </td>
// // // // //                           <td className="border border-gray-200 p-3">{record.id}</td>
// // // // //                           <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
// // // // //                           <td className="border border-gray-200 p-3">${record.amount.toFixed(2)}</td>
// // // // //                           <td className="border border-gray-200 p-3">{record.bank_code}</td>
// // // // //                           <td className="border border-gray-200 p-3">{record.bank_account}</td>
// // // // //                           <td className="border border-gray-200 p-3">
// // // // //                             <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
// // // // //                               {record.status_code}
// // // // //                             </span>
// // // // //                           </td>
// // // // //                         </tr>
// // // // //                       ))
// // // // //                     )}
// // // // //                   </tbody>
// // // // //                 </table>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <BankTemplateModal
// // // // //         isOpen={isModalOpen}
// // // // //         onClose={() => setIsModalOpen(false)}
// // // // //         selectedIds={selectedIds}
// // // // //         onGenerate={handleBankTemplateGenerate}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useEffect, useState } from 'react';
// // // // import { toast, Toaster } from 'react-hot-toast';

// // // // // Mock API base URL
// // // // const API_BASE_URL = 'http://localhost:3001/api';

// // // // // Mock data for payroll records
// // // // const mockPayrollRecords = [
// // // //   {
// // // //     id: 1,
// // // //     employee_name: 'Chong Win Win',
// // // //     amount: 11780.79,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '0900613145483',
// // // //     bank_code: 'MBBEMYKL',
// // // //   },
// // // //   {
// // // //     id: 2,
// // // //     employee_name: 'Lee Hao Wong',
// // // //     amount: 3456.7,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '0921227146259',
// // // //     bank_code: 'MBBEMYKL',
// // // //   },
// // // //   {
// // // //     id: 3,
// // // //     employee_name: 'Chan Zai San',
// // // //     amount: 121195.0,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '841010045112',
// // // //     bank_code: 'PBBEMYKL',
// // // //   },
// // // //   {
// // // //     id: 4,
// // // //     employee_name: 'Ng Zai San',
// // // //     amount: 121190.0,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '870521305111',
// // // //     bank_code: 'PBBEMYKL',
// // // //   },
// // // //   {
// // // //     id: 5,
// // // //     employee_name: 'Chin Ah Seng',
// // // //     amount: 11.6,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '123456789',
// // // //     bank_code: 'PBBEMYKL',
// // // //   },
// // // //   {
// // // //     id: 6,
// // // //     employee_name: 'Tan Ah Seng',
// // // //     amount: 11.25,
// // // //     status_code: 'DRAFT',
// // // //     bank_account: '123456789',
// // // //     bank_code: 'MBBEMYKL',
// // // //   },
// // // // ];

// // // // // Mock function to simulate API calls
// // // // const mockFetch = (url, options = {}) => {
// // // //   return new Promise((resolve, reject) => {
// // // //     setTimeout(() => {
// // // //       if (url.includes(`${API_BASE_URL}/api/payroll/adjustments`)) {
// // // //         // Filter by employee name if provided
// // // //         const params = new URLSearchParams(url.split('?')[1]);
// // // //         const employeeName = params.get('employee_name');
        
// // // //         let filteredRecords = mockPayrollRecords;
// // // //         if (employeeName) {
// // // //           filteredRecords = mockPayrollRecords.filter(record =>
// // // //             record.employee_name.toLowerCase().includes(employeeName.toLowerCase())
// // // //           );
// // // //         }
        
// // // //         resolve({
// // // //           ok: true,
// // // //           json: () => Promise.resolve({ data: filteredRecords })
// // // //         });
// // // //       } else if (url.includes(`${API_BASE_URL}/api/adjustments/release`)) {
// // // //         // Update status to released
// // // //         const payrollIds = JSON.parse(options.body).payroll_ids;
        
// // // //         payrollIds.forEach(id => {
// // // //           const record = mockPayrollRecords.find(r => r.id === id);
// // // //           if (record) {
// // // //             record.status_code = 'RELEASED';
// // // //           }
// // // //         });
        
// // // //         resolve({
// // // //           ok: true,
// // // //           json: () => Promise.resolve({ success: true })
// // // //         });
// // // //       } else if (url.includes('/api/bank-template/generate')) {
// // // //         // Generate bank template
// // // //         const { payroll_ids, bank_name, employer_code } = JSON.parse(options.body);
        
// // // //         const selectedRecords = mockPayrollRecords.filter(record => 
// // // //           payroll_ids.includes(record.id)
// // // //         );
        
// // // //         let fileContent = '';
// // // //         let fileName = '';
        
// // // //         if (bank_name === 'AMBBANK') {
// // // //           fileName = `AMBBBANK_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // // //           selectedRecords.forEach(record => {
// // // //             // Format: ReferenceNo(20) Date(8) EmployerCode(10) EmployeeName(50) BankAccount(20) Amount(15) Reserved(5)
// // // //             const referenceNo = `SAMBB${String(record.id).padStart(15, '0')}`;
// // // //             const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
// // // //             const employerCode = employer_code.padEnd(10, ' ');
// // // //             const employeeName = record.employee_name.padEnd(50, ' ');
// // // //             const bankAccount = record.bank_account.padEnd(20, ' ');
// // // //             const amount = `MY${record.amount.toFixed(2).padStart(15, '0')}`;
            
// // // //             fileContent += `${referenceNo}${date}${employerCode}${employeeName}${bankAccount}${amount}0    \n`;
// // // //           });
// // // //         } else if (bank_name === 'PBE') {
// // // //           fileName = `pbe_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // // //           // Header
// // // //           fileContent += `H3223289903${new Date().toISOString().slice(0, 10).replace(/-/g, '')}\n`;
          
// // // //           // Details
// // // //           selectedRecords.forEach(record => {
// // // //             const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
// // // //             const employerCode = employer_code.padEnd(10, ' ');
// // // //             const referenceNo = `IBG${String(record.id).padStart(12, '0')}`;
// // // //             const bankCode = record.bank_code.padEnd(10, ' ');
// // // //             const employeeName = record.employee_name.padEnd(120, ' ');
// // // //             const idNumber = record.bank_account.padStart(20, 'NI');
// // // //             const amount = String(Math.round(record.amount * 100)).padStart(15, ' ');
// // // //             const suffix = `S${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}_${employer_code}`;
            
// // // //             fileContent += `D${date}${employerCode} ${referenceNo}        ${bankCode}${employeeName}${idNumber}                 ${amount}          ${suffix}\n`;
// // // //           });
// // // //         } else { // ALLIANCE
// // // //           fileName = `alliance_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // // //           selectedRecords.forEach(record => {
// // // //             // Format: LGP|EmployeeName|BankAccount|BankCode|Amount|Period||Reference||||N||||||||
// // // //             const period = `${String(new Date().getMonth() + 1).padStart(2, '0')}${new Date().getFullYear()}`;
// // // //             const reference = String(record.id).padStart(12, '0');
            
// // // //             fileContent += `LGP|${record.employee_name}|${record.bank_account}|${record.bank_code}|${record.amount.toFixed(2)}|${period}||${reference}||||N||||||||\n`;
// // // //           });
// // // //         }
        
// // // //         resolve({
// // // //           ok: true,
// // // //           json: () => Promise.resolve({
// // // //             success: true,
// // // //             file_content: fileContent,
// // // //             file_name: fileName
// // // //           })
// // // //         });
// // // //       } else {
// // // //         reject(new Error('API endpoint not found'));
// // // //       }
// // // //     }, 500); // Simulate network delay
// // // //   });
// // // // };

// // // // // Interface definitions
// // // // interface PayrollRecord {
// // // //   id: number;
// // // //   employee_name: string;
// // // //   amount: number;
// // // //   status_code: string;
// // // //   bank_account: string;
// // // //   bank_code: string;
// // // // }

// // // // interface BankTemplateModalProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // //   selectedIds: number[];
// // // //   onGenerate: (bankName: string, employerCode: string) => void;
// // // // }

// // // // // Bank Template Modal Component
// // // // function BankTemplateModal({ isOpen, onClose, selectedIds, onGenerate }: BankTemplateModalProps) {
// // // //   const [bankName, setBankName] = useState('ALLIANCE');
// // // //   const [employerCode, setEmployerCode] = useState('');
// // // //   const [generatedContent, setGeneratedContent] = useState('');
// // // //   const [fileName, setFileName] = useState('');

// // // //   const handleGenerate = async () => {
// // // //     if (!employerCode.trim()) {
// // // //       toast.error('Please enter the Employer/Company Code');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const response = await mockFetch('/api/bank-template/generate', {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({
// // // //           payroll_ids: selectedIds,
// // // //           bank_name: bankName,
// // // //           employer_code: employerCode
// // // //         })
// // // //       });

// // // //       const data = await response.json();

// // // //       if (data.success) {
// // // //         setGeneratedContent(data.file_content);
// // // //         setFileName(data.file_name);
// // // //         toast.success('Bank template generated successfully!');
// // // //         onGenerate(bankName, employerCode);
// // // //       } else {
// // // //         toast.error(data.error || 'Failed to generate template');
// // // //       }
// // // //     } catch (error) {
// // // //       toast.error('Failed to generate bank template');
// // // //     }
// // // //   };

// // // //   const handleDownload = () => {
// // // //     if (generatedContent && fileName) {
// // // //       const blob = new Blob([generatedContent], { type: 'text/plain' });
// // // //       const url = URL.createObjectURL(blob);
// // // //       const a = document.createElement('a');
// // // //       a.href = url;
// // // //       a.download = fileName;
// // // //       document.body.appendChild(a);
// // // //       a.click();
// // // //       document.body.removeChild(a);
// // // //       URL.revokeObjectURL(url);
// // // //       toast.success('Template downloaded successfully!');
// // // //     }
// // // //   };

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // //       <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center mb-4">
// // // //           <h2 className="text-xl font-semibold">Generate Bank Template</h2>
// // // //           <button
// // // //             onClick={onClose}
// // // //             className="text-gray-500 hover:text-gray-700 text-2xl"
// // // //           >
// // // //             ×
// // // //           </button>
// // // //         </div>

// // // //         <div className="space-y-4">
// // // //           <div>
// // // //             <label className="block text-sm font-medium mb-2">Select Bank:</label>
// // // //             <select
// // // //               value={bankName}
// // // //               onChange={(e) => setBankName(e.target.value)}
// // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //             >
// // // //               <option value="ALLIANCE">Alliance Bank</option>
// // // //               <option value="AMBBANK">AMBBANK</option>
// // // //               <option value="PBE">PBE (Public Bank Berhad)</option>
// // // //             </select>
// // // //           </div>

// // // //           <div>
// // // //             <label className="block text-sm font-medium mb-2">Employer/Company Code:</label>
// // // //             <input
// // // //               type="text"
// // // //               value={employerCode}
// // // //               onChange={(e) => setEmployerCode(e.target.value)}
// // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //               placeholder="Enter employer code"
// // // //             />
// // // //           </div>

// // // //           <button
// // // //             onClick={handleGenerate}
// // // //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
// // // //           >
// // // //             Generate Template
// // // //           </button>

// // // //           {generatedContent && (
// // // //             <div className="space-y-2">
// // // //               <label className="block text-sm font-medium">Generated Template:</label>
// // // //               <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40 overflow-y-auto border">
// // // //                 {generatedContent}
// // // //               </pre>
// // // //               <button
// // // //                 onClick={handleDownload}
// // // //                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
// // // //               >
// // // //                 Download Template
// // // //               </button>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Main Component
// // // // export default function PayrollAdjustmentRelease() {
// // // //   const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [selectedIds, setSelectedIds] = useState<number[]>([]);
// // // //   const [employeeNameFilter, setEmployeeNameFilter] = useState('');
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // //   const fetchPayrollRecords = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const url = employeeNameFilter 
// // // //         ? `${API_BASE_URL}/payroll/adjustments?employee_name=${encodeURIComponent(employeeNameFilter)}`
// // // //         : `${API_BASE_URL}/payroll/adjustments`;
      
// // // //       const response = await mockFetch(url);
// // // //       const data = await response.json();
// // // //       setPayrollRecords(data.data || []);
// // // //     } catch (error) {
// // // //       toast.error('Failed to fetch payroll records');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchPayrollRecords();
// // // //   }, []);

// // // //   const handleFilterApply = () => {
// // // //     fetchPayrollRecords();
// // // //   };

// // // //   const handleSelectRecord = (id: number, checked: boolean) => {
// // // //     if (checked) {
// // // //       setSelectedIds(prev => [...prev, id]);
// // // //     } else {
// // // //       setSelectedIds(prev => prev.filter(item => item !== id));
// // // //     }
// // // //   };

// // // //   const handleSelectAll = (checked: boolean) => {
// // // //     if (checked) {
// // // //       setSelectedIds(payrollRecords.map(record => record.id));
// // // //     } else {
// // // //       setSelectedIds([]);
// // // //     }
// // // //   };

// // // //   const handleReleaseSelected = () => {
// // // //     if (selectedIds.length === 0) {
// // // //       toast.error('Please select at least one payroll record to release');
// // // //       return;
// // // //     }
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
// // // //     try {
// // // //       // Update status to released
// // // //       const response = await mockFetch(`${API_BASE_URL}/adjustments/release`, {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({ payroll_ids: selectedIds })
// // // //       });

// // // //       if (response.ok) {
// // // //         toast.success('Payroll records released successfully!');
// // // //         setSelectedIds([]);
// // // //         fetchPayrollRecords(); // Refresh the list
// // // //       }
// // // //     } catch (error) {
// // // //       toast.error('Failed to release payroll records');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       <Toaster position="top-right" />
      
// // // //       <div className="container mx-auto px-4 py-8">
// // // //         <div className="bg-white rounded-lg shadow-sm border">
// // // //           <div className="p-6 border-b">
// // // //             <h1 className="text-2xl font-bold text-gray-900">Payroll Adjustment Release</h1>
// // // //             <p className="text-gray-600 mt-1">Manage and release final payroll adjustments</p>
// // // //           </div>

// // // //           {/* Filter Section */}
// // // //           <div className="p-6 border-b bg-gray-50">
// // // //             <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
// // // //             <div className="flex gap-4 items-end">
// // // //               <div className="flex-1">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Employee Name
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={employeeNameFilter}
// // // //                   onChange={(e) => setEmployeeNameFilter(e.target.value)}
// // // //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                   placeholder="Search by employee name"
// // // //                 />
// // // //               </div>
// // // //               <button
// // // //                 onClick={handleFilterApply}
// // // //                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
// // // //               >
// // // //                 Apply Filter
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Records Section */}
// // // //           <div className="p-6">
// // // //             <div className="flex justify-between items-center mb-4">
// // // //               <h2 className="text-lg font-semibold">Final Payroll Records</h2>
// // // //               <div className="flex gap-2 items-center">
// // // //                 <span className="text-sm text-gray-500">
// // // //                   {selectedIds.length} of {payrollRecords.length} selected
// // // //                 </span>
// // // //                 <button
// // // //                   onClick={handleReleaseSelected}
// // // //                   disabled={selectedIds.length === 0}
// // // //                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
// // // //                 >
// // // //                   Release Selected ({selectedIds.length})
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             {loading ? (
// // // //               <div className="flex justify-center items-center h-32">
// // // //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// // // //               </div>
// // // //             ) : (
// // // //               <div className="overflow-x-auto">
// // // //                 <table className="w-full border-collapse border border-gray-200">
// // // //                   <thead>
// // // //                     <tr className="bg-gray-50">
// // // //                       <th className="border border-gray-200 p-3 text-left">
// // // //                         <input
// // // //                           type="checkbox"
// // // //                           checked={payrollRecords.length > 0 && selectedIds.length === payrollRecords.length}
// // // //                           onChange={(e) => handleSelectAll(e.target.checked)}
// // // //                           className="rounded"
// // // //                         />
// // // //                       </th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Amount</th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Code</th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
// // // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody>
// // // //                     {payrollRecords.length === 0 ? (
// // // //                       <tr>
// // // //                         <td colSpan={7} className="border border-gray-200 p-8 text-center text-gray-500">
// // // //                           No final payroll records found
// // // //                         </td>
// // // //                       </tr>
// // // //                     ) : (
// // // //                       payrollRecords.map((record) => (
// // // //                         <tr key={record.id} className="hover:bg-gray-50">
// // // //                           <td className="border border-gray-200 p-3">
// // // //                             <input
// // // //                               type="checkbox"
// // // //                               checked={selectedIds.includes(record.id)}
// // // //                               onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
// // // //                               className="rounded"
// // // //                             />
// // // //                           </td>
// // // //                           <td className="border border-gray-200 p-3">{record.id}</td>
// // // //                           <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
// // // //                           <td className="border border-gray-200 p-3">${record.amount.toFixed(2)}</td>
// // // //                           <td className="border border-gray-200 p-3">{record.bank_code}</td>
// // // //                           <td className="border border-gray-200 p-3">{record.bank_account}</td>
// // // //                           <td className="border border-gray-200 p-3">
// // // //                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// // // //                               record.status_code === 'DRAFT' 
// // // //                                 ? 'bg-yellow-100 text-yellow-800'
// // // //                                 : 'bg-green-100 text-green-800'
// // // //                             }`}>
// // // //                               {record.status_code}
// // // //                             </span>
// // // //                           </td>
// // // //                         </tr>
// // // //                       ))
// // // //                     )}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <BankTemplateModal
// // // //         isOpen={isModalOpen}
// // // //         onClose={() => setIsModalOpen(false)}
// // // //         selectedIds={selectedIds}
// // // //         onGenerate={handleBankTemplateGenerate}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import { useEffect, useState } from 'react';
// // // import { toast, Toaster } from 'react-hot-toast';

// // // // Mock API base URL
// // // const API_BASE_URL = 'http://localhost:3001/api';

// // // // Interface definitions
// // // interface PayrollRecord {
// // //   id: number;
// // //   employee_name: string;
// // //   amount: number;
// // //   status_code: string;
// // //   bank_account: string;
// // //   bank_code: string;
// // // }

// // // interface BankTemplateModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   selectedIds: number[];
// // //   onGenerate: (bankName: string, employerCode: string) => void;
// // // }

// // // interface MockFetchOptions {
// // //   method?: string;
// // //   headers?: Record<string, string>;
// // //   body?: string;
// // // }

// // // // Mock data for payroll records
// // // const mockPayrollRecords: PayrollRecord[] = [
// // //   {
// // //     id: 1,
// // //     employee_name: 'Chong Win Win',
// // //     amount: 11780.79,
// // //     status_code: 'DRAFT',
// // //     bank_account: '0900613145483',
// // //     bank_code: 'MBBEMYKL',
// // //   },
// // //   {
// // //     id: 2,
// // //     employee_name: 'Lee Hao Wong',
// // //     amount: 3456.7,
// // //     status_code: 'DRAFT',
// // //     bank_account: '0921227146259',
// // //     bank_code: 'MBBEMYKL',
// // //   },
// // //   {
// // //     id: 3,
// // //     employee_name: 'Chan Zai San',
// // //     amount: 121195.0,
// // //     status_code: 'DRAFT',
// // //     bank_account: '841010045112',
// // //     bank_code: 'PBBEMYKL',
// // //   },
// // //   {
// // //     id: 4,
// // //     employee_name: 'Ng Zai San',
// // //     amount: 121190.0,
// // //     status_code: 'DRAFT',
// // //     bank_account: '870521305111',
// // //     bank_code: 'PBBEMYKL',
// // //   },
// // //   {
// // //     id: 5,
// // //     employee_name: 'Chin Ah Seng',
// // //     amount: 11.6,
// // //     status_code: 'DRAFT',
// // //     bank_account: '123456789',
// // //     bank_code: 'PBBEMYKL',
// // //   },
// // //   {
// // //     id: 6,
// // //     employee_name: 'Tan Ah Seng',
// // //     amount: 11.25,
// // //     status_code: 'DRAFT',
// // //     bank_account: '123456789',
// // //     bank_code: 'MBBEMYKL',
// // //   },
// // // ];

// // // // Mock function to simulate API calls with proper typing
// // // const mockFetch = (url: string, options: MockFetchOptions = {}): Promise<Response> => {
// // //   return new Promise((resolve, reject) => {
// // //     setTimeout(() => {
// // //       if (url.includes('/api/payroll/adjustments')) {
// // //         // Filter by employee name if provided
// // //         const urlObj = new URL(url, 'http://localhost');
// // //         const employeeName = urlObj.searchParams.get('employee_name');
        
// // //         let filteredRecords = mockPayrollRecords;
// // //         if (employeeName) {
// // //           filteredRecords = mockPayrollRecords.filter(record =>
// // //             record.employee_name.toLowerCase().includes(employeeName.toLowerCase())
// // //           );
// // //         }
        
// // //         resolve({
// // //           ok: true,
// // //           json: () => Promise.resolve({ data: filteredRecords }),
// // //           status: 200,
// // //           statusText: 'OK',
// // //           headers: new Headers({ 'Content-Type': 'application/json' }),
// // //         } as Response);
// // //       } else if (url.includes('/api/adjustments/release')) {
// // //         // Update status to released
// // //         const body = options.body ? JSON.parse(options.body) : {};
// // //         const payrollIds = body.payroll_ids || [];
        
// // //         payrollIds.forEach((id: number) => {
// // //           const record = mockPayrollRecords.find(r => r.id === id);
// // //           if (record) {
// // //             record.status_code = 'RELEASED';
// // //           }
// // //         });
        
// // //         resolve({
// // //           ok: true,
// // //           json: () => Promise.resolve({ success: true }),
// // //           status: 200,
// // //           statusText: 'OK',
// // //           headers: new Headers({ 'Content-Type': 'application/json' }),
// // //         } as Response);
// // //       } else if (url.includes('/api/bank-template/generate')) {
// // //         // Generate bank template
// // //         const body = options.body ? JSON.parse(options.body) : {};
// // //         const { payroll_ids, bank_name, employer_code } = body;
        
// // //         const selectedRecords = mockPayrollRecords.filter(record => 
// // //           payroll_ids.includes(record.id)
// // //         );
        
// // //         let fileContent = '';
// // //         let fileName = '';
        
// // //         if (bank_name === 'AMBBANK') {
// // //           fileName = `AMBBBANK_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // //           selectedRecords.forEach(record => {
// // //             // Format: ReferenceNo(20) Date(8) EmployerCode(10) EmployeeName(50) BankAccount(20) Amount(15) Reserved(5)
// // //             const referenceNo = `SAMBB${String(record.id).padStart(15, '0')}`;
// // //             const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
// // //             const employerCode = employer_code.padEnd(10, ' ');
// // //             const employeeName = record.employee_name.padEnd(50, ' ');
// // //             const bankAccount = record.bank_account.padEnd(20, ' ');
// // //             const amount = `MY${record.amount.toFixed(2).padStart(15, '0')}`;
            
// // //             fileContent += `${referenceNo}${date}${employerCode}${employeeName}${bankAccount}${amount}0    \n`;
// // //           });
// // //         } else if (bank_name === 'PBE') {
// // //           fileName = `pbe_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // //           // Header
// // //           fileContent += `H3223289903${new Date().toISOString().slice(0, 10).replace(/-/g, '')}\n`;
          
// // //           // Details
// // //           selectedRecords.forEach(record => {
// // //             const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
// // //             const employerCode = employer_code.padEnd(10, ' ');
// // //             const referenceNo = `IBG${String(record.id).padStart(12, '0')}`;
// // //             const bankCode = record.bank_code.padEnd(10, ' ');
// // //             const employeeName = record.employee_name.padEnd(120, ' ');
// // //             const idNumber = record.bank_account.padStart(20, 'NI');
// // //             const amount = String(Math.round(record.amount * 100)).padStart(15, ' ');
// // //             const suffix = `S${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}_${employer_code}`;
            
// // //             fileContent += `D${date}${employerCode} ${referenceNo}        ${bankCode}${employeeName}${idNumber}                 ${amount}          ${suffix}\n`;
// // //           });
// // //         } else { // ALLIANCE
// // //           fileName = `alliance_${employer_code}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
          
// // //           selectedRecords.forEach(record => {
// // //             // Format: LGP|EmployeeName|BankAccount|BankCode|Amount|Period||Reference||||N||||||||
// // //             const period = `${String(new Date().getMonth() + 1).padStart(2, '0')}${new Date().getFullYear()}`;
// // //             const reference = String(record.id).padStart(12, '0');
            
// // //             fileContent += `LGP|${record.employee_name}|${record.bank_account}|${record.bank_code}|${record.amount.toFixed(2)}|${period}||${reference}||||N||||||||\n`;
// // //           });
// // //         }
        
// // //         resolve({
// // //           ok: true,
// // //           json: () => Promise.resolve({
// // //             success: true,
// // //             file_content: fileContent,
// // //             file_name: fileName
// // //           }),
// // //           status: 200,
// // //           statusText: 'OK',
// // //           headers: new Headers({ 'Content-Type': 'application/json' }),
// // //         } as Response);
// // //       } else {
// // //         reject(new Error('API endpoint not found'));
// // //       }
// // //     }, 500); // Simulate network delay
// // //   });
// // // };

// // // // Bank Template Modal Component
// // // function BankTemplateModal({ isOpen, onClose, selectedIds, onGenerate }: BankTemplateModalProps) {
// // //   const [bankName, setBankName] = useState('ALLIANCE');
// // //   const [employerCode, setEmployerCode] = useState('');
// // //   const [generatedContent, setGeneratedContent] = useState('');
// // //   const [fileName, setFileName] = useState('');

// // //   const handleGenerate = async () => {
// // //     if (!employerCode.trim()) {
// // //       toast.error('Please enter the Employer/Company Code');
// // //       return;
// // //     }

// // //     try {
// // //       const response = await mockFetch('/api/bank-template/generate', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({
// // //           payroll_ids: selectedIds,
// // //           bank_name: bankName,
// // //           employer_code: employerCode
// // //         })
// // //       });

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         setGeneratedContent(data.file_content);
// // //         setFileName(data.file_name);
// // //         toast.success('Bank template generated successfully!');
// // //         onGenerate(bankName, employerCode);
// // //       } else {
// // //         toast.error(data.error || 'Failed to generate template');
// // //       }
// // //     } catch (error) {
// // //       toast.error('Failed to generate bank template');
// // //     }
// // //   };

// // //   const handleDownload = () => {
// // //     if (generatedContent && fileName) {
// // //       const blob = new Blob([generatedContent], { type: 'text/plain' });
// // //       const url = URL.createObjectURL(blob);
// // //       const a = document.createElement('a');
// // //       a.href = url;
// // //       a.download = fileName;
// // //       document.body.appendChild(a);
// // //       a.click();
// // //       document.body.removeChild(a);
// // //       URL.revokeObjectURL(url);
// // //       toast.success('Template downloaded successfully!');
// // //     }
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //       <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
// // //         <div className="flex justify-between items-center mb-4">
// // //           <h2 className="text-xl font-semibold">Generate Bank Template</h2>
// // //           <button
// // //             onClick={onClose}
// // //             className="text-gray-500 hover:text-gray-700 text-2xl"
// // //           >
// // //             ×
// // //           </button>
// // //         </div>

// // //         <div className="space-y-4">
// // //           <div>
// // //             <label className="block text-sm font-medium mb-2">Select Bank:</label>
// // //             <select
// // //               value={bankName}
// // //               onChange={(e) => setBankName(e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             >
// // //               <option value="ALLIANCE">Alliance Bank</option>
// // //               <option value="AMBBANK">AMBBANK</option>
// // //               <option value="PBE">PBE (Public Bank Berhad)</option>
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium mb-2">Employer/Company Code:</label>
// // //             <input
// // //               type="text"
// // //               value={employerCode}
// // //               onChange={(e) => setEmployerCode(e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //               placeholder="Enter employer code"
// // //             />
// // //           </div>

// // //           <button
// // //             onClick={handleGenerate}
// // //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
// // //           >
// // //             Generate Template
// // //           </button>

// // //           {generatedContent && (
// // //             <div className="space-y-2">
// // //               <label className="block text-sm font-medium">Generated Template:</label>
// // //               <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40 overflow-y-auto border">
// // //                 {generatedContent}
// // //               </pre>
// // //               <button
// // //                 onClick={handleDownload}
// // //                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
// // //               >
// // //                 Download Template
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Main Component
// // // export default function PayrollAdjustmentRelease() {
// // //   const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedIds, setSelectedIds] = useState<number[]>([]);
// // //   const [employeeNameFilter, setEmployeeNameFilter] = useState('');
// // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // //   const fetchPayrollRecords = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const url = employeeNameFilter 
// // //         ? `${API_BASE_URL}/payroll/adjustments?employee_name=${encodeURIComponent(employeeNameFilter)}`
// // //         : `${API_BASE_URL}/payroll/adjustments`;
      
// // //       const response = await mockFetch(url);
// // //       const data = await response.json();
// // //       setPayrollRecords(data.data || []);
// // //     } catch (error) {
// // //       toast.error('Failed to fetch payroll records');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchPayrollRecords();
// // //   }, []);

// // //   const handleFilterApply = () => {
// // //     fetchPayrollRecords();
// // //   };

// // //   const handleSelectRecord = (id: number, checked: boolean) => {
// // //     if (checked) {
// // //       setSelectedIds(prev => [...prev, id]);
// // //     } else {
// // //       setSelectedIds(prev => prev.filter(item => item !== id));
// // //     }
// // //   };

// // //   const handleSelectAll = (checked: boolean) => {
// // //     if (checked) {
// // //       setSelectedIds(payrollRecords.map(record => record.id));
// // //     } else {
// // //       setSelectedIds([]);
// // //     }
// // //   };

// // //   const handleReleaseSelected = () => {
// // //     if (selectedIds.length === 0) {
// // //       toast.error('Please select at least one payroll record to release');
// // //       return;
// // //     }
// // //     setIsModalOpen(true);
// // //   };

// // //   const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
// // //     try {
// // //       // Update status to released
// // //       const response = await mockFetch(`${API_BASE_URL}/adjustments/release`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ payroll_ids: selectedIds })
// // //       });

// // //       if (response.ok) {
// // //         toast.success('Payroll records released successfully!');
// // //         setSelectedIds([]);
// // //         fetchPayrollRecords(); // Refresh the list
// // //       }
// // //     } catch (error) {
// // //       toast.error('Failed to release payroll records');
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <Toaster position="top-right" />
      
// // //       <div className="container mx-auto px-4 py-8">
// // //         <div className="bg-white rounded-lg shadow-sm border">
// // //           <div className="p-6 border-b">
// // //             <h1 className="text-2xl font-bold text-gray-900">Payroll Adjustment Release</h1>
// // //             <p className="text-gray-600 mt-1">Manage and release final payroll adjustments</p>
// // //           </div>

// // //           {/* Filter Section */}
// // //           <div className="p-6 border-b bg-gray-50">
// // //             <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
// // //             <div className="flex gap-4 items-end">
// // //               <div className="flex-1">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Employee Name
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={employeeNameFilter}
// // //                   onChange={(e) => setEmployeeNameFilter(e.target.value)}
// // //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                   placeholder="Search by employee name"
// // //                 />
// // //               </div>
// // //               <button
// // //                 onClick={handleFilterApply}
// // //                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
// // //               >
// // //                 Apply Filter
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Records Section */}
// // //           <div className="p-6">
// // //             <div className="flex justify-between items-center mb-4">
// // //               <h2 className="text-lg font-semibold">Final Payroll Records</h2>
// // //               <div className="flex gap-2 items-center">
// // //                 <span className="text-sm text-gray-500">
// // //                   {selectedIds.length} of {payrollRecords.length} selected
// // //                 </span>
// // //                 <button
// // //                   onClick={handleReleaseSelected}
// // //                   disabled={selectedIds.length === 0}
// // //                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
// // //                 >
// // //                   Release Selected ({selectedIds.length})
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {loading ? (
// // //               <div className="flex justify-center items-center h-32">
// // //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// // //               </div>
// // //             ) : (
// // //               <div className="overflow-x-auto">
// // //                 <table className="w-full border-collapse border border-gray-200">
// // //                   <thead>
// // //                     <tr className="bg-gray-50">
// // //                       <th className="border border-gray-200 p-3 text-left">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={payrollRecords.length > 0 && selectedIds.length === payrollRecords.length}
// // //                           onChange={(e) => handleSelectAll(e.target.checked)}
// // //                           className="rounded"
// // //                         />
// // //                       </th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Amount</th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Code</th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
// // //                       <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {payrollRecords.length === 0 ? (
// // //                       <tr>
// // //                         <td colSpan={7} className="border border-gray-200 p-8 text-center text-gray-500">
// // //                           No final payroll records found
// // //                         </td>
// // //                       </tr>
// // //                     ) : (
// // //                       payrollRecords.map((record) => (
// // //                         <tr key={record.id} className="hover:bg-gray-50">
// // //                           <td className="border border-gray-200 p-3">
// // //                             <input
// // //                               type="checkbox"
// // //                               checked={selectedIds.includes(record.id)}
// // //                               onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
// // //                               className="rounded"
// // //                             />
// // //                           </td>
// // //                           <td className="border border-gray-200 p-3">{record.id}</td>
// // //                           <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
// // //                           <td className="border border-gray-200 p-3">${record.amount.toFixed(2)}</td>
// // //                           <td className="border border-gray-200 p-3">{record.bank_code}</td>
// // //                           <td className="border border-gray-200 p-3">{record.bank_account}</td>
// // //                           <td className="border border-gray-200 p-3">
// // //                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// // //                               record.status_code === 'DRAFT' 
// // //                                 ? 'bg-yellow-100 text-yellow-800'
// // //                                 : 'bg-green-100 text-green-800'
// // //                             }`}>
// // //                               {record.status_code}
// // //                             </span>
// // //                           </td>
// // //                         </tr>
// // //                       ))
// // //                     )}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <BankTemplateModal
// // //         isOpen={isModalOpen}
// // //         onClose={() => setIsModalOpen(false)}
// // //         selectedIds={selectedIds}
// // //         onGenerate={handleBankTemplateGenerate}
// // //       />
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useEffect, useState, useMemo } from 'react';
// // import { toast, Toaster } from 'react-hot-toast';
// // import { API_BASE_URL } from '../../../config';

// // // Interface definitions based on your API response
// // interface PayrollApiResponse {
// //   total: number;
// //   page: number;
// //   limit: number;
// //   data: PayrollItem[];
// // }

// // interface PayrollItem {
// //   payroll: {
// //     payroll_id: number;
// //     employee_id: number;
// //     employee_name: string;
// //     employee_no: string;
// //     department_name: string;
// //     position: string;
// //     company_name: string;
// //     ic_passport_no: string;
// //     bank_name: string;
// //     bank_account_no: string;
// //     bank_account_name: string;
// //     net_salary: string;
// //     gross_salary: string;
// //     status_code: string;
// //     joined_date?: string;
// //     confirmation_date?: string;
// //     resigned_date?: string;
// //     nationality?: string;
// //     tax_no?: string;
// //     dependents?: number;
// //     marital_status?: string;
// //     currency?: string;
// //     work_location?: string;
// //     // Add other fields as needed
// //   };
// //   payslip_items: any[];
// //   employer_contributions: any[];
// //   versions: any[];
// //   audit_log: any[];
// //   success: boolean;
// // }

// // interface TransformedPayrollRecord {
// //   id: number;
// //   payroll_id: number;
// //   employee_id: number;
// //   auto_no: number;
// //   company_name: string;
// //   department_name: string;
// //   position: string;
// //   employee_no: string;
// //   employee_name: string;
// //   ic_passport_no: string;
// //   work_location: string;
// //   joined_date: string;
// //   confirmation_date: string;
// //   resigned_date: string;
// //   nationality: string;
// //   tax_no: string;
// //   dependents: number;
// //   marital_status: string;
// //   currency: string;
// //   gross_salary: number;
// //   net_salary: number;
// //   bank_name: string;
// //   bank_account_no: string;
// //   bank_account_name: string;
// //   status_code: string;
// //   // Dynamic fields from payslip_items and employer_contributions
// //   [key: string]: any;
// // }

// // interface BankTemplateModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   selectedIds: number[];
// //   onGenerate: (bankName: string, employerCode: string) => void;
// // }

// // interface BankTemplateResponse {
// //   success: boolean;
// //   file_content: string;
// //   file_name: string;
// //   error?: string;
// // }

// // // Bank Template Modal Component
// // function BankTemplateModal({ isOpen, onClose, selectedIds, onGenerate }: BankTemplateModalProps) {
// //   const [bankName, setBankName] = useState('ALLIANCE');
// //   const [employerCode, setEmployerCode] = useState('');
// //   const [generatedContent, setGeneratedContent] = useState('');
// //   const [fileName, setFileName] = useState('');
// //   const [isGenerating, setIsGenerating] = useState(false);

// //   const handleGenerate = async () => {
// //     if (!employerCode.trim()) {
// //       toast.error('Please enter the Employer/Company Code');
// //       return;
// //     }

// //     setIsGenerating(true);
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/api/bank-template/generate`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
// //         },
// //         body: JSON.stringify({
// //           payroll_ids: selectedIds,
// //           bank_name: bankName,
// //           employer_code: employerCode
// //         })
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data: BankTemplateResponse = await response.json();

// //       if (data.success) {
// //         setGeneratedContent(data.file_content);
// //         setFileName(data.file_name);
// //         toast.success('Bank template generated successfully!');
// //         onGenerate(bankName, employerCode);
// //       } else {
// //         toast.error(data.error || 'Failed to generate template');
// //       }
// //     } catch (error) {
// //       console.error('Bank template generation error:', error);
// //       toast.error('Failed to generate bank template. Please try again.');
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const handleDownload = () => {
// //     if (generatedContent && fileName) {
// //       const blob = new Blob([generatedContent], { type: 'text/plain' });
// //       const url = URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = fileName;
// //       document.body.appendChild(a);
// //       a.click();
// //       document.body.removeChild(a);
// //       URL.revokeObjectURL(url);
// //       toast.success('Template downloaded successfully!');
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-xl font-semibold">Generate Bank Template</h2>
// //           <button
// //             onClick={onClose}
// //             className="text-gray-500 hover:text-gray-700 text-2xl"
// //           >
// //             ×
// //           </button>
// //         </div>

// //         <div className="space-y-4">
// //           <div>
// //             <label className="block text-sm font-medium mb-2">Select Bank:</label>
// //             <select
// //               value={bankName}
// //               onChange={(e) => setBankName(e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             >
// //               <option value="ALLIANCE">Alliance Bank</option>
// //               <option value="AMBBANK">AMBBANK</option>
// //               <option value="PBE">PBE (Public Bank Berhad)</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium mb-2">Employer/Company Code:</label>
// //             <input
// //               type="text"
// //               value={employerCode}
// //               onChange={(e) => setEmployerCode(e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               placeholder="Enter employer code"
// //             />
// //           </div>

// //           <button
// //             onClick={handleGenerate}
// //             disabled={isGenerating}
// //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
// //           >
// //             {isGenerating ? 'Generating...' : 'Generate Template'}
// //           </button>

// //           {generatedContent && (
// //             <div className="space-y-2">
// //               <label className="block text-sm font-medium">Generated Template:</label>
// //               <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-60 overflow-y-auto border">
// //                 {generatedContent}
// //               </pre>
// //               <button
// //                 onClick={handleDownload}
// //                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
// //               >
// //                 Download Template
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main Component
// // export default function PayrollAdjustmentRelease() {
// //   const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedIds, setSelectedIds] = useState<number[]>([]);
// //   const [employeeNameFilter, setEmployeeNameFilter] = useState('');
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   // Transform API data to include all fields
// //   const transformedPayrollData = useMemo(() => {
// //     return payrollData.map((row, index) => {
// //       const payrollId = row.payroll.payroll_id;

// //       const transformed: TransformedPayrollRecord = {
// //         id: payrollId,
// //         payroll_id: payrollId,
// //         employee_id: row.payroll.employee_id,
// //         auto_no: index + 1,
// //         company_name: row.payroll.company_name || '',
// //         department_name: row.payroll.department_name || '',
// //         position: row.payroll.position || '',
// //         employee_no: row.payroll.employee_no || '',
// //         employee_name: row.payroll.employee_name || '',
// //         ic_passport_no: row.payroll.ic_passport_no || '',
// //         work_location: row.payroll.work_location || '',
// //         joined_date: row.payroll.joined_date ? new Date(row.payroll.joined_date).toLocaleDateString() : '',
// //         confirmation_date: row.payroll.confirmation_date ? new Date(row.payroll.confirmation_date).toLocaleDateString() : '',
// //         resigned_date: row.payroll.resigned_date ? new Date(row.payroll.resigned_date).toLocaleDateString() : '',
// //         nationality: row.payroll.nationality || '',
// //         tax_no: row.payroll.tax_no || '',
// //         dependents: row.payroll.dependents || 0,
// //         marital_status: row.payroll.marital_status || '',
// //         currency: row.payroll.currency || 'MYR',
// //         gross_salary: parseFloat(row.payroll.gross_salary) || 0,
// //         net_salary: parseFloat(row.payroll.net_salary) || 0,
// //         bank_name: row.payroll.bank_name || '',
// //         bank_account_no: row.payroll.bank_account_no || '',
// //         bank_account_name: row.payroll.bank_account_name || '',
// //         status_code: row.payroll.status_code || 'DRAFT',
// //       };

// //       // Add payslip items
// //       row.payslip_items?.forEach(item => {
// //         const prefix = item.type.toLowerCase();
// //         const key = `payslip_${prefix}_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
// //         transformed[key] = parseFloat(item.amount) || 0;
// //       });

// //       // Add employer contributions
// //       row.employer_contributions?.forEach(item => {
// //         const key = `employer_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
// //         transformed[key] = parseFloat(item.amount) || 0;
// //       });

// //       return transformed;
// //     });
// //   }, [payrollData]);

// //   const fetchPayrollRecords = async () => {
// //     setLoading(true);
// //     try {
// //       // Build the API URL with query parameters
// //       const url = new URL(`${API_BASE_URL}/api/payroll/adjustments`);
      
// //       // Add query parameters if needed
// //       if (employeeNameFilter) {
// //         url.searchParams.append('employee_name', employeeNameFilter);
// //       }
      
// //       // You might need to add other parameters based on your API
// //       url.searchParams.append('status', 'DRAFT');
// //       url.searchParams.append('all_data', 'true');
      
// //       const response = await fetch(url.toString(), {
// //         headers: {
// //           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data: PayrollApiResponse = await response.json();
// //       setPayrollData(data.data);
// //     } catch (error) {
// //       console.error('Failed to fetch payroll records:', error);
// //       toast.error('Failed to fetch payroll records. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPayrollRecords();
// //   }, []);

// //   const handleFilterApply = () => {
// //     fetchPayrollRecords();
// //   };

// //   const handleSelectRecord = (id: number, checked: boolean) => {
// //     if (checked) {
// //       setSelectedIds(prev => [...prev, id]);
// //     } else {
// //       setSelectedIds(prev => prev.filter(item => item !== id));
// //     }
// //   };

// //   const handleSelectAll = (checked: boolean) => {
// //     if (checked) {
// //       setSelectedIds(transformedPayrollData.map(record => record.id));
// //     } else {
// //       setSelectedIds([]);
// //     }
// //   };

// //   const handleReleaseSelected = () => {
// //     if (selectedIds.length === 0) {
// //       toast.error('Please select at least one payroll record to release');
// //       return;
// //     }
// //     setIsModalOpen(true);
// //   };

// //   const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
// //     try {
// //       // Update status to released
// //       const response = await fetch(`${API_BASE_URL}/api/adjustments/release`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
// //         },
// //         body: JSON.stringify({ payroll_ids: selectedIds })
// //       });

// //       if (response.ok) {
// //         toast.success('Payroll records released successfully!');
// //         setSelectedIds([]);
// //         fetchPayrollRecords(); // Refresh the list
// //       } else {
// //         throw new Error('Failed to release payroll records');
// //       }
// //     } catch (error) {
// //       console.error('Failed to release payroll records:', error);
// //       toast.error('Failed to release payroll records. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Toaster position="top-right" />
      
// //       <div className="container mx-auto px-4 py-8">
// //         <div className="bg-white rounded-lg shadow-sm border">
// //           <div className="p-6 border-b">
// //             <h1 className="text-2xl font-bold text-gray-900">Payroll Adjustment Release</h1>
// //             <p className="text-gray-600 mt-1">Manage and release final payroll adjustments</p>
// //           </div>

// //           {/* Filter Section */}
// //           <div className="p-6 border-b bg-gray-50">
// //             <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
// //             <div className="flex gap-4 items-end">
// //               <div className="flex-1">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Employee Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={employeeNameFilter}
// //                   onChange={(e) => setEmployeeNameFilter(e.target.value)}
// //                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   placeholder="Search by employee name"
// //                 />
// //               </div>
// //               <button
// //                 onClick={handleFilterApply}
// //                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
// //               >
// //                 Apply Filter
// //               </button>
// //             </div>
// //           </div>

// //           {/* Records Section */}
// //           <div className="p-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg font-semibold">Final Payroll Records</h2>
// //               <div className="flex gap-2 items-center">
// //                 <span className="text-sm text-gray-500">
// //                   {selectedIds.length} of {transformedPayrollData.length} selected
// //                 </span>
// //                 <button
// //                   onClick={handleReleaseSelected}
// //                   disabled={selectedIds.length === 0}
// //                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
// //                 >
// //                   Release Selected ({selectedIds.length})
// //                 </button>
// //               </div>
// //             </div>

// //             {loading ? (
// //               <div className="flex justify-center items-center h-32">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <table className="w-full border-collapse border border-gray-200">
// //                   <thead>
// //                     <tr className="bg-gray-50">
// //                       <th className="border border-gray-200 p-3 text-left">
// //                         <input
// //                           type="checkbox"
// //                           checked={transformedPayrollData.length > 0 && selectedIds.length === transformedPayrollData.length}
// //                           onChange={(e) => handleSelectAll(e.target.checked)}
// //                           className="rounded"
// //                         />
// //                       </th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee No</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Department</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Position</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Gross Salary</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Net Salary</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Name</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
// //                       <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {transformedPayrollData.length === 0 ? (
// //                       <tr>
// //                         <td colSpan={11} className="border border-gray-200 p-8 text-center text-gray-500">
// //                           No final payroll records found
// //                         </td>
// //                       </tr>
// //                     ) : (
// //                       transformedPayrollData.map((record) => (
// //                         <tr key={record.id} className="hover:bg-gray-50">
// //                           <td className="border border-gray-200 p-3">
// //                             <input
// //                               type="checkbox"
// //                               checked={selectedIds.includes(record.id)}
// //                               onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
// //                               className="rounded"
// //                             />
// //                           </td>
// //                           <td className="border border-gray-200 p-3">{record.id}</td>
// //                           <td className="border border-gray-200 p-3">{record.employee_no}</td>
// //                           <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
// //                           <td className="border border-gray-200 p-3">{record.department_name}</td>
// //                           <td className="border border-gray-200 p-3">{record.position}</td>
// //                           <td className="border border-gray-200 p-3">${record.gross_salary.toFixed(2)}</td>
// //                           <td className="border border-gray-200 p-3">${record.net_salary.toFixed(2)}</td>
// //                           <td className="border border-gray-200 p-3">{record.bank_name}</td>
// //                           <td className="border border-gray-200 p-3">{record.bank_account_no}</td>
// //                           <td className="border border-gray-200 p-3">
// //                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                               record.status_code === 'DRAFT' 
// //                                 ? 'bg-yellow-100 text-yellow-800'
// //                                 : record.status_code === 'RELEASED'
// //                                 ? 'bg-green-100 text-green-800'
// //                                 : 'bg-gray-100 text-gray-800'
// //                             }`}>
// //                               {record.status_code}
// //                             </span>
// //                           </td>
// //                         </tr>
// //                       ))
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <BankTemplateModal
// //         isOpen={isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //         selectedIds={selectedIds}
// //         onGenerate={handleBankTemplateGenerate}
// //       />
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { toast, Toaster } from 'react-hot-toast';
// import { API_BASE_URL } from '../../../config';

// // Interface definitions based on your API response
// interface PayrollApiResponse {
//   total: number;
//   page: number;
//   limit: number;
//   data: PayrollItem[];
// }

// interface PayrollItem {
//   payroll: {
//     payroll_id: number;
//     employee_id: number;
//     employee_name: string;
//     employee_no: string;
//     department_name: string;
//     position: string;
//     company_name: string;
//     ic_passport_no: string;
//     bank_name: string;
//     bank_account_no: string;
//     bank_account_name: string;
//     net_salary: string;
//     gross_salary: string;
//     status_code: string;
//     joined_date?: string;
//     confirmation_date?: string;
//     resigned_date?: string;
//     nationality?: string;
//     tax_no?: string;
//     dependents?: number;
//     marital_status?: string;
//     currency?: string;
//     work_location?: string;
//   };
//   payslip_items: any[];
//   employer_contributions: any[];
//   versions: any[];
//   audit_log: any[];
//   success: boolean;
// }

// interface TransformedPayrollRecord {
//   id: number;
//   payroll_id: number;
//   employee_id: number;
//   auto_no: number;
//   company_name: string;
//   department_name: string;
//   position: string;
//   employee_no: string;
//   employee_name: string;
//   ic_passport_no: string;
//   work_location: string;
//   joined_date: string;
//   confirmation_date: string;
//   resigned_date: string;
//   nationality: string;
//   tax_no: string;
//   dependents: number;
//   marital_status: string;
//   currency: string;
//   gross_salary: number;
//   net_salary: number;
//   bank_name: string;
//   bank_account_no: string;
//   bank_account_name: string;
//   status_code: string;
//   [key: string]: any;
// }

// interface BankTemplateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedIds: number[];
//   selectedRecords: TransformedPayrollRecord[];
//   onGenerate: (bankName: string, employerCode: string) => void;
// }

// interface BankTemplateResponse {
//   success: boolean;
//   file_content: string;
//   file_name: string;
//   error?: string;
// }

// // Bank Template Modal Component
// function BankTemplateModal({ isOpen, onClose, selectedIds, selectedRecords, onGenerate }: BankTemplateModalProps) {
//   const [bankName, setBankName] = useState('ALLIANCE');
//   const [employerCode, setEmployerCode] = useState('');
//   const [generatedContent, setGeneratedContent] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Mock function to generate bank template based on selected records
//   const generateBankTemplate = async () => {
//     if (!employerCode.trim()) {
//       toast.error('Please enter the Employer/Company Code');
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       let fileContent = '';
//       let generatedFileName = '';
      
//       // Get current date for file naming
//       const currentDate = new Date();
//       const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
      
//       if (bankName === 'AMBBANK') {
//         generatedFileName = `AMBBBANK_${employerCode}_${dateString}.txt`;
        
//         // AMB Bank format
//         selectedRecords.forEach(record => {
//           const referenceNo = `SAMBB${String(record.id).padStart(15, '0')}`;
//           const employeeName = record.employee_name.padEnd(50, ' ');
//           const bankAccount = record.bank_account_no.padEnd(20, ' ');
//           const amount = `MY${record.net_salary.toFixed(2).padStart(15, '0')}`;
          
//           fileContent += `${referenceNo}     ${dateString}${employerCode.padEnd(10, ' ')}${employeeName}${bankAccount}${amount}0    \n`;
//         });
//       } else if (bankName === 'PBE') {
//         generatedFileName = `pbe_${employerCode}_${dateString}.txt`;
        
//         // PBE Bank format - Header
//         fileContent += `H3223289903${dateString}\n`;
        
//         // Details
//         selectedRecords.forEach((record, index) => {
//           const date = currentDate.toISOString().slice(2, 10).replace(/-/g, '');
//           const refNumber = `IBG${String(1000000000 + index).padStart(12, '0')}`;
//           const bankCode = (record.bank_name || 'MBBEMYKL').padEnd(10, ' ');
//           const employeeName = record.employee_name.padEnd(120, ' ');
//           const idNumber = record.ic_passport_no.padStart(20, 'NI');
//           const amount = String(Math.round(record.net_salary * 100)).padStart(15, ' ');
//           const suffix = `S${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}_${employerCode}`;
          
//           fileContent += `D${date}${employerCode.padEnd(10, ' ')} ${refNumber}        ${bankCode}${employeeName}${idNumber}                 ${amount}          ${suffix}\n`;
//         });
//       } else { // ALLIANCE (default)
//         generatedFileName = `alliance_${employerCode}_${dateString}.txt`;
        
//         // Alliance Bank format
//         selectedRecords.forEach(record => {
//           const period = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`;
//           const reference = String(record.id).padStart(12, '0');
          
//           fileContent += `LGP|${record.employee_name}|${record.bank_account_no}|${record.bank_name || 'PBBEMYKL'}|${record.net_salary.toFixed(2)}|${period}||${reference}||||N||||||||\n`;
//         });
//       }
      
//       setGeneratedContent(fileContent);
//       setFileName(generatedFileName);
//       toast.success('Bank template generated successfully!');
//       onGenerate(bankName, employerCode);
//     } catch (error) {
//       console.error('Bank template generation error:', error);
//       toast.error('Failed to generate bank template. Please try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownload = () => {
//     if (generatedContent && fileName) {
//       const blob = new Blob([generatedContent], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       toast.success('Template downloaded successfully!');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Generate Bank Template</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             ×
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Select Bank:</label>
//             <select
//               value={bankName}
//               onChange={(e) => setBankName(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="ALLIANCE">Alliance Bank</option>
//               <option value="AMBBANK">AMBBANK</option>
//               <option value="PBE">PBE (Public Bank Berhad)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Employer/Company Code:</label>
//             <input
//               type="text"
//               value={employerCode}
//               onChange={(e) => setEmployerCode(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter employer code"
//             />
//           </div>

//           <div className="bg-blue-50 p-3 rounded-md">
//             <p className="text-sm text-blue-800">
//               <strong>Selected Records:</strong> {selectedRecords.length} records
//               <br />
//               <strong>Total Amount:</strong> ${selectedRecords.reduce((sum, record) => sum + record.net_salary, 0).toFixed(2)}
//             </p>
//           </div>

//           <button
//             onClick={generateBankTemplate}
//             disabled={isGenerating}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//           >
//             {isGenerating ? 'Generating...' : 'Generate Template'}
//           </button>

//           {generatedContent && (
//             <div className="space-y-2">
//               <label className="block text-sm font-medium">Generated Template:</label>
//               <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-60 overflow-y-auto border">
//                 {generatedContent}
//               </pre>
//               <button
//                 onClick={handleDownload}
//                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
//               >
//                 Download Template
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Component
// export default function PayrollAdjustmentRelease() {
//   const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [employeeNameFilter, setEmployeeNameFilter] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Transform API data to include all fields
//   const transformedPayrollData = useMemo(() => {
//     return payrollData.map((row, index) => {
//       const payrollId = row.payroll.payroll_id;

//       const transformed: TransformedPayrollRecord = {
//         id: payrollId,
//         payroll_id: payrollId,
//         employee_id: row.payroll.employee_id,
//         auto_no: index + 1,
//         company_name: row.payroll.company_name || '',
//         department_name: row.payroll.department_name || '',
//         position: row.payroll.position || '',
//         employee_no: row.payroll.employee_no || '',
//         employee_name: row.payroll.employee_name || '',
//         ic_passport_no: row.payroll.ic_passport_no || '',
//         work_location: row.payroll.work_location || '',
//         joined_date: row.payroll.joined_date ? new Date(row.payroll.joined_date).toLocaleDateString() : '',
//         confirmation_date: row.payroll.confirmation_date ? new Date(row.payroll.confirmation_date).toLocaleDateString() : '',
//         resigned_date: row.payroll.resigned_date ? new Date(row.payroll.resigned_date).toLocaleDateString() : '',
//         nationality: row.payroll.nationality || '',
//         tax_no: row.payroll.tax_no || '',
//         dependents: row.payroll.dependents || 0,
//         marital_status: row.payroll.marital_status || '',
//         currency: row.payroll.currency || 'MYR',
//         gross_salary: parseFloat(row.payroll.gross_salary) || 0,
//         net_salary: parseFloat(row.payroll.net_salary) || 0,
//         bank_name: row.payroll.bank_name || '',
//         bank_account_no: row.payroll.bank_account_no || '',
//         bank_account_name: row.payroll.bank_account_name || '',
//         status_code: row.payroll.status_code || 'DRAFT',
//       };

//       // Add payslip items
//       row.payslip_items?.forEach(item => {
//         const prefix = item.type.toLowerCase();
//         const key = `payslip_${prefix}_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//         transformed[key] = parseFloat(item.amount) || 0;
//       });

//       // Add employer contributions
//       row.employer_contributions?.forEach(item => {
//         const key = `employer_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//         transformed[key] = parseFloat(item.amount) || 0;
//       });

//       return transformed;
//     });
//   }, [payrollData]);

//   // Get selected records for the modal
//   const selectedRecords = useMemo(() => {
//     return transformedPayrollData.filter(record => selectedIds.includes(record.id));
//   }, [transformedPayrollData, selectedIds]);

//   const fetchPayrollRecords = async () => {
//     setLoading(true);
//     try {
//       // Build the API URL with query parameters
//       const url = new URL(`${API_BASE_URL}/api/payroll/adjustments`);
      
//       // Add query parameters if needed
//       if (employeeNameFilter) {
//         url.searchParams.append('employee_name', employeeNameFilter);
//       }
      
//       // You might need to add other parameters based on your API
//       url.searchParams.append('status', 'DRAFT');
//       url.searchParams.append('all_data', 'true');
      
//       const response = await fetch(url.toString(), {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: PayrollApiResponse = await response.json();
//       setPayrollData(data.data);
//     } catch (error) {
//       console.error('Failed to fetch payroll records:', error);
//       toast.error('Failed to fetch payroll records. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayrollRecords();
//   }, []);

//   const handleFilterApply = () => {
//     fetchPayrollRecords();
//   };

//   const handleSelectRecord = (id: number, checked: boolean) => {
//     if (checked) {
//       setSelectedIds(prev => [...prev, id]);
//     } else {
//       setSelectedIds(prev => prev.filter(item => item !== id));
//     }
//   };

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedIds(transformedPayrollData.map(record => record.id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleReleaseSelected = () => {
//     if (selectedIds.length === 0) {
//       toast.error('Please select at least one payroll record to release');
//       return;
//     }
//     setIsModalOpen(true);
//   };

//   const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
//     try {
//       // Simulate releasing payroll records (update status in UI only)
//       // In a real application, you would call an API to update the status
//       toast.success('Payroll records released successfully!');
//       setSelectedIds([]);
      
//       // Update the status of selected records to "RELEASED" in the UI
//       setPayrollData(prevData => 
//         prevData.map(item => {
//           if (selectedIds.includes(item.payroll.payroll_id)) {
//             return {
//               ...item,
//               payroll: {
//                 ...item.payroll,
//                 status_code: 'RELEASED'
//               }
//             };
//           }
//           return item;
//         })
//       );
//     } catch (error) {
//       console.error('Failed to release payroll records:', error);
//       toast.error('Failed to release payroll records. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster position="top-right" />
      
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="p-6 border-b">
//             <h1 className="text-2xl font-bold text-gray-900">Payroll Adjustment Release</h1>
//             <p className="text-gray-600 mt-1">Manage and release final payroll adjustments</p>
//           </div>

//           {/* Filter Section */}
//           <div className="p-6 border-b bg-gray-50">
//             <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
//             <div className="flex gap-4 items-end">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Employee Name
//                 </label>
//                 <input
//                   type="text"
//                   value={employeeNameFilter}
//                   onChange={(e) => setEmployeeNameFilter(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Search by employee name"
//                 />
//               </div>
//               <button
//                 onClick={handleFilterApply}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Apply Filter
//               </button>
//             </div>
//           </div>

//           {/* Records Section */}
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Final Payroll Records</h2>
//               <div className="flex gap-2 items-center">
//                 <span className="text-sm text-gray-500">
//                   {selectedIds.length} of {transformedPayrollData.length} selected
//                 </span>
//                 <button
//                   onClick={handleReleaseSelected}
//                   disabled={selectedIds.length === 0}
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Release Selected ({selectedIds.length})
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-200">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-200 p-3 text-left">
//                         <input
//                           type="checkbox"
//                           checked={transformedPayrollData.length > 0 && selectedIds.length === transformedPayrollData.length}
//                           onChange={(e) => handleSelectAll(e.target.checked)}
//                           className="rounded"
//                         />
//                       </th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee No</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Department</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Position</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Gross Salary</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Net Salary</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Name</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
//                       <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {transformedPayrollData.length === 0 ? (
//                       <tr>
//                         <td colSpan={11} className="border border-gray-200 p-8 text-center text-gray-500">
//                           No final payroll records found
//                         </td>
//                       </tr>
//                     ) : (
//                       transformedPayrollData.map((record) => (
//                         <tr key={record.id} className="hover:bg-gray-50">
//                           <td className="border border-gray-200 p-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedIds.includes(record.id)}
//                               onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
//                               className="rounded"
//                             />
//                           </td>
//                           <td className="border border-gray-200 p-3">{record.id}</td>
//                           <td className="border border-gray-200 p-3">{record.employee_no}</td>
//                           <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
//                           <td className="border border-gray-200 p-3">{record.department_name}</td>
//                           <td className="border border-gray-200 p-3">{record.position}</td>
//                           <td className="border border-gray-200 p-3">${record.gross_salary.toFixed(2)}</td>
//                           <td className="border border-gray-200 p-3">${record.net_salary.toFixed(2)}</td>
//                           <td className="border border-gray-200 p-3">{record.bank_name}</td>
//                           <td className="border border-gray-200 p-3">{record.bank_account_no}</td>
//                           <td className="border border-gray-200 p-3">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               record.status_code === 'DRAFT' 
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : record.status_code === 'RELEASED'
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {record.status_code}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <BankTemplateModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         selectedIds={selectedIds}
//         selectedRecords={selectedRecords}
//         onGenerate={handleBankTemplateGenerate}
//       />
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useMemo } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../config';

// Interface definitions based on your API response
interface PayrollApiResponse {
  total: number;
  page: number;
  limit: number;
  data: PayrollItem[];
}

interface PayrollItem {
  payroll: {
    payroll_id: number;
    employee_id: number;
    employee_name: string;
    employee_no: string;
    department_name: string;
    position: string;
    company_name: string;
    ic_passport_no: string;
    bank_name: string;
    bank_code: string | null; 
    bank_account_no: string;
    bank_account_name: string;
    net_salary: string;
    gross_salary: string;
    status_code: string;
    joined_date?: string;
    confirmation_date?: string;
    resigned_date?: string;
    nationality?: string;
    tax_no?: string;
    dependents?: number;
    marital_status?: string;
    currency?: string;
    work_location?: string;
    period_month?: number;
    period_year?: number;
  };
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
  versions: any[];
  audit_log: any[];
  success: boolean;
}

interface PayslipItem {
  item_id: number;
  payroll_id: number;
  type: string;
  label: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

interface EmployerContribution {
  contribution_id: number;
  payroll_id: number;
  type: string;
  label: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

interface TransformedPayrollRecord {
  id: number;
  payroll_id: number;
  employee_id: number;
  auto_no: number;
  company_name: string;
  department_name: string;
  position: string;
  employee_no: string;
  employee_name: string;
  ic_passport_no: string;
  work_location: string;
  joined_date: string;
  confirmation_date: string;
  resigned_date: string;
  nationality: string;
  tax_no: string;
  dependents: number;
  marital_status: string;
  currency: string;
  gross_salary: number;
  net_salary: number;
  bank_name: string;
  bank_code: string | null;
  bank_account_no: string;
  bank_account_name: string;
  status_code: string;
  period_month: number;
  period_year: number;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
  [key: string]: any;
}

interface BankTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: number[];
  selectedRecords: TransformedPayrollRecord[];
  onGenerate: (bankName: string, employerCode: string) => void;
}

interface BankTemplateResponse {
  success: boolean;
  file_content: string;
  file_name: string;
  error?: string;
}

// Bank Template Modal Component
function BankTemplateModal({ isOpen, onClose, selectedIds, selectedRecords, onGenerate }: BankTemplateModalProps) {
  const [bankName, setBankName] = useState('ALLIANCE');
  const [employerCode, setEmployerCode] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Clear generated content when modal opens
  useEffect(() => {
    if (isOpen) {
      setGeneratedContent('');
      setFileName('');
      setEmployerCode('');
      setBankName('ALLIANCE');
    }
  }, [isOpen]);

  // Mock function to generate bank template based on selected records
  const generateBankTemplate1 = async () => {
    if (!employerCode.trim()) {
      toast.error('Please enter the Employer/Company Code');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let fileContent = '';
      let generatedFileName = '';
      
      // Get current date for file naming
      const currentDate = new Date();
      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
      
      if (bankName === 'AMBBANK') {
        generatedFileName = `AMBBBANK_${employerCode}_${dateString}.txt`;
        
        // AMB Bank format
        selectedRecords.forEach(record => {
          const referenceNo = `SAMBB${String(record.id).padStart(15, '0')}`;
          const employeeName = record.employee_name.padEnd(50, ' ');
          const bankAccount = record.bank_account_no.padEnd(20, ' ');
          const amount = `MY${record.net_salary.toFixed(2).padStart(15, '0')}`;
          
          fileContent += `${referenceNo}     ${dateString}${employerCode.padEnd(10, ' ')}${employeeName}${bankAccount}${amount}0    \n`;
        });
      } else if (bankName === 'PBE') {
        generatedFileName = `pbe_${employerCode}_${dateString}.txt`;
        
        // PBE Bank format - Header
        fileContent += `H3223289903${dateString}\n`;
        
        // Details
        selectedRecords.forEach((record, index) => {
          const date = currentDate.toISOString().slice(2, 10).replace(/-/g, '');
          const refNumber = `IBG${String(1000000000 + index).padStart(12, '0')}`;
          const bankCode = (record.bank_name || 'MBBEMYKL').padEnd(10, ' ');
          const employeeName = record.employee_name.padEnd(120, ' ');
          const idNumber = record.ic_passport_no.padStart(20, 'NI');
          const amount = String(Math.round(record.net_salary * 100)).padStart(15, ' ');
          const suffix = `S${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}_${employerCode}`;
          
          fileContent += `D${date}${employerCode.padEnd(10, ' ')} ${refNumber}        ${bankCode}${employeeName}${idNumber}                 ${amount}          ${suffix}\n`;
        });
      } else { // ALLIANCE (default)
        generatedFileName = `alliance_${employerCode}_${dateString}.txt`;
        
        // Alliance Bank format
        selectedRecords.forEach(record => {
          const period = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`;
          const reference = String(record.id).padStart(12, '0');
          
          fileContent += `LGP|${record.employee_name}|${record.bank_account_no}|${record.bank_name || 'PBBEMYKL'}|${record.net_salary.toFixed(2)}|${period}||${reference}||||N||||||||\n`;
        });
      }
      
      setGeneratedContent(fileContent);
      setFileName(generatedFileName);
      toast.success('Bank template generated successfully!');
      onGenerate(bankName, employerCode);
    } catch (error) {
      console.error('Bank template generation error:', error);
      toast.error('Failed to generate bank template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ... existing code ...

const generateBankTemplate = async () => {
  if (!employerCode.trim()) {
    toast.error('Please enter the Employer/Company Code');
    return;
  }

  setIsGenerating(true);
  try {
    // Get current date for file naming and content
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const dateYYMMDD = dateString.slice(2); // YYMMDD
    const monthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`; // MMyyyy
    
    let fileContent = '';
    let generatedFileName = '';
    
    if (bankName === 'AMBBANK') {
      generatedFileName = `AMBBBANK_${employerCode}_${dateString}.txt`;
      
      // AMB Bank format: Fixed width fields
      selectedRecords.forEach((record, index) => {
        // Generate reference number (SAMBB + 15 digits)
        const refNum = `SAMBB${String(8881040000000 + index).slice(0, 10)}`;
        
        // Format fields with exact widths
        const referenceNo = refNum.padEnd(20, ' '); // 20 chars
        const paymentDate = dateString.padEnd(10, ' '); // 10 chars
        const employer = employerCode.padEnd(15, ' '); // 15 chars
        const beneficiary = record.employee_name.padEnd(50, ' '); // 50 chars
        const accountNo = record.bank_account_no.padEnd(20, ' '); // 20 chars
        const amount = `MY${parseFloat(record.net_salary.toString()).toFixed(2)}`.padEnd(15, ' '); // 15 chars
        const status = '0'.padEnd(5, ' '); // 5 chars
        
        fileContent += `${referenceNo}${paymentDate}${employer}${beneficiary}${accountNo}${amount}${status}\n`;
      });
    } else if (bankName === 'PBE') {
      generatedFileName = `pbe_${employerCode}_${dateString}.txt`;
      
      // PBE Header: H + company code + date
      fileContent += `H${employerCode}${dateString}\n`;
      
      // PBE Details: Fixed format with specific spacing
      selectedRecords.forEach((record, index) => {
        // Generate reference number
        const refNumber = `IBG${String(100000000000 + index).slice(-12)}`;
        
        // Use actual bank code or empty if null
        const bankCode = (record.bank_code || '-').padEnd(10, ' ');
        
        // Format employee name with exact spacing
        const employeeName = record.employee_name.padEnd(120, ' ');
        
        // Format account number (don't add NI prefix if not present)
        const accountNo = record.bank_account_no.padEnd(20, ' ');
        
        // Format amount (multiply by 100 to remove decimals)
        const amount = String(Math.round(parseFloat(record.net_salary.toString()) * 100)).padStart(15, ' ');
        
        // Batch reference
        const batchRef = `S${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}_${employerCode}`;
        
        // Construct detail line with exact spacing
        fileContent += `D${dateYYMMDD}${employerCode} ${refNumber}        ${bankCode}${employeeName}${accountNo}                 ${amount}          ${batchRef}\n`;
      });
    } else { // ALLIANCE (default)
      generatedFileName = `alliance_${employerCode}_${dateString}.txt`;
      
      // Alliance Bank format: Pipe-delimited
      selectedRecords.forEach((record, index) => {
        // Generate reference number (12 digits)
        const reference = String(100000000000 + index).slice(-12);
        
        // Use actual bank code or empty if null
        const bankCode = record.bank_code || '-';
        
        fileContent += `LGP|${record.employee_name}|${record.bank_account_no}|${bankCode}|${parseFloat(record.net_salary.toString()).toFixed(2)}|${monthYear}||${reference}||||N||||||||\n`;
      });
    }
    
    setGeneratedContent(fileContent);
    setFileName(generatedFileName);
    toast.success('Bank template generated successfully!');
    onGenerate(bankName, employerCode);
  } catch (error) {
    console.error('Bank template generation error:', error);
    toast.error('Failed to generate bank template. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

  const handleDownload = () => {
    if (generatedContent && fileName) {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Template downloaded successfully!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Generate Bank Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank:</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="ALLIANCE">Alliance Bank</option>
                <option value="AMBBANK">AMBBANK</option>
                <option value="PBE">PBE (Public Bank Berhad)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer/Company Code:</label>
              <input
                type="text"
                value={employerCode}
                onChange={(e) => setEmployerCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Enter employer code"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800">Selected Records:</p>
                <p className="text-lg font-semibold text-blue-900">{selectedRecords.length} records</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total Amount:</p>
                <p className="text-lg font-semibold text-blue-900">
                  ${selectedRecords.reduce((sum, record) => sum + record.net_salary, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={generateBankTemplate}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Template'
            )}
          </button>

          {generatedContent && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Generated Template:</label>
                <span className="text-xs text-gray-500">{fileName}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs overflow-x-auto max-h-60 overflow-y-auto p-2 bg-white rounded border">
                  {generatedContent}
                </pre>
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function PayrollAdjustmentRelease() {
  const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Transform API data to include all fields
  const transformedPayrollData = useMemo(() => {
    return payrollData.map((row, index) => {
      const payrollId = row.payroll.payroll_id;

      const transformed: TransformedPayrollRecord = {
        id: payrollId,
        payroll_id: payrollId,
        employee_id: row.payroll.employee_id,
        auto_no: index + 1,
        company_name: row.payroll.company_name || '',
        department_name: row.payroll.department_name || '',
        position: row.payroll.position || '',
        employee_no: row.payroll.employee_no || '',
        employee_name: row.payroll.employee_name || '',
        ic_passport_no: row.payroll.ic_passport_no || '',
        work_location: row.payroll.work_location || '',
        joined_date: row.payroll.joined_date ? new Date(row.payroll.joined_date).toLocaleDateString() : '',
        confirmation_date: row.payroll.confirmation_date ? new Date(row.payroll.confirmation_date).toLocaleDateString() : '',
        resigned_date: row.payroll.resigned_date ? new Date(row.payroll.resigned_date).toLocaleDateString() : '',
        nationality: row.payroll.nationality || '',
        tax_no: row.payroll.tax_no || '',
        dependents: row.payroll.dependents || 0,
        marital_status: row.payroll.marital_status || '',
        currency: row.payroll.currency || 'MYR',
        gross_salary: parseFloat(row.payroll.gross_salary) || 0,
        net_salary: parseFloat(row.payroll.net_salary) || 0,
        bank_name: row.payroll.bank_name || '',
        bank_code: row.payroll.bank_code || null,
        bank_account_no: row.payroll.bank_account_no || '',
        bank_account_name: row.payroll.bank_account_name || '',
        status_code: row.payroll.status_code || 'DRAFT',
        period_month: row.payroll.period_month || new Date().getMonth() + 1,
        period_year: row.payroll.period_year || new Date().getFullYear(),
        payslip_items: row.payslip_items || [],
        employer_contributions: row.employer_contributions || [],
      };

      return transformed;
    });
  }, [payrollData]);

  // Filter data based on search input
  const filteredData = useMemo(() => {
    if (!employeeNameFilter) return transformedPayrollData;
    
    return transformedPayrollData.filter(record => 
      record.employee_name.toLowerCase().includes(employeeNameFilter.toLowerCase()) ||
      record.employee_no.toLowerCase().includes(employeeNameFilter.toLowerCase()) ||
      record.department_name.toLowerCase().includes(employeeNameFilter.toLowerCase())
    );
  }, [transformedPayrollData, employeeNameFilter]);

  // Get selected records for the modal
  const selectedRecords = useMemo(() => {
    return transformedPayrollData.filter(record => selectedIds.includes(record.id));
  }, [transformedPayrollData, selectedIds]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, currentPage]);

  // Extract unique earning labels for column headers
  const earningLabels = useMemo(() => {
    const labels = new Set<string>();
    transformedPayrollData.forEach(record => {
      record.payslip_items
        .filter(item => item.type === 'EARNING')
        .forEach(item => {
          if (item.label) labels.add(item.label);
        });
    });
    return Array.from(labels);
  }, [transformedPayrollData]);

  // Extract unique statutory labels for column headers
  const statutoryLabels = useMemo(() => {
    const labels = new Set<string>();
    transformedPayrollData.forEach(record => {
      record.employer_contributions
        .filter(item => item.type === 'STATUTORY')
        .forEach(item => {
          if (item.label) labels.add(item.label);
        });
    });
    return Array.from(labels);
  }, [transformedPayrollData]);

  // Debug function to check data structure
  const debugDataStructure = () => {
    if (transformedPayrollData.length > 0) {
      console.log('Sample payroll data:', transformedPayrollData[0]);
      console.log('Payslip items:', transformedPayrollData[0].payslip_items);
      console.log('Employer contributions:', transformedPayrollData[0].employer_contributions);
      console.log('Earning labels:', earningLabels);
      console.log('Statutory labels:', statutoryLabels);
    }
  };

  useEffect(() => {
    debugDataStructure();
  }, [transformedPayrollData]);

  const fetchPayrollRecords = async () => {
    setLoading(true);
    try {
      // Build the API URL with query parameters
      const url = new URL(`${API_BASE_URL}/api/payroll/adjustments`);
      
      // You might need to add other parameters based on your API
      url.searchParams.append('status', 'DRAFT');
      url.searchParams.append('all_data', 'true');
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PayrollApiResponse = await response.json();
      console.log('API Response:', data); // Debug log
      setPayrollData(data.data);
    } catch (error) {
      console.error('Failed to fetch payroll records:', error);
      toast.error('Failed to fetch payroll records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  const handleFilterApply = () => {
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSelectRecord = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentRecords.map(record => record.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleReleaseSelected = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one payroll record to release');
      return;
    }
    setIsModalOpen(true);
  };

  const handleBankTemplateGenerate = async (bankName: string, employerCode: string) => {
    try {
      // Simulate releasing payroll records (update status in UI only)
      toast.success('Payroll records released successfully!');
      setSelectedIds([]);
      
      // Update the status of selected records to "RELEASED" in the UI
      setPayrollData(prevData => 
        prevData.map(item => {
          if (selectedIds.includes(item.payroll.payroll_id)) {
            return {
              ...item,
              payroll: {
                ...item.payroll,
                status_code: 'RELEASED'
              }
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Failed to release payroll records:', error);
      toast.error('Failed to release payroll records. Please try again.');
    }
  };

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper function to get amount by label from payslip items
  const getPayslipAmountByLabel = (items: PayslipItem[], label: string) => {
    const item = items.find(i => i.label === label && i.type === 'EARNING');
    return item ? parseFloat(item.amount || '0').toFixed(2) : '0.00';
  };

  // Helper function to get amount by label from employer contributions
  const getContributionAmountByLabel = (items: EmployerContribution[], label: string) => {
    const item = items.find(i => i.label === label && i.type === 'STATUTORY');
    return item ? parseFloat(item.amount || '0').toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Generate Bank Slip</h1>
            <p className="text-gray-600 mt-1">Manage and release bank slips for payroll</p>
          </div>

          {/* Filter Section */}
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search (Name, Employee No, Department)
                </label>
                <input
                  type="text"
                  value={employeeNameFilter}
                  onChange={(e) => setEmployeeNameFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by employee name, number, or department"
                />
              </div>
              <button
                onClick={handleFilterApply}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Records Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Final Payroll Records</h2>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500">
                  {selectedIds.length} of {filteredData.length} selected
                </span>
                <button
                  onClick={handleReleaseSelected}
                  disabled={selectedIds.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Release Selected ({selectedIds.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={currentRecords.length > 0 && selectedIds.length === currentRecords.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded"
                          />
                        </th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">ID</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Period</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Employee No</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Employee Name</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Department</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Position</th>
                        
                        {/* Dynamic Earning Columns */}
                        {earningLabels.map((label) => (
                          <th key={label} className="border border-gray-200 p-3 text-left font-semibold">
                            {label}
                          </th>
                        ))}
                        
                        <th className="border border-gray-200 p-3 text-left font-semibold">Gross Salary</th>
                        
                        {/* Dynamic Statutory Columns */}
                        {statutoryLabels.map((label) => (
                          <th key={label} className="border border-gray-200 p-3 text-left font-semibold">
                            {label}
                          </th>
                        ))}
                        
                        <th className="border border-gray-200 p-3 text-left font-semibold">Net Salary</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Bank Name</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Bank Account</th>
                        <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.length === 0 ? (
                        <tr>
                          <td colSpan={13 + earningLabels.length + statutoryLabels.length} className="border border-gray-200 p-8 text-center text-gray-500">
                            No final payroll records found
                          </td>
                        </tr>
                      ) : (
                        currentRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(record.id)}
                                onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
                                className="rounded"
                              />
                            </td>
                            <td className="border border-gray-200 p-3">{record.id}</td>
                            <td className="border border-gray-200 p-3">
                              {record.period_month}/{record.period_year}
                            </td>
                            <td className="border border-gray-200 p-3">{record.employee_no}</td>
                            <td className="border border-gray-200 p-3 font-medium">{record.employee_name}</td>
                            <td className="border border-gray-200 p-3">{record.department_name}</td>
                            <td className="border border-gray-200 p-3">{record.position}</td>
                            
                            {/* Dynamic Earning Values */}
                            {earningLabels.map((label) => (
                              <td key={label} className="border border-gray-200 p-3">
                                ${getPayslipAmountByLabel(record.payslip_items, label)}
                              </td>
                            ))}
                            
                            <td className="border border-gray-200 p-3">${record.gross_salary.toFixed(2)}</td>
                            
                            {/* Dynamic Statutory Values */}
                            {statutoryLabels.map((label) => (
                              <td key={label} className="border border-gray-200 p-3">
                                ${getContributionAmountByLabel(record.employer_contributions, label)}
                              </td>
                            ))}
                            
                            <td className="border border-gray-200 p-3">${record.net_salary.toFixed(2)}</td>
                            <td className="border border-gray-200 p-3">{record.bank_name}</td>
                            <td className="border border-gray-200 p-3">{record.bank_account_no}</td>
                            <td className="border border-gray-200 p-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                record.status_code === 'DRAFT' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : record.status_code === 'RELEASED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {record.status_code}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 px-2">
                    <div className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        First
                      </button>
                      
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &lt;
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1.5 text-sm border rounded-md min-w-[2.5rem] ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &gt;
                      </button>
                      
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <BankTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedIds={selectedIds}
        selectedRecords={selectedRecords}
        onGenerate={handleBankTemplateGenerate}
      />
    </div>
  );
}