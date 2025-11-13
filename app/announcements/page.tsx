// // // 'use client';

// // // import { useState, useEffect, useCallback, useRef } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import { 
// // //   FaPlus, 
// // //   FaEdit, 
// // //   FaTrash, 
// // //   FaChevronDown, 
// // //   FaChevronUp, 
// // //   FaArrowUp,
// // //   FaArrowDown,
// // //   FaClock,
// // //   FaCalendarAlt,
// // //   FaPaperclip,
// // //   FaEye,
// // //   FaEyeSlash,
// // //   FaBell,
// // //   FaHistory,
// // //   FaGlobe,
// // //   FaBuilding,
// // //   FaUsers,
// // //   FaUser,
// // //   FaSearch,
// // //   FaFilter,
// // //   FaTimes,
// // //   FaSort,
// // //   FaSortUp,  
// // //   FaSortDown,
// // //   FaCaretDown
// // // } from 'react-icons/fa';
// // // import { API_BASE_URL, API_ROUTES } from '../config';
// // // import { toZonedTime } from 'date-fns-tz';
// // // import { format } from 'date-fns';
// // // import { useTheme } from '../components/ThemeProvider';

// // // // Singapore timezone
// // // const timeZone = 'Asia/Singapore';

// // // // Function to convert date to Singapore timezone
// // // const toSingaporeTime = (date: Date): Date => {
// // //   return toZonedTime(date, timeZone);
// // // };

// // // interface Announcement {
// // //   id: string;
// // //   title: string;
// // //   content: string;
// // //   created_at: string;
// // //   target_type: 'company' | 'department' | 'position' | 'employee' | 'all';
// // //   target_name?: string;
// // //   is_active?: boolean;
// // //   is_posted?: boolean;
// // //   target_all?: boolean;
// // //   scheduled_at?: string;
// // //   attachments?: {
// // //     id: number;
// // //     original_filename: string;
// // //     file_size: number;
// // //     content_type: string;
// // //     download_url: string;
// // //     uploaded_at: string;
// // //   }[];
// // // }

// // // // Custom vertical scroll hook
// // // const useVerticalScroll = () => {
// // //   const scrollRef = useRef<HTMLDivElement>(null);
// // //   const [canScrollUp, setCanScrollUp] = useState(false);
// // //   const [canScrollDown, setCanScrollDown] = useState(false);

// // //   const checkScrollability = useCallback(() => {
// // //     if (scrollRef.current) {
// // //       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
// // //       setCanScrollUp(scrollTop > 0);
// // //       setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
// // //     }
// // //   }, []);

// // //   const scrollUp = () => {
// // //     if (scrollRef.current) {
// // //       scrollRef.current.scrollBy({ top: -300, behavior: 'smooth' });
// // //     }
// // //   };

// // //   const scrollDown = () => {
// // //     if (scrollRef.current) {
// // //       scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const element = scrollRef.current;
// // //     if (element) {
// // //       checkScrollability();
// // //       element.addEventListener('scroll', checkScrollability);
// // //       window.addEventListener('resize', checkScrollability);
      
// // //       return () => {
// // //         element.removeEventListener('scroll', checkScrollability);
// // //         window.removeEventListener('resize', checkScrollability);
// // //       };
// // //     }
// // //   }, [checkScrollability]);

// // //   return { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability };
// // // };

// // // // Admin Table View Component
// // // const AdminTableView = ({ 
// // //   announcements, 
// // //   theme, 
// // //   onDelete, 
// // //   onToggleActive, 
// // //   router 
// // // }: {
// // //   announcements: Announcement[];
// // //   theme: string;
// // //   onDelete: (id: string) => void;
// // //   onToggleActive: (id: string, currentActive: boolean) => void;
// // //   router: any;
// // // }) => {
// // //   const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
// // //   const [filters, setFilters] = useState({
// // //     type: '',
// // //     createdDateFrom: '',
// // //     createdDateTo: '',
// // //     publishedDateFrom: '',
// // //     publishedDateTo: ''
// // //   });
// // //   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 10;

// // //   useEffect(() => {
// // //     let filtered = [...announcements];

// // //     // Apply filters
// // //     if (filters.type) {
// // //       filtered = filtered.filter(announcement => 
// // //         announcement.target_type.toLowerCase().includes(filters.type.toLowerCase())
// // //       );
// // //     }

// // //     // Filter by created date range
// // //     if (filters.createdDateFrom) {
// // //       const fromDate = new Date(filters.createdDateFrom);
// // //       filtered = filtered.filter(announcement => 
// // //         new Date(announcement.created_at) >= fromDate
// // //       );
// // //     }

// // //     if (filters.createdDateTo) {
// // //       const toDate = new Date(filters.createdDateTo);
// // //       toDate.setHours(23, 59, 59, 999); // Include the entire day
// // //       filtered = filtered.filter(announcement => 
// // //         new Date(announcement.created_at) <= toDate
// // //       );
// // //     }

// // //     // Filter by published date range
// // //     if (filters.publishedDateFrom) {
// // //       const fromDate = new Date(filters.publishedDateFrom);
// // //       filtered = filtered.filter(announcement => {
// // //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// // //         return publishedDate >= fromDate;
// // //       });
// // //     }

// // //     if (filters.publishedDateTo) {
// // //       const toDate = new Date(filters.publishedDateTo);
// // //       toDate.setHours(23, 59, 59, 999); // Include the entire day
// // //       filtered = filtered.filter(announcement => {
// // //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// // //         return publishedDate <= toDate;
// // //       });
// // //     }

// // //     // Apply sorting
// // //     if (sortConfig) {
// // //       filtered.sort((a, b) => {
// // //         let aValue = '';
// // //         let bValue = '';

// // //         switch (sortConfig.key) {
// // //           case 'created_at':
// // //             aValue = a.created_at;
// // //             bValue = b.created_at;
// // //             break;
// // //           case 'published_at':
// // //             aValue = a.scheduled_at || a.created_at;
// // //             bValue = b.scheduled_at || b.created_at;
// // //             break;
// // //           case 'type':
// // //             aValue = a.target_type;
// // //             bValue = b.target_type;
// // //             break;
// // //           case 'title':
// // //             aValue = a.title;
// // //             bValue = b.title;
// // //             break;
// // //         }

// // //         if (sortConfig.direction === 'asc') {
// // //           return aValue.localeCompare(bValue);
// // //         } else {
// // //           return bValue.localeCompare(aValue);
// // //         }
// // //       });
// // //     }

// // //     setFilteredAnnouncements(filtered);
// // //     setCurrentPage(1);
// // //   }, [announcements, filters, sortConfig]);

// // //   const handleSort = (key: string) => {
// // //     let direction: 'asc' | 'desc' = 'asc';
// // //     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
// // //       direction = 'desc';
// // //     }
// // //     setSortConfig({ key, direction });
// // //   };

// // //   const getSortIcon = (columnKey: string) => {
// // //     if (!sortConfig || sortConfig.key !== columnKey) {
// // //       return <FaSort className="w-3 h-3 opacity-50" />;
// // //     }
// // //     return sortConfig.direction === 'asc' ? 
// // //       <FaSortUp className="w-3 h-3 text-blue-500" /> : 
// // //       <FaSortDown className="w-3 h-3 text-blue-500" />;
// // //   };

// // //   const formatDateTime = (dateString: string) => {
// // //     const date = new Date(dateString);
// // //     return date.toLocaleDateString('en-GB', {
// // //       day: '2-digit',
// // //       month: '2-digit',
// // //       year: 'numeric'
// // //     }) + ' ' + date.toLocaleTimeString('en-GB', {
// // //       hour: '2-digit',
// // //       minute: '2-digit',
// // //       second: '2-digit'
// // //     });
// // //   };

// // //   const clearFilters = () => {
// // //     setFilters({
// // //       type: '',
// // //       createdDateFrom: '',
// // //       createdDateTo: '',
// // //       publishedDateFrom: '',
// // //       publishedDateTo: ''
// // //     });
// // //   };

// // //   // Pagination
// // //   const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
// // //   const startIndex = (currentPage - 1) * itemsPerPage;
// // //   const endIndex = startIndex + itemsPerPage;
// // //   const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

// // //   const goToPage = (page: number) => {
// // //     setCurrentPage(page);
// // //   };

// // //   return (
// // //     <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
// // //       theme === 'light' 
// // //         ? 'bg-white/90 border-gray-200' 
// // //         : 'bg-slate-800/90 border-slate-700'
// // //     }`}>
// // //       {/* Header with ANNOUNCEMENTS badge */}
// // //       <div className={`p-6 border-b ${
// // //         theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// // //       }`}>
// // //         <div className="flex items-center justify-between mb-6">
// // //           <h2 className={`text-2xl font-bold ${
// // //             theme === 'light' ? 'text-gray-900' : 'text-white'
// // //           }`}>
// // //             Announcements
// // //           </h2>
// // //           <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
// // //             ANNOUNCEMENTS
// // //           </span>
// // //         </div>

// // //         {/* Filters */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
// // //           {/* Type Filter */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Type
// // //             </label>
// // //             <div className="relative">
// // //               <select
// // //                 value={filters.type}
// // //                 onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
// // //                 className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// // //                   theme === 'light'
// // //                     ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                     : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                 }`}
// // //               >
// // //                 <option value="">All Types</option>
// // //                 <option value="all">All</option>
// // //                 <option value="company">Company</option>
// // //                 <option value="department">Department</option>
// // //                 <option value="position">Position</option>
// // //                 <option value="employee">Employee</option>
// // //               </select>
// // //               <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// // //                 theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //               }`} />
// // //             </div>
// // //           </div>

// // //           {/* Created Date From */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Created From
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.createdDateFrom}
// // //               onChange={(e) => setFilters(prev => ({ ...prev, createdDateFrom: e.target.value }))}
// // //               className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                 theme === 'light'
// // //                   ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                   : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //               }`}
// // //             />
// // //           </div>

// // //           {/* Created Date To */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Created To
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.createdDateTo}
// // //               onChange={(e) => setFilters(prev => ({ ...prev, createdDateTo: e.target.value }))}
// // //               className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                 theme === 'light'
// // //                   ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                   : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //               }`}
// // //             />
// // //           </div>

// // //           {/* Published Date From */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Published From
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.publishedDateFrom}
// // //               onChange={(e) => setFilters(prev => ({ ...prev, publishedDateFrom: e.target.value }))}
// // //               className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                 theme === 'light'
// // //                   ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                   : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //               }`}
// // //             />
// // //           </div>

// // //           {/* Published Date To */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Published To
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.publishedDateTo}
// // //               onChange={(e) => setFilters(prev => ({ ...prev, publishedDateTo: e.target.value }))}
// // //               className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                 theme === 'light'
// // //                   ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                   : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //               }`}
// // //             />
// // //           </div>

// // //           {/* Action Buttons */}
// // //           <div className="flex items-end gap-2">
// // //             <button
// // //               onClick={clearFilters}
// // //               className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
// // //                 theme === 'light'
// // //                   ? 'border-red-300 text-red-600 hover:bg-red-50'
// // //                   : 'border-red-600 text-red-400 hover:bg-red-900/20'
// // //               }`}
// // //             >
// // //               <FaTimes className="w-3 h-3" />
// // //               Clear
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Results count */}
// // //         <div className={`mt-4 text-sm ${
// // //           theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// // //         }`}>
// // //           {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''}
// // //         </div>
// // //       </div>

// // //       {/* Table */}
// // //       <div className="overflow-x-auto">
// // //         <table className="w-full">
// // //           <thead className={`${
// // //             theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'
// // //           }`}>
// // //             <tr>
// // //               <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
// // //                 theme === 'light' ? 'text-gray-500' : 'text-gray-400'
// // //               }`}>
// // //                 Action
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('created_at')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Created At
// // //                   {getSortIcon('created_at')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('published_at')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Published At
// // //                   {getSortIcon('published_at')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('type')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Type
// // //                   {getSortIcon('type')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('title')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Title
// // //                   {getSortIcon('title')}
// // //                 </div>
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className={`divide-y ${
// // //             theme === 'light' ? 'divide-gray-200' : 'divide-slate-600'
// // //           }`}>
// // //             {currentAnnouncements.map((announcement) => (
// // //               <tr 
// // //                 key={announcement.id}
// // //                 className={`hover:bg-opacity-50 transition-colors ${
// // //                   theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'
// // //                 }`}
// // //               >
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <div className="flex gap-2">
// // //                     <button 
// // //                       onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
// // //                       className={`p-2 rounded-lg transition-colors ${
// // //                         theme === 'light'
// // //                           ? 'text-blue-600 hover:bg-blue-100'
// // //                           : 'text-blue-400 hover:bg-blue-900/30'
// // //                       }`}
// // //                       title="Edit"
// // //                     >
// // //                       <FaEdit className="w-4 h-4" />
// // //                     </button>
// // //                     <button 
// // //                       onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
// // //                       className={`p-2 rounded-lg transition-colors ${
// // //                         announcement.is_active === false
// // //                           ? theme === 'light'
// // //                             ? 'text-green-600 hover:bg-green-100'
// // //                             : 'text-green-400 hover:bg-green-900/30'
// // //                           : theme === 'light'
// // //                             ? 'text-gray-600 hover:bg-gray-100'
// // //                             : 'text-gray-400 hover:bg-gray-700'
// // //                       }`}
// // //                       title={announcement.is_active === false ? "Activate" : "Deactivate"}
// // //                     >
// // //                       {announcement.is_active === false ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
// // //                     </button>
// // //                   </div>
// // //                 </td>
// // //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   {formatDateTime(announcement.created_at)}
// // //                 </td>
// // //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   {formatDateTime(announcement.scheduled_at || announcement.created_at)}
// // //                 </td>
// // //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
// // //                     announcement.target_type === 'all'
// // //                       ? theme === 'light'
// // //                         ? 'bg-purple-100 text-purple-800'
// // //                         : 'bg-purple-900/30 text-purple-300'
// // //                       : announcement.target_type === 'company'
// // //                         ? theme === 'light'
// // //                           ? 'bg-blue-100 text-blue-800'
// // //                           : 'bg-blue-900/30 text-blue-300'
// // //                         : announcement.target_type === 'department'
// // //                           ? theme === 'light'
// // //                             ? 'bg-green-100 text-green-800'
// // //                             : 'bg-green-900/30 text-green-300'
// // //                           : theme === 'light'
// // //                             ? 'bg-orange-100 text-orange-800'
// // //                             : 'bg-orange-900/30 text-orange-300'
// // //                   }`}>
// // //                     {announcement.target_type}
// // //                   </span>
// // //                 </td>
// // //                 <td className={`px-6 py-4 text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   <div className="max-w-xs">
// // //                     <div className="font-medium truncate">{announcement.title}</div>
// // //                     {announcement.is_posted === false && (
// // //                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${
// // //                         theme === 'light' 
// // //                           ? 'bg-amber-100 text-amber-700' 
// // //                           : 'bg-amber-900/30 text-amber-300'
// // //                       }`}>
// // //                         Draft
// // //                       </span>
// // //                     )}
// // //                     {announcement.is_active === false && (
// // //                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 ml-2 inline-block ${
// // //                         theme === 'light' 
// // //                           ? 'bg-red-100 text-red-700' 
// // //                           : 'bg-red-900/30 text-red-300'
// // //                       }`}>
// // //                         Inactive
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {/* Pagination */}
// // //       {totalPages > 1 && (
// // //         <div className={`px-6 py-4 border-t flex items-center justify-between ${
// // //           theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// // //         }`}>
// // //           <div className={`text-sm ${
// // //             theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// // //           }`}>
// // //             Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length} results
// // //           </div>
// // //           <div className="flex gap-2">
// // //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// // //               <button
// // //                 key={page}
// // //                 onClick={() => goToPage(page)}
// // //                 className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
// // //                   currentPage === page
// // //                     ? theme === 'light'
// // //                       ? 'bg-blue-600 text-white'
// // //                       : 'bg-blue-500 text-white'
// // //                     : theme === 'light'
// // //                       ? 'text-gray-600 hover:bg-gray-100'
// // //                       : 'text-gray-400 hover:bg-slate-700'
// // //                 }`}
// // //               >
// // //                 {page}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // Compact Announcement Card Component for vertical layout (non-admin view)
// // // const CompactAnnouncementCard = ({ 
// // //   announcement, 
// // //   role, 
// // //   theme, 
// // //   onDelete, 
// // //   onToggleActive, 
// // //   router 
// // // }: {
// // //   announcement: Announcement;
// // //   role: string;
// // //   theme: string;
// // //   onDelete: (id: string) => void;
// // //   onToggleActive: (id: string, currentActive: boolean) => void;
// // //   router: any;
// // // }) => {
// // //   const [isExpanded, setIsExpanded] = useState(false);

// // //   const getTargetInfo = (announcement: Announcement) => {
// // //     const icons = {
// // //       company: <FaBuilding className="w-3 h-3" />,
// // //       department: <FaUsers className="w-3 h-3" />,
// // //       position: <FaUser className="w-3 h-3" />,
// // //       employee: <FaUser className="w-3 h-3" />,
// // //       all: <FaGlobe className="w-3 h-3" />
// // //     };

// // //     const names = {
// // //       company: 'Company',
// // //       department: 'Department',
// // //       position: 'Position',
// // //       employee: 'Employee',
// // //       all: 'Global'
// // //     };

// // //     return {
// // //       icon: icons[announcement.target_type] || icons.all,
// // //       name: names[announcement.target_type] || names.all
// // //     };
// // //   };

// // //   const isLongContent = (content: string): boolean => {
// // //     return content.split(/\s+/).length > 25;
// // //   };

// // //   const getPreviewContent = (content: string): string => {
// // //     const words = content.split(/\s+/);
// // //     return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : content;
// // //   };

// // //   const isScheduledForFuture = (dateString?: string): boolean => {
// // //     if (!dateString) return false;
// // //     const scheduledDate = new Date(dateString);
// // //     return scheduledDate > new Date();
// // //   };

// // //   const formatDate = (dateString: string): string => {
// // //     return new Date(dateString).toLocaleDateString('en-US', {
// // //       month: 'short',
// // //       day: 'numeric',
// // //       year: 'numeric'
// // //     });
// // //   };

// // //   const getStatusColor = () => {
// // //     if (announcement.is_active === false) return 'from-red-500 to-red-600';
// // //     if (announcement.is_posted === false) return 'from-amber-500 to-orange-600';
// // //     return 'from-blue-500 to-indigo-600';
// // //   };

// // //   const targetInfo = getTargetInfo(announcement);

// // //   return (
// // //     <div className={`
// // //       mb-3 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] group
// // //       ${theme === 'light' 
// // //         ? 'bg-white border-gray-200 hover:border-blue-300' 
// // //         : 'bg-slate-800 border-slate-700 hover:border-blue-500'
// // //       }
// // //     `}>
// // //       {/* Compact Header */}
// // //       <div className={`
// // //         p-4 rounded-t-xl bg-gradient-to-r ${getStatusColor()} text-white relative overflow-hidden
// // //       `}>
// // //         {/* Background Pattern */}
// // //         <div className="absolute inset-0 opacity-10">
// // //           <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-white/20"></div>
// // //           <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/10"></div>
// // //         </div>
        
// // //         <div className="relative z-10">
// // //           <div className="flex items-start justify-between mb-3">
// // //             <h3 className="font-semibold text-sm leading-tight flex-1 mr-3 line-clamp-2">
// // //               {announcement.title}
// // //             </h3>
// // //             <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
// // //               {announcement.is_posted === false && announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) ? (
// // //                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
// // //                   SCHEDULED
// // //                 </span>
// // //               ) : announcement.is_posted === false ? (
// // //                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
// // //                   DRAFT
// // //                 </span>
// // //               ) : null}
// // //             </div>
// // //           </div>
          
// // //           <div className="flex items-center justify-between text-xs">
// // //             <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
// // //               {targetInfo.icon}
// // //               <span className="font-medium">{targetInfo.name}</span>
// // //             </div>
// // //             <div className="flex items-center gap-2 text-white/90">
// // //               <FaCalendarAlt className="w-3 h-3" />
// // //               <span className="font-medium">{formatDate(announcement.created_at)}</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Compact Body */}
// // //       <div className="p-4">
// // //         <div className="mb-4">
// // //           <div className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
// // //             {isLongContent(announcement.content) && !isExpanded ? (
// // //               <>
// // //                 <div className="whitespace-pre-wrap mb-2">
// // //                   {getPreviewContent(announcement.content)}
// // //                 </div>
// // //                 <button 
// // //                   onClick={() => setIsExpanded(true)}
// // //                   className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
// // //                     theme === 'light' 
// // //                       ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
// // //                       : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
// // //                   }`}
// // //                 >
// // //                   Read more <FaChevronDown className="w-2 h-2" />
// // //                 </button>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <div className="whitespace-pre-wrap mb-2">
// // //                   {announcement.content}
// // //                 </div>
// // //                 {isLongContent(announcement.content) && (
// // //                   <button 
// // //                     onClick={() => setIsExpanded(false)}
// // //                     className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
// // //                       theme === 'light' 
// // //                         ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
// // //                         : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
// // //                     }`}
// // //                   >
// // //                     Show less <FaChevronUp className="w-2 h-2" />
// // //                   </button>
// // //                 )}
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Attachments */}
// // //         {announcement.attachments && announcement.attachments.length > 0 && (
// // //           <div className="mb-4">
// // //             <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
// // //               theme === 'light' 
// // //                 ? 'text-blue-600 bg-blue-50 border border-blue-200' 
// // //                 : 'text-blue-400 bg-blue-900/30 border border-blue-700'
// // //             }`}>
// // //               <FaPaperclip className="w-3 h-3" />
// // //               <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Status and Actions */}
// // //         <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
// // //           <div className="flex items-center gap-2">
// // //             {announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) && !announcement.is_posted && (
// // //               <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
// // //                 theme === 'light' 
// // //                   ? 'text-blue-600 bg-blue-50 border border-blue-200' 
// // //                   : 'text-blue-400 bg-blue-900/30 border border-blue-700'
// // //               }`}>
// // //                 <FaClock className="w-3 h-3" />
// // //                 <span className="font-medium">{format(toSingaporeTime(new Date(announcement.scheduled_at)) as Date, 'dd/MM')}</span>
// // //               </div>
// // //             )}
// // //             {announcement.is_active === false && (
// // //               <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
// // //                 theme === 'light' 
// // //                   ? 'bg-amber-100 text-amber-700 border border-amber-200' 
// // //                   : 'bg-amber-900/30 text-amber-300 border border-amber-700'
// // //               }`}>
// // //                 Inactive
// // //               </span>
// // //             )}
// // //           </div>

// // //           {/* Admin Actions */}
// // //           {role === 'admin' && (
// // //             <div className="flex gap-1">
// // //               {announcement.is_posted !== false && (
// // //                 <button 
// // //                   onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
// // //                   className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// // //                     announcement.is_active === false
// // //                       ? theme === 'light'
// // //                         ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
// // //                         : 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
// // //                       : theme === 'light'
// // //                         ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
// // //                         : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
// // //                   }`}
// // //                   title={announcement.is_active === false ? "Activate" : "Deactivate"}
// // //                 >
// // //                   {announcement.is_active === false ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
// // //                 </button>
// // //               )}
// // //               <button 
// // //                 onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
// // //                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// // //                   theme === 'light'
// // //                     ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
// // //                     : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-700'
// // //                 }`}
// // //                 title="Edit"
// // //               >
// // //                 <FaEdit className="w-3 h-3" />
// // //               </button>
// // //               <button 
// // //                 onClick={() => onDelete(announcement.id)}
// // //                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// // //                   theme === 'light'
// // //                     ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
// // //                     : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
// // //                 }`}
// // //                 title="Delete"
// // //               >
// // //                 <FaTrash className="w-3 h-3" />
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Vertical Scrollable Section Component
// // // const VerticalScrollableSection = ({ 
// // //   title, 
// // //   icon,
// // //   announcements, 
// // //   role, 
// // //   theme, 
// // //   onDelete, 
// // //   onToggleActive, 
// // //   router,
// // //   emptyMessage,
// // //   emptyIcon,
// // //   accentColor
// // // }: {
// // //   title: string;
// // //   icon: React.ReactNode;
// // //   announcements: Announcement[];
// // //   role: string;
// // //   theme: string;
// // //   onDelete: (id: string) => void;
// // //   onToggleActive: (id: string, currentActive: boolean) => void;
// // //   router: any;
// // //   emptyMessage: string;
// // //   emptyIcon: React.ReactNode;
// // //   accentColor: string;
// // // }) => {
// // //   const { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability } = useVerticalScroll();

// // //   useEffect(() => {
// // //     checkScrollability();
// // //   }, [announcements, checkScrollability]);

// // //   return (
// // //     <div className={`
// // //       flex-1 rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm
// // //       ${theme === 'light' 
// // //         ? 'bg-white/80 border-gray-200 shadow-gray-200/50' 
// // //         : 'bg-slate-800/80 border-slate-700 shadow-slate-900/50'
// // //       }
// // //     `}>
// // //       {/* Section Header */}
// // //       <div className={`
// // //         p-5 border-b bg-gradient-to-r relative overflow-hidden
// // //         ${theme === 'light' 
// // //           ? `${accentColor} border-gray-200` 
// // //           : `${accentColor.replace('from-', 'from-').replace('to-', 'to-').replace('500', '600').replace('600', '700')} border-slate-600`
// // //         }
// // //       `}>
// // //         {/* Background Pattern */}
// // //         <div className="absolute inset-0 opacity-10">
// // //           <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
// // //           <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10"></div>
// // //           <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/5"></div>
// // //         </div>
        
// // //         <div className="relative z-10">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center gap-4">
// // //               <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
// // //                 {icon}
// // //               </div>
// // //               <div>
// // //                 <h2 className="text-xl font-bold text-white mb-1">
// // //                   {title}
// // //                 </h2>
// // //                 <p className="text-sm text-white/80 font-medium">
// // //                   {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
// // //                 </p>
// // //               </div>
// // //             </div>
            
// // //             {/* Vertical Scroll Controls */}
// // //             {announcements.length > 0 && (
// // //               <div className="flex flex-col gap-2">
// // //                 <button
// // //                   onClick={scrollUp}
// // //                   disabled={!canScrollUp}
// // //                   className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm border ${
// // //                     canScrollUp
// // //                       ? 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-110 shadow-lg'
// // //                       : 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
// // //                   }`}
// // //                   title="Scroll up"
// // //                 >
// // //                   <FaArrowUp className="w-3 h-3" />
// // //                 </button>
// // //                 <button
// // //                   onClick={scrollDown}
// // //                   disabled={!canScrollDown}
// // //                   className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm border ${
// // //                     canScrollDown
// // //                       ? 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-110 shadow-lg'
// // //                       : 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
// // //                   }`}
// // //                   title="Scroll down"
// // //                 >
// // //                   <FaArrowDown className="w-3 h-3" />
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Scrollable Container */}
// // //       <div className="h-[500px] overflow-hidden">
// // //         {announcements.length > 0 ? (
// // //           <div 
// // //             ref={scrollRef}
// // //             className={`h-full overflow-y-auto p-5 ${
// // //               theme === 'light' 
// // //                 ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' 
// // //                 : 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800'
// // //             }`}
// // //             style={{ scrollbarWidth: 'thin' }}
// // //           >
// // //             {announcements.map((announcement) => (
// // //               <CompactAnnouncementCard
// // //                 key={announcement.id}
// // //                 announcement={announcement}
// // //                 role={role}
// // //                 theme={theme}
// // //                 onDelete={onDelete}
// // //                 onToggleActive={onToggleActive}
// // //                 router={router}
// // //               />
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${
// // //             theme === 'light' ? 'text-gray-500' : 'text-slate-400'
// // //           }`}>
// // //             <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center ${
// // //               theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
// // //             }`}>
// // //               {emptyIcon}
// // //             </div>
// // //             <p className="text-lg font-semibold">{emptyMessage}</p>
// // //             <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>
// // //               Check back later for updates
// // //             </p>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default function AnnouncementsPage() {
// // //   const { theme } = useTheme();
// // //   const [role, setRole] = useState<string>('');
// // //   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');
// // //   const router = useRouter();
// // //   const [userId, setUserId] = useState<number>(0);

// // //   // Load user information once when component mounts
// // //   useEffect(() => { 
// // //     const role = localStorage.getItem('hrms_role'); 
// // //     if (role) {
// // //       setRole(role);
// // //     }

// // //     const user = localStorage.getItem('hrms_user');
// // //     if (user) {
// // //       try {
// // //         const userData = JSON.parse(user);
// // //         if (userData && userData.id) {
// // //           setUserId(userData.id);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error parsing user data:', error);
// // //       }
// // //     }
// // //   }, []);

// // //   const fetchAnnouncements = useCallback(async (): Promise<void> => {
// // //     try {
// // //       setLoading(true);
// // //       const empId = role !== 'admin' && userId !== 0 ? userId : null;
      
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}${empId ? `?employee_id=${userId}` : ''}`);
      
// // //       if (!response.ok) {
// // //         throw new Error('Failed to fetch announcements');
// // //       }
      
// // //       const data = await response.json();
      
// // //       // Transform the announcement data
// // //       const transformedAnnouncements = data.map((announcement: any) => ({
// // //         ...announcement,
// // //         is_posted: announcement.is_posted === 0 ? false : true,
// // //         is_active: announcement.is_active === 0 ? false : true,
// // //         target_all: announcement.target_all === 1 ? true : false,
// // //         target_type: announcement.target_type,
// // //         target_name: announcement.target_name,
// // //         scheduled_at: announcement.scheduled_at
// // //       }));
      
// // //       // Fetch attachments for each announcement
// // //       const announcementsWithAttachments = await Promise.all(
// // //         transformedAnnouncements.map(async (announcement: Announcement) => {
// // //           try {
// // //             const attachmentsResponse = await fetch(`${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`);
// // //             if (attachmentsResponse.ok) {
// // //               const attachmentsData = await attachmentsResponse.json();
// // //               return {
// // //                 ...announcement,
// // //                 attachments: attachmentsData.documents || []
// // //               };
// // //             }
// // //             return announcement;
// // //           } catch (error) {
// // //             console.error(`Error fetching attachments for announcement ${announcement.id}:`, error);
// // //             return announcement;
// // //           }
// // //         })
// // //       );
      
// // //       setAnnouncements(announcementsWithAttachments);
// // //     } catch (error) {
// // //       console.error('Error fetching announcements:', error);
// // //       setError('Failed to load announcements. Please try again later.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [userId, role]);

// // //   // Fetch announcements only when userId and role are available
// // //   useEffect(() => {
// // //     // Only fetch if we have userId (or we're admin)
// // //     if (userId !== 0 || role === 'admin') {
// // //       fetchAnnouncements();
// // //     }
// // //   }, [userId, role, fetchAnnouncements]);

// // //   const handleDelete = async (id: string) => {
// // //     if (window.confirm('Are you sure you want to delete this announcement?')) {
// // //       try {
// // //         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// // //           method: 'DELETE',
// // //         });

// // //         if (!response.ok) {
// // //           throw new Error('Failed to delete announcement');
// // //         }

// // //         // Remove announcement from state
// // //         setAnnouncements(announcements.filter(announcement => announcement.id !== id));
// // //       } catch (error) {
// // //         console.error('Error deleting announcement:', error);
// // //         setError('Failed to delete announcement. Please try again.');
// // //       }
// // //     }
// // //   };

// // //   const handleToggleActive = async (id: string, currentActive: boolean) => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// // //         method: 'PATCH',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ is_active: !currentActive }),
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement`);
// // //       }

// // //       // Update announcement in state
// // //       setAnnouncements(
// // //         announcements.map(announcement => 
// // //           announcement.id === id 
// // //             ? { ...announcement, is_active: !currentActive } 
// // //             : announcement
// // //         )
// // //       );
// // //     } catch (error) {
// // //       console.error('Error updating announcement status:', error);
// // //       setError(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement. Please try again.`);
// // //     }
// // //   };

// // //   // Helper function to check if scheduled date is in the future
// // //   const isScheduledForFuture = (dateString?: string): boolean => {
// // //     if (!dateString) return false;
// // //     const scheduledDate = new Date(dateString);
// // //     return scheduledDate > new Date();
// // //   };

// // //   // Separate announcements into upcoming and past (only for non-admin view)
// // //   const now = new Date();
// // //   const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

// // //   const upcomingAnnouncements = announcements.filter(announcement => {
// // //     // Include drafts and scheduled announcements for admin
// // //     if (announcement.is_posted === false) {
// // //       return role === 'admin';
// // //     }
    
// // //     // Include recent announcements (within 30 days) or scheduled for future
// // //     const createdDate = new Date(announcement.created_at);
// // //     const isRecent = createdDate > thirtyDaysAgo;
// // //     const isScheduled = announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at);
    
// // //     return isRecent || isScheduled;
// // //   });

// // //   const pastAnnouncements = announcements.filter(announcement => {
// // //     // Only include published announcements
// // //     if (announcement.is_posted === false) {
// // //       return false;
// // //     }
    
// // //     // Include announcements older than 30 days and not scheduled for future
// // //     const createdDate = new Date(announcement.created_at);
// // //     const isOld = createdDate <= thirtyDaysAgo;
// // //     const isNotScheduled = !announcement.scheduled_at || !isScheduledForFuture(announcement.scheduled_at);
    
// // //     return isOld && isNotScheduled;
// // //   });

// // //   return (
// // //     <div className={`min-h-screen p-6 ${
// // //       theme === 'light' 
// // //         ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
// // //         : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// // //     }`}>
// // //       {/* Header */}
// // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
// // //         <div>
// // //           <h1 className={`text-4xl font-bold mb-2 ${
// // //             theme === 'light' 
// // //               ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' 
// // //               : 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
// // //           }`}>
// // //             Announcements
// // //           </h1>
// // //           <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
// // //             Stay updated with the latest news and updates
// // //           </p>
// // //         </div>
        
// // //         {role === 'admin' && (
// // //           <Link 
// // //             href="/announcements/create" 
// // //             className={`mt-4 lg:mt-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
// // //               theme === 'light' 
// // //                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
// // //                 : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
// // //             }`}
// // //           >
// // //             <FaPlus className="inline mr-2" /> Create Announcement
// // //           </Link>
// // //         )}
// // //       </div>

// // //       {/* Error Message */}
// // //       {error && (
// // //         <div className={`mb-6 p-4 rounded-xl border-l-4 backdrop-blur-sm ${
// // //           theme === 'light' 
// // //             ? 'bg-red-50/80 border-red-400 text-red-700' 
// // //             : 'bg-red-900/20 border-red-500 text-red-300'
// // //         }`}>
// // //           <div className="flex items-center">
// // //             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// // //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// // //             </svg>
// // //             <span>{error}</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Loading State */}
// // //       {loading ? (
// // //         <div className="flex justify-center items-center py-20">
// // //           <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${
// // //             theme === 'light' ? 'border-blue-600' : 'border-blue-400'
// // //           }`}></div>
// // //         </div>
// // //       ) : announcements.length === 0 ? (
// // //         /* Empty State */
// // //         <div className={`p-12 rounded-2xl text-center backdrop-blur-sm ${
// // //           theme === 'light' ? 'bg-white/80 shadow-lg' : 'bg-slate-800/80 shadow-xl'
// // //         }`}>
// // //           <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
// // //             theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
// // //           }`}>
// // //             <FaCalendarAlt className={`w-12 h-12 ${
// // //               theme === 'light' ? 'text-blue-600' : 'text-blue-400'
// // //             }`} />
// // //           </div>
// // //           <h3 className={`text-2xl font-bold mb-4 ${
// // //             theme === 'light' ? 'text-gray-900' : 'text-gray-100'
// // //           }`}>
// // //             No announcements found
// // //           </h3>
// // //           {role === 'admin' && (
// // //             <>
// // //               <p className={`mb-6 text-lg ${
// // //                 theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// // //               }`}>
// // //                 Create your first announcement to notify your team
// // //               </p>
// // //               <Link 
// // //                 href="/announcements/create" 
// // //                 className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
// // //                   theme === 'light' 
// // //                     ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
// // //                     : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
// // //                 }`}
// // //               >
// // //                 <FaPlus className="mr-2" /> Create Announcement
// // //               </Link>
// // //             </>
// // //           )}
// // //         </div>
// // //       ) : (
// // //         /* Conditional Rendering: Admin Table View vs Non-Admin Card View */
// // //         <>
// // //           {role === 'admin' ? (
// // //             /* Admin Table View */
// // //             <AdminTableView
// // //               announcements={announcements}
// // //               theme={theme}
// // //               onDelete={handleDelete}
// // //               onToggleActive={handleToggleActive}
// // //               router={router}
// // //             />
// // //           ) : (
// // //             /* Non-Admin Side-by-Side Vertical Layout */
// // //             <div className="flex flex-col xl:flex-row gap-6 h-full">
// // //               <VerticalScrollableSection
// // //                 title="Upcoming & Recent"
// // //                 icon={<FaBell className="w-5 h-5" />}
// // //                 announcements={upcomingAnnouncements}
// // //                 role={role}
// // //                 theme={theme}
// // //                 onDelete={handleDelete}
// // //                 onToggleActive={handleToggleActive}
// // //                 router={router}
// // //                 emptyMessage="No upcoming announcements"
// // //                 emptyIcon={<FaBell className="w-10 h-10" />}
// // //                 accentColor="from-blue-500 to-indigo-600"
// // //               />
              
// // //               <VerticalScrollableSection
// // //                 title="Past Announcements"
// // //                 icon={<FaHistory className="w-5 h-5" />}
// // //                 announcements={pastAnnouncements}
// // //                 role={role}
// // //                 theme={theme}
// // //                 onDelete={handleDelete}
// // //                 onToggleActive={handleToggleActive}
// // //                 router={router}
// // //                 emptyMessage="No past announcements"
// // //                 emptyIcon={<FaHistory className="w-10 h-10" />}
// // //                 accentColor="from-slate-500 to-gray-600"
// // //               />
// // //             </div>
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // //TESTING ADMIN LIST VIEW WITH FILTER

// // // 'use client';

// // // import { useState, useEffect, useCallback, useRef } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import { 
// // //   FaPlus, 
// // //   FaEdit, 
// // //   FaTrash, 
// // //   FaChevronDown, 
// // //   FaChevronUp, 
// // //   FaArrowUp,
// // //   FaArrowDown,
// // //   FaClock,
// // //   FaCalendarAlt,
// // //   FaPaperclip,
// // //   FaEye,
// // //   FaEyeSlash,
// // //   FaBell,
// // //   FaHistory,
// // //   FaGlobe,
// // //   FaBuilding,
// // //   FaUsers,
// // //   FaUser,
// // //   FaSearch,
// // //   FaFilter,
// // //   FaTimes,
// // //   FaSort,
// // //   FaSortUp,  
// // //   FaSortDown,
// // //   FaCaretDown
// // // } from 'react-icons/fa';
// // // import { API_BASE_URL, API_ROUTES } from '../config';
// // // import { toZonedTime } from 'date-fns-tz';
// // // import { format } from 'date-fns';
// // // import { useTheme } from '../components/ThemeProvider';

// // // // Singapore timezone
// // // const timeZone = 'Asia/Singapore';

// // // // Function to convert date to Singapore timezone
// // // const toSingaporeTime = (date: Date): Date => {
// // //   return toZonedTime(date, timeZone);
// // // };

// // // interface Announcement {
// // //   id: string;
// // //   title: string;
// // //   content: string;
// // //   created_at: string;
// // //   target_type: 'company' | 'department' | 'position' | 'employee' | 'all';
// // //   target_name?: string;
// // //   is_active?: boolean;
// // //   is_posted?: boolean;
// // //   target_all?: boolean;
// // //   scheduled_at?: string;
// // //   attachments?: {
// // //     id: number;
// // //     original_filename: string;
// // //     file_size: number;
// // //     content_type: string;
// // //     download_url: string;
// // //     uploaded_at: string;
// // //   }[];
// // // }

// // // // Custom vertical scroll hook
// // // const useVerticalScroll = () => {
// // //   const scrollRef = useRef<HTMLDivElement>(null);
// // //   const [canScrollUp, setCanScrollUp] = useState(false);
// // //   const [canScrollDown, setCanScrollDown] = useState(false);

// // //   const checkScrollability = useCallback(() => {
// // //     if (scrollRef.current) {
// // //       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
// // //       setCanScrollUp(scrollTop > 0);
// // //       setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
// // //     }
// // //   }, []);

// // //   const scrollUp = () => {
// // //     if (scrollRef.current) {
// // //       scrollRef.current.scrollBy({ top: -300, behavior: 'smooth' });
// // //     }
// // //   };

// // //   const scrollDown = () => {
// // //     if (scrollRef.current) {
// // //       scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const element = scrollRef.current;
// // //     if (element) {
// // //       checkScrollability();
// // //       element.addEventListener('scroll', checkScrollability);
// // //       window.addEventListener('resize', checkScrollability);
      
// // //       return () => {
// // //         element.removeEventListener('scroll', checkScrollability);
// // //         window.removeEventListener('resize', checkScrollability);
// // //       };
// // //     }
// // //   }, [checkScrollability]);

// // //   return { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability };
// // // };

// // // // Admin Table View Component with New Filtering UI
// // // const AdminTableView = ({ 
// // //   announcements, 
// // //   theme, 
// // //   onDelete, 
// // //   onToggleActive, 
// // //   router 
// // // }: {
// // //   announcements: Announcement[];
// // //   theme: string;
// // //   onDelete: (id: string) => void;
// // //   onToggleActive: (id: string, currentActive: boolean) => void;
// // //   router: any;
// // // }) => {
// // //   const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
// // //   const [filters, setFilters] = useState({
// // //     status: '',
// // //     targetType: '',
// // //     hasAttachments: '',
// // //     isScheduled: '',
// // //     createdDateFrom: '',
// // //     createdDateTo: '',
// // //     publishedDateFrom: '',
// // //     publishedDateTo: ''
// // //   });
// // //   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 10;

// // //   useEffect(() => {
// // //     let filtered = [...announcements];

// // //     // Apply search filter
// // //     if (searchTerm) {
// // //       filtered = filtered.filter(announcement => 
// // //         announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         (announcement.target_name && announcement.target_name.toLowerCase().includes(searchTerm.toLowerCase()))
// // //       );
// // //     }

// // //     // Apply advanced filters
// // //     if (filters.status) {
// // //       if (filters.status === 'active') {
// // //         filtered = filtered.filter(announcement => announcement.is_active === true);
// // //       } else if (filters.status === 'inactive') {
// // //         filtered = filtered.filter(announcement => announcement.is_active === false);
// // //       } else if (filters.status === 'posted') {
// // //         filtered = filtered.filter(announcement => announcement.is_posted === true);
// // //       } else if (filters.status === 'draft') {
// // //         filtered = filtered.filter(announcement => announcement.is_posted === false);
// // //       }
// // //     }

// // //     if (filters.targetType) {
// // //       filtered = filtered.filter(announcement => 
// // //         announcement.target_type === filters.targetType
// // //       );
// // //     }

// // //     if (filters.hasAttachments) {
// // //       if (filters.hasAttachments === 'yes') {
// // //         filtered = filtered.filter(announcement => 
// // //           announcement.attachments && announcement.attachments.length > 0
// // //         );
// // //       } else if (filters.hasAttachments === 'no') {
// // //         filtered = filtered.filter(announcement => 
// // //           !announcement.attachments || announcement.attachments.length === 0
// // //         );
// // //       }
// // //     }

// // //     if (filters.isScheduled) {
// // //       if (filters.isScheduled === 'scheduled') {
// // //         filtered = filtered.filter(announcement => announcement.scheduled_at);
// // //       } else if (filters.isScheduled === 'immediate') {
// // //         filtered = filtered.filter(announcement => !announcement.scheduled_at);
// // //       }
// // //     }

// // //     // Filter by created date range
// // //     if (filters.createdDateFrom) {
// // //       const fromDate = new Date(filters.createdDateFrom);
// // //       filtered = filtered.filter(announcement => 
// // //         new Date(announcement.created_at) >= fromDate
// // //       );
// // //     }

// // //     if (filters.createdDateTo) {
// // //       const toDate = new Date(filters.createdDateTo);
// // //       toDate.setHours(23, 59, 59, 999);
// // //       filtered = filtered.filter(announcement => 
// // //         new Date(announcement.created_at) <= toDate
// // //       );
// // //     }

// // //     // Filter by published date range
// // //     if (filters.publishedDateFrom) {
// // //       const fromDate = new Date(filters.publishedDateFrom);
// // //       filtered = filtered.filter(announcement => {
// // //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// // //         return publishedDate >= fromDate;
// // //       });
// // //     }

// // //     if (filters.publishedDateTo) {
// // //       const toDate = new Date(filters.publishedDateTo);
// // //       toDate.setHours(23, 59, 59, 999);
// // //       filtered = filtered.filter(announcement => {
// // //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// // //         return publishedDate <= toDate;
// // //       });
// // //     }

// // //     // Apply sorting
// // //     if (sortConfig) {
// // //       filtered.sort((a, b) => {
// // //         let aValue = '';
// // //         let bValue = '';

// // //         switch (sortConfig.key) {
// // //           case 'created_at':
// // //             aValue = a.created_at;
// // //             bValue = b.created_at;
// // //             break;
// // //           case 'published_at':
// // //             aValue = a.scheduled_at || a.created_at;
// // //             bValue = b.scheduled_at || b.created_at;
// // //             break;
// // //           case 'type':
// // //             aValue = a.target_type;
// // //             bValue = b.target_type;
// // //             break;
// // //           case 'title':
// // //             aValue = a.title;
// // //             bValue = b.title;
// // //             break;
// // //         }

// // //         if (sortConfig.direction === 'asc') {
// // //           return aValue.localeCompare(bValue);
// // //         } else {
// // //           return bValue.localeCompare(aValue);
// // //         }
// // //       });
// // //     }

// // //     setFilteredAnnouncements(filtered);
// // //     setCurrentPage(1);
// // //   }, [announcements, searchTerm, filters, sortConfig]);

// // //   const handleSort = (key: string) => {
// // //     let direction: 'asc' | 'desc' = 'asc';
// // //     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
// // //       direction = 'desc';
// // //     }
// // //     setSortConfig({ key, direction });
// // //   };

// // //   const getSortIcon = (columnKey: string) => {
// // //     if (!sortConfig || sortConfig.key !== columnKey) {
// // //       return <FaSort className="w-3 h-3 opacity-50" />;
// // //     }
// // //     return sortConfig.direction === 'asc' ? 
// // //       <FaSortUp className="w-3 h-3 text-blue-500" /> : 
// // //       <FaSortDown className="w-3 h-3 text-blue-500" />;
// // //   };

// // //   const formatDateTime = (dateString: string) => {
// // //     const date = new Date(dateString);
// // //     return date.toLocaleDateString('en-GB', {
// // //       day: '2-digit',
// // //       month: '2-digit',
// // //       year: 'numeric'
// // //     }) + ' ' + date.toLocaleTimeString('en-GB', {
// // //       hour: '2-digit',
// // //       minute: '2-digit',
// // //       second: '2-digit'
// // //     });
// // //   };

// // //   const resetFilters = () => {
// // //     setSearchTerm('');
// // //     setFilters({
// // //       status: '',
// // //       targetType: '',
// // //       hasAttachments: '',
// // //       isScheduled: '',
// // //       createdDateFrom: '',
// // //       createdDateTo: '',
// // //       publishedDateFrom: '',
// // //       publishedDateTo: ''
// // //     });
// // //   };

// // //   // Pagination
// // //   const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
// // //   const startIndex = (currentPage - 1) * itemsPerPage;
// // //   const endIndex = startIndex + itemsPerPage;
// // //   const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

// // //   const goToPage = (page: number) => {
// // //     setCurrentPage(page);
// // //   };

// // //   return (
// // //     <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
// // //       theme === 'light' 
// // //         ? 'bg-white/90 border-gray-200' 
// // //         : 'bg-slate-800/90 border-slate-700'
// // //     }`}>
// // //       {/* Header with ANNOUNCEMENTS badge */}
// // //       <div className={`p-6 border-b ${
// // //         theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// // //       }`}>
// // //         <div className="flex items-center justify-between mb-6">
// // //           <h2 className={`text-2xl font-bold ${
// // //             theme === 'light' ? 'text-gray-900' : 'text-white'
// // //           }`}>
// // //             Announcements
// // //           </h2>
// // //           <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
// // //             ANNOUNCEMENTS
// // //           </span>
// // //         </div>

// // //         {/* Search Bar and Filters Button */}
// // //         <div className="flex gap-4 mb-4">
// // //           <div className="flex-1 relative">
// // //             <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
// // //               theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //             }`} />
// // //             <input
// // //               type="text"
// // //               placeholder="Search by title, content, author..."
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //               className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
// // //                 theme === 'light'
// // //                   ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
// // //                   : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
// // //               }`}
// // //             />
// // //           </div>
// // //           <button
// // //             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
// // //             className={`px-6 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
// // //               theme === 'light'
// // //                 ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
// // //                 : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600'
// // //             }`}
// // //           >
// // //             <FaFilter className="w-4 h-4" />
// // //             Filters
// // //           </button>
// // //         </div>

// // //         {/* Advanced Filters */}
// // //         {showAdvancedFilters && (
// // //           <div className={`p-6 rounded-lg border mb-4 ${
// // //             theme === 'light' 
// // //               ? 'bg-gray-50 border-gray-200' 
// // //               : 'bg-slate-700/50 border-slate-600'
// // //           }`}>
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h3 className={`text-lg font-semibold ${
// // //                 theme === 'light' ? 'text-gray-900' : 'text-white'
// // //               }`}>
// // //                 Advanced Filters
// // //               </h3>
// // //               <button
// // //                 onClick={resetFilters}
// // //                 className={`text-sm font-medium transition-colors ${
// // //                   theme === 'light' 
// // //                     ? 'text-blue-600 hover:text-blue-800' 
// // //                     : 'text-blue-400 hover:text-blue-300'
// // //                 }`}
// // //               >
// // //                 Reset Filters
// // //               </button>
// // //             </div>

// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //               {/* Status Filter */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Status
// // //                 </label>
// // //                 <div className="relative">
// // //                   <select
// // //                     value={filters.status}
// // //                     onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
// // //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// // //                       theme === 'light'
// // //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                     }`}
// // //                   >
// // //                     <option value="">All Status</option>
// // //                     <option value="active">Active</option>
// // //                     <option value="inactive">Inactive</option>
// // //                     <option value="posted">Posted</option>
// // //                     <option value="draft">Draft</option>
// // //                   </select>
// // //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// // //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //                   }`} />
// // //                 </div>
// // //               </div>

// // //               {/* Target Type Filter */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Target Type
// // //                 </label>
// // //                 <div className="relative">
// // //                   <select
// // //                     value={filters.targetType}
// // //                     onChange={(e) => setFilters(prev => ({ ...prev, targetType: e.target.value }))}
// // //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// // //                       theme === 'light'
// // //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                     }`}
// // //                   >
// // //                     <option value="">All Types</option>
// // //                     <option value="all">All</option>
// // //                     <option value="company">Company</option>
// // //                     <option value="department">Department</option>
// // //                     <option value="position">Position</option>
// // //                     <option value="employee">Employee</option>
// // //                   </select>
// // //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// // //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //                   }`} />
// // //                 </div>
// // //               </div>

// // //               {/* Has Attachments Filter */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Attachments
// // //                 </label>
// // //                 <div className="relative">
// // //                   <select
// // //                     value={filters.hasAttachments}
// // //                     onChange={(e) => setFilters(prev => ({ ...prev, hasAttachments: e.target.value }))}
// // //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// // //                       theme === 'light'
// // //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                     }`}
// // //                   >
// // //                     <option value="">All</option>
// // //                     <option value="yes">Has Attachments</option>
// // //                     <option value="no">No Attachments</option>
// // //                   </select>
// // //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// // //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //                   }`} />
// // //                 </div>
// // //               </div>

// // //               {/* Scheduling Filter */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Scheduling
// // //                 </label>
// // //                 <div className="relative">
// // //                   <select
// // //                     value={filters.isScheduled}
// // //                     onChange={(e) => setFilters(prev => ({ ...prev, isScheduled: e.target.value }))}
// // //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// // //                       theme === 'light'
// // //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                     }`}
// // //                   >
// // //                     <option value="">All</option>
// // //                     <option value="scheduled">Scheduled</option>
// // //                     <option value="immediate">Immediate</option>
// // //                   </select>
// // //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// // //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //                   }`} />
// // //                 </div>
// // //               </div>

// // //               {/* Created Date From */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Created From
// // //                 </label>
// // //                 <input
// // //                   type="date"
// // //                   value={filters.createdDateFrom}
// // //                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateFrom: e.target.value }))}
// // //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                     theme === 'light'
// // //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                   }`}
// // //                 />
// // //               </div>

// // //               {/* Created Date To */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Created To
// // //                 </label>
// // //                 <input
// // //                   type="date"
// // //                   value={filters.createdDateTo}
// // //                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateTo: e.target.value }))}
// // //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                     theme === 'light'
// // //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                   }`}
// // //                 />
// // //               </div>

// // //               {/* Published Date From */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Published From
// // //                 </label>
// // //                 <input
// // //                   type="date"
// // //                   value={filters.publishedDateFrom}
// // //                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateFrom: e.target.value }))}
// // //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                     theme === 'light'
// // //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                   }`}
// // //                 />
// // //               </div>

// // //               {/* Published Date To */}
// // //               <div>
// // //                 <label className={`block text-sm font-medium mb-2 ${
// // //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //                 }`}>
// // //                   Published To
// // //                 </label>
// // //                 <input
// // //                   type="date"
// // //                   value={filters.publishedDateTo}
// // //                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateTo: e.target.value }))}
// // //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// // //                     theme === 'light'
// // //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// // //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// // //                   }`}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Results count */}
// // //         <div className={`text-sm ${
// // //           theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// // //         }`}>
// // //           {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''}
// // //         </div>
// // //       </div>

// // //       {/* Table */}
// // //       <div className="overflow-x-auto">
// // //         <table className="w-full">
// // //           <thead className={`${
// // //             theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'
// // //           }`}>
// // //             <tr>
// // //               <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
// // //                 theme === 'light' ? 'text-gray-500' : 'text-gray-400'
// // //               }`}>
// // //                 Action
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('created_at')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Created At
// // //                   {getSortIcon('created_at')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('published_at')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Published At
// // //                   {getSortIcon('published_at')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('type')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Type
// // //                   {getSortIcon('type')}
// // //                 </div>
// // //               </th>
// // //               <th 
// // //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// // //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// // //                 }`}
// // //                 onClick={() => handleSort('title')}
// // //               >
// // //                 <div className="flex items-center gap-2">
// // //                   Title
// // //                   {getSortIcon('title')}
// // //                 </div>
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className={`divide-y ${
// // //             theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'
// // //           }`}>
// // //             {currentAnnouncements.map((announcement) => (
// // //               <tr key={announcement.id} className={`hover:bg-opacity-50 ${
// // //                 theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'
// // //               }`}>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <div className="flex items-center space-x-2">
// // //                     <button
// // //                       onClick={() => router.push(`/admin/announcements/edit/${announcement.id}`)}
// // //                       className={`p-2 rounded-lg transition-colors ${
// // //                         theme === 'light'
// // //                           ? 'text-blue-600 hover:bg-blue-50'
// // //                           : 'text-blue-400 hover:bg-blue-900/20'
// // //                       }`}
// // //                       title="Edit"
// // //                     >
// // //                       <FaEdit className="w-4 h-4" />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => onToggleActive(announcement.id, announcement.is_active || false)}
// // //                       className={`p-2 rounded-lg transition-colors ${
// // //                         announcement.is_active
// // //                           ? theme === 'light'
// // //                             ? 'text-green-600 hover:bg-green-50'
// // //                             : 'text-green-400 hover:bg-green-900/20'
// // //                           : theme === 'light'
// // //                             ? 'text-gray-400 hover:bg-gray-50'
// // //                             : 'text-gray-500 hover:bg-gray-800/20'
// // //                       }`}
// // //                       title={announcement.is_active ? 'Active' : 'Inactive'}
// // //                     >
// // //                       {announcement.is_active ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
// // //                     </button>
// // //                     <button
// // //                       onClick={() => onDelete(announcement.id)}
// // //                       className={`p-2 rounded-lg transition-colors ${
// // //                         theme === 'light'
// // //                           ? 'text-red-600 hover:bg-red-50'
// // //                           : 'text-red-400 hover:bg-red-900/20'
// // //                       }`}
// // //                       title="Delete"
// // //                     >
// // //                       <FaTrash className="w-4 h-4" />
// // //                     </button>
// // //                   </div>
// // //                 </td>
// // //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   {formatDateTime(announcement.created_at)}
// // //                 </td>
// // //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   {formatDateTime(announcement.scheduled_at || announcement.created_at)}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// // //                     announcement.target_type === 'all'
// // //                       ? 'bg-purple-100 text-purple-800'
// // //                       : announcement.target_type === 'company'
// // //                       ? 'bg-blue-100 text-blue-800'
// // //                       : announcement.target_type === 'department'
// // //                       ? 'bg-green-100 text-green-800'
// // //                       : announcement.target_type === 'position'
// // //                       ? 'bg-yellow-100 text-yellow-800'
// // //                       : 'bg-gray-100 text-gray-800'
// // //                   }`}>
// // //                     {announcement.target_type.charAt(0).toUpperCase() + announcement.target_type.slice(1)}
// // //                   </span>
// // //                 </td>
// // //                 <td className={`px-6 py-4 text-sm ${
// // //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// // //                 }`}>
// // //                   <div className="flex items-center space-x-2">
// // //                     <span className="truncate max-w-xs">{announcement.title}</span>
// // //                     {announcement.attachments && announcement.attachments.length > 0 && (
// // //                       <FaPaperclip className={`w-3 h-3 ${
// // //                         theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// // //                       }`} />
// // //                     )}
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {/* Pagination */}
// // //       {totalPages > 1 && (
// // //         <div className={`px-6 py-4 border-t ${
// // //           theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// // //         }`}>
// // //           <div className="flex items-center justify-between">
// // //             <div className={`text-sm ${
// // //               theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// // //             }`}>
// // //               Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length} results
// // //             </div>
// // //             <div className="flex items-center space-x-2">
// // //               <button
// // //                 onClick={() => goToPage(currentPage - 1)}
// // //                 disabled={currentPage === 1}
// // //                 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
// // //                   currentPage === 1
// // //                     ? theme === 'light'
// // //                       ? 'text-gray-400 cursor-not-allowed'
// // //                       : 'text-gray-600 cursor-not-allowed'
// // //                     : theme === 'light'
// // //                       ? 'text-gray-700 hover:bg-gray-100'
// // //                       : 'text-gray-300 hover:bg-slate-700'
// // //                 }`}
// // //               >
// // //                 Previous
// // //               </button>
// // //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// // //                 <button
// // //                   key={page}
// // //                   onClick={() => goToPage(page)}
// // //                   className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
// // //                     page === currentPage
// // //                       ? 'bg-blue-600 text-white'
// // //                       : theme === 'light'
// // //                         ? 'text-gray-700 hover:bg-gray-100'
// // //                         : 'text-gray-300 hover:bg-slate-700'
// // //                   }`}
// // //                 >
// // //                   {page}
// // //                 </button>
// // //               ))}
// // //               <button
// // //                 onClick={() => goToPage(currentPage + 1)}
// // //                 disabled={currentPage === totalPages}
// // //                 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
// // //                   currentPage === totalPages
// // //                     ? theme === 'light'
// // //                       ? 'text-gray-400 cursor-not-allowed'
// // //                       : 'text-gray-600 cursor-not-allowed'
// // //                     : theme === 'light'
// // //                       ? 'text-gray-700 hover:bg-gray-100'
// // //                       : 'text-gray-300 hover:bg-slate-700'
// // //                 }`}
// // //               >
// // //                 Next
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default function AnnouncementsPage() {
// // //   const { theme } = useTheme();
// // //   const router = useRouter();
// // //   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [role, setRole] = useState<string>('');
// // //   const [userId, setUserId] = useState<number>(0);

// // //   // Load user information
// // //   useEffect(() => {
// // //     const storedRole = localStorage.getItem('hrms_role');
// // //     const storedUser = localStorage.getItem('hrms_user');
    
// // //     if (storedRole) {
// // //       setRole(storedRole);
// // //     }
    
// // //     if (storedUser) {
// // //       try {
// // //         const userData = JSON.parse(storedUser);
// // //         if (userData?.id) {
// // //           setUserId(userData.id);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error parsing user data:', error);
// // //       }
// // //     }
// // //   }, []);

// // //   const fetchAnnouncements = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
// // //       if (!token) {
// // //         throw new Error('No authentication token found');
// // //       }

// // //       const empId = role !== 'admin' && userId !== 0 ? userId : null;
// // //       const url = `${API_BASE_URL}${API_ROUTES.announcements}${empId ? `?employee_id=${userId}` : ''}`;
      
// // //       const response = await fetch(url, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       });
      
// // //       if (!response.ok) {
// // //         if (response.status === 401) {
// // //           localStorage.removeItem('hrms_token');
// // //           router.push('/login');
// // //           return;
// // //         }
// // //         throw new Error('Failed to fetch announcements');
// // //       }
      
// // //       const data = await response.json();
      
// // //       // Transform the announcement data
// // //       const transformedAnnouncements = data.map((announcement: any) => ({
// // //         ...announcement,
// // //         is_posted: announcement.is_posted === 0 ? false : true,
// // //         is_active: announcement.is_active === 0 ? false : true,
// // //         target_all: announcement.target_all === 1 ? true : false,
// // //         target_type: announcement.target_type,
// // //         target_name: announcement.target_name,
// // //         scheduled_at: announcement.scheduled_at
// // //       }));
      
// // //       // Fetch attachments for each announcement
// // //       const announcementsWithAttachments = await Promise.all(
// // //         transformedAnnouncements.map(async (announcement: Announcement) => {
// // //           try {
// // //             const token = localStorage.getItem('token');
// // //             if (!token) return announcement;
            
// // //             const attachmentsResponse = await fetch(
// // //               `${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`,
// // //               {
// // //                 headers: {
// // //                   'Authorization': `Bearer ${token}`,
// // //                   'Content-Type': 'application/json'
// // //                 }
// // //               }
// // //             );
            
// // //             if (attachmentsResponse.ok) {
// // //               const attachmentsData = await attachmentsResponse.json();
// // //               return {
// // //                 ...announcement,
// // //                 attachments: attachmentsData.documents || []
// // //               };
// // //             }
// // //             return announcement;
// // //           } catch (error) {
// // //             console.error(`Error fetching attachments for announcement ${announcement.id}:`, error);
// // //             return announcement;
// // //           }
// // //         })
// // //       );
      
// // //       setAnnouncements(announcementsWithAttachments);
// // //     } catch (error) {
// // //       console.error('Error fetching announcements:', error);
// // //       setError(error instanceof Error ? error.message : 'Failed to load announcements');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [role, userId, router]);

// // //   // Fetch announcements when component mounts or when role/userId changes
// // //   useEffect(() => {
// // //     if (userId !== 0 || role === 'admin') {
// // //       fetchAnnouncements();
// // //     }
// // //   }, [fetchAnnouncements, userId, role]);

// // //   const handleDelete = async (id: string) => {
// // //     if (!confirm('Are you sure you want to delete this announcement?')) {
// // //       return;
// // //     }

// // //     try {
// // //       const token = localStorage.getItem('hrms_token');
// // //       if (!token) {
// // //         throw new Error('No authentication token found');
// // //       }

// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// // //         method: 'DELETE',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error('Failed to delete announcement');
// // //       }

// // //       setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting announcement:', error);
// // //       setError(error instanceof Error ? error.message : 'Failed to delete announcement');
// // //     }
// // //   };

// // //   const handleToggleActive = async (id: string, currentActive: boolean) => {
// // //     try {
// // //       const token = localStorage.getItem('hrms_token');
// // //       if (!token) {
// // //         throw new Error('No authentication token found');
// // //       }

// // //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// // //         method: 'PATCH',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({
// // //           is_active: !currentActive,
// // //         }),
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error('Failed to update announcement');
// // //       }

// // //       setAnnouncements(prev =>
// // //         prev.map(announcement =>
// // //           announcement.id === id
// // //             ? { ...announcement, is_active: !currentActive }
// // //             : announcement
// // //         )
// // //       );
// // //     } catch (err) {
// // //       console.error('Error toggling announcement status:', err);
// // //       setError(err instanceof Error ? err.message : 'Failed to update announcement');
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className={`min-h-screen p-6 ${
// // //         theme === 'light' 
// // //           ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
// // //           : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// // //       }`}>
// // //         <div className="flex items-center justify-center h-64">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className={`min-h-screen p-6 ${
// // //         theme === 'light' 
// // //           ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
// // //           : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// // //       }`}>
// // //         <div className="flex items-center justify-center h-64">
// // //           <div className={`text-center ${
// // //             theme === 'light' ? 'text-red-600' : 'text-red-400'
// // //           }`}>
// // //             <p className="text-lg font-semibold">Error</p>
// // //             <p>{error}</p>
// // //             <button 
// // //               onClick={() => setError(null)}
// // //               className={`mt-4 px-4 py-2 rounded-lg ${
// // //                 theme === 'light' 
// // //                   ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
// // //                   : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
// // //               }`}
// // //             >
// // //               Try Again
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className={`min-h-screen p-6 ${
// // //       theme === 'light' 
// // //         ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
// // //         : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// // //     }`}>
// // //       <div className="max-w-7xl mx-auto">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between mb-8">
// // //           <div>
// // //             <h1 className={`text-3xl font-bold ${
// // //               theme === 'light' ? 'text-gray-900' : 'text-white'
// // //             }`}>
// // //               Announcements Management
// // //             </h1>
// // //             <p className={`mt-2 ${
// // //               theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// // //             }`}>
// // //               Manage and organize company announcements
// // //             </p>
// // //           </div>
// // //           {role === 'admin' && (
// // //             <Link
// // //               href="/announcements/create"
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
// // //             >
// // //               <FaPlus className="w-4 h-4" />
// // //               Create Announcement
// // //             </Link>
// // //           )}
// // //         </div>

// // //         {/* Admin Table View */}
// // //         <AdminTableView
// // //           announcements={announcements}
// // //           theme={theme}
// // //           onDelete={handleDelete}
// // //           onToggleActive={handleToggleActive}
// // //           router={router}
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import { 
// //   FaPlus, 
// //   FaEdit, 
// //   FaTrash, 
// //   FaChevronDown, 
// //   FaChevronUp, 
// //   FaArrowUp,
// //   FaArrowDown,
// //   FaClock,
// //   FaCalendarAlt,
// //   FaPaperclip,
// //   FaEye,
// //   FaEyeSlash,
// //   FaBell,
// //   FaHistory,
// //   FaGlobe,
// //   FaBuilding,
// //   FaUsers,
// //   FaUser,
// //   FaSearch,
// //   FaFilter,
// //   FaTimes,
// //   FaSort,
// //   FaSortUp,  
// //   FaSortDown,
// //   FaCaretDown
// // } from 'react-icons/fa';
// // import { API_BASE_URL, API_ROUTES } from '../config';
// // import { toZonedTime } from 'date-fns-tz';
// // import { format } from 'date-fns';
// // import { useTheme } from '../components/ThemeProvider';

// // // Singapore timezone
// // const timeZone = 'Asia/Singapore';

// // // Function to convert date to Singapore timezone
// // const toSingaporeTime = (date: Date): Date => {
// //   return toZonedTime(date, timeZone);
// // };

// // interface Announcement {
// //   id: string;
// //   title: string;
// //   content: string;
// //   created_at: string;
// //   target_type: 'company' | 'department' | 'position' | 'employee' | 'all';
// //   target_name?: string;
// //   is_active?: boolean;
// //   is_posted?: boolean;
// //   target_all?: boolean;
// //   scheduled_at?: string;
// //   attachments?: {
// //     id: number;
// //     original_filename: string;
// //     file_size: number;
// //     content_type: string;
// //     download_url: string;
// //     uploaded_at: string;
// //   }[];
// // }

// // // Custom vertical scroll hook
// // const useVerticalScroll = () => {
// //   const scrollRef = useRef<HTMLDivElement>(null);
// //   const [canScrollUp, setCanScrollUp] = useState(false);
// //   const [canScrollDown, setCanScrollDown] = useState(false);

// //   const checkScrollability = useCallback(() => {
// //     if (scrollRef.current) {
// //       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
// //       setCanScrollUp(scrollTop > 0);
// //       setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
// //     }
// //   }, []);

// //   const scrollUp = () => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollBy({ top: -300, behavior: 'smooth' });
// //     }
// //   };

// //   const scrollDown = () => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
// //     }
// //   };

// //   useEffect(() => {
// //     const element = scrollRef.current;
// //     if (element) {
// //       checkScrollability();
// //       element.addEventListener('scroll', checkScrollability);
// //       window.addEventListener('resize', checkScrollability);
      
// //       return () => {
// //         element.removeEventListener('scroll', checkScrollability);
// //         window.removeEventListener('resize', checkScrollability);
// //       };
// //     }
// //   }, [checkScrollability]);

// //   return { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability };
// // };

// // // Admin Table View Component with New Filtering UI
// // const AdminTableView = ({ 
// //   announcements, 
// //   theme, 
// //   onDelete, 
// //   onToggleActive, 
// //   router 
// // }: {
// //   announcements: Announcement[];
// //   theme: string;
// //   onDelete: (id: string) => void;
// //   onToggleActive: (id: string, currentActive: boolean) => void;
// //   router: any;
// // }) => {
// //   const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
// //   const [filters, setFilters] = useState({
// //     status: '',
// //     targetType: '',
// //     hasAttachments: '',
// //     isScheduled: '',
// //     createdDateFrom: '',
// //     createdDateTo: '',
// //     publishedDateFrom: '',
// //     publishedDateTo: ''
// //   });
// //   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;

// //   useEffect(() => {
// //     let filtered = [...announcements];

// //     // Apply search filter
// //     if (searchTerm) {
// //       filtered = filtered.filter(announcement => 
// //         announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         (announcement.target_name && announcement.target_name.toLowerCase().includes(searchTerm.toLowerCase()))
// //       );
// //     }

// //     // Apply advanced filters
// //     if (filters.status) {
// //       if (filters.status === 'active') {
// //         filtered = filtered.filter(announcement => announcement.is_active === true);
// //       } else if (filters.status === 'inactive') {
// //         filtered = filtered.filter(announcement => announcement.is_active === false);
// //       } else if (filters.status === 'posted') {
// //         filtered = filtered.filter(announcement => announcement.is_posted === true);
// //       } else if (filters.status === 'draft') {
// //         filtered = filtered.filter(announcement => announcement.is_posted === false);
// //       }
// //     }

// //     if (filters.targetType) {
// //       filtered = filtered.filter(announcement => 
// //         announcement.target_type === filters.targetType
// //       );
// //     }

// //     if (filters.hasAttachments) {
// //       if (filters.hasAttachments === 'yes') {
// //         filtered = filtered.filter(announcement => 
// //           announcement.attachments && announcement.attachments.length > 0
// //         );
// //       } else if (filters.hasAttachments === 'no') {
// //         filtered = filtered.filter(announcement => 
// //           !announcement.attachments || announcement.attachments.length === 0
// //         );
// //       }
// //     }

// //     if (filters.isScheduled) {
// //       if (filters.isScheduled === 'scheduled') {
// //         filtered = filtered.filter(announcement => announcement.scheduled_at);
// //       } else if (filters.isScheduled === 'immediate') {
// //         filtered = filtered.filter(announcement => !announcement.scheduled_at);
// //       }
// //     }

// //     // Filter by created date range
// //     if (filters.createdDateFrom) {
// //       const fromDate = new Date(filters.createdDateFrom);
// //       filtered = filtered.filter(announcement => 
// //         new Date(announcement.created_at) >= fromDate
// //       );
// //     }

// //     if (filters.createdDateTo) {
// //       const toDate = new Date(filters.createdDateTo);
// //       toDate.setHours(23, 59, 59, 999);
// //       filtered = filtered.filter(announcement => 
// //         new Date(announcement.created_at) <= toDate
// //       );
// //     }

// //     // Filter by published date range
// //     if (filters.publishedDateFrom) {
// //       const fromDate = new Date(filters.publishedDateFrom);
// //       filtered = filtered.filter(announcement => {
// //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// //         return publishedDate >= fromDate;
// //       });
// //     }

// //     if (filters.publishedDateTo) {
// //       const toDate = new Date(filters.publishedDateTo);
// //       toDate.setHours(23, 59, 59, 999);
// //       filtered = filtered.filter(announcement => {
// //         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
// //         return publishedDate <= toDate;
// //       });
// //     }

// //     // Apply sorting
// //     if (sortConfig) {
// //       filtered.sort((a, b) => {
// //         let aValue = '';
// //         let bValue = '';

// //         switch (sortConfig.key) {
// //           case 'created_at':
// //             aValue = a.created_at;
// //             bValue = b.created_at;
// //             break;
// //           case 'published_at':
// //             aValue = a.scheduled_at || a.created_at;
// //             bValue = b.scheduled_at || b.created_at;
// //             break;
// //           case 'type':
// //             aValue = a.target_type;
// //             bValue = b.target_type;
// //             break;
// //           case 'title':
// //             aValue = a.title;
// //             bValue = b.title;
// //             break;
// //         }

// //         if (sortConfig.direction === 'asc') {
// //           return aValue.localeCompare(bValue);
// //         } else {
// //           return bValue.localeCompare(aValue);
// //         }
// //       });
// //     }

// //     setFilteredAnnouncements(filtered);
// //     setCurrentPage(1);
// //   }, [announcements, searchTerm, filters, sortConfig]);

// //   const handleSort = (key: string) => {
// //     let direction: 'asc' | 'desc' = 'asc';
// //     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
// //       direction = 'desc';
// //     }
// //     setSortConfig({ key, direction });
// //   };

// //   const getSortIcon = (columnKey: string) => {
// //     if (!sortConfig || sortConfig.key !== columnKey) {
// //       return <FaSort className="w-3 h-3 opacity-50" />;
// //     }
// //     return sortConfig.direction === 'asc' ? 
// //       <FaSortUp className="w-3 h-3 text-blue-500" /> : 
// //       <FaSortDown className="w-3 h-3 text-blue-500" />;
// //   };

// //   const formatDateTime = (dateString: string) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('en-GB', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric'
// //     }) + ' ' + date.toLocaleTimeString('en-GB', {
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       second: '2-digit'
// //     });
// //   };

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilters({
// //       status: '',
// //       targetType: '',
// //       hasAttachments: '',
// //       isScheduled: '',
// //       createdDateFrom: '',
// //       createdDateTo: '',
// //       publishedDateFrom: '',
// //       publishedDateTo: ''
// //     });
// //   };

// //   // Pagination
// //   const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
// //   const startIndex = (currentPage - 1) * itemsPerPage;
// //   const endIndex = startIndex + itemsPerPage;
// //   const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

// //   const goToPage = (page: number) => {
// //     setCurrentPage(page);
// //   };

// //   return (
// //     <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
// //       theme === 'light' 
// //         ? 'bg-white/90 border-gray-200' 
// //         : 'bg-slate-800/90 border-slate-700'
// //     }`}>
// //       {/* Header with ANNOUNCEMENTS badge */}
// //       <div className={`p-6 border-b ${
// //         theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// //       }`}>
// //         {/* <div className="flex items-center justify-between mb-6">
// //           <h2 className={`text-2xl font-bold ${
// //             theme === 'light' ? 'text-gray-900' : 'text-white'
// //           }`}>
// //             Announcements
// //           </h2>
// //           <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
// //             ANNOUNCEMENTS
// //           </span>
// //         </div> */}

// //         {/* Search Bar and Filters Button */}
// //         <div className="flex gap-4 mb-4">
// //           <div className="flex-1 relative">
// //             <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
// //               theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// //             }`} />
// //             <input
// //               type="text"
// //               placeholder="Search by title, content, author..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
// //                 theme === 'light'
// //                   ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
// //                   : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
// //               }`}
// //             />
// //           </div>
// //           <button
// //             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
// //             className={`px-6 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
// //               theme === 'light'
// //                 ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
// //                 : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600'
// //             }`}
// //           >
// //             <FaFilter className="w-4 h-4" />
// //             Filters
// //           </button>
// //         </div>

// //         {/* Advanced Filters */}
// //         {showAdvancedFilters && (
// //           <div className={`p-6 rounded-lg border mb-4 ${
// //             theme === 'light' 
// //               ? 'bg-gray-50 border-gray-200' 
// //               : 'bg-slate-700/50 border-slate-600'
// //           }`}>
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className={`text-lg font-semibold ${
// //                 theme === 'light' ? 'text-gray-900' : 'text-white'
// //               }`}>
// //                 Advanced Filters
// //               </h3>
// //               <button
// //                 onClick={resetFilters}
// //                 className={`text-sm font-medium transition-colors ${
// //                   theme === 'light' 
// //                     ? 'text-blue-600 hover:text-blue-800' 
// //                     : 'text-blue-400 hover:text-blue-300'
// //                 }`}
// //               >
// //                 Reset Filters
// //               </button>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //               {/* Status Filter */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Status
// //                 </label>
// //                 <div className="relative">
// //                   <select
// //                     value={filters.status}
// //                     onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
// //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// //                       theme === 'light'
// //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                     }`}
// //                   >
// //                     <option value="">All Status</option>
// //                     <option value="active">Active</option>
// //                     <option value="inactive">Inactive</option>
// //                     <option value="posted">Posted</option>
// //                     <option value="draft">Draft</option>
// //                   </select>
// //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// //                   }`} />
// //                 </div>
// //               </div>

// //               {/* Target Type Filter */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Target Type
// //                 </label>
// //                 <div className="relative">
// //                   <select
// //                     value={filters.targetType}
// //                     onChange={(e) => setFilters(prev => ({ ...prev, targetType: e.target.value }))}
// //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// //                       theme === 'light'
// //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                     }`}
// //                   >
// //                     <option value="">All Types</option>
// //                     <option value="all">All</option>
// //                     <option value="company">Company</option>
// //                     <option value="department">Department</option>
// //                     <option value="position">Position</option>
// //                     <option value="employee">Employee</option>
// //                   </select>
// //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// //                   }`} />
// //                 </div>
// //               </div>

// //               {/* Has Attachments Filter */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Attachments
// //                 </label>
// //                 <div className="relative">
// //                   <select
// //                     value={filters.hasAttachments}
// //                     onChange={(e) => setFilters(prev => ({ ...prev, hasAttachments: e.target.value }))}
// //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// //                       theme === 'light'
// //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                     }`}
// //                   >
// //                     <option value="">All</option>
// //                     <option value="yes">Has Attachments</option>
// //                     <option value="no">No Attachments</option>
// //                   </select>
// //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// //                   }`} />
// //                 </div>
// //               </div>

// //               {/* Scheduling Filter */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Scheduling
// //                 </label>
// //                 <div className="relative">
// //                   <select
// //                     value={filters.isScheduled}
// //                     onChange={(e) => setFilters(prev => ({ ...prev, isScheduled: e.target.value }))}
// //                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
// //                       theme === 'light'
// //                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                     }`}
// //                   >
// //                     <option value="">All</option>
// //                     <option value="scheduled">Scheduled</option>
// //                     <option value="immediate">Immediate</option>
// //                   </select>
// //                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
// //                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
// //                   }`} />
// //                 </div>
// //               </div>

// //               {/* Created Date From */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Created From
// //                 </label>
// //                 <input
// //                   type="date"
// //                   value={filters.createdDateFrom}
// //                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateFrom: e.target.value }))}
// //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// //                     theme === 'light'
// //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                   }`}
// //                 />
// //               </div>

// //               {/* Created Date To */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Created To
// //                 </label>
// //                 <input
// //                   type="date"
// //                   value={filters.createdDateTo}
// //                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateTo: e.target.value }))}
// //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// //                     theme === 'light'
// //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                   }`}
// //                 />
// //               </div>

// //               {/* Published Date From */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Published From
// //                 </label>
// //                 <input
// //                   type="date"
// //                   value={filters.publishedDateFrom}
// //                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateFrom: e.target.value }))}
// //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// //                     theme === 'light'
// //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                   }`}
// //                 />
// //               </div>

// //               {/* Published Date To */}
// //               <div>
// //                 <label className={`block text-sm font-medium mb-2 ${
// //                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
// //                 }`}>
// //                   Published To
// //                 </label>
// //                 <input
// //                   type="date"
// //                   value={filters.publishedDateTo}
// //                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateTo: e.target.value }))}
// //                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
// //                     theme === 'light'
// //                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
// //                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
// //                   }`}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Results count */}
// //         <div className={`text-sm ${
// //           theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// //         }`}>
// //           {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''}
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto">
// //         <table className="w-full">
// //           <thead className={`${
// //             theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'
// //           }`}>
// //             <tr>
// //               <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
// //                 theme === 'light' ? 'text-gray-500' : 'text-gray-400'
// //               }`}>
// //                 Action
// //               </th>
// //               <th 
// //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// //                 }`}
// //                 onClick={() => handleSort('created_at')}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   Created At
// //                   {getSortIcon('created_at')}
// //                 </div>
// //               </th>
// //               <th 
// //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// //                 }`}
// //                 onClick={() => handleSort('published_at')}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   Published At
// //                   {getSortIcon('published_at')}
// //                 </div>
// //               </th>
// //               <th 
// //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// //                 }`}
// //                 onClick={() => handleSort('type')}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   Type
// //                   {getSortIcon('type')}
// //                 </div>
// //               </th>
// //               <th 
// //                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
// //                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
// //                 }`}
// //                 onClick={() => handleSort('title')}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   Title
// //                   {getSortIcon('title')}
// //                 </div>
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className={`divide-y ${
// //             theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'
// //           }`}>
// //             {currentAnnouncements.map((announcement) => (
// //               <tr key={announcement.id} className={`hover:bg-opacity-50 ${
// //                 theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'
// //               }`}>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <div className="flex gap-2">
// //                     <button 
// //                       onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
// //                       className={`p-2 rounded-lg transition-colors ${
// //                         theme === 'light'
// //                           ? 'text-blue-600 hover:bg-blue-100'
// //                           : 'text-blue-400 hover:bg-blue-900/30'
// //                       }`}
// //                       title="Edit"
// //                     >
// //                       <FaEdit className="w-4 h-4" />
// //                     </button>
// //                     <button 
// //                       onClick={() => onDelete(announcement.id)}
// //                       className={`p-2 rounded-lg transition-colors ${
// //                         theme === 'light'
// //                           ? 'text-red-600 hover:bg-red-100'
// //                           : 'text-red-400 hover:bg-red-900/30'
// //                       }`}
// //                       title="Delete"
// //                     >
// //                       <FaTrash className="w-4 h-4" />
// //                     </button>
// //                     <button 
// //                       onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
// //                       className={`p-2 rounded-lg transition-colors ${
// //                         announcement.is_active === false
// //                           ? theme === 'light'
// //                             ? 'text-green-600 hover:bg-green-100'
// //                             : 'text-green-400 hover:bg-green-900/30'
// //                           : theme === 'light'
// //                             ? 'text-gray-600 hover:bg-gray-100'
// //                             : 'text-gray-400 hover:bg-gray-700'
// //                       }`}
// //                       title={announcement.is_active === false ? "Activate" : "Deactivate"}
// //                     >
// //                       {announcement.is_active === false ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
// //                     </button>
// //                   </div>
// //                 </td>
// //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// //                 }`}>
// //                   {formatDateTime(announcement.created_at)}
// //                 </td>
// //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// //                 }`}>
// //                   {formatDateTime(announcement.scheduled_at || announcement.created_at)}
// //                 </td>
// //                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${
// //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// //                 }`}>
// //                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
// //                     announcement.target_type === 'all'
// //                       ? theme === 'light'
// //                         ? 'bg-purple-100 text-purple-800'
// //                         : 'bg-purple-900/30 text-purple-300'
// //                       : announcement.target_type === 'company'
// //                         ? theme === 'light'
// //                           ? 'bg-blue-100 text-blue-800'
// //                           : 'bg-blue-900/30 text-blue-300'
// //                         : announcement.target_type === 'department'
// //                           ? theme === 'light'
// //                             ? 'bg-green-100 text-green-800'
// //                             : 'bg-green-900/30 text-green-300'
// //                           : theme === 'light'
// //                             ? 'bg-orange-100 text-orange-800'
// //                             : 'bg-orange-900/30 text-orange-300'
// //                   }`}>
// //                     {announcement.target_type}
// //                   </span>
// //                 </td>
// //                 <td className={`px-6 py-4 text-sm ${
// //                   theme === 'light' ? 'text-gray-900' : 'text-white'
// //                 }`}>
// //                   <div className="max-w-xs">
// //                     <div className="font-medium truncate">{announcement.title}</div>
// //                     {announcement.is_posted === false && (
// //                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${
// //                         theme === 'light' 
// //                           ? 'bg-amber-100 text-amber-700' 
// //                           : 'bg-amber-900/30 text-amber-300'
// //                       }`}>
// //                         Draft
// //                       </span>
// //                     )}
// //                     {announcement.is_active === false && (
// //                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 ml-2 inline-block ${
// //                         theme === 'light' 
// //                           ? 'bg-red-100 text-red-700' 
// //                           : 'bg-red-900/30 text-red-300'
// //                       }`}>
// //                         Inactive
// //                       </span>
// //                     )}
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Pagination */}
// //       {totalPages > 1 && (
// //         <div className={`px-6 py-4 border-t flex items-center justify-between ${
// //           theme === 'light' ? 'border-gray-200' : 'border-slate-700'
// //         }`}>
// //           <div className={`text-sm ${
// //             theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// //           }`}>
// //             Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length} results
// //           </div>
// //           <div className="flex gap-2">
// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //               <button
// //                 key={page}
// //                 onClick={() => goToPage(page)}
// //                 className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
// //                   currentPage === page
// //                     ? theme === 'light'
// //                       ? 'bg-blue-600 text-white'
// //                       : 'bg-blue-500 text-white'
// //                     : theme === 'light'
// //                       ? 'text-gray-600 hover:bg-gray-100'
// //                       : 'text-gray-400 hover:bg-slate-700'
// //                 }`}
// //               >
// //                 {page}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Compact Announcement Card Component for vertical layout (non-admin view)
// // const CompactAnnouncementCard = ({ 
// //   announcement, 
// //   role, 
// //   theme, 
// //   onDelete, 
// //   onToggleActive, 
// //   router 
// // }: {
// //   announcement: Announcement;
// //   role: string;
// //   theme: string;
// //   onDelete: (id: string) => void;
// //   onToggleActive: (id: string, currentActive: boolean) => void;
// //   router: any;
// // }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   const getTargetInfo = (announcement: Announcement) => {
// //     const icons = {
// //       company: <FaBuilding className="w-3 h-3" />,
// //       department: <FaUsers className="w-3 h-3" />,
// //       position: <FaUser className="w-3 h-3" />,
// //       employee: <FaUser className="w-3 h-3" />,
// //       all: <FaGlobe className="w-3 h-3" />
// //     };

// //     const names = {
// //       company: 'Company',
// //       department: 'Department',
// //       position: 'Position',
// //       employee: 'Employee',
// //       all: 'Global'
// //     };

// //     return {
// //       icon: icons[announcement.target_type] || icons.all,
// //       name: names[announcement.target_type] || names.all
// //     };
// //   };

// //   const isLongContent = (content: string): boolean => {
// //     return content.split(/\s+/).length > 25;
// //   };

// //   const getPreviewContent = (content: string): string => {
// //     const words = content.split(/\s+/);
// //     return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : content;
// //   };

// //   const isScheduledForFuture = (dateString?: string): boolean => {
// //     if (!dateString) return false;
// //     const scheduledDate = new Date(dateString);
// //     return scheduledDate > new Date();
// //   };

// //   const formatDate = (dateString: string): string => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       month: 'short',
// //       day: 'numeric',
// //       year: 'numeric'
// //     });
// //   };

// //   const getStatusColor = () => {
// //     if (announcement.is_active === false) return 'from-red-500 to-red-600';
// //     if (announcement.is_posted === false) return 'from-amber-500 to-orange-600';
// //     return 'from-blue-500 to-indigo-600';
// //   };

// //   const targetInfo = getTargetInfo(announcement);

// //   return (
// //     <div className={`
// //       mb-3 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] group
// //       ${theme === 'light' 
// //         ? 'bg-white border-gray-200 hover:border-blue-300' 
// //         : 'bg-slate-800 border-slate-700 hover:border-blue-500'
// //       }
// //     `}>
// //       {/* Compact Header */}
// //       <div className={`
// //         p-4 rounded-t-xl bg-gradient-to-r ${getStatusColor()} text-white relative overflow-hidden
// //       `}>
// //         {/* Background Pattern */}
// //         <div className="absolute inset-0 opacity-10">
// //           <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-white/20"></div>
// //           <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/10"></div>
// //         </div>
        
// //         <div className="relative z-10">
// //           <div className="flex items-start justify-between mb-3">
// //             <h3 className="font-semibold text-sm leading-tight flex-1 mr-3 line-clamp-2">
// //               {announcement.title}
// //             </h3>
// //             <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
// //               {announcement.is_posted === false && announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) ? (
// //                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
// //                   SCHEDULED
// //                 </span>
// //               ) : announcement.is_posted === false ? (
// //                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
// //                   DRAFT
// //                 </span>
// //               ) : null}
// //             </div>
// //           </div>
          
// //           <div className="flex items-center justify-between text-xs">
// //             <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
// //               {targetInfo.icon}
// //               <span className="font-medium">{targetInfo.name}</span>
// //             </div>
// //             <div className="flex items-center gap-2 text-white/90">
// //               <FaCalendarAlt className="w-3 h-3" />
// //               <span className="font-medium">{formatDate(announcement.created_at)}</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Compact Body */}
// //       <div className="p-4">
// //         <div className="mb-4">
// //           <div className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
// //             {isLongContent(announcement.content) && !isExpanded ? (
// //               <>
// //                 <div className="whitespace-pre-wrap mb-2">
// //                   {getPreviewContent(announcement.content)}
// //                 </div>
// //                 <button 
// //                   onClick={() => setIsExpanded(true)}
// //                   className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
// //                     theme === 'light' 
// //                       ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
// //                       : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
// //                   }`}
// //                 >
// //                   Read more <FaChevronDown className="w-2 h-2" />
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 <div className="whitespace-pre-wrap mb-2">
// //                   {announcement.content}
// //                 </div>
// //                 {isLongContent(announcement.content) && (
// //                   <button 
// //                     onClick={() => setIsExpanded(false)}
// //                     className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
// //                       theme === 'light' 
// //                         ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
// //                         : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
// //                     }`}
// //                   >
// //                     Show less <FaChevronUp className="w-2 h-2" />
// //                   </button>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         </div>

// //         {/* Attachments */}
// //         {announcement.attachments && announcement.attachments.length > 0 && (
// //           <div className="mb-4">
// //             <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
// //               theme === 'light' 
// //                 ? 'text-blue-600 bg-blue-50 border border-blue-200' 
// //                 : 'text-blue-400 bg-blue-900/30 border border-blue-700'
// //             }`}>
// //               <FaPaperclip className="w-3 h-3" />
// //               <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
// //             </div>
// //           </div>
// //         )}

// //         {/* Status and Actions */}
// //         <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
// //           <div className="flex items-center gap-2">
// //             {announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) && !announcement.is_posted && (
// //               <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
// //                 theme === 'light' 
// //                   ? 'text-blue-600 bg-blue-50 border border-blue-200' 
// //                   : 'text-blue-400 bg-blue-900/30 border border-blue-700'
// //               }`}>
// //                 <FaClock className="w-3 h-3" />
// //                 <span className="font-medium">{format(toSingaporeTime(new Date(announcement.scheduled_at)) as Date, 'dd/MM')}</span>
// //               </div>
// //             )}
// //             {announcement.is_active === false && (
// //               <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
// //                 theme === 'light' 
// //                   ? 'bg-amber-100 text-amber-700 border border-amber-200' 
// //                   : 'bg-amber-900/30 text-amber-300 border border-amber-700'
// //               }`}>
// //                 Inactive
// //               </span>
// //             )}
// //           </div>

// //           {/* Admin Actions */}
// //           {role === 'admin' && (
// //             <div className="flex gap-1">
// //               {announcement.is_posted !== false && (
// //                 <button 
// //                   onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
// //                   className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// //                     announcement.is_active === false
// //                       ? theme === 'light'
// //                         ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
// //                         : 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
// //                       : theme === 'light'
// //                         ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
// //                         : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
// //                   }`}
// //                   title={announcement.is_active === false ? "Activate" : "Deactivate"}
// //                 >
// //                   {announcement.is_active === false ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
// //                 </button>
// //               )}
// //               <button 
// //                 onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
// //                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// //                   theme === 'light'
// //                     ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
// //                     : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-700'
// //                 }`}
// //                 title="Edit"
// //               >
// //                 <FaEdit className="w-3 h-3" />
// //               </button>
// //               <button 
// //                 onClick={() => onDelete(announcement.id)}
// //                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
// //                   theme === 'light'
// //                     ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
// //                     : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
// //                 }`}
// //                 title="Delete"
// //               >
// //                 <FaTrash className="w-3 h-3" />
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Vertical Scrollable Section Component
// // const VerticalScrollableSection = ({ 
// //   title, 
// //   icon,
// //   announcements, 
// //   role, 
// //   theme, 
// //   onDelete, 
// //   onToggleActive, 
// //   router,
// //   emptyMessage,
// //   emptyIcon,
// //   accentColor
// // }: {
// //   title: string;
// //   icon: React.ReactNode;
// //   announcements: Announcement[];
// //   role: string;
// //   theme: string;
// //   onDelete: (id: string) => void;
// //   onToggleActive: (id: string, currentActive: boolean) => void;
// //   router: any;
// //   emptyMessage: string;
// //   emptyIcon: React.ReactNode;
// //   accentColor: string;
// // }) => {
// //   const { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability } = useVerticalScroll();

// //   useEffect(() => {
// //     checkScrollability();
// //   }, [announcements, checkScrollability]);

// //   return (
// //     <div className="flex-1 flex flex-col min-h-0">
// //       {/* Section Header */}
// //       <div className={`
// //         p-6 rounded-t-2xl border-b bg-gradient-to-r ${accentColor} text-white relative overflow-hidden
// //         ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}
// //       `}>
// //         {/* Background Pattern */}
// //         <div className="absolute inset-0 opacity-10">
// //           <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/20"></div>
// //           <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10"></div>
// //         </div>
        
// //         <div className="relative z-10 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
// //               {icon}
// //             </div>
// //             <div>
// //               <h2 className="text-xl font-bold">{title}</h2>
// //               <p className="text-white/80 text-sm">
// //                 {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
// //               </p>
// //             </div>
// //           </div>
          
// //           {/* Scroll Controls */}
// //           {(canScrollUp || canScrollDown) && (
// //             <div className="flex flex-col gap-1">
// //               <button
// //                 onClick={scrollUp}
// //                 disabled={!canScrollUp}
// //                 className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
// //                   canScrollUp 
// //                     ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
// //                     : 'bg-white/10 text-white/40 cursor-not-allowed'
// //                 }`}
// //                 title="Scroll up"
// //               >
// //                 <FaArrowUp className="w-3 h-3" />
// //               </button>
// //               <button
// //                 onClick={scrollDown}
// //                 disabled={!canScrollDown}
// //                 className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
// //                   canScrollDown 
// //                     ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
// //                     : 'bg-white/10 text-white/40 cursor-not-allowed'
// //                 }`}
// //                 title="Scroll down"
// //               >
// //                 <FaArrowDown className="w-3 h-3" />
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Scrollable Content */}
// //       <div 
// //         ref={scrollRef}
// //         className={`
// //           flex-1 overflow-y-auto p-6 rounded-b-2xl border border-t-0 backdrop-blur-sm
// //           ${theme === 'light' 
// //             ? 'bg-white/90 border-gray-200' 
// //             : 'bg-slate-800/90 border-slate-700'
// //           }
// //         `}
// //         style={{ maxHeight: 'calc(100vh - 300px)' }}
// //       >
// //         {announcements.length > 0 ? (
// //           announcements.map((announcement) => (
// //             <CompactAnnouncementCard
// //               key={announcement.id}
// //               announcement={announcement}
// //               role={role}
// //               theme={theme}
// //               onDelete={onDelete}
// //               onToggleActive={onToggleActive}
// //               router={router}
// //             />
// //           ))
// //         ) : (
// //           <div className={`text-center py-12 ${
// //             theme === 'light' ? 'text-gray-500' : 'text-gray-400'
// //           }`}>
// //             <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
// //               theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
// //             }`}>
// //               {emptyIcon}
// //             </div>
// //             <p className="text-lg font-semibold">{emptyMessage}</p>
// //             <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>
// //               Check back later for updates
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default function AnnouncementsPage() {
// //   const { theme } = useTheme();
// //   const [role, setRole] = useState<string>('');
// //   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const router = useRouter();
// //   const [userId, setUserId] = useState<number>(0);

// //   // Load user information once when component mounts
// //   useEffect(() => { 
// //     const role = localStorage.getItem('hrms_role'); 
// //     if (role) {
// //       setRole(role);
// //     }

// //     const user = localStorage.getItem('hrms_user');
// //     if (user) {
// //       try {
// //         const userData = JSON.parse(user);
// //         if (userData && userData.id) {
// //           setUserId(userData.id);
// //         }
// //       } catch (error) {
// //         console.error('Error parsing user data:', error);
// //       }
// //     }
// //   }, []);

// //   const fetchAnnouncements = useCallback(async (): Promise<void> => {
// //     try {
// //       setLoading(true);
// //       const empId = role !== 'admin' && userId !== 0 ? userId : null;
      
// //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}${empId ? `?employee_id=${userId}` : ''}`);
      
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch announcements');
// //       }
      
// //       const data = await response.json();
      
// //       // Transform the announcement data
// //       const transformedAnnouncements = data.map((announcement: any) => ({
// //         ...announcement,
// //         is_posted: announcement.is_posted === 0 ? false : true,
// //         is_active: announcement.is_active === 0 ? false : true,
// //         target_all: announcement.target_all === 1 ? true : false,
// //         target_type: announcement.target_type,
// //         target_name: announcement.target_name,
// //         scheduled_at: announcement.scheduled_at
// //       }));
      
// //       // Fetch attachments for each announcement
// //       const announcementsWithAttachments = await Promise.all(
// //         transformedAnnouncements.map(async (announcement: Announcement) => {
// //           try {
// //             const attachmentsResponse = await fetch(`${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`);
// //             if (attachmentsResponse.ok) {
// //               const attachmentsData = await attachmentsResponse.json();
// //               return {
// //                 ...announcement,
// //                 attachments: attachmentsData.documents || []
// //               };
// //             }
// //             return announcement;
// //           } catch (error) {
// //             console.error(`Error fetching attachments for announcement ${announcement.id}:`, error);
// //             return announcement;
// //           }
// //         })
// //       );
      
// //       setAnnouncements(announcementsWithAttachments);
// //     } catch (error) {
// //       console.error('Error fetching announcements:', error);
// //       setError('Failed to load announcements. Please try again later.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [userId, role]);

// //   // Fetch announcements only when userId and role are available
// //   useEffect(() => {
// //     // Only fetch if we have userId (or we're admin)
// //     if (userId !== 0 || role === 'admin') {
// //       fetchAnnouncements();
// //     }
// //   }, [userId, role, fetchAnnouncements]);

// //   const handleDelete = async (id: string) => {
// //     if (window.confirm('Are you sure you want to delete this announcement?')) {
// //       try {
// //         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// //           method: 'DELETE',
// //         });

// //         if (!response.ok) {
// //           throw new Error('Failed to delete announcement');
// //         }

// //         // Remove announcement from state
// //         setAnnouncements(announcements.filter(announcement => announcement.id !== id));
// //       } catch (error) {
// //         console.error('Error deleting announcement:', error);
// //         setError('Failed to delete announcement. Please try again.');
// //       }
// //     }
// //   };

// //   const handleToggleActive = async (id: string, currentActive: boolean) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
// //         method: 'PATCH',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ is_active: !currentActive }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement`);
// //       }

// //       // Update announcement in state
// //       setAnnouncements(
// //         announcements.map(announcement => 
// //           announcement.id === id 
// //             ? { ...announcement, is_active: !currentActive } 
// //             : announcement
// //         )
// //       );
// //     } catch (error) {
// //       console.error('Error updating announcement status:', error);
// //       setError(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement. Please try again.`);
// //     }
// //   };

// //   // Helper function to check if scheduled date is in the future
// //   const isScheduledForFuture = (dateString?: string): boolean => {
// //     if (!dateString) return false;
// //     const scheduledDate = new Date(dateString);
// //     return scheduledDate > new Date();
// //   };

// //   // Separate announcements into upcoming and past (only for non-admin view)
// //   const now = new Date();
// //   const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

// //   const upcomingAnnouncements = announcements.filter(announcement => {
// //     // Include drafts and scheduled announcements for admin
// //     if (announcement.is_posted === false) {
// //       return role === 'admin';
// //     }
    
// //     // Include recent announcements (within 30 days) or scheduled for future
// //     const createdDate = new Date(announcement.created_at);
// //     const isRecent = createdDate > thirtyDaysAgo;
// //     const isScheduled = announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at);
    
// //     return isRecent || isScheduled;
// //   });

// //   const pastAnnouncements = announcements.filter(announcement => {
// //     // Only include published announcements
// //     if (announcement.is_posted === false) {
// //       return false;
// //     }
    
// //     // Include announcements older than 30 days and not scheduled for future
// //     const createdDate = new Date(announcement.created_at);
// //     const isOld = createdDate <= thirtyDaysAgo;
// //     const isNotScheduled = !announcement.scheduled_at || !isScheduledForFuture(announcement.scheduled_at);
    
// //     return isOld && isNotScheduled;
// //   });

// //   return (
// //     <div className={`min-h-screen p-6 ${
// //       theme === 'light' 
// //         ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
// //         : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// //     }`}>
// //       {/* Header */}
// //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
// //         <div>
// //           <h1 className={`text-4xl font-bold mb-2 ${
// //             theme === 'light' 
// //               ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' 
// //               : 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
// //           }`}>
// //             Announcements
// //           </h1>
// //           <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
// //             Stay updated with the latest news and updates
// //           </p>
// //         </div>
        
// //         {role === 'admin' && (
// //           <Link 
// //             href="/announcements/create" 
// //             className={`mt-4 lg:mt-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
// //               theme === 'light' 
// //                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
// //                 : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
// //             }`}
// //           >
// //             <FaPlus className="inline mr-2" /> Create Announcement
// //           </Link>
// //         )}
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className={`mb-6 p-4 rounded-xl border-l-4 backdrop-blur-sm ${
// //           theme === 'light' 
// //             ? 'bg-red-50/80 border-red-400 text-red-700' 
// //             : 'bg-red-900/20 border-red-500 text-red-300'
// //         }`}>
// //           <div className="flex items-center">
// //             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //             </svg>
// //             <span>{error}</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Loading State */}
// //       {loading ? (
// //         <div className="flex justify-center items-center py-20">
// //           <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${
// //             theme === 'light' ? 'border-blue-600' : 'border-blue-400'
// //           }`}></div>
// //         </div>
// //       ) : announcements.length === 0 ? (
// //         /* Empty State */
// //         <div className={`p-12 rounded-2xl text-center backdrop-blur-sm ${
// //           theme === 'light' ? 'bg-white/80 shadow-lg' : 'bg-slate-800/80 shadow-xl'
// //         }`}>
// //           <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
// //             theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
// //           }`}>
// //             <FaCalendarAlt className={`w-12 h-12 ${
// //               theme === 'light' ? 'text-blue-600' : 'text-blue-400'
// //             }`} />
// //           </div>
// //           <h3 className={`text-2xl font-bold mb-4 ${
// //             theme === 'light' ? 'text-gray-900' : 'text-gray-100'
// //           }`}>
// //             No announcements found
// //           </h3>
// //           {role === 'admin' && (
// //             <>
// //               <p className={`mb-6 text-lg ${
// //                 theme === 'light' ? 'text-gray-600' : 'text-gray-400'
// //               }`}>
// //                 Create your first announcement to notify your team
// //               </p>
// //               <Link 
// //                 href="/announcements/create" 
// //                 className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
// //                   theme === 'light' 
// //                     ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
// //                     : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
// //                 }`}
// //               >
// //                 <FaPlus className="mr-2" /> Create Announcement
// //               </Link>
// //             </>
// //           )}
// //         </div>
// //       ) : (
// //         /* Conditional Rendering: Admin Table View vs Non-Admin Card View */
// //         <>
// //           {role === 'admin' ? (
// //             /* Admin Table View */
// //             <AdminTableView
// //               announcements={announcements}
// //               theme={theme}
// //               onDelete={handleDelete}
// //               onToggleActive={handleToggleActive}
// //               router={router}
// //             />
// //           ) : (
// //             /* Non-Admin Side-by-Side Vertical Layout */
// //             <div className="flex flex-col xl:flex-row gap-6 h-full">
// //               <VerticalScrollableSection
// //                 title="Upcoming & Recent"
// //                 icon={<FaBell className="w-5 h-5" />}
// //                 announcements={upcomingAnnouncements}
// //                 role={role}
// //                 theme={theme}
// //                 onDelete={handleDelete}
// //                 onToggleActive={handleToggleActive}
// //                 router={router}
// //                 emptyMessage="No upcoming announcements"
// //                 emptyIcon={<FaBell className="w-10 h-10" />}
// //                 accentColor="from-blue-500 to-indigo-600"
// //               />
              
// //               <VerticalScrollableSection
// //                 title="Past Announcements"
// //                 icon={<FaHistory className="w-5 h-5" />}
// //                 announcements={pastAnnouncements}
// //                 role={role}
// //                 theme={theme}
// //                 onDelete={handleDelete}
// //                 onToggleActive={handleToggleActive}
// //                 router={router}
// //                 emptyMessage="No past announcements"
// //                 emptyIcon={<FaHistory className="w-10 h-10" />}
// //                 accentColor="from-slate-500 to-gray-600"
// //               />
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   FaPlus, 
//   FaEdit, 
//   FaTrash, 
//   FaChevronDown, 
//   FaChevronUp, 
//   FaArrowUp,
//   FaArrowDown,
//   FaClock,
//   FaCalendarAlt,
//   FaPaperclip,
//   FaEye,
//   FaEyeSlash,
//   FaBell,
//   FaHistory,
//   FaGlobe,
//   FaBuilding,
//   FaUsers,
//   FaUser,
//   FaSearch,
//   FaFilter,
//   FaSort,
//   FaSortUp,  
//   FaSortDown,
//   FaCaretDown
// } from 'react-icons/fa';
// import { API_BASE_URL, API_ROUTES } from '../config';
// import { toZonedTime } from 'date-fns-tz';
// import { format } from 'date-fns';
// import { useTheme } from '../components/ThemeProvider';

// /* ======================= Slate rendering helpers ======================= */

// type SlateNode = any;
// type SlateArray = SlateNode[];

// function tryParseJson(input: unknown): unknown {
//   if (typeof input !== 'string') return input;
//   const s = input.trim();
//   if (!s.startsWith('[') && !s.startsWith('{')) return input;
//   try {
//     return JSON.parse(s);
//   } catch {
//     return input;
//   }
// }

// function isSlateArray(val: unknown): val is SlateArray {
//   return Array.isArray(val) && val.every((n) => typeof n === 'object' && n && 'children' in n);
// }

// function slateToPlainText(nodes: SlateArray): string {
//   const out: string[] = [];
//   const walk = (n: SlateNode) => {
//     if (!n) return;
//     if (typeof n.text === 'string') out.push(n.text);
//     if (Array.isArray(n.children)) n.children.forEach(walk);
//   };
//   nodes.forEach(walk);
//   return out.join('');
// }

// function renderLeaf(leaf: any, key: number): React.ReactNode {
//   let content: React.ReactNode = leaf.text ?? '';

//   if (leaf.bold) content = <strong key={`b-${key}`}>{content}</strong>;
//   if (leaf.italic) content = <em key={`i-${key}`}>{content}</em>;
//   if (leaf.underline) content = <u key={`u-${key}`}>{content}</u>;
//   if (leaf.code) content = <code key={`c-${key}`} className="px-1 rounded bg-gray-100 dark:bg-slate-700">{content}</code>;
//   if (leaf.strikethrough) content = <s key={`s-${key}`}>{content}</s>;

//   return <React.Fragment key={key}>{content}</React.Fragment>;
// }

// function renderChildren(children: any[]): React.ReactNode {
//   return children.map((ch, i) => {
//     if (typeof ch?.text === 'string') return renderLeaf(ch, i);
//     if (Array.isArray(ch?.children)) return renderElement(ch, i);
//     return <React.Fragment key={i} />;
//   });
// }

// function renderElement(node: any, key: number): React.ReactNode {
//   const { type, children } = node || {};
//   const kids = Array.isArray(children) ? children : [];

//   switch (type) {
//     case 'heading-one':
//       return <h1 key={key} className="text-2xl font-bold mb-2">{renderChildren(kids)}</h1>;
//     case 'heading-two':
//       return <h2 key={key} className="text-xl font-semibold mb-2">{renderChildren(kids)}</h2>;
//     case 'heading-three':
//       return <h3 key={key} className="text-lg font-semibold mb-2">{renderChildren(kids)}</h3>;
//     case 'block-quote':
//       return (
//         <blockquote key={key} className="border-l-4 pl-3 italic my-2 border-gray-300 dark:border-slate-600">
//           {renderChildren(kids)}
//         </blockquote>
//       );
//     case 'bulleted-list':
//       return <ul key={key} className="list-disc ml-6 my-2">{renderChildren(kids)}</ul>;
//     case 'numbered-list':
//       return <ol key={key} className="list-decimal ml-6 my-2">{renderChildren(kids)}</ol>;
//     case 'list-item':
//       return <li key={key}>{renderChildren(kids)}</li>;
//     case 'link':
//       return (
//         <a key={key} href={node.url || '#'} className="text-blue-600 dark:text-blue-400 underline">
//           {renderChildren(kids)}
//         </a>
//       );
//     case 'paragraph':
//     default:
//       return <p key={key} className="mb-2 whitespace-pre-wrap">{renderChildren(kids)}</p>;
//   }
// }

// function RichText({ content, className }: { content: unknown; className?: string }) {
//   const parsed = tryParseJson(content);
//   if (isSlateArray(parsed)) {
//     return <div className={className}>{parsed.map((n, i) => renderElement(n, i))}</div>;
//   }
//   return <div className={className}>{typeof content === 'string' ? content : ''}</div>;
// }

// function getPlainTextFromContent(content: unknown): string {
//   const parsed = tryParseJson(content);
//   if (isSlateArray(parsed)) return slateToPlainText(parsed);
//   return typeof parsed === 'string' ? parsed : '';
// }

// /* ======================= Existing file contents ======================= */

// // Singapore timezone
// const timeZone = 'Asia/Singapore';

// // Function to convert date to Singapore timezone
// const toSingaporeTime = (date: Date): Date => {
//   return toZonedTime(date, timeZone);
// };

// interface Announcement {
//   id: string;
//   title: string;
//   content: unknown;         // updated to support Slate JSON
//   content_text?: string;    // optional precomputed plain text
//   created_at: string;
//   target_type: 'company' | 'department' | 'position' | 'employee' | 'all';
//   target_name?: string;
//   is_active?: boolean;
//   is_posted?: boolean;
//   target_all?: boolean;
//   scheduled_at?: string;
//   attachments?: {
//     id: number;
//     original_filename: string;
//     file_size: number;
//     content_type: string;
//     download_url: string;
//     uploaded_at: string;
//   }[];
// }

// // Custom vertical scroll hook
// const useVerticalScroll = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollUp, setCanScrollUp] = useState(false);
//   const [canScrollDown, setCanScrollDown] = useState(false);

//   const checkScrollability = useCallback(() => {
//     if (scrollRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
//       setCanScrollUp(scrollTop > 0);
//       setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
//     }
//   }, []);

//   const scrollUp = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ top: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollDown = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     const element = scrollRef.current;
//     if (element) {
//       checkScrollability();
//       element.addEventListener('scroll', checkScrollability);
//       window.addEventListener('resize', checkScrollability);
      
//       return () => {
//         element.removeEventListener('scroll', checkScrollability);
//         window.removeEventListener('resize', checkScrollability);
//       };
//     }
//   }, [checkScrollability]);

//   return { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability };
// };

// // Admin Table View Component with New Filtering UI
// const AdminTableView = ({ 
//   announcements, 
//   theme, 
//   onDelete, 
//   onToggleActive, 
//   router 
// }: {
//   announcements: Announcement[];
//   theme: string;
//   onDelete: (id: string) => void;
//   onToggleActive: (id: string, currentActive: boolean) => void;
//   router: any;
// }) => {
//   const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     status: '',
//     targetType: '',
//     hasAttachments: '',
//     isScheduled: '',
//     createdDateFrom: '',
//     createdDateTo: '',
//     publishedDateFrom: '',
//     publishedDateTo: ''
//   });
//   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     let filtered = [...announcements];

//     // Apply search filter (now uses plain text extraction)
//     if (searchTerm) {
//       const q = searchTerm.toLowerCase();
//       filtered = filtered.filter((announcement) => {
//         const text = (announcement.content_text ?? getPlainTextFromContent(announcement.content)).toLowerCase();
//         return (
//           announcement.title.toLowerCase().includes(q) ||
//           text.includes(q) ||
//           (announcement.target_name && announcement.target_name.toLowerCase().includes(q))
//         );
//       });
//     }

//     // Apply advanced filters
//     if (filters.status) {
//       if (filters.status === 'active') {
//         filtered = filtered.filter(announcement => announcement.is_active === true);
//       } else if (filters.status === 'inactive') {
//         filtered = filtered.filter(announcement => announcement.is_active === false);
//       } else if (filters.status === 'posted') {
//         filtered = filtered.filter(announcement => announcement.is_posted === true);
//       } else if (filters.status === 'draft') {
//         filtered = filtered.filter(announcement => announcement.is_posted === false);
//       }
//     }

//     if (filters.targetType) {
//       filtered = filtered.filter(announcement => 
//         announcement.target_type === filters.targetType
//       );
//     }

//     if (filters.hasAttachments) {
//       if (filters.hasAttachments === 'yes') {
//         filtered = filtered.filter(announcement => 
//           announcement.attachments && announcement.attachments.length > 0
//         );
//       } else if (filters.hasAttachments === 'no') {
//         filtered = filtered.filter(announcement => 
//           !announcement.attachments || announcement.attachments.length === 0
//         );
//       }
//     }

//     if (filters.isScheduled) {
//       if (filters.isScheduled === 'scheduled') {
//         filtered = filtered.filter(announcement => announcement.scheduled_at);
//       } else if (filters.isScheduled === 'immediate') {
//         filtered = filtered.filter(announcement => !announcement.scheduled_at);
//       }
//     }

//     // Filter by created date range
//     if (filters.createdDateFrom) {
//       const fromDate = new Date(filters.createdDateFrom);
//       filtered = filtered.filter(announcement => 
//         new Date(announcement.created_at) >= fromDate
//       );
//     }

//     if (filters.createdDateTo) {
//       const toDate = new Date(filters.createdDateTo);
//       toDate.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(announcement => 
//         new Date(announcement.created_at) <= toDate
//       );
//     }

//     // Filter by published date range
//     if (filters.publishedDateFrom) {
//       const fromDate = new Date(filters.publishedDateFrom);
//       filtered = filtered.filter(announcement => {
//         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
//         return publishedDate >= fromDate;
//       });
//     }

//     if (filters.publishedDateTo) {
//       const toDate = new Date(filters.publishedDateTo);
//       toDate.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(announcement => {
//         const publishedDate = new Date(announcement.scheduled_at || announcement.created_at);
//         return publishedDate <= toDate;
//       });
//     }

//     // Apply sorting
//     if (sortConfig) {
//       filtered.sort((a, b) => {
//         let aValue = '';
//         let bValue = '';

//         switch (sortConfig.key) {
//           case 'created_at':
//             aValue = a.created_at;
//             bValue = b.created_at;
//             break;
//           case 'published_at':
//             aValue = a.scheduled_at || a.created_at;
//             bValue = b.scheduled_at || b.created_at;
//             break;
//           case 'type':
//             aValue = a.target_type;
//             bValue = b.target_type;
//             break;
//           case 'title':
//             aValue = a.title;
//             bValue = b.title;
//             break;
//         }

//         if (sortConfig.direction === 'asc') {
//           return aValue.localeCompare(bValue);
//         } else {
//           return bValue.localeCompare(aValue);
//         }
//       });
//     }

//     setFilteredAnnouncements(filtered);
//     setCurrentPage(1);
//   }, [announcements, searchTerm, filters, sortConfig]);

//   const handleSort = (key: string) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (columnKey: string) => {
//     if (!sortConfig || sortConfig.key !== columnKey) {
//       return <FaSort className="w-3 h-3 opacity-50" />;
//     }
//     return sortConfig.direction === 'asc' ? 
//       <FaSortUp className="w-3 h-3 text-blue-500" /> : 
//       <FaSortDown className="w-3 h-3 text-blue-500" />;
//   };

//   const formatDateTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }) + ' ' + date.toLocaleTimeString('en-GB', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilters({
//       status: '',
//       targetType: '',
//       hasAttachments: '',
//       isScheduled: '',
//       createdDateFrom: '',
//       createdDateTo: '',
//       publishedDateFrom: '',
//       publishedDateTo: ''
//     });
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
//       theme === 'light' 
//         ? 'bg-white/90 border-gray-200' 
//         : 'bg-slate-800/90 border-slate-700'
//     }`}>
//       <div className={`p-6 border-b ${
//         theme === 'light' ? 'border-gray-200' : 'border-slate-700'
//       }`}>
//         <div className="flex gap-4 mb-4">
//           <div className="flex-1 relative">
//             <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
//               theme === 'light' ? 'text-gray-400' : 'text-gray-500'
//             }`} />
//             <input
//               type="text"
//               placeholder="Search by title, content, author..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
//                 theme === 'light'
//                   ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
//                   : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
//               }`}
//             />
//           </div>
//           <button
//             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//             className={`px-6 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
//               theme === 'light'
//                 ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                 : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600'
//             }`}
//           >
//             <FaFilter className="w-4 h-4" />
//             Filters
//           </button>
//         </div>

//         {showAdvancedFilters && (
//           <div className={`p-6 rounded-lg border mb-4 ${
//             theme === 'light' 
//               ? 'bg-gray-50 border-gray-200' 
//               : 'bg-slate-700/50 border-slate-600'
//           }`}>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className={`text-lg font-semibold ${
//                 theme === 'light' ? 'text-gray-900' : 'text-white'
//               }`}>
//                 Advanced Filters
//               </h3>
//               <button
//                 onClick={resetFilters}
//                 className={`text-sm font-medium transition-colors ${
//                   theme === 'light' 
//                     ? 'text-blue-600 hover:text-blue-800' 
//                     : 'text-blue-400 hover:text-blue-300'
//                 }`}
//               >
//                 Reset Filters
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Status */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Status
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={filters.status}
//                     onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
//                       theme === 'light'
//                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                     }`}
//                   >
//                     <option value="">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="posted">Posted</option>
//                     <option value="draft">Draft</option>
//                   </select>
//                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
//                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
//                   }`} />
//                 </div>
//               </div>

//               {/* Target Type */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Target Type
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={filters.targetType}
//                     onChange={(e) => setFilters(prev => ({ ...prev, targetType: e.target.value }))}
//                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
//                       theme === 'light'
//                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                     }`}
//                   >
//                     <option value="">All Types</option>
//                     <option value="all">All</option>
//                     <option value="company">Company</option>
//                     <option value="department">Department</option>
//                     <option value="position">Position</option>
//                     <option value="employee">Employee</option>
//                   </select>
//                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
//                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
//                   }`} />
//                 </div>
//               </div>

//               {/* Attachments */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Attachments
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={filters.hasAttachments}
//                     onChange={(e) => setFilters(prev => ({ ...prev, hasAttachments: e.target.value }))}
//                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
//                       theme === 'light'
//                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                     }`}
//                   >
//                     <option value="">All</option>
//                     <option value="yes">Has Attachments</option>
//                     <option value="no">No Attachments</option>
//                   </select>
//                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
//                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
//                   }`} />
//                 </div>
//               </div>

//               {/* Scheduling */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Scheduling
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={filters.isScheduled}
//                     onChange={(e) => setFilters(prev => ({ ...prev, isScheduled: e.target.value }))}
//                     className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
//                       theme === 'light'
//                         ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                         : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                     }`}
//                   >
//                     <option value="">All</option>
//                     <option value="scheduled">Scheduled</option>
//                     <option value="immediate">Immediate</option>
//                   </select>
//                   <FaCaretDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
//                     theme === 'light' ? 'text-gray-400' : 'text-gray-500'
//                   }`} />
//                 </div>
//               </div>

//               {/* Created From */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Created From
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.createdDateFrom}
//                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateFrom: e.target.value }))}
//                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
//                     theme === 'light'
//                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                   }`}
//                 />
//               </div>

//               {/* Created To */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Created To
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.createdDateTo}
//                   onChange={(e) => setFilters(prev => ({ ...prev, createdDateTo: e.target.value }))}
//                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
//                     theme === 'light'
//                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                   }`}
//                 />
//               </div>

//               {/* Published From */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Published From
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.publishedDateFrom}
//                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateFrom: e.target.value }))}
//                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
//                     theme === 'light'
//                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                   }`}
//                 />
//               </div>

//               {/* Published To */}
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${
//                   theme === 'light' ? 'text-gray-700' : 'text-gray-300'
//                 }`}>
//                   Published To
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.publishedDateTo}
//                   onChange={(e) => setFilters(prev => ({ ...prev, publishedDateTo: e.target.value }))}
//                   className={`w-full px-3 py-2 rounded-lg border transition-colors ${
//                     theme === 'light'
//                       ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
//                       : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
//                   }`}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
//           {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'}`}>
//             <tr>
//               <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
//                 Action
//               </th>
//               <th 
//                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
//                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
//                 }`}
//                 onClick={() => handleSort('created_at')}
//               >
//                 <div className="flex items-center gap-2">
//                   Created At
//                   {getSortIcon('created_at')}
//                 </div>
//               </th>
//               <th 
//                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
//                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
//                 }`}
//                 onClick={() => handleSort('published_at')}
//               >
//                 <div className="flex items-center gap-2">
//                   Published At
//                   {getSortIcon('published_at')}
//                 </div>
//               </th>
//               <th 
//                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
//                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
//                 }`}
//                 onClick={() => handleSort('type')}
//               >
//                 <div className="flex items-center gap-2">
//                   Type
//                   {getSortIcon('type')}
//                 </div>
//               </th>
//               <th 
//                 className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
//                   theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
//                 }`}
//                 onClick={() => handleSort('title')}
//               >
//                 <div className="flex items-center gap-2">
//                   Title
//                   {getSortIcon('title')}
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'}`}>
//             {currentAnnouncements.map((announcement) => (
//               <tr key={announcement.id} className={`hover:bg-opacity-50 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}`}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
//                       className={`p-2 rounded-lg transition-colors ${
//                         theme === 'light'
//                           ? 'text-blue-600 hover:bg-blue-100'
//                           : 'text-blue-400 hover:bg-blue-900/30'
//                       }`}
//                       title="Edit"
//                     >
//                       <FaEdit className="w-4 h-4" />
//                     </button>
//                     <button 
//                       onClick={() => onDelete(announcement.id)}
//                       className={`p-2 rounded-lg transition-colors ${
//                         theme === 'light'
//                           ? 'text-red-600 hover:bg-red-100'
//                           : 'text-red-400 hover:bg-red-900/30'
//                       }`}
//                       title="Delete"
//                     >
//                       <FaTrash className="w-4 h-4" />
//                     </button>
//                     <button 
//                       onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
//                       className={`p-2 rounded-lg transition-colors ${
//                         announcement.is_active === false
//                           ? theme === 'light'
//                             ? 'text-green-600 hover:bg-green-100'
//                             : 'text-green-400 hover:bg-green-900/30'
//                           : theme === 'light'
//                             ? 'text-gray-600 hover:bg-gray-100'
//                             : 'text-gray-400 hover:bg-gray-700'
//                       }`}
//                       title={announcement.is_active === false ? "Activate" : "Deactivate"}
//                     >
//                       {announcement.is_active === false ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
//                     </button>
//                   </div>
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                   {formatDateTime(announcement.created_at)}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                   {formatDateTime(announcement.scheduled_at || announcement.created_at)}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     announcement.target_type === 'all'
//                       ? theme === 'light'
//                         ? 'bg-purple-100 text-purple-800'
//                         : 'bg-purple-900/30 text-purple-300'
//                       : announcement.target_type === 'company'
//                         ? theme === 'light'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-blue-900/30 text-blue-300'
//                         : announcement.target_type === 'department'
//                           ? theme === 'light'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-green-900/30 text-green-300'
//                           : theme === 'light'
//                             ? 'bg-orange-100 text-orange-800'
//                             : 'bg-orange-900/30 text-orange-300'
//                   }`}>
//                     {announcement.target_type}
//                   </span>
//                 </td>
//                 <td className={`px-6 py-4 text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                   <div className="max-w-xs">
//                     <div className="font-medium truncate">{announcement.title}</div>
//                     {announcement.is_posted === false && (
//                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${
//                         theme === 'light' 
//                           ? 'bg-amber-100 text-amber-700' 
//                           : 'bg-amber-900/30 text-amber-300'
//                       }`}>
//                         Draft
//                       </span>
//                     )}
//                     {announcement.is_active === false && (
//                       <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 ml-2 inline-block ${
//                         theme === 'light' 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-red-900/30 text-red-300'
//                       }`}>
//                         Inactive
//                       </span>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className={`px-6 py-4 border-t flex items-center justify-between ${
//           theme === 'light' ? 'border-gray-200' : 'border-slate-700'
//         }`}>
//           <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
//             Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length} results
//           </div>
//           <div className="flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => goToPage(page)}
//                 className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
//                   currentPage === page
//                     ? theme === 'light'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-blue-500 text-white'
//                     : theme === 'light'
//                       ? 'text-gray-600 hover:bg-gray-100'
//                       : 'text-gray-400 hover:bg-slate-700'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Compact Announcement Card Component for vertical layout (non-admin view)
// const CompactAnnouncementCard = ({ 
//   announcement, 
//   role, 
//   theme, 
//   onDelete, 
//   onToggleActive, 
//   router 
// }: {
//   announcement: Announcement;
//   role: string;
//   theme: string;
//   onDelete: (id: string) => void;
//   onToggleActive: (id: string, currentActive: boolean) => void;
//   router: any;
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const getTargetInfo = (announcement: Announcement) => {
//     const icons = {
//       company: <FaBuilding className="w-3 h-3" />,
//       department: <FaUsers className="w-3 h-3" />,
//       position: <FaUser className="w-3 h-3" />,
//       employee: <FaUser className="w-3 h-3" />,
//       all: <FaGlobe className="w-3 h-3" />
//     };

//     const names = {
//       company: 'Company',
//       department: 'Department',
//       position: 'Position',
//       employee: 'Employee',
//       all: 'Global'
//     };

//     return {
//       icon: (icons as any)[announcement.target_type] || (icons as any).all,
//       name: (names as any)[announcement.target_type] || (names as any).all
//     };
//   };

//   const isLongContent = (content: unknown): boolean => {
//     return getPlainTextFromContent(content).split(/\s+/).filter(Boolean).length > 25;
//   };

//   const getPreviewContent = (content: unknown): string => {
//     const words = getPlainTextFromContent(content).split(/\s+/).filter(Boolean);
//     return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : words.join(' ');
//   };

//   const isScheduledForFuture = (dateString?: string): boolean => {
//     if (!dateString) return false;
//     const scheduledDate = new Date(dateString);
//     return scheduledDate > new Date();
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = () => {
//     if (announcement.is_active === false) return 'from-red-500 to-red-600';
//     if (announcement.is_posted === false) return 'from-amber-500 to-orange-600';
//     return 'from-blue-500 to-indigo-600';
//   };

//   const targetInfo = getTargetInfo(announcement);

//   return (
//     <div className={`
//       mb-3 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] group
//       ${theme === 'light' 
//         ? 'bg-white border-gray-200 hover:border-blue-300' 
//         : 'bg-slate-800 border-slate-700 hover:border-blue-500'
//       }
//     `}>
//       {/* Compact Header */}
//       <div className={`p-4 rounded-t-xl bg-gradient-to-r ${getStatusColor()} text-white relative overflow-hidden`}>
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-white/20"></div>
//           <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/10"></div>
//         </div>
        
//         <div className="relative z-10">
//           <div className="flex items-start justify-between mb-3">
//             <h3 className="font-semibold text-sm leading-tight flex-1 mr-3 line-clamp-2">
//               {announcement.title}
//             </h3>
//             <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
//               {announcement.is_posted === false && announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) ? (
//                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
//                   SCHEDULED
//                 </span>
//               ) : announcement.is_posted === false ? (
//                 <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
//                   DRAFT
//                 </span>
//               ) : null}
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between text-xs">
//             <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
//               {targetInfo.icon}
//               <span className="font-medium">{targetInfo.name}</span>
//             </div>
//             <div className="flex items-center gap-2 text-white/90">
//               <FaCalendarAlt className="w-3 h-3" />
//               <span className="font-medium">{formatDate(announcement.created_at)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Compact Body */}
//       <div className="p-4">
//         <div className="mb-4">
//           <div className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
//             {isLongContent(announcement.content) && !isExpanded ? (
//               <>
//                 <div className="whitespace-pre-wrap mb-2">
//                   {getPreviewContent(announcement.content)}
//                 </div>
//                 <button 
//                   onClick={() => setIsExpanded(true)}
//                   className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
//                     theme === 'light' 
//                       ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
//                       : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
//                   }`}
//                 >
//                   Read more <FaChevronDown className="w-2 h-2" />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="mb-2">
//                   <RichText content={announcement.content} className="whitespace-pre-wrap" />
//                 </div>
//                 {isLongContent(announcement.content) && (
//                   <button 
//                     onClick={() => setIsExpanded(false)}
//                     className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
//                       theme === 'light' 
//                         ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
//                         : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
//                     }`}
//                   >
//                     Show less <FaChevronUp className="w-2 h-2" />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Attachments */}
//         {announcement.attachments && announcement.attachments.length > 0 && (
//           <div className="mb-4">
//             <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
//               theme === 'light' 
//                 ? 'text-blue-600 bg-blue-50 border border-blue-200' 
//                 : 'text-blue-400 bg-blue-900/30 border border-blue-700'
//             }`}>
//               <FaPaperclip className="w-3 h-3" />
//               <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
//             </div>
//           </div>
//         )}

//         {/* Status and Actions */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
//           <div className="flex items-center gap-2">
//             {announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) && !announcement.is_posted && (
//               <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
//                 theme === 'light' 
//                   ? 'text-blue-600 bg-blue-50 border border-blue-200' 
//                   : 'text-blue-400 bg-blue-900/30 border border-blue-700'
//               }`}>
//                 <FaClock className="w-3 h-3" />
//                 <span className="font-medium">{format(toSingaporeTime(new Date(announcement.scheduled_at)) as Date, 'dd/MM')}</span>
//               </div>
//             )}
//             {announcement.is_active === false && (
//               <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
//                 theme === 'light' 
//                   ? 'bg-amber-100 text-amber-700 border border-amber-200' 
//                   : 'bg-amber-900/30 text-amber-300 border border-amber-700'
//               }`}>
//                 Inactive
//               </span>
//             )}
//           </div>

//           {/* Admin Actions */}
//           {role === 'admin' && (
//             <div className="flex gap-1">
//               {announcement.is_posted !== false && (
//                 <button 
//                   onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
//                   className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
//                     announcement.is_active === false
//                       ? theme === 'light'
//                         ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
//                         : 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
//                       : theme === 'light'
//                         ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                         : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
//                   }`}
//                   title={announcement.is_active === false ? "Activate" : "Deactivate"}
//                 >
//                   {announcement.is_active === false ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
//                 </button>
//               )}
//               <button 
//                 onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
//                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
//                   theme === 'light'
//                     ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
//                     : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-700'
//                 }`}
//                 title="Edit"
//               >
//                 <FaEdit className="w-3 h-3" />
//               </button>
//               <button 
//                 onClick={() => onDelete(announcement.id)}
//                 className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
//                   theme === 'light'
//                     ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                     : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
//                 }`}
//                 title="Delete"
//               >
//                 <FaTrash className="w-3 h-3" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Vertical Scrollable Section Component
// const VerticalScrollableSection = ({ 
//   title, 
//   icon,
//   announcements, 
//   role, 
//   theme, 
//   onDelete, 
//   onToggleActive, 
//   router,
//   emptyMessage,
//   emptyIcon,
//   accentColor
// }: {
//   title: string;
//   icon: React.ReactNode;
//   announcements: Announcement[];
//   role: string;
//   theme: string;
//   onDelete: (id: string) => void;
//   onToggleActive: (id: string, currentActive: boolean) => void;
//   router: any;
//   emptyMessage: string;
//   emptyIcon: React.ReactNode;
//   accentColor: string;
// }) => {
//   const { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability } = useVerticalScroll();

//   useEffect(() => {
//     checkScrollability();
//   }, [announcements, checkScrollability]);

//   return (
//     <div className="flex-1 flex flex-col min-h-0">
//       {/* Section Header */}
//       <div className={`
//         p-6 rounded-t-2xl border-b bg-gradient-to-r ${accentColor} text-white relative overflow-hidden
//         ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}
//       `}>
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/20"></div>
//           <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10"></div>
//         </div>
        
//         <div className="relative z-10 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
//               {icon}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{title}</h2>
//               <p className="text-white/80 text-sm">
//                 {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
//               </p>
//             </div>
//           </div>
          
//           {(canScrollUp || canScrollDown) && (
//             <div className="flex flex-col gap-1">
//               <button
//                 onClick={scrollUp}
//                 disabled={!canScrollUp}
//                 className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
//                   canScrollUp 
//                     ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
//                     : 'bg-white/10 text-white/40 cursor-not-allowed'
//                 }`}
//                 title="Scroll up"
//               >
//                 <FaArrowUp className="w-3 h-3" />
//               </button>
//               <button
//                 onClick={scrollDown}
//                 disabled={!canScrollDown}
//                 className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
//                   canScrollDown 
//                     ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
//                     : 'bg-white/10 text-white/40 cursor-not-allowed'
//                 }`}
//                 title="Scroll down"
//               >
//                 <FaArrowDown className="w-3 h-3" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div 
//         ref={scrollRef}
//         className={`
//           flex-1 overflow-y-auto p-6 rounded-b-2xl border border-t-0 backdrop-blur-sm
//           ${theme === 'light' 
//             ? 'bg-white/90 border-gray-200' 
//             : 'bg-slate-800/90 border-slate-700'
//           }
//         `}
//         style={{ maxHeight: 'calc(100vh - 300px)' }}
//       >
//         {announcements.length > 0 ? (
//           announcements.map((announcement) => (
//             <CompactAnnouncementCard
//               key={announcement.id}
//               announcement={announcement}
//               role={role}
//               theme={theme}
//               onDelete={onDelete}
//               onToggleActive={onToggleActive}
//               router={router}
//             />
//           ))
//         ) : (
//           <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
//             <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
//               theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
//             }`}>
//               {emptyIcon}
//             </div>
//             <p className="text-lg font-semibold">{emptyMessage}</p>
//             <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>
//               Check back later for updates
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default function AnnouncementsPage() {
//   const { theme } = useTheme();
//   const [role, setRole] = useState<string>('');
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const [userId, setUserId] = useState<number>(0);

//   // Load user information once when component mounts
//   useEffect(() => { 
//     const role = localStorage.getItem('hrms_role'); 
//     if (role) {
//       setRole(role);
//     }

//     const user = localStorage.getItem('hrms_user');
//     if (user) {
//       try {
//         const userData = JSON.parse(user);
//         if (userData && userData.id) {
//           setUserId(userData.id);
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//       }
//     }
//   }, []);

//   const fetchAnnouncements = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true);
//       const empId = role !== 'admin' && userId !== 0 ? userId : null;
      
//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}${empId ? `?employee_id=${userId}` : ''}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch announcements');
//       }
      
//       const data = await response.json();
      
//       // Transform the announcement data: normalize booleans, parse Slate content, and precompute plain text
//       const transformedAnnouncements: Announcement[] = data.map((a: any) => {
//         const parsedContent = tryParseJson(a.content);
//         const content_text = isSlateArray(parsedContent)
//           ? slateToPlainText(parsedContent)
//           : typeof parsedContent === 'string'
//             ? parsedContent
//             : '';

//         return {
//           ...a,
//           content: parsedContent,
//           content_text,
//           is_posted: a.is_posted === 0 ? false : true,
//           is_active: a.is_active === 0 ? false : true,
//           target_all: a.target_all === 1 ? true : false,
//           target_type: a.target_type,
//           target_name: a.target_name,
//           scheduled_at: a.scheduled_at
//         } as Announcement;
//       });
      
//       // Fetch attachments for each announcement
//       const announcementsWithAttachments = await Promise.all(
//         transformedAnnouncements.map(async (announcement: Announcement) => {
//           try {
//             const attachmentsResponse = await fetch(`${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`);
//             if (attachmentsResponse.ok) {
//               const attachmentsData = await attachmentsResponse.json();
//               return {
//                 ...announcement,
//                 attachments: attachmentsData.documents || []
//               };
//             }
//             return announcement;
//           } catch (error) {
//             console.error(`Error fetching attachments for announcement ${announcement.id}:`, error);
//             return announcement;
//           }
//         })
//       );
      
//       setAnnouncements(announcementsWithAttachments);
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//       setError('Failed to load announcements. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, role]);

//   // Fetch announcements only when userId and role are available
//   useEffect(() => {
//     if (userId !== 0 || role === 'admin') {
//       fetchAnnouncements();
//     }
//   }, [userId, role, fetchAnnouncements]);

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       try {
//         const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
//           method: 'DELETE',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete announcement');
//         }

//         setAnnouncements(announcements.filter(announcement => announcement.id !== id));
//       } catch (error) {
//         console.error('Error deleting announcement:', error);
//         setError('Failed to delete announcement. Please try again.');
//       }
//     }
//   };

//   const handleToggleActive = async (id: string, currentActive: boolean) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ is_active: !currentActive }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement`);
//       }

//       setAnnouncements(
//         announcements.map(announcement => 
//           announcement.id === id 
//             ? { ...announcement, is_active: !currentActive } 
//             : announcement
//         )
//       );
//     } catch (error) {
//       console.error('Error updating announcement status:', error);
//       setError(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement. Please try again.`);
//     }
//   };

//   const isScheduledForFuture = (dateString?: string): boolean => {
//     if (!dateString) return false;
//     const scheduledDate = new Date(dateString);
//     return scheduledDate > new Date();
//   };

//   const now = new Date();
//   const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

//   const upcomingAnnouncements = announcements.filter(announcement => {
//     if (announcement.is_posted === false) {
//       return role === 'admin';
//     }
//     const createdDate = new Date(announcement.created_at);
//     const isRecent = createdDate > thirtyDaysAgo;
//     const isScheduled = announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at);
//     return isRecent || isScheduled;
//   });

//   const pastAnnouncements = announcements.filter(announcement => {
//     if (announcement.is_posted === false) {
//       return false;
//     }
//     const createdDate = new Date(announcement.created_at);
//     const isOld = createdDate <= thirtyDaysAgo;
//     const isNotScheduled = !announcement.scheduled_at || !isScheduledForFuture(announcement.scheduled_at);
//     return isOld && isNotScheduled;
//   });

//   return (
//     <div className={`min-h-screen p-6 ${
//       theme === 'light' 
//         ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
//         : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
//     }`}>
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
//         <div>
//           <h1 className={`text-4xl font-bold mb-2 ${
//             theme === 'light' 
//               ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' 
//               : 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
//           }`}>
//             Announcements
//           </h1>
//           <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
//             Stay updated with the latest news and updates
//           </p>
//         </div>
        
//         {role === 'admin' && (
//           <Link 
//             href="/announcements/create" 
//             className={`mt-4 lg:mt-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
//               theme === 'light' 
//                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
//                 : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
//             }`}
//           >
//             <FaPlus className="inline mr-2" /> Create Announcement
//           </Link>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className={`mb-6 p-4 rounded-xl border-l-4 backdrop-blur-sm ${
//           theme === 'light' 
//             ? 'bg-red-50/80 border-red-400 text-red-700' 
//             : 'bg-red-900/20 border-red-500 text-red-300'
//         }`}>
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span>{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Loading / Empty / Content */}
//       {loading ? (
//         <div className="flex justify-center items-center py-20">
//           <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${
//             theme === 'light' ? 'border-blue-600' : 'border-blue-400'
//           }`}></div>
//         </div>
//       ) : announcements.length === 0 ? (
//         <div className={`p-12 rounded-2xl text-center backdrop-blur-sm ${
//           theme === 'light' ? 'bg-white/80 shadow-lg' : 'bg-slate-800/80 shadow-xl'
//         }`}>
//           <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
//             theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
//           }`}>
//             <FaCalendarAlt className={`w-12 h-12 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
//           </div>
//           <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
//             No announcements found
//           </h3>
//           {role === 'admin' && (
//             <>
//               <p className={`mb-6 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
//                 Create your first announcement to notify your team
//               </p>
//               <Link 
//                 href="/announcements/create" 
//                 className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
//                   theme === 'light' 
//                     ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
//                     : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
//                 }`}
//               >
//                 <FaPlus className="mr-2" /> Create Announcement
//               </Link>
//             </>
//           )}
//         </div>
//       ) : (
//         <>
//           {role === 'admin' ? (
//             <AdminTableView
//               announcements={announcements}
//               theme={theme}
//               onDelete={handleDelete}
//               onToggleActive={handleToggleActive}
//               router={router}
//             />
//           ) : (
//             <div className="flex flex-col xl:flex-row gap-6 h-full">
//               <VerticalScrollableSection
//                 title="Upcoming & Recent"
//                 icon={<FaBell className="w-5 h-5" />}
//                 announcements={upcomingAnnouncements}
//                 role={role}
//                 theme={theme}
//                 onDelete={handleDelete}
//                 onToggleActive={handleToggleActive}
//                 router={router}
//                 emptyMessage="No upcoming announcements"
//                 emptyIcon={<FaBell className="w-10 h-10" />}
//                 accentColor="from-blue-500 to-indigo-600"
//               />
              
//               <VerticalScrollableSection
//                 title="Past Announcements"
//                 icon={<FaHistory className="w-5 h-5" />}
//                 announcements={pastAnnouncements}
//                 role={role}
//                 theme={theme}
//                 onDelete={handleDelete}
//                 onToggleActive={handleToggleActive}
//                 router={router}
//                 emptyMessage="No past announcements"
//                 emptyIcon={<FaHistory className="w-10 h-10" />}
//                 accentColor="from-slate-500 to-gray-600"
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCalendarAlt,
  FaPaperclip,
  FaEye,
  FaEyeSlash,
  FaBell,
  FaHistory,
  FaGlobe,
  FaBuilding,
  FaUsers,
  FaUser,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCaretDown,
} from 'react-icons/fa';
import { API_BASE_URL, API_ROUTES } from '../config';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import { useTheme } from '../components/ThemeProvider';

/* ======================= Slate & HTML rendering helpers ======================= */

type SlateNode = any;
type SlateArray = SlateNode[];

function tryParseJson(input: unknown): unknown {
  if (typeof input !== 'string') return input;
  const s = input.trim();
  if (!s.startsWith('[') && !s.startsWith('{')) return input;
  try {
    return JSON.parse(s);
  } catch {
    return input;
  }
}

function isSlateArray(val: unknown): val is SlateArray {
  return Array.isArray(val) && val.every((n) => typeof n === 'object' && n && 'children' in n);
}

function slateToPlainText(nodes: SlateArray): string {
  const out: string[] = [];
  const walk = (n: SlateNode) => {
    if (!n) return;
    if (typeof n.text === 'string') out.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  nodes.forEach(walk);
  return out.join('');
}

function renderLeaf(leaf: any, key: number): React.ReactNode {
  let content: React.ReactNode = leaf.text ?? '';

  if (leaf.bold) content = <strong key={`b-${key}`}>{content}</strong>;
  if (leaf.italic) content = <em key={`i-${key}`}>{content}</em>;
  if (leaf.underline) content = <u key={`u-${key}`}>{content}</u>;
  if (leaf.code) content = <code key={`c-${key}`} className="px-1 rounded bg-gray-100 dark:bg-slate-700">{content}</code>;
  if (leaf.strikethrough) content = <s key={`s-${key}`}>{content}</s>;

  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderChildren(children: any[]): React.ReactNode {
  return children.map((ch, i) => {
    if (typeof ch?.text === 'string') return renderLeaf(ch, i);
    if (Array.isArray(ch?.children)) return renderElement(ch, i);
    return <React.Fragment key={i} />;
  });
}

function renderElement(node: any, key: number): React.ReactNode {
  const { type, children } = node || {};
  const kids = Array.isArray(children) ? children : [];

  switch (type) {
    case 'heading-one':
      return <h1 key={key} className="text-2xl font-bold mb-2">{renderChildren(kids)}</h1>;
    case 'heading-two':
      return <h2 key={key} className="text-xl font-semibold mb-2">{renderChildren(kids)}</h2>;
    case 'heading-three':
      return <h3 key={key} className="text-lg font-semibold mb-2">{renderChildren(kids)}</h3>;
    case 'block-quote':
      return (
        <blockquote key={key} className="border-l-4 pl-3 italic my-2 border-gray-300 dark:border-slate-600">
          {renderChildren(kids)}
        </blockquote>
      );
    case 'bulleted-list':
      return <ul key={key} className="list-disc ml-6 my-2">{renderChildren(kids)}</ul>;
    case 'numbered-list':
      return <ol key={key} className="list-decimal ml-6 my-2">{renderChildren(kids)}</ol>;
    case 'list-item':
      return <li key={key}>{renderChildren(kids)}</li>;
    case 'link':
      return (
        <a key={key} href={node.url || '#'} className="text-blue-600 dark:text-blue-400 underline">
          {renderChildren(kids)}
        </a>
      );
    case 'paragraph':
    default:
      return <p key={key} className="mb-2 whitespace-pre-wrap">{renderChildren(kids)}</p>;
  }
}

function isLikelyHtmlString(val: unknown): val is string {
  return typeof val === 'string' && /<[^>]+>/.test(val);
}

function htmlToPlainText(html: string): string {
  // SSR-safe fallback
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

function RichText({ content, className }: { content: unknown; className?: string }) {
  const parsed = tryParseJson(content);
  if (isSlateArray(parsed)) {
    return <div className={className}>{parsed.map((n, i) => renderElement(n, i))}</div>;
  }
  if (isLikelyHtmlString(parsed)) {
    const safe = DOMPurify.sanitize(parsed);
    return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
  }
  return <div className={className}>{typeof content === 'string' ? content : ''}</div>;
}

function getPlainTextFromContent(content: unknown): string {
  const parsed = tryParseJson(content);
  if (isSlateArray(parsed)) return slateToPlainText(parsed);
  if (typeof parsed === 'string') {
    return isLikelyHtmlString(parsed) ? htmlToPlainText(parsed) : parsed;
  }
  return '';
}

/* ======================= Utilities & types ======================= */

// Singapore timezone
// const timeZone = 'Asia/Singapore';
// const toSingaporeTime = (date: Date): Date => toZonedTime(date, timeZone);
const parseSingaporeTime = (dateString: string): Date => {
  // Append Singapore timezone to the string
  return new Date(dateString.replace(' ', 'T') + '+08:00');
};

const formatDateTime = (dateInput: string | Date) => {
  let singaporeDate: Date;
  
  if (dateInput instanceof Date) {
    // If it's already a Date object, use it directly
    singaporeDate = dateInput;
  } else {
    // If it's a string, parse it as Singapore time
    singaporeDate = parseSingaporeTime(dateInput);
  }
  
  return format(singaporeDate, 'dd/MM/yyyy HH:mm:ss');
};

interface Announcement {
  id: string;
  title: string;
  content: unknown;         // Slate JSON or HTML string
  content_text?: string;    // precomputed plain text for search
  created_at: string;
  target_type: 'company' | 'department' | 'position' | 'employee' | 'all';
  target_name?: string;
  is_active?: boolean;
  is_posted?: boolean;
  target_all?: boolean;
  scheduled_at?: string | null;
  attachments?: {
    id: number;
    original_filename: string;
    file_size: number;
    content_type: string;
    download_url: string;
    uploaded_at: string;
  }[];
}

/* -------------------- Date classification helpers -------------------- */
// const toDate = (s?: string | null) => (s ? new Date(s) : null);
// const PAST_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

// const isUpcoming = (a: Announcement, ref = new Date()) => {
//   const sched = toDate(a.scheduled_at || undefined);
//   return !!sched && sched > ref;
// };

// const publishedAt = (a: Announcement, ref = new Date()) => {
//   const sched = toDate(a.scheduled_at || undefined);
//   // If scheduled in the past, that's the publish time; otherwise created_at
//   return (sched && sched <= ref ? sched : new Date(a.created_at));
// };

// // For non-admins: hide inactive and unscheduled drafts; show scheduled items
// const visibleToNonAdmin = (a: Announcement, ref = new Date()) => {
//   if (a.is_active === false) return false;
//   if (isUpcoming(a, ref)) return true;       // show scheduled
//   return a.is_posted !== false;              // otherwise must be posted/published
// };
/* -------------------- Date classification helpers -------------------- */
const toDate = (s?: string | null) => (s ? parseSingaporeTime(s) : null);
const PAST_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const isUpcoming = (a: Announcement, ref = new Date()) => {
  const sched = toDate(a.scheduled_at || undefined);
  return !!sched && sched > ref;
};

const publishedAt = (a: Announcement, ref = new Date()) => {
  const sched = toDate(a.scheduled_at || undefined);
  // If scheduled in the past, that's the publish time; otherwise created_at
  return (sched && sched <= ref ? sched : toDate(a.created_at)!);
};

const isScheduledForFuture = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  const scheduledDate = parseSingaporeTime(dateString);
  return scheduledDate > new Date();
};

// For non-admins: hide inactive and unscheduled drafts; show scheduled items
const visibleToNonAdmin = (a: Announcement, ref = new Date()) => {
  if (a.is_active === false) return false;
  if (isUpcoming(a, ref)) return true;       // show scheduled
  return a.is_posted !== false;              // otherwise must be posted/published
};

/* ======================= Vertical scroll hook ======================= */
const useVerticalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  }, []);

  const scrollUp = () => scrollRef.current?.scrollBy({ top: -300, behavior: 'smooth' });
  const scrollDown = () => scrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);
    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  return { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability };
};

/* ======================= Admin table view ======================= */
const AdminTableView = ({
  announcements,
  theme,
  onDelete,
  onToggleActive,
  router,
}: {
  announcements: Announcement[];
  theme: string;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  router: any;
}) => {
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    targetType: '',
    hasAttachments: '',
    isScheduled: '',
    createdDateFrom: '',
    createdDateTo: '',
    publishedDateFrom: '',
    publishedDateTo: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let filtered = [...announcements];

    // Search: title + computed content_text + target_name
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((a) => {
        const text = (a.content_text ?? getPlainTextFromContent(a.content)).toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          text.includes(q) ||
          (a.target_name && a.target_name.toLowerCase().includes(q))
        );
      });
    }

    // Status filters
    if (filters.status) {
      if (filters.status === 'active') filtered = filtered.filter((a) => a.is_active === true);
      else if (filters.status === 'inactive') filtered = filtered.filter((a) => a.is_active === false);
      else if (filters.status === 'posted') filtered = filtered.filter((a) => a.is_posted === true);
      else if (filters.status === 'draft') filtered = filtered.filter((a) => a.is_posted === false);
    }

    if (filters.targetType) filtered = filtered.filter((a) => a.target_type === (filters.targetType as any));

    if (filters.hasAttachments) {
      if (filters.hasAttachments === 'yes') filtered = filtered.filter((a) => a.attachments && a.attachments.length > 0);
      else if (filters.hasAttachments === 'no')
        filtered = filtered.filter((a) => !a.attachments || a.attachments.length === 0);
    }

    if (filters.isScheduled) {
      if (filters.isScheduled === 'scheduled') filtered = filtered.filter((a) => a.scheduled_at);
      else if (filters.isScheduled === 'immediate') filtered = filtered.filter((a) => !a.scheduled_at);
    }

    // Created range
    if (filters.createdDateFrom) {
      const from = new Date(filters.createdDateFrom);
      filtered = filtered.filter((a) => new Date(a.created_at) >= from);
    }
    if (filters.createdDateTo) {
      const to = new Date(filters.createdDateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((a) => new Date(a.created_at) <= to);
    }

    // Published range (using publishedAt)
    if (filters.publishedDateFrom) {
      const from = new Date(filters.publishedDateFrom);
      filtered = filtered.filter((a) => publishedAt(a).getTime() >= from.getTime());
    }
    if (filters.publishedDateTo) {
      const to = new Date(filters.publishedDateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((a) => publishedAt(a).getTime() <= to.getTime());
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aVal = '';
        let bVal = '';
        switch (sortConfig.key) {
          case 'created_at':
            aVal = a.created_at;
            bVal = b.created_at;
            break;
          case 'published_at':
            aVal = publishedAt(a).toISOString();
            bVal = publishedAt(b).toISOString();
            break;
          case 'type':
            aVal = a.target_type;
            bVal = b.target_type;
            break;
          case 'title':
            aVal = a.title;
            bVal = b.title;
            break;
        }
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    setFilteredAnnouncements(filtered);
    setCurrentPage(1);
  }, [announcements, searchTerm, filters, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return <FaSort className="w-3 h-3 opacity-50" />;
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="w-3 h-3 text-blue-500" />
    ) : (
      <FaSortDown className="w-3 h-3 text-blue-500" />
    );
  };

  // const formatDateTime = (dateString: string) =>
  //   new Date(dateString).toLocaleDateString('en-GB', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //   }) +
  //   ' ' +
  //   new Date(dateString).toLocaleTimeString('en-GB', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //   });


  const resetFilters = () =>
    setFilters({
      status: '',
      targetType: '',
      hasAttachments: '',
      isScheduled: '',
      createdDateFrom: '',
      createdDateTo: '',
      publishedDateFrom: '',
      publishedDateTo: '',
    });

  // Pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <div
      className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm ${
        theme === 'light' ? 'bg-white/90 border-gray-200' : 'bg-slate-800/90 border-slate-700'
      }`}
    >
      <div className={`p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <input
              type="text"
              placeholder="Search by title, content, author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
              }`}
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-6 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <FaFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showAdvancedFilters && (
          <div
            className={`p-6 rounded-lg border mb-4 ${
              theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-700/50 border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Advanced Filters
              </h3>
              <button
                onClick={resetFilters}
                className={`text-sm font-medium transition-colors ${
                  theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="posted">Posted</option>
                    <option value="draft">Draft</option>
                  </select>
                  <FaCaretDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Target Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Target Type
                </label>
                <div className="relative">
                  <select
                    value={filters.targetType}
                    onChange={(e) => setFilters((p) => ({ ...p, targetType: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value="">All Types</option>
                    <option value="all">All</option>
                    <option value="company">Company</option>
                    <option value="department">Department</option>
                    <option value="position">Position</option>
                    <option value="employee">Employee</option>
                  </select>
                  <FaCaretDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Attachments
                </label>
                <div className="relative">
                  <select
                    value={filters.hasAttachments}
                    onChange={(e) => setFilters((p) => ({ ...p, hasAttachments: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value="">All</option>
                    <option value="yes">Has Attachments</option>
                    <option value="no">No Attachments</option>
                  </select>
                  <FaCaretDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Scheduling
                </label>
                <div className="relative">
                  <select
                    value={filters.isScheduled}
                    onChange={(e) => setFilters((p) => ({ ...p, isScheduled: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border appearance-none transition-colors ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value="">All</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="immediate">Immediate</option>
                  </select>
                  <FaCaretDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Date pickers */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Created From
                </label>
                <input
                  type="date"
                  value={filters.createdDateFrom}
                  onChange={(e) => setFilters((p) => ({ ...p, createdDateFrom: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Created To
                </label>
                <input
                  type="date"
                  value={filters.createdDateTo}
                  onChange={(e) => setFilters((p) => ({ ...p, createdDateTo: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Published From
                </label>
                <input
                  type="date"
                  value={filters.publishedDateFrom}
                  onChange={(e) => setFilters((p) => ({ ...p, publishedDateFrom: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Published To
                </label>
                <input
                  type="date"
                  value={filters.publishedDateTo}
                  onChange={(e) => setFilters((p) => ({ ...p, publishedDateTo: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-slate-600 bg-slate-700 text-white focus:border-blue-400 focus:ring-blue-400'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'}`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Action
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                  theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
                }`}
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  Created At
                  {getSortIcon('created_at')}
                </div>
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                  theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
                }`}
                onClick={() => handleSort('published_at')}
              >
                <div className="flex items-center gap-2">
                  Published At
                  {getSortIcon('published_at')}
                </div>
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                  theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
                }`}
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  Type
                  {getSortIcon('type')}
                </div>
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                  theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-600'
                }`}
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Title
                  {getSortIcon('title')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'}`}>
            {currentAnnouncements.map((announcement) => (
              <tr key={announcement.id} className={`hover:bg-opacity-50 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'light' ? 'text-blue-600 hover:bg-blue-100' : 'text-blue-400 hover:bg-blue-900/30'
                      }`}
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(announcement.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'light' ? 'text-red-600 hover:bg-red-100' : 'text-red-400 hover:bg-red-900/30'
                      }`}
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
                      className={`p-2 rounded-lg transition-colors ${
                        announcement.is_active === false
                          ? theme === 'light'
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-green-400 hover:bg-green-900/30'
                          : theme === 'light'
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 hover:bg-gray-700'
                      }`}
                      title={announcement.is_active === false ? 'Activate' : 'Deactivate'}
                    >
                      {announcement.is_active === false ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formatDateTime(announcement.created_at)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formatDateTime(announcement.created_at)}{/* {formatDateTime(publishedAt(announcement).toISOString())} */}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      announcement.target_type === 'all'
                        ? theme === 'light'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-purple-900/30 text-purple-300'
                        : announcement.target_type === 'company'
                        ? theme === 'light'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-blue-900/30 text-blue-300'
                        : announcement.target_type === 'department'
                        ? theme === 'light'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-green-900/30 text-green-300'
                        : theme === 'light'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-orange-900/30 text-orange-300'
                    }`}
                  >
                    {announcement.target_type}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">{announcement.title}</div>
                    {announcement.is_posted === false && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${
                          theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-amber-900/30 text-amber-300'
                        }`}
                      >
                        Draft
                      </span>
                    )}
                    {announcement.is_active === false && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 ml-2 inline-block ${
                          theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-300'
                        }`}
                      >
                        Inactive
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length} results
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'light'
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================= Compact card (non-admin view) ======================= */
const CompactAnnouncementCard = ({
  announcement,
  role,
  theme,
  onDelete,
  onToggleActive,
  router,
}: {
  announcement: Announcement;
  role: string;
  theme: string;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  router: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTargetInfo = (a: Announcement) => {
    const icons = {
      company: <FaBuilding className="w-3 h-3" />,
      department: <FaUsers className="w-3 h-3" />,
      position: <FaUser className="w-3 h-3" />,
      employee: <FaUser className="w-3 h-3" />,
      all: <FaGlobe className="w-3 h-3" />,
    };
    const names = { company: 'Company', department: 'Department', position: 'Position', employee: 'Employee', all: 'Global' };
    return { icon: (icons as any)[a.target_type] || (icons as any).all, name: (names as any)[a.target_type] || (names as any).all };
  };

  const isLongContent = (content: unknown): boolean =>
    getPlainTextFromContent(content).split(/\s+/).filter(Boolean).length > 25;

  const getPreviewContent = (content: unknown): string => {
    const words = getPlainTextFromContent(content).split(/\s+/).filter(Boolean);
    return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : words.join(' ');
  };

  // const isScheduledForFuture = (dateString?: string | null): boolean => {
  //   if (!dateString) return false;
  //   const scheduledDate = new Date(dateString);
  //   return scheduledDate > new Date();
  // };


  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusColor = () => {
    if (announcement.is_active === false) return 'from-red-500 to-red-600';
    if (announcement.is_posted === false) return 'from-amber-500 to-orange-600';
    return 'from-blue-500 to-indigo-600';
  };

  const targetInfo = getTargetInfo(announcement);

const headerDate = (): string => {
  return format(publishedAt(announcement), 'MMM dd, yyyy');
};


  return (
    <div
      className={`
      mb-3 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] group
      ${theme === 'light' ? 'bg-white border-gray-200 hover:border-blue-300' : 'bg-slate-800 border-slate-700 hover:border-blue-500'}
    `}
    >
      {/* Header */}
      <div className={`p-4 rounded-t-xl bg-gradient-to-r ${getStatusColor()} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/10"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-sm leading-tight flex-1 mr-3 line-clamp-2">{announcement.title}</h3>
            <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
              {announcement.is_posted === false && announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) ? (
                <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
                  SCHEDULED
                </span>
              ) : announcement.is_posted === false ? (
                <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-1 rounded-full font-medium whitespace-nowrap border border-white/20">
                  DRAFT
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              {targetInfo.icon}
              <span className="font-medium">{targetInfo.name}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <FaCalendarAlt className="w-3 h-3" />
              <span className="font-medium">{headerDate()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-4">
          <div className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {isLongContent(announcement.content) && !isExpanded ? (
              <>
                <div className="whitespace-pre-wrap mb-2">{getPreviewContent(announcement.content)}</div>
                <button
                  onClick={() => setIsExpanded(true)}
                  className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    theme === 'light'
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                      : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
                  }`}
                >
                  Read more <FaChevronDown className="w-2 h-2" />
                </button>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <RichText content={announcement.content} className="whitespace-pre-wrap" />
                </div>
                {isLongContent(announcement.content) && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 ${
                      theme === 'light'
                        ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                        : 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'
                    }`}
                  >
                    Show less <FaChevronUp className="w-2 h-2" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Attachments */}
        {announcement.attachments && announcement.attachments.length > 0 && (
          <div className="mb-4">
            <div
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
                theme === 'light'
                  ? 'text-blue-600 bg-blue-50 border border-blue-200'
                  : 'text-blue-400 bg-blue-900/30 border border-blue-700'
              }`}
            >
              <FaPaperclip className="w-3 h-3" />
              <span>
                {announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Status & actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {announcement.scheduled_at && isScheduledForFuture(announcement.scheduled_at) && !announcement.is_posted && (
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  theme === 'light'
                    ? 'text-blue-600 bg-blue-50 border border-blue-200'
                    : 'text-blue-400 bg-blue-900/30 border border-blue-700'
                }`}
              >
                <FaClock className="w-3 h-3" />
                <span className="font-medium">
                 {format(parseSingaporeTime(announcement.scheduled_at!), 'dd/MM')}</span> 
                  {/* {format(toSingaporeTime(new Date(announcement.scheduled_at)), 'dd/MM')}</span> */}
                {/* <span className="font-medium">{format(toSingaporeTime(new Date(announcement.scheduled_at)) as Date, 'dd/MM')}</span> */}
              </div>
            )}
            {announcement.is_active === false && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  theme === 'light' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-amber-900/30 text-amber-300 border border-amber-700'
                }`}
              >
                Inactive
              </span>
            )}
          </div>

          {role === 'admin' && (
            <div className="flex gap-1">
              {announcement.is_posted !== false && (
                <button
                  onClick={() => onToggleActive(announcement.id, announcement.is_active !== false)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                    announcement.is_active === false
                      ? theme === 'light'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                        : 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
                      : theme === 'light'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                        : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
                  }`}
                  title={announcement.is_active === false ? 'Activate' : 'Deactivate'}
                >
                  {announcement.is_active === false ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                </button>
              )}
              <button
                onClick={() => router.push(`/announcements/edit/${announcement.id}`)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                    : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-700'
                }`}
                title="Edit"
              >
                <FaEdit className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(announcement.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
                }`}
                title="Delete"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ======================= Vertical section (non-admin view) ======================= */
const VerticalScrollableSection = ({
  title,
  icon,
  announcements,
  role,
  theme,
  onDelete,
  onToggleActive,
  router,
  emptyMessage,
  emptyIcon,
  accentColor,
  minimal,
}: {
  title: string;
  icon: React.ReactNode;
  announcements: Announcement[];
  role: string;
  theme: string;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  router: any;
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  accentColor: string;
  minimal?: boolean;
}) => {
  const { scrollRef, canScrollUp, canScrollDown, scrollUp, scrollDown, checkScrollability } = useVerticalScroll();

  useEffect(() => {
    checkScrollability();
  }, [announcements, checkScrollability]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        className={`
        p-6 rounded-t-2xl border-b bg-gradient-to-r ${accentColor} text-white relative overflow-hidden
        ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}
      `}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">{icon}</div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-white/80 text-sm">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {(canScrollUp || canScrollDown) && (
            <div className="flex flex-col gap-1">
              <button
                onClick={scrollUp}
                disabled={!canScrollUp}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
                  canScrollUp ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                title="Scroll up"
              >
                <FaArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={scrollDown}
                disabled={!canScrollDown}
                className={`p-2 rounded-lg transition-all duration-200 border border-white/20 ${
                  canScrollDown ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                title="Scroll down"
              >
                <FaArrowDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`
          flex-1 overflow-y-auto p-6 rounded-b-2xl border border-t-0 backdrop-blur-sm
          ${theme === 'light' ? 'bg-white/90 border-gray-200' : 'bg-slate-800/90 border-slate-700'}
        `}
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
{announcements.length > 0 ? (
  minimal && role !== 'admin' ? (
    // Minimal list: Title + Release Date
    <div className="space-y-4">
      {announcements.map((a) => (
        <div
          key={a.id}
          className={`pb-3 border-b last:border-b-0 ${
            theme === 'light' ? 'border-gray-200' : 'border-slate-700'
          }`}
        >
          <div className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {a.title}
          </div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
           {format(publishedAt(a), 'MMM dd, yyyy')}
           {/* {format(toSingaporeTime(publishedAt(a)), 'MMM dd, yyyy')} */}
            {/* {format(publishedAt(a).getTime(), 'MMM dd, yyyy')} */}
          </div>
        </div>
      ))}
    </div>
  ) : (
    // Full cards (existing)
    announcements.map((announcement) => (
      <CompactAnnouncementCard
        key={announcement.id}
        announcement={announcement}
        role={role}
        theme={theme}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
        router={router}
      />
    ))
  )
) : (
  // ... keep your existing empty state
  <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
    <div
      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
      }`}
    >
      {emptyIcon}
    </div>
    <p className="text-lg font-semibold">{emptyMessage}</p>
    <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>Check back later for updates</p>
  </div>
)}

      </div>
    </div>
  );
};

/* ======================= PAGE ======================= */

export default function AnnouncementsPage() {
  const { theme } = useTheme();
  const [role, setRole] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);

  // Load user info
  useEffect(() => {
    const role = localStorage.getItem('hrms_role');
    if (role) setRole(role);

    const user = localStorage.getItem('hrms_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.id) setUserId(userData.id);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchAnnouncements = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const empId = role !== 'admin' && userId !== 0 ? userId : null;
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}${empId ? `?employee_id=${userId}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch announcements');

      const data = await response.json();

      // Normalize booleans, parse content, compute plain text for search
      const transformed: Announcement[] = data.map((a: any) => {
        const parsedContent = tryParseJson(a.content);
        const content_text = isSlateArray(parsedContent)
          ? slateToPlainText(parsedContent)
          : typeof parsedContent === 'string'
          ? isLikelyHtmlString(parsedContent)
            ? htmlToPlainText(parsedContent)
            : parsedContent
          : '';

        return {
          ...a,
          content: parsedContent,
          content_text,
          is_posted: a.is_posted === 0 ? false : true,
          is_active: a.is_active === 0 ? false : true,
          target_all: a.target_all === 1 ? true : false,
          target_type: a.target_type,
          target_name: a.target_name,
          scheduled_at: a.scheduled_at,
        } as Announcement;
      });

      // Fetch attachments
      const withAttachments = await Promise.all(
        transformed.map(async (a) => {
          try {
            const r = await fetch(`${API_BASE_URL}/api/announcement/announcements/${a.id}/documents`);
            if (r.ok) {
              const j = await r.json();
              return { ...a, attachments: j.documents || [] };
            }
            return a;
          } catch (e) {
            console.error(`Error fetching attachments for ${a.id}:`, e);
            return a;
          }
        })
      );

      setAnnouncements(withAttachments);
    } catch (e) {
      console.error('Error fetching announcements:', e);
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    if (userId !== 0 || role === 'admin') fetchAnnouncements();
  }, [userId, role, fetchAnnouncements]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete announcement');
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error('Error deleting announcement:', e);
      setError('Failed to delete announcement. Please try again.');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      if (!res.ok) throw new Error(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement`);
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !currentActive } : a)));
    } catch (e) {
      console.error('Error updating announcement status:', e);
      setError(`Failed to ${currentActive ? 'deactivate' : 'activate'} announcement. Please try again.`);
    }
  };

  /* --------- Build sections: Upcoming & Recent, Past (user-readable) --------- */
  const now = new Date();
  const recentCutoff = now.getTime() - PAST_WINDOW_MS;

  // Visibility for non-admins
  const visible = role === 'admin' ? announcements : announcements.filter((a) => visibleToNonAdmin(a, now));

  // Upcoming = future scheduled
  const upcoming = visible
    .filter((a) => isUpcoming(a, now))
    .sort((a, b) => (toDate(a.scheduled_at)!.getTime() - toDate(b.scheduled_at)!.getTime()));

  // Already published (not upcoming)
  const published = visible.filter((a) => !isUpcoming(a, now));

  // Recent = within last 30 days by publishedAt
  const recent = published
    .filter((a) => publishedAt(a, now).getTime() >= recentCutoff)
    .sort((a, b) => publishedAt(b, now).getTime() - publishedAt(a, now).getTime());

  // Past = older than 30 days
  const past = published
    .filter((a) => publishedAt(a, now).getTime() < recentCutoff)
    .sort((a, b) => publishedAt(b, now).getTime() - publishedAt(a, now).getTime());

  const upcomingAndRecent = [...upcoming, ...recent];

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === 'light' ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1
            className={`text-4xl font-bold mb-2 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
            }`}
          >
            Announcements
          </h1>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Stay updated with the latest news and updates</p>
        </div>

        {role === 'admin' && (
          <Link
            href="/announcements/create"
            className={`mt-4 lg:mt-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
            }`}
          >
            <FaPlus className="inline mr-2" /> Create Announcement
          </Link>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className={`mb-6 p-4 rounded-xl border-l-4 backdrop-blur-sm ${
            theme === 'light' ? 'bg-red-50/80 border-red-400 text-red-700' : 'bg-red-900/20 border-red-500 text-red-300'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${
              theme === 'light' ? 'border-blue-600' : 'border-blue-400'
            }`}
          />
        </div>
      ) : announcements.length === 0 ? (
        <div className={`p-12 rounded-2xl text-center backdrop-blur-sm ${theme === 'light' ? 'bg-white/80 shadow-lg' : 'bg-slate-800/80 shadow-xl'}`}>
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
            }`}
          >
            <FaCalendarAlt className={`w-12 h-12 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>No announcements found</h3>
          {role === 'admin' && (
            <>
              <p className={`mb-6 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Create your first announcement to notify your team</p>
              <Link
                href="/announcements/create"
                className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                }`}
              >
                <FaPlus className="mr-2" /> Create Announcement
              </Link>
            </>
          )}
        </div>
      ) : role === 'admin' ? (
        <AdminTableView
          announcements={announcements}
          theme={theme}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          router={router}
        />
      ) : (
        <div className="flex flex-col xl:flex-row gap-6 h-full">
          <VerticalScrollableSection
            title="Upcoming & Recent"
            icon={<FaBell className="w-5 h-5" />}
            announcements={upcomingAndRecent}
            role={role}
            theme={theme}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            router={router}
            emptyMessage="No upcoming or recent announcements"
            emptyIcon={<FaBell className="w-10 h-10" />}
            accentColor="from-blue-500 to-indigo-600"
          />

          <VerticalScrollableSection
            title="Past Announcements"
            icon={<FaHistory className="w-5 h-5" />}
            announcements={past}
            role={role}
            theme={theme}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            router={router}
            emptyMessage="No past announcements"
            emptyIcon={<FaHistory className="w-10 h-10" />}
            accentColor="from-slate-500 to-gray-600"
            minimal
          />
        </div>
      )}
    </div>
  );
}
