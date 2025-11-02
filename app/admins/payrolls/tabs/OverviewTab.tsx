// // "use client";

// // import React, { useEffect, useState, useCallback } from "react";
// // import axios from "axios";
// // import { API_BASE_URL } from "../../../config";
// // import { useTheme } from '../../../components/ThemeProvider';
// // import { PieChart, BarChart, LineChart } from "../../../components/payroll/ChartComponents";
// // import { format, parseISO, subMonths } from 'date-fns';
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";


// // interface PayslipItem {
// //   id: number;
// //   payroll_id: number;
// //   label: string;
// //   amount: string;
// //   type: string;
// //   item_order: number | null;
// //   created_at: string;
// // }

// // interface EmployerContribution {
// //   id: number;
// //   payroll_id: number;
// //   label: string;
// //   amount: string;
// //   type: string;
// //   created_at: string;
// // }

// // interface OverviewTabProps {
// //   filters: {
// //     fromDate: string;
// //     toDate: string;
// //     company: string;
// //     status: string;
// //   };
// //   searchTerm: string;
// // }

// // interface PayrollRow {
// //   payroll_id: number;
// //   employee_name: string;
// //   period_year: number;
// //   period_month: number;
// //   status_code: string;
// //   gross_salary: string;
// //   net_salary: string;
// //   total_deduction: string;
// //   company_name: string;
// //   department_name: string;
// // }

// // interface PayrollDetails {
// //   id: number;
// //   payroll_id: number;
// //   period_year: number;
// //   period_month: number;
// //   employee_id: number;
// //   basic_salary: string;
// //   total_allowance: string;
// //   gross_salary: string;
// //   total_deduction: string;
// //   net_salary: string;
// //   epf_employee: string;
// //   epf_employer: string;
// //   socso_employee: string;
// //   socso_employer: string;
// //   eis_employee: string;
// //   eis_employer: string;
// //   pcb: string;
// //   status_code: string;
// //   generated_by: number | null;
// //   generated_at: string;
// //   paid_at: string | null;
// //   created_at: string;
// //   updated_at: string;
// //   remarks: string | null;
// //   employee_name: string;
// //   payslip_items: PayslipItem[];
// //   employer_contributions: EmployerContribution[];
// // }

// // interface MonthlySummary {
// //   month: string;
// //   totalGross: number;
// //   totalNet: number;
// //   totalDeductions: number;
// //   employeeCount: number;
// // }

// // interface DepartmentBreakdown {
// //   department: string;
// //   totalGross: number;
// //   employeeCount: number;
// //   avgSalary: number;
// // }

// // interface CompanyComparison {
// //   company: string;
// //   totalGross: number;
// //   employeeCount: number;
// // }

// // interface PayrollTrend {
// //   month: string;
// //   payrollCost: number;
// //   employerContributions: number;
// //   totalCost: number;
// // }

// // const OverviewTab: React.FC<OverviewTabProps> = ({ filters, searchTerm }) => {
// //   const { theme } = useTheme();
// //   const [payrolls, setPayrolls] = useState<PayrollRow[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [dateRange, setDateRange] = useState<[Date, Date]>([
// //     subMonths(new Date(), 12),
// //     new Date()
// //   ]);
// //   const [startDate, endDate] = dateRange;
// //   const [activeReportTab, setActiveReportTab] = useState<string>("summary");
// //   const [selectedPayroll, setSelectedPayroll] = useState<PayrollRow | null>(null);
// //   const [payrollDetails, setPayrollDetails] = useState<PayrollDetails | null>(null);
// //   const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
// //   const [departmentBreakdown, setDepartmentBreakdown] = useState<DepartmentBreakdown[]>([]);
// //   const [companyComparison, setCompanyComparison] = useState<CompanyComparison[]>([]);
// //   const [payrollTrends, setPayrollTrends] = useState<PayrollTrend[]>([]);


// //   const generateReports =  useCallback((data: PayrollRow[]) => {//(data: PayrollRow[]) => {
// //     const monthlyData: Record<string, MonthlySummary> = {};
// //     const departmentData: Record<string, DepartmentBreakdown> = {};
// //     const companyData: Record<string, CompanyComparison> = {};
// //     const trendData: Record<string, PayrollTrend> = {};

// //     data.forEach(payroll => {
// //       const monthKey = `${payroll.period_year}-${String(payroll.period_month).padStart(2, '0')}`;
// //       const monthName = `${getMonthName(payroll.period_month)} ${payroll.period_year}`;
      
// //       // Monthly Summary
// //       if (!monthlyData[monthKey]) {
// //         monthlyData[monthKey] = {
// //           month: monthName,
// //           totalGross: 0,
// //           totalNet: 0,
// //           totalDeductions: 0,
// //           employeeCount: 0
// //         };
// //       }
      
// //       monthlyData[monthKey].totalGross += parseFloat(payroll.gross_salary) || 0;
// //       monthlyData[monthKey].totalNet += parseFloat(payroll.net_salary) || 0;
// //       monthlyData[monthKey].totalDeductions += parseFloat(payroll.total_deduction) || 0;
// //       monthlyData[monthKey].employeeCount += 1;
      
// //       // Department Breakdown
// //       const department = payroll.department_name || 'Unassigned';
// //       if (!departmentData[department]) {
// //         departmentData[department] = {
// //           department,
// //           totalGross: 0,
// //           employeeCount: 0,
// //           avgSalary: 0
// //         };
// //       }
      
// //       departmentData[department].totalGross += parseFloat(payroll.gross_salary) || 0;
// //       departmentData[department].employeeCount += 1;
      
// //       // Company Comparison
// //       const company = payroll.company_name || 'Unassigned';
// //       if (!companyData[company]) {
// //         companyData[company] = {
// //           company,
// //           totalGross: 0,
// //           employeeCount: 0
// //         };
// //       }
      
// //       companyData[company].totalGross += parseFloat(payroll.gross_salary) || 0;
// //       companyData[company].employeeCount += 1;
      
// //       // Payroll Trends
// //       if (!trendData[monthKey]) {
// //         trendData[monthKey] = {
// //           month: monthName,
// //           payrollCost: 0,
// //           employerContributions: 0,
// //           totalCost: 0
// //         };
// //       }
      
// //       trendData[monthKey].payrollCost += parseFloat(payroll.net_salary) || 0;
// //       const employerContributions = parseFloat(payroll.gross_salary) * 0.13 || 0;
// //       trendData[monthKey].employerContributions += employerContributions;
// //       trendData[monthKey].totalCost += (parseFloat(payroll.net_salary) + employerContributions) || 0;
// //     });

// //     // Calculate averages
// //     Object.keys(departmentData).forEach(dept => {
// //       departmentData[dept].avgSalary = departmentData[dept].totalGross / departmentData[dept].employeeCount;
// //     });

// //     setMonthlySummaries(
// //       Object.values(monthlyData)
// //         .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
// //     );
    
// //     setDepartmentBreakdown(
// //       Object.values(departmentData)
// //         .sort((a, b) => b.totalGross - a.totalGross)
// //     );
    
// //     setCompanyComparison(
// //       Object.values(companyData)
// //         .sort((a, b) => b.totalGross - a.totalGross)
// //     );
    
// //     setPayrollTrends(
// //       Object.values(trendData)
// //         .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
// //     );
// //    }, []);//};

// //      const fetchPayrolls = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const params: any = {
// //         all_data: true,
// //         from_date: format(startDate, 'yyyy-MM-dd'),
// //         to_date: format(endDate, 'yyyy-MM-dd')
// //       };

// //       if (searchTerm) params.employee_name = searchTerm;
// //       if (filters.company) params.company_id = filters.company;
// //       if (filters.status) params.status = filters.status;

// //       const res = await axios.get(`${API_BASE_URL}/api/payroll/adjustments`, { params });

// //       const flattened: PayrollRow[] = (res.data?.data ?? []).map((item: any) => ({
// //         payroll_id: Number(item?.payroll?.payroll_id),
// //         employee_name: String(item?.payroll?.employee_name ?? ''),
// //         period_year: Number(item?.payroll?.period_year),
// //         period_month: Number(item?.payroll?.period_month),
// //         status_code: String(item?.payroll?.status_code ?? ''),
// //         gross_salary: String(item?.payroll?.gross_salary ?? '0'),
// //         net_salary: String(item?.payroll?.net_salary ?? '0'),
// //         total_deduction: String(item?.payroll?.total_deduction ?? '0'),
// //         company_name: String(item?.payroll?.company_name ?? ''),
// //         department_name: String(item?.payroll?.department_name ?? '')
// //       }));

// //       setPayrolls(flattened);
// //       generateReports(flattened);
// //     } catch (error) {
// //       console.error("Error fetching payrolls:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [startDate, endDate, filters, searchTerm, generateReports]);//}, [startDate, endDate, filters, searchTerm]);


// //   const getMonthName = (month?: number) => {
// //     const m = Number(month);
// //     if (!Number.isInteger(m) || m < 1 || m > 12) return 'Invalid';
// //     return format(new Date(2000, m - 1, 1), 'MMM');
// //   };

// //   const formatCurrency = (amount: number) => {
// //     return new Intl.NumberFormat('en-US', {
// //       style: 'currency',
// //       currency: 'USD',
// //       minimumFractionDigits: 0,
// //       maximumFractionDigits: 0
// //     }).format(amount);
// //   };

// //   const formatCurrencyPrecise = (amount: number) => {
// //     return new Intl.NumberFormat('en-US', {
// //       style: 'currency',
// //       currency: 'USD',
// //       minimumFractionDigits: 2,
// //       maximumFractionDigits: 2
// //     }).format(amount);
// //   };

// //   const fetchPayrollDetails = async (id: number) => {
// //     try {
// //       const res = await axios.get<PayrollDetails>(`${API_BASE_URL}/api/payroll/${id}`);
// //       setPayrollDetails(res.data);
// //     } catch (error) {
// //       console.error("Error fetching payroll details:", error);
// //     }
// //   };

// //   const handleViewClick = (payroll: PayrollRow) => {
// //     if (!payroll.payroll_id) {
// //       console.error("Invalid payroll ID");
// //       return;
// //     }
// //     setSelectedPayroll(payroll);
// //     fetchPayrollDetails(payroll.payroll_id);
// //   };

// //   const normalizeStatus = (s: unknown): string => {
// //   const v = (typeof s === 'string' ? s : '').trim();
// //   if (!v) return 'unknown';
// //   return v.toLowerCase();
// // };

// // const getStatusBadgeColor = (rawStatus?: string) => {
// //   const status = normalizeStatus(rawStatus);

// //   switch (status) {
// //     case 'approved':
// //     case 'paid':
// //       return theme === 'light'
// //         ? 'bg-green-100 text-green-800'
// //         : 'bg-green-900 text-green-200';
// //     case 'pending':
// //     case 'adjust':
// //       return theme === 'light'
// //         ? 'bg-yellow-100 text-yellow-800'
// //         : 'bg-yellow-900 text-yellow-200';
// //     case 'rejected':
// //       return theme === 'light'
// //         ? 'bg-red-100 text-red-800'
// //         : 'bg-red-900 text-red-200';
// //     case 'draft':
// //       return theme === 'light'
// //         ? 'bg-gray-100 text-gray-800'
// //         : 'bg-gray-700 text-gray-200';
// //     default:
// //       return theme === 'light'
// //         ? 'bg-gray-100 text-gray-800'
// //         : 'bg-gray-700 text-gray-200';
// //   }
// // };

// //   useEffect(() => {
// //     fetchPayrolls();
// //   }, [fetchPayrolls]);

// //   return (
// //     <div className="space-y-6">
// //       {/* Filters and Date Range */}
// //       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //         <div className="card-body">
// //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //             <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
// //               Payroll Overview
// //             </h2>
            
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className="flex items-center gap-2">
// //                 <label className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Date Range:</label>
// //                 <DatePicker
// //                   selectsRange={true}
// //                   startDate={startDate}
// //                   endDate={endDate}
// //                   onChange={(update) => setDateRange(update as [Date, Date])}
// //                   isClearable={false}
// //                   className={`input input-bordered ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}
// //                 />
// //               </div>
              
// //               <button 
// //                 onClick={() => fetchPayrolls()}
// //                 className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-accent'}`}
// //               >
// //                 Apply Filters
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Analytics Dashboard */}
// //       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //         <div className="card-body">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
// //               Payroll Analytics
// //             </h2>
// //             <div className="tabs tabs-boxed bg-transparent">
// //               <button 
// //                 className={`tab ${activeReportTab === 'summary' ? 'tab-active' : ''}`}
// //                 onClick={() => setActiveReportTab('summary')}
// //               >
// //                 Summary
// //               </button>
// //               <button 
// //                 className={`tab ${activeReportTab === 'department' ? 'tab-active' : ''}`}
// //                 onClick={() => setActiveReportTab('department')}
// //               >
// //                 Department
// //               </button>
// //               <button 
// //                 className={`tab ${activeReportTab === 'company' ? 'tab-active' : ''}`}
// //                 onClick={() => setActiveReportTab('company')}
// //               >
// //                 Company
// //               </button>
// //             </div>
// //           </div>
          
// //           {loading ? (
// //             <div className="flex justify-center items-center h-32">
// //               <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
// //             </div>
// //           ) : (
// //             <>
// //               {activeReportTab === 'summary' && (
// //                 <div className="space-y-6">
// //                   {/* Key Metrics */}
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                     <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
// //                       <div className="card-body">
// //                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
// //                           Total Payroll Cost
// //                         </h3>
// //                         <p className="text-3xl font-bold">
// //                           {formatCurrency(monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0))}
// //                         </p>
// //                         <p className="text-sm opacity-75">
// //                           {payrolls.length} employees
// //                         </p>
// //                       </div>
// //                     </div>
                    
// //                     <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'}`}>
// //                       <div className="card-body">
// //                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-200'}`}>
// //                           Average Salary
// //                         </h3>
// //                         <p className="text-3xl font-bold">
// //                           {payrolls.length > 0 ? 
// //                             formatCurrencyPrecise(monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0) / payrolls.length) : 
// //                             '$0.00'}
// //                         </p>
// //                         <p className="text-sm opacity-75">
// //                           Gross monthly average
// //                         </p>
// //                       </div>
// //                     </div>
                    
// //                     <div className={`card ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900'}`}>
// //                       <div className="card-body">
// //                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}`}>
// //                           Total Deductions
// //                         </h3>
// //                         <p className="text-3xl font-bold">
// //                           {formatCurrency(monthlySummaries.reduce((sum, m) => sum + m.totalDeductions, 0))}
// //                         </p>
// //                         <p className="text-sm opacity-75">
// //                           {((monthlySummaries.reduce((sum, m) => sum + m.totalDeductions, 0) / 
// //                             monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0)) * 100 || 0).toFixed(1)}% of gross
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Monthly Payroll Trend */}
// //                   <div className={`card p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
// //                     <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
// //                       Monthly Payroll Trend
// //                     </h3>
// //                     <div className="h-80">
// //                       {monthlySummaries.length > 0 ? (
// //                         <LineChart
// //                           data={monthlySummaries.map(m => ({
// //                             name: m.month,
// //                             totalGross: m.totalGross,
// //                             totalNet: m.totalNet
// //                           }))}
// //                           xKey="name"
// //                           yKeys={['totalGross', 'totalNet']}
// //                           colors={['#3b82f6', '#10b981']}
// //                           theme={theme}
// //                         />
// //                       ) : (
// //                         <div className="flex items-center justify-center h-full text-gray-500">
// //                           No trend data available
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {activeReportTab === 'department' && (
// //                 <div className="space-y-6">
// //                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //                     <div className="lg:col-span-2">
// //                       <div className="overflow-x-auto">
// //                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
// //                           <thead>
// //                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Department</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {departmentBreakdown.map((dept, index) => (
// //                               <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td>{dept.department}</td>
// //                                 <td className="text-right">{dept.employeeCount}</td>
// //                                 <td className="text-right font-medium">{formatCurrency(dept.totalGross)}</td>
// //                                 <td className="text-right">{formatCurrencyPrecise(dept.avgSalary)}</td>
// //                                 <td className="text-right">
// //                                   {((dept.totalGross / departmentBreakdown.reduce((sum, d) => sum + d.totalGross, 0)) * 100).toFixed(1)}%
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
                    
// //                     <div className="h-96">
// //                       <PieChart
// //                         data={departmentBreakdown
// //                           .filter(d => d.totalGross > 0)
// //                           .map(d => ({
// //                             name: d.department,
// //                             value: d.totalGross
// //                           }))
// //                         }
// //                         theme={theme}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {activeReportTab === 'company' && (
// //                 <div className="space-y-6">
// //                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //                     <div className="lg:col-span-2">
// //                       <div className="overflow-x-auto">
// //                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
// //                           <thead>
// //                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Company</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
// //                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {companyComparison.map((company, index) => (
// //                               <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td>{company.company}</td>
// //                                 <td className="text-right">{company.employeeCount}</td>
// //                                 <td className="text-right font-medium">{formatCurrency(company.totalGross)}</td>
// //                                 <td className="text-right">
// //                                   {formatCurrencyPrecise(company.totalGross / company.employeeCount)}
// //                                 </td>
// //                                 <td className="text-right">
// //                                   {((company.totalGross / companyComparison.reduce((sum, c) => sum + c.totalGross, 0)) * 100).toFixed(1)}%
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
                    
// //                     <div className="h-96">
// //                       <BarChart
// //                         data={companyComparison.map(c => ({
// //                           name: c.company,
// //                           value: c.totalGross
// //                         }))}
// //                         theme={theme}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* Payroll Overview Table - Grouped by Month */}
// //       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //         <div className="card-body">
// //           <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
// //             Payroll Details by Month
// //           </h2>
// //           {loading ? (
// //             <div className="flex justify-center items-center h-32">
// //               <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
// //             </div>
// //           ) : payrolls.length === 0 ? (
// //             <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               <p>No payrolls found matching your criteria</p>
// //             </div>
// //           ) : (
// //             <div className="space-y-6">
// //               {Object.entries(
// //                 payrolls.reduce((acc, payroll) => {
// //                   const monthKey = `${payroll.period_year}-${String(payroll.period_month).padStart(2, '0')}`;
// //                   if (!acc[monthKey]) {
// //                     acc[monthKey] = [];
// //                   }
// //                   acc[monthKey].push(payroll);
// //                   return acc;
// //                 }, {} as Record<string, PayrollRow[]>)
// //               )
// //               .sort(([a], [b]) => b.localeCompare(a))
// //               .map(([monthKey, monthPayrolls]) => {
// //                 const [year, month] = monthKey.split('-');
// //                 const monthName = getMonthName(parseInt(month));
// //                 const totalGross = monthPayrolls.reduce((sum, p) => sum + parseFloat(p.gross_salary), 0);
// //                 const totalNet = monthPayrolls.reduce((sum, p) => sum + parseFloat(p.net_salary), 0);

// //                 return (
// //                   <div key={monthKey} className={`collapse collapse-plus ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
// //                     <input type="radio" name="payroll-months" /> 
// //                     <div className="collapse-title text-xl font-medium">
// //                       <div className="flex justify-between items-center">
// //                         <span>{monthName} {year}</span>
// //                         <span className="text-sm">
// //                           {monthPayrolls.length} employees • 
// //                           Gross: {formatCurrency(totalGross)} • 
// //                           Net: {formatCurrency(totalNet)}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="collapse-content">
// //                       <div className="overflow-x-auto">
// //                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
// //                           <thead>
// //                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>ID</th>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Employee</th>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Status</th>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Gross</th>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Net</th>
// //                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Action</th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {monthPayrolls.map((row, idx) => (
// //                               <tr 
// //                                 key={`${monthKey}-${row.payroll_id || idx}`}
// //                                 className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}
// //                               >
// //                                 <td>{row.payroll_id}</td>
// //                                 <td>{row.employee_name}</td>
// //                                 <td>
// //                                   <span className={`badge ${getStatusBadgeColor(row.status_code)}`}>
// //                                     {row.status_code}
// //                                   </span>
// //                                 </td>
// //                                 <td>${parseFloat(row.gross_salary).toFixed(2)}</td>
// //                                 <td>${parseFloat(row.net_salary).toFixed(2)}</td>
// //                                 <td>
// //                                   <button
// //                                     className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white`}
// //                                     onClick={() => handleViewClick(row)}
// //                                   >
// //                                     View
// //                                   </button>
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Payroll Details Modal */}
// //       {selectedPayroll && (
// //         <div className="modal modal-open">
// //           <div className={`modal-box max-w-6xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //             <div className="flex justify-between items-start">
// //               <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
// //                 Payroll Details - {selectedPayroll.employee_name} ({selectedPayroll.period_year}-{String(selectedPayroll.period_month).padStart(2, "0")})
// //               </h3>
// //               <button 
// //                 className="btn btn-circle btn-sm"
// //                 onClick={() => setSelectedPayroll(null)}
// //               >
// //                 ✕
// //               </button>
// //             </div>
            
// //             {!payrollDetails ? (
// //               <div className="flex justify-center items-center h-64">
// //                 <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
// //               </div>
// //             ) : (
// //               <div className="space-y-6">
// //                 {/* Summary Cards */}
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                   <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'} p-4`}>
// //                     <div className="text-sm font-medium">Gross Salary</div>
// //                     <div className="text-2xl font-bold">
// //                       ${parseFloat(payrollDetails.gross_salary || '0').toFixed(2)}
// //                     </div>
// //                   </div>
                  
// //                   <div className={`card ${theme === 'light' ? 'bg-red-50' : 'bg-red-900'} p-4`}>
// //                     <div className="text-sm font-medium">Total Deductions</div>
// //                     <div className="text-2xl font-bold">
// //                       ${parseFloat(payrollDetails.total_deduction || '0').toFixed(2)}
// //                     </div>
// //                   </div>
                  
// //                   <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'} p-4`}>
// //                     <div className="text-sm font-medium">Net Salary</div>
// //                     <div className="text-2xl font-bold">
// //                       ${parseFloat(payrollDetails.net_salary || '0').toFixed(2)}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Salary Breakdown */}
// //                 <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
// //                   <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
// //                     Salary Breakdown
// //                   </h4>
// //                   <div className="h-96">
// //                     <PieChart
// //                       data={[
// //                         { name: 'Basic Salary', value: parseFloat(payrollDetails.basic_salary) },
// //                         { name: 'Allowances', value: parseFloat(payrollDetails.total_allowance) },
// //                         { name: 'EPF Employee', value: parseFloat(payrollDetails.epf_employee) },
// //                         { name: 'SOCSO Employee', value: parseFloat(payrollDetails.socso_employee) },
// //                         { name: 'EIS Employee', value: parseFloat(payrollDetails.eis_employee) },
// //                         { name: 'PCB', value: parseFloat(payrollDetails.pcb) },
// //                         { name: 'Other Deductions', value: 
// //                           parseFloat(payrollDetails.total_deduction) - 
// //                           (parseFloat(payrollDetails.epf_employee) + 
// //                            parseFloat(payrollDetails.socso_employee) + 
// //                            parseFloat(payrollDetails.eis_employee) + 
// //                            parseFloat(payrollDetails.pcb))
// //                         }
// //                       ].filter(item => item.value > 0)}
// //                       theme={theme}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Detailed Breakdown in Table View */}
// //                 {payrollDetails && (
// //                   <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
// //                     <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
// //                       Detailed Breakdown
// //                     </h4>
                    
// //                     <div className="overflow-x-auto">
// //                       <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
// //                         <thead>
// //                           <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
// //                             <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Type</th>
// //                             <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Item</th>
// //                             <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Amount</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {/* Earnings */}
// //                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                             <td className="font-bold" colSpan={3}>Earnings</td>
// //                           </tr>
// //                           {payrollDetails.payslip_items
// //                             .filter(item => item.type === 'Earning')
// //                             .map((item, index) => (
// //                               <tr key={`earning-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td>{item.type}</td>
// //                                 <td>{item.label}</td>
// //                                 <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
// //                               </tr>
// //                             ))}
// //                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
// //                             <td colSpan={2}>Total Earnings</td>
// //                             <td className="text-right">${parseFloat(payrollDetails.gross_salary).toFixed(2)}</td>
// //                           </tr>

// //                           {/* Deductions */}
// //                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                             <td className="font-bold" colSpan={3}>Deductions</td>
// //                           </tr>
// //                           {payrollDetails.payslip_items
// //                             .filter(item => item.type === 'Deduction')
// //                             .map((item, index) => (
// //                               <tr key={`deduction-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td>{item.type}</td>
// //                                 <td>{item.label}</td>
// //                                 <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
// //                               </tr>
// //                             ))}
// //                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
// //                             <td colSpan={2}>Total Deductions</td>
// //                             <td className="text-right">-${parseFloat(payrollDetails.total_deduction).toFixed(2)}</td>
// //                           </tr>

// //                           {/* Statutory */}
// //                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                             <td className="font-bold" colSpan={3}>Statutory</td>
// //                           </tr>
// //                           {payrollDetails.payslip_items
// //                             .filter(item => item.type === 'Statutory')
// //                             .map((item, index) => (
// //                               <tr key={`statutory-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td>{item.type}</td>
// //                                 <td>{item.label}</td>
// //                                 <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
// //                               </tr>
// //                             ))}
// //                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
// //                             <td colSpan={2}>Total Statutory</td>
// //                             <td className="text-right">-${(
// //                               parseFloat(payrollDetails.epf_employee) +
// //                               parseFloat(payrollDetails.socso_employee) +
// //                               parseFloat(payrollDetails.eis_employee) +
// //                               parseFloat(payrollDetails.pcb)
// //                             ).toFixed(2)}</td>
// //                           </tr>

// //                           {/* Employer Contributions */}
// //                           {payrollDetails.employer_contributions.length > 0 && (
// //                             <>
// //                               <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                 <td className="font-bold" colSpan={3}>Employer Contributions</td>
// //                               </tr>
// //                               {payrollDetails.employer_contributions
// //                                 .filter((item, index, self) => 
// //                                   index === self.findIndex(t => (
// //                                     t.label === item.label && 
// //                                     t.amount === item.amount
// //                                   ))
// //                                 )
// //                                 .map((item, index) => (
// //                                   <tr key={`contribution-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
// //                                     <td>Employer</td>
// //                                     <td>{item.label}</td>
// //                                     <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
// //                                   </tr>
// //                                 ))}
// //                               <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
// //                                 <td colSpan={2}>Total Contributions</td>
// //                                 <td className="text-right">${(
// //                                   parseFloat(payrollDetails.epf_employer) +
// //                                   parseFloat(payrollDetails.socso_employer) +
// //                                   parseFloat(payrollDetails.eis_employer)
// //                                 ).toFixed(2)}</td>
// //                               </tr>
// //                             </>
// //                           )}

// //                           {/* Net Salary */}
// //                           <tr className={`font-bold text-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
// //                             <td colSpan={2}>Net Salary</td>
// //                             <td className="text-right">${parseFloat(payrollDetails.net_salary).toFixed(2)}</td>
// //                           </tr>
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OverviewTab;



// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../config";
// import { useTheme } from '../../../components/ThemeProvider';
// import { PieChart, BarChart, LineChart } from "../../../components/payroll/ChartComponents";
// import { format, parseISO, subMonths } from 'date-fns';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


// interface PayslipItem {
//   id: number;
//   payroll_id: number;
//   label: string;
//   amount: string;
//   type: string;
//   item_order: number | null;
//   created_at: string;
// }

// interface EmployerContribution {
//   id: number;
//   payroll_id: number;
//   label: string;
//   amount: string;
//   type: string;
//   created_at: string;
// }

// interface OverviewTabProps {
//   filters: {
//     fromDate: string;
//     toDate: string;
//     company: string;
//     status: string;
//   };
//   searchTerm: string;
// }

// interface PayrollRow {
//   payroll_id: number;
//   employee_name: string;
//   period_year: number;
//   period_month: number;
//   status_code: string;
//   gross_salary: string;
//   net_salary: string;
//   total_deduction: string;
//   company_name: string;
//   department_name: string;
// }

// interface PayrollDetails {
//   id: number;
//   payroll_id: number;
//   period_year: number;
//   period_month: number;
//   employee_id: number;
//   basic_salary: string;
//   total_allowance: string;
//   gross_salary: string;
//   total_deduction: string;
//   net_salary: string;
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
//   employee_name: string;
//   payslip_items: PayslipItem[];
//   employer_contributions: EmployerContribution[];
// }

// interface MonthlySummary {
//   month: string;
//   totalGross: number;
//   totalNet: number;
//   totalDeductions: number;
//   employeeCount: number;
// }

// interface DepartmentBreakdown {
//   department: string;
//   totalGross: number;
//   employeeCount: number;
//   avgSalary: number;
// }

// interface CompanyComparison {
//   company: string;
//   totalGross: number;
//   employeeCount: number;
// }

// interface PayrollTrend {
//   month: string;
//   payrollCost: number;
//   employerContributions: number;
//   totalCost: number;
// }

// const OverviewTab: React.FC<OverviewTabProps> = ({ filters, searchTerm }) => {
//   const { theme } = useTheme();
//   const [payrolls, setPayrolls] = useState<PayrollRow[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [dateRange, setDateRange] = useState<[Date, Date]>([
//     subMonths(new Date(), 12),
//     new Date()
//   ]);
//   const [startDate, endDate] = dateRange;
//   const [activeReportTab, setActiveReportTab] = useState<string>("summary");
//   const [selectedPayroll, setSelectedPayroll] = useState<PayrollRow | null>(null);
//   const [payrollDetails, setPayrollDetails] = useState<PayrollDetails | null>(null);
//   const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
//   const [departmentBreakdown, setDepartmentBreakdown] = useState<DepartmentBreakdown[]>([]);
//   const [companyComparison, setCompanyComparison] = useState<CompanyComparison[]>([]);
//   const [payrollTrends, setPayrollTrends] = useState<PayrollTrend[]>([]);


//   const generateReports =  useCallback((data: PayrollRow[]) => {//(data: PayrollRow[]) => {
//     const monthlyData: Record<string, MonthlySummary> = {};
//     const departmentData: Record<string, DepartmentBreakdown> = {};
//     const companyData: Record<string, CompanyComparison> = {};
//     const trendData: Record<string, PayrollTrend> = {};

//     data.forEach(payroll => {
//       const monthKey = `${payroll.period_year}-${String(payroll.period_month).padStart(2, '0')}`;
//       const monthName = `${getMonthName(payroll.period_month)} ${payroll.period_year}`;
      
//       // Monthly Summary
//       if (!monthlyData[monthKey]) {
//         monthlyData[monthKey] = {
//           month: monthName,
//           totalGross: 0,
//           totalNet: 0,
//           totalDeductions: 0,
//           employeeCount: 0
//         };
//       }
      
//       monthlyData[monthKey].totalGross += parseFloat(payroll.gross_salary) || 0;
//       monthlyData[monthKey].totalNet += parseFloat(payroll.net_salary) || 0;
//       monthlyData[monthKey].totalDeductions += parseFloat(payroll.total_deduction) || 0;
//       monthlyData[monthKey].employeeCount += 1;
      
//       // Department Breakdown
//       const department = payroll.department_name || 'Unassigned';
//       if (!departmentData[department]) {
//         departmentData[department] = {
//           department,
//           totalGross: 0,
//           employeeCount: 0,
//           avgSalary: 0
//         };
//       }
      
//       departmentData[department].totalGross += parseFloat(payroll.gross_salary) || 0;
//       departmentData[department].employeeCount += 1;
      
//       // Company Comparison
//       const company = payroll.company_name || 'Unassigned';
//       if (!companyData[company]) {
//         companyData[company] = {
//           company,
//           totalGross: 0,
//           employeeCount: 0
//         };
//       }
      
//       companyData[company].totalGross += parseFloat(payroll.gross_salary) || 0;
//       companyData[company].employeeCount += 1;
      
//       // Payroll Trends
//       if (!trendData[monthKey]) {
//         trendData[monthKey] = {
//           month: monthName,
//           payrollCost: 0,
//           employerContributions: 0,
//           totalCost: 0
//         };
//       }
      
//       trendData[monthKey].payrollCost += parseFloat(payroll.net_salary) || 0;
//       const employerContributions = parseFloat(payroll.gross_salary) * 0.13 || 0;
//       trendData[monthKey].employerContributions += employerContributions;
//       trendData[monthKey].totalCost += (parseFloat(payroll.net_salary) + employerContributions) || 0;
//     });

//     // Calculate averages
//     Object.keys(departmentData).forEach(dept => {
//       departmentData[dept].avgSalary = departmentData[dept].totalGross / departmentData[dept].employeeCount;
//     });

//     setMonthlySummaries(
//       Object.values(monthlyData)
//         .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
//     );
    
//     setDepartmentBreakdown(
//       Object.values(departmentData)
//         .sort((a, b) => b.totalGross - a.totalGross)
//     );
    
//     setCompanyComparison(
//       Object.values(companyData)
//         .sort((a, b) => b.totalGross - a.totalGross)
//     );
    
//     setPayrollTrends(
//       Object.values(trendData)
//         .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
//     );
//    }, []);//};

//      const fetchPayrolls = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params: any = {
//         all_data: true,
//         from_date: format(startDate, 'yyyy-MM-dd'),
//         to_date: format(endDate, 'yyyy-MM-dd')
//       };

//       if (searchTerm) params.employee_name = searchTerm;
//       if (filters.company) params.company_id = filters.company;
//       if (filters.status) params.status = filters.status;

//       const res = await axios.get(`${API_BASE_URL}/api/payroll/adjustments`, { params });

//       const flattened: PayrollRow[] = (res.data?.data ?? []).map((item: any) => ({
//         payroll_id: Number(item?.payroll?.payroll_id),
//         employee_name: String(item?.payroll?.employee_name ?? ''),
//         period_year: Number(item?.payroll?.period_year),
//         period_month: Number(item?.payroll?.period_month),
//         status_code: String(item?.payroll?.status_code ?? ''),
//         gross_salary: String(item?.payroll?.gross_salary ?? '0'),
//         net_salary: String(item?.payroll?.net_salary ?? '0'),
//         total_deduction: String(item?.payroll?.total_deduction ?? '0'),
//         company_name: String(item?.payroll?.company_name ?? ''),
//         department_name: String(item?.payroll?.department_name ?? '')
//       }));

//       setPayrolls(flattened);
//       generateReports(flattened);
//     } catch (error) {
//       console.error("Error fetching payrolls:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [startDate, endDate, filters, searchTerm, generateReports]);//}, [startDate, endDate, filters, searchTerm]);


//   const getMonthName = (month?: number) => {
//     const m = Number(month);
//     if (!Number.isInteger(m) || m < 1 || m > 12) return 'Invalid';
//     return format(new Date(2000, m - 1, 1), 'MMM');
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatCurrencyPrecise = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//   const fetchPayrollDetails = async (id: number) => {
//     try {
//       const res = await axios.get<PayrollDetails>(`${API_BASE_URL}/api/payroll/${id}`);
//       setPayrollDetails(res.data);
//     } catch (error) {
//       console.error("Error fetching payroll details:", error);
//     }
//   };

//   const handleViewClick = (payroll: PayrollRow) => {
//     if (!payroll.payroll_id) {
//       console.error("Invalid payroll ID");
//       return;
//     }
//     setSelectedPayroll(payroll);
//     fetchPayrollDetails(payroll.payroll_id);
//   };

//   const normalizeStatus = (s: unknown): string => {
//   const v = (typeof s === 'string' ? s : '').trim();
//   if (!v) return 'unknown';
//   return v.toLowerCase();
// };

// const getStatusBadgeColor = (rawStatus?: string) => {
//   const status = normalizeStatus(rawStatus);

//   switch (status) {
//     case 'approved':
//     case 'paid':
//       return theme === 'light'
//         ? 'bg-green-100 text-green-800'
//         : 'bg-green-900 text-green-200';
//     case 'pending':
//     case 'adjust':
//       return theme === 'light'
//         ? 'bg-yellow-100 text-yellow-800'
//         : 'bg-yellow-900 text-yellow-200';
//     case 'rejected':
//       return theme === 'light'
//         ? 'bg-red-100 text-red-800'
//         : 'bg-red-900 text-red-200';
//     case 'draft':
//       return theme === 'light'
//         ? 'bg-gray-100 text-gray-800'
//         : 'bg-gray-700 text-gray-200';
//     default:
//       return theme === 'light'
//         ? 'bg-gray-100 text-gray-800'
//         : 'bg-gray-700 text-gray-200';
//   }
// };

//   useEffect(() => {
//     fetchPayrolls();
//   }, [fetchPayrolls]);

//   return (
//     <div className="space-y-6">
//       {/* Filters and Date Range */}
//       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="card-body">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//               Payroll Overview
//             </h2>
            
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex items-center gap-2">
//                 <label className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Date Range:</label>
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={(update) => setDateRange(update as [Date, Date])}
//                   isClearable={false}
//                   className={`input input-bordered ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}
//                 />
//               </div>
              
//               <button 
//                 onClick={() => fetchPayrolls()}
//                 className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-accent'}`}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Analytics Dashboard */}
//       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="card-body">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//               Payroll Analytics
//             </h2>
//             <div className="tabs tabs-boxed bg-transparent">
//               <button 
//                 className={`tab ${activeReportTab === 'summary' ? 'tab-active' : ''}`}
//                 onClick={() => setActiveReportTab('summary')}
//               >
//                 Summary
//               </button>
//               <button 
//                 className={`tab ${activeReportTab === 'department' ? 'tab-active' : ''}`}
//                 onClick={() => setActiveReportTab('department')}
//               >
//                 Department
//               </button>
//               <button 
//                 className={`tab ${activeReportTab === 'company' ? 'tab-active' : ''}`}
//                 onClick={() => setActiveReportTab('company')}
//               >
//                 Company
//               </button>
//             </div>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//             </div>
//           ) : (
//             <>
//               {activeReportTab === 'summary' && (
//                 <div className="space-y-6">
//                   {/* Key Metrics */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
//                       <div className="card-body">
//                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
//                           Total Payroll Cost
//                         </h3>
//                         <p className="text-3xl font-bold">
//                           {formatCurrency(monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0))}
//                         </p>
//                         <p className="text-sm opacity-75">
//                           {payrolls.length} employees
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'}`}>
//                       <div className="card-body">
//                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-200'}`}>
//                           Average Salary
//                         </h3>
//                         <p className="text-3xl font-bold">
//                           {payrolls.length > 0 ? 
//                             formatCurrencyPrecise(monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0) / payrolls.length) : 
//                             '$0.00'}
//                         </p>
//                         <p className="text-sm opacity-75">
//                           Gross monthly average
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className={`card ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900'}`}>
//                       <div className="card-body">
//                         <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}`}>
//                           Total Deductions
//                         </h3>
//                         <p className="text-3xl font-bold">
//                           {formatCurrency(monthlySummaries.reduce((sum, m) => sum + m.totalDeductions, 0))}
//                         </p>
//                         <p className="text-sm opacity-75">
//                           {((monthlySummaries.reduce((sum, m) => sum + m.totalDeductions, 0) / 
//                             monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0)) * 100 || 0).toFixed(1)}% of gross
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Monthly Payroll Trend */}
//                   <div className={`card p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
//                     <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                       Monthly Payroll Trend
//                     </h3>
//                     <div className="h-80">
//                       {monthlySummaries.length > 0 ? (
//                         <LineChart
//                           data={monthlySummaries.map(m => ({
//                             name: m.month,
//                             totalGross: m.totalGross,
//                             totalNet: m.totalNet
//                           }))}
//                           xKey="name"
//                           yKeys={['totalGross', 'totalNet']}
//                           colors={['#3b82f6', '#10b981']}
//                           theme={theme}
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full text-gray-500">
//                           No trend data available
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeReportTab === 'department' && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="lg:col-span-2">
//                       <div className="overflow-x-auto">
//                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
//                           <thead>
//                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Department</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {departmentBreakdown.map((dept, index) => (
//                               <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td>{dept.department}</td>
//                                 <td className="text-right">{dept.employeeCount}</td>
//                                 <td className="text-right font-medium">{formatCurrency(dept.totalGross)}</td>
//                                 <td className="text-right">{formatCurrencyPrecise(dept.avgSalary)}</td>
//                                 <td className="text-right">
//                                   {((dept.totalGross / departmentBreakdown.reduce((sum, d) => sum + d.totalGross, 0)) * 100).toFixed(1)}%
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
                    
//                     <div className="h-96">
//                       <PieChart
//                         data={departmentBreakdown
//                           .filter(d => d.totalGross > 0)
//                           .map(d => ({
//                             name: d.department,
//                             value: d.totalGross
//                           }))
//                         }
//                         theme={theme}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeReportTab === 'company' && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="lg:col-span-2">
//                       <div className="overflow-x-auto">
//                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
//                           <thead>
//                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Company</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
//                               <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {companyComparison.map((company, index) => (
//                               <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td>{company.company}</td>
//                                 <td className="text-right">{company.employeeCount}</td>
//                                 <td className="text-right font-medium">{formatCurrency(company.totalGross)}</td>
//                                 <td className="text-right">
//                                   {formatCurrencyPrecise(company.totalGross / company.employeeCount)}
//                                 </td>
//                                 <td className="text-right">
//                                   {((company.totalGross / companyComparison.reduce((sum, c) => sum + c.totalGross, 0)) * 100).toFixed(1)}%
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
                    
//                     <div className="h-96">
//                       <BarChart
//                         data={companyComparison.map(c => ({
//                           name: c.company,
//                           value: c.totalGross
//                         }))}
//                         theme={theme}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Payroll Overview Table - Grouped by Month */}
//       <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="card-body">
//           <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//             Payroll Details by Month
//           </h2>
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//             </div>
//           ) : payrolls.length === 0 ? (
//             <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p>No payrolls found matching your criteria</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {Object.entries(
//                 payrolls.reduce((acc, payroll) => {
//                   const monthKey = `${payroll.period_year}-${String(payroll.period_month).padStart(2, '0')}`;
//                   if (!acc[monthKey]) {
//                     acc[monthKey] = [];
//                   }
//                   acc[monthKey].push(payroll);
//                   return acc;
//                 }, {} as Record<string, PayrollRow[]>)
//               )
//               .sort(([a], [b]) => b.localeCompare(a))
//               .map(([monthKey, monthPayrolls]) => {
//                 const [year, month] = monthKey.split('-');
//                 const monthName = getMonthName(parseInt(month));
//                 const totalGross = monthPayrolls.reduce((sum, p) => sum + parseFloat(p.gross_salary), 0);
//                 const totalNet = monthPayrolls.reduce((sum, p) => sum + parseFloat(p.net_salary), 0);

//                 return (
//                   <div key={monthKey} className={`collapse collapse-plus ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
//                     <input type="radio" name="payroll-months" /> 
//                     <div className="collapse-title text-xl font-medium">
//                       <div className="flex justify-between items-center">
//                         <span>{monthName} {year}</span>
//                         <span className="text-sm">
//                           {monthPayrolls.length} employees • 
//                           Gross: {formatCurrency(totalGross)} • 
//                           Net: {formatCurrency(totalNet)}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="collapse-content">
//                       <div className="overflow-x-auto">
//                         <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
//                           <thead>
//                             <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>ID</th>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Employee</th>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Status</th>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Gross</th>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Net</th>
//                               <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {monthPayrolls.map((row, idx) => (
//                               <tr 
//                                 key={`${monthKey}-${row.payroll_id || idx}`}
//                                 className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}
//                               >
//                                 <td>{row.payroll_id}</td>
//                                 <td>{row.employee_name}</td>
//                                 <td>
//                                   <span className={`badge ${getStatusBadgeColor(row.status_code)}`}>
//                                     {row.status_code}
//                                   </span>
//                                 </td>
//                                 <td>${parseFloat(row.gross_salary).toFixed(2)}</td>
//                                 <td>${parseFloat(row.net_salary).toFixed(2)}</td>
//                                 <td>
//                                   <button
//                                     className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white`}
//                                     onClick={() => handleViewClick(row)}
//                                   >
//                                     View
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payroll Details Modal */}
//       {selectedPayroll && (
//         <div className="modal modal-open">
//           <div className={`modal-box max-w-6xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//             <div className="flex justify-between items-start">
//               <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//                 Payroll Details - {selectedPayroll.employee_name} ({selectedPayroll.period_year}-{String(selectedPayroll.period_month).padStart(2, "0")})
//               </h3>
//               <button 
//                 className="btn btn-circle btn-sm"
//                 onClick={() => setSelectedPayroll(null)}
//               >
//                 ✕
//               </button>
//             </div>
            
//             {!payrollDetails ? (
//               <div className="flex justify-center items-center h-64">
//                 <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {/* Summary Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'} p-4`}>
//                     <div className="text-sm font-medium">Gross Salary</div>
//                     <div className="text-2xl font-bold">
//                       ${parseFloat(payrollDetails.gross_salary || '0').toFixed(2)}
//                     </div>
//                   </div>
                  
//                   <div className={`card ${theme === 'light' ? 'bg-red-50' : 'bg-red-900'} p-4`}>
//                     <div className="text-sm font-medium">Total Deductions</div>
//                     <div className="text-2xl font-bold">
//                       ${parseFloat(payrollDetails.total_deduction || '0').toFixed(2)}
//                     </div>
//                   </div>
                  
//                   <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'} p-4`}>
//                     <div className="text-sm font-medium">Net Salary</div>
//                     <div className="text-2xl font-bold">
//                       ${parseFloat(payrollDetails.net_salary || '0').toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Salary Breakdown */}
//                 <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
//                   <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                     Salary Breakdown
//                   </h4>
//                   <div className="h-96">
//                     <PieChart
//                       data={[
//                         { name: 'Basic Salary', value: parseFloat(payrollDetails.basic_salary) },
//                         { name: 'Allowances', value: parseFloat(payrollDetails.total_allowance) },
//                         { name: 'EPF Employee', value: parseFloat(payrollDetails.epf_employee) },
//                         { name: 'SOCSO Employee', value: parseFloat(payrollDetails.socso_employee) },
//                         { name: 'EIS Employee', value: parseFloat(payrollDetails.eis_employee) },
//                         { name: 'PCB', value: parseFloat(payrollDetails.pcb) },
//                         { name: 'Other Deductions', value: 
//                           parseFloat(payrollDetails.total_deduction) - 
//                           (parseFloat(payrollDetails.epf_employee) + 
//                            parseFloat(payrollDetails.socso_employee) + 
//                            parseFloat(payrollDetails.eis_employee) + 
//                            parseFloat(payrollDetails.pcb))
//                         }
//                       ].filter(item => item.value > 0)}
//                       theme={theme}
//                     />
//                   </div>
//                 </div>

//                 {/* Detailed Breakdown in Table View */}
//                 {payrollDetails && (
//                   <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
//                     <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//                       Detailed Breakdown
//                     </h4>
                    
//                     <div className="overflow-x-auto">
//                       <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
//                         <thead>
//                           <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
//                             <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Type</th>
//                             <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Item</th>
//                             <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {/* Earnings */}
//                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                             <td className="font-bold" colSpan={3}>Earnings</td>
//                           </tr>
//                           {payrollDetails.payslip_items
//                             .filter(item => item.type === 'Earning')
//                             .map((item, index) => (
//                               <tr key={`earning-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td>{item.type}</td>
//                                 <td>{item.label}</td>
//                                 <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
//                               </tr>
//                             ))}
//                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                             <td colSpan={2}>Total Earnings</td>
//                             <td className="text-right">${parseFloat(payrollDetails.gross_salary).toFixed(2)}</td>
//                           </tr>

//                           {/* Deductions */}
//                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                             <td className="font-bold" colSpan={3}>Deductions</td>
//                           </tr>
//                           {payrollDetails.payslip_items
//                             .filter(item => item.type === 'Deduction')
//                             .map((item, index) => (
//                               <tr key={`deduction-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td>{item.type}</td>
//                                 <td>{item.label}</td>
//                                 <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
//                               </tr>
//                             ))}
//                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                             <td colSpan={2}>Total Deductions</td>
//                             <td className="text-right">-${parseFloat(payrollDetails.total_deduction).toFixed(2)}</td>
//                           </tr>

//                           {/* Statutory */}
//                           <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                             <td className="font-bold" colSpan={3}>Statutory</td>
//                           </tr>
//                           {payrollDetails.payslip_items
//                             .filter(item => item.type === 'Statutory')
//                             .map((item, index) => (
//                               <tr key={`statutory-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td>{item.type}</td>
//                                 <td>{item.label}</td>
//                                 <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
//                               </tr>
//                             ))}
//                           <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                             <td colSpan={2}>Total Statutory</td>
//                             <td className="text-right">-${(
//                               parseFloat(payrollDetails.epf_employee) +
//                               parseFloat(payrollDetails.socso_employee) +
//                               parseFloat(payrollDetails.eis_employee) +
//                               parseFloat(payrollDetails.pcb)
//                             ).toFixed(2)}</td>
//                           </tr>

//                           {/* Employer Contributions */}
//                           {payrollDetails.employer_contributions.length > 0 && (
//                             <>
//                               <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                 <td className="font-bold" colSpan={3}>Employer Contributions</td>
//                               </tr>
//                               {payrollDetails.employer_contributions
//                                 .filter((item, index, self) => 
//                                   index === self.findIndex(t => (
//                                     t.label === item.label && 
//                                     t.amount === item.amount
//                                   ))
//                                 )
//                                 .map((item, index) => (
//                                   <tr key={`contribution-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
//                                     <td>Employer</td>
//                                     <td>{item.label}</td>
//                                     <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
//                                   </tr>
//                                 ))}
//                               <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//                                 <td colSpan={2}>Total Contributions</td>
//                                 <td className="text-right">${(
//                                   parseFloat(payrollDetails.epf_employer) +
//                                   parseFloat(payrollDetails.socso_employer) +
//                                   parseFloat(payrollDetails.eis_employer)
//                                 ).toFixed(2)}</td>
//                               </tr>
//                             </>
//                           )}

//                           {/* Net Salary */}
//                           <tr className={`font-bold text-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
//                             <td colSpan={2}>Net Salary</td>
//                             <td className="text-right">${parseFloat(payrollDetails.net_salary).toFixed(2)}</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OverviewTab;



"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { useTheme } from '../../../components/ThemeProvider';
import { PieChart, BarChart, LineChart } from "../../../components/payroll/ChartComponents";
import { format, parseISO, subMonths } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PayslipItem {
  id: number;
  payroll_id: number;
  label: string;
  amount: string;
  type: string;
  item_order: number | null;
  created_at: string;
}

interface EmployerContribution {
  id: number;
  payroll_id: number;
  label: string;
  amount: string;
  type: string;
  created_at: string;
}

interface OverviewTabProps {
  filters: {
    fromDate: string;
    toDate: string;
    company: string;
    status: string;
  };
  searchTerm: string;
}

interface PayrollRow {
  payroll_id: number;
  employee_name: string;
  period_year: number;
  period_month: number;
  status_code: string;
  gross_salary: string;
  net_salary: string;
  total_deduction: string;
  company_name: string;
  department_name: string;
}

interface PayrollDetails {
  id: number;
  payroll_id: number;
  period_year: number;
  period_month: number;
  employee_id: number;
  basic_salary: string;
  total_allowance: string;
  gross_salary: string;
  total_deduction: string;
  net_salary: string;
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
  employee_name: string;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
}

interface MonthlySummary {
  month: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
}

interface DepartmentBreakdown {
  department: string;
  totalGross: number;
  employeeCount: number;
  avgSalary: number;
}

interface CompanyComparison {
  company: string;
  totalGross: number;
  employeeCount: number;
  avgSalary: number;
}

interface PayrollTrend {
  month: string;
  payrollCost: number;
  employerContributions: number;
  totalCost: number;
}

interface MonthlyData {
  period_year: number;
  period_month: number;
  month: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  totalRecords: number;
  payrolls: PayrollRow[];
  currentPage: number;
  totalPages: number;
}


const OverviewTab: React.FC<OverviewTabProps> = ({ filters, searchTerm }) => {
  const { theme } = useTheme();
  const [payrolls, setPayrolls] = useState<PayrollRow[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    subMonths(new Date(), 12),
    new Date()
  ]);
  const [startDate, endDate] = dateRange;
  const [activeReportTab, setActiveReportTab] = useState<string>("summary");
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRow | null>(null);
  const [payrollDetails, setPayrollDetails] = useState<PayrollDetails | null>(null);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [departmentBreakdown, setDepartmentBreakdown] = useState<DepartmentBreakdown[]>([]);
  const [companyComparison, setCompanyComparison] = useState<CompanyComparison[]>([]);
  const [payrollTrends, setPayrollTrends] = useState<PayrollTrend[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set());

  // Separate API calls for each analytics component
 const fetchCompanyComparison = useCallback(async () => {
    try {
      const params: any = {
        from_date: format(startDate, 'yyyy-MM-dd'),
        to_date: format(endDate, 'yyyy-MM-dd')
      };

      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${API_BASE_URL}/api/payroll/analytics/company-comparison`, { params });
      setCompanyComparison(res.data.data || []);
    } catch (error) {
      console.error("Error fetching company comparison:", error);
      setCompanyComparison([]);
    }
  }, [startDate, endDate, filters.company, filters.status]);

const fetchDepartmentBreakdown = useCallback(async () => {
    try {
      const params: any = {
        from_date: format(startDate, 'yyyy-MM-dd'),
        to_date: format(endDate, 'yyyy-MM-dd')
      };

      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${API_BASE_URL}/api/payroll/analytics/department-breakdown`, { params });
      setDepartmentBreakdown(res.data.data || []);
    } catch (error) {
      console.error("Error fetching department breakdown:", error);
      setDepartmentBreakdown([]);
    }
  }, [startDate, endDate, filters.company, filters.status]);

  const fetchMonthlySummary = useCallback(async () => {
    try {
      const params: any = {
        from_date: format(startDate, 'yyyy-MM-dd'),
        to_date: format(endDate, 'yyyy-MM-dd')
      };

      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${API_BASE_URL}/api/payroll/analytics/monthly-summary`, { params });
      setMonthlySummaries(res.data.data || []);
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      setMonthlySummaries([]);
    }
  }, [startDate, endDate, filters.company, filters.status]);

const fetchMonthlySummaryWithCounts = useCallback(async () => {
    try {
      const params: any = {
        from_date: format(startDate, 'yyyy-MM-dd'),
        to_date: format(endDate, 'yyyy-MM-dd')
      };

      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${API_BASE_URL}/api/payroll/analytics/monthly-summary-with-counts`, { params });
      
      // Initialize monthly data with empty payrolls array
      const monthlyData = res.data.data.map((month: any) => ({
        ...month,
        payrolls: [],
        currentPage: 0, // Start with 0 to indicate not loaded
        totalPages: Math.ceil(month.totalRecords / 10)
      }));
      
      return monthlyData;
    } catch (error) {
      console.error("Error fetching monthly summary with counts:", error);
      return [];
    }
  }, [startDate, endDate, filters.company, filters.status]);

  // Fetch payrolls for a specific month with pagination
// Fetch payrolls for a specific month with pagination - FIXED
// Fetch payrolls for a specific month with pagination - FIXED
const fetchPayrollsForMonth = useCallback(
  async (
    period_year: number,
    period_month: number,
    page: number = 1,
    limit: number = 10
  ) => {
    const monthKey = `${period_year}-${String(period_month).padStart(2, "0")}`;

    // Guard: don't fetch if already loading this month
    if (loadingMonths.has(monthKey)) return;

    // Mark loading for this month
    setLoadingMonths((prev) => {
      const next = new Set(prev);
      next.add(monthKey);
      return next;
    });

    try {
      const params: any = {
        period_year,
        period_month,
        page,
        limit,
        from_date: format(startDate, "yyyy-MM-dd"),
        to_date: format(endDate, "yyyy-MM-dd"),
      };

      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;
      if (searchTerm) params.employee_name = searchTerm;

      const res = await axios.get(
        `${API_BASE_URL}/api/payroll/analytics/payroll-list`,
        { params }
      );

      // Update the specific month's data - FIXED: Use functional update to avoid loops
      setMonthlyData((prev) =>
        prev.map((month) =>
          month.period_year === period_year && month.period_month === period_month
            ? {
                ...month,
                payrolls: res.data.data,
                currentPage: page,
                totalPages: res.data.total_pages,
              }
            : month
        )
      );
    } catch (error) {
      console.error(`Error fetching payrolls for ${period_year}-${period_month}:`, error);
    } finally {
      // Clear loading flag for this month
      setLoadingMonths((prev) => {
        const next = new Set(prev);
        next.delete(monthKey);
        return next;
      });
    }
  },
  // IMPORTANT: only stable primitives here, not the whole filters object or loadingMonths
  [startDate, endDate, filters.company, filters.status, searchTerm]
);


  // Load first page for all months initially - FIXED
// Load first page for all months initially - FIXED
const loadInitialMonthData = useCallback(
  async (months: MonthlyData[]) => {
    // Only fetch months that actually have records
    const tasks = months
      .filter((m) => (m?.totalRecords ?? 0) > 0)
      .map((m) => fetchPayrollsForMonth(m.period_year, m.period_month, 1, 10));

    await Promise.all(tasks);
    setInitialDataLoaded(true);
  },
  [fetchPayrollsForMonth]
);


  // Handle page change for a specific month
  const handlePageChange = (period_year: number, period_month: number, newPage: number) => {
    fetchPayrollsForMonth(period_year, period_month, newPage, 10);
  };

  const fetchPayrollList = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        from_date: format(startDate, 'yyyy-MM-dd'),
        to_date: format(endDate, 'yyyy-MM-dd'),
        page: 1,
        limit: 1000
      };

      if (searchTerm) params.employee_name = searchTerm;
      if (filters.company) params.company_id = filters.company;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${API_BASE_URL}/api/payroll/analytics/payroll-list`, { params });
      setPayrolls(res.data.data || []);
    } catch (error) {
      console.error("Error fetching payroll list:", error);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, filters, searchTerm]);

  // Main fetch function that loads all analytics data
  const fetchAllAnalyticsissue = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      await Promise.all([
        fetchMonthlySummaryWithCounts(),
        fetchCompanyComparison(),
        fetchDepartmentBreakdown(),
        fetchMonthlySummary(),
        fetchPayrollList()
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [fetchMonthlySummaryWithCounts, fetchCompanyComparison, fetchDepartmentBreakdown, fetchMonthlySummary, fetchPayrollList]);

const fetchAllAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setInitialDataLoaded(false); // Reset initial data loaded flag
    
    try {
      // First, fetch the monthly summary with counts
      const monthlyData = await fetchMonthlySummaryWithCounts();
      setMonthlyData(monthlyData);
      
      // Then fetch other analytics and initial month data in parallel
      await Promise.all([
        fetchCompanyComparison(),
        fetchDepartmentBreakdown(),
        fetchMonthlySummary(),
        loadInitialMonthData(monthlyData) // Pass the monthlyData directly
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [
    fetchMonthlySummaryWithCounts, 
    fetchCompanyComparison, 
    fetchDepartmentBreakdown, 
    fetchMonthlySummary, 
    loadInitialMonthData
  ]);

  // Calculate payroll trends from monthly summaries
  useEffect(() => {
    if (monthlySummaries.length > 0) {
      const trends = monthlySummaries.map(m => ({
        month: m.month,
        payrollCost: m.totalNet,
        employerContributions: m.totalGross * 0.13,
        totalCost: m.totalNet + (m.totalGross * 0.13)
      }));
      setPayrollTrends(trends);
    }
  }, [monthlySummaries]);

  const getMonthName = (month?: number) => {
    const m = Number(month);
    if (!Number.isInteger(m) || m < 1 || m > 12) return 'Invalid';
    return format(new Date(2000, m - 1, 1), 'MMM');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyPrecise = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const fetchPayrollDetails = async (id: number) => {
    try {
      const res = await axios.get<PayrollDetails>(`${API_BASE_URL}/api/payroll/${id}`);
      setPayrollDetails(res.data);
    } catch (error) {
      console.error("Error fetching payroll details:", error);
    }
  };

  const handleViewClick = (payroll: PayrollRow) => {
    if (!payroll.payroll_id) {
      console.error("Invalid payroll ID");
      return;
    }
    setSelectedPayroll(payroll);
    fetchPayrollDetails(payroll.payroll_id);
  };

  const normalizeStatus = (s: unknown): string => {
    const v = (typeof s === 'string' ? s : '').trim();
    if (!v) return 'unknown';
    return v.toLowerCase();
  };

  const getStatusBadgeColor = (rawStatus?: string) => {
    const status = normalizeStatus(rawStatus);

    switch (status) {
      case 'approved':
      case 'paid':
        return theme === 'light'
          ? 'bg-green-100 text-green-800'
          : 'bg-green-900 text-green-200';
      case 'pending':
      case 'adjust':
        return theme === 'light'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-yellow-900 text-yellow-200';
      case 'rejected':
        return theme === 'light'
          ? 'bg-red-100 text-red-800'
          : 'bg-red-900 text-red-200';
      case 'draft':
        return theme === 'light'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-gray-700 text-gray-200';
      default:
        return theme === 'light'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-gray-700 text-gray-200';
    }
  };

  //   useEffect(() => {
  //   if (monthlyData.length > 0) {
  //     loadInitialMonthData();
  //   }
  // }, [monthlyData, loadInitialMonthData]);


  // Load data when filters change
  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  const handleApplyFilters = () => {
    fetchAllAnalytics();
  };


  // Render pagination controls
  const renderPagination = (month: MonthlyData) => {
    if (month.totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          className={`btn btn-sm ${theme === 'light' ? 'btn-outline' : 'btn-ghost'} ${month.currentPage === 1 ? 'btn-disabled' : ''}`}
          onClick={() => handlePageChange(month.period_year, month.period_month, month.currentPage - 1)}
          disabled={month.currentPage === 1}
        >
          Previous
        </button>
        
        <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Page {month.currentPage} of {month.totalPages}
        </span>
        
        <button
          className={`btn btn-sm ${theme === 'light' ? 'btn-outline' : 'btn-ghost'} ${month.currentPage === month.totalPages ? 'btn-disabled' : ''}`}
          onClick={() => handlePageChange(month.period_year, month.period_month, month.currentPage + 1)}
          disabled={month.currentPage === month.totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  // Check if a month is loading
  const isMonthLoading = (period_year: number, period_month: number) => {
    const monthKey = `${period_year}-${String(period_month).padStart(2, '0')}`;
    return loadingMonths.has(monthKey);
  };

  // Calculate total metrics for summary cards
  const totalGross = monthlySummaries.reduce((sum, m) => sum + m.totalGross, 0);
  const totalNet = monthlySummaries.reduce((sum, m) => sum + m.totalNet, 0);
  const totalDeductions = monthlySummaries.reduce((sum, m) => sum + m.totalDeductions, 0);
  const totalEmployees = payrolls.length;
  const averageSalary = totalEmployees > 0 ? totalGross / totalEmployees : 0;
  const deductionPercentage = totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Filters and Date Range */}
      <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Payroll Overview
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Date Range:</label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update as [Date, Date])}
                  isClearable={false}
                  className={`input input-bordered ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}
                />
              </div>
              
              <button 
                onClick={handleApplyFilters}
                className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-accent'}`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Payroll Analytics
            </h2>
            <div className="tabs tabs-boxed bg-transparent">
              <button 
                className={`tab ${activeReportTab === 'summary' ? 'tab-active' : ''}`}
                onClick={() => setActiveReportTab('summary')}
              >
                Summary
              </button>
              <button 
                className={`tab ${activeReportTab === 'department' ? 'tab-active' : ''}`}
                onClick={() => setActiveReportTab('department')}
              >
                Department
              </button>
              <button 
                className={`tab ${activeReportTab === 'company' ? 'tab-active' : ''}`}
                onClick={() => setActiveReportTab('company')}
              >
                Company
              </button>
            </div>
          </div>
          
          {analyticsLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
            </div>
          ) : (
            <>
              {activeReportTab === 'summary' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
                      <div className="card-body">
                        <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
                          Total Payroll Cost
                        </h3>
                        <p className="text-3xl font-bold">
                          {formatCurrency(totalGross)}
                        </p>
                        <p className="text-sm opacity-75">
                          {totalEmployees} employees
                        </p>
                      </div>
                    </div>
                    
                    <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'}`}>
                      <div className="card-body">
                        <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-200'}`}>
                          Average Salary
                        </h3>
                        <p className="text-3xl font-bold">
                          {formatCurrencyPrecise(averageSalary)}
                        </p>
                        <p className="text-sm opacity-75">
                          Gross monthly average
                        </p>
                      </div>
                    </div>
                    
                    <div className={`card ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900'}`}>
                      <div className="card-body">
                        <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}`}>
                          Total Deductions
                        </h3>
                        <p className="text-3xl font-bold">
                          {formatCurrency(totalDeductions)}
                        </p>
                        <p className="text-sm opacity-75">
                          {deductionPercentage.toFixed(1)}% of gross
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Payroll Trend */}
                  <div className={`card p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Monthly Payroll Trend
                    </h3>
                    <div className="h-80">
                      {monthlySummaries.length > 0 ? (
                        <LineChart
                          data={monthlySummaries.map(m => ({
                            name: m.month,
                            totalGross: m.totalGross,
                            totalNet: m.totalNet
                          }))}
                          xKey="name"
                          yKeys={['totalGross', 'totalNet']}
                          colors={['#3b82f6', '#10b981']}
                          theme={theme}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No trend data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === 'department' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="overflow-x-auto">
                        <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
                          <thead>
                            <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
                              <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Department</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {departmentBreakdown.map((dept, index) => {
                              const totalDeptGross = departmentBreakdown.reduce((sum, d) => sum + d.totalGross, 0);
                              const percentage = totalDeptGross > 0 ? (dept.totalGross / totalDeptGross) * 100 : 0;
                              
                              return (
                                <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                  <td>{dept.department}</td>
                                  <td className="text-right">{dept.employeeCount}</td>
                                  <td className="text-right font-medium">{formatCurrency(dept.totalGross)}</td>
                                  <td className="text-right">{formatCurrencyPrecise(dept.avgSalary)}</td>
                                  <td className="text-right">{percentage.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="h-96">
                      {departmentBreakdown.filter(d => d.totalGross > 0).length > 0 ? (
                        <PieChart
                          data={departmentBreakdown
                            .filter(d => d.totalGross > 0)
                            .map(d => ({
                              name: d.department,
                              value: d.totalGross
                            }))
                          }
                          theme={theme}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No department data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === 'company' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="overflow-x-auto">
                        <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
                          <thead>
                            <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
                              <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Company</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Employees</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Total Payroll</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Avg. Salary</th>
                              <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>% of Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companyComparison.map((company, index) => {
                              const totalCompanyGross = companyComparison.reduce((sum, c) => sum + c.totalGross, 0);
                              const percentage = totalCompanyGross > 0 ? (company.totalGross / totalCompanyGross) * 100 : 0;
                              
                              return (
                                <tr key={index} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                  <td>{company.company}</td>
                                  <td className="text-right">{company.employeeCount}</td>
                                  <td className="text-right font-medium">{formatCurrency(company.totalGross)}</td>
                                  <td className="text-right">
                                    {formatCurrencyPrecise(company.avgSalary)}
                                  </td>
                                  <td className="text-right">{percentage.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="h-96">
                      {companyComparison.length > 0 ? (
                        <BarChart
                          data={companyComparison.map(c => ({
                            name: c.company,
                            value: c.totalGross
                          }))}
                          theme={theme}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No company data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payroll Overview Table - Grouped by Month */}
 {/* Payroll Details by Month with Pagination */}
      <div className={`card shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="card-body">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Payroll Details by Month
          </h2>
          
          {analyticsLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
            </div>
          ) : monthlyData.length === 0 ? (
            <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No payrolls found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {monthlyData.map((month) => {
                const monthKey = `${month.period_year}-${String(month.period_month).padStart(2, '0')}`;
                const isLoading = isMonthLoading(month.period_year, month.period_month);

                return (
                  <div key={monthKey} className={`collapse collapse-plus ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <input type="radio" name="payroll-months" /> 
                    <div className="collapse-title text-xl font-medium">
                      <div className="flex justify-between items-center">
                        <span>{month.month}</span>
                        <span className="text-sm">
                          {month.totalRecords} employees • 
                          Gross: {formatCurrency(month.totalGross)} • 
                          Net: {formatCurrency(month.totalNet)}
                        </span>
                      </div>
                    </div>
                    <div className="collapse-content">
                      {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <span className={`loading loading-spinner loading-md ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
                        </div>
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
                              <thead>
                                <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>ID</th>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Employee</th>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Status</th>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Gross</th>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Net</th>
                                  <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {month.payrolls.map((row, idx) => (
                                  <tr 
                                    key={`${monthKey}-${row.payroll_id || idx}`}
                                    className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}
                                  >
                                    <td>{row.payroll_id}</td>
                                    <td>{row.employee_name}</td>
                                    <td>
                                      <span className={`badge ${getStatusBadgeColor(row.status_code)}`}>
                                        {row.status_code}
                                      </span>
                                    </td>
                                    <td>${parseFloat(row.gross_salary).toFixed(2)}</td>
                                    <td>${parseFloat(row.net_salary).toFixed(2)}</td>
                                    <td>
                                      <button
                                        className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white`}
                                        onClick={() => handleViewClick(row)}
                                      >
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Pagination Controls */}
                          {renderPagination(month)}
                          
                          {/* Records count */}
                          <div className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Showing {month.payrolls.length} of {month.totalRecords} records
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payroll Details Modal */}
      {selectedPayroll && (
        <div className="modal modal-open">
          <div className={`modal-box max-w-6xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="flex justify-between items-start">
              <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Payroll Details - {selectedPayroll.employee_name} ({selectedPayroll.period_year}-{String(selectedPayroll.period_month).padStart(2, "0")})
              </h3>
              <button 
                className="btn btn-circle btn-sm"
                onClick={() => setSelectedPayroll(null)}
              >
                ✕
              </button>
            </div>
            
            {!payrollDetails ? (
              <div className="flex justify-center items-center h-64">
                <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`card ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'} p-4`}>
                    <div className="text-sm font-medium">Gross Salary</div>
                    <div className="text-2xl font-bold">
                      ${parseFloat(payrollDetails.gross_salary || '0').toFixed(2)}
                    </div>
                  </div>
                  
                  <div className={`card ${theme === 'light' ? 'bg-red-50' : 'bg-red-900'} p-4`}>
                    <div className="text-sm font-medium">Total Deductions</div>
                    <div className="text-2xl font-bold">
                      ${parseFloat(payrollDetails.total_deduction || '0').toFixed(2)}
                    </div>
                  </div>
                  
                  <div className={`card ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'} p-4`}>
                    <div className="text-sm font-medium">Net Salary</div>
                    <div className="text-2xl font-bold">
                      ${parseFloat(payrollDetails.net_salary || '0').toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
                  <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Salary Breakdown
                  </h4>
                  <div className="h-96">
                    <PieChart
                      data={[
                        { name: 'Basic Salary', value: parseFloat(payrollDetails.basic_salary) },
                        { name: 'Allowances', value: parseFloat(payrollDetails.total_allowance) },
                        { name: 'EPF Employee', value: parseFloat(payrollDetails.epf_employee) },
                        { name: 'SOCSO Employee', value: parseFloat(payrollDetails.socso_employee) },
                        { name: 'EIS Employee', value: parseFloat(payrollDetails.eis_employee) },
                        { name: 'PCB', value: parseFloat(payrollDetails.pcb) },
                        { name: 'Other Deductions', value: 
                          parseFloat(payrollDetails.total_deduction) - 
                          (parseFloat(payrollDetails.epf_employee) + 
                           parseFloat(payrollDetails.socso_employee) + 
                           parseFloat(payrollDetails.eis_employee) + 
                           parseFloat(payrollDetails.pcb))
                        }
                      ].filter(item => item.value > 0)}
                      theme={theme}
                    />
                  </div>
                </div>

                {/* Detailed Breakdown in Table View */}
                {payrollDetails && (
                  <div className={`card p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
                    <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Detailed Breakdown
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className={`table w-full ${theme === 'light' ? '' : 'text-gray-300'}`}>
                        <thead>
                          <tr className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}>
                            <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Type</th>
                            <th className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Item</th>
                            <th className={`text-right ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Earnings */}
                          <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                            <td className="font-bold" colSpan={3}>Earnings</td>
                          </tr>
                          {payrollDetails.payslip_items
                            .filter(item => item.type === 'Earning')
                            .map((item, index) => (
                              <tr key={`earning-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                <td>{item.type}</td>
                                <td>{item.label}</td>
                                <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
                              </tr>
                            ))}
                          <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                            <td colSpan={2}>Total Earnings</td>
                            <td className="text-right">${parseFloat(payrollDetails.gross_salary).toFixed(2)}</td>
                          </tr>

                          {/* Deductions */}
                          <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                            <td className="font-bold" colSpan={3}>Deductions</td>
                          </tr>
                          {payrollDetails.payslip_items
                            .filter(item => item.type === 'Deduction')
                            .map((item, index) => (
                              <tr key={`deduction-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                <td>{item.type}</td>
                                <td>{item.label}</td>
                                <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
                              </tr>
                            ))}
                          <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                            <td colSpan={2}>Total Deductions</td>
                            <td className="text-right">-${parseFloat(payrollDetails.total_deduction).toFixed(2)}</td>
                          </tr>

                          {/* Statutory */}
                          <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                            <td className="font-bold" colSpan={3}>Statutory</td>
                          </tr>
                          {payrollDetails.payslip_items
                            .filter(item => item.type === 'Statutory')
                            .map((item, index) => (
                              <tr key={`statutory-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                <td>{item.type}</td>
                                <td>{item.label}</td>
                                <td className="text-right">-${parseFloat(item.amount).toFixed(2)}</td>
                              </tr>
                            ))}
                          <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                            <td colSpan={2}>Total Statutory</td>
                            <td className="text-right">-${(
                              parseFloat(payrollDetails.epf_employee) +
                              parseFloat(payrollDetails.socso_employee) +
                              parseFloat(payrollDetails.eis_employee) +
                              parseFloat(payrollDetails.pcb)
                            ).toFixed(2)}</td>
                          </tr>

                          {/* Employer Contributions */}
                          {payrollDetails.employer_contributions.length > 0 && (
                            <>
                              <tr className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                <td className="font-bold" colSpan={3}>Employer Contributions</td>
                              </tr>
                              {payrollDetails.employer_contributions
                                .filter((item, index, self) => 
                                  index === self.findIndex(t => (
                                    t.label === item.label && 
                                    t.amount === item.amount
                                  ))
                                )
                                .map((item, index) => (
                                  <tr key={`contribution-${index}`} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}>
                                    <td>Employer</td>
                                    <td>{item.label}</td>
                                    <td className="text-right">${parseFloat(item.amount).toFixed(2)}</td>
                                  </tr>
                                ))}
                              <tr className={`font-bold ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                                <td colSpan={2}>Total Contributions</td>
                                <td className="text-right">${(
                                  parseFloat(payrollDetails.epf_employer) +
                                  parseFloat(payrollDetails.socso_employer) +
                                  parseFloat(payrollDetails.eis_employer)
                                ).toFixed(2)}</td>
                              </tr>
                            </>
                          )}

                          {/* Net Salary */}
                          <tr className={`font-bold text-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
                            <td colSpan={2}>Net Salary</td>
                            <td className="text-right">${parseFloat(payrollDetails.net_salary).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
