'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { theme } = useTheme();
  
  // Don't show sidebar on login page
  const isLoginPage = pathname === '/auth/login';
  
  useEffect(() => {
    // Check if sidebar is collapsed from localStorage
    const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    setIsCollapsed(collapsed);
    
    // Check if we're in mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);
    
    // Listen for sidebar collapse/expand events
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
      setIsCollapsed(collapsed);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for sidebar state changes within the same window
    const handleSidebarChange = (e: CustomEvent<{collapsed: boolean}>) => {
      setIsCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarStateChange', handleSidebarChange as EventListener);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarStateChange', handleSidebarChange as EventListener);
    };
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`} data-theme={theme}>
      <div className="flex min-h-screen">
        {!isLoginPage && <Sidebar onCollapseChange={setIsCollapsed} />}
        <main 
          className={`flex-1 p-4 md:p-10 transition-all duration-300 
                    ${!isLoginPage ? (isCollapsed ? 'ml-0 md:ml-[4.5rem]' : 'ml-0 md:ml-64') : ''} 
                    overflow-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
} 

// // // //NEW 

// 'use client';

// import { ReactNode, useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import Sidebar from '../components/sidebar/Sidebar';
// import { useTheme } from './ThemeProvider';

// interface LayoutProps {
//   children: ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const pathname = usePathname();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(false);
//   const { theme } = useTheme();
  
//   // Don't show sidebar on login page
//   const isLoginPage = pathname === '/auth/login';
  
//   useEffect(() => {
//     // Check if sidebar is collapsed from localStorage
//     const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
//     setIsCollapsed(collapsed);
    
//     // Check if we're in mobile view
//     const checkMobileView = () => {
//       setIsMobileView(window.innerWidth < 768);
//       // Auto-collapse sidebar in mobile view
//       if (window.innerWidth < 768) {
//         setIsCollapsed(true);
//       }
//     };
    
//     // Initial check
//     checkMobileView();
    
//     // Add event listener for window resize
//     window.addEventListener('resize', checkMobileView);
    
//     // Listen for sidebar collapse/expand events
//     const handleStorageChange = () => {
//       const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
//       setIsCollapsed(collapsed);
//     };
    
//     window.addEventListener('storage', handleStorageChange);
    
//     // Custom event for sidebar state changes within the same window
//     const handleSidebarChange = (e: CustomEvent<{collapsed: boolean}>) => {
//       setIsCollapsed(e.detail.collapsed);
//     };
    
//     window.addEventListener('sidebarStateChange', handleSidebarChange as EventListener);
    
//     return () => {
//       window.removeEventListener('resize', checkMobileView);
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('sidebarStateChange', handleSidebarChange as EventListener);
//     };
//   }, []);
  
//   const handleCollapseChange = (collapsed: boolean) => {
//     setIsCollapsed(collapsed);
//     localStorage.setItem('sidebar_collapsed', String(collapsed));
    
//     // Dispatch custom event for other instances
//     window.dispatchEvent(new CustomEvent('sidebarStateChange', {
//       detail: { collapsed }
//     }));
//   };
  
//   return (
//     <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`} data-theme={theme}>
//       <div className="flex min-h-screen">
//         {!isLoginPage && (
//           <Sidebar 
//             onCollapseChange={handleCollapseChange}
//             isCollapsed={isCollapsed}
//           />
//         )}
//         <main 
//           className={`flex-1 p-4 md:p-10 transition-all duration-300 
//                     ${!isLoginPage ? (isCollapsed ? 'ml-0 md:ml-[2.5rem]' : 'ml-0 md:ml-20') : ''} 
//                     overflow-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}
//         >
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }