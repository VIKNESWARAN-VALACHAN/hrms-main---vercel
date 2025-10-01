// "use client";

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { useTheme } from './ThemeProvider';
// import { useRouter, usePathname } from 'next/navigation';
// import PasswordChangeModal from './PasswordChangeModal';

// interface SidebarProps {
//   onCollapseChange?: (collapsed: boolean) => void;
// }

// export default function Sidebar({ onCollapseChange }: SidebarProps) {
//   const { theme, toggleTheme } = useTheme();
//   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>(null);
//   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
//   const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
//   const router = useRouter();
//   const pathname = usePathname(); // Get current path
//   const [role, setRole] = useState<string>('');
//   const [isMobileView, setIsMobileView] = useState<boolean>(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

//   // Function to check if a path is active (exact match or starts with for nested routes)
//   const isActive = (path: string) => {
//     if (path === '/') {
//       return pathname === '/';
//     }
//     return pathname === path || pathname.startsWith(`${path}/`);
//   };

//   // Function for more precise submenu path matching to avoid multiple highlights
//   const isSubmenuActive = (path: string) => {
//     // Exact match
//     if (pathname === path) return true;
    
//     // Check if this is a direct parent path of the current path
//     // For example: if current path is /employees/add, then /employees should NOT be highlighted
//     // But the specific /employees/add should be highlighted
//     if (pathname.startsWith(`${path}/`)) {
//       // If path is just a parent section like /employees
//       if (path === '/employees' && pathname !== '/employees') {
//         // Don't highlight parent for child pages
//         return false;
//       }
      
//       // For exact submenu paths like /employees/add
//       return true;
//     }
    
//     return false;
//   };


//   // Function to get active parent menu based on current path
//   const getActiveParentMenu = () => {
//     if (pathname.startsWith('/companies') || pathname.startsWith('/company')) {
//       return 'manage-company';
//     }
//     if (pathname.startsWith('/employees') || pathname.startsWith('/employee')) {
//       return 'manage-employee';
//     }
//     if (pathname.startsWith('/admins') || pathname.startsWith('/admin')) {
//       return 'manage-admin';
//     }
//     return null;
//   };

//   useEffect(() => {
//     const user = localStorage.getItem('hrms_user');
//     if (user) {
//       const userData = JSON.parse(user);
//       setRole(userData.role);
//     }

//     // Get last opened menu from localStorage
//     const lastMenu = localStorage.getItem('lastOpenedMenu');
//     setLastOpenedMenu(lastMenu);
    
//     // No longer using collapsed state
//     setIsCollapsed(false);
//     localStorage.removeItem('sidebar_collapsed');
//     if (onCollapseChange) {
//       onCollapseChange(false);
//     }

//     // Handle resize events for responsive behavior
//     const handleResize = () => {
//       const isMobile = window.innerWidth < 768;
//       setIsMobileView(isMobile);
//     };

//     // Initialize based on screen size
//     handleResize();
    
//     // Set active parent menu based on current route
//     const activeParent = getActiveParentMenu();
//     if (activeParent && lastMenu !== activeParent) {
//       setLastOpenedMenu(activeParent);
//       localStorage.setItem('lastOpenedMenu', activeParent);
//     }
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [onCollapseChange, pathname]);

//   const toggleMenu = (menuId: string) => {
//     // Always expand menu
//     if (lastOpenedMenu === menuId) {
//       setLastOpenedMenu(null);
//       localStorage.removeItem('lastOpenedMenu');
//     } else {
//       setLastOpenedMenu(menuId);
//       localStorage.setItem('lastOpenedMenu', menuId);
//     }
//   };

//   // Collapse toggle is no longer needed
//   const toggleCollapse = () => {
//     // This function is kept for backward compatibility but does nothing now
//   };

//   const toggleMobileSidebar = () => {
//     setIsMobileOpen(!isMobileOpen);
//   };

//   const handleLogout = () => {
//     // Clear authentication data from localStorage
//     localStorage.removeItem('hrms_user');
//     localStorage.removeItem('hrms_authenticated');
//     localStorage.removeItem('hrms_token');
//     localStorage.removeItem('hrms_refresh_token');
//     localStorage.removeItem('viewedAnnouncements');
//     localStorage.removeItem('hrms_role');
//     // Redirect to login page
//     router.push('/auth/login');
//   };

//   // Mobile sidebar backdrop
//   const MobileBackdrop = () => (
//     <div 
//       className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//       onClick={toggleMobileSidebar}
//     ></div>
//   );

//   // Handle mobile navigation - close sidebar after navigation on mobile
//   const handleMobileNavigation = () => {
//     if (isMobileView || window.innerWidth < 768) {
//       setIsMobileOpen(false);
//     }
//   };

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       <MobileBackdrop />
      
//       {/* Mobile Toggle Button - fixed at top left for mobile */}
//       <button 
//         onClick={toggleMobileSidebar} 
//         className="fixed top-4 left-4 z-30 md:hidden btn btn-primary btn-circle shadow-lg"
//         aria-label="Toggle mobile menu"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>
      
//       {/* Main Sidebar */}
//       <aside 
//         className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
//                     w-64 overflow-y-auto overflow-x-hidden
//                     ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
//         data-theme={theme}
//       >
//         {/* Company Logo and Toggle Button */}
//         <div className="flex items-center justify-between p-4">
//           <div className={`transition-all duration-300 font-bold ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
//             {isCollapsed ? 'HR' : 'HRMS'}
//           </div>
          
//           <div className="flex items-center gap-2">
//             {/* Dark Mode Toggle Switch */}
//             <label className="swap swap-rotate">
//               <input 
//                 type="checkbox" 
//                 checked={theme === 'dark'}
//                 onChange={toggleTheme}
//                 className="hidden"
//               />
//               <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//               </svg>
//               <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//               </svg>
//             </label>
            
//             {/* Close button (mobile only) */}
//             <button 
//               onClick={toggleMobileSidebar}
//               className="md:hidden btn btn-ghost btn-square btn-sm text-white hover:text-blue-200"
//               aria-label="Close mobile menu"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//               </svg>
//             </button>
//           </div>
//         </div>
        
//         {/* Menu Items */}
//         <ul className="menu menu-vertical bg-transparent w-full space-y-1 mt-4 flex-grow">
//           {/* Dashboard */}
//           <li>
//             <Link 
//               href="/" 
//               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
//                         ${isActive('/') 
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//               onClick={handleMobileNavigation}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               {!isCollapsed && <span>Dashboard</span>}
//             </Link>
//           </li>

//           {/* Announcement */}
//           <li>
//             <Link 
//               href="/announcements" 
//               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
//                         ${isActive('/announcements') 
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//               onClick={handleMobileNavigation}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//               </svg>
//               {!isCollapsed && <span>Announcement</span>}
//             </Link>
//           </li>

//           {/* Leave Management */}
//           <li>
//             <Link 
//               href="/leaves" 
//               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
//                         ${isActive('/leaves') 
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//               onClick={handleMobileNavigation}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               {!isCollapsed && <span>Leave</span>}
//             </Link>
//           </li>

//           {/* Attendance Management */}
//           <li>
//             <Link 
//               href="/attendance" 
//               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
//                         ${isActive('/attendance') 
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//               onClick={handleMobileNavigation}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {!isCollapsed && <span>Attendance</span>}
//             </Link>
//           </li>

//           {/* Manage Company */}
//           {role === 'admin' && (
//           <li>
//             <button 
//               onClick={() => toggleMenu('manage-company')} 
//               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                         ${pathname.startsWith('/companies') || pathname.startsWith('/company')
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//             >
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//                 <span>Company</span>
//               </div>
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-company' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-company' ? 'block' : 'hidden'}`}>
//               <li>
//                 <Link 
//                   href="/companies" 
//                   className={`py-2 px-4 rounded-lg transition-all duration-300 
//                             ${pathname === '/companies'
//                               ? 'bg-blue-500 text-white font-semibold' 
//                               : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                   View Companies
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   href="/companies/add" 
//                   className={`py-2 px-4 rounded-lg transition-all duration-300 
//                             ${pathname === '/companies/add'
//                               ? 'bg-blue-500 text-white font-semibold' 
//                               : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Add Company
//                 </Link>
//               </li>
//             </ul>
//           </li>
//           )}

//           {/* Manage Employee */}
//           {(role === 'admin' || role === 'manager') && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('manage-employee')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${pathname.startsWith('/employees') || pathname.startsWith('/employee')
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                   <span>Employee</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-employee' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-employee' ? 'block' : 'hidden'}`}>
//                 <li>
//                   <Link 
//                     href="/employees" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                             ${pathname === '/employees'
//                               ? 'bg-blue-500 text-white font-semibold' 
//                               : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     View Employee
//                   </Link>
//                 </li>
//                 {role === 'admin' && (
//                   <li>
//                     <Link 
//                       href="/employees/add" 
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/employees/add'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                       </svg>
//                       Add New Employee
//                     </Link>
//                   </li>
//                 )}

//                 {/** displinary master data */}
//                 {role === 'admin' && (
//                   <li>
//                     <Link 
//                       href="/master-data/disciplinary_types" 
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/master-data/disciplinary_types'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>

//                       Disciplinary Types
//                     </Link>
//                   </li>
//                 )}
//               </ul>
//             </li>
//           )}

//           {/* Bank & Currency */}
//           {role === 'admin' && (
//             <li>
//               <Link
//                 href="/admins/bank-currency"
//                 className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-300
//                   ${pathname.startsWith('/admins/bank-currency')
//                     ? 'bg-blue-600 text-white font-semibold shadow-md'
//                     : 'hover:bg-blue-500'}`}
//                 onClick={handleMobileNavigation} // optional, if you use it to close mobile drawer
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   {/* simple exchange/bank icon */}
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M3 10h18M5 10V5h14v5M4 10v10h16V10" />
//                 </svg>
//                 <span>Bank &amp; Currency</span>
//               </Link>
//             </li>
//           )}


// {/* Scheduler */}
// {role === 'admin' && (
//   <li>
//     <button 
//       onClick={() => toggleMenu('scheduler')} 
//       className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                 ${pathname.startsWith('/admins/scheduler') || pathname.startsWith('/admins/Test1')
//                   ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                   : 'hover:bg-blue-500'}`}
//     >
//       <div className="flex items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           {/* calendar icon */}
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
//         </svg>
//         <span>Scheduler</span>
//       </div>
//       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'scheduler' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     </button>

//     <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'scheduler' ? 'block' : 'hidden'}`}>
//       {/* Preview 1 */}
//       {/* <li>
//         <Link 
//           href="/admins/scheduler"
//           className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/scheduler'
//                       ? 'bg-blue-500 text-white font-semibold' 
//                       : 'hover:bg-blue-500'}`}
//           onClick={handleMobileNavigation}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
//           </svg>
//           Preview 1
//         </Link>
//       </li> */}

//       {/* Preview 2 */}
//       {/* <li>
//         <Link 
//           href="/admins/Test1"
//           className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/Test1'
//                       ? 'bg-blue-500 text-white font-semibold' 
//                       : 'hover:bg-blue-500'}`}
//           onClick={handleMobileNavigation}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M9 17v-6h6v6M3 9h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//           Preview 2
//         </Link>
//       </li> */}

//         {/* Preview 3 */}
//       <li>
//         <Link 
//           href="/admins/schedules"
//           className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/Test1'
//                       ? 'bg-blue-500 text-white font-semibold' 
//                       : 'hover:bg-blue-500'}`}
//           onClick={handleMobileNavigation}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M9 17v-6h6v6M3 9h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//           Preview 3
//         </Link>
//       </li>
//     </ul>
//   </li>
// )}



//           {/* === Asset Management (Merged: Admin & Staff, dynamic) === */}
//           <li>
//             <button 
//               onClick={() => toggleMenu('asset-management')} 
//               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                 ${
//                   (
//                     pathname.startsWith('/admins/assets') ||
//                     pathname.startsWith('/admin/assets') ||
//                     pathname.startsWith('/assets') ||
//                     pathname.startsWith('/my-assets')
//                   ) &&
//                   !pathname.startsWith('/admins/assets/locations') && 
//                   !pathname.startsWith('/admins/assets/brands') &&
//                   !pathname.startsWith('/admins/assets/models') &&
//                   !pathname.startsWith('/admins/assets/types') &&
//                   !pathname.startsWith('/admins/assets/statuses') &&
//                   !pathname.startsWith('/admins/assets/units') &&
//                   !pathname.startsWith('/admins/assets/categories') &&
//                   !pathname.startsWith('/admins/assets/products')
//                     ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                     : 'hover:bg-blue-500'
//                 }`}
//             >
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 <span>Asset Management</span>
//               </div>
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'asset-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'asset-management' ? 'block' : 'hidden'}`}>

//               {/* ---- ADMIN/MANAGER ONLY ROUTES ---- */}
//               {(role === 'admin' || role === 'manager') && (
//                 <>
//                   <li>
//                     <Link
//                       href="/admins/assets"
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                         ${pathname === '/admins/assets' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                        <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mr-3"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                         />
//                       </svg>
//                       <span>All Assets</span>
//                     </Link>
//                   </li>
//                   <li>
//                   <Link
//                     href="/admins/assets/alerts"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/assets/alerts' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                     </svg>
//                     Asset Alerts
//                   </Link>
//                 </li>
//                   <li>
//                   <Link
//                     href="/admins/assets/reports"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/assets/reports' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     Reports
//                   </Link>
//                 </li>
//                       <li>
//                     <Link
//                       href="/admins/assets/approval"
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                         ${pathname === '/admins/assets/approval' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                           <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 mr-3"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v5M7 10v2a2 2 0 002 2h6a2 2 0 002-2v-2"
//                           />
//                         </svg>
//                       <span>Asset Requests</span>
//                     </Link>
//                   </li>
//                 </>
//               )}

//               {/* ---- STAFF ROUTES ---- */}
//               {(role !== 'admin' && role !== 'manager') && (
//                 <>
//                   {/* /assets: List My Asset Requests */}
//                   <li>
//                     <Link
//                       href="/assets"
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                         ${pathname === '/assets' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                       <span>My Asset Requests</span>
//                     </Link>
//                   </li>
//                   {/* /assets/add: New Asset Request */}
//                   <li>
//                     <Link
//                       href="/assets/add"
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                         ${pathname === '/assets/add' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                       <span>Request New Asset</span>
//                     </Link>
//                   </li>
//                   {/* /my-assets: List assets assigned to me */}
//                   <li>
//                     <Link
//                       href="/my-assets"
//                       className={`py-2 px-4 rounded-lg transition-all duration-300 
//                         ${pathname === '/my-assets' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-500'}`}
//                       onClick={handleMobileNavigation}
//                     >
//                       <span>Assets Assigned To Me</span>
//                     </Link>
//                   </li>
                
//                 </>
//               )}

//             </ul>
//           </li>

         
//           {/* Admin Panel Section */}
//           {role === 'admin' && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('admin-panel')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${pathname.startsWith('/admins') 
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span>Feedback Management</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'admin-panel' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'admin-panel' ? 'block' : 'hidden'}`}>
//                 {/* Feedback Management */}
//                 <li>
//                   <Link
//                     href="/admins/feedbacks"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/feedbacks' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                     </svg>
//                     All Feedbacks
//                   </Link>
//                 </li>
                
//                 <li>
//                   <Link
//                     href="/admins/analytics"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/analytics' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                     </svg>
//                     Analytics
//                   </Link>
//                 </li>


//                 {/* PIC Configuration */}
//                 <li>
//                   <Link
//                     href="/admins/pic-config"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/pic-config' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                     PIC Configuration
//                   </Link>
//                 </li>

//                 {/* Admin Settings */}
//                 <li>
//                   <Link
//                     href="/admins/settings"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/admins/settings' 
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     System Settings
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           )}

//           {/* Regular User Feedback Section */}
//           {role !== 'admin' && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('user-feedback')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${pathname.startsWith('/feedback')
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                   </svg>
//                   <span>Feedback</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'user-feedback' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'user-feedback' ? 'block' : 'hidden'}`}>
//                 <li>
//                   <Link 
//                     href="/feedback" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/feedback'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     New Feedback
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/feedback/my-feedbacks" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/feedback/my-feedbacks'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     My Feedbacks
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           )}


//           {/* Manage Admin */}
//           {role === 'admin' && (
//             <li>
//             <button 
//               onClick={() => toggleMenu('manage-admin')} 
//               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                         ${pathname.startsWith('/admins') || pathname.startsWith('/admin')
//                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                           : 'hover:bg-blue-500'}`}
//             >
//               <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                 <span>Admin</span>
//               </div>
//               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-admin' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>  
//             </button>
//             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-admin' ? 'block' : 'hidden'}`}>
//               <li>
//                 <Link 
//                   href="/admins" 
//                   className={`py-2 px-4 rounded-lg transition-all duration-300 
//                           ${pathname === '/admins'
//                             ? 'bg-blue-500 text-white font-semibold' 
//                             : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                   View Admin
//                 </Link>
//               </li>
//                 <li>
//                   <Link 
//                     href="/admins/add" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                             ${pathname === '/admins/add'
//                               ? 'bg-blue-500 text-white font-semibold' 
//                               : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                     </svg>
//                     Add New Admin
//                   </Link>
//                 </li>
//                 <li>
//               <Link 
//                 href="/admin-settings" 
//                 className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
//                           ${isActive('/admin-settings') 
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//                 onClick={handleMobileNavigation}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 {!isCollapsed && <span>Admin Settings</span>}



//               </Link>
//             </li>
//             </ul>


            
//           </li>
//           )}

//           {/* Bank & Currency Management */}
//           {(role === 'admin' || role === 'manager') && (
//             <li>
//               {/* <button 
//                 onClick={() => toggleMenu('manage-bank')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${pathname.startsWith('/config/banks') || 
//                             pathname.startsWith('/config/currency-codes') ||
//                             pathname.startsWith('/exchange-rates') ||
//                             pathname.startsWith('/config/currency-rates')
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
//                   </svg>
//                   <span>Bank & Currency</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-bank' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button> */}
//               {/* <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-bank' ? 'block' : 'hidden'}`}>
//                 <li>
//                   <Link 
//                     href="/config/banks" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/banks' || pathname.startsWith('/config/banks/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
//                     </svg>
//                     Bank Management
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/config/currency-codes" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/currency-codes' || pathname.startsWith('/config/currency-codes/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Currency Codes
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/exchange-rates" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/exchange-rates' || pathname.startsWith('/exchange-rates/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                     </svg>
//                     Exchange Rates
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/config/currency-rates" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/currency-rates' || pathname.startsWith('/config/currency-rates/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                     </svg>
//                     Currency Rates
//                   </Link>
//                 </li>
//               </ul> */}
//             </li>
//           )}


//           {/* Payroll Management */}
//           {(role === 'admin' || role === 'manager') && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('payroll-management')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${pathname.startsWith('/payroll/config') || pathname.startsWith('/payroll/processing')
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
//                   </svg>
//                   <span>Payroll</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'payroll-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'payroll-management' ? 'block' : 'hidden'}`}>
//                 {/* <li>
//                   <Link 
//                     href="/payslip" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/payslip'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     Payroll Report
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/payroll-config" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/payroll/payroll-config'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     Payroll Config
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/payroll-processing" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/payroll/payroll-processing'
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     Payroll Processing
//                   </Link>
//                 </li> */}

//                 <li>
//                 <Link 
//                   href="/admins/payrolls" 
//                   className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 
//                             ${pathname === '/admins/payrolls'
//                               ? 'bg-blue-500 text-white font-semibold' 
//                               : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v2m0 10v2m8-6a8 8 0 11-16 0 8 8 0 0116 0z" />
//                   </svg>
//                   Payroll Preview
//                 </Link>
//               </li>
//               </ul>
//             </li>
//           )}

//           {/* Master Data Config */}
//           {role === 'admin' && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('master-data')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                   ${pathname.startsWith('/master-data') || 
//                     pathname.startsWith('/admins/masters') ||
//                     pathname.startsWith('/version-logs') ||
//                     pathname.startsWith('/admins/assets/locations') || 
//                     pathname.startsWith('/admins/assets/brands') ||
//                     pathname.startsWith('/admins/assets/models') ||
//                     pathname.startsWith('/admins/assets/types') ||
//                     pathname.startsWith('/admins/assets/statuses') ||
//                     pathname.startsWith('/admins/assets/units') ||
//                     pathname.startsWith('/admins/assets/categories') ||
//                     pathname.startsWith('/admins/assets/products')
//                     ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                     : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                   </svg>
//                   <span>Master Data</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'master-data' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'master-data' ? 'block' : 'hidden'}`}>
                
//                 {/* Payroll Master Data */}
//                 <li className="mt-2 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Payroll</li>
//                 <li>
//                   <Link
//                     href="/master-data/allowances"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/allowances' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Allowances
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/master-data/deductions"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/deductions' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Deductions
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/master-data/reliefs"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/reliefs' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
//                     </svg>
//                     Tax Reliefs
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     href="/master-data/epf"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/epf' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M12 8c-4.418 0-8 1.79-8 4v5a2 2 0 002 2h12a2 2 0 002-2v-5c0-2.21-3.582-4-8-4z" />
//                     </svg>
//                     EPF
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/master-data/socso"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/socso' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
//                     </svg>
//                     SOCSO
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/master-data/eis"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/eis' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
//                     </svg>
//                     EIS
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/master-data/pcb"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/master-data/pcb' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
//                     </svg>
//                     PCB
//                   </Link>
//                 </li>

//                 {/* Feedback System Master Data */}
//                 <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Feedback System</li>
//                 <li>
//                   <Link
//                     href="/admins/masters/sections"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/masters/sections' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                     Departments/Sections
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/masters/categories"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/masters/categories' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                     </svg>
//                     Feedback Categories
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/masters/feedback-types"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/masters/feedback-types' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                     </svg>
//                     Feedback Types
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/masters/priority-levels"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/masters/priority-levels' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                     Priority Levels
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/masters/status"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/masters/status' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Status Types
//                   </Link>
//                 </li>

//                 <li className="mt-2 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Payroll Config Mapping</li>
//                 <li>
//                   <Link
//                     href="/admins/payroll-config-allowance"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/payroll-config-allowance'
//                         ? 'bg-blue-500 text-white font-semibold'
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                     Allowance Mapping
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     href="/admins/payroll-config-deduction"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/payroll-config-deduction'
//                         ? 'bg-blue-500 text-white font-semibold'
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4m-6 0V6m8 12H4" />
//                     </svg>
//                     Deduction Mapping
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     href="/admins/payroll-config"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/payroll-config'
//                         ? 'bg-blue-500 text-white font-semibold'
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Payroll Config
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/payroll-policy-assignment"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/payroll-policy-assignment'
//                         ? 'bg-blue-500 text-white font-semibold'
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Payroll Policy Assignment
//                   </Link>
//                 </li>

//                 <li>
//                 <Link
//                   href="/admins/employee-reliefs"
//                   className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/employee-reliefs'
//                       ? 'bg-blue-500 text-white font-semibold'
//                       : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3 -3v6m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14z" />
//                   </svg>
//                   Employee Reliefs
//                 </Link>
//                 </li>

//               <li>
//                 <Link
//                   href="/admins/employee-allowances"
//                   className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/employee-allowances'
//                       ? 'bg-blue-500 text-white font-semibold'
//                       : 'hover:bg-blue-500'}`}
//                   onClick={handleMobileNavigation}
//                 >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.28 0-4 1.5-4 3s1.72 3 4 3 4-1.5 4-3-1.72-3-4-3zm0 0V4m0 12v4" />
//             </svg>


//                   Employee Allowances
//                 </Link>
//               </li>


//             <li>
//               <Link
//                 href="/admins/employee-deductions"
//                 className={`py-2 px-4 rounded-lg transition-all duration-300 
//                   ${pathname === '/admins/employee-deductions'
//                     ? 'bg-blue-500 text-white font-semibold'
//                     : 'hover:bg-blue-500'}`}
//                 onClick={handleMobileNavigation}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 118 0v2M5 10h14M5 6h14" />
//                 </svg>
//                 Employee Deductions
//               </Link>
//             </li>

// {/* <li>
//   <Link
//     href="/admins/claims/benefit-types"
//     className={`py-2 px-4 rounded-lg transition-all duration-300 
//       ${pathname === '/admins/claims/benefit-types' 
//         ? 'bg-blue-500 text-white font-semibold' 
//         : 'hover:bg-blue-500'}`}
//     onClick={handleMobileNavigation}
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//     </svg>
//     Claim Benefit Types
//   </Link>
// </li>

// <li>
//   <Link
//     href="/admins/claims/mapping"
//     className={`py-2 px-4 rounded-lg transition-all duration-300 
//       ${pathname === '/admins/claims/mapping' 
//         ? 'bg-blue-500 text-white font-semibold' 
//         : 'hover:bg-blue-500'}`}
//     onClick={handleMobileNavigation}
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     Claim Mapping
//   </Link>
// </li> */}

// <li>
//   <Link
//     href="/admins/claim"
//     className={`py-2 px-4 rounded-lg transition-all duration-300 
//       ${pathname === '/admins/claim' 
//         ? 'bg-blue-500 text-white font-semibold' 
//         : 'hover:bg-blue-500'}`}
//     onClick={handleMobileNavigation}
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//     </svg>
//     Claim Benefit
//   </Link>
// </li>


//                 {/* Asset Management Master Data */}
//                 <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Asset Management</li>
//                 <li>
//                   <Link
//                     href="/admins/assets/locations"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/locations' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Locations
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/brands"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/brands' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Brands
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/models"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/models' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     Models
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/types"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/types' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                     </svg>
//                     Types
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/statuses"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/statuses' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Statuses
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/units"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/units' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
//                     </svg>
//                     Units
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/categories"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/categories' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                     </svg>
//                     Categories
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/admins/assets/products"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/admins/assets/products' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                     </svg>
//                     Products
//                   </Link>
//                 </li>

//                 {/* System Master Data */}
//                 <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">System</li>
//                 <li>
//                   <Link
//                     href="/version-logs"
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                       ${pathname === '/version-logs' 
//                         ? 'bg-blue-500 text-white font-semibold' 
//                         : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Version Logs
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           )}

//           {/* Config Management */}
//           {(role === 'admin') && (
//             <li>
//               <button 
//                 onClick={() => toggleMenu('config-management')} 
//                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                           ${(pathname.startsWith('/config/models') || 
//                             pathname.startsWith('/config/brands') ||
//                             pathname.startsWith('/config/holiday')) &&
//                             !pathname.startsWith('/config/banks') &&
//                             !pathname.startsWith('/config/currency-codes') &&
//                             !pathname.startsWith('/config/currency-rates')
//                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                             : 'hover:bg-blue-500'}`}
//               >
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span>Configuration</span>
//                 </div>
//                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'config-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'config-management' ? 'block' : 'hidden'}`}>
//                 {/* <li>
//                   <Link 
//                     href="/config/models" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/models' || pathname.startsWith('/config/models/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     Product Models
//                   </Link>
//                 </li>
//                 <li>
//                   <Link 
//                     href="/config/brands" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/brands' || pathname.startsWith('/config/brands/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Brands
//                   </Link>
//                 </li> */}
//                 <li>
//                   <Link 
//                     href="/config/holiday" 
//                     className={`py-2 px-4 rounded-lg transition-all duration-300 
//                               ${pathname === '/config/holiday' || pathname.startsWith('/config/holiday/')
//                                 ? 'bg-blue-500 text-white font-semibold' 
//                                 : 'hover:bg-blue-500'}`}
//                     onClick={handleMobileNavigation}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Holiday Calendar
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           )}

//           {/* My Claims */}
// {role !== 'admin' && (
//   <li>
//     <Link 
//       href="/claims" 
//       className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 
//                 ${pathname === '/claims' 
//                   ? 'bg-blue-500 text-white font-semibold' 
//                   : 'hover:bg-blue-500'}`}
//       onClick={handleMobileNavigation}
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 0110 0v3a5 5 0 01-10 0v-3z" />
//       </svg>
//       My Claims
//     </Link>
//   </li>
// )}

// {/* Claim Management */}
// {(role === 'admin' || role === 'manager') && (
//   <li>
//     <button 
//       onClick={() => toggleMenu('claim-management')} 
//       className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
//                 ${pathname.startsWith('/admins/claims')
//                   ? 'bg-blue-600 text-white font-semibold shadow-md' 
//                   : 'hover:bg-blue-500'}`}
//     >
//       <div className="flex items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 13v-3a8 8 0 10-16 0v3l-1.405 1.405M9 17h6" />
//         </svg>
//         <span>Claim Management</span>
//       </div>
//       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'claim-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     </button>
//     <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'claim-management' ? 'block' : 'hidden'}`}>
//       <li>
//         <Link 
//           href="/admins/claims" 
//           className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/claims'
//                       ? 'bg-blue-500 text-white font-semibold' 
//                       : 'hover:bg-blue-500'}`}
//           onClick={handleMobileNavigation}
//         >
//           All Claims
//         </Link>
//       </li>
//       <li>
//         <Link 
//           href="/admins/ApprovalFlow" 
//           className={`py-2 px-4 rounded-lg transition-all duration-300 
//                     ${pathname === '/admins/ApprovalFlow'
//                       ? 'bg-blue-500 text-white font-semibold' 
//                       : 'hover:bg-blue-500'}`}
//           onClick={handleMobileNavigation}
//         >
//           Approval Flow Configuration
//         </Link>
//       </li>
//     </ul>
//   </li>
// )}

          

//         </ul>
//         {/* Footer Controls */}
//         <div className={`mt-auto p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
//           {/* Change Password Button */}
//           <button 
//             onClick={() => setIsPasswordModalOpen(true)} 
//             className={`btn btn-primary ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
//             aria-label="Change Password"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//             </svg>
//             {!isCollapsed && <span>Change Password</span>}
//           </button>
          
//           {/* Logout Button */}
//           <button 
//             onClick={handleLogout} 
//             className={`btn btn-error ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
//             aria-label="Logout"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             {!isCollapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Password Change Modal */}
//       <PasswordChangeModal 
//         isOpen={isPasswordModalOpen} 
//         onClose={() => setIsPasswordModalOpen(false)} 
//       />
//     </>
//   );
// } 
// // //********************************************************** */
// // //TEST NEW
// // "use client";

// // import Link from 'next/link';
// // import { useState, useEffect } from 'react';
// // import { useTheme } from './ThemeProvider';
// // import { useRouter, usePathname } from 'next/navigation';
// // import PasswordChangeModal from './PasswordChangeModal';

// // interface SidebarProps {
// //   onCollapseChange?: (collapsed: boolean) => void;
// // }

// // export default function Sidebar({ onCollapseChange }: SidebarProps) {
// //   const { theme, toggleTheme } = useTheme();
// //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>(null);
// //   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
// //   const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
// //   const router = useRouter();
// //   const pathname = usePathname(); // Get current path
// //   const [role, setRole] = useState<string>('');
// //   const [isMobileView, setIsMobileView] = useState<boolean>(false);
// //   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

// //   // Function to check if a path is active (exact match or starts with for nested routes)
// //   const isActive = (path: string) => {
// //     if (path === '/') {
// //       return pathname === '/';
// //     }
// //     return pathname === path || pathname.startsWith(`${path}/`);
// //   };

// //   // Function for more precise submenu path matching to avoid multiple highlights
// //   const isSubmenuActive = (path: string) => {
// //     // Exact match
// //     if (pathname === path) return true;
    
// //     // Check if this is a direct parent path of the current path
// //     // For example: if current path is /employees/add, then /employees should NOT be highlighted
// //     // But the specific /employees/add should be highlighted
// //     if (pathname.startsWith(`${path}/`)) {
// //       // If path is just a parent section like /employees
// //       if (path === '/employees' && pathname !== '/employees') {
// //         // Don't highlight parent for child pages
// //         return false;
// //       }
      
// //       // For exact submenu paths like /employees/add
// //       return true;
// //     }
    
// //     return false;
// //   };

// //   // Function to get active parent menu based on current path
// //   const getActiveParentMenu = () => {
// //     if (pathname.startsWith('/companies') || pathname.startsWith('/company')) {
// //       return 'manage-company';
// //     }
// //     if (pathname.startsWith('/employees') || pathname.startsWith('/employee')) {
// //       return 'manage-employee';
// //     }
// //     if (pathname.startsWith('/admins') || pathname.startsWith('/admin')) {
// //       return 'manage-admin';
// //     }
// //     if (pathname.startsWith('/feedbacks') || pathname.startsWith('/feedback')) {
// //       return 'feedback-management';
// //     }
// //     if (pathname.startsWith('/claims') || pathname.startsWith('/claim')) {
// //       return 'claim-management';
// //     }
// //     if (pathname.startsWith('/master-data') || pathname.startsWith('/status') || pathname.startsWith('/departments') || pathname.startsWith('/positions')) {
// //       return 'master-data';
// //     }
// //     return null;
// //   };

// //   // Function to check if a parent menu should be highlighted
// //   const isParentMenuActive = (menuId: string) => {
// //     const activeParent = getActiveParentMenu();
// //     return activeParent === menuId;
// //   };

// //   useEffect(() => {
// //     const user = localStorage.getItem('hrms_user');
// //     if (user) {
// //       const userData = JSON.parse(user);
// //       setRole(userData.role);
// //     }

// //     // Get last opened menu from localStorage
// //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// //     setLastOpenedMenu(lastMenu);
    
// //     // No longer using collapsed state
// //     setIsCollapsed(false);
// //     localStorage.removeItem('sidebar_collapsed');
// //     if (onCollapseChange) {
// //       onCollapseChange(false);
// //     }

// //     // Handle resize events for responsive behavior
// //     const handleResize = () => {
// //       const isMobile = window.innerWidth < 768;
// //       setIsMobileView(isMobile);
// //     };

// //     // Initialize based on screen size
// //     handleResize();
    
// //     // Set active parent menu based on current route
// //     const activeParent = getActiveParentMenu();
// //     if (activeParent && lastMenu !== activeParent) {
// //       setLastOpenedMenu(activeParent);
// //       localStorage.setItem('lastOpenedMenu', activeParent);
// //     }
    
// //     window.addEventListener('resize', handleResize);
// //     return () => window.removeEventListener('resize', handleResize);
// //   }, [onCollapseChange, pathname]);

// //   const toggleMenu = (menuId: string) => {
// //     // Always expand menu
// //     if (lastOpenedMenu === menuId) {
// //       setLastOpenedMenu(null);
// //       localStorage.removeItem('lastOpenedMenu');
// //     } else {
// //       setLastOpenedMenu(menuId);
// //       localStorage.setItem('lastOpenedMenu', menuId);
// //     }
// //   };

// //   // Collapse toggle is no longer needed
// //   const toggleCollapse = () => {
// //     // This function is kept for backward compatibility but does nothing now
// //   };

// //   const toggleMobileSidebar = () => {
// //     setIsMobileOpen(!isMobileOpen);
// //   };

// //   const handleLogout = () => {
// //     // Clear authentication data from localStorage
// //     localStorage.removeItem('hrms_user');
// //     localStorage.removeItem('hrms_authenticated');
// //     localStorage.removeItem('hrms_token');
// //     localStorage.removeItem('hrms_refresh_token');
// //     localStorage.removeItem('viewedAnnouncements');
// //     localStorage.removeItem('hrms_role');
// //     // Redirect to login page
// //     router.push('/auth/login');
// //   };

// //   // Mobile sidebar backdrop
// //   const MobileBackdrop = () => (
// //     <div 
// //       className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
// //       onClick={toggleMobileSidebar}
// //     ></div>
// //   );

// //   // Handle mobile navigation - close sidebar after navigation on mobile
// //   const handleMobileNavigation = () => {
// //     if (isMobileView || window.innerWidth < 768) {
// //       setIsMobileOpen(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Mobile Backdrop */}
// //       <MobileBackdrop />
      
// //       {/* Mobile Toggle Button - fixed at top left for mobile */}
// //       <button 
// //         onClick={toggleMobileSidebar} 
// //         className="fixed top-4 left-4 z-30 md:hidden btn btn-primary btn-circle shadow-lg"
// //         aria-label="Toggle mobile menu"
// //       >
// //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //         </svg>
// //       </button>
      
// //       {/* Main Sidebar */}
// //       <aside 
// //         className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
// //                     w-64 overflow-y-auto overflow-x-hidden
// //                     ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
// //         data-theme={theme}
// //       >
// //         {/* Company Logo and Toggle Button */}
// //         <div className="flex items-center justify-between p-4">
// //           <div className={`transition-all duration-300 font-bold ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
// //             {isCollapsed ? 'HR' : 'HRMS'}
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             {/* Dark Mode Toggle Switch */}
// //             <label className="swap swap-rotate">
// //               <input 
// //                 type="checkbox" 
// //                 checked={theme === 'dark'}
// //                 onChange={toggleTheme}
// //                 className="hidden"
// //               />
// //               <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
// //                 <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
// //               </svg>
// //               <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
// //                 <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
// //               </svg>
// //             </label>
            
// //             {/* Close button (mobile only) */}
// //             <button 
// //               onClick={toggleMobileSidebar}
// //               className="md:hidden btn btn-ghost btn-square btn-sm text-white hover:text-blue-200"
// //               aria-label="Close mobile menu"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
        
// //         {/* Menu Items */}
// //         <ul className="menu menu-vertical bg-transparent w-full space-y-1 mt-4 flex-grow">
// //           {/* Dashboard */}
// //           <li>
// //             <Link 
// //               href="/" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
// //               </svg>
// //               {!isCollapsed && <span>Dashboard</span>}
// //             </Link>
// //           </li>

// //           {/* Announcement */}
// //           <li>
// //             <Link 
// //               href="/announcements" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/announcements') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
// //               </svg>
// //               {!isCollapsed && <span>Announcement</span>}
// //             </Link>
// //           </li>

// //           {/* Leave Management */}
// //           <li>
// //             <Link 
// //               href="/leaves" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/leaves') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //               </svg>
// //               {!isCollapsed && <span>Leave</span>}
// //             </Link>
// //           </li>

// //           {/* Attendance Management */}
// //           <li>
// //             <Link 
// //               href="/attendance" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/attendance') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               {!isCollapsed && <span>Attendance</span>}
// //             </Link>
// //           </li>

// //           {/* Manage Company */}
// //           {role === 'admin' && (
// //           <li>
// //             <button 
// //               onClick={() => toggleMenu('manage-company')} 
// //               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                         ${isParentMenuActive('manage-company')
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //             >
// //               <div className="flex items-center">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
// //                 </svg>
// //                 <span>Company</span>
// //               </div>
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-company' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //               </svg>
// //             </button>
// //             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-company' ? 'block' : 'hidden'}`}>
// //               <li>
// //                 <Link 
// //                   href="/companies" 
// //                   className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/companies'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                   onClick={handleMobileNavigation}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                   </svg>
// //                   View Companies
// //                 </Link>
// //               </li>
// //               <li>
// //                 <Link 
// //                   href="/companies/add" 
// //                   className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/companies/add'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                   onClick={handleMobileNavigation}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                   </svg>
// //                   Add Company
// //                 </Link>
// //               </li>
// //             </ul>
// //           </li>
// //           )}

// //           {/* Manage Employee */}
// //           {(role === 'admin' || role === 'manager') && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('manage-employee')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${isParentMenuActive('manage-employee')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
// //                   </svg>
// //                   <span>Employee</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-employee' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-employee' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/employees" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/employees'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Employees
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/employees/add" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/employees/add'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                     </svg>
// //                     Add Employee
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}

// //           {/* Manage Admin */}
// //           {role === 'admin' && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('manage-admin')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${isParentMenuActive('manage-admin')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// //                   </svg>
// //                   <span>Admin</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-admin' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-admin' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/admins" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/admins'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Admin
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/admins/add" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/admins/add'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                     </svg>
// //                     Add Admin
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}

// //           {/* Feedback Management */}
// //           {(role === 'admin' || role === 'manager') && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('feedback-management')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${isParentMenuActive('feedback-management')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
// //                   </svg>
// //                   <span>Feedback Management</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'feedback-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'feedback-management' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/feedbacks" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/feedbacks'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Feedbacks
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/feedbacks/add" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/feedbacks/add'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                     </svg>
// //                     Add Feedback
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}




// //           {/* Claim Management */}
// //           {(role !== 'admin') && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('claim-management')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${isParentMenuActive('claim-management')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //                   </svg>
// //                   <span>Claim Management</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'claim-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'claim-management' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/claims" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/claims'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Claims
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/claims/new" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/claims/new'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                     </svg>
// //                     Add Claim
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}
          
// //           {/* Claim Management for Admins */}
// //           {(role === 'admin') && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('claim-management')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                             ${pathname.startsWith('/admins/claims')
// //                               ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                               : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 13v-3a8 8 0 10-16 0v3l-1.405 1.405M9 17h6" />
// //                   </svg>
// //                   <span>Claim Management</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'claim-management' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'claim-management' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/admins/claims" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/claims'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Claims
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}

// //           {/* Master Data */}
// //           {role === 'admin' && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('master-data')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${isParentMenuActive('master-data')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
// //                   </svg>
// //                   <span>Master Data</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'master-data' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'master-data' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/status" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/status'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                     </svg>
// //                     Status Management
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/departments" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/departments'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
// //                     </svg>
// //                     Department Management
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link 
// //                     href="/positions" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/positions'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.01M8 6v6h8V6M8 6H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
// //                     </svg>
// //                     Position Management
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </li>
// //           )}

// //           {/* Footer Controls */}
// //           <div className={`mt-auto p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
// //             {/* Change Password Button */}
// //             <button 
// //               onClick={() => setIsPasswordModalOpen(true)} 
// //               className={`btn btn-primary ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
// //               aria-label="Change Password"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
// //               </svg>
// //               {!isCollapsed && <span>Change Password</span>}
// //             </button>
            
// //             {/* Logout Button */}
// //             <button 
// //               onClick={handleLogout} 
// //               className={`btn btn-error ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
// //               aria-label="Logout"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
// //               </svg>
// //               {!isCollapsed && <span>Logout</span>}
// //             </button>
// //           </div>
          

// //         </ul>
// //       </aside>


// //        {/* Password Change Modal */}
// //        <PasswordChangeModal 
// //          isOpen={isPasswordModalOpen} 
// //          onClose={() => setIsPasswordModalOpen(false)} 
// //        />

// //     </>
// //   );
// // }






// //********************************************************** */


// // "use client";

// // import Link from 'next/link';
// // import { useState, useEffect, useCallback  } from 'react';
// // import { useTheme } from './ThemeProvider';
// // import { useRouter, usePathname } from 'next/navigation';
// // import PasswordChangeModal from './PasswordChangeModal';

// // interface SidebarProps {
// //   onCollapseChange?: (collapsed: boolean) => void;
// // }

// // export default function Sidebar({ onCollapseChange }: SidebarProps) {
// //   const { theme, toggleTheme } = useTheme();
// //   const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>(null);
// //   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
// //   const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
// //   const router = useRouter();
// //   const pathname = usePathname(); // Get current path
// //   const [role, setRole] = useState<string>('');
// //   const [isMobileView, setIsMobileView] = useState<boolean>(false);
// //   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

// //   // Function to check if a path is active (exact match or starts with for nested routes)
// //   const isActive = (path: string) => {
// //     if (path === '/') {
// //       return pathname === '/';
// //     }
// //     return pathname === path || pathname.startsWith(`${path}/`);
// //   };

// //   // Function for more precise submenu path matching to avoid multiple highlights
// //   const isSubmenuActive = (path: string) => {
// //     // Exact match
// //     if (pathname === path) return true;
    
// //     // Check if this is a direct parent path of the current path
// //     // For example: if current path is /employees/add, then /employees should NOT be highlighted
// //     // But the specific /employees/add should be highlighted
// //     if (pathname.startsWith(`${path}/`)) {
// //       // If path is just a parent section like /employees
// //       if (path === '/employees' && pathname !== '/employees') {
// //         // Don't highlight parent for child pages
// //         return false;
// //       }
      
// //       // For exact submenu paths like /employees/add
// //       return true;
// //     }
    
// //     return false;
// //   };


// //   // Function to get active parent menu based on current path
// //   const getActiveParentMenu = useCallback(() => {//() => {
// //     if (pathname.startsWith('/companies') || pathname.startsWith('/company')) {
// //       return 'manage-company';
// //     }
// //     if (pathname.startsWith('/employees') || pathname.startsWith('/employee')) {
// //       return 'manage-employee';
// //     }
// //     if (pathname.startsWith('/admins') || pathname.startsWith('/admin')) {
// //       return 'manage-admin';
// //     }
// //     return null;
// //   }, [pathname]);//};

// //   useEffect(() => {
// //     const user = localStorage.getItem('hrms_user');
// //     if (user) {
// //       const userData = JSON.parse(user);
// //       setRole(userData.role);
// //     }

// //     // Get last opened menu from localStorage
// //     const lastMenu = localStorage.getItem('lastOpenedMenu');
// //     setLastOpenedMenu(lastMenu);
    
// //     // No longer using collapsed state
// //     setIsCollapsed(false);
// //     localStorage.removeItem('sidebar_collapsed');
// //     if (onCollapseChange) {
// //       onCollapseChange(false);
// //     }

// //     // Handle resize events for responsive behavior
// //     const handleResize = () => {
// //       const isMobile = window.innerWidth < 768;
// //       setIsMobileView(isMobile);
// //     };

// //     // Initialize based on screen size
// //     handleResize();
    
// //     // Set active parent menu based on current route
// //     const activeParent = getActiveParentMenu();
// //     if (activeParent && lastMenu !== activeParent) {
// //       setLastOpenedMenu(activeParent);
// //       localStorage.setItem('lastOpenedMenu', activeParent);
// //     }
    
// //     window.addEventListener('resize', handleResize);
// //     return () => window.removeEventListener('resize', handleResize);
// //   }, [onCollapseChange, pathname, getActiveParentMenu]);//}, [onCollapseChange, pathname]);

// //   const toggleMenu = (menuId: string) => {
// //     // Always expand menu
// //     if (lastOpenedMenu === menuId) {
// //       setLastOpenedMenu(null);
// //       localStorage.removeItem('lastOpenedMenu');
// //     } else {
// //       setLastOpenedMenu(menuId);
// //       localStorage.setItem('lastOpenedMenu', menuId);
// //     }
// //   };

// //   // Collapse toggle is no longer needed
// //   const toggleCollapse = () => {
// //     // This function is kept for backward compatibility but does nothing now
// //   };

// //   const toggleMobileSidebar = () => {
// //     setIsMobileOpen(!isMobileOpen);
// //   };

// //   const handleLogout = () => {
// //     // Clear authentication data from localStorage
// //     localStorage.removeItem('hrms_user');
// //     localStorage.removeItem('hrms_authenticated');
// //     localStorage.removeItem('hrms_token');
// //     localStorage.removeItem('hrms_refresh_token');
// //     localStorage.removeItem('viewedAnnouncements');
// //     localStorage.removeItem('hrms_role');
// //     // Redirect to login page
// //     router.push('/auth/login');
// //   };

// //   // Mobile sidebar backdrop
// //   const MobileBackdrop = () => (
// //     <div 
// //       className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
// //       onClick={toggleMobileSidebar}
// //     ></div>
// //   );

// //   // Handle mobile navigation - close sidebar after navigation on mobile
// //   const handleMobileNavigation = () => {
// //     if (isMobileView || window.innerWidth < 768) {
// //       setIsMobileOpen(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Mobile Backdrop */}
// //       <MobileBackdrop />
      
// //       {/* Mobile Toggle Button - fixed at top left for mobile */}
// //       <button 
// //         onClick={toggleMobileSidebar} 
// //         className="fixed top-4 left-4 z-30 md:hidden btn btn-primary btn-circle shadow-lg"
// //         aria-label="Toggle mobile menu"
// //       >
// //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //         </svg>
// //       </button>
      
// //       {/* Main Sidebar */}
// //       <aside 
// //         className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
// //                     w-64 overflow-y-auto overflow-x-hidden
// //                     ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
// //         data-theme={theme}
// //       >
// //         {/* Company Logo and Toggle Button */}
// //         <div className="flex items-center justify-between p-4">
// //           <div className={`transition-all duration-300 font-bold ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
// //             {isCollapsed ? 'HR' : 'HRMS'}
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             {/* Dark Mode Toggle Switch */}
// //             <label className="swap swap-rotate">
// //               <input 
// //                 type="checkbox" 
// //                 checked={theme === 'dark'}
// //                 onChange={toggleTheme}
// //                 className="hidden"
// //               />
// //               <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
// //                 <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
// //               </svg>
// //               <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
// //                 <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
// //               </svg>
// //             </label>
            
// //             {/* Close button (mobile only) */}
// //             <button 
// //               onClick={toggleMobileSidebar}
// //               className="md:hidden btn btn-ghost btn-square btn-sm text-white hover:text-blue-200"
// //               aria-label="Close mobile menu"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
        
// //         {/* Menu Items */}
// //         <ul className="menu menu-vertical bg-transparent w-full space-y-1 mt-4 flex-grow">
// //           {/* Dashboard */}
// //           <li>
// //             <Link 
// //               href="/" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
// //               </svg>
// //               {!isCollapsed && <span>Dashboard</span>}
// //             </Link>
// //           </li>

// //           {/* Announcement */}
// //           <li>
// //             <Link 
// //               href="/announcements" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/announcements') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
// //               </svg>
// //               {!isCollapsed && <span>Announcement</span>}
// //             </Link>
// //           </li>

// //           {/* Leave Management */}
// //           <li>
// //             <Link 
// //               href="/leaves" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/leaves') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //               </svg>
// //               {!isCollapsed && <span>Leave</span>}
// //             </Link>
// //           </li>

// //           {/* Attendance Management */}
// //           <li>
// //             <Link 
// //               href="/attendance" 
// //               className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                         ${isActive('/attendance') 
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //               onClick={handleMobileNavigation}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               {!isCollapsed && <span>Attendance</span>}
// //             </Link>
// //           </li>

// //           {/* Manage Company */}
// //           {role === 'admin' && (
// //           <li>
// //             <button 
// //               onClick={() => toggleMenu('manage-company')} 
// //               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                         ${pathname.startsWith('/companies') || pathname.startsWith('/company')
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //             >
// //               <div className="flex items-center">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
// //                 </svg>
// //                 <span>Company</span>
// //               </div>
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-company' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //               </svg>
// //             </button>
// //             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-company' ? 'block' : 'hidden'}`}>
// //               <li>
// //                 <Link 
// //                   href="/companies" 
// //                   className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/companies'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                   onClick={handleMobileNavigation}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                   </svg>
// //                   View Companies
// //                 </Link>
// //               </li>
// //               <li>
// //                 <Link 
// //                   href="/companies/add" 
// //                   className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/companies/add'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                   onClick={handleMobileNavigation}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                   </svg>
// //                   Add Company
// //                 </Link>
// //               </li>
// //             </ul>
// //           </li>
// //           )}

// //           {/* Manage Employee */}
// //           {(role === 'admin' || role === 'manager') && (
// //             <li>
// //               <button 
// //                 onClick={() => toggleMenu('manage-employee')} 
// //                 className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                           ${pathname.startsWith('/employees') || pathname.startsWith('/employee')
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //               >
// //                 <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
// //                   </svg>
// //                   <span>Employee</span>
// //                 </div>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-employee' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-employee' ? 'block' : 'hidden'}`}>
// //                 <li>
// //                   <Link 
// //                     href="/employees" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/employees'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                     </svg>
// //                     View Employee
// //                   </Link>
// //                 </li>
// //                 {role === 'admin' && (
// //                   <li>
// //                     <Link 
// //                       href="/employees/add" 
// //                       className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                               ${pathname === '/employees/add'
// //                                 ? 'bg-blue-500 text-white font-semibold' 
// //                                 : 'hover:bg-blue-500'}`}
// //                       onClick={handleMobileNavigation}
// //                     >
// //                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
// //                       </svg>
// //                       Add New Employee
// //                     </Link>
// //                   </li>
// //                 )}
// //               </ul>
// //             </li>
// //           )}

// //           {/* Manage Admin */}
// //           {role === 'admin' && (
// //             <li>
// //             <button 
// //               onClick={() => toggleMenu('manage-admin')} 
// //               className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 
// //                         ${pathname.startsWith('/admins') || pathname.startsWith('/admin')
// //                           ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                           : 'hover:bg-blue-500'}`}
// //             >
// //               <div className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// //                   </svg>
// //                 <span>Admin</span>
// //               </div>
// //               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${lastOpenedMenu === 'manage-admin' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //               </svg>  
// //             </button>
// //             <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === 'manage-admin' ? 'block' : 'hidden'}`}>
// //               <li>
// //                 <Link 
// //                   href="/admins" 
// //                   className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                           ${pathname === '/admins'
// //                             ? 'bg-blue-500 text-white font-semibold' 
// //                             : 'hover:bg-blue-500'}`}
// //                   onClick={handleMobileNavigation}
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                   </svg>
// //                   View Admin
// //                 </Link>
// //               </li>
// //                 <li>
// //                   <Link 
// //                     href="/admins/add" 
// //                     className={`py-2 px-4 rounded-lg transition-all duration-300 
// //                             ${pathname === '/admins/add'
// //                               ? 'bg-blue-500 text-white font-semibold' 
// //                               : 'hover:bg-blue-500'}`}
// //                     onClick={handleMobileNavigation}
// //                   >
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
// //                     </svg>
// //                     Add New Admin
// //                   </Link>
// //                 </li>
// //                 <li>
// //               <Link 
// //                 href="/admin-settings" 
// //                 className={`${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-300 
// //                           ${isActive('/admin-settings') 
// //                             ? 'bg-blue-600 text-white font-semibold shadow-md' 
// //                             : 'hover:bg-blue-500'}`}
// //                 onClick={handleMobileNavigation}
// //               >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                 </svg>
// //                 {!isCollapsed && <span>Admin Settings</span>}
// //               </Link>
// //             </li>
// //             </ul>
// //           </li>
// //           )}
// //         </ul>
// //         {/* Footer Controls */}
// //         <div className={`mt-auto p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
// //           {/* Change Password Button */}
// //           <button 
// //             onClick={() => setIsPasswordModalOpen(true)} 
// //             className={`btn btn-primary ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
// //             aria-label="Change Password"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
// //             </svg>
// //             {!isCollapsed && <span>Change Password</span>}
// //           </button>
          
// //           {/* Logout Button */}
// //           <button 
// //             onClick={handleLogout} 
// //             className={`btn btn-error ${isCollapsed ? 'btn-circle' : 'w-full gap-2'} mb-4`}
// //             aria-label="Logout"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
// //             </svg>
// //             {!isCollapsed && <span>Logout</span>}
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Password Change Modal */}
// //       <PasswordChangeModal 
// //         isOpen={isPasswordModalOpen} 
// //         onClose={() => setIsPasswordModalOpen(false)} 
// //       />
// //     </>
// //   );
// // } 
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useRouter, usePathname } from "next/navigation";
import PasswordChangeModal from "./PasswordChangeModal";

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<string>("");
  const [lastOpenedMenu, setLastOpenedMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  // compact submenu open/close tracking (for nested payroll sections)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // ---------- helpers ----------
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleMenu = (menuId: string) => {
    if (lastOpenedMenu === menuId) {
      setLastOpenedMenu(null);
      localStorage.removeItem("lastOpenedMenu");
    } else {
      setLastOpenedMenu(menuId);
      localStorage.setItem("lastOpenedMenu", menuId);
    }
  };

  const toggleSubmenu = (key: string) =>
    setOpenSubmenus((s) => ({ ...s, [key]: !s[key] }));

  const isPayrollRoute = (p: string) => {
    const payrollPrefixes = [
      // run
      "/admins/payrolls",
      // pay items
      "/master-data/allowances",
      "/master-data/deductions",
      // statutory & tax
      "/master-data/epf",
      "/master-data/socso",
      "/master-data/eis",
      "/master-data/pcb",
      "/master-data/reliefs",
      // configuration
      "/admins/payroll-config",
      "/admins/payroll-policy-assignment",
      "/admins/payroll-config-allowance",
      "/admins/payroll-config-deduction",
      "/admins/bank-currency",
      // overrides
      "/admins/employee-allowances",
      "/admins/employee-deductions",
      "/admins/employee-reliefs",
      // claims (paid via payroll)
      "/admins/claim",
    ];
    return payrollPrefixes.some((prefix) => p.startsWith(prefix));
  };

  const isFeedbackAdminRoute = (p: string) =>
    p.startsWith("/admins/feedbacks") ||
    p.startsWith("/admins/analytics") ||
    p.startsWith("/admins/pic-config") ||
    p.startsWith("/admins/settings");

  // Master Data items that are NOT payroll (avoid double highlight)
  const isStandaloneMasterDataRoute = (p: string) =>
    p.startsWith("/version-logs") ||
    p.startsWith("/admins/masters") ||
    // asset masters (kept under Master Data)
    p.startsWith("/admins/assets/locations") ||
    p.startsWith("/admins/assets/brands") ||
    p.startsWith("/admins/assets/models") ||
    p.startsWith("/admins/assets/types") ||
    p.startsWith("/admins/assets/statuses") ||
    p.startsWith("/admins/assets/units") ||
    p.startsWith("/admins/assets/categories") ||
    p.startsWith("/admins/assets/products") ||
    // anything in /master-data that is not a payroll route or disciplinary types
    (p.startsWith("/master-data") &&
      !isPayrollRoute(p) &&
      !p.startsWith("/master-data/disciplinary_types"));

  // Determine which parent menu should be opened for current route
  const getActiveParentMenu = () => {
    if (pathname.startsWith("/companies") || pathname.startsWith("/company"))
      return "manage-company";

    if (pathname.startsWith("/employees") || pathname.startsWith("/employee"))
      return "manage-employee";

    if (isPayrollRoute(pathname)) return "payroll-management";

    if (isFeedbackAdminRoute(pathname)) return "admin-panel";

    if (
      pathname.startsWith("/admins/scheduler") ||
      pathname.startsWith("/admins/schedules") ||
      pathname.startsWith("/admins/Test1")
    )
      return "scheduler";

    if (pathname === "/admins" || pathname.startsWith("/admins/add") || pathname.startsWith("/admin-settings"))
      return "manage-admin";

    if (
      pathname.startsWith("/admins/claims") ||
      pathname.startsWith("/admins/ApprovalFlow")
    )
      return "claim-management";

    if (pathname.startsWith("/feedback")) return "user-feedback";

    if (pathname.startsWith("/config/holiday")) return "config-management";

    if (isStandaloneMasterDataRoute(pathname)) return "master-data";

    if (
      pathname.startsWith("/assets") ||
      pathname.startsWith("/my-assets") ||
      pathname.startsWith("/admins/assets") ||
      pathname.startsWith("/admin/assets")
    )
      return "asset-management";

    return null;
  };

  // ---------- lifecycle ----------
  useEffect(() => {
    const user = localStorage.getItem("hrms_user");
    if (user) {
      const userData = JSON.parse(user);
      setRole(userData.role);
    }

    const last = localStorage.getItem("lastOpenedMenu");
    setLastOpenedMenu(last);

    // Force expanded (no collapsed mode)
    setIsCollapsed(false);
    localStorage.removeItem("sidebar_collapsed");
    onCollapseChange?.(false);

    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();

    // open proper parent on route change
    const parent = getActiveParentMenu();
    if (parent && last !== parent) {
      setLastOpenedMenu(parent);
      localStorage.setItem("lastOpenedMenu", parent);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCollapseChange, pathname]);

  // ---------- actions ----------
  const toggleMobileSidebar = () => setIsMobileOpen((v) => !v);

  const handleMobileNavigation = () => {
    if (isMobileView || window.innerWidth < 768) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("hrms_user");
    localStorage.removeItem("hrms_authenticated");
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_refresh_token");
    localStorage.removeItem("viewedAnnouncements");
    localStorage.removeItem("hrms_role");
    router.push("/auth/login");
  };

  const MobileBackdrop = () => (
    <div
      className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${
        isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleMobileSidebar}
    />
  );

  // small utility to make icons consistently legible
  const iconCls = "h-5 w-5 mr-3 opacity-90 text-white"; // consistent brightness
  const caretCls = (open: boolean) =>
    `h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

  // ---------- render ----------
  return (
    <>
      <MobileBackdrop />

      {/* Mobile menu FAB */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-30 md:hidden btn btn-primary btn-circle shadow-lg"
        aria-label="Toggle mobile menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-400 to-indigo-900 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
                    w-64 overflow-y-auto overflow-x-hidden
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        data-theme={theme}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className={`transition-all duration-300 font-bold ${isCollapsed ? "text-xl" : "text-2xl"}`}>
            {isCollapsed ? "HR" : "HRMS"}
          </div>

          <div className="flex items-center gap-2">
            {/* Dark / Light toggle */}
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                aria-label="Toggle dark mode"
                className="hidden"
              />
              {/* moon (dark on) */}
              <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
              </svg>
              {/* sun (light on) */}
              <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5Z" />
              </svg>
            </label>

            {/* Close (mobile) */}
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden btn btn-ghost btn-square btn-sm text-white hover:text-blue-200"
              aria-label="Close mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <ul className="menu menu-vertical bg-transparent w-full space-y-1 mt-4 flex-grow">
          {/* Dashboard */}
          <li>
            <Link
              href="/"
              className={`${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-lg transition-all duration-300 ${
                isActive("/") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${iconCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-7 9 7M5 10v10h14V10" />
              </svg>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Announcement */}
          <li>
            <Link
              href="/announcements"
              className={`${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-lg transition-all duration-300 ${
                isActive("/announcements") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${iconCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5v10l-3-2H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
              </svg>
              {!isCollapsed && <span>Announcement</span>}
            </Link>
          </li>

          {/* Leave */}
          <li>
            <Link
              href="/leaves"
              className={`${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-lg transition-all duration-300 ${
                isActive("/leaves") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${iconCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14" />
              </svg>
              {!isCollapsed && <span>Leave</span>}
            </Link>
          </li>

          {/* Attendance */}
          <li>
            <Link
              href="/attendance"
              className={`${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-lg transition-all duration-300 ${
                isActive("/attendance") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
              }`}
              onClick={handleMobileNavigation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${iconCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 4a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
              {!isCollapsed && <span>Attendance</span>}
            </Link>
          </li>

          {/* Company (Admin) */}
          {role === "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("manage-company")}
                aria-expanded={lastOpenedMenu === "manage-company"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/companies") || pathname.startsWith("/company")
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16" />
                  </svg>
                  <span>Company</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-company")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-company" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/companies"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/companies" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    View Companies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies/add"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/companies/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Add Company
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Employee (Admin/Manager/Employee) */}
{(role === "admin" || role === "manager" || role === "employee") && (
  <li>
    <button
      onClick={() => toggleMenu("manage-employee")}
      aria-expanded={lastOpenedMenu === "manage-employee"}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/employees") || pathname.startsWith("/employee")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
        </svg>
        <span>
          {role === "employee" ? "My Profile" : "Employee"}
        </span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-employee")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-employee" ? "block" : "hidden"}`}>
      <li>
        <Link
          href="/employees"
          className={`py-2 px-4 rounded-lg transition-all duration-300 ${
            pathname === "/employees" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
          }`}
          onClick={handleMobileNavigation}
        >
          {role === "employee" ? "View My Profile" : "View Employee"}
        </Link>
      </li>

      {/* Only show "Add New Employee" for admin */}
      {role === "admin" && (
        <li>
          <Link
            href="/employees/add"
            className={`py-2 px-4 rounded-lg transition-all duration-300 ${
              pathname === "/employees/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
            }`}
            onClick={handleMobileNavigation}
          >
            Add New Employee
          </Link>
        </li>
      )}

      {/* Disciplinary types - only for admin */}
      {role === "admin" && (
        <li>
          <Link
            href="/master-data/disciplinary_types"
            className={`py-2 px-4 rounded-lg transition-all duration-300 ${
              pathname === "/master-data/disciplinary_types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
            }`}
            onClick={handleMobileNavigation}
          >
            Disciplinary Types
          </Link>
        </li>
      )}
    </ul>
  </li>
)}


          {/* Scheduler (Admin) */}
{role === "admin" && (
  <li>
    <Link
      href="/admins/schedules"
      onClick={handleMobileNavigation}
      className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
        pathname.startsWith("/admins/scheduler") ||
        pathname.startsWith("/admins/schedules") ||
        pathname.startsWith("/admins/Test1")
          ? "bg-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconCls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14" />
        </svg>
      <span>Scheduler</span>
      </div>
    </Link>
  </li>
)}

          {/* Asset Management (shared) */}
          <li>
            <button
              onClick={() => toggleMenu("asset-management")}
              aria-expanded={lastOpenedMenu === "asset-management"}
              className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                (pathname.startsWith("/admins/assets") ||
                  pathname.startsWith("/admin/assets") ||
                  pathname.startsWith("/assets") ||
                  pathname.startsWith("/my-assets")) &&
                !pathname.startsWith("/admins/assets/locations") &&
                !pathname.startsWith("/admins/assets/brands") &&
                !pathname.startsWith("/admins/assets/models") &&
                !pathname.startsWith("/admins/assets/types") &&
                !pathname.startsWith("/admins/assets/statuses") &&
                !pathname.startsWith("/admins/assets/units") &&
                !pathname.startsWith("/admins/assets/categories") &&
                !pathname.startsWith("/admins/assets/products")
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-blue-500"
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8 6l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Asset Management</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "asset-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "asset-management" ? "block" : "hidden"}`}>
              {(role === "admin" || role === "manager") && (
                <>
                  <li>
                    <Link
                      href="/admins/assets"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/admins/assets" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      All Assets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admins/assets/alerts"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/admins/assets/alerts" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      Asset Alerts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admins/assets/reports"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/admins/assets/reports" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      Reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admins/assets/approval"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/admins/assets/approval" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      Asset Requests
                    </Link>
                  </li>
                </>
              )}

              {role !== "admin" && role !== "manager" && (
                <>
                  <li>
                    <Link
                      href="/assets"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/assets" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      My Asset Requests
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/assets/add"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/assets/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      Request New Asset
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/my-assets"
                      className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                        pathname === "/my-assets" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                      }`}
                      onClick={handleMobileNavigation}
                    >
                      Assets Assigned To Me
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>

          {/* Feedback Management (Admin) */}
          {role === "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("admin-panel")}
                aria-expanded={lastOpenedMenu === "admin-panel"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  isFeedbackAdminRoute(pathname)
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5" />
                  </svg>
                  <span>Feedback Management</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "admin-panel")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "admin-panel" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/admins/feedbacks"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/feedbacks" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    All Feedbacks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/analytics"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/analytics" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/pic-config"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/pic-config" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    PIC Configuration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/settings"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/settings" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    System Settings
                  </Link>
                </li>
              </ul>
            </li>
          )}

        {/* Payslips (Staff) */}
        <li>
          <Link
            href="/payslips"
            className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
              pathname.startsWith("/payslips") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
            }`}
            onClick={handleMobileNavigation}
          >
            <div className="flex items-center">
              {/* Document/receipt icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3v5h5M9 12h6m-6 4h6M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <span>Payslips</span>
            </div>
          </Link>
        </li>

          {/* Feedback (Staff) */}
          {role !== "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("user-feedback")}
                aria-expanded={lastOpenedMenu === "user-feedback"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/feedback") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5" />
                  </svg>
                  <span>Feedback</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "user-feedback")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "user-feedback" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/feedback"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/feedback" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    New Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback/my-feedbacks"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/feedback/my-feedbacks" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    My Feedbacks
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* PAYROLL (Admin/Manager) */}
          {(role === "admin") && (
            <li>
              <button
                onClick={() => toggleMenu("payroll-management")}
                aria-expanded={lastOpenedMenu === "payroll-management"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  isPayrollRoute(pathname) ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                  </svg>
                  <span>Payroll</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "payroll-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "payroll-management" ? "block" : "hidden"}`}>
                {/* Run */}
                <li>
                  <Link
                    href="/admins/payrolls"
                    className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      pathname === "/admins/payrolls" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2m0-8V7m0 10v2" />
                    </svg>
                    Payroll Run
                  </Link>
                </li>

                {/* Setup label */}
                <li className="mt-2 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Setup</li>

                {/* Pay Items */}
                <li>
                  <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-payitems")}>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
                      </svg>
                      Pay Items
                    </span>
                  </button>
                  <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-payitems"] ? "block" : "hidden"}`}>
                    <li>
                      <Link
                        href="/master-data/allowances"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/allowances" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                          Allowances
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/master-data/deductions"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/deductions" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                          </svg>
                          Deductions
                        </span>
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Statutory & Tax */}
                <li>
                  <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-statutory")}>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 21V10m10 11V10" />
                      </svg>
                      Statutory &amp; Tax
                    </span>
                  </button>
                  <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-statutory"] ? "block" : "hidden"}`}>
                    <li>
                      <Link
                        href="/master-data/epf"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/epf" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        EPF
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/master-data/socso"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/socso" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        SOCSO
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/master-data/eis"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/eis" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        EIS
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/master-data/pcb"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/pcb" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        PCB
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/master-data/reliefs"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/master-data/reliefs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Tax Reliefs
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Configuration */}
                <li>
                  <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-config")}>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h12M4 17h8" />
                      </svg>
                      Configuration
                    </span>
                  </button>
                  <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-config"] ? "block" : "hidden"}`}>
                    <li>
                      <Link
                        href="/admins/payroll-config-allowance"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/payroll-config-allowance" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Allowance Mapping
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/payroll-config-deduction"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/payroll-config-deduction" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Deduction Mapping
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/payroll-config"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/payroll-config" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Payroll Config
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/payroll-policy-assignment"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/payroll-policy-assignment" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Payroll Policy Assignment
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/bank-currency"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname.startsWith("/admins/bank-currency") ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Bank &amp; Currency
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Employee Overrides */}
                <li>
                  <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-overrides")}>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Employee Overrides
                    </span>
                  </button>
                  <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-overrides"] ? "block" : "hidden"}`}>
                    <li>
                      <Link
                        href="/admins/employee-allowances"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/employee-allowances" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Employee Allowances
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/employee-deductions"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/employee-deductions" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Employee Deductions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admins/employee-reliefs"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/employee-reliefs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Employee Reliefs
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Claims (paid via payroll) */}
                <li>
                  <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-500" onClick={() => toggleSubmenu("payroll-setup-claims")}>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 0110 0v3a5 5 0 01-10 0v-3z" />
                      </svg>
                      Claims
                    </span>
                  </button>
                  <ul className={`menu menu-compact pl-6 ${openSubmenus["payroll-setup-claims"] ? "block" : "hidden"}`}>
                    <li>
                      <Link
                        href="/admins/claim"
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          pathname === "/admins/claim" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                        }`}
                        onClick={handleMobileNavigation}
                      >
                        Claim Benefit
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          )}

          {/* My Claims (Staff) */}
          {role !== "admin" && (
            <li>
              <Link
                href="/claims"
                className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 ${
                  pathname === "/claims" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                }`}
                onClick={handleMobileNavigation}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                My Claims
              </Link>
            </li>
          )}

          {/* Claim Management (Admin/Manager) */}
          {(role === "admin") && (
            <li>
              <button
                onClick={() => toggleMenu("claim-management")}
                aria-expanded={lastOpenedMenu === "claim-management"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/admins/claims") || pathname.startsWith("/admins/ApprovalFlow")
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 13v-3a8 8 0 10-16 0v3" />
                  </svg>
                  <span>Claim Management</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "claim-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "claim-management" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/admins/claims"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/claims" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    All Claims
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/admins/ApprovalFlow"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/ApprovalFlow" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Approval Flow Configuration
                  </Link>
                </li> */}
              </ul>
            </li>
          )}

          {/* Master Data (no payroll items) */}
          {role === "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("master-data")}
                aria-expanded={lastOpenedMenu === "master-data"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  isStandaloneMasterDataRoute(pathname)
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>Master Data</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "master-data")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "master-data" ? "block" : "hidden"}`}>
                {/* Feedback System masters */}
                <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Feedback System</li>
                <li>
                  <Link
                    href="/admins/masters/sections"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/masters/sections" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Departments/Sections
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/masters/categories"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/masters/categories" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Feedback Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/masters/feedback-types"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/masters/feedback-types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Feedback Types
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/masters/priority-levels"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/masters/priority-levels" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Priority Levels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/masters/status"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/masters/status" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Status Types
                  </Link>
                </li>

                {/* Asset masters (under Master Data) */}
                <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">Asset Management</li>
                <li>
                  <Link
                    href="/admins/assets/locations"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/locations" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Locations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/brands"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/brands" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Brands
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/models"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/models" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Models
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/types"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/types" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Types
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/statuses"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/statuses" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Statuses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/units"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/units" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Units
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/categories"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/categories" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/assets/products"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/assets/products" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Products
                  </Link>
                </li>

                {/* System */}
                <li className="mt-4 mb-1 pl-2 text-xs font-semibold text-blue-200 uppercase">System</li>
                <li>
                  <Link
                    href="/version-logs"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/version-logs" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Version Logs
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Configuration (Public Holidays) */}
          {role === "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("config-management")}
                aria-expanded={lastOpenedMenu === "config-management"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/config/holiday")
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h4m-7 8h10M5 21h14" />
                  </svg>
                  <span>Configuration</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "config-management")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "config-management" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/config/holiday"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/config/holiday" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Public Holidays
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Admin (user management) */}
          {role === "admin" && (
            <li>
              <button
                onClick={() => toggleMenu("manage-admin")}
                aria-expanded={lastOpenedMenu === "manage-admin"}
                className={`w-full flex items-center py-3 px-4 justify-between rounded-lg transition-all duration-300 ${
                  pathname === "/admins" || pathname === "/admins/add" || pathname.startsWith("/admin-settings")
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Admin</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={caretCls(lastOpenedMenu === "manage-admin")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className={`menu menu-compact pl-8 ${lastOpenedMenu === "manage-admin" ? "block" : "hidden"}`}>
                <li>
                  <Link
                    href="/admins"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    View Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admins/add"
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      pathname === "/admins/add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    Add New Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin-settings"
                    className={`${isCollapsed ? "justify-center" : "px-4"} py-3 rounded-lg transition-all duration-300 ${
                      isActive("/admin-settings") ? "bg-blue-600 text-white font-semibold shadow-md" : "hover:bg-blue-500"
                    }`}
                    onClick={handleMobileNavigation}
                  >
                    {!isCollapsed && <span>Admin Settings</span>}
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>

        {/* Footer actions */}
        <div className={`mt-auto p-4 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className={`btn btn-primary ${isCollapsed ? "btn-circle" : "w-full gap-2"} mb-4`}
            aria-label="Change Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-5 3h10v6H7v-6z" />
            </svg>
            {!isCollapsed && <span>Change Password</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`btn btn-error ${isCollapsed ? "btn-circle" : "w-full gap-2"} mb-4`}
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4-4-4M7 16v1a3 3 0 01-3 3h0" />
            </svg>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Required props for modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}

