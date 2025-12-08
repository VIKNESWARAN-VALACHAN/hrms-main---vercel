// // app/admins/claims/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { api } from '../../utils/api';
// import { API_BASE_URL } from '../../config';
// import axios, { AxiosProgressEvent } from 'axios';
// import { useTheme } from '../../components/ThemeProvider';
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

// interface BenefitType {
//   id: number;
//   name: string;
// }

// // Add to your existing interfaces
// interface ClaimAttachment {
//   id: number;
//   file_name: string;
//   file_url: string;
//   mime_type: string;
//   uploaded_at: string;
//   s3_key: string;
//   uploaded_by_name: string;
//   file_size?: number;
// }

// interface ClaimDetails {
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   company_name: string;
//   benefit_type_id: number;
//   benefit_type_name: string;
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
//   attachments?: ClaimAttachment[];
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
// const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();


// // Add to your existing state declarations
// const [claimAttachments, setClaimAttachments] = useState<ClaimAttachment[]>([]);
// const [loadingAttachments, setLoadingAttachments] = useState(false);
// const [downloadingAttachment, setDownloadingAttachment] = useState<number | null>(null);

//   // Report export state
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [reportFilters, setReportFilters] = useState<ReportFilter>({
//     startDate: '',
//     endDate: '',
//     status: 'all',
//     company_id: '',
//     employee_id: '',
//     benefit_type_id: ''
//   });
//   const [generatingReport, setGeneratingReport] = useState(false);
//   const [benefitTypes, setBenefitTypes] = useState<BenefitType[]>([]);

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
 
//   const [amountError, setAmountError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingCompanies, setLoadingCompanies] = useState(false);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   // Replace the single file state with array
// const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
// const [isDragActive, setIsDragActive] = useState(false);
// // Add these to your existing state declarations
// const [currentPage, setCurrentPage] = useState(1);
// const [itemsPerPage, setItemsPerPage] = useState(10);
// const [totalClaims, setTotalClaims] = useState(0);
// const [totalPages, setTotalPages] = useState(0);
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

// // File validation
// const validateFile = (file: File): string | null => {
//   const validTypes = [
//     'application/pdf', 
//     'image/jpeg', 
//     'image/jpg', 
//     'image/png', 
//     'application/msword', 
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ];
//   const maxSize = 10 * 1024 * 1024; // 10MB

//   if (!validTypes.includes(file.type)) {
//     return 'Please select a valid file type (PDF, JPG, PNG, DOC, DOCX)';
//   }

//   if (file.size > maxSize) {
//     return 'File size must be less than 10MB';
//   }

//   return null;
// };

// const handleFileSelect = (files: FileList | File[]) => {
//   const fileArray = Array.from(files);
//   const validFiles: File[] = [];
//   const errors: string[] = [];

//   fileArray.forEach(file => {
//     const validationError = validateFile(file);
//     if (validationError) {
//       errors.push(`${file.name}: ${validationError}`);
//     } else {
//       validFiles.push(file);
//     }
//   });

//   if (errors.length > 0) {
//     toast.error(`Some files were rejected:\n${errors.join('\n')}`);
//   }

//   if (validFiles.length > 0) {
//     setSelectedFiles(prev => [...prev, ...validFiles]);
//   }
// };

// const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   setIsDragActive(false);
  
//   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//     handleFileSelect(e.dataTransfer.files);
//   }
// };

// const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files && e.target.files.length > 0) {
//     handleFileSelect(e.target.files);
//   }
// };

// const removeFile = (index: number) => {
//   setSelectedFiles(prev => prev.filter((_, i) => i !== index));
// };

// const clearAllFiles = () => {
//   setSelectedFiles([]);
// };

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

// const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const value = e.target.value;
//   setSearch(value);
  
//   if (searchTimeout) {
//     clearTimeout(searchTimeout);
//   }
  
//   const timeout = setTimeout(() => {
//     setCurrentPage(1); // Reset to first page when searching
//     fetchClaims(1, itemsPerPage);
//   }, 500);
  
//   setSearchTimeout(timeout);
// };


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
//      fetchClaims(1, itemsPerPage);
//     fetchSummary();
//     loadUserData();
//     loadCompanies();
//     fetchBenefitTypes();
//   }, []);

//   useEffect(() => {
//   return () => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
//   };
// }, [searchTimeout]);

//   useEffect(() => {
//     // lock body scroll when any modal open (nice UX)
//     const lock = showModal || showActionModal || showCreateModal || isReportModalOpen;
//     document.body.classList.toggle('overflow-hidden', lock);
//     return () => document.body.classList.remove('overflow-hidden');
//   }, [showModal, showActionModal, showCreateModal, isReportModalOpen]);

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


//   const getFileIcon = (fileName: string, mimeType: string) => {
//   const extension = fileName.split('.').pop()?.toLowerCase();
  
//   if (mimeType?.startsWith('image/')) return '🖼️';
//   if (mimeType === 'application/pdf') return '📄';
//   if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') || extension === 'xls' || extension === 'xlsx') return '📊';
//   if (mimeType?.includes('word') || extension === 'doc' || extension === 'docx') return '📝';
//   if (mimeType?.includes('zip') || extension === 'zip' || extension === 'rar') return '📦';
  
//   return '📎';
// };

// const fetchClaims = async (page = 1, limit = itemsPerPage) => {
//   try {
//     setLoadingClaims(true);
    
//     // Build query with pagination parameters
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...(search && { search: search })
//     });

//     console.log('📡 Fetching claims with params:', params.toString());

//     const response = await fetch(`${API_BASE_URL}/api/claims?${params.toString()}`);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Handle both response formats
//     if (data.claims && typeof data.total === 'number') {
//       // New paginated response format
//       setClaims(data.claims);
//       setFilteredClaims(data.claims);
//       setTotalClaims(data.total);
//       setTotalPages(data.totalPages || Math.ceil(data.total / limit));
//       setCurrentPage(data.page || page);
      
//       console.log('✅ Paginated response:', {
//         claimsCount: data.claims.length,
//         total: data.total,
//         page: data.page || page,
//         totalPages: data.totalPages || Math.ceil(data.total / limit)
//       });
//     } else if (Array.isArray(data)) {
//       // Fallback: API returned plain array (non-paginated)
//       const allClaims = data;
//       const startIndex = (page - 1) * limit;
//       const endIndex = startIndex + limit;
//       const paginatedClaims = allClaims.slice(startIndex, endIndex);
      
//       setClaims(paginatedClaims);
//       setFilteredClaims(paginatedClaims);
//       setTotalClaims(allClaims.length);
//       setTotalPages(Math.ceil(allClaims.length / limit));
//       setCurrentPage(page);
      
//       console.log('🔧 Client-side pagination applied:', {
//         allClaims: allClaims.length,
//         showing: paginatedClaims.length,
//         total: allClaims.length,
//         page: page,
//         totalPages: Math.ceil(allClaims.length / limit)
//       });
//     } else {
//       throw new Error('Invalid API response format');
//     }
//   } catch (err: any) {
//     console.error('❌ Error fetching claims:', err);
//     toast.error(err.message || 'Failed to load claims.');
//     setClaims([]);
//     setFilteredClaims([]);
//     setTotalClaims(0);
//     setTotalPages(0);
//     setCurrentPage(1);
//   } finally {
//     setLoadingClaims(false);
//   }
// };

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

//   const fetchBenefitTypes = async () => {
//     try {
//       const data = await api.get(`${API_BASE_URL}/api/benefit-types`);
//       setBenefitTypes(data);
//     } catch (err: any) {
//       console.error('Error fetching benefit types:', err);
//       toast.error('Failed to load benefit types for filters.');
//     }
//   };

// const canUserApproveClaim = async (claim: ClaimRow): Promise<boolean> => {
//   if (!user) return false;
  
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${claim.id}&user_id=${user.id}`
//     );
    
//     if (!response.ok) return false;
    
//     const data = await response.json();
    
//     // Debug logging
//     console.log('🔐 Authorization check for claim:', claim.id, {
//       canApprove: data.canApprove,
//       reason: data.reason,
//       currentLevel: claim.current_approval_level,
//       userLevel: data.approvalLevel,
//       isAdmin: data.isAdmin
//     });
    
//     return data.canApprove;
//   } catch (error) {
//     console.error('Error checking approval authorization:', error);
//     return false;
//   }
// };

//   /* =========================== Export Report Functions =========================== */
//   const handleExportReport = async () => {
//     setGeneratingReport(true);
    
//     try {
//       // Build query parameters
//       const params = new URLSearchParams();
      
//       if (reportFilters.startDate) params.append('startDate', reportFilters.startDate);
//       if (reportFilters.endDate) params.append('endDate', reportFilters.endDate);
//       if (reportFilters.status && reportFilters.status !== 'all') params.append('status', reportFilters.status);
//       if (reportFilters.company_id) params.append('company_id', reportFilters.company_id);
//       if (reportFilters.employee_id) params.append('employee_id', reportFilters.employee_id);
//       if (reportFilters.benefit_type_id) params.append('benefit_type_id', reportFilters.benefit_type_id);

//       const response = await fetch(`${API_BASE_URL}/api/claims/claims-report?${params.toString()}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch report data');
//       }

//       const result: ClaimsReportResponse = await response.json();
      
//       if (result.success && result.data.length > 0) {
//         // Convert to CSV
//         const csvData = convertClaimsToCSV(result.data);
        
//         // Download CSV file
//         downloadCSV(csvData, `claims-report-${new Date().toISOString().split('T')[0]}.csv`);
        
//         toast.success(`Report exported successfully! ${result.total} records found.`);
//         setIsReportModalOpen(false);
//       } else {
//         toast.error('No data found for the selected filters.');
//       }
      
//     } catch (error: any) {
//       console.error('Error exporting report:', error);
//       toast.error(error.message || 'Failed to export report');
//     } finally {
//       setGeneratingReport(false);
//     }
//   };

//   // Helper function to convert claims data to CSV
//   const convertClaimsToCSV = (data: ClaimRow[]): string => {
//     const headers = [
//       'Claim ID',
//       'Employee ID',
//       'Employee Name',
//       'Company',
//       'Benefit Type',
//       'Claim Date',
//       'Amount (RM)',
//       'Approved Amount (RM)',
//       'Status',
//       'Employee Remark',
//       'Admin Remark',
//       'Current Approval Level',
//       'Final Approval Level',
//       'Created Date',
//       'Updated Date'
//     ];

//     const csvRows = data.map(claim => [
//       claim.id,
//       claim.employee_id,
//       claim.employee_name,
//       claim.company_name,
//       claim.benefit_type,
//       new Date(claim.claim_date).toLocaleDateString(),
//       parseFloat(claim.amount?.toString() || '0').toFixed(2),
//       claim.approved_amount ? parseFloat(claim.approved_amount.toString()).toFixed(2) : '0.00',
//       claim.status,
//       `"${(claim.employee_remark || '').replace(/"/g, '""')}"`,
//       `"${(claim.admin_remark || '').replace(/"/g, '""')}"`,
//       claim.current_approval_level,
//       claim.final_approval_level,
//       new Date(claim.created_at).toLocaleString(),
//       claim.updated_at ? new Date(claim.updated_at).toLocaleString() : 'N/A'
//     ]);

//     return [headers, ...csvRows]
//       .map(row => row.join(','))
//       .join('\n');
//   };

//   // Helper function to download CSV
//   const downloadCSV = (csvData: string, filename: string) => {
//     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
    
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
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
//         await fetchClaimAttachments(claim.id);
//       } else {
//         toast.error('Invalid claim details response from API.');
//         console.error('API response for claim details was unexpected:', response);
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch claim details for modal:', error);
//       toast.error(error.message || 'Failed to fetch claim details for view.');
//     }
//   };

//   const fetchClaimAttachments = async (claimId: number) => {
//   try {
//     setLoadingAttachments(true);
//     const response = await fetch(`${API_BASE_URL}/api/claims/${claimId}/attachments`);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const attachments = await response.json();
//     setClaimAttachments(attachments);
    
//     console.log(`✅ Loaded ${attachments.length} attachments for claim ${claimId}`);
//   } catch (error: any) {
//     console.error('❌ Error fetching attachments:', error);
//     // Don't show toast for attachments - it's optional data
//     setClaimAttachments([]);
//   } finally {
//     setLoadingAttachments(false);
//   }
// };

// const downloadAttachment = async (attachment: ClaimAttachment) => {
//   try {
//     setDownloadingAttachment(attachment.id);
//     console.log(`📥 Downloading attachment: ${attachment.file_name}`);
    
//     // 🚨 FIXED: Use the correct endpoint that redirects to S3 presigned URL
//     const downloadUrl = `${API_BASE_URL}/api/claims/attachments/${attachment.id}/download`;
    
//     // Open in new tab - this will follow the redirect to the S3 presigned URL
//     window.open(downloadUrl, '_blank');
    
//     toast.success(`Downloading ${attachment.file_name}`);
    
//   } catch (error: any) {
//     console.error('❌ Download error:', error);
//     toast.error(`Failed to download: ${attachment.file_name}`);
//   } finally {
//     setDownloadingAttachment(null);
//   }
// };
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
//     setSelectedFiles([]);
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


// const submitOnBehalf = async () => {
//   if (!user) {
//     toast.error('User session expired. Please login again.');
//     return;
//   }
//   if (!form.company_id || !form.department_id || !form.employee_id) {
//     toast.error('Please select company, department and employee.');
//     return;
//   }
//   if (!form.benefit_type_id) {
//     toast.error('Please select a benefit type.');
//     return;
//   }
//   const amount = parseFloat(form.amount);
//   if (Number.isNaN(amount) || amount <= 0) {
//     toast.error('Please enter a valid amount greater than 0.');
//     return;
//   }
//   if (amountError) {
//     toast.error(amountError);
//     return;
//   }

//   setIsSubmitting(true);
//   try {
//     const payload = {
//       employee_id: parseInt(form.employee_id, 10),
//       benefit_type_id: parseInt(form.benefit_type_id, 10),
//       claim_date: form.claim_date,
//       amount,
//       employee_remark: form.employee_remark,
//       submitted_by_admin_id: user.id,
//     };

//     console.log('📤 Submitting claim:', payload);

//     const res = await fetch(`${API_BASE_URL}/api/claims`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       throw new Error(errorData.message || 'Failed to submit claim');
//     }

//     const claimResponse = await res.json();
//     const claim_id = claimResponse.claim_id;
//     console.log('✅ Claim created with ID:', claim_id);

//     // 🚨 UPDATED: Upload multiple attachments
//     if (selectedFiles && selectedFiles.length > 0 && claim_id) {
//       console.log('📎 Starting multiple file upload...', {
//         claim_id,
//         file_count: selectedFiles.length,
//         files: selectedFiles.map(f => ({
//           name: f.name,
//           size: f.size,
//           type: f.type
//         }))
//       });

//       // Upload files sequentially to avoid overwhelming the server
//       const uploadResults = [];
      
//       for (let i = 0; i < selectedFiles.length; i++) {
//         const file = selectedFiles[i];
//         console.log(`🔄 Uploading file ${i + 1}/${selectedFiles.length}: ${file.name}`);
        
//         const formData = new FormData();
//         formData.append('attachment', file);
//         formData.append('uploaded_by', user.id.toString());

//         try {
//           const uploadRes = await fetch(
//             `${API_BASE_URL}/api/claims/${claim_id}/attachments`,
//             {
//               method: 'POST',
//               body: formData,
//             }
//           );

//           if (!uploadRes.ok) {
//             const uploadError = await uploadRes.json().catch(() => ({}));
//             console.error(`❌ Upload failed for ${file.name}:`, uploadError);
//             // Continue with other files even if one fails
//             uploadResults.push({
//               file: file.name,
//               success: false,
//               error: uploadError.error || 'Upload failed'
//             });
//           } else {
//             const uploadResult = await uploadRes.json();
//             console.log(`✅ Upload successful for ${file.name}:`, uploadResult);
//             uploadResults.push({
//               file: file.name,
//               success: true,
//               result: uploadResult
//             });
//           }
//         } catch (uploadError: any) {
//           console.error(`❌ Upload error for ${file.name}:`, uploadError);
//           uploadResults.push({
//             file: file.name,
//             success: false,
//             error: uploadError.message || 'Upload error'
//           });
//         }
//       }

//       // Show upload summary
//       const successfulUploads = uploadResults.filter(r => r.success);
//       const failedUploads = uploadResults.filter(r => !r.success);
      
//       if (failedUploads.length === 0) {
//         toast.success(`Claim submitted with ${successfulUploads.length} attachment(s)`);
//       } else if (successfulUploads.length > 0) {
//         toast.success(`Claim submitted with ${successfulUploads.length} attachment(s), ${failedUploads.length} failed`);
//       } else {
//         toast.error('Claim submitted but all attachments failed to upload');
//       }
//     } else {
//       toast.success('Claim submitted successfully');
//     }

//     setShowCreateModal(false);
//     await fetchClaims();
//   } catch (err: any) {
//     console.error('❌ Error submitting claim:', err);
//     toast.error(err?.message || 'Error submitting claim');
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// const CompactPagination = () => {
//   // Show pagination if we have more than 1 page OR if we have any records at all
//   if (totalPages <= 1 && totalClaims <= itemsPerPage) return null;

//   return (
//     <div className="flex items-center gap-3 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
//       <div className="flex items-center gap-2">
//         <span className="text-gray-600">Page</span>
//         <span className="font-semibold text-gray-900">{currentPage}</span>
//         <span className="text-gray-600">of</span>
//         <span className="font-semibold text-gray-900">{totalPages}</span>
//       </div>
      
//       <div className="w-px h-6 bg-gray-300"></div>

//       <select
//         value={itemsPerPage}
//         onChange={(e) => {
//           const newLimit = parseInt(e.target.value);
//           setItemsPerPage(newLimit);
//           setCurrentPage(1);
//           fetchClaims(1, newLimit);
//         }}
//         className="select select-bordered select-sm w-32"
//       >
//         <option value="10">10 per page</option>
//         <option value="25">25 per page</option>
//         <option value="50">50 per page</option>
//         <option value="100">100 per page</option>
//       </select>

//       <div className="w-px h-6 bg-gray-300"></div>

//       <div className="flex gap-1">
//         <button
//           onClick={() => fetchClaims(currentPage - 1, itemsPerPage)}
//           disabled={currentPage === 1}
//           className="btn btn-sm btn-ghost btn-square disabled:bg-gray-100 disabled:text-gray-400"
//           title="Previous page"
//         >
//           ‹
//         </button>
//         <button
//           onClick={() => fetchClaims(currentPage + 1, itemsPerPage)}
//           disabled={currentPage === totalPages}
//           className="btn btn-sm btn-ghost btn-square disabled:bg-gray-100 disabled:text-gray-400"
//           title="Next page"
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );
// };

// const ClaimTableRow = ({ claim }: { claim: ClaimRow }) => {
//   const [canApprove, setCanApprove] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(false);
//   const [authReason, setAuthReason] = useState('');

//   useEffect(() => {
//     const checkAuthorization = async () => {
//       if ((claim.status === 'Pending' || claim.status === 'Under Review') && user) {
//         setCheckingAuth(true);
//         try {
//           // Use the centralized canUserApproveClaim function
//           const authorized = await canUserApproveClaim(claim);
//           setCanApprove(authorized);
          
//           // For debugging, you can also call the API directly to get the reason
//           const response = await fetch(
//             `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${claim.id}&user_id=${user.id}`
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setAuthReason(data.reason || '');
//           }
//         } catch (error) {
//           console.error('Authorization check failed:', error);
//           setCanApprove(false);
//           setAuthReason('Check failed');
//         } finally {
//           setCheckingAuth(false);
//         }
//       } else {
//         setCanApprove(false);
//         setAuthReason('');
//       }
//     };

//     checkAuthorization();
//   }, [claim, user]);

//   return (
//     <tr key={claim.id} className="border-b border-gray-200 hover:bg-gray-50">
//       <td className="p-4 whitespace-nowrap">{claim.employee_name}</td>
//       <td className="p-4 whitespace-nowrap">{claim.company_name}</td>
//       <td className="p-4 whitespace-nowrap">{claim.benefit_type}</td>
//       <td className="p-4 whitespace-nowrap font-medium">{formatCurrency(claim.amount)}</td>
//       <td className="p-4 whitespace-nowrap">{new Date(claim.claim_date).toLocaleDateString()}</td>
//       <td className="p-4 whitespace-nowrap">
//         <span
//           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//             claim.status === 'Pending' || claim.status === 'Under Review'
//               ? 'bg-yellow-100 text-yellow-800'
//               : claim.status === 'Approved'
//               ? 'bg-green-100 text-green-800'
//               : 'bg-red-100 text-red-800'
//           }`}
//         >
//           {claim.status}
//         </span>
//         <div className="text-xs text-gray-500 mt-1">
//           Level {claim.current_approval_level} of {claim.final_approval_level}
//         </div>
//         {authReason && (
//           <div className="text-xs text-gray-400 mt-1">{authReason}</div>
//         )}
//       </td>
//       <td className="p-4 whitespace-nowrap flex gap-2">
//         <button
//           className="btn btn-sm btn-info text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
//           onClick={() => handleViewDetails(claim)}
//         >
//           View
//         </button>
        
//         {checkingAuth ? (
//           <div className="flex items-center gap-1">
//             <span className="loading loading-spinner loading-xs"></span>
//             <span className="text-xs text-gray-500">Checking...</span>
//           </div>
//         ) : (
//           (claim.status === 'Pending' || claim.status === 'Under Review') && 
//           canApprove && (
//             <>
//               <button
//                 className="btn btn-sm btn-success text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
//                 onClick={() => openActionModal(claim, 'approve')}
//               >
//                 Approve
//               </button>
//               <button
//                 className="btn btn-sm btn-error text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
//                 onClick={() => openActionModal(claim, 'reject')}
//               >
//                 Reject
//               </button>
//             </>
//           )
//         )}
//       </td>
//     </tr>
//   );
// };

//   /* =========================== UI =========================== */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-inter">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Claim Benefit Dashboard</h1>
//           <div className="flex gap-2">
//             <button 
//               onClick={() => setIsReportModalOpen(true)}
//                className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"//className="btn btn-outline btn-primary btn-sm"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//               Export Report
//             </button>
//             <button 
//              className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"//className="btn btn-primary btn-sm" 
//             onClick={openCreateModal}>
//               <Plus className="w-4 h-4 mr-1" /> New Claim (On Behalf)
//             </button>
//           </div>
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
// <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
//   <h2 className="text-xl font-semibold text-gray-700">All Employee Claims</h2>
  
//   <div className="flex flex-col sm:flex-row items-center gap-4">
//     <input
//       type="text"
//       className="input input-bordered w-full sm:w-72"
//       placeholder="Search by employee, company or benefit"
//       value={search}
//       onChange={handleSearchChange}
//     />
    
//     <CompactPagination />
//   </div>
// </div>

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
// <tbody>
//   {filteredClaims.length === 0 ? (
//     <tr>
//       <td colSpan={7} className="text-center text-gray-500 py-6">
//         No claims found.
//       </td>
//     </tr>
//   ) : (
//     filteredClaims.map((claim) => (
//       <ClaimTableRow key={claim.id} claim={claim} />
//     ))
//   )}
// </tbody>


//             </table>
//           </div>
//         )}
//       </div>

      

//       {/* ======================== Export Report Modal ======================== */}
//       {isReportModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
//           <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold">Export Claims Report</h3>
//               <button 
//                 onClick={() => setIsReportModalOpen(false)} 
//                 className="btn btn-sm btn-circle btn-ghost"
//               >
//                 <XCircle size={24} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Start Date</span>
//                   </label>
//                   <input
//                     type="date"
//                     className="input input-bordered w-full"
//                     value={reportFilters.startDate}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       startDate: e.target.value
//                     }))}
//                   />
//                 </div>
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">End Date</span>
//                   </label>
//                   <input
//                     type="date"
//                     className="input input-bordered w-full"
//                     value={reportFilters.endDate}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       endDate: e.target.value
//                     }))}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Status</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={reportFilters.status}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       status: e.target.value
//                     }))}
//                   >
//                     <option value="all">All Status</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Company</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={reportFilters.company_id}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       company_id: e.target.value
//                     }))}
//                   >
//                     <option value="">All Companies</option>
//                     {companies.map(company => (
//                       <option key={company.id} value={company.id}>
//                         {company.company_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Benefit Type</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={reportFilters.benefit_type_id}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       benefit_type_id: e.target.value
//                     }))}
//                   >
//                     <option value="">All Benefit Types</option>
//                     {benefitTypes.map(benefit => (
//                       <option key={benefit.id} value={benefit.id}>
//                         {benefit.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Employee ID</span>
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="Employee ID (optional)"
//                     className="input input-bordered w-full"
//                     value={reportFilters.employee_id}
//                     onChange={(e) => setReportFilters((prev: ReportFilter) => ({
//                       ...prev,
//                       employee_id: e.target.value
//                     }))}
//                   />
//                 </div>
//               </div>

//               <div className="alert alert-info mt-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span>Report will be exported in CSV format with all claim details.</span>
//               </div>
//             </div>

//             <div className="modal-action mt-6">
//               <button
//                 onClick={() => setIsReportModalOpen(false)}
//                 className="btn btn-ghost"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleExportReport}
//                 className="btn btn-primary"
//                 disabled={generatingReport}
//               >
//                 {generatingReport ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm"></span>
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                     Export Report
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================== View Details Modal ======================== */}
//       {showModal && selectedClaim && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
//           <div className="bg-base-100 rounded-lg max-w-4xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Claim Details - #{selectedClaim.id}</h2>
//             <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
//               <XCircle size={24} />
//             </button>

//             {/* Claim Basic Information */}
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

//             {/* Attachments Section */}
//             <div className="mb-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Supporting Documents</h3>
//               {loadingAttachments ? (
//                 <div className="text-center py-4">
//                   <span className="loading loading-spinner loading-sm"></span>
//                   <span className="ml-2 text-gray-600">Loading attachments...</span>
//                 </div>
//               ) : claimAttachments.length > 0 ? (
//                 <div className="space-y-2">
//                   {claimAttachments.map((attachment) => (
//                     <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-center space-x-3">
//                         <div className={`p-2 rounded-lg ${
//                           attachment.mime_type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
//                           attachment.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' :
//                           attachment.mime_type?.startsWith('application/') ? 'bg-purple-100 text-purple-600' :
//                           'bg-gray-100 text-gray-600'
//                         }`}>
//                           {attachment.mime_type?.startsWith('image/') ? '🖼️' : 
//                           attachment.mime_type === 'application/pdf' ? '📄' : 
//                           '📎'}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800 text-sm">{attachment.file_name}</p>
//                           <p className="text-xs text-gray-500">
//                             Uploaded by {attachment.uploaded_by_name} • 
//                             {new Date(attachment.uploaded_at).toLocaleDateString()} • 
//                             {attachment.file_size ? ` ${(attachment.file_size / 1024).toFixed(1)} KB` : ''}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => downloadAttachment(attachment)}
//                         disabled={downloadingAttachment === attachment.id}
//                         className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
//                       >
//                         {downloadingAttachment === attachment.id ? (
//                           <>
//                             <span className="loading loading-spinner loading-xs"></span>
//                             Downloading...
//                           </>
//                         ) : (
//                           <>
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                             </svg>
//                             Download
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//                   </svg>
//                   <p className="text-gray-500 text-sm">No supporting documents attached</p>
//                 </div>
//               )}
//             </div>

//             {/* Approval Flow Status */}
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

//             {/* Approval History Log */}
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
// {/* Multiple Attachment Upload */}
// <div className="mt-6">
//   <label className="block text-sm font-medium text-base-content mb-2">
//     Attachments (Optional)
//   </label>
//   <div
//     className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${
//       isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'
//     }`}
//     onDragOver={(e) => {
//       e.preventDefault();
//       setIsDragActive(true);
//     }}
//     onDragLeave={() => setIsDragActive(false)}
//     onDrop={handleFileDrop}
//   >
//     <div className="flex justify-between items-center mb-2">
//       <p className="text-sm text-base-content/70">
//         {isDragActive ? 'Drop files here to upload' : 'Upload supporting documents (optional)'}
//       </p>
//       <div className="flex gap-2">
//         {selectedFiles.length > 0 && (
//           <button
//             type="button"
//             onClick={clearAllFiles}
//             className="btn btn-sm btn-outline btn-error"
//           >
//             Clear All
//           </button>
//         )}
//         <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
//           + Add Files
//           <input
//             type="file"
//             hidden
//             multiple
//             accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//             onChange={handleFileInputChange}
//           />
//         </label>
//       </div>
//     </div>
    
//     {/* File List */}
//     {selectedFiles.length > 0 && (
//       <div className="space-y-2 mt-4">
//         {selectedFiles.map((file, index) => (
//           <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-md border border-base-300">
//             <div className="flex items-center space-x-3">
//               <div className={`p-2 rounded-lg ${
//                 file.type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
//                 file.type === 'application/pdf' ? 'bg-red-100 text-red-600' :
//                 'bg-gray-100 text-gray-600'
//               }`}>
//                 {file.type?.startsWith('image/') ? '🖼️' : 
//                  file.type === 'application/pdf' ? '📄' : 
//                  '📎'}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-800">{file.name}</p>
//                 <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
//               onClick={() => removeFile(index)}
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//         <div className="text-xs text-gray-500 text-center">
//           {selectedFiles.length} file(s) selected
//         </div>
//       </div>
//     )}

//     <p className="text-xs text-gray-500 mt-2">
//       Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
//     </p>
//   </div>
// </div>

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

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../components/ThemeProvider';
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
  Filter,
  ChevronDown,
  Search,
  X,
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

interface ClaimAttachment {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  uploaded_at: string;
  s3_key: string;
  uploaded_by_name: string;
  file_size?: number;
}

interface ClaimDetails {
  id: number;
  employee_id: number;
  employee_name: string;
  company_name: string;
  benefit_type_id: number;
  benefit_type_name: string;
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
  attachments?: ClaimAttachment[];
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

/* =========================== Filter Types =========================== */
interface Filters {
  company_id: string[];
  benefit_type: string[];
  status: string[];
  date_range: {
    start: string;
    end: string;
  };
  amount_range: {
    min: string;
    max: string;
  };
  employee_name: string;
  search: string;
}

/* =========================== Professional MultiSelectFilter Component =========================== */
const ProfessionalMultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (val: string) => val,
  theme = 'light',
  isOpen,
  onToggle
}: { 
  name: keyof Filters;
  value: string[];
  options: (string | undefined | null)[];
  onChange: (name: keyof Filters, value: string[]) => void;
  placeholder: string;
  displayTransform?: (value: string) => string;
  theme?: 'light' | 'dark';
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validOptions = options.filter((option): option is string => 
    option !== undefined && option !== null && option !== ''
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return validOptions;
    return validOptions.filter(option => 
      displayTransform(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [validOptions, searchTerm, displayTransform]);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(name, newValue);
  };

  const handleSelectAll = () => {
    onChange(name, [...validOptions]);
  };

  const handleClear = () => {
    onChange(name, []);
  };

  const selectedPercentage = validOptions.length > 0 
    ? Math.round((value.length / validOptions.length) * 100) 
    : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="form-control w-full relative" ref={dropdownRef}>
      {/* Professional Trigger Button */}
      <label className="label pb-2">
        <span className={`label-text font-medium text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          {placeholder}
        </span>
      </label>
      
      <button
        onClick={onToggle}
        className={`group relative flex items-center justify-between w-full p-3 text-left transition-all duration-200 border-2 rounded-lg ${
          theme === 'light' 
            ? 'bg-white border-slate-200 hover:border-slate-300' 
            : 'bg-slate-800 border-slate-600 hover:border-slate-500'
        } ${
          value.length > 0 
            ? 'border-blue-500 bg-blue-50 shadow-sm' 
            : ''
        }`}
      >
        <div className="flex flex-col items-start flex-1 min-w-0">
          {value.length === 0 ? (
            <span className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              All {placeholder}
            </span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map(val => (
                <span 
                  key={val} 
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded border border-blue-200"
                >
                  {displayTransform(val)}
                </span>
              ))}
              {value.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded border border-slate-300">
                  +{value.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {value.length > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-blue-600">{value.length}</span>
              <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${selectedPercentage}%` }}
                />
              </div>
            </div>
          )}
          <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-lg shadow-xl max-h-96 overflow-hidden">
          {/* Search and Stats Bar */}
          <div className="p-3 border-b bg-slate-50">
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className="input input-bordered w-full pl-10 bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* Progress and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">{value.length}</span> of{' '}
                  <span className="font-semibold">{validOptions.length}</span> selected
                </div>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors"
                  disabled={value.length === validOptions.length}
                >
                  Select All
                </button>
                {value.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                  <Search size={20} className="text-slate-400" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-1 text-sm">No options found</h4>
                <p className="text-slate-500 text-xs">
                  {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all duration-200 ${
                      value.includes(option)
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-800 text-sm">
                        {displayTransform(option)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const { theme } = useTheme();
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [allClaims, setAllClaims] = useState<ClaimRow[]>([]);
  const [summaries, setSummaries] = useState<BenefitSummaryCardData[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
  const [claimAttachments, setClaimAttachments] = useState<ClaimAttachment[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [downloadingAttachment, setDownloadingAttachment] = useState<number | null>(null);

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
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalClaims, setTotalClaims] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters state
  const [filters, setFilters] = useState<Filters>({
    company_id: [],
    benefit_type: [],
    status: [],
    date_range: {
      start: '',
      end: ''
    },
    amount_range: {
      min: '',
      max: ''
    },
    employee_name: '',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Track which dropdowns are open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  /* =========================== Filter Functions =========================== */
  const handleFilterChange = useCallback((name: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      date_range: { start, end }
    }));
    setCurrentPage(1);
  };

  const handleAmountRangeChange = (min: string, max: string) => {
    setFilters(prev => ({
      ...prev,
      amount_range: { min, max }
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      company_id: [],
      benefit_type: [],
      status: [],
      date_range: {
        start: '',
        end: ''
      },
      amount_range: {
        min: '',
        max: ''
      },
      employee_name: '',
      search: ''
    });
    setCurrentPage(1);
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.company_id.length > 0) count += filters.company_id.length;
    if (filters.benefit_type.length > 0) count += filters.benefit_type.length;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.date_range.start || filters.date_range.end) count += 1;
    if (filters.amount_range.min || filters.amount_range.max) count += 1;
    if (filters.employee_name) count += 1;
    if (filters.search) count += 1;
    return count;
  }, [filters]);

  // Filter options extraction
  const filterOptions = useMemo(() => {
    return {
      companies: [...new Set(allClaims.map(claim => claim.company_name).filter(Boolean))] as string[],
      benefitTypes: [...new Set(allClaims.map(claim => claim.benefit_type).filter(Boolean))] as string[],
      statuses: [...new Set(allClaims.map(claim => claim.status).filter(Boolean))] as string[],
    };
  }, [allClaims]);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return allClaims.filter(claim => {
      // Search filter
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !searchTerm || (
        (claim.employee_name || '').toLowerCase().includes(searchTerm) ||
        (claim.company_name || '').toLowerCase().includes(searchTerm) ||
        (claim.benefit_type || '').toLowerCase().includes(searchTerm) ||
        (claim.employee_remark || '').toLowerCase().includes(searchTerm) ||
        (claim.id?.toString() || '').includes(searchTerm)
      );

      // Company filter
      const matchesCompany = filters.company_id.length === 0 || 
        (claim.company_name && filters.company_id.includes(claim.company_name));

      // Benefit type filter
      const matchesBenefitType = filters.benefit_type.length === 0 || 
        (claim.benefit_type && filters.benefit_type.includes(claim.benefit_type));

      // Status filter
      const matchesStatus = filters.status.length === 0 || 
        (claim.status && filters.status.includes(claim.status));

      // Date range filter
      const matchesDateRange = () => {
        if (!filters.date_range.start && !filters.date_range.end) return true;
        
        const claimDate = new Date(claim.claim_date);
        const startDate = filters.date_range.start ? new Date(filters.date_range.start) : null;
        const endDate = filters.date_range.end ? new Date(filters.date_range.end) : null;
        
        if (startDate && endDate) {
          return claimDate >= startDate && claimDate <= endDate;
        } else if (startDate) {
          return claimDate >= startDate;
        } else if (endDate) {
          return claimDate <= endDate;
        }
        return true;
      };

      // Amount range filter
      const matchesAmountRange = () => {
        if (!filters.amount_range.min && !filters.amount_range.max) return true;
        
        const amount = parseFloat(claim.amount || '0');
        const min = filters.amount_range.min ? parseFloat(filters.amount_range.min) : 0;
        const max = filters.amount_range.max ? parseFloat(filters.amount_range.max) : Infinity;
        
        return amount >= min && amount <= max;
      };

      // Employee name filter
      const matchesEmployeeName = !filters.employee_name || 
        (claim.employee_name && claim.employee_name.toLowerCase().includes(filters.employee_name.toLowerCase()));

      return matchesSearch && matchesCompany && matchesBenefitType && 
             matchesStatus && matchesDateRange() && matchesAmountRange() && matchesEmployeeName;
    });
  }, [allClaims, filters]);

  // Update pagination based on filtered claims
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setClaims(filteredClaims.slice(startIndex, endIndex));
    setTotalClaims(filteredClaims.length);
    setTotalPages(Math.ceil(filteredClaims.length / itemsPerPage));
  }, [filteredClaims, currentPage, itemsPerPage]);

  /* =========================== File Validation =========================== */
  const validateFile = (file: File): string | null => {
    const validTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid file type (PDF, JPG, PNG, DOC, DOCX)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error(`Some files were rejected:\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange('search', value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
    
    setSearchTimeout(timeout);
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
    fetchAllClaims();
    fetchSummary();
    loadUserData();
    loadCompanies();
    fetchBenefitTypes();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    // lock body scroll when any modal open (nice UX)
    const lock = showModal || showActionModal || showCreateModal || isReportModalOpen;
    document.body.classList.toggle('overflow-hidden', lock);
    return () => document.body.classList.remove('overflow-hidden');
  }, [showModal, showActionModal, showCreateModal, isReportModalOpen]);

  /* =========================== Data fetchers =========================== */
  const fetchAllClaims = async () => {
    try {
      setLoadingClaims(true);
      const response = await fetch(`${API_BASE_URL}/api/claims`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle both response formats
      if (Array.isArray(data)) {
        setAllClaims(data);
        setClaims(data.slice(0, itemsPerPage));
        setTotalClaims(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else if (data.claims && Array.isArray(data.claims)) {
        setAllClaims(data.claims);
        setClaims(data.claims.slice(0, itemsPerPage));
        setTotalClaims(data.claims.length);
        setTotalPages(Math.ceil(data.claims.length / itemsPerPage));
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err: any) {
      console.error('❌ Error fetching claims:', err);
      toast.error(err.message || 'Failed to load claims.');
      setAllClaims([]);
      setClaims([]);
      setTotalClaims(0);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoadingClaims(false);
    }
  };

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

  const getFileIcon = (fileName: string, mimeType: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (mimeType?.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') || extension === 'xls' || extension === 'xlsx') return '📊';
    if (mimeType?.includes('word') || extension === 'doc' || extension === 'docx') return '📝';
    if (mimeType?.includes('zip') || extension === 'zip' || extension === 'rar') return '📦';
    
    return '📎';
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

  const canUserApproveClaim = async (claim: ClaimRow): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${claim.id}&user_id=${user.id}`
      );
      
      if (!response.ok) return false;
      
      const data = await response.json();
      
      // Debug logging
      console.log('🔐 Authorization check for claim:', claim.id, {
        canApprove: data.canApprove,
        reason: data.reason,
        currentLevel: claim.current_approval_level,
        userLevel: data.approvalLevel,
        isAdmin: data.isAdmin
      });
      
      return data.canApprove;
    } catch (error) {
      console.error('Error checking approval authorization:', error);
      return false;
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
        await fetchClaimAttachments(claim.id);
      } else {
        toast.error('Invalid claim details response from API.');
        console.error('API response for claim details was unexpected:', response);
      }
    } catch (error: any) {
      console.error('Failed to fetch claim details for modal:', error);
      toast.error(error.message || 'Failed to fetch claim details for view.');
    }
  };

  const fetchClaimAttachments = async (claimId: number) => {
    try {
      setLoadingAttachments(true);
      const response = await fetch(`${API_BASE_URL}/api/claims/${claimId}/attachments`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const attachments = await response.json();
      setClaimAttachments(attachments);
      
      console.log(`✅ Loaded ${attachments.length} attachments for claim ${claimId}`);
    } catch (error: any) {
      console.error('❌ Error fetching attachments:', error);
      // Don't show toast for attachments - it's optional data
      setClaimAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const downloadAttachment = async (attachment: ClaimAttachment) => {
    try {
      setDownloadingAttachment(attachment.id);
      console.log(`📥 Downloading attachment: ${attachment.file_name}`);
      
      // 🚨 FIXED: Use the correct endpoint that redirects to S3 presigned URL
      const downloadUrl = `${API_BASE_URL}/api/claims/attachments/${attachment.id}/download`;
      
      // Open in new tab - this will follow the redirect to the S3 presigned URL
      window.open(downloadUrl, '_blank');
      
      toast.success(`Downloading ${attachment.file_name}`);
      
    } catch (error: any) {
      console.error('❌ Download error:', error);
      toast.error(`Failed to download: ${attachment.file_name}`);
    } finally {
      setDownloadingAttachment(null);
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
      await fetchAllClaims();
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
      await fetchAllClaims();
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject claim.');
    }
  };

  /* =========================== New Claim (On Behalf) =========================== */
  const openCreateModal = async () => {
    setShowCreateModal(true);
    setAmountError('');
    setSelectedFiles([]);
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

      console.log('📤 Submitting claim:', payload);

      const res = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit claim');
      }

      const claimResponse = await res.json();
      const claim_id = claimResponse.claim_id;
      console.log('✅ Claim created with ID:', claim_id);

      // 🚨 UPDATED: Upload multiple attachments
      if (selectedFiles && selectedFiles.length > 0 && claim_id) {
        console.log('📎 Starting multiple file upload...', {
          claim_id,
          file_count: selectedFiles.length,
          files: selectedFiles.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
          }))
        });

        // Upload files sequentially to avoid overwhelming the server
        const uploadResults = [];
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          console.log(`🔄 Uploading file ${i + 1}/${selectedFiles.length}: ${file.name}`);
          
          const formData = new FormData();
          formData.append('attachment', file);
          formData.append('uploaded_by', user.id.toString());

          try {
            const uploadRes = await fetch(
              `${API_BASE_URL}/api/claims/${claim_id}/attachments`,
              {
                method: 'POST',
                body: formData,
              }
            );

            if (!uploadRes.ok) {
              const uploadError = await uploadRes.json().catch(() => ({}));
              console.error(`❌ Upload failed for ${file.name}:`, uploadError);
              // Continue with other files even if one fails
              uploadResults.push({
                file: file.name,
                success: false,
                error: uploadError.error || 'Upload failed'
              });
            } else {
              const uploadResult = await uploadRes.json();
              console.log(`✅ Upload successful for ${file.name}:`, uploadResult);
              uploadResults.push({
                file: file.name,
                success: true,
                result: uploadResult
              });
            }
          } catch (uploadError: any) {
            console.error(`❌ Upload error for ${file.name}:`, uploadError);
            uploadResults.push({
              file: file.name,
              success: false,
              error: uploadError.message || 'Upload error'
            });
          }
        }

        // Show upload summary
        const successfulUploads = uploadResults.filter(r => r.success);
        const failedUploads = uploadResults.filter(r => !r.success);
        
        if (failedUploads.length === 0) {
          toast.success(`Claim submitted with ${successfulUploads.length} attachment(s)`);
        } else if (successfulUploads.length > 0) {
          toast.success(`Claim submitted with ${successfulUploads.length} attachment(s), ${failedUploads.length} failed`);
        } else {
          toast.error('Claim submitted but all attachments failed to upload');
        }
      } else {
        toast.success('Claim submitted successfully');
      }

      setShowCreateModal(false);
      await fetchAllClaims();
    } catch (err: any) {
      console.error('❌ Error submitting claim:', err);
      toast.error(err?.message || 'Error submitting claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CompactPagination = () => {
    // Show pagination if we have more than 1 page OR if we have any records at all
    if (totalPages <= 1 && totalClaims <= itemsPerPage) return null;

    return (
      <div className="flex items-center gap-3 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Page</span>
          <span className="font-semibold text-gray-900">{currentPage}</span>
          <span className="text-gray-600">of</span>
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </div>
        
        <div className="w-px h-6 bg-gray-300"></div>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            const newLimit = parseInt(e.target.value);
            setItemsPerPage(newLimit);
            setCurrentPage(1);
          }}
          className="select select-bordered select-sm w-32"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>

        <div className="w-px h-6 bg-gray-300"></div>

        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost btn-square disabled:bg-gray-100 disabled:text-gray-400"
            title="Previous page"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost btn-square disabled:bg-gray-100 disabled:text-gray-400"
            title="Next page"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  const ClaimTableRow = ({ claim }: { claim: ClaimRow }) => {
    const [canApprove, setCanApprove] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(false);
    const [authReason, setAuthReason] = useState('');

    useEffect(() => {
      const checkAuthorization = async () => {
        if ((claim.status === 'Pending' || claim.status === 'Under Review') && user) {
          setCheckingAuth(true);
          try {
            // Use the centralized canUserApproveClaim function
            const authorized = await canUserApproveClaim(claim);
            setCanApprove(authorized);
            
            // For debugging, you can also call the API directly to get the reason
            const response = await fetch(
              `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${claim.id}&user_id=${user.id}`
            );
            if (response.ok) {
              const data = await response.json();
              setAuthReason(data.reason || '');
            }
          } catch (error) {
            console.error('Authorization check failed:', error);
            setCanApprove(false);
            setAuthReason('Check failed');
          } finally {
            setCheckingAuth(false);
          }
        } else {
          setCanApprove(false);
          setAuthReason('');
        }
      };

      checkAuthorization();
    }, [claim, user]);

    return (
      <tr key={claim.id} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="p-4 whitespace-nowrap">{claim.employee_name}</td>
        <td className="p-4 whitespace-nowrap">{claim.company_name}</td>
        <td className="p-4 whitespace-nowrap">{claim.benefit_type}</td>
        <td className="p-4 whitespace-nowrap font-medium">{formatCurrency(claim.amount)}</td>
        <td className="p-4 whitespace-nowrap">{new Date(claim.claim_date).toLocaleDateString()}</td>
        <td className="p-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              claim.status === 'Pending' || claim.status === 'Under Review'
                ? 'bg-yellow-100 text-yellow-800'
                : claim.status === 'Approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {claim.status}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            Level {claim.current_approval_level} of {claim.final_approval_level}
          </div>
          {authReason && (
            <div className="text-xs text-gray-400 mt-1">{authReason}</div>
          )}
        </td>
        <td className="p-4 whitespace-nowrap flex gap-2">
          <button
            className="btn btn-sm btn-info text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
            onClick={() => handleViewDetails(claim)}
          >
            View
          </button>
          
          {checkingAuth ? (
            <div className="flex items-center gap-1">
              <span className="loading loading-spinner loading-xs"></span>
              <span className="text-xs text-gray-500">Checking...</span>
            </div>
          ) : (
            (claim.status === 'Pending' || claim.status === 'Under Review') && 
            canApprove && (
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
            )
          )}
        </td>
      </tr>
    );
  };

  /* =========================== UI =========================== */
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Claim Benefit Dashboard</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Report
            </button>
            <button 
              className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
              onClick={openCreateModal}
            >
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

        {/* Table Title and Search - Standardized Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Employee Claims</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-72">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Search claims by employee, company, benefit..."
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-outline'} flex items-center gap-2`}
              >
                <Filter size={16} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <CompactPagination />
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-blue-800">Active Filters:</span>
              {filters.company_id.map(company => (
                <span key={company} className="inline-flex items-center px-3 py-1 text-sm bg-white text-blue-800 rounded-full border border-blue-200">
                  Company: {company}
                  <button 
                    onClick={() => handleFilterChange('company_id', filters.company_id.filter(c => c !== company))}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-blue-100 rounded-full"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {filters.benefit_type.map(benefit => (
                <span key={benefit} className="inline-flex items-center px-3 py-1 text-sm bg-white text-green-800 rounded-full border border-green-200">
                  Benefit: {benefit}
                  <button 
                    onClick={() => handleFilterChange('benefit_type', filters.benefit_type.filter(b => b !== benefit))}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-green-100 rounded-full"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {filters.status.map(status => (
                <span key={status} className="inline-flex items-center px-3 py-1 text-sm bg-white text-yellow-800 rounded-full border border-yellow-200">
                  Status: {status}
                  <button 
                    onClick={() => handleFilterChange('status', filters.status.filter(s => s !== status))}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-yellow-100 rounded-full"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {(filters.date_range.start || filters.date_range.end) && (
                <span className="inline-flex items-center px-3 py-1 text-sm bg-white text-purple-800 rounded-full border border-purple-200">
                  Date: {filters.date_range.start || 'Start'} - {filters.date_range.end || 'End'}
                  <button 
                    onClick={() => handleDateRangeChange('', '')}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-purple-100 rounded-full"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {(filters.amount_range.min || filters.amount_range.max) && (
                <span className="inline-flex items-center px-3 py-1 text-sm bg-white text-red-800 rounded-full border border-red-200">
                  Amount: RM{filters.amount_range.min || '0'} - RM{filters.amount_range.max || '∞'}
                  <button 
                    onClick={() => handleAmountRangeChange('', '')}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-red-100 rounded-full"
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button 
                onClick={resetFilters}
                className="ml-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full border border-gray-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {isFilterOpen && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
                <p className="text-sm text-gray-500 mt-1">Refine your claims with multiple criteria</p>
              </div>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="btn btn-sm btn-ghost hover:bg-gray-100 rounded-lg"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filters Grid */}
            <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProfessionalMultiSelectFilter
                name="company_id"
                value={filters.company_id}
                options={filterOptions.companies}
                onChange={handleFilterChange}
                placeholder="Select Company"
                theme={theme}
                isOpen={openDropdown === 'company'}
                onToggle={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
              />

              <ProfessionalMultiSelectFilter
                name="benefit_type"
                value={filters.benefit_type}
                options={filterOptions.benefitTypes}
                onChange={handleFilterChange}
                placeholder="Select Benefit Type"
                theme={theme}
                isOpen={openDropdown === 'benefit_type'}
                onToggle={() => setOpenDropdown(openDropdown === 'benefit_type' ? null : 'benefit_type')}
              />

              <ProfessionalMultiSelectFilter
                name="status"
                value={filters.status}
                options={filterOptions.statuses}
                onChange={handleFilterChange}
                placeholder="Select Status"
                theme={theme}
                isOpen={openDropdown === 'status'}
                onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              />
            </div>

              {/* Range Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Date Range */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block mb-3">
                    <span className="label-text font-semibold text-gray-700">Date Range</span>
                    <span className="text-xs text-gray-500 ml-2">Select start and end dates</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">From</label>
                      <input
                        type="date"
                        className="input input-bordered w-full text-sm"
                        value={filters.date_range.start}
                        onChange={(e) => handleDateRangeChange(e.target.value, filters.date_range.end)}
                        max={filters.date_range.end || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">To</label>
                      <input
                        type="date"
                        className="input input-bordered w-full text-sm"
                        value={filters.date_range.end}
                        onChange={(e) => handleDateRangeChange(filters.date_range.start, e.target.value)}
                        min={filters.date_range.start}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Range */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block mb-3">
                    <span className="label-text font-semibold text-gray-700">Amount Range</span>
                    <span className="text-xs text-gray-500 ml-2">In Malaysian Ringgit (RM)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Minimum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                        <input
                          type="number"
                          className="input input-bordered w-full text-sm pl-10"
                          placeholder="0.00"
                          value={filters.amount_range.min}
                          onChange={(e) => handleAmountRangeChange(e.target.value, filters.amount_range.max)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Maximum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                        <input
                          type="number"
                          className="input input-bordered w-full text-sm pl-10"
                          placeholder="10000.00"
                          value={filters.amount_range.max}
                          onChange={(e) => handleAmountRangeChange(filters.amount_range.min, e.target.value)}
                          min={filters.amount_range.min || "0"}
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Showing </span>
                  <span className="font-semibold text-gray-800">{filteredClaims.length}</span>
                  <span className="text-gray-600"> of {allClaims.length} claims</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="btn btn-outline btn-error hover:bg-red-50 hover:text-red-600 border-red-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-blue-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.company_id?.length > 0 || filters.benefit_type?.length > 0 || 
              filters.status?.length > 0 || filters.date_range.start || 
              filters.date_range.end || filters.amount_range.min || 
              filters.amount_range.max) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 text-sm">Active Filters</h4>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.company_id?.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Company: {filters.company_id.length} selected
                    </span>
                  )}
                  {filters.benefit_type?.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Benefit Types: {filters.benefit_type.length} selected
                    </span>
                  )}
                  {filters.status?.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Statuses: {filters.status.length} selected
                    </span>
                  )}
                  {(filters.date_range.start || filters.date_range.end) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Date: {filters.date_range.start || '...'} to {filters.date_range.end || '...'}
                    </span>
                  )}
                  {(filters.amount_range.min || filters.amount_range.max) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      Amount: RM{filters.amount_range.min || '0'} - RM{filters.amount_range.max || '∞'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalClaims)} of {totalClaims} claims
          {activeFilterCount > 0 && ' (filtered)'}
        </div>

        {/* Claims Table */}
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
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-6">
                      No claims found.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <ClaimTableRow key={claim.id} claim={claim} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="btn-group">
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                «
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
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              <button 
                className="btn btn-sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
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
          <div className="bg-base-100 rounded-lg max-w-4xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Claim Details - #{selectedClaim.id}</h2>
            <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
              <XCircle size={24} />
            </button>

            {/* Claim Basic Information */}
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

            {/* Attachments Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-t pt-4">Supporting Documents</h3>
              {loadingAttachments ? (
                <div className="text-center py-4">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2 text-gray-600">Loading attachments...</span>
                </div>
              ) : claimAttachments.length > 0 ? (
                <div className="space-y-2">
                  {claimAttachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          attachment.mime_type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
                          attachment.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' :
                          attachment.mime_type?.startsWith('application/') ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {attachment.mime_type?.startsWith('image/') ? '🖼️' : 
                          attachment.mime_type === 'application/pdf' ? '📄' : 
                          '📎'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{attachment.file_name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {attachment.uploaded_by_name} • 
                            {new Date(attachment.uploaded_at).toLocaleDateString()} • 
                            {attachment.file_size ? ` ${(attachment.file_size / 1024).toFixed(1)} KB` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadAttachment(attachment)}
                        disabled={downloadingAttachment === attachment.id}
                        className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
                      >
                        {downloadingAttachment === attachment.id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No supporting documents attached</p>
                </div>
              )}
            </div>

            {/* Approval Flow Status */}
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

            {/* Approval History Log */}
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

            {/* Multiple Attachment Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-base-content mb-2">
                Attachments (Optional)
              </label>
              <div
                className={`border border-dashed rounded-lg p-4 transition-all duration-200 ${
                  isDragActive ? 'bg-blue-100 border-blue-400' : 'border-base-300 bg-base-200'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleFileDrop}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-base-content/70">
                    {isDragActive ? 'Drop files here to upload' : 'Upload supporting documents (optional)'}
                  </p>
                  <div className="flex gap-2">
                    {selectedFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Clear All
                      </button>
                    )}
                    <label className="btn btn-sm btn-outline btn-primary cursor-pointer">
                      + Add Files
                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </div>
                </div>
                
                {/* File List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-md border border-base-300">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            file.type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
                            file.type === 'application/pdf' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {file.type?.startsWith('image/') ? '🖼️' : 
                            file.type === 'application/pdf' ? '📄' : 
                            '📎'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 text-center">
                      {selectedFiles.length} file(s) selected
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
                </p>
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
