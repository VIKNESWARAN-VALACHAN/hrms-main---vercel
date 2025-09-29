// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';

// interface User {
//   id: string;
//   name: string;
//   role: string;
// }

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Check for authenticated user on mount
//     const userStr = localStorage.getItem('hrms_user');
//     const isAuthenticated = localStorage.getItem('hrms_authenticated');

//     if (userStr && isAuthenticated === 'true') {
//       try {
//         const userData = JSON.parse(userStr);
//         setUser(userData);
//       } catch (e) {
//         console.error('Error parsing user data');
//         handleLogout();
//       }
//     }
//   }, []);

//   const isLinkActive = (path: string) => {
//     return pathname === path || pathname?.startsWith(`${path}/`);
//   };

//   const handleLogout = () => {
//     // Remove from both localStorage and cookies
//     localStorage.removeItem('hrms_user');
//     localStorage.removeItem('hrms_authenticated');
    
//     // Also remove cookies
//     Cookies.remove('hrms_user');
//     Cookies.remove('hrms_authenticated');
    
//     setUser(null);
//     router.push('/auth/login');
//   };

//   const isAdmin = user?.role === 'admin';

//   // If no user is logged in, don't show navbar
//   if (!user) return null;

//   return (
//     <div className="navbar bg-base-100 shadow-md">
//       <div className="navbar-start">
//         <div className="dropdown">
//           <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
//             </svg>
//           </div>
//           <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
//             {/* Mobile Menu Items */}
//             <li>
//               <Link href="/dashboard" className={isLinkActive('/dashboard') ? 'active' : ''}>
//                 Dashboard
//               </Link>
//             </li>
            
//             <li>
//               <Link href="/employees" className={isLinkActive('/employees') ? 'active' : ''}>
//                 Employees
//               </Link>
//             </li>
            
//             {isAdmin && (
//               <>
//                 <li>
//                   <Link href="/departments" className={isLinkActive('/departments') ? 'active' : ''}>
//                     Departments
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/companies" className={isLinkActive('/companies') ? 'active' : ''}>
//                     Companies
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/settings" className={isLinkActive('/settings') ? 'active' : ''}>
//                     Settings
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//         <Link href={isAdmin ? "/dashboard" : "/employees"} className="btn btn-ghost normal-case text-xl">HRMS</Link>
//       </div>
      
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1">
//           {/* Desktop Menu Items */}
//           <li>
//             <Link 
//               href="/dashboard" 
//               className={`mx-1 ${isLinkActive('/dashboard') ? 'bg-base-200' : ''}`}
//             >
//               Dashboard
//             </Link>
//           </li>
          
//           <li>
//             <Link 
//               href="/employees" 
//               className={`mx-1 ${isLinkActive('/employees') ? 'bg-base-200' : ''}`}
//             >
//               Employees
//             </Link>
//           </li>
          
//           {isAdmin && (
//             <>
//               <li>
//                 <Link 
//                   href="/departments" 
//                   className={`mx-1 ${isLinkActive('/departments') ? 'bg-base-200' : ''}`}
//                 >
//                   Departments
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   href="/companies" 
//                   className={`mx-1 ${isLinkActive('/companies') ? 'bg-base-200' : ''}`}
//                 >
//                   Companies
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   href="/settings" 
//                   className={`mx-1 ${isLinkActive('/settings') ? 'bg-base-200' : ''}`}
//                 >
//                   Settings
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
      
//       <div className="navbar-end">
//         <div className="dropdown dropdown-end">
//           <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
//             <div className="avatar placeholder">
//               <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
//                 <span>{user.name.charAt(0).toUpperCase()}</span>
//               </div>
//             </div>
//             <span className="hidden md:inline">{user.name}</span>
//             <span className="badge badge-sm">{user.role}</span>
//           </div>
          
//           <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//             <li>
//               <button onClick={handleLogout} className="text-error">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// } 