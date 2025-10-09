// // app/admins/claims/page.tsx (or wherever your page lives)
// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { api } from '../../utils/api';
// import { API_BASE_URL } from '../../config';
// import axios, { AxiosProgressEvent } from 'axios';
// import {
//   BarChart,
//   Briefcase,
//   DollarSign,
//   Users,
//   XCircle,
//   Info,
//   CalendarDays,
//   Tag,
//   MessageSquare,
//   User as UserIcon,
//   Plus,
// } from 'lucide-react';

// /* =========================== Types =========================== */
// interface ClaimRow {
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   company_name: string;
//   company_id: number;
//   benefit_type_id: number;
//   benefit_type: string;
//   claim_date: string;
//   amount: string;
//   approved_amount: string | null;
//   employee_remark: string;
//   admin_remark: string | null;
//   status: string;
//   current_approval_level: number;
//   final_approval_level: number;
//   created_at: string;
//   updated_at: string;
//   department_name?: string;
// }

// interface BenefitSummaryCardData {
//   benefit_type: string;
//   total_employees: number;
//   total_entitled: string;
//   total_claimed: string;
//   total_balance: string;
//   description?: string;
//   frequency?: string;
//   effective_from?: string;
//   effective_to?: string;
//   status?: string;
// }

// interface ApprovalHistory {
//   id: number;
//   module: string;
//   record_id: number;
//   company_id: number;
//   level: number;
//   approver_id: number;
//   approver_name: string;
//   status: string;
//   remark: string;
//   approved_at: string;
// }

// interface CurrentApproval {
//   level: number;
//   approver_id: number;
//   status: string;
//   remark: string | null;
//   action_date: string | null;
//   approver_name: string;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   company_id: number;
// }

// // Add to your existing interfaces
// interface ReportFilter {
//   startDate: string;
//   endDate: string;
//   status: string;
//   company_id: string;
//   employee_id: string;
//   benefit_type_id: string;
// }

// interface ClaimsReportResponse {
//   success: boolean;
//   data: ClaimRow[];
//   total: number;
//   filters: ReportFilter;
// }

// /* ============== On-Behalf form support types ============== */
// type Company = { id: number; company_name: string };
// type Department = { id: number; department_name: string };
// type Employee = { id: number; name: string; department_id?: number; company_id?: number };

// interface Benefit {
//   id: number; // employee_benefit assignment ID
//   employee_id: number;
//   benefit_type: string;
//   description: string;
//   frequency: string;
//   entitled: string;
//   claimed: string;
//   balance: string;
//   effective_from: string;
//   effective_to: string;
//   status: 'Active' | 'Upcoming' | 'Expired' | 'Unknown';
// }

// /* =========================== Helpers =========================== */
// const formatCurrency = (value: string | number) => {
//   const num = typeof value === 'string' ? parseFloat(value) : value;
//   if (Number.isNaN(num)) return 'RM 0.00';
//   return `RM ${num.toFixed(2)}`;
// };

// const SummaryCard = ({ summary }: { summary: BenefitSummaryCardData }) => {
//   const [hovered, setHovered] = useState(false);
//   const entitled = parseFloat(summary.total_entitled);
//   const claimed = parseFloat(summary.total_claimed);
//   const utilization = entitled > 0 ? (claimed / entitled) * 100 : 0;

// const [isReportModalOpen, setIsReportModalOpen] = useState(false);
// const [reportFilters, setReportFilters] = useState<ReportFilter>({
//   startDate: '',
//   endDate: '',
//   status: 'all',
//   company_id: '',
//   employee_id: '',
//   benefit_type_id: ''
// });
// const [generatingReport, setGeneratingReport] = useState(false);


//   return (
//     <div className="relative bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
//       {summary.description && (
//         <div
//           className="absolute top-4 right-4 z-10"
//           onMouseEnter={() => setHovered(true)}
//           onMouseLeave={() => setHovered(false)}
//           aria-label="Benefit description"
//         >
//           <Info className={`w-6 h-6 cursor-pointer transition-transform duration-200 ${hovered ? 'scale-110 text-blue-600' : 'text-gray-400'}`} />
//           {hovered && (
//             <div className="absolute top-8 right-0 w-64 text-sm bg-white border border-gray-300 shadow-lg rounded-md p-3 z-20">
//               <p className="text-gray-700 italic">{summary.description}</p>
//             </div>
//           )}
//         </div>
//       )}

//       <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8">{summary.benefit_type}</h3>

//       <div className="space-y-3 text-sm text-gray-700 mb-4">
//         <div className="flex justify-between">
//           <span className="flex items-center"><Users size={16} className="mr-2 text-gray-400" />Total Employees</span>
//           <span className="font-semibold text-gray-900">{summary.total_employees}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="flex items-center"><DollarSign size={16} className="mr-2 text-green-500" />Total Entitled</span>
//           <span className="font-semibold text-green-600">{formatCurrency(summary.total_entitled)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="flex items-center"><BarChart size={16} className="mr-2 text-orange-500" />Total Claimed</span>
//           <span className="font-semibold text-orange-600">{formatCurrency(summary.total_claimed)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="flex items-center"><DollarSign size={16} className="mr-2 text-blue-500" />Balance</span>
//           <span className="font-semibold text-blue-600">{formatCurrency(summary.total_balance)}</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
//         <div>
//           <span className="text-gray-500 block">Frequency</span>
//           <span className="font-medium text-gray-800">{summary.frequency || '-'}</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">Status</span>
//           <span className={`font-semibold ${summary.status === 'Active' ? 'text-green-600' : summary.status === 'Expired' ? 'text-red-500' : 'text-gray-500'}`}>{summary.status || '-'}</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">Effective From</span>
//           <span className="text-gray-800">{summary.effective_from ? new Date(summary.effective_from).toLocaleDateString() : '-'}</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">Effective To</span>
//           <span className="text-gray-800">{summary.effective_to ? new Date(summary.effective_to).toLocaleDateString() : '-'}</span>
//         </div>
//       </div>

//       <div>
//         <span className="text-xs font-semibold text-gray-500">Utilization</span>
//         <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
//           <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${utilization}%` }} />
//         </div>
//         <p className="text-right text-xs font-semibold text-blue-700 mt-1">{utilization.toFixed(2)}%</p>
//       </div>
//     </div>
//   );
// };

// /* =========================== Page =========================== */
// export default function AdminClaimListPage() {
//   const [claims, setClaims] = useState<ClaimRow[]>([]);
//   const [summaries, setSummaries] = useState<BenefitSummaryCardData[]>([]);
//   const [search, setSearch] = useState('');
//   const [filteredClaims, setFilteredClaims] = useState<ClaimRow[]>([]);
//   const [loadingClaims, setLoadingClaims] = useState(true);
//   const [loadingSummary, setLoadingSummary] = useState(true);

//   const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);
//   const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
//   const [currentApprovals, setCurrentApprovals] = useState<CurrentApproval[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   // Approve/Reject modal
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
//   const [actionRemark, setActionRemark] = useState('');

//   // New Claim (On Behalf) modal
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [benefits, setBenefits] = useState<Benefit[]>([]);
//   const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragActive, setIsDragActive] = useState(false);
//   const [amountError, setAmountError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingCompanies, setLoadingCompanies] = useState(false);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);

//   const [form, setForm] = useState({
//     company_id: '',
//     department_id: '',
//     employee_id: '',
//     benefit_type_id: '',
//     amount: '',
//     claim_date: new Date().toISOString().split('T')[0],
//     employee_remark: '',
//   });

//   const [user, setUser] = useState<User | null>(null);

//   /* =========================== Normalizers & loaders =========================== */
//   const normalizeCompanies = (raw: any): Company[] => {
//     if (!raw) return [];
//     const arr = Array.isArray(raw) ? raw : raw.data || [];
//     return arr
//       .filter((c: any) => c && typeof c.id === 'number')
//       .map((c: any) => ({
//         id: c.id,
//         company_name: c.company_name ?? c.name ?? `Company #${c.id}`,
//       }));
//   };

//   const normalizeDepartments = (raw: any): Department[] => {
//     const arr = Array.isArray(raw) ? raw : raw?.departments || raw?.data?.departments || [];
//     return arr
//       .filter((d: any) => d && (typeof d.id === 'number' || typeof d.id === 'string'))
//       .map((d: any) => ({
//         id: Number(d.id),
//         department_name: d.department_name ?? d.name ?? `Department #${d.id}`,
//       }));
//   };

//   const normalizeEmployees = (raw: any): Employee[] => {
//     const arr = Array.isArray(raw) ? raw : raw?.data || [];
//     return arr
//       .filter((e: any) => e && typeof e.id === 'number')
//       .map((e: any) => ({ id: e.id, name: e.name, department_id: e.department_id, company_id: e.company_id }));
//   };

//   const loadCompanies = async () => {
//     try {
//       setLoadingCompanies(true);
//       const res = await api.get(`${API_BASE_URL}/api/companies`);
//       setCompanies(normalizeCompanies(res));
//     } catch (e: any) {
//       console.error(e);
//       toast.error(e.message || 'Failed to load companies');
//       setCompanies([]);
//     } finally {
//       setLoadingCompanies(false);
//     }
//   };

//   const loadDepartments = async (companyId: number) => {
//     setDepartments([]);
//     setEmployees([]);
//     try {
//       setLoadingDepartments(true);
//       const res = await api.get(`${API_BASE_URL}/api/companies/${companyId}/departments`);
//       setDepartments(normalizeDepartments(res));
//     } catch (e: any) {
//       console.warn('Departments load warning:', e?.message);
//       setDepartments([]);
//     } finally {
//       setLoadingDepartments(false);
//     }
//   };

//   const tryGet = async <T = any>(url: string): Promise<T | null> => {
//     try {
//       return await api.get(url);
//     } catch (e: any) {
//       if (e?.response?.status === 404) return null;
//       throw e;
//     }
//   };

//   const loadEmployees = async (departmentId: number, companyId: number) => {
//     setEmployees([]);
//     setLoadingEmployees(true);
//     try {
//       let res =
//         (await tryGet(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`)) ||
//         (await tryGet(`${API_BASE_URL}/api/departments/${departmentId}/employees`));

//       if (res) {
//         setEmployees(normalizeEmployees(res));
//         return;
//       }

//       res =
//         (await tryGet(`${API_BASE_URL}/api/admin/employees?department_id=${departmentId}&status=Active`)) ||
//         (await tryGet(`${API_BASE_URL}/api/employees?department_id=${departmentId}&status=Active`));

//       if (res) {
//         setEmployees(normalizeEmployees(res));
//         return;
//       }

//       const byCompany =
//         (await tryGet(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`)) ||
//         (await tryGet(`${API_BASE_URL}/api/companies/${companyId}/employees`));

//       if (byCompany) {
//         setEmployees(normalizeEmployees(byCompany));
//         return;
//       }

//       toast.error('No matching employee endpoint found. Check API base path.');
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.message || 'Failed to load employees');
//     } finally {
//       setLoadingEmployees(false);
//     }
//   };

//   /* =========================== Effects =========================== */
//   useEffect(() => {
//     fetchClaims();
//     fetchSummary();
//     loadUserData();
//     loadCompanies();
//   }, []);

//   useEffect(() => {
//     // lock body scroll when any modal open (nice UX)
//     const lock = showModal || showActionModal || showCreateModal;
//     document.body.classList.toggle('overflow-hidden', lock);
//     return () => document.body.classList.remove('overflow-hidden');
//   }, [showModal, showActionModal, showCreateModal]);

//   /* =========================== Data fetchers =========================== */
//   const loadUserData = () => {
//     try {
//       const userData = localStorage.getItem('hrms_user');
//       if (userData) {
//         const parsedUser = JSON.parse(userData) as User;
//         setUser(parsedUser);
//         return parsedUser;
//       }
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       toast.error('Failed to load user data');
//     }
//     return null;
//   };

//   const fetchClaims = async () => {
//     try {
//       setLoadingClaims(true);
//       const data = await api.get(`${API_BASE_URL}/api/claims`);
//       setClaims(data);
//       setFilteredClaims(data);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to load claims.');
//     } finally {
//       setLoadingClaims(false);
//     }
//   };

//   const fetchSummary = async () => {
//     try {
//       setLoadingSummary(true);
//       const data = await api.get(`${API_BASE_URL}/api/employee-benefits/summary`);
//       setSummaries(data);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to load benefit summary.');
//     } finally {
//       setLoadingSummary(false);
//     }
//   };

//   /* =========================== Row actions =========================== */
//   const handleViewDetails = async (claim: ClaimRow) => {
//     try {
//       const response = await api.get(`${API_BASE_URL}/api/approval/claims/${claim.id}`);
//       if (response && response.claimDetails) {
//         setSelectedClaim(response.claimDetails);
//         setApprovalHistory(response.approvalHistory || []);
//         setCurrentApprovals(response.currentApprovals || []);
//         setShowModal(true);
//       } else {
//         toast.error('Invalid claim details response from API.');
//         console.error('API response for claim details was unexpected:', response);
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch claim details for modal:', error);
//       toast.error(error.message || 'Failed to fetch claim details for view.');
//     }
//   };

//   const openActionModal = (claim: ClaimRow, type: 'approve' | 'reject') => {
//     setSelectedClaim(claim);
//     setActionType(type);
//     setActionRemark('');
//     setShowActionModal(true);
//   };

//   const handleApprove = async () => {
//     if (!selectedClaim || !user) {
//       toast.error('No claim selected or user not logged in.');
//       return;
//     }
//     try {
//       await api.post(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/approve`, {
//         remark: actionRemark,
//         approver_id: user.id,
//         approver_name: user.name,
//       });
//       toast.success('Claim approved successfully.');
//       setShowActionModal(false);
//       setActionRemark('');
//       await fetchClaims();
//       setShowModal(false);
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to approve claim.');
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedClaim || !user) {
//       toast.error('No claim selected or user not logged in.');
//       return;
//     }
//     if (!actionRemark.trim()) {
//       toast.error('Rejection reason is required.');
//       return;
//     }
//     try {
//       await api.post(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/reject`, {
//         remark: actionRemark,
//         approver_id: user.id,
//         approver_name: user.name,
//       });
//       toast.success('Claim rejected successfully.');
//       setShowActionModal(false);
//       setActionRemark('');
//       await fetchClaims();
//       setShowModal(false);
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to reject claim.');
//     }
//   };

//   /* =========================== New Claim (On Behalf) =========================== */
//   const openCreateModal = async () => {
//     setShowCreateModal(true);
//     setAmountError('');
//     setSelectedFile(null);
//     setSelectedBenefit(null);
//     setBenefits([]);
//     setDepartments([]);
//     setEmployees([]);
//     setForm({
//       company_id: '',
//       department_id: '',
//       employee_id: '',
//       benefit_type_id: '',
//       amount: '',
//       claim_date: new Date().toISOString().split('T')[0],
//       employee_remark: '',
//     });
//     // You already load companies on mount; this refresh ensures latest
//     try {
//       const comps = await api.get(`${API_BASE_URL}/api/companies`);
//       setCompanies(normalizeCompanies(comps));
//     } catch (e: any) {
//       console.error(e);
//       toast.error('Failed to load companies');
//     }
//   };

//   const onCompanyChange = async (value: string) => {
//     const companyId = Number(value) || 0;
//     setForm((f) => ({ ...f, company_id: value, department_id: '', employee_id: '', benefit_type_id: '', amount: '' }));
//     setDepartments([]);
//     setEmployees([]);
//     if (companyId) await loadDepartments(companyId);
//   };

//   const onDepartmentChange = async (value: string) => {
//     const deptId = Number(value) || 0;
//     setForm((f) => ({ ...f, department_id: value, employee_id: '' }));
//     setEmployees([]);
//     if (deptId && form.company_id) {
//       await loadEmployees(deptId, Number(form.company_id));
//     }
//   };

//   const onEmployeeChange = async (value: string) => {
//     setForm((f) => ({ ...f, employee_id: value, benefit_type_id: '', amount: '' }));
//     setSelectedBenefit(null);
//     setBenefits([]);
//     setAmountError('');

//     if (value) {
//       try {
//         const data = await api.get(`${API_BASE_URL}/api/employee-benefits/summary/${value}`);
//         const validated = Array.isArray(data)
//           ? data.filter((b: any) => b && typeof b.id === 'number' && typeof b.benefit_type === 'string')
//           : [];
//         setBenefits(validated);
//       } catch (e: any) {
//         console.error(e);
//         toast.error(e.message || 'Failed to load employee benefits');
//       }
//     }
//   };

//   const onBenefitChange = (benefitAssignId: string) => {
//     setForm((f) => ({ ...f, benefit_type_id: benefitAssignId, amount: '' }));
//     const b = benefits.find((x) => x.id.toString() === benefitAssignId) || null;
//     setSelectedBenefit(b);
//     setAmountError('');
//     if (b && parseFloat(b.balance) <= 0) {
//       toast.error('This benefit has no available balance');
//     }
//   };

//   const onAmountChange = (val: string) => {
//     setForm((f) => ({ ...f, amount: val }));
//     if (!selectedBenefit) return;
//     const balance = parseFloat(selectedBenefit.balance);
//     const amt = parseFloat(val);
//     if (val === '') setAmountError('');
//     else if (Number.isNaN(amt)) setAmountError('Please enter a valid amount');
//     else if (amt <= 0) setAmountError('Amount must be greater than 0');
//     else if (amt > balance) setAmountError(`Amount exceeds available balance of RM ${balance.toFixed(2)}`);
//     else setAmountError('');
//   };

//   const submitOnBehalf = async () => {
//     if (!user) {
//       toast.error('User session expired. Please login again.');
//       return;
//     }
//     if (!form.company_id || !form.department_id || !form.employee_id) {
//       toast.error('Please select company, department and employee.');
//       return;
//     }
//     if (!form.benefit_type_id) {
//       toast.error('Please select a benefit type.');
//       return;
//     }
//     const amount = parseFloat(form.amount);
//     if (Number.isNaN(amount) || amount <= 0) {
//       toast.error('Please enter a valid amount greater than 0.');
//       return;
//     }
//     if (amountError) {
//       toast.error(amountError);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         employee_id: parseInt(form.employee_id, 10),
//         benefit_type_id: parseInt(form.benefit_type_id, 10),
//         claim_date: form.claim_date,
//         amount,
//         employee_remark: form.employee_remark,
//         submitted_by_admin_id: user.id,
//       };

//       const res = await fetch(`${API_BASE_URL}/api/claims`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to submit claim');
//       }

//       const { claim_id } = await res.json();

//       if (selectedFile && claim_id) {
//         const fd = new FormData();
//         fd.append('attachment', selectedFile);
//         fd.append('claim_id', String(claim_id));
//         fd.append('uploaded_by', String(user.id));

//         const uploadRes = await axios.post(`${API_BASE_URL}/api/claims/attachments`, fd, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (pe: AxiosProgressEvent) => {
//             if (pe.total) {
//               const pct = Math.round((pe.loaded * 100) / pe.total);
//               // You can route this to a progress UI if you want
//               // console.log('Upload', pct, '%');
//             }
//           },
//         });

//         if (uploadRes.status !== 201 && uploadRes.status !== 200) {
//           throw new Error('Attachment upload failed');
//         }
//       }

//       toast.success('Claim submitted successfully');
//       setShowCreateModal(false);
//       await fetchClaims();
//     } catch (err: any) {
//       console.error('Error submitting claim:', err);
//       toast.error(err?.message || 'Error submitting claim');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* =========================== UI =========================== */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-inter">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Claim Benefit Dashboard</h1>
//           <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
//             <Plus className="w-4 h-4 mr-1" /> New Claim (On Behalf)
//           </button>
//         </div>

//         {/* Summary Cards */}
//         <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {loadingSummary ? (
//             <div className="col-span-full text-center py-10">
//               <span className="loading loading-spinner text-primary" />
//               <p className="mt-2 text-gray-600">Loading summary...</p>
//             </div>
//           ) : summaries.length > 0 ? (
//             summaries.map((summary) => <SummaryCard key={summary.benefit_type} summary={summary} />)
//           ) : (
//             <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
//               <p className="text-gray-500">No summary data available.</p>
//             </div>
//           )}
//         </div>

//         {/* Filter & Table */}
//         <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <h2 className="text-xl font-semibold text-gray-700">All Employee Claims</h2>
//           <input
//             type="text"
//             className="input input-bordered w-full sm:w-72 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Search by employee, company or benefit"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               const keyword = e.target.value.toLowerCase();
//               setFilteredClaims(
//                 claims.filter(
//                   (c) =>
//                     c.employee_name.toLowerCase().includes(keyword) ||
//                     c.company_name.toLowerCase().includes(keyword) ||
//                     c.benefit_type.toLowerCase().includes(keyword),
//                 ),
//               );
//             }}
//           />
//         </div>

//         {loadingClaims ? (
//           <div className="text-center py-10 bg-white rounded-lg shadow">
//             <span className="loading loading-spinner text-primary" />
//             <p className="mt-2 text-gray-600">Loading claims...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="table w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Company</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Benefit</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredClaims.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center text-gray-500 py-6">
//                       No claims found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredClaims.map((claim) => (
//                     <tr key={claim.id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="p-4 whitespace-nowrap">{claim.employee_name}</td>
//                       <td className="p-4 whitespace-nowrap">{claim.company_name}</td>
//                       <td className="p-4 whitespace-nowrap">{claim.benefit_type}</td>
//                       <td className="p-4 whitespace-nowrap font-medium">{formatCurrency(claim.amount)}</td>
//                       <td className="p-4 whitespace-nowrap">{new Date(claim.claim_date).toLocaleDateString()}</td>
//                       <td className="p-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             claim.status === 'Pending'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : claim.status === 'Approved'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {claim.status}
//                         </span>
//                       </td>
//                       <td className="p-4 whitespace-nowrap flex gap-2">
//                         <button
//                           className="btn btn-sm btn-info text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
//                           onClick={() => handleViewDetails(claim)}
//                         >
//                           View
//                         </button>
//                         {claim.status === 'Pending' && (
//                           <>
//                             <button
//                               className="btn btn-sm btn-success text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
//                               onClick={() => openActionModal(claim, 'approve')}
//                             >
//                               Approve
//                             </button>
//                             <button
//                               className="btn btn-sm btn-error text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
//                               onClick={() => openActionModal(claim, 'reject')}
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ======================== View Details Modal ======================== */}
//       {showModal && selectedClaim && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
//           <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Claim Details - #{selectedClaim.id}</h2>
//             <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
//               <XCircle size={24} />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
//               <div className="flex items-center"><UserIcon size={16} className="mr-2 text-blue-500" /><strong>Employee:</strong><span className="ml-1">{selectedClaim.employee_name}</span></div>
//               <div className="flex items-center"><Briefcase size={16} className="mr-2 text-purple-500" /><strong>Company:</strong><span className="ml-1">{selectedClaim.company_name}</span></div>
//               {selectedClaim.department_name && (
//                 <div className="flex items-center"><Users size={16} className="mr-2 text-teal-500" /><strong>Department:</strong><span className="ml-1">{selectedClaim.department_name}</span></div>
//               )}
//               <div className="flex items-center"><Tag size={16} className="mr-2 text-green-500" /><strong>Benefit Type:</strong><span className="ml-1">{selectedClaim.benefit_type}</span></div>
//               <div className="flex items-center"><DollarSign size={16} className="mr-2 text-orange-500" /><strong>Claimed Amount:</strong><span className="ml-1 font-semibold">{formatCurrency(selectedClaim.amount)}</span></div>
//               {selectedClaim.approved_amount !== null && (
//                 <div className="flex items-center"><DollarSign size={16} className="mr-2 text-lime-600" /><strong>Approved Amount:</strong><span className="ml-1 font-semibold">{formatCurrency(selectedClaim.approved_amount)}</span></div>
//               )}
//               <div className="flex items-center"><CalendarDays size={16} className="mr-2 text-red-500" /><strong>Claim Date:</strong><span className="ml-1">{new Date(selectedClaim.claim_date).toLocaleDateString()}</span></div>
//               <div className="flex items-center">
//                 <Info size={16} className="mr-2 text-gray-500" /><strong>Status:</strong>
//                 <span
//                   className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
//                     selectedClaim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                     selectedClaim.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                     'bg-red-100 text-red-800'
//                   }`}
//                 >
//                   {selectedClaim.status}
//                 </span>
//               </div>
//               <div className="col-span-1 md:col-span-2 flex items-start">
//                 <MessageSquare size={16} className="mr-2 mt-1 text-indigo-500" />
//                 <strong>Employee Remark:</strong> <span className="ml-1 flex-grow italic text-gray-600">{selectedClaim.employee_remark || '-'}</span>
//               </div>
//               {selectedClaim.admin_remark && (
//                 <div className="col-span-1 md:col-span-2 flex items-start">
//                   <MessageSquare size={16} className="mr-2 mt-1 text-teal-500" />
//                   <strong>Admin Remark:</strong> <span className="ml-1 flex-grow italic text-gray-600">{selectedClaim.admin_remark}</span>
//                 </div>
//               )}
//             </div>

//             <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Approval Flow Status</h3>
//             {currentApprovals.length > 0 ? (
//               <div className="overflow-x-auto mb-6">
//                 <table className="table w-full text-sm">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Action Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentApprovals.map((approval, index) => (
//                       <tr key={index} className="border-b border-gray-100">
//                         <td className="py-2">{approval.level}</td>
//                         <td className="py-2">{approval.approver_name}</td>
//                         <td className="py-2">
//                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                             approval.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                             approval.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {approval.status}
//                           </span>
//                         </td>
//                         <td className="py-2">{approval.action_date ? new Date(approval.action_date).toLocaleDateString() : '-'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-center text-gray-500 py-4 mb-6">No current approval status data available.</p>
//             )}

//             <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Approval History Log</h3>
//             {approvalHistory.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="table w-full text-sm">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Remark</th>
//                       <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {approvalHistory.map((history) => (
//                       <tr key={history.id} className="border-b border-gray-100">
//                         <td className="py-2">{history.level}</td>
//                         <td className="py-2">{history.approver_name}</td>
//                         <td className="py-2">
//                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                             history.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                             history.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {history.status}
//                           </span>
//                         </td>
//                         <td className="py-2">{history.remark || '-'}</td>
//                         <td className="py-2">{history.approved_at ? new Date(history.approved_at).toLocaleString() : '-'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-center text-gray-500 py-4">No detailed approval history log available.</p>
//             )}

//             <div className="flex justify-end mt-6">
//               <button className="btn btn-ghost rounded-md" onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================== Approve / Reject Modal ======================== */}
//       {showActionModal && selectedClaim && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
//           <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
//                <h2 className={`text-xl font-bold mb-4 ${actionType === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
//               {actionType === 'approve' ? '✅ Approve Claim Request' : '❌ Reject Claim Request'}
//             </h2>
//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
//               <div><strong>Employee:</strong> {selectedClaim.employee_name}</div>
//               <div><strong>Company:</strong> {selectedClaim.company_name}</div>
//               <div><strong>Benefit Type:</strong> {selectedClaim.benefit_type}</div>
//               <div><strong>Date:</strong> {new Date(selectedClaim.claim_date).toLocaleDateString()}</div>
//               <div><strong>Amount:</strong> {formatCurrency(selectedClaim.amount)}</div>
//               <div><strong>Status:</strong> {selectedClaim.status}</div>
//               <div className="col-span-2"><strong>Employee Remark:</strong> <span className="italic text-gray-600">{selectedClaim.employee_remark}</span></div>
//             </div>

//             <label className="block font-medium text-sm text-gray-700 mb-1">
//               {actionType === 'approve' ? 'Approval Comment (Optional)' : 'Rejection Reason'} {actionType === 'reject' && <span className="text-red-500">*</span>}
//             </label>
//             <textarea
//               className="textarea textarea-bordered w-full mb-4"
//               value={actionRemark}
//               onChange={(e) => setActionRemark(e.target.value)}
//               placeholder={actionType === 'approve' ? 'Add comment (optional)' : 'Please provide a reason'}
//               required={actionType === 'reject'}
//             />
//             {actionType === 'approve' ? (
//               <div className="bg-green-50 text-green-800 text-sm border border-green-200 rounded-md p-3 mb-4">
//                 <strong>Approval Confirmation:</strong> By approving this claim, you confirm the request is valid and processed.
//               </div>
//             ) : (
//               <div className="bg-yellow-50 text-yellow-800 text-sm border border-yellow-300 rounded-md p-3 mb-4">
//                 <strong>Important Note:</strong> This action cannot be undone. The employee will be notified.
//               </div>
//             )}
//             <div className="flex justify-end gap-3">
//               <button className="btn btn-sm" onClick={() => setShowActionModal(false)}>Cancel</button>
//               <button
//                 className={`btn btn-sm ${actionType === 'approve' ? 'btn-success' : 'btn-error'}`}
//                 onClick={actionType === 'approve' ? handleApprove : handleReject}
//                 disabled={actionType === 'reject' && actionRemark.trim() === ''}
//               >
//                 {actionType === 'approve' ? 'Approve Claim' : 'Reject Claim'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================== New Claim (On Behalf) Modal ======================== */}
//       {showCreateModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
//           <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">New Claim (On Behalf)</h2>
//             <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>
//               <XCircle size={24} />
//             </button>

//             {/* Company / Department / Employee */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-error">*</span></label>
//                 <select className="select select-bordered w-full" value={form.company_id} onChange={(e) => onCompanyChange(e.target.value)} disabled={loadingCompanies}>
//                   <option value="">{loadingCompanies ? 'Loading companies...' : 'Select company'}</option>
//                   {companies.map((c) => (
//                     <option key={c.id} value={c.id.toString()}>
//                       {c.company_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-error">*</span></label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={form.department_id}
//                   onChange={(e) => onDepartmentChange(e.target.value)}
//                   disabled={!form.company_id || loadingDepartments}
//                 >
//                   <option value="">
//                     {!form.company_id
//                       ? 'Select company first'
//                       : loadingDepartments
//                       ? 'Loading departments...'
//                       : departments.length
//                       ? 'Select department'
//                       : 'No departments found'}
//                   </option>
//                   {departments.map((d) => (
//                     <option key={d.id} value={d.id.toString()}>
//                       {d.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee <span className="text-error">*</span></label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={form.employee_id}
//                   onChange={(e) => onEmployeeChange(e.target.value)}
//                   disabled={!form.department_id || loadingEmployees}
//                 >
//                   <option value="">
//                     {!form.department_id
//                       ? 'Select department first'
//                       : loadingEmployees
//                       ? 'Loading employees...'
//                       : employees.length
//                       ? 'Select employee'
//                       : 'No employees found'}
//                   </option>
//                   {employees.map((emp) => (
//                     <option key={emp.id} value={emp.id.toString()}>
//                       {emp.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Benefits & Metrics */}
//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Benefit Type <span className="text-error">*</span></label>
//               <select className="select select-bordered w-full" value={form.benefit_type_id} onChange={(e) => onBenefitChange(e.target.value)} disabled={!form.employee_id}>
//                 <option value="">Select Benefit Type</option>
//                 {benefits.map((b) => {
//                   const isActive = b.status === 'Active';
//                   const hasBalance = parseFloat(b.balance) > 0;
//                   const disabled = !isActive || !hasBalance;
//                   return (
//                     <option key={`benefit-${b.id}`} value={isActive ? b.id.toString() : ''} disabled={disabled}>
//                       {b.benefit_type}{!isActive ? ` (${b.status})` : hasBalance ? '' : ' (No balance)'}
//                     </option>
//                   );
//                 })}
//               </select>

//               {selectedBenefit && (
//                 <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
//                   <div className="grid grid-cols-3 gap-4 mb-3">
//                     <div>
//                       <p className="text-xs font-medium text-base-content/70">Entitled</p>
//                       <p className="text-lg font-bold text-primary">RM {parseFloat(selectedBenefit.entitled).toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-medium text-base-content/70">Balance</p>
//                       <p className={`text-lg font-bold ${parseFloat(selectedBenefit.balance) <= 0 ? 'text-error' : 'text-success'}`}>RM {parseFloat(selectedBenefit.balance).toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-medium text-base-content/70">Yearly Claimed</p>
//                       <p className="text-lg font-bold text-secondary">RM {parseFloat(selectedBenefit.claimed || '0').toFixed(2)}</p>
//                     </div>
//                   </div>
//                   {selectedBenefit.description && (
//                     <div className="flex items-start gap-2 p-3 bg-base-100 rounded border border-base-300">
//                       <Info className="h-5 w-5 text-info mt-0.5" />
//                       <p className="text-sm text-base-content/80">{selectedBenefit.description}</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Amount & Date */}
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount (RM) <span className="text-error">*</span></label>
//                 <input
//                   type="number"
//                   className={`input input-bordered w-full ${amountError ? 'input-error' : ''}`}
//                   placeholder="0.00"
//                   value={form.amount}
//                   onChange={(e) => onAmountChange(e.target.value)}
//                   step="0.01"
//                   min="0"
//                   disabled={!selectedBenefit}
//                 />
//                 {amountError && <p className="mt-1 text-sm text-error">{amountError}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Claim Date <span className="text-error">*</span></label>
//                 <input
//                   type="date"
//                   className="input input-bordered w-full"
//                   value={form.claim_date}
//                   onChange={(e) => setForm((f) => ({ ...f, claim_date: e.target.value }))}
//                   max={new Date().toISOString().split('T')[0]}
//                 />
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description / Remarks</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 rows={4}
//                 placeholder="Enter any additional details (optional)"
//                 value={form.employee_remark}
//                 onChange={(e) => setForm((f) => ({ ...f, employee_remark: e.target.value }))}
//               />
//             </div>

//             {/* Attachment */}
//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
//               <div
//                 className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'}`}
//                 onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
//                 onDragLeave={() => setIsDragActive(false)}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   setIsDragActive(false);
//                   if (e.dataTransfer.files?.length) setSelectedFile(e.dataTransfer.files[0]);
//                 }}
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-base-content/70">{isDragActive ? 'Drop file here to upload' : 'Upload supporting document (optional)'}</p>
//                   {!selectedFile && (
//                     <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
//                       + Add
//                       <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => {
//                         const f = e.target.files?.[0];
//                         if (f) setSelectedFile(f);
//                       }} />
//                     </label>
//                   )}
//                 </div>
//                 {selectedFile && (
//                   <div className="bg-base-100 px-3 py-1 rounded-md border border-base-300 inline-flex items-center">
//                     <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
//                     <button type="button" className="ml-2 text-error hover:text-error-content" onClick={() => setSelectedFile(null)}>
//                       &times;
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
//               <button className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} onClick={submitOnBehalf} disabled={isSubmitting}>
//                 Submit Claim
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// app/admins/claims/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import axios, { AxiosProgressEvent } from 'axios';
import {
  BarChart,
  Briefcase,
  DollarSign,
  Users,
  XCircle,
  Info,
  CalendarDays,
  Tag,
  MessageSquare,
  User as UserIcon,
  Plus,
} from 'lucide-react';

/* =========================== Types =========================== */
interface ClaimRow {
  id: number;
  employee_id: number;
  employee_name: string;
  company_name: string;
  company_id: number;
  benefit_type_id: number;
  benefit_type: string;
  claim_date: string;
  amount: string;
  approved_amount: string | null;
  employee_remark: string;
  admin_remark: string | null;
  status: string;
  current_approval_level: number;
  final_approval_level: number;
  created_at: string;
  updated_at: string;
  department_name?: string;
}

interface BenefitSummaryCardData {
  benefit_type: string;
  total_employees: number;
  total_entitled: string;
  total_claimed: string;
  total_balance: string;
  description?: string;
  frequency?: string;
  effective_from?: string;
  effective_to?: string;
  status?: string;
}

interface ApprovalHistory {
  id: number;
  module: string;
  record_id: number;
  company_id: number;
  level: number;
  approver_id: number;
  approver_name: string;
  status: string;
  remark: string;
  approved_at: string;
}

interface CurrentApproval {
  level: number;
  approver_id: number;
  status: string;
  remark: string | null;
  action_date: string | null;
  approver_name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number;
}

// Add to your existing interfaces
interface ReportFilter {
  startDate: string;
  endDate: string;
  status: string;
  company_id: string;
  employee_id: string;
  benefit_type_id: string;
}

interface ClaimsReportResponse {
  success: boolean;
  data: ClaimRow[];
  total: number;
  filters: ReportFilter;
}

interface BenefitType {
  id: number;
  name: string;
}

/* ============== On-Behalf form support types ============== */
type Company = { id: number; company_name: string };
type Department = { id: number; department_name: string };
type Employee = { id: number; name: string; department_id?: number; company_id?: number };

interface Benefit {
  id: number; // employee_benefit assignment ID
  employee_id: number;
  benefit_type: string;
  description: string;
  frequency: string;
  entitled: string;
  claimed: string;
  balance: string;
  effective_from: string;
  effective_to: string;
  status: 'Active' | 'Upcoming' | 'Expired' | 'Unknown';
}

/* =========================== Helpers =========================== */
const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return 'RM 0.00';
  return `RM ${num.toFixed(2)}`;
};

const SummaryCard = ({ summary }: { summary: BenefitSummaryCardData }) => {
  const [hovered, setHovered] = useState(false);
  const entitled = parseFloat(summary.total_entitled);
  const claimed = parseFloat(summary.total_claimed);
  const utilization = entitled > 0 ? (claimed / entitled) * 100 : 0;

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      {summary.description && (
        <div
          className="absolute top-4 right-4 z-10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Benefit description"
        >
          <Info className={`w-6 h-6 cursor-pointer transition-transform duration-200 ${hovered ? 'scale-110 text-blue-600' : 'text-gray-400'}`} />
          {hovered && (
            <div className="absolute top-8 right-0 w-64 text-sm bg-white border border-gray-300 shadow-lg rounded-md p-3 z-20">
              <p className="text-gray-700 italic">{summary.description}</p>
            </div>
          )}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8">{summary.benefit_type}</h3>

      <div className="space-y-3 text-sm text-gray-700 mb-4">
        <div className="flex justify-between">
          <span className="flex items-center"><Users size={16} className="mr-2 text-gray-400" />Total Employees</span>
          <span className="font-semibold text-gray-900">{summary.total_employees}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center"><DollarSign size={16} className="mr-2 text-green-500" />Total Entitled</span>
          <span className="font-semibold text-green-600">{formatCurrency(summary.total_entitled)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center"><BarChart size={16} className="mr-2 text-orange-500" />Total Claimed</span>
          <span className="font-semibold text-orange-600">{formatCurrency(summary.total_claimed)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center"><DollarSign size={16} className="mr-2 text-blue-500" />Balance</span>
          <span className="font-semibold text-blue-600">{formatCurrency(summary.total_balance)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
        <div>
          <span className="text-gray-500 block">Frequency</span>
          <span className="font-medium text-gray-800">{summary.frequency || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Status</span>
          <span className={`font-semibold ${summary.status === 'Active' ? 'text-green-600' : summary.status === 'Expired' ? 'text-red-500' : 'text-gray-500'}`}>{summary.status || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Effective From</span>
          <span className="text-gray-800">{summary.effective_from ? new Date(summary.effective_from).toLocaleDateString() : '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Effective To</span>
          <span className="text-gray-800">{summary.effective_to ? new Date(summary.effective_to).toLocaleDateString() : '-'}</span>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-gray-500">Utilization</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${utilization}%` }} />
        </div>
        <p className="text-right text-xs font-semibold text-blue-700 mt-1">{utilization.toFixed(2)}%</p>
      </div>
    </div>
  );
};

/* =========================== Page =========================== */
export default function AdminClaimListPage() {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [summaries, setSummaries] = useState<BenefitSummaryCardData[]>([]);
  const [search, setSearch] = useState('');
  const [filteredClaims, setFilteredClaims] = useState<ClaimRow[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Report export state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportFilters, setReportFilters] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    status: 'all',
    company_id: '',
    employee_id: '',
    benefit_type_id: ''
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  const [benefitTypes, setBenefitTypes] = useState<BenefitType[]>([]);

  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [currentApprovals, setCurrentApprovals] = useState<CurrentApproval[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Approve/Reject modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionRemark, setActionRemark] = useState('');

  // New Claim (On Behalf) modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [form, setForm] = useState({
    company_id: '',
    department_id: '',
    employee_id: '',
    benefit_type_id: '',
    amount: '',
    claim_date: new Date().toISOString().split('T')[0],
    employee_remark: '',
  });

  const [user, setUser] = useState<User | null>(null);

  /* =========================== Normalizers & loaders =========================== */
  const normalizeCompanies = (raw: any): Company[] => {
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : raw.data || [];
    return arr
      .filter((c: any) => c && typeof c.id === 'number')
      .map((c: any) => ({
        id: c.id,
        company_name: c.company_name ?? c.name ?? `Company #${c.id}`,
      }));
  };

  const normalizeDepartments = (raw: any): Department[] => {
    const arr = Array.isArray(raw) ? raw : raw?.departments || raw?.data?.departments || [];
    return arr
      .filter((d: any) => d && (typeof d.id === 'number' || typeof d.id === 'string'))
      .map((d: any) => ({
        id: Number(d.id),
        department_name: d.department_name ?? d.name ?? `Department #${d.id}`,
      }));
  };

  const normalizeEmployees = (raw: any): Employee[] => {
    const arr = Array.isArray(raw) ? raw : raw?.data || [];
    return arr
      .filter((e: any) => e && typeof e.id === 'number')
      .map((e: any) => ({ id: e.id, name: e.name, department_id: e.department_id, company_id: e.company_id }));
  };

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const res = await api.get(`${API_BASE_URL}/api/companies`);
      setCompanies(normalizeCompanies(res));
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to load companies');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadDepartments = async (companyId: number) => {
    setDepartments([]);
    setEmployees([]);
    try {
      setLoadingDepartments(true);
      const res = await api.get(`${API_BASE_URL}/api/companies/${companyId}/departments`);
      setDepartments(normalizeDepartments(res));
    } catch (e: any) {
      console.warn('Departments load warning:', e?.message);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const tryGet = async <T = any>(url: string): Promise<T | null> => {
    try {
      return await api.get(url);
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  };

  const loadEmployees = async (departmentId: number, companyId: number) => {
    setEmployees([]);
    setLoadingEmployees(true);
    try {
      let res =
        (await tryGet(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`)) ||
        (await tryGet(`${API_BASE_URL}/api/departments/${departmentId}/employees`));

      if (res) {
        setEmployees(normalizeEmployees(res));
        return;
      }

      res =
        (await tryGet(`${API_BASE_URL}/api/admin/employees?department_id=${departmentId}&status=Active`)) ||
        (await tryGet(`${API_BASE_URL}/api/employees?department_id=${departmentId}&status=Active`));

      if (res) {
        setEmployees(normalizeEmployees(res));
        return;
      }

      const byCompany =
        (await tryGet(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`)) ||
        (await tryGet(`${API_BASE_URL}/api/companies/${companyId}/employees`));

      if (byCompany) {
        setEmployees(normalizeEmployees(byCompany));
        return;
      }

      toast.error('No matching employee endpoint found. Check API base path.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  /* =========================== Effects =========================== */
  useEffect(() => {
    fetchClaims();
    fetchSummary();
    loadUserData();
    loadCompanies();
    fetchBenefitTypes();
  }, []);

  useEffect(() => {
    // lock body scroll when any modal open (nice UX)
    const lock = showModal || showActionModal || showCreateModal || isReportModalOpen;
    document.body.classList.toggle('overflow-hidden', lock);
    return () => document.body.classList.remove('overflow-hidden');
  }, [showModal, showActionModal, showCreateModal, isReportModalOpen]);

  /* =========================== Data fetchers =========================== */
  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('hrms_user');
      if (userData) {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Failed to load user data');
    }
    return null;
  };

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const data = await api.get(`${API_BASE_URL}/api/claims`);
      setClaims(data);
      setFilteredClaims(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load claims.');
    } finally {
      setLoadingClaims(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await api.get(`${API_BASE_URL}/api/employee-benefits/summary`);
      setSummaries(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load benefit summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchBenefitTypes = async () => {
    try {
      const data = await api.get(`${API_BASE_URL}/api/benefit-types`);
      setBenefitTypes(data);
    } catch (err: any) {
      console.error('Error fetching benefit types:', err);
      toast.error('Failed to load benefit types for filters.');
    }
  };

  /* =========================== Export Report Functions =========================== */
  const handleExportReport = async () => {
    setGeneratingReport(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (reportFilters.startDate) params.append('startDate', reportFilters.startDate);
      if (reportFilters.endDate) params.append('endDate', reportFilters.endDate);
      if (reportFilters.status && reportFilters.status !== 'all') params.append('status', reportFilters.status);
      if (reportFilters.company_id) params.append('company_id', reportFilters.company_id);
      if (reportFilters.employee_id) params.append('employee_id', reportFilters.employee_id);
      if (reportFilters.benefit_type_id) params.append('benefit_type_id', reportFilters.benefit_type_id);

      const response = await fetch(`${API_BASE_URL}/api/claims/claims-report?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const result: ClaimsReportResponse = await response.json();
      
      if (result.success && result.data.length > 0) {
        // Convert to CSV
        const csvData = convertClaimsToCSV(result.data);
        
        // Download CSV file
        downloadCSV(csvData, `claims-report-${new Date().toISOString().split('T')[0]}.csv`);
        
        toast.success(`Report exported successfully! ${result.total} records found.`);
        setIsReportModalOpen(false);
      } else {
        toast.error('No data found for the selected filters.');
      }
      
    } catch (error: any) {
      console.error('Error exporting report:', error);
      toast.error(error.message || 'Failed to export report');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Helper function to convert claims data to CSV
  const convertClaimsToCSV = (data: ClaimRow[]): string => {
    const headers = [
      'Claim ID',
      'Employee ID',
      'Employee Name',
      'Company',
      'Benefit Type',
      'Claim Date',
      'Amount (RM)',
      'Approved Amount (RM)',
      'Status',
      'Employee Remark',
      'Admin Remark',
      'Current Approval Level',
      'Final Approval Level',
      'Created Date',
      'Updated Date'
    ];

    const csvRows = data.map(claim => [
      claim.id,
      claim.employee_id,
      claim.employee_name,
      claim.company_name,
      claim.benefit_type,
      new Date(claim.claim_date).toLocaleDateString(),
      parseFloat(claim.amount?.toString() || '0').toFixed(2),
      claim.approved_amount ? parseFloat(claim.approved_amount.toString()).toFixed(2) : '0.00',
      claim.status,
      `"${(claim.employee_remark || '').replace(/"/g, '""')}"`,
      `"${(claim.admin_remark || '').replace(/"/g, '""')}"`,
      claim.current_approval_level,
      claim.final_approval_level,
      new Date(claim.created_at).toLocaleString(),
      claim.updated_at ? new Date(claim.updated_at).toLocaleString() : 'N/A'
    ]);

    return [headers, ...csvRows]
      .map(row => row.join(','))
      .join('\n');
  };

  // Helper function to download CSV
  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  /* =========================== Row actions =========================== */
  const handleViewDetails = async (claim: ClaimRow) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/approval/claims/${claim.id}`);
      if (response && response.claimDetails) {
        setSelectedClaim(response.claimDetails);
        setApprovalHistory(response.approvalHistory || []);
        setCurrentApprovals(response.currentApprovals || []);
        setShowModal(true);
      } else {
        toast.error('Invalid claim details response from API.');
        console.error('API response for claim details was unexpected:', response);
      }
    } catch (error: any) {
      console.error('Failed to fetch claim details for modal:', error);
      toast.error(error.message || 'Failed to fetch claim details for view.');
    }
  };

  const openActionModal = (claim: ClaimRow, type: 'approve' | 'reject') => {
    setSelectedClaim(claim);
    setActionType(type);
    setActionRemark('');
    setShowActionModal(true);
  };

  const handleApprove = async () => {
    if (!selectedClaim || !user) {
      toast.error('No claim selected or user not logged in.');
      return;
    }
    try {
      await api.post(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/approve`, {
        remark: actionRemark,
        approver_id: user.id,
        approver_name: user.name,
      });
      toast.success('Claim approved successfully.');
      setShowActionModal(false);
      setActionRemark('');
      await fetchClaims();
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve claim.');
    }
  };

  const handleReject = async () => {
    if (!selectedClaim || !user) {
      toast.error('No claim selected or user not logged in.');
      return;
    }
    if (!actionRemark.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    try {
      await api.post(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/reject`, {
        remark: actionRemark,
        approver_id: user.id,
        approver_name: user.name,
      });
      toast.success('Claim rejected successfully.');
      setShowActionModal(false);
      setActionRemark('');
      await fetchClaims();
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject claim.');
    }
  };

  /* =========================== New Claim (On Behalf) =========================== */
  const openCreateModal = async () => {
    setShowCreateModal(true);
    setAmountError('');
    setSelectedFile(null);
    setSelectedBenefit(null);
    setBenefits([]);
    setDepartments([]);
    setEmployees([]);
    setForm({
      company_id: '',
      department_id: '',
      employee_id: '',
      benefit_type_id: '',
      amount: '',
      claim_date: new Date().toISOString().split('T')[0],
      employee_remark: '',
    });
    // You already load companies on mount; this refresh ensures latest
    try {
      const comps = await api.get(`${API_BASE_URL}/api/companies`);
      setCompanies(normalizeCompanies(comps));
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to load companies');
    }
  };

  const onCompanyChange = async (value: string) => {
    const companyId = Number(value) || 0;
    setForm((f) => ({ ...f, company_id: value, department_id: '', employee_id: '', benefit_type_id: '', amount: '' }));
    setDepartments([]);
    setEmployees([]);
    if (companyId) await loadDepartments(companyId);
  };

  const onDepartmentChange = async (value: string) => {
    const deptId = Number(value) || 0;
    setForm((f) => ({ ...f, department_id: value, employee_id: '' }));
    setEmployees([]);
    if (deptId && form.company_id) {
      await loadEmployees(deptId, Number(form.company_id));
    }
  };

  const onEmployeeChange = async (value: string) => {
    setForm((f) => ({ ...f, employee_id: value, benefit_type_id: '', amount: '' }));
    setSelectedBenefit(null);
    setBenefits([]);
    setAmountError('');

    if (value) {
      try {
        const data = await api.get(`${API_BASE_URL}/api/employee-benefits/summary/${value}`);
        const validated = Array.isArray(data)
          ? data.filter((b: any) => b && typeof b.id === 'number' && typeof b.benefit_type === 'string')
          : [];
        setBenefits(validated);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Failed to load employee benefits');
      }
    }
  };

  const onBenefitChange = (benefitAssignId: string) => {
    setForm((f) => ({ ...f, benefit_type_id: benefitAssignId, amount: '' }));
    const b = benefits.find((x) => x.id.toString() === benefitAssignId) || null;
    setSelectedBenefit(b);
    setAmountError('');
    if (b && parseFloat(b.balance) <= 0) {
      toast.error('This benefit has no available balance');
    }
  };

  const onAmountChange = (val: string) => {
    setForm((f) => ({ ...f, amount: val }));
    if (!selectedBenefit) return;
    const balance = parseFloat(selectedBenefit.balance);
    const amt = parseFloat(val);
    if (val === '') setAmountError('');
    else if (Number.isNaN(amt)) setAmountError('Please enter a valid amount');
    else if (amt <= 0) setAmountError('Amount must be greater than 0');
    else if (amt > balance) setAmountError(`Amount exceeds available balance of RM ${balance.toFixed(2)}`);
    else setAmountError('');
  };

  const submitOnBehalf = async () => {
    if (!user) {
      toast.error('User session expired. Please login again.');
      return;
    }
    if (!form.company_id || !form.department_id || !form.employee_id) {
      toast.error('Please select company, department and employee.');
      return;
    }
    if (!form.benefit_type_id) {
      toast.error('Please select a benefit type.');
      return;
    }
    const amount = parseFloat(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }
    if (amountError) {
      toast.error(amountError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: parseInt(form.employee_id, 10),
        benefit_type_id: parseInt(form.benefit_type_id, 10),
        claim_date: form.claim_date,
        amount,
        employee_remark: form.employee_remark,
        submitted_by_admin_id: user.id,
      };

      const res = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit claim');
      }

      const { claim_id } = await res.json();

      if (selectedFile && claim_id) {
        const fd = new FormData();
        fd.append('attachment', selectedFile);
        fd.append('claim_id', String(claim_id));
        fd.append('uploaded_by', String(user.id));

        const uploadRes = await axios.post(`${API_BASE_URL}/api/claims/attachments`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (pe: AxiosProgressEvent) => {
            if (pe.total) {
              const pct = Math.round((pe.loaded * 100) / pe.total);
              // You can route this to a progress UI if you want
              // console.log('Upload', pct, '%');
            }
          },
        });

        if (uploadRes.status !== 201 && uploadRes.status !== 200) {
          throw new Error('Attachment upload failed');
        }
      }

      toast.success('Claim submitted successfully');
      setShowCreateModal(false);
      await fetchClaims();
    } catch (err: any) {
      console.error('Error submitting claim:', err);
      toast.error(err?.message || 'Error submitting claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================== UI =========================== */
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Claim Benefit Dashboard</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsReportModalOpen(true)}
               className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"//className="btn btn-outline btn-primary btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Report
            </button>
            <button 
             className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"//className="btn btn-primary btn-sm" 
            onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-1" /> New Claim (On Behalf)
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loadingSummary ? (
            <div className="col-span-full text-center py-10">
              <span className="loading loading-spinner text-primary" />
              <p className="mt-2 text-gray-600">Loading summary...</p>
            </div>
          ) : summaries.length > 0 ? (
            summaries.map((summary) => <SummaryCard key={summary.benefit_type} summary={summary} />)
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">No summary data available.</p>
            </div>
          )}
        </div>

        {/* Filter & Table */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-700">All Employee Claims</h2>
          <input
            type="text"
            className="input input-bordered w-full sm:w-72 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by employee, company or benefit"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              const keyword = e.target.value.toLowerCase();
              setFilteredClaims(
                claims.filter(
                  (c) =>
                    c.employee_name.toLowerCase().includes(keyword) ||
                    c.company_name.toLowerCase().includes(keyword) ||
                    c.benefit_type.toLowerCase().includes(keyword),
                ),
              );
            }}
          />
        </div>

        {loadingClaims ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <span className="loading loading-spinner text-primary" />
            <p className="mt-2 text-gray-600">Loading claims...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Benefit</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-6">
                      No claims found.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 whitespace-nowrap">{claim.employee_name}</td>
                      <td className="p-4 whitespace-nowrap">{claim.company_name}</td>
                      <td className="p-4 whitespace-nowrap">{claim.benefit_type}</td>
                      <td className="p-4 whitespace-nowrap font-medium">{formatCurrency(claim.amount)}</td>
                      <td className="p-4 whitespace-nowrap">{new Date(claim.claim_date).toLocaleDateString()}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            claim.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : claim.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap flex gap-2">
                        <button
                          className="btn btn-sm btn-info text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
                          onClick={() => handleViewDetails(claim)}
                        >
                          View
                        </button>
                        {claim.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-sm btn-success text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
                              onClick={() => openActionModal(claim, 'approve')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-error text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
                              onClick={() => openActionModal(claim, 'reject')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================== Export Report Modal ======================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Export Claims Report</h3>
              <button 
                onClick={() => setIsReportModalOpen(false)} 
                className="btn btn-sm btn-circle btn-ghost"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={reportFilters.startDate}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={reportFilters.endDate}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={reportFilters.status}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      status: e.target.value
                    }))}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Company</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={reportFilters.company_id}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      company_id: e.target.value
                    }))}
                  >
                    <option value="">All Companies</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Benefit Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={reportFilters.benefit_type_id}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      benefit_type_id: e.target.value
                    }))}
                  >
                    <option value="">All Benefit Types</option>
                    {benefitTypes.map(benefit => (
                      <option key={benefit.id} value={benefit.id}>
                        {benefit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employee ID</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Employee ID (optional)"
                    className="input input-bordered w-full"
                    value={reportFilters.employee_id}
                    onChange={(e) => setReportFilters((prev: ReportFilter) => ({
                      ...prev,
                      employee_id: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Report will be exported in CSV format with all claim details.</span>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleExportReport}
                className="btn btn-primary"
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== View Details Modal ======================== */}
      {showModal && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Claim Details - #{selectedClaim.id}</h2>
            <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
              <XCircle size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
              <div className="flex items-center"><UserIcon size={16} className="mr-2 text-blue-500" /><strong>Employee:</strong><span className="ml-1">{selectedClaim.employee_name}</span></div>
              <div className="flex items-center"><Briefcase size={16} className="mr-2 text-purple-500" /><strong>Company:</strong><span className="ml-1">{selectedClaim.company_name}</span></div>
              {selectedClaim.department_name && (
                <div className="flex items-center"><Users size={16} className="mr-2 text-teal-500" /><strong>Department:</strong><span className="ml-1">{selectedClaim.department_name}</span></div>
              )}
              <div className="flex items-center"><Tag size={16} className="mr-2 text-green-500" /><strong>Benefit Type:</strong><span className="ml-1">{selectedClaim.benefit_type}</span></div>
              <div className="flex items-center"><DollarSign size={16} className="mr-2 text-orange-500" /><strong>Claimed Amount:</strong><span className="ml-1 font-semibold">{formatCurrency(selectedClaim.amount)}</span></div>
              {selectedClaim.approved_amount !== null && (
                <div className="flex items-center"><DollarSign size={16} className="mr-2 text-lime-600" /><strong>Approved Amount:</strong><span className="ml-1 font-semibold">{formatCurrency(selectedClaim.approved_amount)}</span></div>
              )}
              <div className="flex items-center"><CalendarDays size={16} className="mr-2 text-red-500" /><strong>Claim Date:</strong><span className="ml-1">{new Date(selectedClaim.claim_date).toLocaleDateString()}</span></div>
              <div className="flex items-center">
                <Info size={16} className="mr-2 text-gray-500" /><strong>Status:</strong>
                <span
                  className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedClaim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedClaim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedClaim.status}
                </span>
              </div>
              <div className="col-span-1 md:col-span-2 flex items-start">
                <MessageSquare size={16} className="mr-2 mt-1 text-indigo-500" />
                <strong>Employee Remark:</strong> <span className="ml-1 flex-grow italic text-gray-600">{selectedClaim.employee_remark || '-'}</span>
              </div>
              {selectedClaim.admin_remark && (
                <div className="col-span-1 md:col-span-2 flex items-start">
                  <MessageSquare size={16} className="mr-2 mt-1 text-teal-500" />
                  <strong>Admin Remark:</strong> <span className="ml-1 flex-grow italic text-gray-600">{selectedClaim.admin_remark}</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Approval Flow Status</h3>
            {currentApprovals.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <table className="table w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Action Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApprovals.map((approval, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{approval.level}</td>
                        <td className="py-2">{approval.approver_name}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            approval.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            approval.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {approval.status}
                          </span>
                        </td>
                        <td className="py-2">{approval.action_date ? new Date(approval.action_date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4 mb-6">No current approval status data available.</p>
            )}

            <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Approval History Log</h3>
            {approvalHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Remark</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalHistory.map((history) => (
                      <tr key={history.id} className="border-b border-gray-100">
                        <td className="py-2">{history.level}</td>
                        <td className="py-2">{history.approver_name}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            history.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            history.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {history.status}
                          </span>
                        </td>
                        <td className="py-2">{history.remark || '-'}</td>
                        <td className="py-2">{history.approved_at ? new Date(history.approved_at).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No detailed approval history log available.</p>
            )}

            <div className="flex justify-end mt-6">
              <button className="btn btn-ghost rounded-md" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== Approve / Reject Modal ======================== */}
      {showActionModal && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
               <h2 className={`text-xl font-bold mb-4 ${actionType === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
              {actionType === 'approve' ? '✅ Approve Claim Request' : '❌ Reject Claim Request'}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
              <div><strong>Employee:</strong> {selectedClaim.employee_name}</div>
              <div><strong>Company:</strong> {selectedClaim.company_name}</div>
              <div><strong>Benefit Type:</strong> {selectedClaim.benefit_type}</div>
              <div><strong>Date:</strong> {new Date(selectedClaim.claim_date).toLocaleDateString()}</div>
              <div><strong>Amount:</strong> {formatCurrency(selectedClaim.amount)}</div>
              <div><strong>Status:</strong> {selectedClaim.status}</div>
              <div className="col-span-2"><strong>Employee Remark:</strong> <span className="italic text-gray-600">{selectedClaim.employee_remark}</span></div>
            </div>

            <label className="block font-medium text-sm text-gray-700 mb-1">
              {actionType === 'approve' ? 'Approval Comment (Optional)' : 'Rejection Reason'} {actionType === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              value={actionRemark}
              onChange={(e) => setActionRemark(e.target.value)}
              placeholder={actionType === 'approve' ? 'Add comment (optional)' : 'Please provide a reason'}
              required={actionType === 'reject'}
            />
            {actionType === 'approve' ? (
              <div className="bg-green-50 text-green-800 text-sm border border-green-200 rounded-md p-3 mb-4">
                <strong>Approval Confirmation:</strong> By approving this claim, you confirm the request is valid and processed.
              </div>
            ) : (
              <div className="bg-yellow-50 text-yellow-800 text-sm border border-yellow-300 rounded-md p-3 mb-4">
                <strong>Important Note:</strong> This action cannot be undone. The employee will be notified.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button className="btn btn-sm" onClick={() => setShowActionModal(false)}>Cancel</button>
              <button
                className={`btn btn-sm ${actionType === 'approve' ? 'btn-success' : 'btn-error'}`}
                onClick={actionType === 'approve' ? handleApprove : handleReject}
                disabled={actionType === 'reject' && actionRemark.trim() === ''}
              >
                {actionType === 'approve' ? 'Approve Claim' : 'Reject Claim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== New Claim (On Behalf) Modal ======================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">New Claim (On Behalf)</h2>
            <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>
              <XCircle size={24} />
            </button>

            {/* Company / Department / Employee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-error">*</span></label>
                <select className="select select-bordered w-full" value={form.company_id} onChange={(e) => onCompanyChange(e.target.value)} disabled={loadingCompanies}>
                  <option value="">{loadingCompanies ? 'Loading companies...' : 'Select company'}</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-error">*</span></label>
                <select
                  className="select select-bordered w-full"
                  value={form.department_id}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                  disabled={!form.company_id || loadingDepartments}
                >
                  <option value="">
                    {!form.company_id
                      ? 'Select company first'
                      : loadingDepartments
                      ? 'Loading departments...'
                      : departments.length
                      ? 'Select department'
                      : 'No departments found'}
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id.toString()}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee <span className="text-error">*</span></label>
                <select
                  className="select select-bordered w-full"
                  value={form.employee_id}
                  onChange={(e) => onEmployeeChange(e.target.value)}
                  disabled={!form.department_id || loadingEmployees}
                >
                  <option value="">
                    {!form.department_id
                      ? 'Select department first'
                      : loadingEmployees
                      ? 'Loading employees...'
                      : employees.length
                      ? 'Select employee'
                      : 'No employees found'}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id.toString()}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Benefits & Metrics */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefit Type <span className="text-error">*</span></label>
              <select className="select select-bordered w-full" value={form.benefit_type_id} onChange={(e) => onBenefitChange(e.target.value)} disabled={!form.employee_id}>
                <option value="">Select Benefit Type</option>
                {benefits.map((b) => {
                  const isActive = b.status === 'Active';
                  const hasBalance = parseFloat(b.balance) > 0;
                  const disabled = !isActive || !hasBalance;
                  return (
                    <option key={`benefit-${b.id}`} value={isActive ? b.id.toString() : ''} disabled={disabled}>
                      {b.benefit_type}{!isActive ? ` (${b.status})` : hasBalance ? '' : ' (No balance)'}
                    </option>
                  );
                })}
              </select>

              {selectedBenefit && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-medium text-base-content/70">Entitled</p>
                      <p className="text-lg font-bold text-primary">RM {parseFloat(selectedBenefit.entitled).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-base-content/70">Balance</p>
                      <p className={`text-lg font-bold ${parseFloat(selectedBenefit.balance) <= 0 ? 'text-error' : 'text-success'}`}>RM {parseFloat(selectedBenefit.balance).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-base-content/70">Yearly Claimed</p>
                      <p className="text-lg font-bold text-secondary">RM {parseFloat(selectedBenefit.claimed || '0').toFixed(2)}</p>
                    </div>
                  </div>
                  {selectedBenefit.description && (
                    <div className="flex items-start gap-2 p-3 bg-base-100 rounded border border-base-300">
                      <Info className="h-5 w-5 text-info mt-0.5" />
                      <p className="text-sm text-base-content/80">{selectedBenefit.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Amount & Date */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount (RM) <span className="text-error">*</span></label>
                <input
                  type="number"
                  className={`input input-bordered w-full ${amountError ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  step="0.01"
                  min="0"
                  disabled={!selectedBenefit}
                />
                {amountError && <p className="mt-1 text-sm text-error">{amountError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Date <span className="text-error">*</span></label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.claim_date}
                  onChange={(e) => setForm((f) => ({ ...f, claim_date: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Remark */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Remarks</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Enter any additional details (optional)"
                value={form.employee_remark}
                onChange={(e) => setForm((f) => ({ ...f, employee_remark: e.target.value }))}
              />
            </div>

            {/* Attachment */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
              <div
                className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragActive(false);
                  if (e.dataTransfer.files?.length) setSelectedFile(e.dataTransfer.files[0]);
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-base-content/70">{isDragActive ? 'Drop file here to upload' : 'Upload supporting document (optional)'}</p>
                  {!selectedFile && (
                    <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
                      + Add
                      <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setSelectedFile(f);
                      }} />
                    </label>
                  )}
                </div>
                {selectedFile && (
                  <div className="bg-base-100 px-3 py-1 rounded-md border border-base-300 inline-flex items-center">
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                    <button type="button" className="ml-2 text-error hover:text-error-content" onClick={() => setSelectedFile(null)}>
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} onClick={submitOnBehalf} disabled={isSubmitting}>
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
