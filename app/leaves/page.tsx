// // // // 'use client';

// // // // import React, { useState, useEffect } from 'react'
// // // // import LeaveOverview from './LeaveOverview';
// // // // import LeaveCalendar from './LeaveCalendar';
// // // // import LeaveRequest from './LeaveRequest';
// // // // import AdminLeaveRequest from './AdminLeaveRequest';
// // // // // The LeaveType import will only be used by admin users
// // // // import LeaveType from './LeaveType';
// // // // import { FaRegCalendarTimes } from "react-icons/fa";
// // // // import { useTheme } from '../components/ThemeProvider';

// // // // interface User {
// // // //   id: number;
// // // //   name: string;
// // // //   email: string;
// // // //   role: string;
// // // // }

// // // // const LeavesPage = () => {
// // // //   const { theme } = useTheme();
// // // //   const [key, setKey] = useState(0);
// // // //   const [user, setUser] = useState<User | null>(null);
// // // //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// // // //   const [activeTab, setActiveTab] = useState('');

// // // //   useEffect(() => {
// // // //     const user = localStorage.getItem('hrms_user');
// // // //     if (user) {
// // // //       const userData = JSON.parse(user);
// // // //       setUser(userData);
// // // //     }

// // // //     // Get last opened menu from localStorage
// // // //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// // // //     setLastOpenedMenu(lastMenu);
// // // //   }, []);

// // // //   const handleTabChange = (tabName: string) => {
// // // //     setActiveTab(tabName);
// // // //     setKey(prev => prev + 1);
// // // //   };

// // // //   return (
// // // //     <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// // // //         <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// // // //           <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// // // //           <span className="truncate">Manage Leaves</span>
// // // //         </h1>
// // // //       </div>

// // // //       <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// // // //         {user?.role !== 'admin' && (
// // // //           <>
// // // //             <input
// // // //               type="radio"
// // // //               name="leaves_tabs"
// // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //               aria-label="Overview"
// // // //               defaultChecked
// // // //               onChange={() => handleTabChange('overview')}
// // // //             />
// // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //               <LeaveOverview key={`overview-${key}`} />
// // // //             </div>
// // // //             <input
// // // //               type="radio"
// // // //               name="leaves_tabs"
// // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //               aria-label="Leave Requests"
// // // //               defaultChecked={user?.role === 'admin'}
// // // //               onChange={() => handleTabChange('requests')}
// // // //             />
// // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //               <LeaveRequest key={`requests-${key}`} />
// // // //             </div>

// // // //             <input
// // // //               type="radio"
// // // //               name="leaves_tabs"
// // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //               aria-label="Calendar"
// // // //               onChange={() => handleTabChange('calendar')}
// // // //             />
// // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //               <LeaveCalendar key={`calendar-${key}`} />
// // // //             </div>
// // // //           </>
// // // //         )}
// // // //         {user?.role === 'admin' && (
// // // //           <>
// // // //             <input
// // // //               type="radio"
// // // //               name="leaves_tabs"
// // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //               aria-label="Leave Requests"
// // // //               defaultChecked
// // // //               onChange={() => handleTabChange('requests')}
// // // //             />
// // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //               <AdminLeaveRequest key={`requests-${key}`} />
// // // //             </div>

// // // //             <input
// // // //               type="radio"
// // // //               name="leaves_tabs"
// // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //               aria-label="Leave Types"
// // // //               onChange={() => handleTabChange('types')}
// // // //             />
// // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //               <LeaveType key={`types-${key}`} />
// // // //             </div>
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default LeavesPage

// // // 'use client';

// // // import React, { useState, useEffect } from 'react'
// // // import LeaveOverview from './LeaveOverview';
// // // import LeaveCalendar from './LeaveCalendar';
// // // import LeaveRequest from './LeaveRequest';
// // // import AdminLeaveRequest from './AdminLeaveRequest';
// // // // The LeaveType import will only be used by admin users
// // // import LeaveType from './LeaveType';
// // // import { FaRegCalendarTimes, FaChartBar, FaFileExport, FaFilter } from "react-icons/fa";
// // // import { useTheme } from '../components/ThemeProvider';
// // // import axios from 'axios';
// // // import { API_BASE_URL } from '../config';
// // // import { useNotification } from '../hooks/useNotification';
// // // import NotificationToast from '../components/NotificationToast';

// // // interface User {
// // //   id: number;
// // //   name: string;
// // //   email: string;
// // //   role: string;
// // // }

// // // // Report data interface
// // // interface LeaveReportData {
// // //   employee_id: string;
// // //   employee_name: string;
// // //   leave_type: string;
// // //   start_date: string;
// // //   end_date: string;
// // //   days: number;
// // //   status: string;
// // //   company: string;
// // //   department: string;
// // // }

// // // const LeavesPage = () => {
// // //   const { theme } = useTheme();
// // //   const { notification, showNotification } = useNotification();
// // //   const [key, setKey] = useState(0);
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// // //   const [activeTab, setActiveTab] = useState('');

// // //   // Report states
// // //   const [showReportModal, setShowReportModal] = useState(false);
// // //   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
// // //   const [reportFilters, setReportFilters] = useState({
// // //     startDate: '',
// // //     endDate: '',
// // //     company: 'all',
// // //     department: 'all',
// // //     status: 'all',
// // //     leaveType: 'all'
// // //   });
// // //   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
// // //   const [companies, setCompanies] = useState<string[]>([]);

// // //   useEffect(() => {
// // //     const user = localStorage.getItem('hrms_user');
// // //     if (user) {
// // //       const userData = JSON.parse(user);
// // //       setUser(userData);
// // //     }

// // //     // Get last opened menu from localStorage
// // //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// // //     setLastOpenedMenu(lastMenu);

// // //     // Fetch companies for report filter
// // //     fetchCompanies();
// // //   }, []);

// // // const fetchCompanies = async () => {
// // //   try {
// // //     const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// // //       headers: {
// // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //       }
// // //     });
    
// // //     if (response.data && Array.isArray(response.data)) {
// // //       // Filter out inactive companies and handle duplicates
// // //       const uniqueCompanies = response.data
// // //         .filter((company: any) => company.is_active === 1) // Only active companies
// // //         .filter((company: any, index, self) => 
// // //           // Remove duplicates by company name
// // //           index === self.findIndex((c: any) => (
// // //             c.company_name === company.company_name
// // //           ))
// // //         )
// // //         .map((company: any) => company.company_name)
// // //         .filter((name: string | null) => name !== null && name.trim() !== '') // Remove null/empty names
// // //         .sort(); // Sort alphabetically
      
// // //       setCompanies(uniqueCompanies);
// // //     }
// // //   } catch (err) {
// // //     console.error('Error fetching companies:', err);
// // //     // Fallback to empty array if API fails
// // //     setCompanies([]);
// // //   }
// // // };
// // //   const handleTabChange = (tabName: string) => {
// // //     setActiveTab(tabName);
// // //     setKey(prev => prev + 1);
// // //   };

// // //   // Report functions
// // //   const generateLeaveReport = async () => {
// // //     try {
// // //       setIsGeneratingReport(true);
      
// // //       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         },
// // //         params: {
// // //           startDate: reportFilters.startDate,
// // //           endDate: reportFilters.endDate,
// // //           company: reportFilters.company !== 'all' ? reportFilters.company : undefined,
// // //           department: reportFilters.department !== 'all' ? reportFilters.department : undefined,
// // //           status: reportFilters.status !== 'all' ? reportFilters.status : undefined,
// // //           leaveType: reportFilters.leaveType !== 'all' ? reportFilters.leaveType : undefined
// // //         }
// // //       });
      
// // //       setReportData(response.data.data);
// // //       showNotification('Report generated successfully', 'success');
// // //     } catch (err) {
// // //       console.error('Error generating report:', err);
// // //       showNotification('Failed to generate report', 'error');
// // //     } finally {
// // //       setIsGeneratingReport(false);
// // //     }
// // //   };

// // //   const exportReportToCSV = () => {
// // //     if (reportData.length === 0) {
// // //       showNotification('No data to export', 'error');
// // //       return;
// // //     }

// // //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// // //     const csvContent = [
// // //       headers.join(','),
// // //       ...reportData.map(row => [
// // //         row.employee_id || '',
// // //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// // //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// // //         row.start_date || '',
// // //         row.end_date || '',
// // //         row.days || '',
// // //         row.status || '',
// // //         `"${(row.company || '').replace(/"/g, '""')}"`,
// // //         `"${(row.department || '').replace(/"/g, '""')}"`
// // //       ].join(','))
// // //     ].join('\n');

// // //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //     const link = document.createElement('a');
// // //     const url = URL.createObjectURL(blob);
// // //     link.setAttribute('href', url);
// // //     link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
// // //     link.style.visibility = 'hidden';
// // //     document.body.appendChild(link);
// // //     link.click();
// // //     document.body.removeChild(link);
    
// // //     showNotification('Report exported successfully', 'success');
// // //   };

// // //   return (
// // //     <>
// // //       {/* Notification Toast */}
// // //       <NotificationToast
// // //         show={notification.show}
// // //         message={notification.message}
// // //         type={notification.type}
// // //       />
      
// // //       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// // //           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// // //             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// // //             <span className="truncate">Manage Leaves</span>
// // //           </h1>
          
// // //           {/* Report Button - Show for all users */}
// // //           <button
// // //             onClick={() => setShowReportModal(true)}
// // //             className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
// // //           >
// // //             <FaChartBar className="h-4 w-4" />
// // //             <span className="hidden sm:inline">Leave Report</span>
// // //             <span className="sm:hidden">Report</span>
// // //           </button>
// // //         </div>

// // //         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// // //           {user?.role !== 'admin' && (
// // //             <>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Overview"
// // //                 defaultChecked
// // //                 onChange={() => handleTabChange('overview')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveOverview key={`overview-${key}`} />
// // //               </div>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Requests"
// // //                 defaultChecked={user?.role === 'admin'}
// // //                 onChange={() => handleTabChange('requests')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveRequest key={`requests-${key}`} />
// // //               </div>

// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Calendar"
// // //                 onChange={() => handleTabChange('calendar')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveCalendar key={`calendar-${key}`} />
// // //               </div>
// // //             </>
// // //           )}
// // //           {user?.role === 'admin' && (
// // //             <>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Requests"
// // //                 defaultChecked
// // //                 onChange={() => handleTabChange('requests')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <AdminLeaveRequest key={`requests-${key}`} />
// // //               </div>

// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Types"
// // //                 onChange={() => handleTabChange('types')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveType key={`types-${key}`} />
// // //               </div>
// // //             </>
// // //           )}
// // //         </div>

// // //         {/* Report Modal */}
// // //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// // //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// // //             {/* Modal Header */}
// // //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// // //               <div className="flex items-center gap-4 relative z-10">
// // //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// // //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// // //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// // //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// // //                 </div>
                
// // //                 <div className="flex flex-col">
// // //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// // //                     Leave Applications Report
// // //                   </h3>
// // //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// // //                     Generate and export leave application reports
// // //                   </p>
// // //                 </div>
// // //               </div>
              
// // //               <button
// // //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// // //                 onClick={() => setShowReportModal(false)}
// // //               >
// // //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// // //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>

// // //             {/* Modal Content */}
// // //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
// // //               {/* Filters */}
// // //               <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// // //                 <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   <FaFilter className="inline mr-2" />
// // //                   Report Filters
// // //                 </h4>
                
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                   {/* Date Range */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Start Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={reportFilters.startDate}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     />
// // //                   </div>
                  
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       End Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={reportFilters.endDate}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     />
// // //                   </div>

// // //                   {/* Company Filter */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Company
// // //                     </label>
// // //                     <select
// // //                       value={reportFilters.company}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, company: e.target.value }))}
// // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     >
// // //                       <option value="all">All Companies</option>
// // //                       {companies.map(company => (
// // //                         <option key={company} value={company}>{company}</option>
// // //                       ))}
// // //                     </select>
// // //                   </div>

// // //                   {/* Status Filter */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Status
// // //                     </label>
// // //                     <select
// // //                       value={reportFilters.status}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     >
// // //                       <option value="all">All Status</option>
// // //                       <option value="PENDING">Pending</option>
// // //                       <option value="APPROVED">Approved</option>
// // //                       <option value="REJECTED">Rejected</option>
// // //                       <option value="CANCELLED">Cancelled</option>
// // //                     </select>
// // //                   </div>

// // //                   {/* Leave Type Filter */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Leave Type
// // //                     </label>
// // //                     <select
// // //                       value={reportFilters.leaveType}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     >
// // //                       <option value="all">All Leave Types</option>
// // //                       {/* You might want to fetch leave types dynamically */}
// // //                       <option value="Annual Leave">Annual Leave</option>
// // //                       <option value="Sick Leave">Sick Leave</option>
// // //                       <option value="Maternity Leave">Maternity Leave</option>
// // //                       <option value="Paternity Leave">Paternity Leave</option>
// // //                     </select>
// // //                   </div>
// // //                 </div>

// // //                 {/* Action Buttons */}
// // //                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
// // //                   <button
// // //                     onClick={generateLeaveReport}
// // //                     disabled={isGeneratingReport}
// // //                     className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// // //                   >
// // //                     {isGeneratingReport ? (
// // //                       <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// // //                     ) : (
// // //                       <FaChartBar className="h-4 w-4" />
// // //                     )}
// // //                     Generate Report
// // //                   </button>
                  
// // //                   <button
// // //                     onClick={exportReportToCSV}
// // //                     disabled={reportData.length === 0}
// // //                     className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// // //                   >
// // //                     <FaFileExport className="h-4 w-4" />
// // //                     Export to CSV
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Report Results */}
// // //               {reportData.length > 0 && (
// // //                 <div className="overflow-x-auto">
// // //                   <table className="table table-zebra w-full">
// // //                     <thead>
// // //                       <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// // //                         <th>Employee</th>
// // //                         <th>Leave Type</th>
// // //                         <th>Start Date</th>
// // //                         <th>End Date</th>
// // //                         <th>Days</th>
// // //                         <th>Status</th>
// // //                         <th>Company</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {reportData.map((item, index) => (
// // //                         <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// // //                           <td>
// // //                             <div className="font-medium">{item.employee_name}</div>
// // //                             <div className="text-sm opacity-70">{item.employee_id}</div>
// // //                           </td>
// // //                           <td>{item.leave_type}</td>
// // //                           <td>{new Date(item.start_date).toLocaleDateString()}</td>
// // //                           <td>{new Date(item.end_date).toLocaleDateString()}</td>
// // //                           <td>{item.days}</td>
// // //                           <td>
// // //                             <span className={`badge ${
// // //                               item.status === 'APPROVED' ? 'badge-success' :
// // //                               item.status === 'REJECTED' ? 'badge-error' :
// // //                               item.status === 'PENDING' ? 'badge-warning' :
// // //                               'badge-neutral'
// // //                             }`}>
// // //                               {item.status}
// // //                             </span>
// // //                           </td>
// // //                           <td>{item.company}</td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
                  
// // //                   <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //                     Total Records: {reportData.length}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {reportData.length === 0 && !isGeneratingReport && (
// // //                 <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //                   <FaChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // //                   <p>No report data generated yet. Apply filters and click "Generate Report".</p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <form method="dialog" className="modal-backdrop">
// // //             <button onClick={() => setShowReportModal(false)}>close</button>
// // //           </form>
// // //         </dialog>
// // //       </div>
// // //     </>
// // //   )
// // // }

// // // export default LeavesPage

// // 'use client';

// // import React, { useState, useEffect } from 'react'
// // import LeaveOverview from './LeaveOverview';
// // import LeaveCalendar from './LeaveCalendar';
// // import LeaveRequest from './LeaveRequest';
// // import AdminLeaveRequest from './AdminLeaveRequest';
// // import LeaveType from './LeaveType';
// // import { 
// //   FaRegCalendarTimes, 
// //   FaChartBar, 
// //   FaFileExport, 
// //   FaFilter, 
// //   FaUser,
// //   FaBuilding,
// //   FaUsers 
// // } from "react-icons/fa";
// // import { useTheme } from '../components/ThemeProvider';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useNotification } from '../hooks/useNotification';
// // import NotificationToast from '../components/NotificationToast';
// // import { ImportIcon } from 'lucide-react';
// // import { CiImport } from 'react-icons/ci';

// // interface User {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: string;
// // }

// // // Report data interfaces
// // interface LeaveReportData {
// //   employee_id: string;
// //   employee_name: string;
// //   leave_type: string;
// //   start_date: string;
// //   end_date: string;
// //   days: number;
// //   status: string;
// //   company: string;
// //   department: string;
// // }

// // interface LeaveBalanceData {
// //   employee_id: string;
// //   employee_code: string;
// //   employee_name: string;
// //   email: string;
// //   company: string;
// //   department: string;
// //   leave_balances: {
// //     leave_type: string;
// //     total_allocated: number;
// //     leaves_taken: number;
// //     balance: number;
// //     carry_forward: boolean;
// //     carry_forward_balance: number;
// //     leave_type_active: boolean;
// //   }[];
// // }

// // interface FilterOption {
// //   value: string;
// //   label: string;
// //   company?: string;
// // }

// // interface Company {
// //   id: number;
// //   name: string;
// // }


// // const LeavesPage = () => {
// //   const { theme } = useTheme();
// //   const { notification, showNotification } = useNotification();
// //   const [key, setKey] = useState(0);
// //   const [user, setUser] = useState<User | null>(null);
// //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// //   const [activeTab, setActiveTab] = useState('');

// //   // Report states
// //   const [showReportModal, setShowReportModal] = useState(false);
// //   const [activeReportType, setActiveReportType] = useState<'applications' | 'balance'>('applications');
// //   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
// //   const [balanceReportData, setBalanceReportData] = useState<LeaveBalanceData[]>([]);
  
// //   // Report filters
// //   const [reportFilters, setReportFilters] = useState({
// //     startDate: '',
// //     endDate: '',
// //     company: 'all',
// //     department: 'all',
// //     status: 'all',
// //     leaveType: 'all'
// //   });

// //   const [balanceReportFilters, setBalanceReportFilters] = useState({
// //     company: 'all',
// //     department: 'all',
// //     employeeId: 'all',
// //     asOfDate: new Date().toISOString().split('T')[0]
// //   });

// // const [isGeneratingReport, setIsGeneratingReport] = useState(false);
// // const [isGeneratingBalanceReport, setIsGeneratingBalanceReport] = useState(false);
// // const [companies, setCompanies] = useState<Company[]>([]);

// // const [applicationDepartments, setApplicationDepartments] = useState<FilterOption[]>([]);
// // const [balanceDepartments, setBalanceDepartments] = useState<FilterOption[]>([]);
// // const [balanceEmployees, setBalanceEmployees] = useState<FilterOption[]>([]);

// // useEffect(() => {
// //   const user = localStorage.getItem('hrms_user');
// //   if (user) {
// //     const userData = JSON.parse(user);
// //     setUser(userData);
// //   }

// //   const lastMenu = localStorage.getItem('lastOpenedMenu');
// //   setLastOpenedMenu(lastMenu);

// //   fetchCompanies();
// // }, []);

// // useEffect(() => {
// //   if (reportFilters.company !== 'all') {
// //     fetchApplicationDepartments(reportFilters.company);
// //   } else {
// //     setApplicationDepartments([]);
// //   }
// // }, [reportFilters.company]);

// // const exportReportToCSV = () => {
// //   if (reportData.length === 0) {
// //     showNotification('No data to export', 'error');
// //     return;
// //   }

// //   const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// //   const csvContent = [
// //     headers.join(','),
// //     ...reportData.map(row => [
// //       row.employee_id || '',
// //       `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// //       `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// //       row.start_date || '',
// //       row.end_date || '',
// //       row.days || '',
// //       row.status || '',
// //       `"${(row.company || '').replace(/"/g, '""')}"`,
// //       `"${(row.department || '').replace(/"/g, '""')}"`
// //     ].join(','))
// //   ].join('\n');

// //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //   const link = document.createElement('a');
// //   const url = URL.createObjectURL(blob);
// //   link.setAttribute('href', url);
// //   link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
// //   link.style.visibility = 'hidden';
// //   document.body.appendChild(link);
// //   link.click();
// //   document.body.removeChild(link);
  
// //   showNotification('Report exported successfully', 'success');
// // };

// // const fetchCompanies = async () => {
// // try {
// //   const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// //     headers: {
// //       Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //     }
// //   });
  
// //   if (response.data && Array.isArray(response.data)) {
// //     const uniqueCompanies = response.data
// //       .filter((company: any) => company.is_active === 1)
// //       .filter((company: any, index, self) => 
// //         index === self.findIndex((c: any) => c.id === company.id)
// //       )
// //       .map((company: any) => ({
// //         id: company.id,
// //         name: company.company_name || company.name
// //       }))
// //       .sort((a, b) => a.name.localeCompare(b.name));
    
// //     setCompanies(uniqueCompanies);
// //   }
// // } catch (err) {
// //   console.error('Error fetching companies:', err);
// //   setCompanies([]);
// // }
// // };

// // const handleTabChange = (tabName: string) => {
// //   setActiveTab(tabName);
// //   setKey(prev => prev + 1);
// // };

// // // Applications Report functions - UPDATED
// // const generateLeaveReport = async () => {
// //   try {
// //     setIsGeneratingReport(true);
    
// //     // Prepare parameters
// //     const params: any = {};

// //     // Add date filters
// //     if (reportFilters.startDate) {
// //       params.startDate = reportFilters.startDate;
// //     }
// //     if (reportFilters.endDate) {
// //       params.endDate = reportFilters.endDate;
// //     }

// //     // Add company filter if not 'all' - NOW USING ID
// //     if (reportFilters.company !== 'all') {
// //       params.company = reportFilters.company;
// //     }

// //     // Add department filter if not 'all' - USING ID
// //     if (reportFilters.department !== 'all') {
// //       params.department = reportFilters.department;
// //     }

// //     // Add status filter if not 'all'
// //     if (reportFilters.status !== 'all') {
// //       params.status = reportFilters.status;
// //     }

// //     // Add leave type filter if not 'all'
// //     if (reportFilters.leaveType !== 'all') {
// //       params.leaveType = reportFilters.leaveType;
// //     }

// //     console.log('Applications Report API Params:', params);

// //     const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //       },
// //       params: params
// //     });

// //     console.log('Applications Report API Response:', response.data);
    
// //     if (response.data && response.data.data) {
// //       setReportData(response.data.data);
// //       showNotification('Report generated successfully', 'success');
// //     } else {
// //       setReportData([]);
// //       showNotification('No data found for the selected filters', 'info');
// //     }
// //   } catch (err: any) {
// //     console.error('Error generating report:', err);
// //     const errorMessage = err.response?.data?.message || 'Failed to generate report';
// //     showNotification(errorMessage, 'error');
// //     setReportData([]);
// //   } finally {
// //     setIsGeneratingReport(false);
// //   }
// // };

// // // Balance Report functions - UPDATED
// // const generateBalanceReport = async () => {
// //   try {
// //     setIsGeneratingBalanceReport(true);
    
// //     // Prepare parameters
// //     const params: any = {
// //       asOfDate: balanceReportFilters.asOfDate
// //     };

// //     // Add company filter if not 'all' - NOW USING ID
// //     if (balanceReportFilters.company !== 'all') {
// //       params.company = balanceReportFilters.company;
// //     }

// //     // Add department filter if not 'all' - USING ID
// //     if (balanceReportFilters.department !== 'all') {
// //       params.department = balanceReportFilters.department;
// //     }

// //     // Add employee filter if not 'all' - USING ID
// //     if (balanceReportFilters.employeeId !== 'all') {
// //       params.employeeId = balanceReportFilters.employeeId;
// //     }

// //     console.log('Balance Report API Params:', params);

// //     const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/balance`, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //       },
// //       params: params
// //     });

// //     console.log('Balance Report API Response:', response.data);
    
// //     if (response.data && response.data.data) {
// //       setBalanceReportData(response.data.data);
// //       showNotification('Balance report generated successfully', 'success');
// //     } else {
// //       setBalanceReportData([]);
// //       showNotification('No data found for the selected filters', 'info');
// //     }
// //   } catch (err: any) {
// //     console.error('Error generating balance report:', err);
// //     const errorMessage = err.response?.data?.message || 'Failed to generate balance report';
// //     showNotification(errorMessage, 'error');
// //     setBalanceReportData([]);
// //   } finally {
// //     setIsGeneratingBalanceReport(false);
// //   }
// // };


// //   const exportApplicationsToCSV = () => {
// //     if (reportData.length === 0) {
// //       showNotification('No data to export', 'error');
// //       return;
// //     }

// //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// //     const csvContent = [
// //       headers.join(','),
// //       ...reportData.map(row => [
// //         row.employee_id || '',
// //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// //         row.start_date || '',
// //         row.end_date || '',
// //         row.days || '',
// //         row.status || '',
// //         `"${(row.company || '').replace(/"/g, '""')}"`,
// //         `"${(row.department || '').replace(/"/g, '""')}"`
// //       ].join(','))
// //     ].join('\n');

// //     downloadCSV(csvContent, `leave-applications-report-${new Date().toISOString().split('T')[0]}.csv`);
// //     showNotification('Applications report exported successfully', 'success');
// //   };

// //   const exportBalanceToCSV = () => {
// //     if (balanceReportData.length === 0) {
// //       showNotification('No data to export', 'error');
// //       return;
// //     }

// //     const headers = ['Employee ID', 'Employee Name', 'Company', 'Department', 'Leave Type', 'Total Allocated', 'Leaves Taken', 'Balance', 'Carry Forward'];
    
// //     const rows: string[] = [];
// //     balanceReportData.forEach(employee => {
// //       employee.leave_balances.forEach(balance => {
// //         rows.push([
// //           employee.employee_code || '',
// //           `"${(employee.employee_name || '').replace(/"/g, '""')}"`,
// //           `"${(employee.company || '').replace(/"/g, '""')}"`,
// //           `"${(employee.department || '').replace(/"/g, '""')}"`,
// //           `"${(balance.leave_type || '').replace(/"/g, '""')}"`,
// //           balance.total_allocated || 0,
// //           balance.leaves_taken || 0,
// //           balance.balance || 0,
// //           balance.carry_forward ? 'Yes' : 'No'
// //         ].join(','));
// //       });
// //     });

// //     const csvContent = [headers.join(','), ...rows].join('\n');
// //     downloadCSV(csvContent, `leave-balance-report-${new Date().toISOString().split('T')[0]}.csv`);
// //     showNotification('Balance report exported successfully', 'success');
// //   };

// //   const downloadCSV = (content: string, filename: string) => {
// //     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     const url = URL.createObjectURL(blob);
// //     link.setAttribute('href', url);
// //     link.setAttribute('download', filename);
// //     link.style.visibility = 'hidden';
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   const getBalanceColor = (balance: number, total: number) => {
// //     const percentage = (balance / total) * 100;
// //     if (percentage > 50) return 'text-green-600';
// //     if (percentage > 25) return 'text-yellow-600';
// //     return 'text-red-600';
// //   };


// // // Fetch employees for balance report - UPDATED
// // const fetchBalanceEmployee1 = async (companyId: string, departmentId: string) => {
// //   try {
// //     let employees: any[] = [];

// //     if (departmentId !== 'all') {
// //       // Fetch employees by department
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Employees by Department API Response:', response.data);
// //       employees = Array.isArray(response.data) ? response.data : [];
// //     } else {
// //       // Fetch employees by company
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Employees by Company API Response:', response.data);
// //       employees = Array.isArray(response.data) ? response.data : [];
// //     }

// //     const employeeOptions = employees.map((emp: any) => ({
// //       value: emp.id.toString(),
// //       label: `${emp.employee_no || ''} - ${emp.name}`
// //     }));

// //     setBalanceEmployees(employeeOptions);
// //   } catch (err) {
// //     console.error('Error fetching balance employees:', err);
// //     setBalanceEmployees([]);
// //   }
// // };

// // // Fetch employees for balance report - UPDATED
// // const fetchBalanceEmployees = async (companyId: string, departmentId: string) => {
// //   try {
// //     let employees: any[] = [];

// //     if (departmentId !== 'all') {
// //       // Fetch employees by department
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Employees by Department API Response:', response.data);
      
// //       // Handle different response structures
// //       if (response.data && Array.isArray(response.data)) {
// //         employees = response.data;
// //       } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// //         employees = response.data.employees;
// //       } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// //         employees = response.data.data;
// //       } else {
// //         console.warn('Unexpected API response structure for department employees:', response.data);
// //         employees = [];
// //       }
// //     } else {
// //       // Fetch employees by company
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Employees by Company API Response:', response.data);
      
// //       // Handle different response structures
// //       if (response.data && Array.isArray(response.data)) {
// //         employees = response.data;
// //       } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// //         employees = response.data.employees;
// //       } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// //         employees = response.data.data;
// //       } else {
// //         console.warn('Unexpected API response structure for company employees:', response.data);
// //         employees = [];
// //       }
// //     }

// //     console.log('Processed employees:', employees);

// //     const employeeOptions = employees
// //       .filter((emp: any) => emp && emp.id && emp.name) // Filter out invalid entries
// //       .map((emp: any) => ({
// //         value: emp.id.toString(),
// //         label: `${emp.employee_no || emp.employee_code || ''} - ${emp.name}`.trim()
// //       }));

// //     console.log('Employee options:', employeeOptions);
// //     setBalanceEmployees(employeeOptions);
// //   } catch (err) {
// //     console.error('Error fetching balance employees:', err);
// //     setBalanceEmployees([]);
// //   }
// // };

// // // Fetch departments for application report - UPDATED
// // const fetchApplicationDepartments = async (companyId: string) => {
// //   try {
// //     const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //       }
// //     });

// //     console.log('Application Departments API Response:', response.data);

// //     if (response.data.success && Array.isArray(response.data.departments)) {
// //       const departmentOptions = response.data.departments.map((dept: any) => ({
// //         value: dept.id.toString(),
// //         label: dept.department_name
// //       }));
// //       setApplicationDepartments(departmentOptions);
// //     } else {
// //       console.warn('No departments found in response');
// //       setApplicationDepartments([]);
// //     }
// //   } catch (err) {
// //     console.error('Error fetching application departments:', err);
// //     setApplicationDepartments([]);
// //   }
// // };

// // // Fetch departments for balance report - UPDATED
// // const fetchBalanceDepartments = async (companyId: string) => {
// //   try {
// //     const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //       }
// //     });

// //     console.log('Balance Departments API Response:', response.data);

// //     if (response.data.success && Array.isArray(response.data.departments)) {
// //       const departmentOptions = response.data.departments.map((dept: any) => ({
// //         value: dept.id.toString(),
// //         label: dept.department_name
// //       }));
// //       setBalanceDepartments(departmentOptions);
// //     } else {
// //       console.warn('No departments found in response');
// //       setBalanceDepartments([]);
// //     }
// //   } catch (err) {
// //     console.error('Error fetching balance departments:', err);
// //     setBalanceDepartments([]);
// //   }
// // };

// // // Application report useEffect - UPDATED
// // useEffect(() => {
// //   if (reportFilters.company !== 'all') {
// //     fetchApplicationDepartments(reportFilters.company);
// //   } else {
// //     setApplicationDepartments([]);
// //     setReportFilters(prev => ({ ...prev, department: 'all' }));
// //   }
// // }, [reportFilters.company]);

// // // Balance report useEffect - UPDATED
// // useEffect(() => {
// //   if (balanceReportFilters.company !== 'all') {
// //     fetchBalanceDepartments(balanceReportFilters.company);
// //     fetchBalanceEmployees(balanceReportFilters.company, 'all');
// //   } else {
// //     setBalanceDepartments([]);
// //     setBalanceEmployees([]);
// //     setBalanceReportFilters(prev => ({ ...prev, department: 'all', employeeId: 'all' }));
// //   }
// // }, [balanceReportFilters.company]);

// // // // Balance report department change useEffect - UPDATED
// // // useEffect(() => {
// // //   if (balanceReportFilters.company !== 'all') {
// // //     fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
// // //   }
// // // }, [balanceReportFilters.department]);

// // // Balance report department change useEffect - UPDATED
// // useEffect(() => {
// //   console.log('Department changed:', {
// //     company: balanceReportFilters.company,
// //     department: balanceReportFilters.department
// //   });
  
// //   if (balanceReportFilters.company !== 'all') {
// //     fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
// //   }
// // }, [balanceReportFilters.department]);

// //   return (
// //     <>
// //       <NotificationToast
// //         show={notification.show}
// //         message={notification.message}
// //         type={notification.type}
// //       />
      
// //       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// //           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// //             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// //             <span className="truncate">Manage Leaves</span>
// //           </h1>
          
// //   {/* Only show Export Report button for admin users */}
// //   {user?.role === 'admin' && (
// //     <button
// //       onClick={() => setShowReportModal(true)}
// //       className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
// //     >
// //       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
// //         <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
// //       </svg>
// //       <span className="hidden sm:inline">Export Report</span>
// //       <span className="sm:hidden">Reports</span>
// //     </button>
// //   )}
// //         </div>

// //         {/* Existing tabs content remains the same */}
// //         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// //           {user?.role !== 'admin' && (
// //             <>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Overview"
// //                 defaultChecked
// //                 onChange={() => handleTabChange('overview')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveOverview key={`overview-${key}`} />
// //               </div>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Requests"
// //                 defaultChecked={user?.role === 'admin'}
// //                 onChange={() => handleTabChange('requests')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveRequest key={`requests-${key}`} />
// //               </div>

// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Calendar"
// //                 onChange={() => handleTabChange('calendar')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveCalendar key={`calendar-${key}`} />
// //               </div>
// //             </>
// //           )}
// //           {user?.role === 'admin' && (
// //             <>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Requests"
// //                 defaultChecked
// //                 onChange={() => handleTabChange('requests')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <AdminLeaveRequest key={`requests-${key}`} />
// //               </div>

// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Types"
// //                 onChange={() => handleTabChange('types')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveType key={`types-${key}`} />
// //               </div>
// //             </>
// //           )}
// //         </div>

// //         {/* Report Modal */}
// //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// //             {/* Modal Header */}
// //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// //               <div className="flex items-center gap-4 relative z-10">
// //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// //                 </div>
                
// //                 <div className="flex flex-col">
// //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// //                     Leave Applications Report
// //                   </h3>
// //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// //                     Generate and export leave application reports
// //                   </p>
// //                 </div>
// //               </div>
              
// //               <button
// //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// //                 onClick={() => setShowReportModal(false)}
// //               >
// //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {/* Modal Content */}
// //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
// //               {/* Filters */}
// //               <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// //                 <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                   <FaFilter className="inline mr-2" />
// //                   Report Filters
// //                 </h4>
                
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //                   {/* Date Range */}
// //                   <div>
// //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       Start Date
// //                     </label>
// //                     <input
// //                       type="date"
// //                       value={reportFilters.startDate}
// //                       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                     />
// //                   </div>
                  
// //                   <div>
// //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       End Date
// //                     </label>
// //                     <input
// //                       type="date"
// //                       value={reportFilters.endDate}
// //                       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                     />
// //                   </div>

// //                 {/* Company Filter */}
// //                 <div>
// //                   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                     Company
// //                   </label>
// //                   <select
// //                     value={reportFilters.company}
// //                     onChange={(e) => setReportFilters(prev => ({ 
// //                       ...prev, 
// //                       company: e.target.value,
// //                       department: 'all'
// //                     }))}
// //                     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                   >
// //                     <option value="all">All Companies</option>
// //                     {companies.map(company => (
// //                       <option key={company.id} value={company.id}>{company.name}</option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                   {/* Status Filter */}
// //                   <div>
// //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       Status
// //                     </label>
// //                     <select
// //                       value={reportFilters.status}
// //                       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                     >
// //                       <option value="all">All Status</option>
// //                       <option value="PENDING">Pending</option>
// //                       <option value="APPROVED">Approved</option>
// //                       <option value="REJECTED">Rejected</option>
// //                       <option value="CANCELLED">Cancelled</option>
// //                     </select>
// //                   </div>

// //                   {/* Leave Type Filter */}
// //                   <div>
// //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       Leave Type
// //                     </label>
// //                     <select
// //                       value={reportFilters.leaveType}
// //                       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                     >
// //                       <option value="all">All Leave Types</option>
// //                       {/* You might want to fetch leave types dynamically */}
// //                       <option value="Annual Leave">Annual Leave</option>
// //                       <option value="Sick Leave">Sick Leave</option>
// //                       <option value="Maternity Leave">Maternity Leave</option>
// //                       <option value="Paternity Leave">Paternity Leave</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
// //                   <button
// //                     onClick={generateLeaveReport}
// //                     disabled={isGeneratingReport}
// //                     className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// //                   >
// //                     {isGeneratingReport ? (
// //                       <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// //                     ) : (
// //                       <FaChartBar className="h-4 w-4" />
// //                     )}
// //                     Generate Report
// //                   </button>
                  
// //                   <button
// //                     onClick={exportReportToCSV}
// //                     disabled={reportData.length === 0}
// //                     className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// //                   >
// //                     <FaFileExport className="h-4 w-4" />
// //                     Export to CSV
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Report Results */}
// //               {reportData.length > 0 && (
// //                 <div className="overflow-x-auto">
// //                   <table className="table table-zebra w-full">
// //                     <thead>
// //                       <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// //                         <th>Employee</th>
// //                         <th>Leave Type</th>
// //                         <th>Start Date</th>
// //                         <th>End Date</th>
// //                         <th>Days</th>
// //                         <th>Status</th>
// //                         <th>Company</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {reportData.map((item, index) => (
// //                         <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// //                           <td>
// //                             <div className="font-medium">{item.employee_name}</div>
// //                             <div className="text-sm opacity-70">{item.employee_id}</div>
// //                           </td>
// //                           <td>{item.leave_type}</td>
// //                           <td>{new Date(item.start_date).toLocaleDateString()}</td>
// //                           <td>{new Date(item.end_date).toLocaleDateString()}</td>
// //                           <td>{item.days}</td>
// //                           <td>
// //                             <span className={`badge ${
// //                               item.status === 'APPROVED' ? 'badge-success' :
// //                               item.status === 'REJECTED' ? 'badge-error' :
// //                               item.status === 'PENDING' ? 'badge-warning' :
// //                               'badge-neutral'
// //                             }`}>
// //                               {item.status}
// //                             </span>
// //                           </td>
// //                           <td>{item.company}</td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
                  
// //                   <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                     Total Records: {reportData.length}
// //                   </div>
// //                 </div>
// //               )}

// //               {reportData.length === 0 && !isGeneratingReport && (
// //                 <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                   <FaChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                   <p>No report data generated yet. Apply filters and click "Generate Report".</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <form method="dialog" className="modal-backdrop">
// //             <button onClick={() => setShowReportModal(false)}>close</button>
// //           </form>
// //         </dialog>
        

// //         {/* Enhanced Report Modal */}
// //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// //             {/* Modal Header */}
// //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// //               <div className="flex items-center gap-4 relative z-10">
// //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// //                 </div>
                
// //                 <div className="flex flex-col">
// //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// //                     Leave Reports
// //                   </h3>
// //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// //                     Generate and export comprehensive leave reports
// //                   </p>
// //                 </div>
// //               </div>
              
// //               <button
// //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// //                 onClick={() => setShowReportModal(false)}
// //               >
// //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {/* Report Type Selection */}
// //             <div className="flex border-b border-slate-200 dark:border-slate-600">
// //               <button
// //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// //                   activeReportType === 'applications' 
// //                     ? theme === 'light' 
// //                       ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
// //                       : 'bg-blue-900/30 text-blue-300 border-b-2 border-blue-400'
// //                     : theme === 'light'
// //                       ? 'text-slate-600 hover:bg-slate-50'
// //                       : 'text-slate-400 hover:bg-slate-700/50'
// //                 }`}
// //                 onClick={() => setActiveReportType('applications')}
// //               >
// //                 <FaRegCalendarTimes className="inline mr-2 h-4 w-4" />
// //                 Applications Report
// //               </button>
// //               <button
// //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// //                   activeReportType === 'balance' 
// //                     ? theme === 'light' 
// //                       ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
// //                       : 'bg-green-900/30 text-green-300 border-b-2 border-green-400'
// //                     : theme === 'light'
// //                       ? 'text-slate-600 hover:bg-slate-50'
// //                       : 'text-slate-400 hover:bg-slate-700/50'
// //                 }`}
// //                 onClick={() => setActiveReportType('balance')}
// //               >
// //                 <FaUsers className="inline mr-2 h-4 w-4" />
// //                 Balance Report
// //               </button>
// //             </div>

// //             {/* Modal Content */}
// //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
// //               {/* Applications Report */}
// //               {activeReportType === 'applications' && (
// //                 <div>
// //                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// //                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       <FaFilter className="inline mr-2" />
// //                       Applications Report Filters
// //                     </h4>
                    
// // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //   {/* Date Range */}
// //   <div>
// //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //       Start Date
// //     </label>
// //     <input
// //       type="date"
// //       value={reportFilters.startDate}
// //       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// //       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //     />
// //   </div>
  
// //   <div>
// //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //       End Date
// //     </label>
// //     <input
// //       type="date"
// //       value={reportFilters.endDate}
// //       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// //       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //     />
// //   </div>

// // {/* Company Filter */}
// // <div>
// //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //     Company
// //   </label>
// //   <select
// //     value={reportFilters.company}
// //     onChange={(e) => setReportFilters(prev => ({ 
// //       ...prev, 
// //       company: e.target.value,
// //       department: 'all'
// //     }))}
// //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //   >
// //     <option value="all">All Companies</option>
// //     {companies.map(company => (
// //       <option key={company.id} value={company.id}>{company.name}</option>
// //     ))}
// //   </select>
// // </div>

// // {/* Application Report Department Filter */}
// // <div>
// //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //     Department 
// //     <span className="text-xs ml-2 opacity-70">
// //       ({applicationDepartments.length} available)
// //     </span>
// //   </label>
// //   <select
// //     value={reportFilters.department}
// //     onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
// //     disabled={reportFilters.company === 'all' || applicationDepartments.length === 0}
// //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${reportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //   >
// //     <option value="all">All Departments</option>
// //     {applicationDepartments.map(dept => (
// //       <option key={dept.value} value={dept.value}>{dept.label}</option>
// //     ))}
// //   </select>
// //   {reportFilters.company === 'all' && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //         Select a company first
// //       </span>
// //     </label>
// //   )}
// //   {reportFilters.company !== 'all' && applicationDepartments.length === 0 && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //         Loading departments...
// //       </span>
// //     </label>
// //   )}
// // </div>


// //   {/* Status Filter */}
// //   <div>
// //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //       Status
// //     </label>
// //     <select
// //       value={reportFilters.status}
// //       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// //       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //     >
// //       <option value="all">All Status</option>
// //       <option value="PENDING">Pending</option>
// //       <option value="APPROVED">Approved</option>
// //       <option value="REJECTED">Rejected</option>
// //       <option value="CANCELLED">Cancelled</option>
// //     </select>
// //   </div>

// //   {/* Leave Type Filter */}
// //   <div>
// //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //       Leave Type
// //     </label>
// //     <select
// //       value={reportFilters.leaveType}
// //       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// //       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //     >
// //       <option value="all">All Leave Types</option>
// //       <option value="Annual Leave">Annual Leave</option>
// //       <option value="Sick Leave">Sick Leave</option>
// //       <option value="Maternity Leave">Maternity Leave</option>
// //       <option value="Paternity Leave">Paternity Leave</option>
// //     </select>
// //   </div>
// // </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
// //                       <button
// //                         onClick={generateLeaveReport}
// //                         disabled={isGeneratingReport}
// //                         className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         {isGeneratingReport ? (
// //                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// //                         ) : (
// //                           <FaChartBar className="h-4 w-4" />
// //                         )}
// //                         Generate Applications Report
// //                       </button>
                      
// //                       <button
// //                         onClick={exportApplicationsToCSV}
// //                         disabled={reportData.length === 0}
// //                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         <FaFileExport className="h-4 w-4" />
// //                         Export to CSV
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Applications Report Results */}
// //                   {reportData.length > 0 && (
// //                     <div className="overflow-x-auto">
// //                       <table className="table table-zebra w-full">
// //                         <thead>
// //                           <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// //                             <th>Employee</th>
// //                             <th>Leave Type</th>
// //                             <th>Start Date</th>
// //                             <th>End Date</th>
// //                             <th>Days</th>
// //                             <th>Status</th>
// //                             <th>Company</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {reportData.map((item, index) => (
// //                             <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// //                               <td>
// //                                 <div className="font-medium">{item.employee_name}</div>
// //                                 <div className="text-sm opacity-70">{item.employee_id}</div>
// //                               </td>
// //                               <td>{item.leave_type}</td>
// //                               <td>{new Date(item.start_date).toLocaleDateString()}</td>
// //                               <td>{new Date(item.end_date).toLocaleDateString()}</td>
// //                               <td>{item.days}</td>
// //                               <td>
// //                                 <span className={`badge ${
// //                                   item.status === 'APPROVED' ? 'badge-success' :
// //                                   item.status === 'REJECTED' ? 'badge-error' :
// //                                   item.status === 'PENDING' ? 'badge-warning' :
// //                                   'badge-neutral'
// //                                 }`}>
// //                                   {item.status}
// //                                 </span>
// //                               </td>
// //                               <td>{item.company}</td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
                      
// //                       <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                         Total Records: {reportData.length}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {reportData.length === 0 && !isGeneratingReport && (
// //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                       <FaRegCalendarTimes className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                       <p>No applications data generated yet. Apply filters and click "Generate Applications Report".</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Balance Report */}
// // {/* Balance Report */}
// // {activeReportType === 'balance' && (
// //   <div>
// //     <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// //       <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //         <FaFilter className="inline mr-2" />
// //         Balance Report Filters
// //       </h4>
      
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// // {/* Company Filter */}
// // <div>
// //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //     <FaBuilding className="inline mr-1 h-3 w-3" />
// //     Company
// //   </label>
// //   <select
// //     value={balanceReportFilters.company}
// //     onChange={(e) => setBalanceReportFilters(prev => ({ 
// //       ...prev, 
// //       company: e.target.value,
// //       department: 'all',
// //       employeeId: 'all'
// //     }))}
// //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //   >
// //     <option value="all">All Companies</option>
// //     {companies.map(company => (
// //       <option key={company.id} value={company.id}>{company.name}</option>
// //     ))}
// //   </select>
// // </div>


// // {/* Balance Report Department Filter */}
// // <div>
// //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //     Department 
// //     <span className="text-xs ml-2 opacity-70">
// //       ({balanceDepartments.length} available)
// //     </span>
// //   </label>
// //   <select
// //     value={balanceReportFilters.department}
// //     onChange={(e) => setBalanceReportFilters(prev => ({ 
// //       ...prev, 
// //       department: e.target.value,
// //       employeeId: 'all'
// //     }))}
// //     disabled={balanceReportFilters.company === 'all' || balanceDepartments.length === 0}
// //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //   >
// //     <option value="all">All Departments</option>
// //     {balanceDepartments.map(dept => (
// //       <option key={dept.value} value={dept.value}>{dept.label}</option>
// //     ))}
// //   </select>
// //   {balanceReportFilters.company === 'all' && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //         Select a company first
// //       </span>
// //     </label>
// //   )}
// //   {balanceReportFilters.company !== 'all' && balanceDepartments.length === 0 && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //         Loading departments...
// //       </span>
// //     </label>
// //   )}
// // </div>

// // {/* Balance Report Employee Filter */}
// // <div>
// //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //     <FaUser className="inline mr-1 h-3 w-3" />
// //     Employee 
// //     <span className="text-xs ml-2 opacity-70">
// //       ({balanceEmployees.length} available)
// //     </span>
// //   </label>
// //   <select
// //     value={balanceReportFilters.employeeId}
// //     onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, employeeId: e.target.value }))}
// //     disabled={balanceReportFilters.company === 'all' || balanceEmployees.length === 0}
// //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //   >
// //     <option value="all">All Employees</option>
// //     {balanceEmployees.map(emp => (
// //       <option key={emp.value} value={emp.value}>{emp.label}</option>
// //     ))}
// //   </select>
// //   {balanceReportFilters.company === 'all' && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //         Select a company first
// //       </span>
// //     </label>
// //   )}
// //   {balanceReportFilters.company !== 'all' && balanceReportFilters.department !== 'all' && balanceEmployees.length === 0 && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //         {`No employees found in this department`}
// //       </span>
// //     </label>
// //   )}
// //   {balanceReportFilters.company !== 'all' && balanceReportFilters.department === 'all' && balanceEmployees.length === 0 && (
// //     <label className="label">
// //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //         Loading employees...
// //       </span>
// //     </label>
// //   )}
// // </div>

// //         {/* As of Date Filter */}
// //         <div>
// //           <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //             As of Date
// //           </label>
// //           <input
// //             type="date"
// //             value={balanceReportFilters.asOfDate}
// //             onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
// //             className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //           />
// //         </div>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="flex flex-col sm:flex-row gap-2 mt-4">
// //         <button
// //           onClick={generateBalanceReport}
// //           disabled={isGeneratingBalanceReport}
// //           className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// //         >
// //           {isGeneratingBalanceReport ? (
// //             <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// //           ) : (
// //             <FaUsers className="h-4 w-4" />
// //           )}
// //           Generate Balance Report
// //         </button>
        
// //         <button
// //           onClick={exportBalanceToCSV}
// //           disabled={balanceReportData.length === 0}
// //           className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0 flex items-center gap-2`}
// //         >
// //           <FaFileExport className="h-4 w-4" />
// //           Export to CSV
// //         </button>
// //                     </div>
// //                   </div>

// //                   {/* Balance Report Results */}
// //                   {balanceReportData.length > 0 && (
// //                     <div className="space-y-6">
// //                       {balanceReportData.map((employee, index) => (
// //                         <div key={employee.employee_id} className={`border rounded-lg ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
// //                           {/* Employee Header */}
// //                           <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
// //                             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
// //                               <div>
// //                                 <h4 className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
// //                                   {employee.employee_name}
// //                                 </h4>
// //                                 <div className="flex flex-wrap gap-4 mt-1 text-sm">
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     ID: {employee.employee_code}
// //                                   </span>
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     Company: {employee.company}
// //                                   </span>
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     Department: {employee.department}
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                               <div className={`text-sm font-medium mt-2 sm:mt-0 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                                 Total Leave Types: {employee.leave_balances.length}
// //                               </div>
// //                             </div>
// //                           </div>

// //                           {/* Leave Balances */}
// //                           <div className="overflow-x-auto">
// //                             <table className="table table-zebra w-full">
// //                               <thead>
// //                                 <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// //                                   <th>Leave Type</th>
// //                                   <th>Total Allocated</th>
// //                                   <th>Leaves Taken</th>
// //                                   <th>Balance</th>
// //                                   <th>Carry Forward</th>
// //                                   <th>Status</th>
// //                                 </tr>
// //                               </thead>
// //                               <tbody>
// //                                 {employee.leave_balances.map((balance, balanceIndex) => (
// //                                   <tr key={balanceIndex} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// //                                     <td className="font-medium">{balance.leave_type}</td>
// //                                     <td>{balance.total_allocated}</td>
// //                                     <td>{balance.leaves_taken}</td>
// //                                     <td>
// //                                       <span className={`font-bold ${getBalanceColor(balance.balance, balance.total_allocated)}`}>
// //                                         {balance.balance}
// //                                       </span>
// //                                     </td>
// //                                     <td>
// //                                       <span className={`badge ${balance.carry_forward ? 'badge-success' : 'badge-neutral'}`}>
// //                                         {balance.carry_forward ? 'Yes' : 'No'}
// //                                       </span>
// //                                     </td>
// //                                     <td>
// //                                       <span className={`badge ${balance.leave_type_active ? 'badge-success' : 'badge-error'}`}>
// //                                         {balance.leave_type_active ? 'Active' : 'Inactive'}
// //                                       </span>
// //                                     </td>
// //                                   </tr>
// //                                 ))}
// //                               </tbody>
// //                             </table>
// //                           </div>
// //                         </div>
// //                       ))}
                      
// //                       <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                         Total Employees: {balanceReportData.length} | 
// //                         Generated on: {new Date().toLocaleDateString()}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {balanceReportData.length === 0 && !isGeneratingBalanceReport && (
// //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                       <FaUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                       <p>No balance data generated yet. Apply filters and click "Generate Balance Report".</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <form method="dialog" className="modal-backdrop">
// //             <button onClick={() => setShowReportModal(false)}>close</button>
// //           </form>
// //         </dialog>
// //       </div>
// //     </>
// //   )
// // }

// // export default LeavesPage;




// //0212


// // // // // 'use client';

// // // // // import React, { useState, useEffect } from 'react'
// // // // // import LeaveOverview from './LeaveOverview';
// // // // // import LeaveCalendar from './LeaveCalendar';
// // // // // import LeaveRequest from './LeaveRequest';
// // // // // import AdminLeaveRequest from './AdminLeaveRequest';
// // // // // // The LeaveType import will only be used by admin users
// // // // // import LeaveType from './LeaveType';
// // // // // import { FaRegCalendarTimes } from "react-icons/fa";
// // // // // import { useTheme } from '../components/ThemeProvider';

// // // // // interface User {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   role: string;
// // // // // }

// // // // // const LeavesPage = () => {
// // // // //   const { theme } = useTheme();
// // // // //   const [key, setKey] = useState(0);
// // // // //   const [user, setUser] = useState<User | null>(null);
// // // // //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// // // // //   const [activeTab, setActiveTab] = useState('');

// // // // //   useEffect(() => {
// // // // //     const user = localStorage.getItem('hrms_user');
// // // // //     if (user) {
// // // // //       const userData = JSON.parse(user);
// // // // //       setUser(userData);
// // // // //     }

// // // // //     // Get last opened menu from localStorage
// // // // //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// // // // //     setLastOpenedMenu(lastMenu);
// // // // //   }, []);

// // // // //   const handleTabChange = (tabName: string) => {
// // // // //     setActiveTab(tabName);
// // // // //     setKey(prev => prev + 1);
// // // // //   };

// // // // //   return (
// // // // //     <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // // // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// // // // //         <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// // // // //           <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// // // // //           <span className="truncate">Manage Leaves</span>
// // // // //         </h1>
// // // // //       </div>

// // // // //       <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// // // // //         {user?.role !== 'admin' && (
// // // // //           <>
// // // // //             <input
// // // // //               type="radio"
// // // // //               name="leaves_tabs"
// // // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // // //               aria-label="Overview"
// // // // //               defaultChecked
// // // // //               onChange={() => handleTabChange('overview')}
// // // // //             />
// // // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // // //               <LeaveOverview key={`overview-${key}`} />
// // // // //             </div>
// // // // //             <input
// // // // //               type="radio"
// // // // //               name="leaves_tabs"
// // // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // // //               aria-label="Leave Requests"
// // // // //               defaultChecked={user?.role === 'admin'}
// // // // //               onChange={() => handleTabChange('requests')}
// // // // //             />
// // // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // // //               <LeaveRequest key={`requests-${key}`} />
// // // // //             </div>

// // // // //             <input
// // // // //               type="radio"
// // // // //               name="leaves_tabs"
// // // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // // //               aria-label="Calendar"
// // // // //               onChange={() => handleTabChange('calendar')}
// // // // //             />
// // // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // // //               <LeaveCalendar key={`calendar-${key}`} />
// // // // //             </div>
// // // // //           </>
// // // // //         )}
// // // // //         {user?.role === 'admin' && (
// // // // //           <>
// // // // //             <input
// // // // //               type="radio"
// // // // //               name="leaves_tabs"
// // // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // // //               aria-label="Leave Requests"
// // // // //               defaultChecked
// // // // //               onChange={() => handleTabChange('requests')}
// // // // //             />
// // // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // // //               <AdminLeaveRequest key={`requests-${key}`} />
// // // // //             </div>

// // // // //             <input
// // // // //               type="radio"
// // // // //               name="leaves_tabs"
// // // // //               className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // // //               aria-label="Leave Types"
// // // // //               onChange={() => handleTabChange('types')}
// // // // //             />
// // // // //             <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // // //               <LeaveType key={`types-${key}`} />
// // // // //             </div>
// // // // //           </>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default LeavesPage

// // // // 'use client';

// // // // import React, { useState, useEffect } from 'react'
// // // // import LeaveOverview from './LeaveOverview';
// // // // import LeaveCalendar from './LeaveCalendar';
// // // // import LeaveRequest from './LeaveRequest';
// // // // import AdminLeaveRequest from './AdminLeaveRequest';
// // // // // The LeaveType import will only be used by admin users
// // // // import LeaveType from './LeaveType';
// // // // import { FaRegCalendarTimes, FaChartBar, FaFileExport, FaFilter } from "react-icons/fa";
// // // // import { useTheme } from '../components/ThemeProvider';
// // // // import axios from 'axios';
// // // // import { API_BASE_URL } from '../config';
// // // // import { useNotification } from '../hooks/useNotification';
// // // // import NotificationToast from '../components/NotificationToast';

// // // // interface User {
// // // //   id: number;
// // // //   name: string;
// // // //   email: string;
// // // //   role: string;
// // // // }

// // // // // Report data interface
// // // // interface LeaveReportData {
// // // //   employee_id: string;
// // // //   employee_name: string;
// // // //   leave_type: string;
// // // //   start_date: string;
// // // //   end_date: string;
// // // //   days: number;
// // // //   status: string;
// // // //   company: string;
// // // //   department: string;
// // // // }

// // // // const LeavesPage = () => {
// // // //   const { theme } = useTheme();
// // // //   const { notification, showNotification } = useNotification();
// // // //   const [key, setKey] = useState(0);
// // // //   const [user, setUser] = useState<User | null>(null);
// // // //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// // // //   const [activeTab, setActiveTab] = useState('');

// // // //   // Report states
// // // //   const [showReportModal, setShowReportModal] = useState(false);
// // // //   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
// // // //   const [reportFilters, setReportFilters] = useState({
// // // //     startDate: '',
// // // //     endDate: '',
// // // //     company: 'all',
// // // //     department: 'all',
// // // //     status: 'all',
// // // //     leaveType: 'all'
// // // //   });
// // // //   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
// // // //   const [companies, setCompanies] = useState<string[]>([]);

// // // //   useEffect(() => {
// // // //     const user = localStorage.getItem('hrms_user');
// // // //     if (user) {
// // // //       const userData = JSON.parse(user);
// // // //       setUser(userData);
// // // //     }

// // // //     // Get last opened menu from localStorage
// // // //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// // // //     setLastOpenedMenu(lastMenu);

// // // //     // Fetch companies for report filter
// // // //     fetchCompanies();
// // // //   }, []);

// // // // const fetchCompanies = async () => {
// // // //   try {
// // // //     const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// // // //       headers: {
// // // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //       }
// // // //     });
    
// // // //     if (response.data && Array.isArray(response.data)) {
// // // //       // Filter out inactive companies and handle duplicates
// // // //       const uniqueCompanies = response.data
// // // //         .filter((company: any) => company.is_active === 1) // Only active companies
// // // //         .filter((company: any, index, self) => 
// // // //           // Remove duplicates by company name
// // // //           index === self.findIndex((c: any) => (
// // // //             c.company_name === company.company_name
// // // //           ))
// // // //         )
// // // //         .map((company: any) => company.company_name)
// // // //         .filter((name: string | null) => name !== null && name.trim() !== '') // Remove null/empty names
// // // //         .sort(); // Sort alphabetically
      
// // // //       setCompanies(uniqueCompanies);
// // // //     }
// // // //   } catch (err) {
// // // //     console.error('Error fetching companies:', err);
// // // //     // Fallback to empty array if API fails
// // // //     setCompanies([]);
// // // //   }
// // // // };
// // // //   const handleTabChange = (tabName: string) => {
// // // //     setActiveTab(tabName);
// // // //     setKey(prev => prev + 1);
// // // //   };

// // // //   // Report functions
// // // //   const generateLeaveReport = async () => {
// // // //     try {
// // // //       setIsGeneratingReport(true);
      
// // // //       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
// // // //         headers: {
// // // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //         },
// // // //         params: {
// // // //           startDate: reportFilters.startDate,
// // // //           endDate: reportFilters.endDate,
// // // //           company: reportFilters.company !== 'all' ? reportFilters.company : undefined,
// // // //           department: reportFilters.department !== 'all' ? reportFilters.department : undefined,
// // // //           status: reportFilters.status !== 'all' ? reportFilters.status : undefined,
// // // //           leaveType: reportFilters.leaveType !== 'all' ? reportFilters.leaveType : undefined
// // // //         }
// // // //       });
      
// // // //       setReportData(response.data.data);
// // // //       showNotification('Report generated successfully', 'success');
// // // //     } catch (err) {
// // // //       console.error('Error generating report:', err);
// // // //       showNotification('Failed to generate report', 'error');
// // // //     } finally {
// // // //       setIsGeneratingReport(false);
// // // //     }
// // // //   };

// // // //   const exportReportToCSV = () => {
// // // //     if (reportData.length === 0) {
// // // //       showNotification('No data to export', 'error');
// // // //       return;
// // // //     }

// // // //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// // // //     const csvContent = [
// // // //       headers.join(','),
// // // //       ...reportData.map(row => [
// // // //         row.employee_id || '',
// // // //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// // // //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// // // //         row.start_date || '',
// // // //         row.end_date || '',
// // // //         row.days || '',
// // // //         row.status || '',
// // // //         `"${(row.company || '').replace(/"/g, '""')}"`,
// // // //         `"${(row.department || '').replace(/"/g, '""')}"`
// // // //       ].join(','))
// // // //     ].join('\n');

// // // //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // // //     const link = document.createElement('a');
// // // //     const url = URL.createObjectURL(blob);
// // // //     link.setAttribute('href', url);
// // // //     link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
// // // //     link.style.visibility = 'hidden';
// // // //     document.body.appendChild(link);
// // // //     link.click();
// // // //     document.body.removeChild(link);
    
// // // //     showNotification('Report exported successfully', 'success');
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {/* Notification Toast */}
// // // //       <NotificationToast
// // // //         show={notification.show}
// // // //         message={notification.message}
// // // //         type={notification.type}
// // // //       />
      
// // // //       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// // // //           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// // // //             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// // // //             <span className="truncate">Manage Leaves</span>
// // // //           </h1>
          
// // // //           {/* Report Button - Show for all users */}
// // // //           <button
// // // //             onClick={() => setShowReportModal(true)}
// // // //             className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
// // // //           >
// // // //             <FaChartBar className="h-4 w-4" />
// // // //             <span className="hidden sm:inline">Leave Report</span>
// // // //             <span className="sm:hidden">Report</span>
// // // //           </button>
// // // //         </div>

// // // //         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// // // //           {user?.role !== 'admin' && (
// // // //             <>
// // // //               <input
// // // //                 type="radio"
// // // //                 name="leaves_tabs"
// // // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //                 aria-label="Overview"
// // // //                 defaultChecked
// // // //                 onChange={() => handleTabChange('overview')}
// // // //               />
// // // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //                 <LeaveOverview key={`overview-${key}`} />
// // // //               </div>
// // // //               <input
// // // //                 type="radio"
// // // //                 name="leaves_tabs"
// // // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //                 aria-label="Leave Requests"
// // // //                 defaultChecked={user?.role === 'admin'}
// // // //                 onChange={() => handleTabChange('requests')}
// // // //               />
// // // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //                 <LeaveRequest key={`requests-${key}`} />
// // // //               </div>

// // // //               <input
// // // //                 type="radio"
// // // //                 name="leaves_tabs"
// // // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //                 aria-label="Calendar"
// // // //                 onChange={() => handleTabChange('calendar')}
// // // //               />
// // // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //                 <LeaveCalendar key={`calendar-${key}`} />
// // // //               </div>
// // // //             </>
// // // //           )}
// // // //           {user?.role === 'admin' && (
// // // //             <>
// // // //               <input
// // // //                 type="radio"
// // // //                 name="leaves_tabs"
// // // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //                 aria-label="Leave Requests"
// // // //                 defaultChecked
// // // //                 onChange={() => handleTabChange('requests')}
// // // //               />
// // // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //                 <AdminLeaveRequest key={`requests-${key}`} />
// // // //               </div>

// // // //               <input
// // // //                 type="radio"
// // // //                 name="leaves_tabs"
// // // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // // //                 aria-label="Leave Types"
// // // //                 onChange={() => handleTabChange('types')}
// // // //               />
// // // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // // //                 <LeaveType key={`types-${key}`} />
// // // //               </div>
// // // //             </>
// // // //           )}
// // // //         </div>

// // // //         {/* Report Modal */}
// // // //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// // // //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// // // //             {/* Modal Header */}
// // // //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// // // //               <div className="flex items-center gap-4 relative z-10">
// // // //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// // // //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// // // //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// // // //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// // // //                 </div>
                
// // // //                 <div className="flex flex-col">
// // // //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// // // //                     Leave Applications Report
// // // //                   </h3>
// // // //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// // // //                     Generate and export leave application reports
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
              
// // // //               <button
// // // //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// // // //                 onClick={() => setShowReportModal(false)}
// // // //               >
// // // //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// // // //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //                 </svg>
// // // //               </button>
// // // //             </div>

// // // //             {/* Modal Content */}
// // // //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
// // // //               {/* Filters */}
// // // //               <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// // // //                 <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                   <FaFilter className="inline mr-2" />
// // // //                   Report Filters
// // // //                 </h4>
                
// // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //                   {/* Date Range */}
// // // //                   <div>
// // // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                       Start Date
// // // //                     </label>
// // // //                     <input
// // // //                       type="date"
// // // //                       value={reportFilters.startDate}
// // // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// // // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // // //                     />
// // // //                   </div>
                  
// // // //                   <div>
// // // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                       End Date
// // // //                     </label>
// // // //                     <input
// // // //                       type="date"
// // // //                       value={reportFilters.endDate}
// // // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// // // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // // //                     />
// // // //                   </div>

// // // //                   {/* Company Filter */}
// // // //                   <div>
// // // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                       Company
// // // //                     </label>
// // // //                     <select
// // // //                       value={reportFilters.company}
// // // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, company: e.target.value }))}
// // // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // // //                     >
// // // //                       <option value="all">All Companies</option>
// // // //                       {companies.map(company => (
// // // //                         <option key={company} value={company}>{company}</option>
// // // //                       ))}
// // // //                     </select>
// // // //                   </div>

// // // //                   {/* Status Filter */}
// // // //                   <div>
// // // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                       Status
// // // //                     </label>
// // // //                     <select
// // // //                       value={reportFilters.status}
// // // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// // // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // // //                     >
// // // //                       <option value="all">All Status</option>
// // // //                       <option value="PENDING">Pending</option>
// // // //                       <option value="APPROVED">Approved</option>
// // // //                       <option value="REJECTED">Rejected</option>
// // // //                       <option value="CANCELLED">Cancelled</option>
// // // //                     </select>
// // // //                   </div>

// // // //                   {/* Leave Type Filter */}
// // // //                   <div>
// // // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // // //                       Leave Type
// // // //                     </label>
// // // //                     <select
// // // //                       value={reportFilters.leaveType}
// // // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// // // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // // //                     >
// // // //                       <option value="all">All Leave Types</option>
// // // //                       {/* You might want to fetch leave types dynamically */}
// // // //                       <option value="Annual Leave">Annual Leave</option>
// // // //                       <option value="Sick Leave">Sick Leave</option>
// // // //                       <option value="Maternity Leave">Maternity Leave</option>
// // // //                       <option value="Paternity Leave">Paternity Leave</option>
// // // //                     </select>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Action Buttons */}
// // // //                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
// // // //                   <button
// // // //                     onClick={generateLeaveReport}
// // // //                     disabled={isGeneratingReport}
// // // //                     className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// // // //                   >
// // // //                     {isGeneratingReport ? (
// // // //                       <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// // // //                     ) : (
// // // //                       <FaChartBar className="h-4 w-4" />
// // // //                     )}
// // // //                     Generate Report
// // // //                   </button>
                  
// // // //                   <button
// // // //                     onClick={exportReportToCSV}
// // // //                     disabled={reportData.length === 0}
// // // //                     className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// // // //                   >
// // // //                     <FaFileExport className="h-4 w-4" />
// // // //                     Export to CSV
// // // //                   </button>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Report Results */}
// // // //               {reportData.length > 0 && (
// // // //                 <div className="overflow-x-auto">
// // // //                   <table className="table table-zebra w-full">
// // // //                     <thead>
// // // //                       <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// // // //                         <th>Employee</th>
// // // //                         <th>Leave Type</th>
// // // //                         <th>Start Date</th>
// // // //                         <th>End Date</th>
// // // //                         <th>Days</th>
// // // //                         <th>Status</th>
// // // //                         <th>Company</th>
// // // //                       </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                       {reportData.map((item, index) => (
// // // //                         <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// // // //                           <td>
// // // //                             <div className="font-medium">{item.employee_name}</div>
// // // //                             <div className="text-sm opacity-70">{item.employee_id}</div>
// // // //                           </td>
// // // //                           <td>{item.leave_type}</td>
// // // //                           <td>{new Date(item.start_date).toLocaleDateString()}</td>
// // // //                           <td>{new Date(item.end_date).toLocaleDateString()}</td>
// // // //                           <td>{item.days}</td>
// // // //                           <td>
// // // //                             <span className={`badge ${
// // // //                               item.status === 'APPROVED' ? 'badge-success' :
// // // //                               item.status === 'REJECTED' ? 'badge-error' :
// // // //                               item.status === 'PENDING' ? 'badge-warning' :
// // // //                               'badge-neutral'
// // // //                             }`}>
// // // //                               {item.status}
// // // //                             </span>
// // // //                           </td>
// // // //                           <td>{item.company}</td>
// // // //                         </tr>
// // // //                       ))}
// // // //                     </tbody>
// // // //                   </table>
                  
// // // //                   <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // // //                     Total Records: {reportData.length}
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               {reportData.length === 0 && !isGeneratingReport && (
// // // //                 <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // // //                   <FaChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // // //                   <p>No report data generated yet. Apply filters and click "Generate Report".</p>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //           <form method="dialog" className="modal-backdrop">
// // // //             <button onClick={() => setShowReportModal(false)}>close</button>
// // // //           </form>
// // // //         </dialog>
// // // //       </div>
// // // //     </>
// // // //   )
// // // // }

// // // // export default LeavesPage

// // // 'use client';

// // // import React, { useState, useEffect } from 'react'
// // // import LeaveOverview from './LeaveOverview';
// // // import LeaveCalendar from './LeaveCalendar';
// // // import LeaveRequest from './LeaveRequest';
// // // import AdminLeaveRequest from './AdminLeaveRequest';
// // // import LeaveType from './LeaveType';
// // // import { 
// // //   FaRegCalendarTimes, 
// // //   FaChartBar, 
// // //   FaFileExport, 
// // //   FaFilter, 
// // //   FaUser,
// // //   FaBuilding,
// // //   FaUsers 
// // // } from "react-icons/fa";
// // // import { useTheme } from '../components/ThemeProvider';
// // // import axios from 'axios';
// // // import { API_BASE_URL } from '../config';
// // // import { useNotification } from '../hooks/useNotification';
// // // import NotificationToast from '../components/NotificationToast';
// // // import { ImportIcon } from 'lucide-react';
// // // import { CiImport } from 'react-icons/ci';

// // // interface User {
// // //   id: number;
// // //   name: string;
// // //   email: string;
// // //   role: string;
// // // }

// // // // Report data interfaces
// // // interface LeaveReportData {
// // //   employee_id: string;
// // //   employee_name: string;
// // //   leave_type: string;
// // //   start_date: string;
// // //   end_date: string;
// // //   days: number;
// // //   status: string;
// // //   company: string;
// // //   department: string;
// // // }

// // // interface LeaveBalanceData {
// // //   employee_id: string;
// // //   employee_code: string;
// // //   employee_name: string;
// // //   email: string;
// // //   company: string;
// // //   department: string;
// // //   leave_balances: {
// // //     leave_type: string;
// // //     total_allocated: number;
// // //     leaves_taken: number;
// // //     balance: number;
// // //     carry_forward: boolean;
// // //     carry_forward_balance: number;
// // //     leave_type_active: boolean;
// // //   }[];
// // // }

// // // interface FilterOption {
// // //   value: string;
// // //   label: string;
// // //   company?: string;
// // // }

// // // interface Company {
// // //   id: number;
// // //   name: string;
// // // }


// // // const LeavesPage = () => {
// // //   const { theme } = useTheme();
// // //   const { notification, showNotification } = useNotification();
// // //   const [key, setKey] = useState(0);
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// // //   const [activeTab, setActiveTab] = useState('');

// // //   // Report states
// // //   const [showReportModal, setShowReportModal] = useState(false);
// // //   const [activeReportType, setActiveReportType] = useState<'applications' | 'balance'>('applications');
// // //   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
// // //   const [balanceReportData, setBalanceReportData] = useState<LeaveBalanceData[]>([]);
  
// // //   // Report filters
// // //   const [reportFilters, setReportFilters] = useState({
// // //     startDate: '',
// // //     endDate: '',
// // //     company: 'all',
// // //     department: 'all',
// // //     status: 'all',
// // //     leaveType: 'all'
// // //   });

// // //   const [balanceReportFilters, setBalanceReportFilters] = useState({
// // //     company: 'all',
// // //     department: 'all',
// // //     employeeId: 'all',
// // //     asOfDate: new Date().toISOString().split('T')[0]
// // //   });

// // // const [isGeneratingReport, setIsGeneratingReport] = useState(false);
// // // const [isGeneratingBalanceReport, setIsGeneratingBalanceReport] = useState(false);
// // // const [companies, setCompanies] = useState<Company[]>([]);

// // // const [applicationDepartments, setApplicationDepartments] = useState<FilterOption[]>([]);
// // // const [balanceDepartments, setBalanceDepartments] = useState<FilterOption[]>([]);
// // // const [balanceEmployees, setBalanceEmployees] = useState<FilterOption[]>([]);

// // // useEffect(() => {
// // //   const user = localStorage.getItem('hrms_user');
// // //   if (user) {
// // //     const userData = JSON.parse(user);
// // //     setUser(userData);
// // //   }

// // //   const lastMenu = localStorage.getItem('lastOpenedMenu');
// // //   setLastOpenedMenu(lastMenu);

// // //   fetchCompanies();
// // // }, []);

// // // useEffect(() => {
// // //   if (reportFilters.company !== 'all') {
// // //     fetchApplicationDepartments(reportFilters.company);
// // //   } else {
// // //     setApplicationDepartments([]);
// // //   }
// // // }, [reportFilters.company]);

// // // const exportReportToCSV = () => {
// // //   if (reportData.length === 0) {
// // //     showNotification('No data to export', 'error');
// // //     return;
// // //   }

// // //   const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// // //   const csvContent = [
// // //     headers.join(','),
// // //     ...reportData.map(row => [
// // //       row.employee_id || '',
// // //       `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// // //       `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// // //       row.start_date || '',
// // //       row.end_date || '',
// // //       row.days || '',
// // //       row.status || '',
// // //       `"${(row.company || '').replace(/"/g, '""')}"`,
// // //       `"${(row.department || '').replace(/"/g, '""')}"`
// // //     ].join(','))
// // //   ].join('\n');

// // //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //   const link = document.createElement('a');
// // //   const url = URL.createObjectURL(blob);
// // //   link.setAttribute('href', url);
// // //   link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
// // //   link.style.visibility = 'hidden';
// // //   document.body.appendChild(link);
// // //   link.click();
// // //   document.body.removeChild(link);
  
// // //   showNotification('Report exported successfully', 'success');
// // // };

// // // const fetchCompanies = async () => {
// // // try {
// // //   const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// // //     headers: {
// // //       Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //     }
// // //   });
  
// // //   if (response.data && Array.isArray(response.data)) {
// // //     const uniqueCompanies = response.data
// // //       .filter((company: any) => company.is_active === 1)
// // //       .filter((company: any, index, self) => 
// // //         index === self.findIndex((c: any) => c.id === company.id)
// // //       )
// // //       .map((company: any) => ({
// // //         id: company.id,
// // //         name: company.company_name || company.name
// // //       }))
// // //       .sort((a, b) => a.name.localeCompare(b.name));
    
// // //     setCompanies(uniqueCompanies);
// // //   }
// // // } catch (err) {
// // //   console.error('Error fetching companies:', err);
// // //   setCompanies([]);
// // // }
// // // };

// // // const handleTabChange = (tabName: string) => {
// // //   setActiveTab(tabName);
// // //   setKey(prev => prev + 1);
// // // };

// // // // Applications Report functions - UPDATED
// // // const generateLeaveReport = async () => {
// // //   try {
// // //     setIsGeneratingReport(true);
    
// // //     // Prepare parameters
// // //     const params: any = {};

// // //     // Add date filters
// // //     if (reportFilters.startDate) {
// // //       params.startDate = reportFilters.startDate;
// // //     }
// // //     if (reportFilters.endDate) {
// // //       params.endDate = reportFilters.endDate;
// // //     }

// // //     // Add company filter if not 'all' - NOW USING ID
// // //     if (reportFilters.company !== 'all') {
// // //       params.company = reportFilters.company;
// // //     }

// // //     // Add department filter if not 'all' - USING ID
// // //     if (reportFilters.department !== 'all') {
// // //       params.department = reportFilters.department;
// // //     }

// // //     // Add status filter if not 'all'
// // //     if (reportFilters.status !== 'all') {
// // //       params.status = reportFilters.status;
// // //     }

// // //     // Add leave type filter if not 'all'
// // //     if (reportFilters.leaveType !== 'all') {
// // //       params.leaveType = reportFilters.leaveType;
// // //     }

// // //     console.log('Applications Report API Params:', params);

// // //     const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
// // //       headers: {
// // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //       },
// // //       params: params
// // //     });

// // //     console.log('Applications Report API Response:', response.data);
    
// // //     if (response.data && response.data.data) {
// // //       setReportData(response.data.data);
// // //       showNotification('Report generated successfully', 'success');
// // //     } else {
// // //       setReportData([]);
// // //       showNotification('No data found for the selected filters', 'info');
// // //     }
// // //   } catch (err: any) {
// // //     console.error('Error generating report:', err);
// // //     const errorMessage = err.response?.data?.message || 'Failed to generate report';
// // //     showNotification(errorMessage, 'error');
// // //     setReportData([]);
// // //   } finally {
// // //     setIsGeneratingReport(false);
// // //   }
// // // };

// // // // Balance Report functions - UPDATED
// // // const generateBalanceReport = async () => {
// // //   try {
// // //     setIsGeneratingBalanceReport(true);
    
// // //     // Prepare parameters
// // //     const params: any = {
// // //       asOfDate: balanceReportFilters.asOfDate
// // //     };

// // //     // Add company filter if not 'all' - NOW USING ID
// // //     if (balanceReportFilters.company !== 'all') {
// // //       params.company = balanceReportFilters.company;
// // //     }

// // //     // Add department filter if not 'all' - USING ID
// // //     if (balanceReportFilters.department !== 'all') {
// // //       params.department = balanceReportFilters.department;
// // //     }

// // //     // Add employee filter if not 'all' - USING ID
// // //     if (balanceReportFilters.employeeId !== 'all') {
// // //       params.employeeId = balanceReportFilters.employeeId;
// // //     }

// // //     console.log('Balance Report API Params:', params);

// // //     const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/balance`, {
// // //       headers: {
// // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //       },
// // //       params: params
// // //     });

// // //     console.log('Balance Report API Response:', response.data);
    
// // //     if (response.data && response.data.data) {
// // //       setBalanceReportData(response.data.data);
// // //       showNotification('Balance report generated successfully', 'success');
// // //     } else {
// // //       setBalanceReportData([]);
// // //       showNotification('No data found for the selected filters', 'info');
// // //     }
// // //   } catch (err: any) {
// // //     console.error('Error generating balance report:', err);
// // //     const errorMessage = err.response?.data?.message || 'Failed to generate balance report';
// // //     showNotification(errorMessage, 'error');
// // //     setBalanceReportData([]);
// // //   } finally {
// // //     setIsGeneratingBalanceReport(false);
// // //   }
// // // };


// // //   const exportApplicationsToCSV = () => {
// // //     if (reportData.length === 0) {
// // //       showNotification('No data to export', 'error');
// // //       return;
// // //     }

// // //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// // //     const csvContent = [
// // //       headers.join(','),
// // //       ...reportData.map(row => [
// // //         row.employee_id || '',
// // //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// // //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// // //         row.start_date || '',
// // //         row.end_date || '',
// // //         row.days || '',
// // //         row.status || '',
// // //         `"${(row.company || '').replace(/"/g, '""')}"`,
// // //         `"${(row.department || '').replace(/"/g, '""')}"`
// // //       ].join(','))
// // //     ].join('\n');

// // //     downloadCSV(csvContent, `leave-applications-report-${new Date().toISOString().split('T')[0]}.csv`);
// // //     showNotification('Applications report exported successfully', 'success');
// // //   };

// // //   const exportBalanceToCSV = () => {
// // //     if (balanceReportData.length === 0) {
// // //       showNotification('No data to export', 'error');
// // //       return;
// // //     }

// // //     const headers = ['Employee ID', 'Employee Name', 'Company', 'Department', 'Leave Type', 'Total Allocated', 'Leaves Taken', 'Balance', 'Carry Forward'];
    
// // //     const rows: string[] = [];
// // //     balanceReportData.forEach(employee => {
// // //       employee.leave_balances.forEach(balance => {
// // //         rows.push([
// // //           employee.employee_code || '',
// // //           `"${(employee.employee_name || '').replace(/"/g, '""')}"`,
// // //           `"${(employee.company || '').replace(/"/g, '""')}"`,
// // //           `"${(employee.department || '').replace(/"/g, '""')}"`,
// // //           `"${(balance.leave_type || '').replace(/"/g, '""')}"`,
// // //           balance.total_allocated || 0,
// // //           balance.leaves_taken || 0,
// // //           balance.balance || 0,
// // //           balance.carry_forward ? 'Yes' : 'No'
// // //         ].join(','));
// // //       });
// // //     });

// // //     const csvContent = [headers.join(','), ...rows].join('\n');
// // //     downloadCSV(csvContent, `leave-balance-report-${new Date().toISOString().split('T')[0]}.csv`);
// // //     showNotification('Balance report exported successfully', 'success');
// // //   };

// // //   const downloadCSV = (content: string, filename: string) => {
// // //     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
// // //     const link = document.createElement('a');
// // //     const url = URL.createObjectURL(blob);
// // //     link.setAttribute('href', url);
// // //     link.setAttribute('download', filename);
// // //     link.style.visibility = 'hidden';
// // //     document.body.appendChild(link);
// // //     link.click();
// // //     document.body.removeChild(link);
// // //   };

// // //   const getBalanceColor = (balance: number, total: number) => {
// // //     const percentage = (balance / total) * 100;
// // //     if (percentage > 50) return 'text-green-600';
// // //     if (percentage > 25) return 'text-yellow-600';
// // //     return 'text-red-600';
// // //   };


// // // // Fetch employees for balance report - UPDATED
// // // const fetchBalanceEmployee1 = async (companyId: string, departmentId: string) => {
// // //   try {
// // //     let employees: any[] = [];

// // //     if (departmentId !== 'all') {
// // //       // Fetch employees by department
// // //       const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });

// // //       console.log('Employees by Department API Response:', response.data);
// // //       employees = Array.isArray(response.data) ? response.data : [];
// // //     } else {
// // //       // Fetch employees by company
// // //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });

// // //       console.log('Employees by Company API Response:', response.data);
// // //       employees = Array.isArray(response.data) ? response.data : [];
// // //     }

// // //     const employeeOptions = employees.map((emp: any) => ({
// // //       value: emp.id.toString(),
// // //       label: `${emp.employee_no || ''} - ${emp.name}`
// // //     }));

// // //     setBalanceEmployees(employeeOptions);
// // //   } catch (err) {
// // //     console.error('Error fetching balance employees:', err);
// // //     setBalanceEmployees([]);
// // //   }
// // // };

// // // // Fetch employees for balance report - UPDATED
// // // const fetchBalanceEmployees = async (companyId: string, departmentId: string) => {
// // //   try {
// // //     let employees: any[] = [];

// // //     if (departmentId !== 'all') {
// // //       // Fetch employees by department
// // //       const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });

// // //       console.log('Employees by Department API Response:', response.data);
      
// // //       // Handle different response structures
// // //       if (response.data && Array.isArray(response.data)) {
// // //         employees = response.data;
// // //       } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// // //         employees = response.data.employees;
// // //       } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// // //         employees = response.data.data;
// // //       } else {
// // //         console.warn('Unexpected API response structure for department employees:', response.data);
// // //         employees = [];
// // //       }
// // //     } else {
// // //       // Fetch employees by company
// // //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });

// // //       console.log('Employees by Company API Response:', response.data);
      
// // //       // Handle different response structures
// // //       if (response.data && Array.isArray(response.data)) {
// // //         employees = response.data;
// // //       } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// // //         employees = response.data.employees;
// // //       } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// // //         employees = response.data.data;
// // //       } else {
// // //         console.warn('Unexpected API response structure for company employees:', response.data);
// // //         employees = [];
// // //       }
// // //     }

// // //     console.log('Processed employees:', employees);

// // //     const employeeOptions = employees
// // //       .filter((emp: any) => emp && emp.id && emp.name) // Filter out invalid entries
// // //       .map((emp: any) => ({
// // //         value: emp.id.toString(),
// // //         label: `${emp.employee_no || emp.employee_code || ''} - ${emp.name}`.trim()
// // //       }));

// // //     console.log('Employee options:', employeeOptions);
// // //     setBalanceEmployees(employeeOptions);
// // //   } catch (err) {
// // //     console.error('Error fetching balance employees:', err);
// // //     setBalanceEmployees([]);
// // //   }
// // // };

// // // // Fetch departments for application report - UPDATED
// // // const fetchApplicationDepartments = async (companyId: string) => {
// // //   try {
// // //     const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// // //       headers: {
// // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //       }
// // //     });

// // //     console.log('Application Departments API Response:', response.data);

// // //     if (response.data.success && Array.isArray(response.data.departments)) {
// // //       const departmentOptions = response.data.departments.map((dept: any) => ({
// // //         value: dept.id.toString(),
// // //         label: dept.department_name
// // //       }));
// // //       setApplicationDepartments(departmentOptions);
// // //     } else {
// // //       console.warn('No departments found in response');
// // //       setApplicationDepartments([]);
// // //     }
// // //   } catch (err) {
// // //     console.error('Error fetching application departments:', err);
// // //     setApplicationDepartments([]);
// // //   }
// // // };

// // // // Fetch departments for balance report - UPDATED
// // // const fetchBalanceDepartments = async (companyId: string) => {
// // //   try {
// // //     const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// // //       headers: {
// // //         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //       }
// // //     });

// // //     console.log('Balance Departments API Response:', response.data);

// // //     if (response.data.success && Array.isArray(response.data.departments)) {
// // //       const departmentOptions = response.data.departments.map((dept: any) => ({
// // //         value: dept.id.toString(),
// // //         label: dept.department_name
// // //       }));
// // //       setBalanceDepartments(departmentOptions);
// // //     } else {
// // //       console.warn('No departments found in response');
// // //       setBalanceDepartments([]);
// // //     }
// // //   } catch (err) {
// // //     console.error('Error fetching balance departments:', err);
// // //     setBalanceDepartments([]);
// // //   }
// // // };

// // // // Application report useEffect - UPDATED
// // // useEffect(() => {
// // //   if (reportFilters.company !== 'all') {
// // //     fetchApplicationDepartments(reportFilters.company);
// // //   } else {
// // //     setApplicationDepartments([]);
// // //     setReportFilters(prev => ({ ...prev, department: 'all' }));
// // //   }
// // // }, [reportFilters.company]);

// // // // Balance report useEffect - UPDATED
// // // useEffect(() => {
// // //   if (balanceReportFilters.company !== 'all') {
// // //     fetchBalanceDepartments(balanceReportFilters.company);
// // //     fetchBalanceEmployees(balanceReportFilters.company, 'all');
// // //   } else {
// // //     setBalanceDepartments([]);
// // //     setBalanceEmployees([]);
// // //     setBalanceReportFilters(prev => ({ ...prev, department: 'all', employeeId: 'all' }));
// // //   }
// // // }, [balanceReportFilters.company]);

// // // // // Balance report department change useEffect - UPDATED
// // // // useEffect(() => {
// // // //   if (balanceReportFilters.company !== 'all') {
// // // //     fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
// // // //   }
// // // // }, [balanceReportFilters.department]);

// // // // Balance report department change useEffect - UPDATED
// // // useEffect(() => {
// // //   console.log('Department changed:', {
// // //     company: balanceReportFilters.company,
// // //     department: balanceReportFilters.department
// // //   });
  
// // //   if (balanceReportFilters.company !== 'all') {
// // //     fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
// // //   }
// // // }, [balanceReportFilters.department]);

// // //   return (
// // //     <>
// // //       <NotificationToast
// // //         show={notification.show}
// // //         message={notification.message}
// // //         type={notification.type}
// // //       />
      
// // //       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// // //           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// // //             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// // //             <span className="truncate">Manage Leaves</span>
// // //           </h1>
          
// // //   {/* Only show Export Report button for admin users */}
// // //   {user?.role === 'admin' && (
// // //     <button
// // //       onClick={() => setShowReportModal(true)}
// // //       className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
// // //     >
// // //       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
// // //         <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
// // //       </svg>
// // //       <span className="hidden sm:inline">Export Report</span>
// // //       <span className="sm:hidden">Reports</span>
// // //     </button>
// // //   )}
// // //         </div>

// // //         {/* Existing tabs content remains the same */}
// // //         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// // //           {user?.role !== 'admin' && (
// // //             <>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Overview"
// // //                 defaultChecked
// // //                 onChange={() => handleTabChange('overview')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveOverview key={`overview-${key}`} />
// // //               </div>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Requests"
// // //                 defaultChecked={user?.role === 'admin'}
// // //                 onChange={() => handleTabChange('requests')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveRequest key={`requests-${key}`} />
// // //               </div>

// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Calendar"
// // //                 onChange={() => handleTabChange('calendar')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveCalendar key={`calendar-${key}`} />
// // //               </div>
// // //             </>
// // //           )}
// // //           {user?.role === 'admin' && (
// // //             <>
// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Requests"
// // //                 defaultChecked
// // //                 onChange={() => handleTabChange('requests')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <AdminLeaveRequest key={`requests-${key}`} />
// // //               </div>

// // //               <input
// // //                 type="radio"
// // //                 name="leaves_tabs"
// // //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// // //                 aria-label="Leave Types"
// // //                 onChange={() => handleTabChange('types')}
// // //               />
// // //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// // //                 <LeaveType key={`types-${key}`} />
// // //               </div>
// // //             </>
// // //           )}
// // //         </div>

// // //         {/* Report Modal */}
// // //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// // //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// // //             {/* Modal Header */}
// // //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// // //               <div className="flex items-center gap-4 relative z-10">
// // //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// // //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// // //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// // //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// // //                 </div>
                
// // //                 <div className="flex flex-col">
// // //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// // //                     Leave Applications Report
// // //                   </h3>
// // //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// // //                     Generate and export leave application reports
// // //                   </p>
// // //                 </div>
// // //               </div>
              
// // //               <button
// // //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// // //                 onClick={() => setShowReportModal(false)}
// // //               >
// // //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// // //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>

// // //             {/* Modal Content */}
// // //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
// // //               {/* Filters */}
// // //               <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// // //                 <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                   <FaFilter className="inline mr-2" />
// // //                   Report Filters
// // //                 </h4>
                
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                   {/* Date Range */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Start Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={reportFilters.startDate}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     />
// // //                   </div>
                  
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       End Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={reportFilters.endDate}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// // //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     />
// // //                   </div>

// // //                 {/* Company Filter */}
// // //                 <div>
// // //                   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                     Company
// // //                   </label>
// // //                   <select
// // //                     value={reportFilters.company}
// // //                     onChange={(e) => setReportFilters(prev => ({ 
// // //                       ...prev, 
// // //                       company: e.target.value,
// // //                       department: 'all'
// // //                     }))}
// // //                     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                   >
// // //                     <option value="all">All Companies</option>
// // //                     {companies.map(company => (
// // //                       <option key={company.id} value={company.id}>{company.name}</option>
// // //                     ))}
// // //                   </select>
// // //                 </div>

// // //                   {/* Status Filter */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Status
// // //                     </label>
// // //                     <select
// // //                       value={reportFilters.status}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     >
// // //                       <option value="all">All Status</option>
// // //                       <option value="PENDING">Pending</option>
// // //                       <option value="APPROVED">Approved</option>
// // //                       <option value="REJECTED">Rejected</option>
// // //                       <option value="CANCELLED">Cancelled</option>
// // //                     </select>
// // //                   </div>

// // //                   {/* Leave Type Filter */}
// // //                   <div>
// // //                     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       Leave Type
// // //                     </label>
// // //                     <select
// // //                       value={reportFilters.leaveType}
// // //                       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// // //                       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //                     >
// // //                       <option value="all">All Leave Types</option>
// // //                       {/* You might want to fetch leave types dynamically */}
// // //                       <option value="Annual Leave">Annual Leave</option>
// // //                       <option value="Sick Leave">Sick Leave</option>
// // //                       <option value="Maternity Leave">Maternity Leave</option>
// // //                       <option value="Paternity Leave">Paternity Leave</option>
// // //                     </select>
// // //                   </div>
// // //                 </div>

// // //                 {/* Action Buttons */}
// // //                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
// // //                   <button
// // //                     onClick={generateLeaveReport}
// // //                     disabled={isGeneratingReport}
// // //                     className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// // //                   >
// // //                     {isGeneratingReport ? (
// // //                       <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// // //                     ) : (
// // //                       <FaChartBar className="h-4 w-4" />
// // //                     )}
// // //                     Generate Report
// // //                   </button>
                  
// // //                   <button
// // //                     onClick={exportReportToCSV}
// // //                     disabled={reportData.length === 0}
// // //                     className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// // //                   >
// // //                     <FaFileExport className="h-4 w-4" />
// // //                     Export to CSV
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Report Results */}
// // //               {reportData.length > 0 && (
// // //                 <div className="overflow-x-auto">
// // //                   <table className="table table-zebra w-full">
// // //                     <thead>
// // //                       <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// // //                         <th>Employee</th>
// // //                         <th>Leave Type</th>
// // //                         <th>Start Date</th>
// // //                         <th>End Date</th>
// // //                         <th>Days</th>
// // //                         <th>Status</th>
// // //                         <th>Company</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {reportData.map((item, index) => (
// // //                         <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// // //                           <td>
// // //                             <div className="font-medium">{item.employee_name}</div>
// // //                             <div className="text-sm opacity-70">{item.employee_id}</div>
// // //                           </td>
// // //                           <td>{item.leave_type}</td>
// // //                           <td>{new Date(item.start_date).toLocaleDateString()}</td>
// // //                           <td>{new Date(item.end_date).toLocaleDateString()}</td>
// // //                           <td>{item.days}</td>
// // //                           <td>
// // //                             <span className={`badge ${
// // //                               item.status === 'APPROVED' ? 'badge-success' :
// // //                               item.status === 'REJECTED' ? 'badge-error' :
// // //                               item.status === 'PENDING' ? 'badge-warning' :
// // //                               'badge-neutral'
// // //                             }`}>
// // //                               {item.status}
// // //                             </span>
// // //                           </td>
// // //                           <td>{item.company}</td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
                  
// // //                   <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //                     Total Records: {reportData.length}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {reportData.length === 0 && !isGeneratingReport && (
// // //                 <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //                   <FaChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // //                   <p>No report data generated yet. Apply filters and click "Generate Report".</p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <form method="dialog" className="modal-backdrop">
// // //             <button onClick={() => setShowReportModal(false)}>close</button>
// // //           </form>
// // //         </dialog>
        

// // //         {/* Enhanced Report Modal */}
// // //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// // //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// // //             {/* Modal Header */}
// // //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// // //               <div className="flex items-center gap-4 relative z-10">
// // //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// // //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// // //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// // //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// // //                 </div>
                
// // //                 <div className="flex flex-col">
// // //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// // //                     Leave Reports
// // //                   </h3>
// // //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// // //                     Generate and export comprehensive leave reports
// // //                   </p>
// // //                 </div>
// // //               </div>
              
// // //               <button
// // //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// // //                 onClick={() => setShowReportModal(false)}
// // //               >
// // //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// // //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>

// // //             {/* Report Type Selection */}
// // //             <div className="flex border-b border-slate-200 dark:border-slate-600">
// // //               <button
// // //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// // //                   activeReportType === 'applications' 
// // //                     ? theme === 'light' 
// // //                       ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
// // //                       : 'bg-blue-900/30 text-blue-300 border-b-2 border-blue-400'
// // //                     : theme === 'light'
// // //                       ? 'text-slate-600 hover:bg-slate-50'
// // //                       : 'text-slate-400 hover:bg-slate-700/50'
// // //                 }`}
// // //                 onClick={() => setActiveReportType('applications')}
// // //               >
// // //                 <FaRegCalendarTimes className="inline mr-2 h-4 w-4" />
// // //                 Applications Report
// // //               </button>
// // //               <button
// // //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// // //                   activeReportType === 'balance' 
// // //                     ? theme === 'light' 
// // //                       ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
// // //                       : 'bg-green-900/30 text-green-300 border-b-2 border-green-400'
// // //                     : theme === 'light'
// // //                       ? 'text-slate-600 hover:bg-slate-50'
// // //                       : 'text-slate-400 hover:bg-slate-700/50'
// // //                 }`}
// // //                 onClick={() => setActiveReportType('balance')}
// // //               >
// // //                 <FaUsers className="inline mr-2 h-4 w-4" />
// // //                 Balance Report
// // //               </button>
// // //             </div>

// // //             {/* Modal Content */}
// // //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
// // //               {/* Applications Report */}
// // //               {activeReportType === 'applications' && (
// // //                 <div>
// // //                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// // //                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                       <FaFilter className="inline mr-2" />
// // //                       Applications Report Filters
// // //                     </h4>
                    
// // // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //   {/* Date Range */}
// // //   <div>
// // //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //       Start Date
// // //     </label>
// // //     <input
// // //       type="date"
// // //       value={reportFilters.startDate}
// // //       onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// // //       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //     />
// // //   </div>
  
// // //   <div>
// // //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //       End Date
// // //     </label>
// // //     <input
// // //       type="date"
// // //       value={reportFilters.endDate}
// // //       onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// // //       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //     />
// // //   </div>

// // // {/* Company Filter */}
// // // <div>
// // //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //     Company
// // //   </label>
// // //   <select
// // //     value={reportFilters.company}
// // //     onChange={(e) => setReportFilters(prev => ({ 
// // //       ...prev, 
// // //       company: e.target.value,
// // //       department: 'all'
// // //     }))}
// // //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //   >
// // //     <option value="all">All Companies</option>
// // //     {companies.map(company => (
// // //       <option key={company.id} value={company.id}>{company.name}</option>
// // //     ))}
// // //   </select>
// // // </div>

// // // {/* Application Report Department Filter */}
// // // <div>
// // //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //     Department 
// // //     <span className="text-xs ml-2 opacity-70">
// // //       ({applicationDepartments.length} available)
// // //     </span>
// // //   </label>
// // //   <select
// // //     value={reportFilters.department}
// // //     onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
// // //     disabled={reportFilters.company === 'all' || applicationDepartments.length === 0}
// // //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${reportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// // //   >
// // //     <option value="all">All Departments</option>
// // //     {applicationDepartments.map(dept => (
// // //       <option key={dept.value} value={dept.value}>{dept.label}</option>
// // //     ))}
// // //   </select>
// // //   {reportFilters.company === 'all' && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //         Select a company first
// // //       </span>
// // //     </label>
// // //   )}
// // //   {reportFilters.company !== 'all' && applicationDepartments.length === 0 && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// // //         Loading departments...
// // //       </span>
// // //     </label>
// // //   )}
// // // </div>


// // //   {/* Status Filter */}
// // //   <div>
// // //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //       Status
// // //     </label>
// // //     <select
// // //       value={reportFilters.status}
// // //       onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// // //       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //     >
// // //       <option value="all">All Status</option>
// // //       <option value="PENDING">Pending</option>
// // //       <option value="APPROVED">Approved</option>
// // //       <option value="REJECTED">Rejected</option>
// // //       <option value="CANCELLED">Cancelled</option>
// // //     </select>
// // //   </div>

// // //   {/* Leave Type Filter */}
// // //   <div>
// // //     <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //       Leave Type
// // //     </label>
// // //     <select
// // //       value={reportFilters.leaveType}
// // //       onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// // //       className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //     >
// // //       <option value="all">All Leave Types</option>
// // //       <option value="Annual Leave">Annual Leave</option>
// // //       <option value="Sick Leave">Sick Leave</option>
// // //       <option value="Maternity Leave">Maternity Leave</option>
// // //       <option value="Paternity Leave">Paternity Leave</option>
// // //     </select>
// // //   </div>
// // // </div>

// // //                     {/* Action Buttons */}
// // //                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
// // //                       <button
// // //                         onClick={generateLeaveReport}
// // //                         disabled={isGeneratingReport}
// // //                         className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// // //                       >
// // //                         {isGeneratingReport ? (
// // //                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// // //                         ) : (
// // //                           <FaChartBar className="h-4 w-4" />
// // //                         )}
// // //                         Generate Applications Report
// // //                       </button>
                      
// // //                       <button
// // //                         onClick={exportApplicationsToCSV}
// // //                         disabled={reportData.length === 0}
// // //                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// // //                       >
// // //                         <FaFileExport className="h-4 w-4" />
// // //                         Export to CSV
// // //                       </button>
// // //                     </div>
// // //                   </div>

// // //                   {/* Applications Report Results */}
// // //                   {reportData.length > 0 && (
// // //                     <div className="overflow-x-auto">
// // //                       <table className="table table-zebra w-full">
// // //                         <thead>
// // //                           <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// // //                             <th>Employee</th>
// // //                             <th>Leave Type</th>
// // //                             <th>Start Date</th>
// // //                             <th>End Date</th>
// // //                             <th>Days</th>
// // //                             <th>Status</th>
// // //                             <th>Company</th>
// // //                           </tr>
// // //                         </thead>
// // //                         <tbody>
// // //                           {reportData.map((item, index) => (
// // //                             <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// // //                               <td>
// // //                                 <div className="font-medium">{item.employee_name}</div>
// // //                                 <div className="text-sm opacity-70">{item.employee_id}</div>
// // //                               </td>
// // //                               <td>{item.leave_type}</td>
// // //                               <td>{new Date(item.start_date).toLocaleDateString()}</td>
// // //                               <td>{new Date(item.end_date).toLocaleDateString()}</td>
// // //                               <td>{item.days}</td>
// // //                               <td>
// // //                                 <span className={`badge ${
// // //                                   item.status === 'APPROVED' ? 'badge-success' :
// // //                                   item.status === 'REJECTED' ? 'badge-error' :
// // //                                   item.status === 'PENDING' ? 'badge-warning' :
// // //                                   'badge-neutral'
// // //                                 }`}>
// // //                                   {item.status}
// // //                                 </span>
// // //                               </td>
// // //                               <td>{item.company}</td>
// // //                             </tr>
// // //                           ))}
// // //                         </tbody>
// // //                       </table>
                      
// // //                       <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //                         Total Records: {reportData.length}
// // //                       </div>
// // //                     </div>
// // //                   )}

// // //                   {reportData.length === 0 && !isGeneratingReport && (
// // //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //                       <FaRegCalendarTimes className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // //                       <p>No applications data generated yet. Apply filters and click "Generate Applications Report".</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}

// // //               {/* Balance Report */}
// // // {/* Balance Report */}
// // // {activeReportType === 'balance' && (
// // //   <div>
// // //     <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// // //       <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //         <FaFilter className="inline mr-2" />
// // //         Balance Report Filters
// // //       </h4>
      
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// // // {/* Company Filter */}
// // // <div>
// // //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //     <FaBuilding className="inline mr-1 h-3 w-3" />
// // //     Company
// // //   </label>
// // //   <select
// // //     value={balanceReportFilters.company}
// // //     onChange={(e) => setBalanceReportFilters(prev => ({ 
// // //       ...prev, 
// // //       company: e.target.value,
// // //       department: 'all',
// // //       employeeId: 'all'
// // //     }))}
// // //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //   >
// // //     <option value="all">All Companies</option>
// // //     {companies.map(company => (
// // //       <option key={company.id} value={company.id}>{company.name}</option>
// // //     ))}
// // //   </select>
// // // </div>


// // // {/* Balance Report Department Filter */}
// // // <div>
// // //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //     Department 
// // //     <span className="text-xs ml-2 opacity-70">
// // //       ({balanceDepartments.length} available)
// // //     </span>
// // //   </label>
// // //   <select
// // //     value={balanceReportFilters.department}
// // //     onChange={(e) => setBalanceReportFilters(prev => ({ 
// // //       ...prev, 
// // //       department: e.target.value,
// // //       employeeId: 'all'
// // //     }))}
// // //     disabled={balanceReportFilters.company === 'all' || balanceDepartments.length === 0}
// // //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// // //   >
// // //     <option value="all">All Departments</option>
// // //     {balanceDepartments.map(dept => (
// // //       <option key={dept.value} value={dept.value}>{dept.label}</option>
// // //     ))}
// // //   </select>
// // //   {balanceReportFilters.company === 'all' && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //         Select a company first
// // //       </span>
// // //     </label>
// // //   )}
// // //   {balanceReportFilters.company !== 'all' && balanceDepartments.length === 0 && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// // //         Loading departments...
// // //       </span>
// // //     </label>
// // //   )}
// // // </div>

// // // {/* Balance Report Employee Filter */}
// // // <div>
// // //   <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //     <FaUser className="inline mr-1 h-3 w-3" />
// // //     Employee 
// // //     <span className="text-xs ml-2 opacity-70">
// // //       ({balanceEmployees.length} available)
// // //     </span>
// // //   </label>
// // //   <select
// // //     value={balanceReportFilters.employeeId}
// // //     onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, employeeId: e.target.value }))}
// // //     disabled={balanceReportFilters.company === 'all' || balanceEmployees.length === 0}
// // //     className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// // //   >
// // //     <option value="all">All Employees</option>
// // //     {balanceEmployees.map(emp => (
// // //       <option key={emp.value} value={emp.value}>{emp.label}</option>
// // //     ))}
// // //   </select>
// // //   {balanceReportFilters.company === 'all' && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //         Select a company first
// // //       </span>
// // //     </label>
// // //   )}
// // //   {balanceReportFilters.company !== 'all' && balanceReportFilters.department !== 'all' && balanceEmployees.length === 0 && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// // //         {`No employees found in this department`}
// // //       </span>
// // //     </label>
// // //   )}
// // //   {balanceReportFilters.company !== 'all' && balanceReportFilters.department === 'all' && balanceEmployees.length === 0 && (
// // //     <label className="label">
// // //       <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// // //         Loading employees...
// // //       </span>
// // //     </label>
// // //   )}
// // // </div>

// // //         {/* As of Date Filter */}
// // //         <div>
// // //           <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //             As of Date
// // //           </label>
// // //           <input
// // //             type="date"
// // //             value={balanceReportFilters.asOfDate}
// // //             onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
// // //             className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* Action Buttons */}
// // //       <div className="flex flex-col sm:flex-row gap-2 mt-4">
// // //         <button
// // //           onClick={generateBalanceReport}
// // //           disabled={isGeneratingBalanceReport}
// // //           className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// // //         >
// // //           {isGeneratingBalanceReport ? (
// // //             <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// // //           ) : (
// // //             <FaUsers className="h-4 w-4" />
// // //           )}
// // //           Generate Balance Report
// // //         </button>
        
// // //         <button
// // //           onClick={exportBalanceToCSV}
// // //           disabled={balanceReportData.length === 0}
// // //           className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0 flex items-center gap-2`}
// // //         >
// // //           <FaFileExport className="h-4 w-4" />
// // //           Export to CSV
// // //         </button>
// // //                     </div>
// // //                   </div>

// // //                   {/* Balance Report Results */}
// // //                   {balanceReportData.length > 0 && (
// // //                     <div className="space-y-6">
// // //                       {balanceReportData.map((employee, index) => (
// // //                         <div key={employee.employee_id} className={`border rounded-lg ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
// // //                           {/* Employee Header */}
// // //                           <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
// // //                             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
// // //                               <div>
// // //                                 <h4 className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
// // //                                   {employee.employee_name}
// // //                                 </h4>
// // //                                 <div className="flex flex-wrap gap-4 mt-1 text-sm">
// // //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// // //                                     ID: {employee.employee_code}
// // //                                   </span>
// // //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// // //                                     Company: {employee.company}
// // //                                   </span>
// // //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// // //                                     Department: {employee.department}
// // //                                   </span>
// // //                                 </div>
// // //                               </div>
// // //                               <div className={`text-sm font-medium mt-2 sm:mt-0 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// // //                                 Total Leave Types: {employee.leave_balances.length}
// // //                               </div>
// // //                             </div>
// // //                           </div>

// // //                           {/* Leave Balances */}
// // //                           <div className="overflow-x-auto">
// // //                             <table className="table table-zebra w-full">
// // //                               <thead>
// // //                                 <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// // //                                   <th>Leave Type</th>
// // //                                   <th>Total Allocated</th>
// // //                                   <th>Leaves Taken</th>
// // //                                   <th>Balance</th>
// // //                                   <th>Carry Forward</th>
// // //                                   <th>Status</th>
// // //                                 </tr>
// // //                               </thead>
// // //                               <tbody>
// // //                                 {employee.leave_balances.map((balance, balanceIndex) => (
// // //                                   <tr key={balanceIndex} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// // //                                     <td className="font-medium">{balance.leave_type}</td>
// // //                                     <td>{balance.total_allocated}</td>
// // //                                     <td>{balance.leaves_taken}</td>
// // //                                     <td>
// // //                                       <span className={`font-bold ${getBalanceColor(balance.balance, balance.total_allocated)}`}>
// // //                                         {balance.balance}
// // //                                       </span>
// // //                                     </td>
// // //                                     <td>
// // //                                       <span className={`badge ${balance.carry_forward ? 'badge-success' : 'badge-neutral'}`}>
// // //                                         {balance.carry_forward ? 'Yes' : 'No'}
// // //                                       </span>
// // //                                     </td>
// // //                                     <td>
// // //                                       <span className={`badge ${balance.leave_type_active ? 'badge-success' : 'badge-error'}`}>
// // //                                         {balance.leave_type_active ? 'Active' : 'Inactive'}
// // //                                       </span>
// // //                                     </td>
// // //                                   </tr>
// // //                                 ))}
// // //                               </tbody>
// // //                             </table>
// // //                           </div>
// // //                         </div>
// // //                       ))}
                      
// // //                       <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //                         Total Employees: {balanceReportData.length} | 
// // //                         Generated on: {new Date().toLocaleDateString()}
// // //                       </div>
// // //                     </div>
// // //                   )}

// // //                   {balanceReportData.length === 0 && !isGeneratingBalanceReport && (
// // //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// // //                       <FaUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // //                       <p>No balance data generated yet. Apply filters and click "Generate Balance Report".</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <form method="dialog" className="modal-backdrop">
// // //             <button onClick={() => setShowReportModal(false)}>close</button>
// // //           </form>
// // //         </dialog>
// // //       </div>
// // //     </>
// // //   )
// // // }

// // // export default LeavesPage;

// // // export default LeavesPage

// // 'use client';

// // import React, { useState, useEffect } from 'react'
// // import LeaveOverview from './LeaveOverview';
// // import LeaveCalendar from './LeaveCalendar';
// // import LeaveRequest from './LeaveRequest';
// // import AdminLeaveRequest from './AdminLeaveRequest';
// // import LeaveType from './LeaveType';
// // import { 
// //   FaRegCalendarTimes, 
// //   FaChartBar, 
// //   FaFileExport, 
// //   FaFilter, 
// //   FaUser,
// //   FaBuilding,
// //   FaUsers 
// // } from "react-icons/fa";
// // import { useTheme } from '../components/ThemeProvider';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useNotification } from '../hooks/useNotification';
// // import NotificationToast from '../components/NotificationToast';
// // import { ImportIcon } from 'lucide-react';
// // import { CiImport } from 'react-icons/ci';

// // interface User {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: string;
// // }

// // // Report data interfaces
// // interface LeaveReportData {
// //   employee_id: string;
// //   employee_name: string;
// //   leave_type: string;
// //   start_date: string;
// //   end_date: string;
// //   days: number;
// //   status: string;
// //   company: string;
// //   department: string;
// // }

// // interface LeaveBalanceData {
// //   employee_id: string;
// //   employee_code: string;
// //   employee_name: string;
// //   email: string;
// //   company: string;
// //   department: string;
// //   leave_balances: {
// //     leave_type: string;
// //     total_allocated: number;
// //     leaves_taken: number;
// //     balance: number;
// //     carry_forward: boolean;
// //     carry_forward_balance: number;
// //     leave_type_active: boolean;
// //   }[];
// // }

// // interface FilterOption {
// //   value: string;
// //   label: string;
// //   company?: string;
// // }

// // interface Company {
// //   id: number;
// //   name: string;
// // }

// // const LeavesPage = () => {
// //   const { theme } = useTheme();
// //   const { notification, showNotification } = useNotification();
// //   const [key, setKey] = useState(0);
// //   const [user, setUser] = useState<User | null>(null);
// //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
// //   const [activeTab, setActiveTab] = useState('');

// //   // Report states
// //   const [showReportModal, setShowReportModal] = useState(false);
// //   const [activeReportType, setActiveReportType] = useState<'applications' | 'balance'>('applications');
// //   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
// //   const [balanceReportData, setBalanceReportData] = useState<LeaveBalanceData[]>([]);
  
// //   // Report filters
// //   const [reportFilters, setReportFilters] = useState({
// //     startDate: '',
// //     endDate: '',
// //     company: 'all',
// //     department: 'all',
// //     status: 'all',
// //     leaveType: 'all'
// //   });

// //   const [balanceReportFilters, setBalanceReportFilters] = useState({
// //     company: 'all',
// //     department: 'all',
// //     employeeId: 'all',
// //     asOfDate: new Date().toISOString().split('T')[0]
// //   });

// //   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
// //   const [isGeneratingBalanceReport, setIsGeneratingBalanceReport] = useState(false);
// //   const [companies, setCompanies] = useState<Company[]>([]);

// //   const [applicationDepartments, setApplicationDepartments] = useState<FilterOption[]>([]);
// //   const [balanceDepartments, setBalanceDepartments] = useState<FilterOption[]>([]);
// //   const [balanceEmployees, setBalanceEmployees] = useState<FilterOption[]>([]);

// //   useEffect(() => {
// //     const user = localStorage.getItem('hrms_user');
// //     if (user) {
// //       const userData = JSON.parse(user);
// //       setUser(userData);
// //     }

// //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// //     setLastOpenedMenu(lastMenu);

// //     fetchCompanies();
// //   }, []);

// //   useEffect(() => {
// //     if (reportFilters.company !== 'all') {
// //       fetchApplicationDepartments(reportFilters.company);
// //     } else {
// //       setApplicationDepartments([]);
// //     }
// //   }, [reportFilters.company]);

// //   const exportReportToCSV = () => {
// //     if (reportData.length === 0) {
// //       showNotification('No data to export', 'error');
// //       return;
// //     }

// //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// //     const csvContent = [
// //       headers.join(','),
// //       ...reportData.map(row => [
// //         row.employee_id || '',
// //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// //         row.start_date || '',
// //         row.end_date || '',
// //         row.days || '',
// //         row.status || '',
// //         `"${(row.company || '').replace(/"/g, '""')}"`,
// //         `"${(row.department || '').replace(/"/g, '""')}"`
// //       ].join(','))
// //     ].join('\n');

// //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     const url = URL.createObjectURL(blob);
// //     link.setAttribute('href', url);
// //     link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
// //     link.style.visibility = 'hidden';
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
    
// //     showNotification('Report exported successfully', 'success');
// //   };

// //   const fetchCompanies = async () => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       if (response.data && Array.isArray(response.data)) {
// //         const uniqueCompanies = response.data
// //           .filter((company: any) => company.is_active === 1)
// //           .filter((company: any, index, self) => 
// //             index === self.findIndex((c: any) => c.id === company.id)
// //           )
// //           .map((company: any) => ({
// //             id: company.id,
// //             name: company.company_name || company.name
// //           }))
// //           .sort((a, b) => a.name.localeCompare(b.name));
        
// //         setCompanies(uniqueCompanies);
// //       }
// //     } catch (err) {
// //       console.error('Error fetching companies:', err);
// //       setCompanies([]);
// //     }
// //   };

// //   const handleTabChange = (tabName: string) => {
// //     setActiveTab(tabName);
// //     setKey(prev => prev + 1);
// //   };

// //   // Applications Report functions - UPDATED
// //   const generateLeaveReport = async () => {
// //     try {
// //       setIsGeneratingReport(true);
      
// //       // Prepare parameters
// //       const params: any = {};

// //       // Add date filters
// //       if (reportFilters.startDate) {
// //         params.startDate = reportFilters.startDate;
// //       }
// //       if (reportFilters.endDate) {
// //         params.endDate = reportFilters.endDate;
// //       }

// //       // Add company filter if not 'all' - NOW USING ID
// //       if (reportFilters.company !== 'all') {
// //         params.company = reportFilters.company;
// //       }

// //       // Add department filter if not 'all' - USING ID
// //       if (reportFilters.department !== 'all') {
// //         params.department = reportFilters.department;
// //       }

// //       // Add status filter if not 'all'
// //       if (reportFilters.status !== 'all') {
// //         params.status = reportFilters.status;
// //       }

// //       // Add leave type filter if not 'all'
// //       if (reportFilters.leaveType !== 'all') {
// //         params.leaveType = reportFilters.leaveType;
// //       }

// //       console.log('Applications Report API Params:', params);

// //       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         },
// //         params: params
// //       });

// //       console.log('Applications Report API Response:', response.data);
      
// //       if (response.data && response.data.data) {
// //         setReportData(response.data.data);
// //         showNotification('Report generated successfully', 'success');
// //       } else {
// //         setReportData([]);
// //         showNotification('No data found for the selected filters', 'info');
// //       }
// //     } catch (err: any) {
// //       console.error('Error generating report:', err);
// //       const errorMessage = err.response?.data?.message || 'Failed to generate report';
// //       showNotification(errorMessage, 'error');
// //       setReportData([]);
// //     } finally {
// //       setIsGeneratingReport(false);
// //     }
// //   };

// //   // Balance Report functions - UPDATED
// //   const generateBalanceReport = async () => {
// //     try {
// //       setIsGeneratingBalanceReport(true);
      
// //       // Prepare parameters
// //       const params: any = {
// //         asOfDate: balanceReportFilters.asOfDate
// //       };

// //       // Add company filter if not 'all' - NOW USING ID
// //       if (balanceReportFilters.company !== 'all') {
// //         params.company = balanceReportFilters.company;
// //       }

// //       // Add department filter if not 'all' - USING ID
// //       if (balanceReportFilters.department !== 'all') {
// //         params.department = balanceReportFilters.department;
// //       }

// //       // Add employee filter if not 'all' - USING ID
// //       if (balanceReportFilters.employeeId !== 'all') {
// //         params.employeeId = balanceReportFilters.employeeId;
// //       }

// //       console.log('Balance Report API Params:', params);

// //       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/balance`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         },
// //         params: params
// //       });

// //       console.log('Balance Report API Response:', response.data);
      
// //       if (response.data && response.data.data) {
// //         setBalanceReportData(response.data.data);
// //         showNotification('Balance report generated successfully', 'success');
// //       } else {
// //         setBalanceReportData([]);
// //         showNotification('No data found for the selected filters', 'info');
// //       }
// //     } catch (err: any) {
// //       console.error('Error generating balance report:', err);
// //       const errorMessage = err.response?.data?.message || 'Failed to generate balance report';
// //       showNotification(errorMessage, 'error');
// //       setBalanceReportData([]);
// //     } finally {
// //       setIsGeneratingBalanceReport(false);
// //     }
// //   };

// //   const exportApplicationsToCSV = () => {
// //     if (reportData.length === 0) {
// //       showNotification('No data to export', 'error');
// //       return;
// //     }

// //     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
// //     const csvContent = [
// //       headers.join(','),
// //       ...reportData.map(row => [
// //         row.employee_id || '',
// //         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
// //         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
// //         row.start_date || '',
// //         row.end_date || '',
// //         row.days || '',
// //         row.status || '',
// //         `"${(row.company || '').replace(/"/g, '""')}"`,
// //         `"${(row.department || '').replace(/"/g, '""')}"`
// //       ].join(','))
// //     ].join('\n');

// //     downloadCSV(csvContent, `leave-applications-report-${new Date().toISOString().split('T')[0]}.csv`);
// //     showNotification('Applications report exported successfully', 'success');
// //   };

// //   const exportBalanceToCSV = () => {
// //     if (balanceReportData.length === 0) {
// //       showNotification('No data to export', 'error');
// //       return;
// //     }

// //     const headers = ['Employee ID', 'Employee Name', 'Company', 'Department', 'Leave Type', 'Total Allocated', 'Leaves Taken', 'Balance', 'Carry Forward'];
    
// //     const rows: string[] = [];
// //     balanceReportData.forEach(employee => {
// //       employee.leave_balances.forEach(balance => {
// //         rows.push([
// //           employee.employee_code || '',
// //           `"${(employee.employee_name || '').replace(/"/g, '""')}"`,
// //           `"${(employee.company || '').replace(/"/g, '""')}"`,
// //           `"${(employee.department || '').replace(/"/g, '""')}"`,
// //           `"${(balance.leave_type || '').replace(/"/g, '""')}"`,
// //           balance.total_allocated || 0,
// //           balance.leaves_taken || 0,
// //           balance.balance || 0,
// //           balance.carry_forward ? 'Yes' : 'No'
// //         ].join(','));
// //       });
// //     });

// //     const csvContent = [headers.join(','), ...rows].join('\n');
// //     downloadCSV(csvContent, `leave-balance-report-${new Date().toISOString().split('T')[0]}.csv`);
// //     showNotification('Balance report exported successfully', 'success');
// //   };

// //   const downloadCSV = (content: string, filename: string) => {
// //     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     const url = URL.createObjectURL(blob);
// //     link.setAttribute('href', url);
// //     link.setAttribute('download', filename);
// //     link.style.visibility = 'hidden';
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   const getBalanceColor = (balance: number, total: number) => {
// //     const percentage = (balance / total) * 100;
// //     if (percentage > 50) return 'text-green-600';
// //     if (percentage > 25) return 'text-yellow-600';
// //     return 'text-red-600';
// //   };

// //   // Fetch employees for balance report - UPDATED
// //   const fetchBalanceEmployees = async (companyId: string, departmentId: string) => {
// //     try {
// //       let employees: any[] = [];

// //       if (departmentId !== 'all') {
// //         // Fetch employees by department
// //         const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         });

// //         console.log('Employees by Department API Response:', response.data);
        
// //         // Handle different response structures
// //         if (response.data && Array.isArray(response.data)) {
// //           employees = response.data;
// //         } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// //           employees = response.data.employees;
// //         } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// //           employees = response.data.data;
// //         } else {
// //           console.warn('Unexpected API response structure for department employees:', response.data);
// //           employees = [];
// //         }
// //       } else {
// //         // Fetch employees by company
// //         const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         });

// //         console.log('Employees by Company API Response:', response.data);
        
// //         // Handle different response structures
// //         if (response.data && Array.isArray(response.data)) {
// //           employees = response.data;
// //         } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
// //           employees = response.data.employees;
// //         } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
// //           employees = response.data.data;
// //         } else {
// //           console.warn('Unexpected API response structure for company employees:', response.data);
// //           employees = [];
// //         }
// //       }

// //       console.log('Processed employees:', employees);

// //       const employeeOptions = employees
// //         .filter((emp: any) => emp && emp.id && emp.name) // Filter out invalid entries
// //         .map((emp: any) => ({
// //           value: emp.id.toString(),
// //           label: `${emp.employee_no || emp.employee_code || ''} - ${emp.name}`.trim()
// //         }));

// //       console.log('Employee options:', employeeOptions);
// //       setBalanceEmployees(employeeOptions);
// //     } catch (err) {
// //       console.error('Error fetching balance employees:', err);
// //       setBalanceEmployees([]);
// //     }
// //   };

// //   // Fetch departments for application report - UPDATED
// //   const fetchApplicationDepartments = async (companyId: string) => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Application Departments API Response:', response.data);

// //       if (response.data.success && Array.isArray(response.data.departments)) {
// //         const departmentOptions = response.data.departments.map((dept: any) => ({
// //           value: dept.id.toString(),
// //           label: dept.department_name
// //         }));
// //         setApplicationDepartments(departmentOptions);
// //       } else {
// //         console.warn('No departments found in response');
// //         setApplicationDepartments([]);
// //       }
// //     } catch (err) {
// //       console.error('Error fetching application departments:', err);
// //       setApplicationDepartments([]);
// //     }
// //   };

// //   // Fetch departments for balance report - UPDATED
// //   const fetchBalanceDepartments = async (companyId: string) => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });

// //       console.log('Balance Departments API Response:', response.data);

// //       if (response.data.success && Array.isArray(response.data.departments)) {
// //         const departmentOptions = response.data.departments.map((dept: any) => ({
// //           value: dept.id.toString(),
// //           label: dept.department_name
// //         }));
// //         setBalanceDepartments(departmentOptions);
// //       } else {
// //         console.warn('No departments found in response');
// //         setBalanceDepartments([]);
// //       }
// //     } catch (err) {
// //       console.error('Error fetching balance departments:', err);
// //       setBalanceDepartments([]);
// //     }
// //   };

// //   // Application report useEffect - UPDATED
// //   useEffect(() => {
// //     if (reportFilters.company !== 'all') {
// //       fetchApplicationDepartments(reportFilters.company);
// //     } else {
// //       setApplicationDepartments([]);
// //       setReportFilters(prev => ({ ...prev, department: 'all' }));
// //     }
// //   }, [reportFilters.company]);

// //   // Balance report useEffect - UPDATED
// //   useEffect(() => {
// //     if (balanceReportFilters.company !== 'all') {
// //       fetchBalanceDepartments(balanceReportFilters.company);
// //       fetchBalanceEmployees(balanceReportFilters.company, 'all');
// //     } else {
// //       setBalanceDepartments([]);
// //       setBalanceEmployees([]);
// //       setBalanceReportFilters(prev => ({ ...prev, department: 'all', employeeId: 'all' }));
// //     }
// //   }, [balanceReportFilters.company]);

// //   // Balance report department change useEffect - UPDATED
// //   useEffect(() => {
// //     console.log('Department changed:', {
// //       company: balanceReportFilters.company,
// //       department: balanceReportFilters.department
// //     });
    
// //     if (balanceReportFilters.company !== 'all') {
// //       fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
// //     }
// //   }, [balanceReportFilters.department]);

// //   return (
// //     <>
// //       <NotificationToast
// //         show={notification.show}
// //         message={notification.message}
// //         type={notification.type}
// //       />
      
// //       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// //           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// //             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
// //             <span className="truncate">Manage Leaves</span>
// //           </h1>
          
// //           {/* Only show Export Report button for admin users */}
// //           {user?.role === 'admin' && (
// //             <button
// //               onClick={() => setShowReportModal(true)}
// //               className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
// //               </svg>
// //               <span className="hidden sm:inline">Export Report</span>
// //               <span className="sm:hidden">Reports</span>
// //             </button>
// //           )}
// //         </div>

// //         {/* Tabs content */}
// //         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
// //           {user?.role !== 'admin' && (
// //             <>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Overview"
// //                 defaultChecked
// //                 onChange={() => handleTabChange('overview')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveOverview key={`overview-${key}`} />
// //               </div>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Requests"
// //                 defaultChecked={user?.role === 'admin'}
// //                 onChange={() => handleTabChange('requests')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveRequest key={`requests-${key}`} />
// //               </div>

// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Calendar"
// //                 onChange={() => handleTabChange('calendar')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveCalendar key={`calendar-${key}`} />
// //               </div>
// //             </>
// //           )}
// //           {user?.role === 'admin' && (
// //             <>
// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Requests"
// //                 defaultChecked
// //                 onChange={() => handleTabChange('requests')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <AdminLeaveRequest key={`requests-${key}`} />
// //               </div>

// //               <input
// //                 type="radio"
// //                 name="leaves_tabs"
// //                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
// //                 aria-label="Leave Types"
// //                 onChange={() => handleTabChange('types')}
// //               />
// //               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
// //                 <LeaveType key={`types-${key}`} />
// //               </div>
// //             </>
// //           )}
// //         </div>

// //         {/* Enhanced Report Modal */}
// //         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
// //           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
// //             {/* Modal Header */}
// //             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
// //               <div className="flex items-center gap-4 relative z-10">
// //                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
// //                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
// //                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
// //                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
// //                 </div>
                
// //                 <div className="flex flex-col">
// //                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
// //                     Leave Reports
// //                   </h3>
// //                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
// //                     Generate and export comprehensive leave reports
// //                   </p>
// //                 </div>
// //               </div>
              
// //               <button
// //                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
// //                 onClick={() => setShowReportModal(false)}
// //               >
// //                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
// //                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {/* Report Type Selection */}
// //             <div className="flex border-b border-slate-200 dark:border-slate-600">
// //               <button
// //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// //                   activeReportType === 'applications' 
// //                     ? theme === 'light' 
// //                       ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
// //                       : 'bg-blue-900/30 text-blue-300 border-b-2 border-blue-400'
// //                     : theme === 'light'
// //                       ? 'text-slate-600 hover:bg-slate-50'
// //                       : 'text-slate-400 hover:bg-slate-700/50'
// //                 }`}
// //                 onClick={() => setActiveReportType('applications')}
// //               >
// //                 <FaRegCalendarTimes className="inline mr-2 h-4 w-4" />
// //                 Applications Report
// //               </button>
// //               <button
// //                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
// //                   activeReportType === 'balance' 
// //                     ? theme === 'light' 
// //                       ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
// //                       : 'bg-green-900/30 text-green-300 border-b-2 border-green-400'
// //                     : theme === 'light'
// //                       ? 'text-slate-600 hover:bg-slate-50'
// //                       : 'text-slate-400 hover:bg-slate-700/50'
// //                 }`}
// //                 onClick={() => setActiveReportType('balance')}
// //               >
// //                 <FaUsers className="inline mr-2 h-4 w-4" />
// //                 Balance Report
// //               </button>
// //             </div>

// //             {/* Modal Content */}
// //             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
// //               {/* Applications Report */}
// //               {activeReportType === 'applications' && (
// //                 <div>
// //                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// //                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       <FaFilter className="inline mr-2" />
// //                       Applications Report Filters
// //                     </h4>
                    
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //                       {/* Date Range */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Start Date
// //                         </label>
// //                         <input
// //                           type="date"
// //                           value={reportFilters.startDate}
// //                           onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
// //                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         />
// //                       </div>
                      
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           End Date
// //                         </label>
// //                         <input
// //                           type="date"
// //                           value={reportFilters.endDate}
// //                           onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
// //                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         />
// //                       </div>

// //                       {/* Company Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Company
// //                         </label>
// //                         <select
// //                           value={reportFilters.company}
// //                           onChange={(e) => setReportFilters(prev => ({ 
// //                             ...prev, 
// //                             company: e.target.value,
// //                             department: 'all'
// //                           }))}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         >
// //                           <option value="all">All Companies</option>
// //                           {companies.map(company => (
// //                             <option key={company.id} value={company.id}>{company.name}</option>
// //                           ))}
// //                         </select>
// //                       </div>

// //                       {/* Application Report Department Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Department 
// //                           <span className="text-xs ml-2 opacity-70">
// //                             ({applicationDepartments.length} available)
// //                           </span>
// //                         </label>
// //                         <select
// //                           value={reportFilters.department}
// //                           onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
// //                           disabled={reportFilters.company === 'all' || applicationDepartments.length === 0}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${reportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                         >
// //                           <option value="all">All Departments</option>
// //                           {applicationDepartments.map(dept => (
// //                             <option key={dept.value} value={dept.value}>{dept.label}</option>
// //                           ))}
// //                         </select>
// //                         {reportFilters.company === 'all' && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                               Select a company first
// //                             </span>
// //                           </label>
// //                         )}
// //                         {reportFilters.company !== 'all' && applicationDepartments.length === 0 && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //                               Loading departments...
// //                             </span>
// //                           </label>
// //                         )}
// //                       </div>

// //                       {/* Status Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Status
// //                         </label>
// //                         <select
// //                           value={reportFilters.status}
// //                           onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         >
// //                           <option value="all">All Status</option>
// //                           <option value="PENDING">Pending</option>
// //                           <option value="APPROVED">Approved</option>
// //                           <option value="REJECTED">Rejected</option>
// //                           <option value="CANCELLED">Cancelled</option>
// //                         </select>
// //                       </div>

// //                       {/* Leave Type Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Leave Type
// //                         </label>
// //                         <select
// //                           value={reportFilters.leaveType}
// //                           onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         >
// //                           <option value="all">All Leave Types</option>
// //                           <option value="Annual Leave">Annual Leave</option>
// //                           <option value="Sick Leave">Sick Leave</option>
// //                           <option value="Maternity Leave">Maternity Leave</option>
// //                           <option value="Paternity Leave">Paternity Leave</option>
// //                         </select>
// //                       </div>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
// //                       <button
// //                         onClick={generateLeaveReport}
// //                         disabled={isGeneratingReport}
// //                         className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         {isGeneratingReport ? (
// //                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// //                         ) : (
// //                           <FaChartBar className="h-4 w-4" />
// //                         )}
// //                         Generate Applications Report
// //                       </button>
                      
// //                       <button
// //                         onClick={exportApplicationsToCSV}
// //                         disabled={reportData.length === 0}
// //                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         <FaFileExport className="h-4 w-4" />
// //                         Export to CSV
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Applications Report Results */}
// //                   {reportData.length > 0 && (
// //                     <div className="overflow-x-auto">
// //                       <table className="table table-zebra w-full">
// //                         <thead>
// //                           <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// //                             <th>Employee</th>
// //                             <th>Leave Type</th>
// //                             <th>Start Date</th>
// //                             <th>End Date</th>
// //                             <th>Days</th>
// //                             <th>Status</th>
// //                             <th>Company</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {reportData.map((item, index) => (
// //                             <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// //                               <td>
// //                                 <div className="font-medium">{item.employee_name}</div>
// //                                 <div className="text-sm opacity-70">{item.employee_id}</div>
// //                               </td>
// //                               <td>{item.leave_type}</td>
// //                               <td>{new Date(item.start_date).toLocaleDateString()}</td>
// //                               <td>{new Date(item.end_date).toLocaleDateString()}</td>
// //                               <td>{item.days}</td>
// //                               <td>
// //                                 <span className={`badge ${
// //                                   item.status === 'APPROVED' ? 'badge-success' :
// //                                   item.status === 'REJECTED' ? 'badge-error' :
// //                                   item.status === 'PENDING' ? 'badge-warning' :
// //                                   'badge-neutral'
// //                                 }`}>
// //                                   {item.status}
// //                                 </span>
// //                               </td>
// //                               <td>{item.company}</td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
                      
// //                       <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                         Total Records: {reportData.length}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {reportData.length === 0 && !isGeneratingReport && (
// //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                       <FaRegCalendarTimes className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                       <p>No applications data generated yet. Apply filters and click "Generate Applications Report".</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Balance Report */}
// //               {activeReportType === 'balance' && (
// //                 <div>
// //                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
// //                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                       <FaFilter className="inline mr-2" />
// //                       Balance Report Filters
// //                     </h4>
                    
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //                       {/* Company Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           <FaBuilding className="inline mr-1 h-3 w-3" />
// //                           Company
// //                         </label>
// //                         <select
// //                           value={balanceReportFilters.company}
// //                           onChange={(e) => setBalanceReportFilters(prev => ({ 
// //                             ...prev, 
// //                             company: e.target.value,
// //                             department: 'all',
// //                             employeeId: 'all'
// //                           }))}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         >
// //                           <option value="all">All Companies</option>
// //                           {companies.map(company => (
// //                             <option key={company.id} value={company.id}>{company.name}</option>
// //                           ))}
// //                         </select>
// //                       </div>

// //                       {/* Balance Report Department Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           Department 
// //                           <span className="text-xs ml-2 opacity-70">
// //                             ({balanceDepartments.length} available)
// //                           </span>
// //                         </label>
// //                         <select
// //                           value={balanceReportFilters.department}
// //                           onChange={(e) => setBalanceReportFilters(prev => ({ 
// //                             ...prev, 
// //                             department: e.target.value,
// //                             employeeId: 'all'
// //                           }))}
// //                           disabled={balanceReportFilters.company === 'all' || balanceDepartments.length === 0}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                         >
// //                           <option value="all">All Departments</option>
// //                           {balanceDepartments.map(dept => (
// //                             <option key={dept.value} value={dept.value}>{dept.label}</option>
// //                           ))}
// //                         </select>
// //                         {balanceReportFilters.company === 'all' && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                               Select a company first
// //                             </span>
// //                           </label>
// //                         )}
// //                         {balanceReportFilters.company !== 'all' && balanceDepartments.length === 0 && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //                               Loading departments...
// //                             </span>
// //                           </label>
// //                         )}
// //                       </div>

// //                       {/* Balance Report Employee Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           <FaUser className="inline mr-1 h-3 w-3" />
// //                           Employee 
// //                           <span className="text-xs ml-2 opacity-70">
// //                             ({balanceEmployees.length} available)
// //                           </span>
// //                         </label>
// //                         <select
// //                           value={balanceReportFilters.employeeId}
// //                           onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, employeeId: e.target.value }))}
// //                           disabled={balanceReportFilters.company === 'all' || balanceEmployees.length === 0}
// //                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                         >
// //                           <option value="all">All Employees</option>
// //                           {balanceEmployees.map(emp => (
// //                             <option key={emp.value} value={emp.value}>{emp.label}</option>
// //                           ))}
// //                         </select>
// //                         {balanceReportFilters.company === 'all' && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                               Select a company first
// //                             </span>
// //                           </label>
// //                         )}
// //                         {balanceReportFilters.company !== 'all' && balanceReportFilters.department !== 'all' && balanceEmployees.length === 0 && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //                               {`No employees found in this department`}
// //                             </span>
// //                           </label>
// //                         )}
// //                         {balanceReportFilters.company !== 'all' && balanceReportFilters.department === 'all' && balanceEmployees.length === 0 && (
// //                           <label className="label">
// //                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
// //                               Loading employees...
// //                             </span>
// //                           </label>
// //                         )}
// //                       </div>

// //                       {/* As of Date Filter */}
// //                       <div>
// //                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                           As of Date
// //                         </label>
// //                         <input
// //                           type="date"
// //                           value={balanceReportFilters.asOfDate}
// //                           onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
// //                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
// //                         />
// //                       </div>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
// //                       <button
// //                         onClick={generateBalanceReport}
// //                         disabled={isGeneratingBalanceReport}
// //                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         {isGeneratingBalanceReport ? (
// //                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
// //                         ) : (
// //                           <FaUsers className="h-4 w-4" />
// //                         )}
// //                         Generate Balance Report
// //                       </button>
                      
// //                       <button
// //                         onClick={exportBalanceToCSV}
// //                         disabled={balanceReportData.length === 0}
// //                         className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0 flex items-center gap-2`}
// //                       >
// //                         <FaFileExport className="h-4 w-4" />
// //                         Export to CSV
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Balance Report Results */}
// //                   {balanceReportData.length > 0 && (
// //                     <div className="space-y-6">
// //                       {balanceReportData.map((employee, index) => (
// //                         <div key={employee.employee_id} className={`border rounded-lg ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
// //                           {/* Employee Header */}
// //                           <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
// //                             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
// //                               <div>
// //                                 <h4 className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
// //                                   {employee.employee_name}
// //                                 </h4>
// //                                 <div className="flex flex-wrap gap-4 mt-1 text-sm">
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     ID: {employee.employee_code}
// //                                   </span>
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     Company: {employee.company}
// //                                   </span>
// //                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
// //                                     Department: {employee.department}
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                               <div className={`text-sm font-medium mt-2 sm:mt-0 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
// //                                 Total Leave Types: {employee.leave_balances.length}
// //                               </div>
// //                             </div>
// //                           </div>

// //                           {/* Leave Balances */}
// //                           <div className="overflow-x-auto">
// //                             <table className="table table-zebra w-full">
// //                               <thead>
// //                                 <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
// //                                   <th>Leave Type</th>
// //                                   <th>Total Allocated</th>
// //                                   <th>Leaves Taken</th>
// //                                   <th>Balance</th>
// //                                   <th>Carry Forward</th>
// //                                   <th>Status</th>
// //                                 </tr>
// //                               </thead>
// //                               <tbody>
// //                                 {employee.leave_balances.map((balance, balanceIndex) => (
// //                                   <tr key={balanceIndex} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
// //                                     <td className="font-medium">{balance.leave_type}</td>
// //                                     <td>{balance.total_allocated}</td>
// //                                     <td>{balance.leaves_taken}</td>
// //                                     <td>
// //                                       <span className={`font-bold ${getBalanceColor(balance.balance, balance.total_allocated)}`}>
// //                                         {balance.balance}
// //                                       </span>
// //                                     </td>
// //                                     <td>
// //                                       <span className={`badge ${balance.carry_forward ? 'badge-success' : 'badge-neutral'}`}>
// //                                         {balance.carry_forward ? 'Yes' : 'No'}
// //                                       </span>
// //                                     </td>
// //                                     <td>
// //                                       <span className={`badge ${balance.leave_type_active ? 'badge-success' : 'badge-error'}`}>
// //                                         {balance.leave_type_active ? 'Active' : 'Inactive'}
// //                                       </span>
// //                                     </td>
// //                                   </tr>
// //                                 ))}
// //                               </tbody>
// //                             </table>
// //                           </div>
// //                         </div>
// //                       ))}
                      
// //                       <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                         Total Employees: {balanceReportData.length} | 
// //                         Generated on: {new Date().toLocaleDateString()}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {balanceReportData.length === 0 && !isGeneratingBalanceReport && (
// //                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //                       <FaUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                       <p>No balance data generated yet. Apply filters and click "Generate Balance Report".</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <form method="dialog" className="modal-backdrop">
// //             <button onClick={() => setShowReportModal(false)}>close</button>
// //           </form>
// //         </dialog>
// //       </div>
// //     </>
// //   )
// // }

// // export default LeavesPage;

// // export default LeavesPage

// 'use client';

// import React, { useState, useEffect } from 'react'
// import LeaveOverview from './LeaveOverview';
// import LeaveCalendar from './LeaveCalendar';
// import LeaveRequest from './LeaveRequest';
// import AdminLeaveRequest from './AdminLeaveRequest';
// import LeaveType from './LeaveType';
// import { 
//   FaRegCalendarTimes, 
//   FaChartBar, 
//   FaFileExport, 
//   FaFilter, 
//   FaUser,
//   FaBuilding,
//   FaUsers 
// } from "react-icons/fa";
// import { useTheme } from '../components/ThemeProvider';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useNotification } from '../hooks/useNotification';
// import NotificationToast from '../components/NotificationToast';
// import { ImportIcon } from 'lucide-react';
// import { CiImport } from 'react-icons/ci';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// // Report data interfaces
// interface LeaveReportData {
//   employee_id: string;
//   employee_name: string;
//   leave_type: string;
//   start_date: string;
//   end_date: string;
//   days: number;
//   status: string;
//   company: string;
//   department: string;
// }

// interface LeaveBalanceData {
//   employee_id: string;
//   employee_code: string;
//   employee_name: string;
//   email: string;
//   company: string;
//   department: string;
//   leave_balances: {
//     leave_type: string;
//     total_allocated: number;
//     leaves_taken: number;
//     balance: number;
//     carry_forward: boolean;
//     carry_forward_balance: number;
//     leave_type_active: boolean;
//   }[];
// }

// interface FilterOption {
//   value: string;
//   label: string;
//   company?: string;
// }

// interface Company {
//   id: number;
//   name: string;
// }

// const LeavesPage = () => {
//   const { theme } = useTheme();
//   const { notification, showNotification } = useNotification();
//   const [key, setKey] = useState(0);
//   const [user, setUser] = useState<User | null>(null);
//   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
//   const [activeTab, setActiveTab] = useState('');

//   // Report states
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [activeReportType, setActiveReportType] = useState<'applications' | 'balance'>('applications');
//   const [reportData, setReportData] = useState<LeaveReportData[]>([]);
//   const [balanceReportData, setBalanceReportData] = useState<LeaveBalanceData[]>([]);
  
//   // Report filters
//   const [reportFilters, setReportFilters] = useState({
//     startDate: '',
//     endDate: '',
//     company: 'all',
//     department: 'all',
//     status: 'all',
//     leaveType: 'all'
//   });

//   const [balanceReportFilters, setBalanceReportFilters] = useState({
//     company: 'all',
//     department: 'all',
//     employeeId: 'all',
//     asOfDate: new Date().toISOString().split('T')[0]
//   });

//   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
//   const [isGeneratingBalanceReport, setIsGeneratingBalanceReport] = useState(false);
//   const [companies, setCompanies] = useState<Company[]>([]);

//   const [applicationDepartments, setApplicationDepartments] = useState<FilterOption[]>([]);
//   const [balanceDepartments, setBalanceDepartments] = useState<FilterOption[]>([]);
//   const [balanceEmployees, setBalanceEmployees] = useState<FilterOption[]>([]);

//   useEffect(() => {
//     const user = localStorage.getItem('hrms_user');
//     if (user) {
//       const userData = JSON.parse(user);
//       setUser(userData);
//     }

//     const lastMenu = localStorage.getItem('lastOpenedMenu');
//     setLastOpenedMenu(lastMenu);

//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     if (reportFilters.company !== 'all') {
//       fetchApplicationDepartments(reportFilters.company);
//     } else {
//       setApplicationDepartments([]);
//     }
//   }, [reportFilters.company]);

//   const exportReportToCSV = () => {
//     if (reportData.length === 0) {
//       showNotification('No data to export', 'error');
//       return;
//     }

//     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
//     const csvContent = [
//       headers.join(','),
//       ...reportData.map(row => [
//         row.employee_id || '',
//         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
//         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
//         row.start_date || '',
//         row.end_date || '',
//         row.days || '',
//         row.status || '',
//         `"${(row.company || '').replace(/"/g, '""')}"`,
//         `"${(row.department || '').replace(/"/g, '""')}"`
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     showNotification('Report exported successfully', 'success');
//   };

//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/companies`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       if (response.data && Array.isArray(response.data)) {
//         const uniqueCompanies = response.data
//           .filter((company: any) => company.is_active === 1)
//           .filter((company: any, index, self) => 
//             index === self.findIndex((c: any) => c.id === company.id)
//           )
//           .map((company: any) => ({
//             id: company.id,
//             name: company.company_name || company.name
//           }))
//           .sort((a, b) => a.name.localeCompare(b.name));
        
//         setCompanies(uniqueCompanies);
//       }
//     } catch (err) {
//       console.error('Error fetching companies:', err);
//       setCompanies([]);
//     }
//   };

//   const handleTabChange = (tabName: string) => {
//     setActiveTab(tabName);
//     setKey(prev => prev + 1);
//   };

//   // Applications Report functions - UPDATED
//   const generateLeaveReport = async () => {
//     try {
//       setIsGeneratingReport(true);
      
//       // Prepare parameters
//       const params: any = {};

//       // Add date filters
//       if (reportFilters.startDate) {
//         params.startDate = reportFilters.startDate;
//       }
//       if (reportFilters.endDate) {
//         params.endDate = reportFilters.endDate;
//       }

//       // Add company filter if not 'all' - NOW USING ID
//       if (reportFilters.company !== 'all') {
//         params.company = reportFilters.company;
//       }

//       // Add department filter if not 'all' - USING ID
//       if (reportFilters.department !== 'all') {
//         params.department = reportFilters.department;
//       }

//       // Add status filter if not 'all'
//       if (reportFilters.status !== 'all') {
//         params.status = reportFilters.status;
//       }

//       // Add leave type filter if not 'all'
//       if (reportFilters.leaveType !== 'all') {
//         params.leaveType = reportFilters.leaveType;
//       }

//       console.log('Applications Report API Params:', params);

//       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: params
//       });

//       console.log('Applications Report API Response:', response.data);
      
//       if (response.data && response.data.data) {
//         setReportData(response.data.data);
//         showNotification('Report generated successfully', 'success');
//       } else {
//         setReportData([]);
//         showNotification('No data found for the selected filters', 'info');
//       }
//     } catch (err: any) {
//       console.error('Error generating report:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to generate report';
//       showNotification(errorMessage, 'error');
//       setReportData([]);
//     } finally {
//       setIsGeneratingReport(false);
//     }
//   };

//   // Balance Report functions - UPDATED
//   const generateBalanceReport = async () => {
//     try {
//       setIsGeneratingBalanceReport(true);
      
//       // Prepare parameters
//       const params: any = {
//         asOfDate: balanceReportFilters.asOfDate
//       };

//       // Add company filter if not 'all' - NOW USING ID
//       if (balanceReportFilters.company !== 'all') {
//         params.company = balanceReportFilters.company;
//       }

//       // Add department filter if not 'all' - USING ID
//       if (balanceReportFilters.department !== 'all') {
//         params.department = balanceReportFilters.department;
//       }

//       // Add employee filter if not 'all' - USING ID
//       if (balanceReportFilters.employeeId !== 'all') {
//         params.employeeId = balanceReportFilters.employeeId;
//       }

//       console.log('Balance Report API Params:', params);

//       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/balance`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: params
//       });

//       console.log('Balance Report API Response:', response.data);
      
//       if (response.data && response.data.data) {
//         setBalanceReportData(response.data.data);
//         showNotification('Balance report generated successfully', 'success');
//       } else {
//         setBalanceReportData([]);
//         showNotification('No data found for the selected filters', 'info');
//       }
//     } catch (err: any) {
//       console.error('Error generating balance report:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to generate balance report';
//       showNotification(errorMessage, 'error');
//       setBalanceReportData([]);
//     } finally {
//       setIsGeneratingBalanceReport(false);
//     }
//   };

//   const exportApplicationsToCSV = () => {
//     if (reportData.length === 0) {
//       showNotification('No data to export', 'error');
//       return;
//     }

//     const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
//     const csvContent = [
//       headers.join(','),
//       ...reportData.map(row => [
//         row.employee_id || '',
//         `"${(row.employee_name || '').replace(/"/g, '""')}"`,
//         `"${(row.leave_type || '').replace(/"/g, '""')}"`,
//         row.start_date || '',
//         row.end_date || '',
//         row.days || '',
//         row.status || '',
//         `"${(row.company || '').replace(/"/g, '""')}"`,
//         `"${(row.department || '').replace(/"/g, '""')}"`
//       ].join(','))
//     ].join('\n');

//     downloadCSV(csvContent, `leave-applications-report-${new Date().toISOString().split('T')[0]}.csv`);
//     showNotification('Applications report exported successfully', 'success');
//   };

//   const exportBalanceToCSV = () => {
//     if (balanceReportData.length === 0) {
//       showNotification('No data to export', 'error');
//       return;
//     }

//     const headers = ['Employee ID', 'Employee Name', 'Company', 'Department', 'Leave Type', 'Total Allocated', 'Leaves Taken', 'Balance', 'Carry Forward'];
    
//     const rows: string[] = [];
//     balanceReportData.forEach(employee => {
//       employee.leave_balances.forEach(balance => {
//         rows.push([
//           employee.employee_code || '',
//           `"${(employee.employee_name || '').replace(/"/g, '""')}"`,
//           `"${(employee.company || '').replace(/"/g, '""')}"`,
//           `"${(employee.department || '').replace(/"/g, '""')}"`,
//           `"${(balance.leave_type || '').replace(/"/g, '""')}"`,
//           balance.total_allocated || 0,
//           balance.leaves_taken || 0,
//           balance.balance || 0,
//           balance.carry_forward ? 'Yes' : 'No'
//         ].join(','));
//       });
//     });

//     const csvContent = [headers.join(','), ...rows].join('\n');
//     downloadCSV(csvContent, `leave-balance-report-${new Date().toISOString().split('T')[0]}.csv`);
//     showNotification('Balance report exported successfully', 'success');
//   };

//   const downloadCSV = (content: string, filename: string) => {
//     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getBalanceColor = (balance: number, total: number) => {
//     const percentage = (balance / total) * 100;
//     if (percentage > 50) return 'text-green-600';
//     if (percentage > 25) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   // Fetch employees for balance report - UPDATED
//   const fetchBalanceEmployees = async (companyId: string, departmentId: string) => {
//     try {
//       let employees: any[] = [];

//       if (departmentId !== 'all') {
//         // Fetch employees by department
//         const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         });

//         console.log('Employees by Department API Response:', response.data);
        
//         // Handle different response structures
//         if (response.data && Array.isArray(response.data)) {
//           employees = response.data;
//         } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
//           employees = response.data.employees;
//         } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
//           employees = response.data.data;
//         } else {
//           console.warn('Unexpected API response structure for department employees:', response.data);
//           employees = [];
//         }
//       } else {
//         // Fetch employees by company
//         const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         });

//         console.log('Employees by Company API Response:', response.data);
        
//         // Handle different response structures
//         if (response.data && Array.isArray(response.data)) {
//           employees = response.data;
//         } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
//           employees = response.data.employees;
//         } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
//           employees = response.data.data;
//         } else {
//           console.warn('Unexpected API response structure for company employees:', response.data);
//           employees = [];
//         }
//       }

//       console.log('Processed employees:', employees);

//       const employeeOptions = employees
//         .filter((emp: any) => emp && emp.id && emp.name) // Filter out invalid entries
//         .map((emp: any) => ({
//           value: emp.id.toString(),
//           label: `${emp.employee_no || emp.employee_code || ''} - ${emp.name}`.trim()
//         }));

//       console.log('Employee options:', employeeOptions);
//       setBalanceEmployees(employeeOptions);
//     } catch (err) {
//       console.error('Error fetching balance employees:', err);
//       setBalanceEmployees([]);
//     }
//   };

//   // Fetch departments for application report - UPDATED
//   const fetchApplicationDepartments = async (companyId: string) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });

//       console.log('Application Departments API Response:', response.data);

//       if (response.data.success && Array.isArray(response.data.departments)) {
//         const departmentOptions = response.data.departments.map((dept: any) => ({
//           value: dept.id.toString(),
//           label: dept.department_name
//         }));
//         setApplicationDepartments(departmentOptions);
//       } else {
//         console.warn('No departments found in response');
//         setApplicationDepartments([]);
//       }
//     } catch (err) {
//       console.error('Error fetching application departments:', err);
//       setApplicationDepartments([]);
//     }
//   };

//   // Fetch departments for balance report - UPDATED
//   const fetchBalanceDepartments = async (companyId: string) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });

//       console.log('Balance Departments API Response:', response.data);

//       if (response.data.success && Array.isArray(response.data.departments)) {
//         const departmentOptions = response.data.departments.map((dept: any) => ({
//           value: dept.id.toString(),
//           label: dept.department_name
//         }));
//         setBalanceDepartments(departmentOptions);
//       } else {
//         console.warn('No departments found in response');
//         setBalanceDepartments([]);
//       }
//     } catch (err) {
//       console.error('Error fetching balance departments:', err);
//       setBalanceDepartments([]);
//     }
//   };

//   // Application report useEffect - UPDATED
//   useEffect(() => {
//     if (reportFilters.company !== 'all') {
//       fetchApplicationDepartments(reportFilters.company);
//     } else {
//       setApplicationDepartments([]);
//       setReportFilters(prev => ({ ...prev, department: 'all' }));
//     }
//   }, [reportFilters.company]);

//   // Balance report useEffect - UPDATED
//   useEffect(() => {
//     if (balanceReportFilters.company !== 'all') {
//       fetchBalanceDepartments(balanceReportFilters.company);
//       fetchBalanceEmployees(balanceReportFilters.company, 'all');
//     } else {
//       setBalanceDepartments([]);
//       setBalanceEmployees([]);
//       setBalanceReportFilters(prev => ({ ...prev, department: 'all', employeeId: 'all' }));
//     }
//   }, [balanceReportFilters.company]);

//   // Balance report department change useEffect - UPDATED
//   useEffect(() => {
//     console.log('Department changed:', {
//       company: balanceReportFilters.company,
//       department: balanceReportFilters.department
//     });
    
//     if (balanceReportFilters.company !== 'all') {
//       fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
//     }
//   }, [balanceReportFilters.department]);

//   return (
//     <>
//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//       />
      
//       <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//             <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
//             <span className="truncate">Manage Leaves</span>
//           </h1>
          
//           {/* Only show Export Report button for admin users */}
//           {user?.role === 'admin' && (
//             <button
//               onClick={() => setShowReportModal(true)}
//               className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//               <span className="hidden sm:inline">Export Report</span>
//               <span className="sm:hidden">Reports</span>
//             </button>
//           )}
//         </div>

//         {/* Tabs content */}
//         <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
//           {user?.role !== 'admin' && (
//             <>
//               <input
//                 type="radio"
//                 name="leaves_tabs"
//                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
//                 aria-label="Overview"
//                 defaultChecked
//                 onChange={() => handleTabChange('overview')}
//               />
//               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
//                 <LeaveOverview key={`overview-${key}`} />
//               </div>
//               <input
//                 type="radio"
//                 name="leaves_tabs"
//                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
//                 aria-label="Leave Requests"
//                 defaultChecked={user?.role === 'admin'}
//                 onChange={() => handleTabChange('requests')}
//               />
//               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
//                 <LeaveRequest key={`requests-${key}`} />
//               </div>

//               <input
//                 type="radio"
//                 name="leaves_tabs"
//                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
//                 aria-label="Calendar"
//                 onChange={() => handleTabChange('calendar')}
//               />
//               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
//                 <LeaveCalendar key={`calendar-${key}`} />
//               </div>
//             </>
//           )}
//           {user?.role === 'admin' && (
//             <>
//               <input
//                 type="radio"
//                 name="leaves_tabs"
//                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
//                 aria-label="Leave Requests"
//                 defaultChecked
//                 onChange={() => handleTabChange('requests')}
//               />
//               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
//                 <AdminLeaveRequest key={`requests-${key}`} />
//               </div>

//               <input
//                 type="radio"
//                 name="leaves_tabs"
//                 className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
//                 aria-label="Leave Types"
//                 onChange={() => handleTabChange('types')}
//               />
//               <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
//                 <LeaveType key={`types-${key}`} />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Enhanced Report Modal */}
//         <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
//           <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
//             {/* Modal Header */}
//             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
//               <div className="flex items-center gap-4 relative z-10">
//                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
//                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
//                   <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
//                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
//                 </div>
                
//                 <div className="flex flex-col">
//                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
//                     Leave Reports
//                   </h3>
//                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
//                     Generate and export comprehensive leave reports
//                   </p>
//                 </div>
//               </div>
              
//               <button
//                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
//                 onClick={() => setShowReportModal(false)}
//               >
//                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
//                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Report Type Selection */}
//             <div className="flex border-b border-slate-200 dark:border-slate-600">
//               <button
//                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
//                   activeReportType === 'applications' 
//                     ? theme === 'light' 
//                       ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
//                       : 'bg-blue-900/30 text-blue-300 border-b-2 border-blue-400'
//                     : theme === 'light'
//                       ? 'text-slate-600 hover:bg-slate-50'
//                       : 'text-slate-400 hover:bg-slate-700/50'
//                 }`}
//                 onClick={() => setActiveReportType('applications')}
//               >
//                 <FaRegCalendarTimes className="inline mr-2 h-4 w-4" />
//                 Applications Report
//               </button>
//               <button
//                 className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
//                   activeReportType === 'balance' 
//                     ? theme === 'light' 
//                       ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
//                       : 'bg-green-900/30 text-green-300 border-b-2 border-green-400'
//                     : theme === 'light'
//                       ? 'text-slate-600 hover:bg-slate-50'
//                       : 'text-slate-400 hover:bg-slate-700/50'
//                 }`}
//                 onClick={() => setActiveReportType('balance')}
//               >
//                 <FaUsers className="inline mr-2 h-4 w-4" />
//                 Balance Report
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
//               {/* Applications Report */}
//               {activeReportType === 'applications' && (
//                 <div>
//                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
//                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                       <FaFilter className="inline mr-2" />
//                       Applications Report Filters
//                     </h4>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {/* Date Range */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Start Date
//                         </label>
//                         <input
//                           type="date"
//                           value={reportFilters.startDate}
//                           onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
//                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         />
//                       </div>
                      
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           End Date
//                         </label>
//                         <input
//                           type="date"
//                           value={reportFilters.endDate}
//                           onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
//                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         />
//                       </div>

//                       {/* Company Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Company
//                         </label>
//                         <select
//                           value={reportFilters.company}
//                           onChange={(e) => setReportFilters(prev => ({ 
//                             ...prev, 
//                             company: e.target.value,
//                             department: 'all'
//                           }))}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         >
//                           <option value="all">All Companies</option>
//                           {companies.map(company => (
//                             <option key={company.id} value={company.id}>{company.name}</option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Application Report Department Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Department 
//                           <span className="text-xs ml-2 opacity-70">
//                             ({applicationDepartments.length} available)
//                           </span>
//                         </label>
//                         <select
//                           value={reportFilters.department}
//                           onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
//                           disabled={reportFilters.company === 'all' || applicationDepartments.length === 0}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${reportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                           <option value="all">All Departments</option>
//                           {applicationDepartments.map(dept => (
//                             <option key={dept.value} value={dept.value}>{dept.label}</option>
//                           ))}
//                         </select>
//                         {reportFilters.company === 'all' && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                               Select a company first
//                             </span>
//                           </label>
//                         )}
//                         {reportFilters.company !== 'all' && applicationDepartments.length === 0 && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
//                               Loading departments...
//                             </span>
//                           </label>
//                         )}
//                       </div>

//                       {/* Status Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Status
//                         </label>
//                         <select
//                           value={reportFilters.status}
//                           onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         >
//                           <option value="all">All Status</option>
//                           <option value="PENDING">Pending</option>
//                           <option value="APPROVED">Approved</option>
//                           <option value="REJECTED">Rejected</option>
//                           <option value="CANCELLED">Cancelled</option>
//                         </select>
//                       </div>

//                       {/* Leave Type Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Leave Type
//                         </label>
//                         <select
//                           value={reportFilters.leaveType}
//                           onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         >
//                           <option value="all">All Leave Types</option>
//                           <option value="Annual Leave">Annual Leave</option>
//                           <option value="Sick Leave">Sick Leave</option>
//                           <option value="Maternity Leave">Maternity Leave</option>
//                           <option value="Paternity Leave">Paternity Leave</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
//                       <button
//                         onClick={generateLeaveReport}
//                         disabled={isGeneratingReport}
//                         className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
//                       >
//                         {isGeneratingReport ? (
//                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
//                         ) : (
//                           <FaChartBar className="h-4 w-4" />
//                         )}
//                         Generate Applications Report
//                       </button>
                      
//                       <button
//                         onClick={exportApplicationsToCSV}
//                         disabled={reportData.length === 0}
//                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
//                       >
//                         <FaFileExport className="h-4 w-4" />
//                         Export to CSV
//                       </button>
//                     </div>
//                   </div>

//                   {/* Applications Report Results */}
//                   {reportData.length > 0 && (
//                     <div className="overflow-x-auto">
//                       <table className="table table-zebra w-full">
//                         <thead>
//                           <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
//                             <th>Employee</th>
//                             <th>Leave Type</th>
//                             <th>Start Date</th>
//                             <th>End Date</th>
//                             <th>Days</th>
//                             <th>Status</th>
//                             <th>Company</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {reportData.map((item, index) => (
//                             <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
//                               <td>
//                                 <div className="font-medium">{item.employee_name}</div>
//                                 <div className="text-sm opacity-70">{item.employee_id}</div>
//                               </td>
//                               <td>{item.leave_type}</td>
//                               <td>{new Date(item.start_date).toLocaleDateString()}</td>
//                               <td>{new Date(item.end_date).toLocaleDateString()}</td>
//                               <td>{item.days}</td>
//                               <td>
//                                 <span className={`badge ${
//                                   item.status === 'APPROVED' ? 'badge-success' :
//                                   item.status === 'REJECTED' ? 'badge-error' :
//                                   item.status === 'PENDING' ? 'badge-warning' :
//                                   'badge-neutral'
//                                 }`}>
//                                   {item.status}
//                                 </span>
//                               </td>
//                               <td>{item.company}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
                      
//                       <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                         Total Records: {reportData.length}
//                       </div>
//                     </div>
//                   )}

//                   {reportData.length === 0 && !isGeneratingReport && (
//                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                       <FaRegCalendarTimes className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>No applications data generated yet. Apply filters and click "Generate Applications Report".</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Balance Report */}
//               {activeReportType === 'balance' && (
//                 <div>
//                   <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
//                     <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                       <FaFilter className="inline mr-2" />
//                       Balance Report Filters
//                     </h4>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                       {/* Company Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           <FaBuilding className="inline mr-1 h-3 w-3" />
//                           Company
//                         </label>
//                         <select
//                           value={balanceReportFilters.company}
//                           onChange={(e) => setBalanceReportFilters(prev => ({ 
//                             ...prev, 
//                             company: e.target.value,
//                             department: 'all',
//                             employeeId: 'all'
//                           }))}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         >
//                           <option value="all">All Companies</option>
//                           {companies.map(company => (
//                             <option key={company.id} value={company.id}>{company.name}</option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Balance Report Department Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           Department 
//                           <span className="text-xs ml-2 opacity-70">
//                             ({balanceDepartments.length} available)
//                           </span>
//                         </label>
//                         <select
//                           value={balanceReportFilters.department}
//                           onChange={(e) => setBalanceReportFilters(prev => ({ 
//                             ...prev, 
//                             department: e.target.value,
//                             employeeId: 'all'
//                           }))}
//                           disabled={balanceReportFilters.company === 'all' || balanceDepartments.length === 0}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                           <option value="all">All Departments</option>
//                           {balanceDepartments.map(dept => (
//                             <option key={dept.value} value={dept.value}>{dept.label}</option>
//                           ))}
//                         </select>
//                         {balanceReportFilters.company === 'all' && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                               Select a company first
//                             </span>
//                           </label>
//                         )}
//                         {balanceReportFilters.company !== 'all' && balanceDepartments.length === 0 && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
//                               Loading departments...
//                             </span>
//                           </label>
//                         )}
//                       </div>

//                       {/* Balance Report Employee Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           <FaUser className="inline mr-1 h-3 w-3" />
//                           Employee 
//                           <span className="text-xs ml-2 opacity-70">
//                             ({balanceEmployees.length} available)
//                           </span>
//                         </label>
//                         <select
//                           value={balanceReportFilters.employeeId}
//                           onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, employeeId: e.target.value }))}
//                           disabled={balanceReportFilters.company === 'all' || balanceEmployees.length === 0}
//                           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                           <option value="all">All Employees</option>
//                           {balanceEmployees.map(emp => (
//                             <option key={emp.value} value={emp.value}>{emp.label}</option>
//                           ))}
//                         </select>
//                         {balanceReportFilters.company === 'all' && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                               Select a company first
//                             </span>
//                           </label>
//                         )}
//                         {balanceReportFilters.company !== 'all' && balanceReportFilters.department !== 'all' && balanceEmployees.length === 0 && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
//                               {`No employees found in this department`}
//                             </span>
//                           </label>
//                         )}
//                         {balanceReportFilters.company !== 'all' && balanceReportFilters.department === 'all' && balanceEmployees.length === 0 && (
//                           <label className="label">
//                             <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
//                               Loading employees...
//                             </span>
//                           </label>
//                         )}
//                       </div>

//                       {/* As of Date Filter */}
//                       <div>
//                         <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                           As of Date
//                         </label>
//                         <input
//                           type="date"
//                           value={balanceReportFilters.asOfDate}
//                           onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
//                           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
//                       <button
//                         onClick={generateBalanceReport}
//                         disabled={isGeneratingBalanceReport}
//                         className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
//                       >
//                         {isGeneratingBalanceReport ? (
//                           <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
//                         ) : (
//                           <FaUsers className="h-4 w-4" />
//                         )}
//                         Generate Balance Report
//                       </button>
                      
//                       <button
//                         onClick={exportBalanceToCSV}
//                         disabled={balanceReportData.length === 0}
//                         className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0 flex items-center gap-2`}
//                       >
//                         <FaFileExport className="h-4 w-4" />
//                         Export to CSV
//                       </button>
//                     </div>
//                   </div>

//                   {/* Balance Report Results */}
//                   {balanceReportData.length > 0 && (
//                     <div className="space-y-6">
//                       {balanceReportData.map((employee, index) => (
//                         <div key={employee.employee_id} className={`border rounded-lg ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
//                           {/* Employee Header */}
//                           <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//                               <div>
//                                 <h4 className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
//                                   {employee.employee_name}
//                                 </h4>
//                                 <div className="flex flex-wrap gap-4 mt-1 text-sm">
//                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
//                                     ID: {employee.employee_code}
//                                   </span>
//                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
//                                     Company: {employee.company}
//                                   </span>
//                                   <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
//                                     Department: {employee.department}
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className={`text-sm font-medium mt-2 sm:mt-0 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                                 Total Leave Types: {employee.leave_balances.length}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Leave Balances */}
//                           <div className="overflow-x-auto">
//                             <table className="table table-zebra w-full">
//                               <thead>
//                                 <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
//                                   <th>Leave Type</th>
//                                   <th>Total Allocated</th>
//                                   <th>Leaves Taken</th>
//                                   <th>Balance</th>
//                                   <th>Carry Forward</th>
//                                   <th>Status</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {employee.leave_balances.map((balance, balanceIndex) => (
//                                   <tr key={balanceIndex} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
//                                     <td className="font-medium">{balance.leave_type}</td>
//                                     <td>{balance.total_allocated}</td>
//                                     <td>{balance.leaves_taken}</td>
//                                     <td>
//                                       <span className={`font-bold ${getBalanceColor(balance.balance, balance.total_allocated)}`}>
//                                         {balance.balance}
//                                       </span>
//                                     </td>
//                                     <td>
//                                       <span className={`badge ${balance.carry_forward ? 'badge-success' : 'badge-neutral'}`}>
//                                         {balance.carry_forward ? 'Yes' : 'No'}
//                                       </span>
//                                     </td>
//                                     <td>
//                                       <span className={`badge ${balance.leave_type_active ? 'badge-success' : 'badge-error'}`}>
//                                         {balance.leave_type_active ? 'Active' : 'Inactive'}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       ))}
                      
//                       <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                         Total Employees: {balanceReportData.length} | 
//                         Generated on: {new Date().toLocaleDateString()}
//                       </div>
//                     </div>
//                   )}

//                   {balanceReportData.length === 0 && !isGeneratingBalanceReport && (
//                     <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                       <FaUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>No balance data generated yet. Apply filters and click "Generate Balance Report".</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button onClick={() => setShowReportModal(false)}>close</button>
//           </form>
//         </dialog>
//       </div>
//     </>
//   )
// }

// export default LeavesPage;


'use client';

import React, { useState, useEffect } from 'react'
import LeaveOverview from './LeaveOverview';
import LeaveCalendar from './LeaveCalendar';
import LeaveRequest from './LeaveRequest';
import AdminLeaveRequest from './AdminLeaveRequest';
import LeaveType from './LeaveType';
import { 
  FaRegCalendarTimes, 
  FaChartBar, 
  FaFileExport, 
  FaFilter, 
  FaUser,
  FaBuilding,
  FaUsers 
} from "react-icons/fa";
import { useTheme } from '../components/ThemeProvider';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNotification } from '../hooks/useNotification';
import NotificationToast from '../components/NotificationToast';
import { ImportIcon } from 'lucide-react';
import { CiImport } from 'react-icons/ci';
import LeaveEntitlementGroups from './LeaveEntitlementGroups';
import LeaveEntitlementManagement from './LeaveEntitlementManagement';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Report data interfaces
interface LeaveReportData {
  employee_id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  company: string;
  department: string;
}

interface LeaveBalanceData {
  employee_id: string;
  employee_code: string;
  employee_name: string;
  email: string;
  company: string;
  department: string;
  leave_balances: {
    leave_type: string;
    total_allocated: number;
    leaves_taken: number;
    balance: number;
    carry_forward: boolean;
    carry_forward_balance: number;
    leave_type_active: boolean;
  }[];
}

interface FilterOption {
  value: string;
  label: string;
  company?: string;
}

interface Company {
  id: number;
  name: string;
}

const LeavesPage = () => {
  const { theme } = useTheme();
  const { notification, showNotification } = useNotification();
  const [key, setKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>('');
  const [activeTab, setActiveTab] = useState('');

  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeReportType, setActiveReportType] = useState<'applications' | 'balance'>('applications');
  const [reportData, setReportData] = useState<LeaveReportData[]>([]);
  const [balanceReportData, setBalanceReportData] = useState<LeaveBalanceData[]>([]);
  
  // Report filters
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    company: 'all',
    department: 'all',
    status: 'all',
    leaveType: 'all'
  });

  const [balanceReportFilters, setBalanceReportFilters] = useState({
    company: 'all',
    department: 'all',
    employeeId: 'all',
    asOfDate: new Date().toISOString().split('T')[0]
  });

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingBalanceReport, setIsGeneratingBalanceReport] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [applicationDepartments, setApplicationDepartments] = useState<FilterOption[]>([]);
  const [balanceDepartments, setBalanceDepartments] = useState<FilterOption[]>([]);
  const [balanceEmployees, setBalanceEmployees] = useState<FilterOption[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('hrms_user');
    if (user) {
      const userData = JSON.parse(user);
      setUser(userData);
    }

    const lastMenu = localStorage.getItem('lastOpenedMenu');
    setLastOpenedMenu(lastMenu);

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (reportFilters.company !== 'all') {
      fetchApplicationDepartments(reportFilters.company);
    } else {
      setApplicationDepartments([]);
    }
  }, [reportFilters.company]);

  const exportReportToCSV = () => {
    if (reportData.length === 0) {
      showNotification('No data to export', 'error');
      return;
    }

    const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row.employee_id || '',
        `"${(row.employee_name || '').replace(/"/g, '""')}"`,
        `"${(row.leave_type || '').replace(/"/g, '""')}"`,
        row.start_date || '',
        row.end_date || '',
        row.days || '',
        row.status || '',
        `"${(row.company || '').replace(/"/g, '""')}"`,
        `"${(row.department || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Report exported successfully', 'success');
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        const uniqueCompanies = response.data
          .filter((company: any) => company.is_active === 1)
          .filter((company: any, index, self) => 
            index === self.findIndex((c: any) => c.id === company.id)
          )
          .map((company: any) => ({
            id: company.id,
            name: company.company_name || company.name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCompanies(uniqueCompanies);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setCompanies([]);
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setKey(prev => prev + 1);
  };

  // Applications Report functions - UPDATED
  const generateLeaveReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      // Prepare parameters
      const params: any = {};

      // Add date filters
      if (reportFilters.startDate) {
        params.startDate = reportFilters.startDate;
      }
      if (reportFilters.endDate) {
        params.endDate = reportFilters.endDate;
      }

      // Add company filter if not 'all' - NOW USING ID
      if (reportFilters.company !== 'all') {
        params.company = reportFilters.company;
      }

      // Add department filter if not 'all' - USING ID
      if (reportFilters.department !== 'all') {
        params.department = reportFilters.department;
      }

      // Add status filter if not 'all'
      if (reportFilters.status !== 'all') {
        params.status = reportFilters.status;
      }

      // Add leave type filter if not 'all'
      if (reportFilters.leaveType !== 'all') {
        params.leaveType = reportFilters.leaveType;
      }

      console.log('Applications Report API Params:', params);

      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: params
      });

      console.log('Applications Report API Response:', response.data);
      
      if (response.data && response.data.data) {
        setReportData(response.data.data);
        showNotification('Report generated successfully', 'success');
      } else {
        setReportData([]);
        showNotification('No data found for the selected filters', 'info');
      }
    } catch (err: any) {
      console.error('Error generating report:', err);
      const errorMessage = err.response?.data?.message || 'Failed to generate report';
      showNotification(errorMessage, 'error');
      setReportData([]);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Balance Report functions - UPDATED
  const generateBalanceReport = async () => {
    try {
      setIsGeneratingBalanceReport(true);
      
      // Prepare parameters
      const params: any = {
        asOfDate: balanceReportFilters.asOfDate
      };

      // Add company filter if not 'all' - NOW USING ID
      if (balanceReportFilters.company !== 'all') {
        params.company = balanceReportFilters.company;
      }

      // Add department filter if not 'all' - USING ID
      if (balanceReportFilters.department !== 'all') {
        params.department = balanceReportFilters.department;
      }

      // Add employee filter if not 'all' - USING ID
      if (balanceReportFilters.employeeId !== 'all') {
        params.employeeId = balanceReportFilters.employeeId;
      }

      console.log('Balance Report API Params:', params);

      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/report/balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: params
      });

      console.log('Balance Report API Response:', response.data);
      
      if (response.data && response.data.data) {
        setBalanceReportData(response.data.data);
        showNotification('Balance report generated successfully', 'success');
      } else {
        setBalanceReportData([]);
        showNotification('No data found for the selected filters', 'info');
      }
    } catch (err: any) {
      console.error('Error generating balance report:', err);
      const errorMessage = err.response?.data?.message || 'Failed to generate balance report';
      showNotification(errorMessage, 'error');
      setBalanceReportData([]);
    } finally {
      setIsGeneratingBalanceReport(false);
    }
  };

  const exportApplicationsToCSV = () => {
    if (reportData.length === 0) {
      showNotification('No data to export', 'error');
      return;
    }

    const headers = ['Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Company', 'Department'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row.employee_id || '',
        `"${(row.employee_name || '').replace(/"/g, '""')}"`,
        `"${(row.leave_type || '').replace(/"/g, '""')}"`,
        row.start_date || '',
        row.end_date || '',
        row.days || '',
        row.status || '',
        `"${(row.company || '').replace(/"/g, '""')}"`,
        `"${(row.department || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    downloadCSV(csvContent, `leave-applications-report-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification('Applications report exported successfully', 'success');
  };

  const exportBalanceToCSV = () => {
    if (balanceReportData.length === 0) {
      showNotification('No data to export', 'error');
      return;
    }

    const headers = ['Employee ID', 'Employee Name', 'Company', 'Department', 'Leave Type', 'Total Allocated', 'Leaves Taken', 'Balance', 'Carry Forward'];
    
    const rows: string[] = [];
    balanceReportData.forEach(employee => {
      employee.leave_balances.forEach(balance => {
        rows.push([
          employee.employee_code || '',
          `"${(employee.employee_name || '').replace(/"/g, '""')}"`,
          `"${(employee.company || '').replace(/"/g, '""')}"`,
          `"${(employee.department || '').replace(/"/g, '""')}"`,
          `"${(balance.leave_type || '').replace(/"/g, '""')}"`,
          balance.total_allocated || 0,
          balance.leaves_taken || 0,
          balance.balance || 0,
          balance.carry_forward ? 'Yes' : 'No'
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, `leave-balance-report-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification('Balance report exported successfully', 'success');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBalanceColor = (balance: number, total: number) => {
    const percentage = (balance / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Fetch employees for balance report - UPDATED
  const fetchBalanceEmployees = async (companyId: string, departmentId: string) => {
    try {
      let employees: any[] = [];

      if (departmentId !== 'all') {
        // Fetch employees by department
        const response = await axios.get(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        });

        console.log('Employees by Department API Response:', response.data);
        
        // Handle different response structures
        if (response.data && Array.isArray(response.data)) {
          employees = response.data;
        } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
          employees = response.data.employees;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          employees = response.data.data;
        } else {
          console.warn('Unexpected API response structure for department employees:', response.data);
          employees = [];
        }
      } else {
        // Fetch employees by company
        const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        });

        console.log('Employees by Company API Response:', response.data);
        
        // Handle different response structures
        if (response.data && Array.isArray(response.data)) {
          employees = response.data;
        } else if (response.data && response.data.employees && Array.isArray(response.data.employees)) {
          employees = response.data.employees;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          employees = response.data.data;
        } else {
          console.warn('Unexpected API response structure for company employees:', response.data);
          employees = [];
        }
      }

      console.log('Processed employees:', employees);

      const employeeOptions = employees
        .filter((emp: any) => emp && emp.id && emp.name) // Filter out invalid entries
        .map((emp: any) => ({
          value: emp.id.toString(),
          label: `${emp.employee_no || emp.employee_code || ''} - ${emp.name}`.trim()
        }));

      console.log('Employee options:', employeeOptions);
      setBalanceEmployees(employeeOptions);
    } catch (err) {
      console.error('Error fetching balance employees:', err);
      setBalanceEmployees([]);
    }
  };

  // Fetch departments for application report - UPDATED
  const fetchApplicationDepartments = async (companyId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      console.log('Application Departments API Response:', response.data);

      if (response.data.success && Array.isArray(response.data.departments)) {
        const departmentOptions = response.data.departments.map((dept: any) => ({
          value: dept.id.toString(),
          label: dept.department_name
        }));
        setApplicationDepartments(departmentOptions);
      } else {
        console.warn('No departments found in response');
        setApplicationDepartments([]);
      }
    } catch (err) {
      console.error('Error fetching application departments:', err);
      setApplicationDepartments([]);
    }
  };

  // Fetch departments for balance report - UPDATED
  const fetchBalanceDepartments = async (companyId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/companies/${companyId}/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      console.log('Balance Departments API Response:', response.data);

      if (response.data.success && Array.isArray(response.data.departments)) {
        const departmentOptions = response.data.departments.map((dept: any) => ({
          value: dept.id.toString(),
          label: dept.department_name
        }));
        setBalanceDepartments(departmentOptions);
      } else {
        console.warn('No departments found in response');
        setBalanceDepartments([]);
      }
    } catch (err) {
      console.error('Error fetching balance departments:', err);
      setBalanceDepartments([]);
    }
  };

  // Application report useEffect - UPDATED
  useEffect(() => {
    if (reportFilters.company !== 'all') {
      fetchApplicationDepartments(reportFilters.company);
    } else {
      setApplicationDepartments([]);
      setReportFilters(prev => ({ ...prev, department: 'all' }));
    }
  }, [reportFilters.company]);

  // Balance report useEffect - UPDATED
  useEffect(() => {
    if (balanceReportFilters.company !== 'all') {
      fetchBalanceDepartments(balanceReportFilters.company);
      fetchBalanceEmployees(balanceReportFilters.company, 'all');
    } else {
      setBalanceDepartments([]);
      setBalanceEmployees([]);
      setBalanceReportFilters(prev => ({ ...prev, department: 'all', employeeId: 'all' }));
    }
  }, [balanceReportFilters.company]);

  // Balance report department change useEffect - UPDATED
  useEffect(() => {
    console.log('Department changed:', {
      company: balanceReportFilters.company,
      department: balanceReportFilters.department
    });
    
    if (balanceReportFilters.company !== 'all') {
      fetchBalanceEmployees(balanceReportFilters.company, balanceReportFilters.department);
    }
  }, [balanceReportFilters.department]);

  return (
    <>
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      
      <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            <FaRegCalendarTimes className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            <span className="truncate">Manage Leaves</span>
          </h1>
          
          {/* Only show Export Report button for admin users */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowReportModal(true)}
              className="btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Reports</span>
            </button>
          )}
        </div>

        {/* Tabs content */}
        <div className={`tabs tabs-border overflow-x-auto ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'}`}>
          {user?.role !== 'admin' && (
            <>
              <input
                type="radio"
                name="leaves_tabs"
                className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
                aria-label="Overview"
                defaultChecked
                onChange={() => handleTabChange('overview')}
              />
              <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
                <LeaveOverview key={`overview-${key}`} />
              </div>
              <input
                type="radio"
                name="leaves_tabs"
                className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
                aria-label="Leave Requests"
                defaultChecked={user?.role === 'admin'}
                onChange={() => handleTabChange('requests')}
              />
              <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
                <LeaveRequest key={`requests-${key}`} />
              </div>

              <input
                type="radio"
                name="leaves_tabs"
                className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
                aria-label="Calendar"
                onChange={() => handleTabChange('calendar')}
              />
              <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
                <LeaveCalendar key={`calendar-${key}`} />
              </div>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <input
                type="radio"
                name="leaves_tabs"
                className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
                aria-label="Leave Requests"
                defaultChecked
                onChange={() => handleTabChange('requests')}
              />
              <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
                <AdminLeaveRequest key={`requests-${key}`} />
              </div>

              <input
                type="radio"
                name="leaves_tabs"
                className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
                aria-label="Leave Types"
                onChange={() => handleTabChange('types')}
              />
              <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
                <LeaveType key={`types-${key}`} />
              </div>

 <input
      type="radio"
      name="leaves_tabs"
      className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
      aria-label="Leave Management"
      onChange={() => handleTabChange('leave-management')}
    />
    <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
      <LeaveEntitlementManagement key={`leave-management-${key}`} />
    </div>
              

                {/* Add this new tab for Leave Entitlement Groups */}
    {/* <input
      type="radio"
      name="leaves_tabs"
      className={`tab whitespace-nowrap ${theme === 'light' ? 'text-slate-700 [--tab-border:theme(colors.slate.300)] [--tab-border-color:theme(colors.blue.500)]' : 'text-slate-300 [--tab-border:theme(colors.slate.600)] [--tab-border-color:theme(colors.blue.400)]'}`}
      aria-label="Entitlement Groups"
      onChange={() => handleTabChange('entitlement-groups')}
    />
    <div className={`tab-content ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'} rounded-lg p-3 sm:p-4 lg:p-6 shadow`}>
      <LeaveEntitlementGroups key={`entitlement-groups-${key}`} />
    </div> */}
            </>
          )}
        </div>

        {/* Enhanced Report Modal */}
        <dialog id="report_modal" className={`modal ${showReportModal ? 'modal-open' : ''}`}>
          <div className={`modal-box w-[95%] sm:w-11/12 max-w-7xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
            {/* Modal Header */}
            <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
              <div className="flex items-center gap-4 relative z-10">
                <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25' : 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-400/25'} transform hover:scale-105 transition-all duration-300`}>
                  <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
                  <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
                  <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
                </div>
                
                <div className="flex flex-col">
                  <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
                    Leave Reports
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
                    Generate and export comprehensive leave reports
                  </p>
                </div>
              </div>
              
              <button
                className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
                onClick={() => setShowReportModal(false)}
              >
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Report Type Selection */}
            <div className="flex border-b border-slate-200 dark:border-slate-600">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                  activeReportType === 'applications' 
                    ? theme === 'light' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                      : 'bg-blue-900/30 text-blue-300 border-b-2 border-blue-400'
                    : theme === 'light'
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveReportType('applications')}
              >
                <FaRegCalendarTimes className="inline mr-2 h-4 w-4" />
                Applications Report
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                  activeReportType === 'balance' 
                    ? theme === 'light' 
                      ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
                      : 'bg-green-900/30 text-green-300 border-b-2 border-green-400'
                    : theme === 'light'
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveReportType('balance')}
              >
                <FaUsers className="inline mr-2 h-4 w-4" />
                Balance Report
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {/* Applications Report */}
              {activeReportType === 'applications' && (
                <div>
                  <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                    <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      <FaFilter className="inline mr-2" />
                      Applications Report Filters
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Date Range */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={reportFilters.startDate}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        />
                      </div>
                      
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          End Date
                        </label>
                        <input
                          type="date"
                          value={reportFilters.endDate}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        />
                      </div>

                      {/* Company Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Company
                        </label>
                        <select
                          value={reportFilters.company}
                          onChange={(e) => setReportFilters(prev => ({ 
                            ...prev, 
                            company: e.target.value,
                            department: 'all'
                          }))}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        >
                          <option value="all">All Companies</option>
                          {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Application Report Department Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Department 
                          <span className="text-xs ml-2 opacity-70">
                            ({applicationDepartments.length} available)
                          </span>
                        </label>
                        <select
                          value={reportFilters.department}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
                          disabled={reportFilters.company === 'all' || applicationDepartments.length === 0}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${reportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="all">All Departments</option>
                          {applicationDepartments.map(dept => (
                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                          ))}
                        </select>
                        {reportFilters.company === 'all' && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Select a company first
                            </span>
                          </label>
                        )}
                        {reportFilters.company !== 'all' && applicationDepartments.length === 0 && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
                              Loading departments...
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Status
                        </label>
                        <select
                          value={reportFilters.status}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        >
                          <option value="all">All Status</option>
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      {/* Leave Type Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Leave Type
                        </label>
                        <select
                          value={reportFilters.leaveType}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, leaveType: e.target.value }))}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        >
                          <option value="all">All Leave Types</option>
                          <option value="Annual Leave">Annual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Maternity Leave">Maternity Leave</option>
                          <option value="Paternity Leave">Paternity Leave</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        onClick={generateLeaveReport}
                        disabled={isGeneratingReport}
                        className={`btn ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white border-0 flex items-center gap-2`}
                      >
                        {isGeneratingReport ? (
                          <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
                        ) : (
                          <FaChartBar className="h-4 w-4" />
                        )}
                        Generate Applications Report
                      </button>
                      
                      <button
                        onClick={exportApplicationsToCSV}
                        disabled={reportData.length === 0}
                        className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
                      >
                        <FaFileExport className="h-4 w-4" />
                        Export to CSV
                      </button>
                    </div>
                  </div>

                  {/* Applications Report Results */}
                  {reportData.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
                            <th>Employee</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Company</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, index) => (
                            <tr key={index} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
                              <td>
                                <div className="font-medium">{item.employee_name}</div>
                                <div className="text-sm opacity-70">{item.employee_id}</div>
                              </td>
                              <td>{item.leave_type}</td>
                              <td>{new Date(item.start_date).toLocaleDateString()}</td>
                              <td>{new Date(item.end_date).toLocaleDateString()}</td>
                              <td>{item.days}</td>
                              <td>
                                <span className={`badge ${
                                  item.status === 'APPROVED' ? 'badge-success' :
                                  item.status === 'REJECTED' ? 'badge-error' :
                                  item.status === 'PENDING' ? 'badge-warning' :
                                  'badge-neutral'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td>{item.company}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        Total Records: {reportData.length}
                      </div>
                    </div>
                  )}

                  {reportData.length === 0 && !isGeneratingReport && (
                    <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      <FaRegCalendarTimes className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applications data generated yet. Apply filters and click "Generate Applications Report".</p>
                    </div>
                  )}
                </div>
              )}

              {/* Balance Report */}
              {activeReportType === 'balance' && (
                <div>
                  <div className={`p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                    <h4 className={`text-sm sm:text-base font-semibold mb-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      <FaFilter className="inline mr-2" />
                      Balance Report Filters
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Company Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          <FaBuilding className="inline mr-1 h-3 w-3" />
                          Company
                        </label>
                        <select
                          value={balanceReportFilters.company}
                          onChange={(e) => setBalanceReportFilters(prev => ({ 
                            ...prev, 
                            company: e.target.value,
                            department: 'all',
                            employeeId: 'all'
                          }))}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        >
                          <option value="all">All Companies</option>
                          {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Balance Report Department Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Department 
                          <span className="text-xs ml-2 opacity-70">
                            ({balanceDepartments.length} available)
                          </span>
                        </label>
                        <select
                          value={balanceReportFilters.department}
                          onChange={(e) => setBalanceReportFilters(prev => ({ 
                            ...prev, 
                            department: e.target.value,
                            employeeId: 'all'
                          }))}
                          disabled={balanceReportFilters.company === 'all' || balanceDepartments.length === 0}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="all">All Departments</option>
                          {balanceDepartments.map(dept => (
                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                          ))}
                        </select>
                        {balanceReportFilters.company === 'all' && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Select a company first
                            </span>
                          </label>
                        )}
                        {balanceReportFilters.company !== 'all' && balanceDepartments.length === 0 && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
                              Loading departments...
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Balance Report Employee Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          <FaUser className="inline mr-1 h-3 w-3" />
                          Employee 
                          <span className="text-xs ml-2 opacity-70">
                            ({balanceEmployees.length} available)
                          </span>
                        </label>
                        <select
                          value={balanceReportFilters.employeeId}
                          onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, employeeId: e.target.value }))}
                          disabled={balanceReportFilters.company === 'all' || balanceEmployees.length === 0}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'} ${balanceReportFilters.company === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="all">All Employees</option>
                          {balanceEmployees.map(emp => (
                            <option key={emp.value} value={emp.value}>{emp.label}</option>
                          ))}
                        </select>
                        {balanceReportFilters.company === 'all' && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                              Select a company first
                            </span>
                          </label>
                        )}
                        {balanceReportFilters.company !== 'all' && balanceReportFilters.department !== 'all' && balanceEmployees.length === 0 && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
                              {`No employees found in this department`}
                            </span>
                          </label>
                        )}
                        {balanceReportFilters.company !== 'all' && balanceReportFilters.department === 'all' && balanceEmployees.length === 0 && (
                          <label className="label">
                            <span className={`label-text-alt ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'}`}>
                              Loading employees...
                            </span>
                          </label>
                        )}
                      </div>

                      {/* As of Date Filter */}
                      <div>
                        <label className={`label p-0 pb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          As of Date
                        </label>
                        <input
                          type="date"
                          value={balanceReportFilters.asOfDate}
                          onChange={(e) => setBalanceReportFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        onClick={generateBalanceReport}
                        disabled={isGeneratingBalanceReport}
                        className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 flex items-center gap-2`}
                      >
                        {isGeneratingBalanceReport ? (
                          <div className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-white' : 'text-white'}`}></div>
                        ) : (
                          <FaUsers className="h-4 w-4" />
                        )}
                        Generate Balance Report
                      </button>
                      
                      <button
                        onClick={exportBalanceToCSV}
                        disabled={balanceReportData.length === 0}
                        className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0 flex items-center gap-2`}
                      >
                        <FaFileExport className="h-4 w-4" />
                        Export to CSV
                      </button>
                    </div>
                  </div>

                  {/* Balance Report Results */}
                  {balanceReportData.length > 0 && (
                    <div className="space-y-6">
                      {balanceReportData.map((employee, index) => (
                        <div key={employee.employee_id} className={`border rounded-lg ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-800'}`}>
                          {/* Employee Header */}
                          <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div>
                                <h4 className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                  {employee.employee_name}
                                </h4>
                                <div className="flex flex-wrap gap-4 mt-1 text-sm">
                                  <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
                                    ID: {employee.employee_code}
                                  </span>
                                  <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
                                    Company: {employee.company}
                                  </span>
                                  <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
                                    Department: {employee.department}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-sm font-medium mt-2 sm:mt-0 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Total Leave Types: {employee.leave_balances.length}
                              </div>
                            </div>
                          </div>

                          {/* Leave Balances */}
                          <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                              <thead>
                                <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}>
                                  <th>Leave Type</th>
                                  <th>Total Allocated</th>
                                  <th>Leaves Taken</th>
                                  <th>Balance</th>
                                  <th>Carry Forward</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {employee.leave_balances.map((balance, balanceIndex) => (
                                  <tr key={balanceIndex} className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}>
                                    <td className="font-medium">{balance.leave_type}</td>
                                    <td>{balance.total_allocated}</td>
                                    <td>{balance.leaves_taken}</td>
                                    <td>
                                      <span className={`font-bold ${getBalanceColor(balance.balance, balance.total_allocated)}`}>
                                        {balance.balance}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${balance.carry_forward ? 'badge-success' : 'badge-neutral'}`}>
                                        {balance.carry_forward ? 'Yes' : 'No'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${balance.leave_type_active ? 'badge-success' : 'badge-error'}`}>
                                        {balance.leave_type_active ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                      
                      <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        Total Employees: {balanceReportData.length} | 
                        Generated on: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {balanceReportData.length === 0 && !isGeneratingBalanceReport && (
                    <div className={`text-center py-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      <FaUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No balance data generated yet. Apply filters and click "Generate Balance Report".</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowReportModal(false)}>close</button>
          </form>
        </dialog>
      </div>
    </>
  )
}

export default LeavesPage;

