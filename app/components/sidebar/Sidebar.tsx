// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { usePathname } from 'next/navigation';
// // import { FiMenu, FiX, FiMoon, FiSun, FiLock, FiLogOut } from 'react-icons/fi';
// // import { sidebarMenu, type Role } from './SidebarConfig'; // Import Role type
// // import SidebarItem from './SidebarItem';

// // interface SidebarProps {
// //   onCollapseChange?: (collapsed: boolean) => void;
// // }
// // export default function Sidebar({ onCollapseChange }: SidebarProps) {
// //   const pathname = usePathname();
// //   const [isCollapsed, setIsCollapsed] = useState(false);
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [role, setRole] = useState<Role>('admin'); // Typed as Role
// //   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

// //   useEffect(() => {
// //     const savedMode = localStorage.getItem('darkMode') === 'true';
// //     setDarkMode(savedMode);
// //     document.documentElement.classList.toggle('dark', savedMode);

// //     const storedRole = (localStorage.getItem('hrms_role') as Role) || 'admin';
// //     setRole(storedRole);

// //     const resizeHandler = () => {
// //       if (window.innerWidth < 768) setIsMobileOpen(false);
// //     };
// //     window.addEventListener('resize', resizeHandler);
// //     return () => window.removeEventListener('resize', resizeHandler);
// //   }, []);

// //   const handleToggleTheme = () => {
// //     const nextMode = !darkMode;
// //     setDarkMode(nextMode);
// //     localStorage.setItem('darkMode', String(nextMode));
// //     document.documentElement.classList.toggle('dark', nextMode);
// //   };

// //   const handleCollapseToggle = () => {
// //     const newCollapsed = !isCollapsed;
// //     setIsCollapsed(newCollapsed);
// //     localStorage.setItem('sidebar_collapsed', String(newCollapsed));
// //     onCollapseChange?.(newCollapsed);
// //   };

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     window.location.href = '/auth/login';
// //   };

// //   return (
// //     <>
// //       <button
// //         className="fixed top-4 left-4 z-40 md:hidden p-2 bg-blue-500 text-white rounded-full shadow-lg"
// //         onClick={() => setIsMobileOpen(!isMobileOpen)}
// //       >
// //         {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
// //       </button>

// //       <aside
// //         className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
// //           ${isCollapsed ? 'w-20' : 'w-64'} overflow-y-auto overflow-x-hidden
// //           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
// //       >
// //         <div className="h-full flex flex-col">
// //           <div className="flex items-center justify-between p-4 border-b border-blue-500">
// //             {!isCollapsed && <div className="text-2xl font-bold">HRMS</div>}
// //             <div className="flex items-center gap-2">
// //               <button onClick={handleToggleTheme} className="p-2 rounded-full hover:bg-blue-500 transition">
// //                 {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
// //               </button>
// //               <button onClick={handleCollapseToggle} className="p-2 rounded-full hover:bg-blue-500 hidden md:block">
// //                 <FiMenu size={18} />
// //               </button>
// //             </div>
// //           </div>

// //           <nav className="flex-1 overflow-y-auto px-3 py-2">
// //             <ul className="flex flex-col space-y-1 mt-2 px-1">
// //               {sidebarMenu.map((item) => (
// //                 <SidebarItem
// //                   key={item.path}
// //                   item={item}
// //                   isCollapsed={isCollapsed}
// //                   role={role}
// //                 />
// //               ))}
// //             </ul>
// //           </nav>

// //           <div className="p-4 border-t border-blue-500 space-y-2">
// //             <button
// //               onClick={() => setIsPasswordModalOpen(true)}
// //               className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
// //             >
// //               <FiLock size={18} />
// //               {!isCollapsed && <span>Change Password</span>}
// //             </button>
// //             <button
// //               onClick={handleLogout}
// //               className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
// //             >
// //               <FiLogOut size={18} />
// //               {!isCollapsed && <span>Logout</span>}
// //             </button>
// //           </div>
// //         </div>
// //       </aside>

// //       {isMobileOpen && (
// //         <div
// //           className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden"
// //           onClick={() => setIsMobileOpen(false)}
// //         />
// //       )}
// //     </>
// //   );
// // }
// 'use client';

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { FiMenu, FiX, FiMoon, FiSun, FiLock, FiLogOut } from 'react-icons/fi';
// import { sidebarMenu, type Role } from './SidebarConfig';
// import SidebarItem from './SidebarItem';

// interface SidebarProps {
//   onCollapseChange?: (collapsed: boolean) => void;
//   children?: React.ReactNode;
// }

// export default function Sidebar({ onCollapseChange, children }: SidebarProps) {
//   const pathname = usePathname();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [role, setRole] = useState<Role>('admin');
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

//   useEffect(() => {
//     const savedMode = localStorage.getItem('darkMode') === 'true';
//     setDarkMode(savedMode);
//     document.documentElement.classList.toggle('dark', savedMode);

//     const storedRole = (localStorage.getItem('hrms_role') as Role) || 'admin';
//     setRole(storedRole);

//     const resizeHandler = () => {
//       if (window.innerWidth < 768) setIsMobileOpen(false);
//     };
//     window.addEventListener('resize', resizeHandler);
//     return () => window.removeEventListener('resize', resizeHandler);
//   }, []);

//   const handleToggleTheme = () => {
//     const nextMode = !darkMode;
//     setDarkMode(nextMode);
//     localStorage.setItem('darkMode', String(nextMode));
//     document.documentElement.classList.toggle('dark', nextMode);
//   };

//   const handleCollapseToggle = () => {
//     const newCollapsed = !isCollapsed;
//     setIsCollapsed(newCollapsed);
//     localStorage.setItem('sidebar_collapsed', String(newCollapsed));
//     onCollapseChange?.(newCollapsed);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/auth/login';
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Mobile menu button */}
//       <button
//         className="fixed top-4 left-4 z-40 md:hidden p-2 bg-blue-500 text-white rounded-full shadow-lg"
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//       >
//         {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-0 h-screen z-30 bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-800
//           ${isCollapsed ? 'w-20' : 'w-64'} 
//           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
//       >
//         <div className="h-full flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b border-blue-500">
//             {!isCollapsed && <div className="text-2xl font-bold">HRMS</div>}
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={handleToggleTheme} 
//                 className="p-2 rounded-full hover:bg-blue-500 transition"
//                 aria-label="Toggle dark mode"
//               >
//                 {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
//               </button>
//               <button 
//                 onClick={handleCollapseToggle} 
//                 className="p-2 rounded-full hover:bg-blue-500 hidden md:block"
//                 aria-label="Toggle sidebar"
//               >
//                 <FiMenu size={18} />
//               </button>
//             </div>
//           </div>

//           <nav className="flex-1 overflow-y-auto px-3 py-2">
//             <ul className="flex flex-col space-y-1 mt-2 px-1">
//               {sidebarMenu.map((item) => (
//                 <SidebarItem
//                   key={item.path}
//                   item={item}
//                   isCollapsed={isCollapsed}
//                   role={role}
//                   currentPath={pathname}
//                 />
//               ))}
//             </ul>
//           </nav>

//           <div className="p-4 border-t border-blue-500 space-y-2">
//             <button
//               onClick={() => setIsPasswordModalOpen(true)}
//               className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
//             >
//               <FiLock size={18} />
//               {!isCollapsed && <span>Change Password</span>}
//             </button>
//             <button
//               onClick={handleLogout}
//               className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
//             >
//               <FiLogOut size={18} />
//               {!isCollapsed && <span>Logout</span>}
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Overlay for mobile */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Main content area */}
//       <main 
//         className={`flex-1 transition-all duration-300 ${
//           isCollapsed ? 'md:ml-20' : 'md:ml-64'
//         }`}
//       >
//         <div className="max-w-full mx-auto p-4 md:p-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
//             {children}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// app/components/sidebar/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiMoon, FiSun, FiLock, FiLogOut } from 'react-icons/fi';
import { sidebarMenu, getFilteredMenu, Role } from './SidebarConfig';
import SidebarItem from './SidebarItem';
import { useTheme } from '../ThemeProvider'; // <-- import shared hook
import ChangePasswordModal from '../PasswordChangeModal.tsx'; 



interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
  children?: React.ReactNode;
}

export default function Sidebar({ onCollapseChange, isCollapsed, children }: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = typeof isCollapsed === 'boolean' ? isCollapsed : internalCollapsed;

  const { theme, toggleTheme } = useTheme(); 
  const isDark = theme === 'dark';

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [role, setRole] = useState<Role>('admin');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    const storedRole = (localStorage.getItem('hrms_role') as Role) || 'admin';

    setInternalCollapsed(savedCollapsed);
    setRole(storedRole);

    const resizeHandler = () => {
      if (window.innerWidth < 768) setIsMobileOpen(false);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  const handleCollapseToggle = () => {
    const newCollapsed = !collapsed;
    localStorage.setItem('sidebar_collapsed', String(newCollapsed));
    if (!isCollapsed) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapseChange?.(newCollapsed);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  const menuItems = getFilteredMenu(role);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-30 text-white flex flex-col shadow-lg transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDark ? 'bg-gray-800' : 'bg-gradient-to-b from-blue-600 to-blue-400'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-blue-500 dark:border-gray-700">
            {!collapsed && <div className="text-2xl font-bold">HRMS</div>}
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-blue-500 transition" aria-label="Toggle dark mode">
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button onClick={handleCollapseToggle} className="p-2 rounded-full hover:bg-blue-500 hidden md:block" aria-label="Toggle sidebar">
                <FiMenu size={18} />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-2">
            <ul className="flex flex-col space-y-1 mt-2 px-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isCollapsed={collapsed}
                  role={role}
                  currentPath={pathname}
                />
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-blue-500 dark:border-gray-700 space-y-2">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              <FiLock size={18} />
              {!collapsed && <span>Change Password</span>}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
            >
              <FiLogOut size={18} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 flex justify-center ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        
        {/* <div className="w-full max-w-6xl p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">{children}</div>
        </div> */}

     {isPasswordModalOpen && (
  <ChangePasswordModal 
    isOpen={isPasswordModalOpen} 
    onClose={() => setIsPasswordModalOpen(false)} 
  />
)}

      </main>

      
    </div>
  );
}


